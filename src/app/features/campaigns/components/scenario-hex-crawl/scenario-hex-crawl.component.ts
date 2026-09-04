import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DangerLevel,
  DEFAULT_HEX_DATA,
  HexCoord,
  HexData,
  HEX_SIZE,
  PointOfInterest,
  TerrainType,
  WildernessToken,
  tileKey,
} from '@maps/models/wilderness-map.model';
import { TERRAIN_DEFINITIONS } from '@maps/constants/terrain.constants';
import { getMapBackgroundById } from '@maps/constants/map-backgrounds.constants';
import { ScenarioMapService } from '@maps/services/scenario-map.service';
import { dijkstra } from '@maps/utils/hex-pathfinding';
import { buildHexGrid, HexCell, terrainFillColor, terrainStrokeColor } from '@maps/utils/hex-grid.util';
import {
  applyHexDefinitions,
  computeRequiredGridSize,
  parseHexDefinitionFile,
} from '@maps/utils/hex-definition-parser.util';
import { EncounterRollResult, rollHexEncounter } from '@maps/utils/encounter-roll.util';
import { buildEncounterParticipants } from '@maps/utils/encounter-combat.util';
import { computeDaysForCost } from '@maps/utils/travel-time.util';
import { CampaignScenario } from '@campaigns/models/scenario.model';
import { Campaign } from '@campaigns/models/campaign.model';
import { CampaignService } from '@campaigns/services/campaign.service';
import { CharacterReadService } from '@shared/services/character-read.service';
import { CharacterService } from '@characters/services/character.service';
import { EncounterLaunchService } from '@combat/services/encounter-launch.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { Character } from '@characters/models/character.model';

@Component({
  selector: 'app-scenario-hex-crawl',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scenario-hex-crawl.component.html',
  styleUrl: './scenario-hex-crawl.component.css',
})
export class ScenarioHexCrawlComponent implements OnInit, OnDestroy {
  @ViewChild('hexSvg', { read: ElementRef }) hexSvg!: ElementRef<SVGSVGElement>;

  readonly HEX_SIZE = HEX_SIZE;
  readonly terrainDefs = TERRAIN_DEFINITIONS;

  campaignId: string | null = null;
  scenarioId: string | null = null;
  campaign: Campaign | null = null;
  scenario: CampaignScenario | null = null;
  partyCharacters: Character[] = [];

  private mapId = '';
  tiles: Record<string, TerrainType> = {};
  tokens: WildernessToken[] = [];
  hexData: Record<string, HexData> = {};
  gridWidth = 20;
  gridHeight = 20;
  scale = 6;
  scaleUnit: 'miles' | 'kilometers' = 'miles';
  mapMode: 'terrain' | 'image' = 'terrain';
  backgroundImagePath: string | null = null;
  readonly terrainOpacity = 0.45;

  hexes: HexCell[] = [];
  svgWidth = 0;
  svgHeight = 0;
  svgOffsetX = HEX_SIZE;
  svgOffsetY = HEX_SIZE;

  selectedTokenId: string | null = null;
  previewPath: HexCoord[] = [];
  previewPathSet = new Set<string>();

  encounterResult: (EncounterRollResult & { stoppedAt: HexCoord }) | null = null;

