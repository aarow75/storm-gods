import { Component, ElementRef, HostListener, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_WILDERNESS_STATE,
  GRID_COLS,
  GRID_ROWS,
  HEX_SIZE,
  HexCoord,
  LANDMARK_ICONS,
  LandmarkIconType,
  TerrainType,
  WildernessMapState,
  WildernessToken,
  tileKey,
} from '@maps/models/wilderness-map.model';
import { TERRAIN_DEFINITIONS } from '@maps/constants/terrain.constants';
import { MAP_BACKGROUNDS } from '@maps/constants/map-backgrounds.constants';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { CharacterReadService } from '@shared/services/character-read.service';
import { EncounterLaunchService } from '@combat/services/encounter-launch.service';
import { DiceService } from '@shared/services/dice.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { ExportService } from '@shared/services/export.service';
import { Character } from '@characters/models/character.model';
import { dijkstra } from '@maps/utils/hex-pathfinding';
import { buildHexGrid, terrainFillColor, terrainStrokeColor } from '@maps/utils/hex-grid.util';
import { EncounterRollResult, rollEncounterForTerrain } from '@maps/utils/encounter-roll.util';
import { buildEncounterParticipants } from '@maps/utils/encounter-combat.util';

@Component({
  standalone: true,
  selector: 'app-wilderness-map',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './wilderness-map.component.html',
  styleUrl: './wilderness-map.component.css',
})
export class WildernessMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hexSvg', { read: ElementRef }) hexSvg!: ElementRef<SVGSVGElement>;

  state: WildernessMapState = { ...DEFAULT_WILDERNESS_STATE };
  characters: Character[] = [];
  Math = Math;

  readonly HEX_SIZE = HEX_SIZE;
  readonly terrainDefs = TERRAIN_DEFINITIONS;
  readonly mapBackgrounds = MAP_BACKGROUNDS;
  readonly landmarkIcons = LANDMARK_ICONS;

  showCustomTokenForm = false;
  newTokenForm: { name: string; iconType: LandmarkIconType | null; color: string } =
    { name: '', iconType: null, color: '#FF6B6B' };

  gridWidth = GRID_COLS;
  gridHeight = GRID_ROWS;
  scale = 6;
  scaleUnit: 'miles' | 'kilometers' = 'miles';

  interactionMode: 'paint' | 'move' = 'move';
  selectedTerrain: TerrainType = 'plains';
  selectedTokenId: string | null = null;
  isPainting = false;

  // Viewport state (persisted)
  viewZoom = 1;
  viewPanX = 0;
  viewPanY = 0;

  // Pan gesture transient state (not persisted)
  isPanning = false;
  panHasMoved = false;
  panStartX = 0;
  panStartY = 0;
  panStartViewX = 0;
  panStartViewY = 0;

  // Pinch gesture transient state (not persisted)
  lastTouchDist = 0;

  // Fullscreen and drawer UI state
  isFullscreen = false;
  isSidebarOpen = false;

  get viewTransform(): string {
    return `translate(${this.viewPanX}, ${this.viewPanY}) scale(${this.viewZoom})`;
  }

  hoveredHex: HexCoord | null = null;
  previewPath: HexCoord[] = [];
  previewPathSet = new Set<string>();
  previewCost = 0;

  encounterResult: (EncounterRollResult & { stoppedAt: HexCoord }) | null = null;

  mapMode: 'terrain' | 'image' = 'terrain';
  hexBorderOpacity = 1;
  terrainOpacity = 0.45;

  showAddMapModal = false;
  newMapForm = { label: '', width: 20, height: 20, scale: 6, scaleUnit: 'miles' as 'miles' | 'kilometers' };

  hexes: Array<{ q: number; r: number; cx: number; cy: number; points: string }> = [];

  svgOffsetX = HEX_SIZE;
  svgOffsetY = HEX_SIZE;
  svgWidth = 0;
  svgHeight = 0;

  private readonly onWheelBound = (e: WheelEvent) => this.onSvgWheel(e);
  private readonly onTouchStartBound = (e: TouchEvent) => this.onSvgTouchStart(e);
  private readonly onTouchMoveBound = (e: TouchEvent) => this.onSvgTouchMove(e);

  constructor(
    private wildernessService: WildernessMapService,
    private characterService: CharacterReadService,
    private encounterLaunchService: EncounterLaunchService,
    private diceService: DiceService,
    public gameSystemService: GameSystemService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.state = this.wildernessService.getState();
    this.characters = this.characterService.getAll();
    this.mapMode = this.state.mapMode ?? 'terrain';
    this.gridWidth = this.state.gridWidth ?? GRID_COLS;
    this.gridHeight = this.state.gridHeight ?? GRID_ROWS;
    this.scale = this.state.scale ?? 6;
    this.scaleUnit = this.state.scaleUnit ?? 'miles';
    this.hexBorderOpacity = this.state.hexBorderOpacity ?? 1;
    this.terrainOpacity = this.state.terrainOpacity ?? 0.45;
    this.viewZoom = this.state.viewZoom ?? 1;
    this.viewPanX = this.state.viewPanX ?? 0;
    this.viewPanY = this.state.viewPanY ?? 0;
    console.log('Loaded state from localStorage:', this.state);
    this.buildHexGrid();
    if (this.state.currentMapId) {
      this.loadMapData(this.state.currentMapId);
    }
    this.ensureMapDataSynced();
  }

  ngAfterViewInit(): void {
    const el = this.hexSvg.nativeElement;
    el.addEventListener('wheel', this.onWheelBound, { passive: false });
    el.addEventListener('touchstart', this.onTouchStartBound, { passive: false });
    el.addEventListener('touchmove', this.onTouchMoveBound, { passive: false });
  }

  ngOnDestroy(): void {
    const el = this.hexSvg?.nativeElement;
    if (el) {
      el.removeEventListener('wheel', this.onWheelBound);
      el.removeEventListener('touchstart', this.onTouchStartBound);
      el.removeEventListener('touchmove', this.onTouchMoveBound);
    }
    this.wildernessService.saveState(this.state);
  }

  private buildHexGrid(): void {
    const grid = buildHexGrid(this.gridWidth, this.gridHeight, HEX_SIZE);
    this.hexes = grid.hexes;
    this.svgWidth = grid.svgWidth;
    this.svgHeight = grid.svgHeight;
  }

  getTerrainAt(q: number, r: number): string {
    const key = `${q},${r}`;
    return this.state.tiles[key] ?? 'none';
  }

  getHexFill(q: number, r: number): string {
    return terrainFillColor(this.getTerrainAt(q, r) as TerrainType, this.mapMode, this.terrainOpacity);
  }

  getHexStroke(q: number, r: number): string {
    return terrainStrokeColor(this.getTerrainAt(q, r) as TerrainType, this.mapMode);
  }

  onHexPointerDown(q: number, r: number, event: PointerEvent): void {
    if (this.interactionMode !== 'paint') return;
    event.preventDefault();
    this.isPainting = true;
    this.paintHex(q, r);
  }

  onSvgPointerDown(event: PointerEvent): void {
    if (this.interactionMode !== 'move') return;
    this.isPanning = true;
    this.panHasMoved = false;
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panStartViewX = this.viewPanX;
    this.panStartViewY = this.viewPanY;
    (event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
  }

  onHexPointerEnter(q: number, r: number): void {
    if (this.interactionMode === 'paint' && this.isPainting) {
      this.paintHex(q, r);
    }
    if (this.interactionMode === 'move') {
      this.updatePathPreview(q, r);
    }
  }

  onSvgPointerMove(event: PointerEvent): void {
    if (this.isPanning) {
      const dx = event.clientX - this.panStartX;
      const dy = event.clientY - this.panStartY;
      this.viewPanX = this.panStartViewX + dx;
      this.viewPanY = this.panStartViewY + dy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        this.panHasMoved = true;
      }
      return;
    }

    if (!this.isPainting && this.interactionMode !== 'move') return;
    if (!this.hexSvg) return;

    const svg = this.hexSvg.nativeElement;
    const rect = svg.getBoundingClientRect();
    const x = (event.clientX - rect.left - this.viewPanX) / this.viewZoom;
    const y = (event.clientY - rect.top - this.viewPanY) / this.viewZoom;

    for (const hex of this.hexes) {
      const dx = x - (hex.cx + this.svgOffsetX);
      const dy = y - (hex.cy + this.svgOffsetY);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.HEX_SIZE) {
        if (this.isPainting && this.interactionMode === 'paint') {
          this.paintHex(hex.q, hex.r);
        }
        if (this.interactionMode === 'move') {
          this.updatePathPreview(hex.q, hex.r);
        }
        break;
      }
    }
  }

  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.isPainting) {
      this.isPainting = false;
      this.saveState();
    }
    if (this.isPanning) {
      this.isPanning = false;
      if (this.panHasMoved) {
        this.saveViewState();
      } else if (this.interactionMode === 'move') {
        this.handleMapClick(event.clientX, event.clientY);
      }
    }
  }

  private handleMapClick(clientX: number, clientY: number): void {
    const svg = this.hexSvg?.nativeElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = (clientX - rect.left - this.viewPanX) / this.viewZoom;
    const y = (clientY - rect.top - this.viewPanY) / this.viewZoom;

    for (const hex of this.hexes) {
      const dx = x - (hex.cx + this.svgOffsetX);
      const dy = y - (hex.cy + this.svgOffsetY);
      if (Math.sqrt(dx * dx + dy * dy) < this.HEX_SIZE) {
        this.onHexClick(hex.q, hex.r);
        return;
      }
    }
  }

  private paintHex(q: number, r: number): void {
    const key = tileKey(q, r);
    if (this.selectedTerrain === 'none') {
      delete this.state.tiles[key];
    } else {
      this.state.tiles[key] = this.selectedTerrain;
    }
  }

  private saveState(): void {
    this.saveMapData();
    this.wildernessService.saveState(this.state);
  }

  private isEncounterToken(token: WildernessToken): boolean {
    return token.name.toLowerCase().includes('encounter');
  }

  startCombatWithEncounter(): void {
    if (!this.encounterResult) return;

    const creatureName = this.encounterResult.creature;
    const result = buildEncounterParticipants(
      this.encounterResult,
      this.gameSystemService,
      () => this.encounterLaunchService.generateId()
    );

    this.encounterResult = null;

    if (!result.success) {
      if (result.reason === 'no-creatures') {
        alert('No creatures to encounter!');
      } else {
        alert(`Creature "${creatureName}" not found in bestiary`);
      }
      return;
    }

    this.encounterLaunchService.launchEncounter(result.participants);
  }

  onHexClick(q: number, r: number): void {
    if (this.interactionMode !== 'move') return;

    const clickedToken = this.getTokenAt(q, r);
    if (clickedToken) {
      this.selectedTokenId = clickedToken.id === this.selectedTokenId ? null : clickedToken.id;
      this.encounterResult = null;
      return;
    }

    if (!this.selectedTokenId) return;

    const token = this.state.tokens.find((t) => t.id === this.selectedTokenId);
    if (token) {
      if (!token.position) {
        token.position = { q, r };
        this.encounterResult = null;
      } else {
        const result = dijkstra(
          token.position,
          { q, r },
          (tq, tr) => (this.state.tiles[tileKey(tq, tr)] ?? 'none') as TerrainType,
          this.gridWidth,
          this.gridHeight
        );
        const path = result?.path ?? [{ q, r }];

        // Find first encounter token on the path
        const encounterHexIdx = path.findIndex((h) =>
          this.state.tokens.some(
            (t) =>
              t.id !== token.id &&
              this.isEncounterToken(t) &&
              t.position?.q === h.q &&
              t.position?.r === h.r
          )
        );

        if (encounterHexIdx !== -1) {
          // Stop in the hex just before the encounter token (or at start if encounter is first hex)
          const stopHex = encounterHexIdx > 0 ? path[encounterHexIdx - 1] : token.position;
          token.position = stopHex;

          // Roll encounter based on terrain at the encounter hex
          const encHex = path[encounterHexIdx];
          const terrain = (this.state.tiles[tileKey(encHex.q, encHex.r)] ?? 'none') as TerrainType;
          const rollResult = rollEncounterForTerrain(terrain);
          if (rollResult) {
            this.encounterResult = { ...rollResult, stoppedAt: stopHex };
          } else {
            this.encounterResult = null;
          }
        } else {
          token.position = { q, r };
          this.encounterResult = null;
        }
      }
      this.saveState();
      this.selectedTokenId = null;
      this.previewPath = [];
      this.previewPathSet.clear();
    }
  }

  getTokenAt(q: number, r: number): WildernessToken | undefined {
    return this.state.tokens.find((t) => t.position?.q === q && t.position?.r === r);
  }

  get placedTokens(): WildernessToken[] {
    this.ensureMapDataSynced();
    return this.state.tokens.filter((t) => t.position !== undefined);
  }

  get customTokens(): WildernessToken[] {
    this.ensureMapDataSynced();
    return this.state.tokens.filter((t) => t.sourceType === 'custom');
  }

  get totalPaintedHexes(): number {
    return Object.keys(this.state.tiles).length;
  }

  get terrainCoverage(): Array<{ def: (typeof TERRAIN_DEFINITIONS)[0]; count: number; pct: number }> {
    const tiles = this.state.tiles;
    const total = Object.keys(tiles).length;
    if (total === 0) return [];
    const counts: Record<string, number> = {};
    for (const terrain of Object.values(tiles)) {
      counts[terrain] = (counts[terrain] ?? 0) + 1;
    }
    return TERRAIN_DEFINITIONS.filter((def) => def.id !== 'none' && counts[def.id])
      .map((def) => ({ def, count: counts[def.id] ?? 0, pct: Math.round(((counts[def.id] ?? 0) / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }

  getTokenCx(token: WildernessToken): number {
    if (!token.position) return 0;
    const S = HEX_SIZE;
    const sqrt3 = Math.sqrt(3);
    const { q, r } = token.position;
    return S * (sqrt3 * q + (sqrt3 / 2) * r);
  }

  getTokenCy(token: WildernessToken): number {
    if (!token.position) return 0;
    const S = HEX_SIZE;
    const { r } = token.position;
    return S * ((3 / 2) * r);
  }

  selectOrAddCharacterToken(char: Character): void {
    // Ensure state.tokens is properly synced to current map
    if (!this.state.currentMapId || this.state.tokens !== this.state.tokenMaps[this.state.currentMapId]) {
      if (this.state.currentMapId) {
        if (!this.state.tokenMaps[this.state.currentMapId]) {
          this.state.tokenMaps[this.state.currentMapId] = [];
        }
        this.state.tokens = this.state.tokenMaps[this.state.currentMapId];
      }
    }

    // Search only in current map's tokens
    let token = this.state.tokens.find((t) => t.characterId === char.id);
    if (!token) {
      // Create a completely new token for this character on this map
      token = {
        id: this.generateId(),
        name: char.name,
        color: char.color ?? '#888888',
        sourceType: 'character',
        characterId: char.id,
      };
      this.state.tokens.push(token);
      this.saveState();
    }
    this.selectedTokenId = token.id;
    this.interactionMode = 'move';
  }

  toggleCustomTokenForm(): void {
    this.showCustomTokenForm = !this.showCustomTokenForm;
    if (this.showCustomTokenForm) {
      this.newTokenForm = { name: '', iconType: null, color: '#FF6B6B' };
    }
  }

  onNewTokenIconSelect(iconType: LandmarkIconType | null): void {
    this.newTokenForm.iconType = iconType;
    if (iconType) {
      const def = LANDMARK_ICONS.find(i => i.id === iconType);
      if (def) this.newTokenForm.color = def.defaultColor;
    }
  }

  getTokenSymbol(token: WildernessToken): string {
    if (token.name.toLowerCase().includes('encounter')) return '⚠';
    if (token.iconType) {
      return LANDMARK_ICONS.find(i => i.id === token.iconType)?.symbol ?? token.name[0];
    }
    return token.name[0] ?? '?';
  }

  submitCustomToken(): void {
    const name = this.newTokenForm.name.trim();
    if (!name) return;

    if (this.state.currentMapId && this.state.tokens !== this.state.tokenMaps[this.state.currentMapId]) {
      if (!this.state.tokenMaps[this.state.currentMapId]) {
        this.state.tokenMaps[this.state.currentMapId] = [];
      }
      this.state.tokens = this.state.tokenMaps[this.state.currentMapId];
    }

    const token: WildernessToken = {
      id: this.generateId(),
      name,
      color: this.newTokenForm.color,
      sourceType: 'custom',
      ...(this.newTokenForm.iconType ? { iconType: this.newTokenForm.iconType } : {}),
    };
    this.state.tokens.push(token);
    this.saveState();
    this.selectedTokenId = token.id;
    this.interactionMode = 'move';
    this.showCustomTokenForm = false;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private updatePathPreview(q: number, r: number): void {
    if (!this.selectedTokenId) {
      this.previewPath = [];
      this.previewPathSet.clear();
      this.hoveredHex = { q, r };
      return;
    }

    const token = this.state.tokens.find((t) => t.id === this.selectedTokenId);
    if (!token?.position) {
      this.previewPath = [];
      this.previewPathSet.clear();
      this.hoveredHex = { q, r };
      return;
    }

    const result = dijkstra(
      token.position,
      { q, r },
      (tq, tr) => (this.state.tiles[tileKey(tq, tr)] ?? 'none') as TerrainType,
      this.gridWidth,
      this.gridHeight
    );

    this.hoveredHex = { q, r };

    if (result) {
      this.previewPath = result.path;
      this.previewCost = result.totalCost;
      this.previewPathSet = new Set(this.previewPath.map((h) => tileKey(h.q, h.r)));
    } else {
      this.previewPath = [];
      this.previewCost = 0;
      this.previewPathSet.clear();
    }
  }

  isPathPreview(q: number, r: number): boolean {
    return this.previewPathSet.has(tileKey(q, r));
  }

  exportCustomTokens(): void {
    const tokens = this.state.tokens.filter((t) => t.sourceType === 'custom');
    const mapLabel = this.state.currentMapId
      ? (this.state.customMaps.find((m) => m.id === this.state.currentMapId)?.label ??
        MAP_BACKGROUNDS.find((b) => b.id === this.state.currentMapId)?.label ??
        'map')
      : 'map';
    const filename = `tokens-${mapLabel.toLowerCase().replace(/\s+/g, '-')}`;
    this.exportService.download(filename, tokens);
  }

  importCustomTokens(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported: WildernessToken[] = JSON.parse(e.target?.result as string);
        const valid = imported.filter(
          (t) => t.id && t.name && t.color && t.sourceType === 'custom'
        );
        this.state.tokens = [...this.state.tokens.filter((t) => t.sourceType !== 'custom'), ...valid];
        if (this.state.currentMapId) {
          this.state.tokenMaps[this.state.currentMapId] = this.state.tokens;
        }
        this.saveState();
      } catch {
        alert('Invalid token file — could not parse JSON.');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  clearTerrain(): void {
    if (!confirm('Clear all terrain on this map?')) return;
    if (this.state.currentMapId) {
      this.state.terrainMaps[this.state.currentMapId] = {};
      this.state.tiles = this.state.terrainMaps[this.state.currentMapId];
    }
    this.saveState();
  }

  deleteToken(tokenId: string): void {
    this.state.tokens = this.state.tokens.filter((t) => t.id !== tokenId);
    if (this.selectedTokenId === tokenId) {
      this.selectedTokenId = null;
      this.previewPath = [];
      this.previewPathSet.clear();
    }
    this.saveState();
  }

  clearTokens(): void {
    if (!confirm('Remove all tokens on this map?')) return;
    if (this.state.currentMapId) {
      this.state.tokenMaps[this.state.currentMapId] = [];
      this.state.tokens = this.state.tokenMaps[this.state.currentMapId];
    }
    this.selectedTokenId = null;
    this.previewPath = [];
    this.previewPathSet.clear();
    this.saveState();
  }

  setMapMode(mode: 'terrain' | 'image'): void {
    this.mapMode = mode;
    this.state.mapMode = mode;
    this.saveState();
  }

  addMap(): void {
    const { label, width, height, scale, scaleUnit } = this.newMapForm;
    if (!label.trim()) return;
    const id = this.generateId();
    this.state.customMaps.push({ id, label: label.trim(), width, height, scale, scaleUnit });
    this.saveState();
    this.showAddMapModal = false;
    this.newMapForm = { label: '', width: 20, height: 20, scale: 6, scaleUnit: 'miles' };
    this.selectMap(id);
  }

  deleteCustomMap(id: string): void {
    if (!confirm('Delete this map and all its terrain?')) return;
    this.state.customMaps = this.state.customMaps.filter((m) => m.id !== id);
    delete this.state.terrainMaps[id];
    delete this.state.tokenMaps[id];
    if (this.state.currentMapId === id) {
      this.state.currentMapId = undefined;
      this.state.backgroundImage = undefined;
      this.state.tiles = {};
      this.state.tokens = [];
      this.selectedTokenId = null;
    }
    this.saveState();
  }

  onHexBorderOpacityChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.hexBorderOpacity = parseFloat(target.value);
    this.state.hexBorderOpacity = this.hexBorderOpacity;
    this.saveState();
  }

  onTerrainOpacityChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.terrainOpacity = parseFloat(target.value);
    this.state.terrainOpacity = this.terrainOpacity;
    this.saveState();
  }

  private loadMapData(mapId: string, terrainOverlay?: Record<string, TerrainType>): void {
    if (!this.state.terrainMaps[mapId]) {
      this.state.terrainMaps[mapId] = terrainOverlay ? { ...terrainOverlay } : {};
    }
    if (!this.state.tokenMaps[mapId]) {
      this.state.tokenMaps[mapId] = [];
    }
    this.state.tiles = this.state.terrainMaps[mapId];
    this.state.tokens = this.state.tokenMaps[mapId];
    this.selectedTokenId = null;
    this.showCustomTokenForm = false;
    this.previewPath = [];
    this.previewPathSet.clear();
  }

  private ensureMapDataSynced(): void {
    if (this.state.currentMapId) {
      if (!this.state.terrainMaps[this.state.currentMapId]) {
        this.state.terrainMaps[this.state.currentMapId] = {};
      }
      if (!this.state.tokenMaps[this.state.currentMapId]) {
        this.state.tokenMaps[this.state.currentMapId] = [];
      }
      this.state.tiles = this.state.terrainMaps[this.state.currentMapId];
      this.state.tokens = this.state.tokenMaps[this.state.currentMapId];
    }
  }

  private saveMapData(): void {
    if (this.state.currentMapId) {
      this.state.terrainMaps[this.state.currentMapId] = this.state.tiles;
      this.state.tokenMaps[this.state.currentMapId] = this.state.tokens;
    }
  }

  selectMap(id: string): void {
    console.log('Selecting map:', id);
    this.saveMapData();

    if (!id) {
      this.state.tiles = {};
      this.state.tokens = [];
      this.state.currentMapId = undefined;
      this.state.backgroundImage = undefined;
      this.selectedTokenId = null;
      this.previewPath = [];
      this.previewPathSet.clear();
    } else {
      const bg = MAP_BACKGROUNDS.find((b) => b.id === id);
      if (bg) {
        this.mapMode = 'image';
        this.state.backgroundImage = id;
        this.state.currentMapId = id;
        this.loadMapData(id, bg.terrainOverlay);
        this.setGridDimensions(bg.width, bg.height);
        this.setScale(bg.scale ?? 6, bg.scaleUnit ?? 'miles');
      } else {
        const customMap = this.state.customMaps.find((m) => m.id === id);
        if (customMap) {
          this.mapMode = 'terrain';
          this.state.currentMapId = id;
          this.state.backgroundImage = undefined;
          this.loadMapData(id);
          this.setGridDimensions(customMap.width, customMap.height);
          this.setScale(customMap.scale, customMap.scaleUnit);
        }
      }
    }

    this.saveState();
    console.log('State after save:', this.state);
  }

  onBackgroundImageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectMap(target.value);
  }

  setGridDimensions(width: number | Event, height: number | Event): void {
    let w = typeof width === 'number' ? width : this.gridWidth;
    let h = typeof height === 'number' ? height : this.gridHeight;

    if (width instanceof Event) {
      w = parseInt((width.target as HTMLInputElement).value, 10);
    }
    if (height instanceof Event) {
      h = parseInt((height.target as HTMLInputElement).value, 10);
    }

    if (w < 5 || h < 5 || w > 100 || h > 100) return;

    this.gridWidth = w;
    this.gridHeight = h;
    this.state.gridWidth = w;
    this.state.gridHeight = h;
    this.buildHexGrid();
    this.saveState();
  }

  getBackgroundImagePath(): string {
    if (!this.state.backgroundImage) return '';
    const bg = MAP_BACKGROUNDS.find((b) => b.id === this.state.backgroundImage);
    return bg?.imagePath ?? '';
  }

  setScale(value: number, unit: 'miles' | 'kilometers' = this.scaleUnit): void {
    if (value < 0.1 || value > 100) return;

    this.scale = value;
    this.scaleUnit = unit;
    this.state.scale = value;
    this.state.scaleUnit = unit;
    this.saveState();
  }

  onScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.setScale(value);
  }

  onScaleUnitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.setScale(this.scale, target.value as 'miles' | 'kilometers');
  }

  private onSvgWheel(event: WheelEvent): void {
    event.preventDefault();

    const svg = this.hexSvg.nativeElement;
    const rect = svg.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newZoom = Math.max(0.2, Math.min(8, this.viewZoom * factor));
    const scale = newZoom / this.viewZoom;

    this.viewPanX = mx + scale * (this.viewPanX - mx);
    this.viewPanY = my + scale * (this.viewPanY - my);
    this.viewZoom = newZoom;

    this.saveViewState();
  }

  private onSvgTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 2) return;
    event.preventDefault();
    const t0 = event.touches[0];
    const t1 = event.touches[1];
    this.lastTouchDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
  }

  private onSvgTouchMove(event: TouchEvent): void {
    if (event.touches.length !== 2) return;
    event.preventDefault();

    const t0 = event.touches[0];
    const t1 = event.touches[1];
    const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
    if (this.lastTouchDist === 0) {
      this.lastTouchDist = dist;
      return;
    }

    const svg = this.hexSvg.nativeElement;
    const rect = svg.getBoundingClientRect();
    const mx = ((t0.clientX + t1.clientX) / 2) - rect.left;
    const my = ((t0.clientY + t1.clientY) / 2) - rect.top;

    const factor = dist / this.lastTouchDist;
    const newZoom = Math.max(0.2, Math.min(8, this.viewZoom * factor));
    const scale = newZoom / this.viewZoom;

    this.viewPanX = mx + scale * (this.viewPanX - mx);
    this.viewPanY = my + scale * (this.viewPanY - my);
    this.viewZoom = newZoom;

    this.lastTouchDist = dist;

    this.saveViewState();
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    if (!this.isFullscreen) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  resetView(): void {
    this.viewZoom = 1;
    this.viewPanX = 0;
    this.viewPanY = 0;
    this.saveViewState();
  }

  private saveViewState(): void {
    this.state.viewZoom = this.viewZoom;
    this.state.viewPanX = this.viewPanX;
    this.state.viewPanY = this.viewPanY;
    this.wildernessService.saveState(this.state);
  }
}
