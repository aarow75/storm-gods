import { Component, ElementRef, HostListener, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
import { ENCOUNTER_TABLES } from '@bestiary/constants/encounters.constants';
import { MONSTERS as BESTIARY_MONSTERS } from '@bestiary/constants/monsters.constants';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { CharacterService } from '@characters/services/character.service';
import { CombatService } from '@combat/services/combat.service';
import { DiceService } from '@shared/services/dice.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { ExportService } from '@shared/services/export.service';
import { Character } from '@characters/models/character.model';
import { CombatParticipant, Monster as CombatMonster } from '@combat/models/combat.model';
import { Monster as BestiaryMonster } from '@bestiary/models/monster.model';
import { getSizeModifier, getDexterityModifier } from '@characters/models/character.model';
import { dijkstra } from '@maps/utils/hex-pathfinding';

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

  encounterResult: {
    roll: number;
    creature: string;
    count: string;
    difficulty: 'trivial' | 'easy' | 'moderate' | 'challenging' | 'deadly';
    terrain: string;
    stoppedAt: HexCoord;
  } | null = null;

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
    private characterService: CharacterService,
    private combatService: CombatService,
    private diceService: DiceService,
    private router: Router,
    public gameSystemService: GameSystemService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.state = this.wildernessService.getState();
    this.characters = this.characterService.getCharacters();
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
    const terrain = this.getTerrainAt(q, r);
    if (this.mapMode === 'image') {
      if (terrain !== 'none') {
        const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
        const baseColor = def?.fillColor ?? '#f5f0e8';
        return this.hexToRgba(baseColor, this.terrainOpacity);
      }
      return 'rgba(255, 255, 255, 0.05)';
    }
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

  private terrainToEncounterTableName(terrain: TerrainType): string {
    const map: Partial<Record<TerrainType, string>> = {
      plains: 'plains',
      forest: 'forest',
      'dense-forest': 'forest',
      hills: 'mountains',
      mountains: 'mountains',
      desert: 'desert',
      road: 'roads',
      swamp: 'forest',
      river: 'forest',
      none: 'plains',
    };
    return map[terrain] ?? 'plains';
  }

  private rollEncounterForTerrain(
    terrain: TerrainType
  ): {
    roll: number;
    creature: string;
    count: string;
    difficulty: 'trivial' | 'easy' | 'moderate' | 'challenging' | 'deadly';
    terrain: string;
    stoppedAt: HexCoord;
  } | null {
    const tableName = this.terrainToEncounterTableName(terrain);
    const table = ENCOUNTER_TABLES.find((t) => t.terrain === tableName);
    if (!table) return null;

    const roll = Math.ceil(Math.random() * 20);

    const entry = table.entries.find((e) => {
      const [low, high] = e.roll.includes('-') ? e.roll.split('-').map(Number) : [Number(e.roll), Number(e.roll)];
      return roll >= low && roll <= high;
    });

    if (!entry) return null;
    return {
      roll,
      creature: entry.creature,
      count: entry.count,
      difficulty: entry.difficulty,
      terrain: tableName,
      stoppedAt: { q: 0, r: 0 },
    };
  }

  private convertBestiaryMonster(bm: BestiaryMonster): CombatMonster {
    return {
      id: `bestiary-${bm.id}`,
      name: bm.name,
      hitPoints: bm.hitPoints,
      strikeRank: getSizeModifier(bm.stats.SIZ) + getDexterityModifier(bm.stats.DEX),
      armor: bm.armor,
      weapons: bm.attacks.map((a) => ({
        name: a.name,
        damage: a.damage,
        strikeRankModifier: 0,
      })),
    };
  }

  private parseCountString(countStr: string): number {
    if (countStr === '-') return 0;
    const diceMatch = countStr.match(/(\d+)d(\d+)/);
    if (diceMatch) {
      const count = parseInt(diceMatch[1], 10);
      const sides = parseInt(diceMatch[2], 10);
      let total = 0;
      for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
      }
      return total;
    }
    const numMatch = countStr.match(/\d+/);
    return numMatch ? parseInt(numMatch[0], 10) : 1;
  }

  startCombatWithEncounter(): void {
    if (!this.encounterResult) return;

    const creatureName = this.encounterResult.creature;
    const countStr = this.encounterResult.count;
    const count = this.parseCountString(countStr);

    if (count === 0) {
      alert('No creatures to encounter!');
      this.encounterResult = null;
      return;
    }

    const bestiaryMonster = BESTIARY_MONSTERS.find(
      (m) => m.name.toLowerCase() === creatureName.toLowerCase()
    );

    if (!bestiaryMonster) {
      alert(`Creature "${creatureName}" not found in bestiary`);
      return;
    }

    const combatMonster = this.convertBestiaryMonster(bestiaryMonster);
    const existingParticipants = this.combatService.getCombatParticipants();
    const participants: CombatParticipant[] = [];

    for (let i = 0; i < count; i++) {
      const id = this.combatService.generateId();
      const baseStrikeRank = combatMonster.strikeRank;
      const firstWeapon = combatMonster.weapons[0]?.name || 'Bite';
      const weapon = combatMonster.weapons.find((w) => w.name === firstWeapon);
      const finalStrikeRank = baseStrikeRank + (weapon?.strikeRankModifier || 0);

      const participant: CombatParticipant = {
        id,
        name: count > 1 ? `${combatMonster.name} ${i + 1}` : combatMonster.name,
        type: 'monster',
        monsterId: combatMonster.id,
        maxHitPoints: combatMonster.hitPoints,
        currentHitPoints: new Array(combatMonster.hitPoints).fill(false),
        baseStrikeRank,
        selectedWeapon: firstWeapon,
        selectedParryItem: firstWeapon,
        finalStrikeRank,
        isDead: false,
        kills: 0,
        color: '#666666',
        locationDamage: {},
        distanceToOpponent: 0,
        movementThisRound: 0,
        isSurprised: false,
        movementRate: 8,
      };
      participants.push(participant);
    }

    const allParticipants = [...existingParticipants, ...participants];
    this.combatService.saveCombatParticipants(
      this.combatService.sortParticipantsByStrikeRank(allParticipants)
    );

    this.encounterResult = null;
    this.router.navigate(this.gameSystemService.link('combat'));
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
          const rollResult = this.rollEncounterForTerrain(terrain);
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