  selectedHexCoord: HexCoord | null = null;
  newPoiLabel = '';
  restDaysInput = 1;
  restNote = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private scenarioMapService: ScenarioMapService,
    private characterReadService: CharacterReadService,
    private characterService: CharacterService,
    private encounterLaunchService: EncounterLaunchService,
    private cdr: ChangeDetectorRef,
    public gameSystemService: GameSystemService
  ) {}

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.scenarioId = this.route.snapshot.paramMap.get('scenarioId');
    if (!this.campaignId || !this.scenarioId) {
      this.goBack();
      return;
    }

    this.campaign = this.campaignService.getCampaign(this.campaignId);
    this.scenario = this.campaignService.getScenario(this.campaignId, this.scenarioId);
    if (!this.campaign || !this.scenario) {
      this.goBack();
      return;
    }

    this.mapId = this.scenario.mapId;
    this.partyCharacters = this.campaign.characterIds
      .map((id) => this.characterReadService.getById(id))
      .filter((c): c is Character => !!c);

    this.loadMapState();
    this.ensurePartyTokens();
  }

  ngOnDestroy(): void {
    this.saveMapState();
  }

  private loadMapState(): void {
    const state = this.scenarioMapService.getState();
    this.tiles = state.terrainMaps[this.mapId] ?? {};
    this.tokens = state.tokenMaps[this.mapId] ?? [];
    this.hexData = state.hexDataMaps?.[this.mapId] ?? {};

    const customMap = state.customMaps.find((m) => m.id === this.mapId);
    this.gridWidth = customMap?.width ?? 20;
    this.gridHeight = customMap?.height ?? 20;
    this.scale = customMap?.scale ?? 6;
    this.scaleUnit = customMap?.scaleUnit ?? 'miles';

    if (customMap?.backgroundImage) {
      const bg = getMapBackgroundById(customMap.backgroundImage);
      this.backgroundImagePath = bg?.imagePath ?? null;
      this.mapMode = this.backgroundImagePath ? 'image' : 'terrain';
    } else {
      this.backgroundImagePath = null;
      this.mapMode = 'terrain';
    }

    const grid = buildHexGrid(this.gridWidth, this.gridHeight, HEX_SIZE);
    this.hexes = grid.hexes;
    this.svgWidth = grid.svgWidth;
    this.svgHeight = grid.svgHeight;
  }

  private saveMapState(): void {
    const state = this.scenarioMapService.getState();
    state.terrainMaps[this.mapId] = this.tiles;
    state.tokenMaps[this.mapId] = this.tokens;
    state.hexDataMaps ??= {};
    state.hexDataMaps[this.mapId] = this.hexData;
    this.scenarioMapService.saveState(state);
  }

  importHexDefinitions(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { entries, errors } = parseHexDefinitionFile(text);
        const { painted, described, flagged } = applyHexDefinitions(entries, this.tiles, this.hexData);

        const required = computeRequiredGridSize(entries);
        if (required.width > this.gridWidth || required.height > this.gridHeight) {
          this.gridWidth = Math.max(this.gridWidth, required.width);
          this.gridHeight = Math.max(this.gridHeight, required.height);

          const state = this.scenarioMapService.getState();
          const customMap = state.customMaps.find((m) => m.id === this.mapId);
          if (customMap) {
            customMap.width = this.gridWidth;
            customMap.height = this.gridHeight;
            this.scenarioMapService.saveState(state);
          }

          const grid = buildHexGrid(this.gridWidth, this.gridHeight, HEX_SIZE);
          this.hexes = grid.hexes;
          this.svgWidth = grid.svgWidth;
          this.svgHeight = grid.svgHeight;
        }

        this.saveMapState();
        this.cdr.markForCheck();

        const summary = [`Imported ${entries.length} hex definition(s): ${painted} terrain painted, ${described} described, ${flagged} danger level(s) marked.`];
        if (errors.length) summary.push(`${errors.length} error(s):`, ...errors);
        alert(summary.join('\n'));
      } catch {
        alert('Invalid hex definition file — could not read the file.');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private ensurePartyTokens(): void {
    let changed = false;
    for (const char of this.partyCharacters) {
      if (!this.tokens.some((t) => t.characterId === char.id)) {
        this.tokens.push({
          id: this.generateId(),
          name: char.name,
          color: char.color ?? '#888888',
          sourceType: 'character',
          characterId: char.id,
        });
        changed = true;
      }
    }
    if (changed) this.saveMapState();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  getTerrainAt(q: number, r: number): TerrainType {
    return (this.tiles[tileKey(q, r)] ?? 'none') as TerrainType;
  }

  getHexFill(q: number, r: number): string {
    return terrainFillColor(this.getTerrainAt(q, r), this.mapMode, this.terrainOpacity);
  }

  getHexStroke(q: number, r: number): string {
    return terrainStrokeColor(this.getTerrainAt(q, r), this.mapMode);
  }

  getHexData(q: number, r: number): HexData {
    return this.hexData[tileKey(q, r)] ?? DEFAULT_HEX_DATA;
  }

  hasPointsOfInterest(q: number, r: number): boolean {
    return this.getHexData(q, r).pointsOfInterest.length > 0;
  }

  getDangerColor(q: number, r: number): string | null {
    switch (this.getHexData(q, r).dangerLevel) {
      case 'safe':
        return '#2ecc71';
      case 'caution':
        return '#f39c12';
      case 'dangerous':
        return '#e74c3c';
      default:
        return null;
    }
  }

  getHexStrokeWidth(q: number, r: number): number {
    if (this.isPathPreview(q, r)) return 2;
    return this.getDangerColor(q, r) ? 3 : 1;
  }

  getHexTooltip(q: number, r: number): string {
    const data = this.getHexData(q, r);
    const parts: string[] = [`(${q}, ${r}) - ${this.getTerrainAt(q, r)}`];
    if (data.dangerLevel !== 'unknown') parts.push(data.dangerLevel);
    if (data.pointsOfInterest.length) parts.push(data.pointsOfInterest.map((p) => p.label).join(', '));
    if (data.encounterHistory.length) parts.push(`${data.encounterHistory.length} past encounter(s)`);
    return parts.join(' · ');
  }

  isPathPreview(q: number, r: number): boolean {
    return this.previewPathSet.has(tileKey(q, r));
  }

  getTokenAt(q: number, r: number): WildernessToken | undefined {
    return this.tokens.find((t) => t.position?.q === q && t.position?.r === r);
  }

  get placedTokens(): WildernessToken[] {
    return this.tokens.filter((t) => t.position !== undefined);
  }

  getTokenCx(token: WildernessToken): number {
    if (!token.position) return 0;
    const sqrt3 = Math.sqrt(3);
    const { q, r } = token.position;
    return HEX_SIZE * (sqrt3 * q + (sqrt3 / 2) * r);
  }

  getTokenCy(token: WildernessToken): number {
    if (!token.position) return 0;
    return HEX_SIZE * ((3 / 2) * token.position.r);
  }

  isTokenSelectedForCharacter(char: Character): boolean {
    if (!this.selectedTokenId) return false;
    const token = this.tokens.find((t) => t.characterId === char.id);
    return token?.id === this.selectedTokenId;
  }

  selectToken(char: Character): void {
    const token = this.tokens.find((t) => t.characterId === char.id);
    if (token) {
      this.selectedTokenId = this.selectedTokenId === token.id ? null : token.id;
      this.previewPath = [];
      this.previewPathSet.clear();
    }
  }

  onHexClick(q: number, r: number): void {
    const clickedToken = this.getTokenAt(q, r);
    if (clickedToken) {
      this.selectedTokenId = clickedToken.id === this.selectedTokenId ? null : clickedToken.id;
      this.encounterResult = null;
      return;
    }

    if (!this.selectedTokenId) {
      // No token selected - inspect this hex instead of moving.
      this.selectedHexCoord = { q, r };
      this.newPoiLabel = '';
      return;
    }

    const token = this.tokens.find((t) => t.id === this.selectedTokenId);
    if (!token) return;

    if (!token.position) {
      token.position = { q, r };
      this.visitHex(q, r);
      this.saveMapState();
      this.selectedTokenId = null;
      return;
    }

    const result = dijkstra(
      token.position,
      { q, r },
      (tq, tr) => this.getTerrainAt(tq, tr),
      this.gridWidth,
      this.gridHeight
    );
    const path = result?.path ?? [];
    if (path.length === 0) return;

    this.moveAlongPath(token, path);
  }

  private moveAlongPath(token: WildernessToken, path: HexCoord[]): void {
    let costSoFar = 0;
    for (const hex of path) {
      const terrain = this.getTerrainAt(hex.q, hex.r);
      costSoFar += TERRAIN_DEFINITIONS.find((t) => t.id === terrain)?.moveCost ?? 2;
      token.position = hex;
      this.visitHex(hex.q, hex.r);

      const check = rollHexEncounter(terrain);
      if (check.triggered) {
        this.advanceDay(costSoFar);
        if (check.result) {
          this.recordEncounter(hex, check.result);
          this.encounterResult = { ...check.result, stoppedAt: hex };
        }
        this.saveMapState();
        this.selectedTokenId = null;
        this.previewPath = [];
        this.previewPathSet.clear();
        return;
      }
    }

    this.advanceDay(costSoFar);
    this.saveMapState();
    this.selectedTokenId = null;
    this.previewPath = [];
    this.previewPathSet.clear();
  }

  private visitHex(q: number, r: number): void {
    const key = tileKey(q, r);
    const existing = this.hexData[key];
    const day = this.scenario?.currentDay ?? 1;
    this.hexData[key] = {
      ...DEFAULT_HEX_DATA,
      ...existing,
      visited: true,
      firstVisitedDay: existing?.firstVisitedDay ?? day,
      lastVisitedDay: day,
    };
  }

  private recordEncounter(hex: HexCoord, result: EncounterRollResult): void {
    const key = tileKey(hex.q, hex.r);
    const hexData = this.hexData[key] ?? { ...DEFAULT_HEX_DATA };
    const description =
      result.count === '-'
        ? `${result.creature} (${result.difficulty})`
        : `${result.count} ${result.creature} (${result.difficulty})`;
    hexData.encounterHistory = [
      ...hexData.encounterHistory,
      { day: this.scenario?.currentDay ?? 1, description },
    ];
    this.hexData[key] = hexData;
  }

  private advanceDay(totalCost: number): void {
    if (!this.campaignId || !this.scenarioId || !this.scenario) return;
    const days = computeDaysForCost(totalCost, this.scale);
    const newDay = Math.round((this.scenario.currentDay + days) * 10) / 10;
    this.scenario = { ...this.scenario, currentDay: newDay };
    this.campaignService.updateScenario(this.campaignId, this.scenarioId, { currentDay: newDay });
  }

  startCombatWithEncounter(): void {
    if (!this.encounterResult) return;

    const creatureName = this.encounterResult.creature;
    const result = buildEncounterParticipants(this.encounterResult, this.gameSystemService, () =>
      this.encounterLaunchService.generateId()
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

  dismissEncounter(): void {
    this.encounterResult = null;
  }

  // Hex detail panel
  closeHexDetail(): void {
    this.selectedHexCoord = null;
  }

  get selectedHexData(): HexData | null {
    if (!this.selectedHexCoord) return null;
    return this.getHexData(this.selectedHexCoord.q, this.selectedHexCoord.r);
  }

  setDangerLevel(level: DangerLevel): void {
    if (!this.selectedHexCoord) return;
    const key = tileKey(this.selectedHexCoord.q, this.selectedHexCoord.r);
    const hexData = this.hexData[key] ?? { ...DEFAULT_HEX_DATA };
    hexData.dangerLevel = level;
    this.hexData[key] = hexData;
    this.saveMapState();
  }

  addPointOfInterest(): void {
    if (!this.selectedHexCoord || !this.newPoiLabel.trim()) return;
    const key = tileKey(this.selectedHexCoord.q, this.selectedHexCoord.r);
    const hexData = this.hexData[key] ?? { ...DEFAULT_HEX_DATA };
    const poi: PointOfInterest = { id: this.generateId(), label: this.newPoiLabel.trim() };
    hexData.pointsOfInterest = [...hexData.pointsOfInterest, poi];
    this.hexData[key] = hexData;
    this.newPoiLabel = '';
    this.saveMapState();
  }

  removePointOfInterest(poiId: string): void {
    if (!this.selectedHexCoord) return;
    const key = tileKey(this.selectedHexCoord.q, this.selectedHexCoord.r);
    const hexData = this.hexData[key];
    if (!hexData) return;
    hexData.pointsOfInterest = hexData.pointsOfInterest.filter((p) => p.id !== poiId);
    this.saveMapState();
  }

  updateHexNotes(notes: string): void {
    if (!this.selectedHexCoord) return;
    const key = tileKey(this.selectedHexCoord.q, this.selectedHexCoord.r);
    const hexData = this.hexData[key] ?? { ...DEFAULT_HEX_DATA };
    hexData.notes = notes;
    this.hexData[key] = hexData;
    this.saveMapState();
  }

  updateEncounterOutcome(entryIndex: number, outcome: string): void {
    if (!this.selectedHexCoord) return;
    const key = tileKey(this.selectedHexCoord.q, this.selectedHexCoord.r);
    const hexData = this.hexData[key];
    if (!hexData?.encounterHistory[entryIndex]) return;
    hexData.encounterHistory[entryIndex].outcome = outcome;
    this.saveMapState();
  }

  get showsHealingRate(): boolean {
    return this.gameSystemService.getRules().showsHealingRate();
  }

  restParty(): void {
    if (!this.campaignId || !this.scenarioId || !this.scenario) return;
    const days = Math.max(1, this.restDaysInput);

    if (this.showsHealingRate) {
      for (const character of this.partyCharacters) {
        const healed = character.derivedStats.healingRate * days;
        const max = character.derivedStats.maxHitPoints ?? character.derivedStats.totalHitPoints;
        character.derivedStats.totalHitPoints = Math.min(max, character.derivedStats.totalHitPoints + healed);
        this.characterService.updateCharacter(character);
      }
    }

    const newDay = this.scenario.currentDay + days;
    this.scenario = { ...this.scenario, currentDay: newDay };
    this.campaignService.updateScenario(this.campaignId, this.scenarioId, { currentDay: newDay });
  }

  goBack(): void {
    if (this.campaignId) {
      this.router.navigate(this.gameSystemService.link('campaigns', this.campaignId));
    } else {
      this.router.navigate(this.gameSystemService.link('campaigns'));
    }
  }
}
