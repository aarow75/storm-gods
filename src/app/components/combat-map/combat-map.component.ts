import { Component, OnInit, OnDestroy, HostListener, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CombatParticipant, CombatMapState, CombatPosition,
  DungeonToken, DungeonTokenType, DUNGEON_TOKEN_DEFS, CombatMapTemplate,
} from '../../models/combat.model';
import { WEAPON_LIST, Character, calculateHitLocations } from '../../models/character.model';
import { CombatService } from '../../services/combat.service';
import { CombatLogService } from '../../services/combat-log.service';
import { DiceService } from '../../services/dice.service';
import { CharacterService } from '../../services/character.service';
import { GameSystemService } from '../../services/game-system.service';

@Component({
  standalone: true,
  selector: 'app-combat-map',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './combat-map.component.html',
  styleUrl: './combat-map.component.css'
})
export class CombatMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('opponentSvg', { read: ElementRef }) opponentSvg!: ElementRef<SVGSVGElement>;
  @ViewChild('gridArea', { read: ElementRef }) gridArea!: ElementRef<HTMLDivElement>;

  participants: CombatParticipant[] = [];
  mapState: CombatMapState = { positions: {}, movedThisRound: [] };
  selectedParticipantId: string | null = null;
  private lastSyncedRound = 0;
  private updateInterval: any;
  combatLogEntries = signal<string[]>([]);
  drawWallMode = false;
  selectedWallColor: 'black' | 'brown' = 'black';

  readonly dungeonTokenDefs = DUNGEON_TOKEN_DEFS;
  drawDungeonTokenMode = false;
  selectedDungeonTokenType: DungeonTokenType = 'door';
  selectedDungeonTokenColor = DUNGEON_TOKEN_DEFS[0].defaultColor;

  showSaveTemplateForm = false;
  newTemplateName = '';
  savedTemplates: CombatMapTemplate[] = [];

  readonly GRID_SIZE = 20;
  readonly gridRows = Array.from({ length: 20 }, (_, i) => i);
  readonly gridCols = Array.from({ length: 20 }, (_, i) => i);

  constructor(
    private combatService: CombatService,
    private combatLogService: CombatLogService,
    private diceService: DiceService,
    private characterService: CharacterService,
    public gameSystemService: GameSystemService
  ) {}

  ngOnInit(): void {
    this.participants = this.combatService.getCombatParticipants();
    this.mapState = this.combatService.getCombatMapState();
    this.lastSyncedRound = this.combatService.getCurrentRound();

    // Clear movement tracking on load to allow movement on new rounds
    this.mapState.movedThisRound = [];

    // Initialize walls if absent
    if (!this.mapState.walls) {
      this.mapState.walls = {};
    }
    if (!this.mapState.dungeonTokens) {
      this.mapState.dungeonTokens = {};
    }
    this.savedTemplates = this.combatService.getMapTemplates();

    this.initializePositions();
    this.pruneStalePositions();
    this.saveState();
    setTimeout(() => this.drawOpponentLines(), 0);

    // Auto-select the active participant
    this.syncActiveParticipant();

    // Check periodically for changes to the active participant, round, and combat log
    this.syncCombatLog();
    this.updateInterval = setInterval(() => {
      this.syncRoundState();
      this.syncActiveParticipant();
      this.syncCombatLog();
    }, 300);
  }

  private syncRoundState(): void {
    const currentRound = this.combatService.getCurrentRound();
    // Reset movement whenever round changes, ensuring fresh movement state each round
    if (currentRound !== this.lastSyncedRound && currentRound > 0) {
      this.lastSyncedRound = currentRound;
      this.resetMovement();
    }
  }

  private resetMovement(): void {
    // Clear movement tracking for the new round
    this.mapState.movedThisRound = [];
    this.saveState();
  }

  private syncActiveParticipant(): void {
    const activeId = this.combatService.getActiveParticipantId();
    if (activeId && activeId !== this.selectedParticipantId) {
      this.selectedParticipantId = activeId;
    }
  }

  get currentRound(): number {
    return this.combatService.getCurrentRound();
  }

  private syncCombatLog(): void {
    this.combatLogEntries.set(this.combatLogService.getEntries());
  }

  ngAfterViewInit(): void {
    this.drawOpponentLines();
  }

  ngOnDestroy(): void {
    this.saveState();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private initializePositions(): void {
    if (Object.keys(this.mapState.positions).length === 0) {
      // Fresh start: sort by finalStrikeRank, place lowest SR at center
      const sorted = [...this.participants].sort((a, b) => (a.finalStrikeRank ?? 0) - (b.finalStrikeRank ?? 0));

      if (sorted.length > 0) {
        // Place lowest SR at center (10, 10)
        this.mapState.positions[sorted[0].id] = { x: 10, y: 10 };

        // If lowest SR has opponent, place them nearby
        if (sorted[0].selectedOpponentId && sorted.length > 1) {
          const opponent = sorted.find(p => p.id === sorted[0].selectedOpponentId);
          if (opponent) {
            this.mapState.positions[opponent.id] = this.placeParticipant(opponent.id, 13, 10);
          }
        }

        // Place remaining participants
        for (let i = 1; i < sorted.length; i++) {
          if (!this.mapState.positions[sorted[i].id]) {
            this.mapState.positions[sorted[i].id] = this.placeParticipant(sorted[i].id);
          }
        }
      }
    } else {
      // Partial state: place any new participants not yet in positions
      for (const p of this.participants) {
        if (!this.mapState.positions[p.id]) {
          this.mapState.positions[p.id] = this.placeParticipant(p.id);
        }
      }
    }
  }

  private placeParticipant(id: string, preferredX = 10, preferredY = 10): CombatPosition {
    // Check preferred cell; if occupied spiral outward ring-by-ring
    if (!this.isOccupied(preferredX, preferredY, id)) {
      return { x: preferredX, y: preferredY };
    }

    for (let radius = 1; radius < this.GRID_SIZE; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          // Only check cells on the current ring
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

          const nx = Math.max(0, Math.min(19, preferredX + dx));
          const ny = Math.max(0, Math.min(19, preferredY + dy));
          if (!this.isOccupied(nx, ny, id)) {
            return { x: nx, y: ny };
          }
        }
      }
    }

    return { x: preferredX, y: preferredY };
  }

  private isOccupied(x: number, y: number, excludeId?: string): boolean {
    return Object.entries(this.mapState.positions).some(
      ([id, pos]) => id !== excludeId && pos.x === x && pos.y === y
    );
  }

  private isOccupiedByOther(x: number, y: number, excludeId: string): boolean {
    return this.isOccupied(x, y, excludeId);
  }

  private pruneStalePositions(): void {
    const activeIds = new Set(this.participants.map(p => p.id));
    const currentIds = Object.keys(this.mapState.positions);
    for (const id of currentIds) {
      if (!activeIds.has(id)) {
        delete this.mapState.positions[id];
      }
    }
    // Remove stale participant IDs from movedThisRound
    if (this.mapState.movedThisRound.length > 0) {
      this.mapState.movedThisRound = this.mapState.movedThisRound.filter(id => activeIds.has(id));
    }
  }

  selectParticipant(id: string): void {
    this.selectedParticipantId = id === this.selectedParticipantId ? null : id;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.selectedParticipantId || this.drawWallMode) return;

    const arrows: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    };

    const delta = arrows[event.key];
    if (!delta) return;

    event.preventDefault();

    if (!this.canMove(this.selectedParticipantId)) return;

    const pos = this.mapState.positions[this.selectedParticipantId];
    if (!pos) return;

    const nx = Math.max(0, Math.min(19, pos.x + delta[0]));
    const ny = Math.max(0, Math.min(19, pos.y + delta[1]));

    // Block movement if square is occupied or has a wall
    if (this.isOccupiedByOther(nx, ny, this.selectedParticipantId)) return;
    if (this.getWallAt(nx, ny)) return;

    this.mapState.positions[this.selectedParticipantId] = { x: nx, y: ny };
    this.saveState();
    this.drawOpponentLines();
  }

  canMove(id: string): boolean {
    const p = this.participants.find(p => p.id === id);
    return !!p && !p.isDead;
  }

  onCellClick(x: number, y: number): void {
    // Wall drawing mode
    if (this.drawWallMode) {
      this.toggleWall(x, y);
      return;
    }

    // Dungeon token placement mode
    if (this.drawDungeonTokenMode) {
      this.toggleDungeonToken(x, y);
      return;
    }

    const occupant = this.getParticipantAt(x, y);
    if (occupant) {
      this.selectParticipant(occupant.id);
      return;
    }

    // Click-to-move within range
    if (!this.selectedParticipantId || !this.canMove(this.selectedParticipantId)) return;
    if (!this.isCellInRange(x, y)) return;
    // Block movement if square is occupied or has a wall
    if (this.isOccupiedByOther(x, y, this.selectedParticipantId)) return;
    if (this.getWallAt(x, y)) return;

    this.mapState.positions[this.selectedParticipantId] = { x, y };
    this.saveState();
    this.drawOpponentLines();
  }

  isCellInRange(x: number, y: number): boolean {
    if (!this.selectedParticipantId) return false;
    if (this.drawWallMode) return false;

    const sel = this.participants.find(p => p.id === this.selectedParticipantId);
    if (!sel) return false;

    const pos = this.mapState.positions[this.selectedParticipantId];
    if (!pos) return false;

    // Don't show occupied cells or walled cells in range
    if (this.isOccupiedByOther(x, y, this.selectedParticipantId)) return false;
    if (this.getWallAt(x, y)) return false;

    const rate = sel.movementRate ?? 8;
    const distance = Math.max(Math.abs(x - pos.x), Math.abs(y - pos.y));
    return distance <= rate;
  }

  getParticipantAt(x: number, y: number): CombatParticipant | undefined {
    let result: CombatParticipant | undefined;
    for (const p of this.participants) {
      const pos = this.mapState.positions[p.id];
      if (pos && pos.x === x && pos.y === y) {
        result = p;
      }
    }
    return result;
  }

  getPosition(id: string): CombatPosition | undefined {
    return this.mapState.positions[id];
  }

  hasMoved(id: string): boolean {
    return this.mapState.movedThisRound.includes(id);
  }

  getDistanceToOpponent(participant: CombatParticipant): number | null {
    if (!participant.selectedOpponentId) return null;

    const posA = this.mapState.positions[participant.id];
    const posB = this.mapState.positions[participant.selectedOpponentId];

    if (!posA || !posB) return null;

    return Math.max(Math.abs(posA.x - posB.x), Math.abs(posA.y - posB.y));
  }

  getRangeOverlayColor(): string {
    if (!this.selectedParticipantId) return 'transparent';

    const p = this.participants.find(p => p.id === this.selectedParticipantId);
    return p?.color ? this.hexToRgba(p.color, 0.18) : 'rgba(52,152,219,0.18)';
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  toggleWallMode(): void {
    this.drawWallMode = !this.drawWallMode;
    if (this.drawWallMode) {
      this.selectedParticipantId = null;
      this.drawDungeonTokenMode = false;
    }
  }

  toggleWall(x: number, y: number): void {
    const key = `${x},${y}`;
    if (!this.mapState.walls) {
      this.mapState.walls = {};
    }
    if (this.mapState.walls[key]) {
      delete this.mapState.walls[key];
    } else {
      this.mapState.walls[key] = this.selectedWallColor;
    }
    this.saveState();
  }

  getWallAt(x: number, y: number): 'black' | 'brown' | null {
    if (!this.mapState.walls) return null;
    const key = `${x},${y}`;
    return this.mapState.walls[key] ?? null;
  }

  clearAllWalls(): void {
    this.mapState.walls = {};
    this.saveState();
  }

  toggleDungeonTokenMode(): void {
    this.drawDungeonTokenMode = !this.drawDungeonTokenMode;
    if (this.drawDungeonTokenMode) {
      this.drawWallMode = false;
      this.selectedParticipantId = null;
    }
  }

  onSelectDungeonTokenType(type: DungeonTokenType): void {
    this.selectedDungeonTokenType = type;
    const def = DUNGEON_TOKEN_DEFS.find(d => d.id === type);
    if (def) this.selectedDungeonTokenColor = def.defaultColor;
  }

  getDungeonTokenAt(x: number, y: number): DungeonToken | null {
    return this.mapState.dungeonTokens?.[`${x},${y}`] ?? null;
  }

  toggleDungeonToken(x: number, y: number): void {
    if (!this.mapState.dungeonTokens) this.mapState.dungeonTokens = {};
    const key = `${x},${y}`;
    const existing = this.mapState.dungeonTokens[key];
    if (existing && existing.type === this.selectedDungeonTokenType) {
      delete this.mapState.dungeonTokens[key];
    } else {
      this.mapState.dungeonTokens[key] = {
        type: this.selectedDungeonTokenType,
        color: this.selectedDungeonTokenColor,
      };
    }
    this.saveState();
  }

  getDungeonTokenSymbol(token: DungeonToken): string {
    return DUNGEON_TOKEN_DEFS.find(d => d.id === token.type)?.symbol ?? '?';
  }

  clearAllDungeonTokens(): void {
    this.mapState.dungeonTokens = {};
    this.saveState();
  }

  newMap(): void {
    if (!confirm('Clear all walls and tokens? Participant positions will be kept.')) return;
    this.mapState.walls = {};
    this.mapState.dungeonTokens = {};
    this.drawWallMode = false;
    this.drawDungeonTokenMode = false;
    this.saveState();
  }

  toggleSaveTemplateForm(): void {
    this.showSaveTemplateForm = !this.showSaveTemplateForm;
    if (this.showSaveTemplateForm) this.newTemplateName = '';
  }

  saveAsTemplate(): void {
    const name = this.newTemplateName.trim();
    if (!name) return;
    const existing = this.savedTemplates.find(t => t.name === name);
    if (existing && !confirm(`A template named "${name}" already exists. Overwrite it?`)) return;
    const template: CombatMapTemplate = {
      id: existing ? existing.id : this.combatService.generateId(),
      name,
      createdAt: Date.now(),
      walls: { ...(this.mapState.walls ?? {}) },
      dungeonTokens: { ...(this.mapState.dungeonTokens ?? {}) },
    };
    this.combatService.saveMapTemplate(template);
    this.savedTemplates = this.combatService.getMapTemplates();
    this.showSaveTemplateForm = false;
  }

  loadTemplate(template: CombatMapTemplate): void {
    this.mapState.walls = { ...template.walls };
    this.mapState.dungeonTokens = { ...template.dungeonTokens };
    this.saveState();
    setTimeout(() => this.drawOpponentLines(), 0);
  }

  deleteTemplate(id: string): void {
    this.combatService.deleteMapTemplate(id);
    this.savedTemplates = this.combatService.getMapTemplates();
  }

  private saveState(): void {
    this.combatService.saveCombatMapState(this.mapState);
  }

  get selectedParticipant(): CombatParticipant | undefined {
    return this.participants.find(p => p.id === this.selectedParticipantId);
  }

  attackSelectedParticipant(): void {
    if (!this.selectedParticipantId) {
      alert('No participant selected!');
      return;
    }

    const attacker = this.participants.find(p => p.id === this.selectedParticipantId);
    if (!attacker) return;

    // Check if attacker is dead
    if (attacker.isDead) {
      alert('Dead participants cannot attack!');
      return;
    }

    // Check if attacker has an opponent
    if (!attacker.selectedOpponentId) {
      alert('Please select an opponent first!');
      return;
    }

    const defender = this.participants.find(p => p.id === attacker.selectedOpponentId);
    if (!defender || defender.isDead) {
      alert('Selected opponent is not available!');
      return;
    }

    // Check distance and weapon
    const distance = this.getDistanceToOpponent(attacker);
    const outOfMeleeRange = distance && distance > 1;
    const weaponName = attacker.selectedWeapon;

    if (!weaponName) {
      alert('No weapon selected!');
      return;
    }

    const weapon = WEAPON_LIST.find(w => w.name === weaponName);
    const isMissileWeapon = weapon?.isMissile ?? false;

    // If out of melee range and weapon is not a missile weapon, end turn automatically
    if (outOfMeleeRange && !isMissileWeapon) {
      alert(
        `${attacker.name} is ${distance} squares away and ${weaponName} requires melee range!\n\n` +
        `No missile weapons available. Turn ends automatically.`
      );
      this.endTurnAndAdvance(attacker.id);
      return;
    }

    // Resolve the attack
    this.resolveAttack(attacker, defender);
    this.endTurnAndAdvance(attacker.id);
  }

  private resolveAttack(attacker: CombatParticipant, defender: CombatParticipant): void {
    const damage = this.getWeaponDamage(attacker);
    if (!damage) return;

    // Roll to hit: d100 under effective attack skill
    const attackSkill = this.getEffectiveAttackSkill(attacker);
    const attackRoll = Math.floor(Math.random() * 100) + 1;

    if (attackRoll > attackSkill) {
      // Miss
      const bonusParts = [
        this.getAttackerStrBonus(attacker) > 0 ? `+${this.getAttackerStrBonus(attacker)} STR` : '',
        this.getAttackerIntBonus(attacker) > 0 ? `+${this.getAttackerIntBonus(attacker)} INT` : '',
        this.getAttackerPowBonus(attacker) > 0 ? `+${this.getAttackerPowBonus(attacker)} POW` : '',
        this.getAttackerDexBonus(attacker) > 0 ? `+${this.getAttackerDexBonus(attacker)} DEX` : '',
      ].filter(Boolean).join(' ');
      const baseSkill = attackSkill - this.getTotalAttackBonus(attacker);
      this.combatLogService.addEntry(
        `[MISS] ${attacker.name} → ${defender.name}: attack failed! ` +
        `(rolled ${attackRoll} vs ${attackSkill}%` +
        (bonusParts ? `: ${baseSkill} skill ${bonusParts}` : '') + `)`
      );
      return;
    }

    // Hit - roll damage and location
    const result = this.diceService.rollDiceNotation(damage);
    const { roll: locationRoll, location } = this.rollLocation();
    const armor = this.getArmorValue(defender, location);
    const finalDamage = Math.max(0, result.total - armor);

    this.combatLogService.addEntry(
      `[ATTACK] ${attacker.name} → ${defender.name} (d20:${locationRoll} = ${location}): ${result.total} (${result.breakdown}) - ${armor} armor = ${finalDamage} damage`
    );

    // Apply damage (no defense)
    const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(defender, finalDamage, location);

    if (locationMaxed) {
      this.combatLogService.addEntry(`[WOUND] ${defender.name}'s ${location} — ${locationEffect}!`);
    }
    if (justDied) {
      attacker.kills = (attacker.kills || 0) + 1;
      this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
    }

    this.combatService.saveCombatParticipants(this.participants);
  }

  private applyDamageToDefender(
    defender: CombatParticipant,
    damage: number,
    location?: string
  ): { justDied: boolean; locationMaxed: boolean; locationEffect: string } {
    if (damage <= 0) return { justDied: false, locationMaxed: false, locationEffect: '' };

    let locationMaxed = false;
    let locationEffect = '';
    let locationFatal = false;

    const LOCATION_EFFECTS: { [location: string]: { label: string; fatal: boolean } } = {
      'Head':      { label: 'Instant Death', fatal: true  },
      'Chest':     { label: 'Incapacitated', fatal: false },
      'Abdomen':   { label: 'Incapacitated', fatal: false },
      'Right Arm': { label: 'Arm Useless',   fatal: false },
      'Left Arm':  { label: 'Arm Useless',   fatal: false },
      'Right Leg': { label: 'Leg Useless',   fatal: false },
      'Left Leg':  { label: 'Leg Useless',   fatal: false },
    };

    if (location) {
      if (!defender.locationDamage) defender.locationDamage = {};
      const prevDmg = defender.locationDamage[location] ?? 0;
      defender.locationDamage[location] = prevDmg + damage;

      const locMax = this.getLocationMaxHP(defender, location);
      if (locMax > 0 && defender.locationDamage[location] >= locMax && prevDmg < locMax) {
        locationMaxed = true;
        locationEffect = LOCATION_EFFECTS[location]?.label ?? '';
        locationFatal = LOCATION_EFFECTS[location]?.fatal ?? false;
      }
    }

    // Update overall HP
    const taken = defender.currentHitPoints.filter(hp => hp).length;
    const newTotal = taken + damage;

    if (newTotal >= defender.maxHitPoints) {
      defender.currentHitPoints.fill(true);
    } else {
      for (let i = 0; i < newTotal; i++) defender.currentHitPoints[i] = true;
    }

    // Update character HP if character participant
    if (defender.type === 'character' && defender.characterId) {
      const character = this.characterService.getCharacter(defender.characterId);
      if (character) {
        const newHP = character.derivedStats.totalHitPoints - damage;
        character.derivedStats.totalHitPoints = (locationFatal || newTotal >= defender.maxHitPoints && newHP > 0) ? 0 : newHP;
        this.characterService.updateCharacter(character);
      }
    }

    const justDied = !defender.isDead && (locationFatal || newTotal >= defender.maxHitPoints);
    if (justDied) {
      defender.isDead = true;
      if (locationFatal) defender.currentHitPoints.fill(true);
    }

    return { justDied, locationMaxed, locationEffect };
  }

  private getEffectiveAttackSkill(participant: CombatParticipant): number {
    let baseSkill = 0;
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characterService.getCharacter(participant.characterId);
      if (character) {
        const weapon = character.weapons.find(w => w.name === participant.selectedWeapon);
        baseSkill = weapon ? (character.skills[weapon.skill] || 0) : 0;
      }
    } else {
      baseSkill = 50;
    }
    return baseSkill + this.getTotalAttackBonus(participant);
  }

  private getTotalAttackBonus(participant: CombatParticipant): number {
    return this.getAttackerStrBonus(participant)
         + this.getAttackerIntBonus(participant)
         + this.getAttackerPowBonus(participant)
         + this.getAttackerDexBonus(participant);
  }

  private getAttackerStrBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characterService.getCharacter(participant.characterId!);
    return this.getAttackStrBonus(char?.stats.STR ?? 10);
  }

  private getAttackerIntBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characterService.getCharacter(participant.characterId!);
    return this.getAttackIntBonus(char?.stats.INT ?? 10);
  }

  private getAttackerPowBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characterService.getCharacter(participant.characterId!);
    return this.getAttackPowBonus(char?.stats.POW ?? 10);
  }

  private getAttackerDexBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characterService.getCharacter(participant.characterId!);
    return this.getAttackDexBonus(char?.stats.DEX ?? 10);
  }

  private getAttackStrBonus(str: number): number {
    if (str <= 4) return -5;
    if (str <= 8) return -5;
    if (str <= 12) return 0;
    if (str <= 16) return 5;
    if (str <= 20) return 10;
    return 10 + Math.floor((str - 20) / 4) * 5;
  }

  private getAttackIntBonus(int: number): number {
    if (int <= 4) return 0;
    if (int <= 8) return -10;
    if (int <= 12) return -5;
    if (int <= 16) return 5;
    if (int <= 20) return 10;
    return 10 + Math.floor((int - 20) / 4) * 5;
  }

  private getAttackPowBonus(pow: number): number {
    if (pow <= 12) return 0;
    if (pow <= 16) return 5;
    if (pow <= 20) return 5;
    return 5 + Math.floor((pow - 20) / 4) * 5;
  }

  private getAttackDexBonus(dex: number): number {
    if (dex <= 4) return -10;
    if (dex <= 8) return -5;
    if (dex <= 12) return 0;
    if (dex <= 16) return 5;
    if (dex <= 20) return 10;
    return 10 + Math.floor((dex - 20) / 4) * 5;
  }

  private getLocationMaxHP(participant: CombatParticipant, location: string): number {
    if (participant.type === 'character') {
      const character = this.characterService.getCharacter(participant.characterId!);
      return character?.hitLocations[location as keyof typeof character.hitLocations] ?? 0;
    }
    const locs = calculateHitLocations(participant.maxHitPoints, participant.maxHitPoints);
    return locs[location] ?? 0;
  }

  private rollLocation(): { roll: number; location: string } {
    const HIT_LOCATION_TABLE: { [roll: number]: string } = {
      1: 'Right Leg', 2: 'Right Leg', 3: 'Right Leg', 4: 'Right Leg',
      5: 'Left Leg',  6: 'Left Leg',  7: 'Left Leg',  8: 'Left Leg',
      9: 'Abdomen',  10: 'Abdomen',  11: 'Abdomen',
      12: 'Chest',
      13: 'Right Arm', 14: 'Right Arm', 15: 'Right Arm',
      16: 'Left Arm',  17: 'Left Arm',  18: 'Left Arm',
      19: 'Head', 20: 'Head',
    };
    const roll = Math.floor(Math.random() * 20) + 1;
    return { roll, location: HIT_LOCATION_TABLE[roll] };
  }

  private getWeaponDamage(participant: CombatParticipant): string {
    if (!participant.selectedWeapon) return '';
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characterService.getCharacter(participant.characterId);
      return character?.weapons.find(w => w.name === participant.selectedWeapon)?.damage || '';
    }
    return '0';
  }

  private getArmorValue(participant: CombatParticipant, location?: string): number {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characterService.getCharacter(participant.characterId);
      if (!character) return 0;
      if (location) {
        const locArmor = character.armor[location as keyof typeof character.armor];
        return locArmor !== undefined ? locArmor : 0;
      }
      const values = Object.values(character.armor);
      return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
    }
    return 0;
  }

  private endTurnAndAdvance(participantId: string): void {
    // Mark this participant as having acted (avoid duplicates)
    if (!this.mapState.movedThisRound.includes(participantId)) {
      this.mapState.movedThisRound.push(participantId);
    }
    this.saveState();

    // Advance to next active participant
    const activeIds = this.participants
      .filter(p => !p.isDead && !this.mapState.movedThisRound.includes(p.id))
      .map(p => p.id);

    if (activeIds.length > 0) {
      this.selectedParticipantId = activeIds[0];
      this.combatService.setActiveParticipantId(activeIds[0]);
    } else {
      // Round is over, reset moved tracking
      this.selectedParticipantId = null;
      this.combatService.setActiveParticipantId(null);
    }
  }

  private drawOpponentLines(): void {
    if (!this.opponentSvg || !this.gridArea) return;

    const svg = this.opponentSvg.nativeElement;
    const gridEl = this.gridArea.nativeElement;

    // Clear existing lines
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Get grid dimensions
    const gridRect = gridEl.getBoundingClientRect();
    svg.setAttribute('width', gridRect.width.toString());
    svg.setAttribute('height', gridRect.height.toString());

    // Find the grid cell size by looking at actual cells
    const firstCell = gridEl.querySelector('.grid-cell') as HTMLElement;
    if (!firstCell) return;

    const cellRect = firstCell.getBoundingClientRect();
    const cellSize = cellRect.width;

    // Draw lines between participants and their opponents
    for (const participant of this.participants) {
      if (!participant.selectedOpponentId) continue;

      const participantPos = this.mapState.positions[participant.id];
      const opponentPos = this.mapState.positions[participant.selectedOpponentId];

      if (!participantPos || !opponentPos) continue;

      const x1 = this.getCellPixelX(participantPos.x, cellSize, gridEl, gridRect);
      const y1 = this.getCellPixelY(participantPos.y, cellSize, gridEl, gridRect);
      const x2 = this.getCellPixelX(opponentPos.x, cellSize, gridEl, gridRect);
      const y2 = this.getCellPixelY(opponentPos.y, cellSize, gridEl, gridRect);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toString());
      line.setAttribute('y1', y1.toString());
      line.setAttribute('x2', x2.toString());
      line.setAttribute('y2', y2.toString());
      line.setAttribute('stroke', participant.color || '#888');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('opacity', '0.7');

      svg.appendChild(line);
    }
  }

  private getCellPixelX(col: number, cellSize: number, gridEl: HTMLElement, gridRect: DOMRect): number {
    // Find row label width (first cell in first row)
    const firstRowLabel = gridEl.querySelector('.row-label') as HTMLElement;
    const labelWidth = firstRowLabel ? firstRowLabel.offsetWidth : 20;

    // Find axis spacer (in col-axis)
    const axisSpacer = gridEl.querySelector('.axis-spacer') as HTMLElement;
    const spacerWidth = axisSpacer ? axisSpacer.offsetWidth : 20;

    // Grid cells start after the spacer
    const gridStartX = spacerWidth + labelWidth;
    return gridStartX + (col * cellSize) + (cellSize / 2);
  }

  private getCellPixelY(row: number, cellSize: number, gridEl: HTMLElement, gridRect: DOMRect): number {
    // Find col-axis height
    const colAxis = gridEl.querySelector('.col-axis') as HTMLElement;
    const axisHeight = colAxis ? colAxis.offsetHeight : 20;

    // Grid rows start after the column axis
    const gridStartY = axisHeight;
    return gridStartY + (row * cellSize) + (cellSize / 2);
  }
}
