import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_WILDERNESS_STATE,
  GRID_COLS,
  GRID_ROWS,
  HEX_SIZE,
  HexCoord,
  TerrainType,
  WildernessMapState,
  WildernessToken,
  tileKey,
} from '../../models/wilderness-map.model';
import { TERRAIN_DEFINITIONS } from '../../constants/terrain.constants';
import { MAP_BACKGROUNDS } from '../../constants/map-backgrounds.constants';
import { WildernessMapService } from '../../services/wilderness-map.service';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../models/character.model';
import { dijkstra } from '../../utils/hex-pathfinding';

@Component({
  standalone: true,
  selector: 'app-wilderness-map',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './wilderness-map.component.html',
  styleUrl: './wilderness-map.component.css',
})
export class WildernessMapComponent implements OnInit, OnDestroy {
  @ViewChild('hexSvg', { read: ElementRef }) hexSvg!: ElementRef<SVGSVGElement>;

  state: WildernessMapState = { ...DEFAULT_WILDERNESS_STATE };
  characters: Character[] = [];
  Math = Math;

  readonly HEX_SIZE = HEX_SIZE;
  readonly terrainDefs = TERRAIN_DEFINITIONS;
  readonly mapBackgrounds = MAP_BACKGROUNDS;

  gridWidth = GRID_COLS;
  gridHeight = GRID_ROWS;
  scale = 6;
  scaleUnit: 'miles' | 'kilometers' = 'miles';

  interactionMode: 'paint' | 'move' = 'paint';
  selectedTerrain: TerrainType = 'plains';
  selectedTokenId: string | null = null;
  isPainting = false;

  hoveredHex: HexCoord | null = null;
  previewPath: HexCoord[] = [];
  previewPathSet = new Set<string>();
  previewCost = 0;

  mapMode: 'terrain' | 'image' = 'terrain';
  showTerrainOverlay = false;
  hexBorderOpacity = 1;

  showAddMapModal = false;
  newMapForm = { label: '', width: 20, height: 20, scale: 6, scaleUnit: 'miles' as 'miles' | 'kilometers' };

  hexes: Array<{ q: number; r: number; cx: number; cy: number; points: string }> = [];

  svgOffsetX = HEX_SIZE;
  svgOffsetY = HEX_SIZE;
  svgWidth = 0;
  svgHeight = 0;

  constructor(
    private wildernessService: WildernessMapService,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.state = this.wildernessService.getState();
    this.characters = this.characterService.getCharacters();
    this.mapMode = this.state.mapMode ?? 'terrain';
    this.gridWidth = this.state.gridWidth ?? GRID_COLS;
    this.gridHeight = this.state.gridHeight ?? GRID_ROWS;
    this.scale = this.state.scale ?? 6;
    this.scaleUnit = this.state.scaleUnit ?? 'miles';
    this.showTerrainOverlay = this.state.showTerrainOverlay ?? false;
    this.hexBorderOpacity = this.state.hexBorderOpacity ?? 1;
    console.log('Loaded state from localStorage:', this.state);
    this.buildHexGrid();
    if (this.state.currentMapId) {
      this.loadMapData(this.state.currentMapId);
    }
    this.ensureMapDataSynced();
  }

  ngOnDestroy(): void {
    this.wildernessService.saveState(this.state);
  }

  private buildHexGrid(): void {
    const S = HEX_SIZE;
    const sqrt3 = Math.sqrt(3);
    this.hexes = [];

    for (let r = 0; r < this.gridHeight; r++) {
      for (let q_offset = 0; q_offset < this.gridWidth; q_offset++) {
        const q = q_offset - Math.floor(r / 2);

        const cx = S * (sqrt3 * q + (sqrt3 / 2) * r);
        const cy = S * ((3 / 2) * r);

        const pts = [];
        for (let i = 0; i < 6; i++) {
          const angleDeg = 60 * i - 30;
          const angleRad = (Math.PI / 180) * angleDeg;
          pts.push(`${cx + S * Math.cos(angleRad)},${cy + S * Math.sin(angleRad)}`);
        }

        this.hexes.push({ q, r, cx, cy, points: pts.join(' ') });
      }
    }

    this.svgWidth = HEX_SIZE * Math.sqrt(3) * (this.gridWidth + 0.5) + HEX_SIZE * 2;
    this.svgHeight = HEX_SIZE * 1.5 * this.gridHeight + HEX_SIZE * 2;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  getTerrainAt(q: number, r: number): string {
    const key = `${q},${r}`;
    return this.state.tiles[key] ?? 'none';
  }

  getHexFill(q: number, r: number): string {
    if (this.mapMode === 'image') {
      if (this.showTerrainOverlay) {
        const terrain = this.getTerrainAt(q, r);
        const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
        const baseColor = def?.fillColor ?? '#f5f0e8';
        return this.hexToRgba(baseColor, 0.45);
      }
      return 'rgba(255, 255, 255, 0.05)';
    }
    const terrain = this.getTerrainAt(q, r);
    const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
    return def?.fillColor ?? '#f5f0e8';
  }

  getHexStroke(q: number, r: number): string {
    if (this.mapMode === 'image') {
      // return 'rgba(100, 100, 100, 0.3)';
      return 'rgba(0, 0, 0, 1)';
    }
    const terrain = this.getTerrainAt(q, r);
    const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
    return def?.strokeColor ?? '#ccc';
  }

  onHexPointerDown(q: number, r: number, event: PointerEvent): void {
    if (this.interactionMode !== 'paint') return;
    event.preventDefault();
    this.isPainting = true;
    this.paintHex(q, r);
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
    if (!this.isPainting && this.interactionMode !== 'move') return;
    if (!this.hexSvg) return;

    const svg = this.hexSvg.nativeElement;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

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

  @HostListener('document:pointerup')
  onPointerUp(): void {
    if (this.isPainting) {
      this.isPainting = false;
      this.saveState();
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

  onHexClick(q: number, r: number): void {
    if (this.interactionMode !== 'move') return;

    const clickedToken = this.getTokenAt(q, r);
    if (clickedToken) {
      this.selectedTokenId = clickedToken.id === this.selectedTokenId ? null : clickedToken.id;
      return;
    }

    if (!this.selectedTokenId) return;

    const token = this.state.tokens.find((t) => t.id === this.selectedTokenId);
    if (token) {
      token.position = { q, r };
      this.saveState();
      this.selectedTokenId = null;
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

  addCustomToken(): void {
    const name = prompt('Enter token name:', 'Marker');
    if (!name) return;

    // Ensure state.tokens is synced to current map
    if (this.state.currentMapId && this.state.tokens !== this.state.tokenMaps[this.state.currentMapId]) {
      if (!this.state.tokenMaps[this.state.currentMapId]) {
        this.state.tokenMaps[this.state.currentMapId] = [];
      }
      this.state.tokens = this.state.tokenMaps[this.state.currentMapId];
    }

    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
    ];
    const color = colors[this.state.tokens.length % colors.length];

    const token: WildernessToken = {
      id: this.generateId(),
      name,
      color,
      sourceType: 'custom',
    };
    this.state.tokens.push(token);
    this.saveState();
    this.selectedTokenId = token.id;
    this.interactionMode = 'move';
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

  toggleTerrainOverlay(): void {
    this.showTerrainOverlay = !this.showTerrainOverlay;
    this.state.showTerrainOverlay = this.showTerrainOverlay;
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
}
