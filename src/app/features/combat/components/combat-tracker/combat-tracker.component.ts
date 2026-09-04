import { Component, OnInit, OnDestroy, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CombatParticipant, Monster, DEFAULT_MONSTERS } from '@combat/models/combat.model';
import { Character } from '@characters/models/character.model';
import { calculateHitLocations, getSizeModifier, getDexterityModifier } from '@shared/rules/game-rules';
import { getRulesForSystem } from '@shared/rules/game-system-rules.factory';
import { Monster as BestiaryMonster, getMonsterCombatArmor } from '@bestiary/models/monster.model';
import { MONSTERS as BESTIARY_MONSTERS } from '@bestiary/constants/monsters.constants';
import { CharacterService } from '@characters/services/character.service';
import { CustomMonsterService } from '@bestiary/services/custom-monster.service';
import { CombatService } from '@combat/services/combat.service';
import { CombatLogService } from '@combat/services/combat-log.service';
import { SpellCastingService } from '@combat/services/spell-casting.service';
import { DiceService } from '@shared/services/dice.service';
import { CastableSpell } from '@shared/rules/spell-effects.model';
import { CharacterUpdateService } from '@characters/services/character-update.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { CharacterStats } from '@shared/models/character-stats.model';
import { parseDamageWithConditions } from '@combat/utils/damage-parser';
import { ToHitMechanic, ArmorModel, InitiativeMechanic } from '@shared/rules/game-system-rules.interface';
import { DocRefLinkComponent } from '@shared/components/doc-ref-link/doc-ref-link.component';


interface PendingAttack {
  attacker: CombatParticipant;
  defender: CombatParticipant;
  rawDamage: number;
  damageBreakdown: string;
  damageNotation: string;     // original dice notation (rerolled on Kal-Arath critical dodge failures)
  hitLocation: string | undefined;
  locationRoll: number | undefined;
  attackRoll: number;
  attackSkill: number;
  attackRollDisplay: string;  // formatted hit description for the modal
}

@Component({
  standalone: true,
  selector: 'app-combat-tracker',
  imports: [CommonModule, FormsModule, RouterLink, DocRefLinkComponent],
  templateUrl: './combat-tracker.component.html',
  styleUrl: './combat-tracker.component.css'
})
export class CombatTrackerComponent implements OnInit, OnDestroy {
  @ViewChildren('rollDamageBtn', { read: ElementRef }) rollButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChild('nextRoundBtn', { read: ElementRef }) nextRoundBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('takeHitBtn', { read: ElementRef }) takeHitBtn!: ElementRef<HTMLButtonElement>;

  characters: Character[] = [];
  monsters: Monster[] = [];
  defaultMonsters: Monster[] = [];
  bestiaryMonsters: Monster[] = [];
  customMonsters: Monster[] = [];
  combatParticipants: CombatParticipant[] = [];
  lastAttackerId: string | null = null;

  showAddParticipantModal = false;
  selectedEntityType: 'character' | 'monster' = 'character';
  selectedCharacterId = '';
  selectedMonsterId = '';
  selectedWeapon = '';
  addParticipantSurprised = false;

  lastDamageRolls: Map<string, { total: number; breakdown: string; finalDamage: number; armorAbsorbed: number; targetName: string; attackRollDisplay?: string }> = new Map();
  lastMissResult: Map<string, { targetName: string; attackRoll: number; attackSkill: number; display: string }> = new Map();
  showLogHistory = false;

  pendingAttack: PendingAttack | null = null;

  // ── Turn State Machine ───────────────────────────────────────────────────────
  currentRound = 0;
  activeTurnParticipantId: string | null = null;
  actedThisRound = new Set<string>();
  turnsStarted = false;
  strikeRankLocked = false;  // Locked once turns begin (prevents further movement/distance changes to SR)

  // ── Participant Collapse State ─────────────────────────────────────────────────
  collapsedParticipants = new Set<string>();

  get rules() { return this.gameSystemService.getRules(); }
  get hitLocationsOrder() { return this.rules.getHitLocationsDisplayOrder(); }
  private get armorModel(): ArmorModel {
    return this.rules.getArmorModel?.() ?? (this.rules.usesHitLocations() ? { kind: 'locations' } : { kind: 'flat' });
  }
  private get initiativeMechanic(): InitiativeMechanic {
    return this.rules.getInitiativeMechanic?.() ?? { kind: 'strike-rank' };
  }
  get usesRolledInitiative(): boolean { return this.initiativeMechanic.kind !== 'strike-rank'; }

  /** Which defensive reactions this system offers (Kal-Arath is dodge-only). */
  get defenseOptions(): { parry: boolean; dodge: boolean } {
    if (!this.rules.usesParryDodge()) return { parry: false, dodge: false };
    return this.rules.getDefenseOptions?.() ?? { parry: true, dodge: true };
  }

  private get toHitMechanic(): ToHitMechanic {
    return this.rules.getToHitMechanic?.() ?? { type: 'percentile' };
  }

  /** Roll weapon damage, honoring systems where damage dice explode (Kal-Arath). */
  private rollDamage(notation: string): { total: number; breakdown: string } {
    return this.diceService.rollDiceNotation(notation, { explode: this.rules.damageDiceExplode?.() ?? false });
  }

  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly SAVE_DELAY_MS = 300;

  constructor(
    private characterService: CharacterService,
    private customMonsterService: CustomMonsterService,
    private combatService: CombatService,
    private combatLogService: CombatLogService,
    private diceService: DiceService,
    private characterUpdateService: CharacterUpdateService,
    private spellCastingService: SpellCastingService,
    public gameSystemService: GameSystemService
  ) {}

  private get weaponList() { return this.gameSystemService.getRules().getWeaponList(); }
  private get shieldList() { return this.gameSystemService.getRules().getShieldList(); }
  private canWeaponParry(weaponName: string): boolean {
    return this.weaponList.find(w => w.name === weaponName)?.canParry ?? false;
  }

  get combatLog() {
    return this.combatLogService.getEntries();
  }

  // ── Strike Rank Helpers ──────────────────────────────────────────────────────

  private debouncedSaveCombat(): void {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.combatService.saveCombatParticipants(this.combatParticipants);
      this.saveTimeout = null;
    }, this.SAVE_DELAY_MS);
  }

  private flushPendingSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.combatService.saveCombatParticipants(this.combatParticipants);
      this.saveTimeout = null;
    }
  }

  private updateParticipantSR(participant: CombatParticipant): void {
    const mapState = this.combatService.getCombatMapState();
    participant.effectiveSR = this.combatService.calculateEffectiveSR(participant, this.combatParticipants, mapState);
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(this.combatParticipants);
    this.debouncedSaveCombat();
  }

  private updateAllParticipantsSR(): void {
    const mapState = this.combatService.getCombatMapState();
    this.combatParticipants.forEach(p => {
      p.effectiveSR = this.combatService.calculateEffectiveSR(p, this.combatParticipants, mapState);
    });
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(this.combatParticipants);
    this.debouncedSaveCombat();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.flushPendingSave();
  }

  loadData(): void {
    const system = this.gameSystemService.gameSystem();
    this.characters = this.characterService.getCharacters()
      .filter(c => (c.gameSystem ?? 'runequest') === system);
    this.castableSpellsCache.clear();
    this.defaultMonsters = this.gameSystemService.getRules().usesHitLocations()
      ? structuredClone(DEFAULT_MONSTERS) : [];
    this.bestiaryMonsters = BESTIARY_MONSTERS
      .filter(m => m.gameSystem === system)
      .map(m => this.convertBestiaryMonster(m));
    this.customMonsters = this.customMonsterService.getMonsters()
      .filter(m => m.gameSystem === system)
      .map(m => this.convertBestiaryMonster(m));
    const savedCombatMonsters = this.combatService.getMonsters();
    this.monsters = [
      ...this.defaultMonsters,
      ...this.bestiaryMonsters,
      ...this.customMonsters,
      ...savedCombatMonsters
    ];
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(
      this.combatService.getCombatParticipants()
    );
    // Restore combat state from persistent storage
    this.currentRound = this.combatService.getCurrentRound();
    const activeId = this.combatService.getActiveParticipantId();
    if (activeId && this.combatParticipants.find(p => p.id === activeId)) {
      this.activeTurnParticipantId = activeId;
      this.turnsStarted = true;
    }
    this.autoAssignOpponentsIfNeeded();
  }

  getAliveCharacters(): Character[] {
    return this.characters.filter(c => c.derivedStats.totalHitPoints > 0);
  }

  openAddParticipantModal(): void {
    this.showAddParticipantModal = true;
    this.selectedEntityType = 'character';
    this.selectedCharacterId = '';
    this.selectedMonsterId = '';
    this.selectedWeapon = '';
  }

  closeAddParticipantModal(): void {
    this.showAddParticipantModal = false;
    this.addParticipantSurprised = false;
  }
  onEntityTypeChange(): void {
    this.selectedCharacterId = '';
    this.selectedMonsterId = '';
    this.selectedWeapon = '';
  }

  setEntityType(type: 'character' | 'monster'): void {
    if (this.selectedEntityType === type) return;
    this.selectedEntityType = type;
    this.onEntityTypeChange();
  }

  onCharacterSelect(): void {
    const character = this.characters.find(c => c.id === this.selectedCharacterId);
    if (character?.weapons.length) this.selectedWeapon = character.weapons[0].name;
  }

  onMonsterSelect(): void {
    const monster = this.monsters.find(m => m.id === this.selectedMonsterId);
    if (monster?.weapons.length) this.selectedWeapon = monster.weapons[0].name;
  }

  getAvailableWeapons(): string[] {
    if (this.selectedEntityType === 'character' && this.selectedCharacterId) {
      return this.characters.find(c => c.id === this.selectedCharacterId)?.weapons.map(w => w.name) || [];
    }
    if (this.selectedEntityType === 'monster' && this.selectedMonsterId) {
      return this.monsters.find(m => m.id === this.selectedMonsterId)?.weapons.map(w => w.name) || [];
    }
    return [];
  }

  addParticipant(): void {
    if (this.selectedEntityType === 'character' && this.selectedCharacterId) {
      const character = this.characters.find(c => c.id === this.selectedCharacterId);
      if (!character) return;

      const baseStrikeRank = character.derivedStats.strikeRank;
      const finalStrikeRank = this.combatService.calculateFinalInitiative(baseStrikeRank, this.selectedWeapon);
      const maxHP = character.derivedStats.maxHitPoints || character.derivedStats.totalHitPoints;
      const currentHP = character.derivedStats.totalHitPoints;
      const damageTaken = Math.max(0, maxHP - currentHP);

      const hpArray = new Array(maxHP).fill(false);
      for (let i = 0; i < damageTaken; i++) hpArray[i] = true;

      const participant: CombatParticipant = {
        id: this.combatService.generateId(),
        name: character.name,
        type: 'character',
        characterId: character.id,
        maxHitPoints: maxHP,
        currentHitPoints: hpArray,
        baseStrikeRank,
        selectedWeapon: this.selectedWeapon,
        selectedParryItem: this.selectedWeapon,
        finalStrikeRank,
        isDead: currentHP <= 0,
        kills: 0,
        color: character.color || '#3498db',
        locationDamage: {},
        distanceToOpponent: 0,
        movementThisRound: 0,
        isSurprised: this.addParticipantSurprised,
        movementRate: character.derivedStats.movementRate ?? 8
      };
      this.combatParticipants.push(participant);
    } else if (this.selectedEntityType === 'monster' && this.selectedMonsterId) {
      const monster = this.monsters.find(m => m.id === this.selectedMonsterId);
      if (!monster) return;

      const baseStrikeRank = monster.strikeRank;
      const weapon = monster.weapons.find(w => w.name === this.selectedWeapon);
      const finalStrikeRank = baseStrikeRank + (weapon?.strikeRankModifier || 0);

      const participant: CombatParticipant = {
        id: this.combatService.generateId(),
        name: monster.name,
        type: 'monster',
        monsterId: monster.id,
        maxHitPoints: monster.hitPoints,
        currentHitPoints: new Array(monster.hitPoints).fill(false),
        baseStrikeRank,
        selectedWeapon: this.selectedWeapon,
        selectedParryItem: this.selectedWeapon,
        finalStrikeRank,
        isDead: false,
        kills: 0,
        color: '#000000',
        locationDamage: {},
        distanceToOpponent: 0,
        movementThisRound: 0,
        isSurprised: this.addParticipantSurprised,
        movementRate: 8
      };
      this.combatParticipants.push(participant);
    }

    this.updateAllParticipantsSR();
    this.autoAssignOpponentsIfNeeded();
    this.closeAddParticipantModal();
  }

  removeParticipant(id: string): void {
    this.combatParticipants = this.combatParticipants.filter(p => p.id !== id);
    this.combatParticipants.forEach(p => {
      if (p.selectedOpponentId === id) p.selectedOpponentId = undefined;
    });
    this.autoAssignOpponentsIfNeeded();
    this.debouncedSaveCombat();
  }

  onWeaponChange(participant: CombatParticipant): void {
    if (participant.type === 'character') {
      participant.finalStrikeRank = this.combatService.calculateFinalInitiative(
        participant.baseStrikeRank, participant.selectedWeapon
      );
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedWeapon);
      participant.finalStrikeRank = participant.baseStrikeRank + (weapon?.strikeRankModifier || 0);
    }
    if (!this.isValidParryItem(participant)) {
      const validItems = this.getParticipantParryItems(participant);
      participant.selectedParryItem = validItems.length > 0 ? validItems[0] : '';
    }
    this.updateParticipantSR(participant);
  }

  toggleHitPoint(participant: CombatParticipant, index: number): void {
    participant.currentHitPoints[index] = !participant.currentHitPoints[index];
    this.debouncedSaveCombat();
  }

  getHitPointsRemaining(participant: CombatParticipant): number {
    return participant.maxHitPoints - participant.currentHitPoints.filter(hp => hp).length;
  }

  getHitPointsDisplay(participant: CombatParticipant): string {
    return `${this.getHitPointsRemaining(participant)} / ${participant.maxHitPoints}`;
  }

  clearCombat(): void {
    if (confirm('Clear all combat participants? (Combat log will be saved to history)')) {
      if (this.combatLog.length > 0) this.combatService.saveCombatLog(this.combatLog);
      this.combatParticipants = [];
      this.combatService.clearAllCombatState();
      this.combatLogService.clearLog();
      this.lastDamageRolls.clear();
      this.pendingAttack = null;
      this.clearTurns();
      this.currentRound = 0;
    }
  }

  saveCombat(): void {
    this.combatService.saveCombatParticipants(this.combatParticipants);
  }


  isCustomMonster(monsterId: string): boolean {
    return !DEFAULT_MONSTERS.find(m => m.id === monsterId)
      && !monsterId.startsWith('bestiary-');
  }

  private convertBestiaryMonster(bm: BestiaryMonster): Monster {
    return {
      id: `bestiary-${bm.id}`,
      name: bm.name,
      hitPoints: bm.hitPoints,
      // The SIZ/DEX strike-rank formula is RuneQuest-only; BRP orders by pure DEX
      // (rank = 20 − DEX so ascending sort puts the highest DEX first); other
      // systems roll initiative
      strikeRank: this.rules.usesStrikeRank()
        ? (this.gameSystemService.gameSystem() === 'brp'
            ? Math.max(0, 20 - bm.stats.DEX)
            : getSizeModifier(bm.stats.SIZ) + getDexterityModifier(bm.stats.DEX))
        : 0,
      armor: getMonsterCombatArmor(bm, this.gameSystemService.gameSystem()),
      weapons: bm.attacks.map(a => ({
        name: a.name,
        damage: a.damage,
        strikeRankModifier: 0
      }))
    };
  }

  getParticipantWeapons(participant: CombatParticipant): string[] {
    if (participant.type === 'character' && participant.characterId) {
      return this.characters.find(c => c.id === participant.characterId)?.weapons.map(w => w.name) || [];
    }
    if (participant.type === 'monster' && participant.monsterId) {
      return this.monsters.find(m => m.id === participant.monsterId)?.weapons.map(w => w.name) || [];
    }
    return [];
  }

  getWeaponDamage(participant: CombatParticipant): string {
    if (!participant.selectedWeapon) return '';
    if (participant.type === 'character' && participant.characterId) {
      return this.characters.find(c => c.id === participant.characterId)
        ?.weapons.find(w => w.name === participant.selectedWeapon)?.damage || '';
    }
    if (participant.type === 'monster' && participant.monsterId) {
      return this.monsters.find(m => m.id === participant.monsterId)
        ?.weapons.find(w => w.name === participant.selectedWeapon)?.damage || '';
    }
    return '';
  }

  // ── Hit location system ──────────────────────────────────────────────────

  rollLocation(): { roll: number; location: string } {
    const roll = Math.floor(Math.random() * 20) + 1;
    return { roll, location: this.rules.getHitLocationRollTable()![roll] };
  }

  getLocationMaxHP(participant: CombatParticipant, location: string): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      return character?.hitLocations[location] ?? 0;
    }
    // Monsters: derive from total HP using the standard RQ ratios
    const locs = calculateHitLocations(participant.maxHitPoints);
    return locs[location] ?? 0;
  }

  getLocationDamage(participant: CombatParticipant, location: string): number {
    return participant.locationDamage?.[location] ?? 0;
  }

  getLocationCurrentHP(participant: CombatParticipant, location: string): number {
    return Math.max(0, this.getLocationMaxHP(participant, location) - this.getLocationDamage(participant, location));
  }

  isLocationMaxed(participant: CombatParticipant, location: string | undefined): boolean {
    if (!location) return false;
    return this.getLocationDamage(participant, location) >= this.getLocationMaxHP(participant, location)
      && this.getLocationMaxHP(participant, location) > 0;
  }

  getLocationEffectLabel(location: string | undefined): string {
    if (!location) return '';
    return this.rules.getLocationEffects()?.[location]?.label ?? '';
  }

  isLocationFatal(location: string | undefined): boolean {
    if (!location) return false;
    return this.rules.getLocationEffects()?.[location]?.fatal ?? false;
  }

  getLocationStatusClass(participant: CombatParticipant, location: string): string {
    const maxed = this.isLocationMaxed(participant, location);
    if (!maxed) {
      return this.getLocationDamage(participant, location) > 0 ? 'loc-damaged' : 'loc-healthy';
    }
    return this.rules.getLocationEffects()?.[location]?.fatal ? 'loc-fatal' : 'loc-useless';
  }

  getLocationShortName(location: string): string {
    const map: { [k: string]: string } = {
      'Head': 'Head', 'Chest': 'Chest', 'Abdomen': 'Abdomen',
      'Right Arm': 'R. Arm', 'Left Arm': 'L. Arm',
      'Right Leg': 'R. Leg', 'Left Leg': 'L. Leg',
    };
    return map[location] ?? location;
  }

  // ── Rate of fire ─────────────────────────────────────────────────────────

  getWeaponRateOfFire(participant: CombatParticipant): number {
    const def = this.weaponList.find(w => w.name === participant.selectedWeapon);
    if (!def?.isMissile) return this.getMeleeAttacksAllowed(participant);
    return def.rateOfFire ?? 1;
  }

  // Melee attacks allowed this round: multi-attack systems (OSRIC fighter
  // progression) provide a per-round count; others are unlimited within the
  // pendingAttack constraint.
  private getMeleeAttacksAllowed(participant: CombatParticipant): number {
    if (!this.rules.getMeleeAttacksPerRound) return Infinity;
    const round = Math.max(1, this.currentRound); // before Start Turns, treat as round 1
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      return this.rules.getMeleeAttacksPerRound(
        character?.background?.occupation, character?.resources?.level ?? 1, round
      );
    }
    return this.rules.getMeleeAttacksPerRound(undefined, 1, round);
  }

  hasAttacksRemaining(participant: CombatParticipant): boolean {
    const rof = this.getWeaponRateOfFire(participant);
    if (!isFinite(rof)) return true;
    return (participant.attacksUsed ?? 0) < rof;
  }

  getWeaponMissileInfo(participant: CombatParticipant): { range: string; rof: number } | null {
    const def = this.weaponList.find(w => w.name === participant.selectedWeapon);
    if (!def?.isMissile) return null;
    return { range: def.range ?? '-', rof: def.rateOfFire ?? 1 };
  }

  // Shown only for multi-attack melee combatants (e.g. high-level OSRIC fighters).
  getMeleeAttackInfo(participant: CombatParticipant): { allowed: number } | null {
    const def = this.weaponList.find(w => w.name === participant.selectedWeapon);
    if (def?.isMissile) return null;
    const allowed = this.getMeleeAttacksAllowed(participant);
    if (!isFinite(allowed) || allowed <= 1) return null;
    return { allowed };
  }

  resetRound(): void {
    this.clearTurns();
    this.combatParticipants.forEach(p => {
      p.attacksUsed = 0;
      p.parriesAgainst = {};
      p.movementThisRound = 0;
      p.isSurprised = false;
    });
    this.pendingAttack = null;
    this.updateAllParticipantsSR();
    if (this.currentRound > 0) this.currentRound++;
  }

  // ── Turn State Machine ──────────────────────────────────────────────────────

  getActiveTurnParticipant(): CombatParticipant | null {
    if (!this.activeTurnParticipantId) return null;
    return this.combatParticipants.find(p => p.id === this.activeTurnParticipantId) ?? null;
  }

  startTurns(): void {
    this.currentRound++;
    this.combatService.setCurrentRound(this.currentRound);
    // Rolled-initiative systems re-roll every round (OSRIC per-side d6,
    // Dragonbane card redraw, Kal-Arath d6+AGI, Mothership Speed check)
    if (this.usesRolledInitiative) this.rollInitiative();
    this.actedThisRound.clear();
    this.turnsStarted = true;
    this.strikeRankLocked = true;  // Lock SR once turns begin
    this.activeTurnParticipantId = null;
    this.advanceTurn();
    // advanceTurn() handles all focus management
  }

  advanceTurn(): void {
    const eligible = this.combatParticipants.filter(
      p => this.canParticipantAct(p) && !this.actedThisRound.has(p.id)
    );
    if (eligible.length === 0) {
      this.activeTurnParticipantId = null;
      this.combatService.setActiveParticipantId(null);
      this.focusNextRoundButton();
      return;
    }
    this.activeTurnParticipantId = eligible[0].id;
    this.combatService.setActiveParticipantId(this.activeTurnParticipantId);
    setTimeout(() => {
      const el = document.querySelector(`[data-participant-id="${this.activeTurnParticipantId}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      this.focusActiveParticipantRollButton();
    }, 0);
  }

  endTurn(participantId: string): void {
    if (!this.turnsStarted) return;
    this.actedThisRound.add(participantId);
    if (this.activeTurnParticipantId === participantId) {
      // Focus the "Next Turn →" button after participant acts
      this.focusNextTurnButton();
    }
  }

  clearTurns(): void {
    this.activeTurnParticipantId = null;
    this.combatService.setActiveParticipantId(null);
    this.actedThisRound.clear();
    this.turnsStarted = false;
    this.strikeRankLocked = false;
    this.combatService.clearInitiative(this.combatParticipants);
    this.debouncedSaveCombat();
  }

  isActiveTurn(participantId: string): boolean {
    return this.activeTurnParticipantId === participantId;
  }

  hasActed(participantId: string): boolean {
    return this.actedThisRound.has(participantId);
  }

  isRoundComplete(): boolean {
    return this.turnsStarted &&
      this.activeTurnParticipantId === null &&
      this.combatParticipants.some(p => this.canParticipantAct(p));
  }

  private focusActiveParticipantRollButton(): void {
    if (!this.activeTurnParticipantId) return;
    // Find the roll button for the active participant
    const buttons = this.rollButtons.toArray();
    const activeButton = buttons.find(btn =>
      btn.nativeElement.getAttribute('data-participant-id') === this.activeTurnParticipantId
    );
    if (activeButton) {
      setTimeout(() => activeButton.nativeElement.focus(), 0);
    }
  }

  private focusNextTurnButton(): void {
    // Focus the "Next Turn →" button after a participant acts
    setTimeout(() => {
      const buttons = document.querySelectorAll('button.btn-turn-next');
      // The Next Turn button contains the arrow and calls advanceTurn()
      const nextTurnBtn = Array.from(buttons).find(btn =>
        btn.textContent?.includes('→')
      ) as HTMLButtonElement | undefined;

      if (nextTurnBtn) {
        nextTurnBtn.focus();
      }
    }, 50);
  }

  private focusNextRoundButton(): void {
    // Wait for DOM to update and find the "Next Round" button
    setTimeout(() => {
      const buttons = document.querySelectorAll('button.btn-turn-next');
      // The Next Round button appears when isRoundComplete() is true
      // It's the one that calls startTurns() with text "Next Round"
      const nextRoundBtn = Array.from(buttons).find(btn =>
        btn.textContent?.trim() === 'Next Round'
      ) as HTMLButtonElement | undefined;

      if (nextRoundBtn) {
        nextRoundBtn.focus();
      }
    }, 100);
  }

  toggleCollapseParticipant(participantId: string): void {
    if (this.collapsedParticipants.has(participantId)) {
      this.collapsedParticipants.delete(participantId);
    } else {
      this.collapsedParticipants.add(participantId);
    }
  }

  isParticipantCollapsed(participantId: string): boolean {
    // Auto-collapse non-active participants during turn tracking
    if (this.turnsStarted && this.activeTurnParticipantId !== null && this.activeTurnParticipantId !== participantId) {
      return true;
    }
    return this.collapsedParticipants.has(participantId);
  }

  updateMovement(participant: CombatParticipant): void {
    if (!this.strikeRankLocked) {
      this.updateParticipantSR(participant);
    }
  }

  toggleSurprise(participant: CombatParticipant): void {
    participant.isSurprised = !participant.isSurprised;
    // Sync surprise status across team
    const teamType = participant.type;
    this.combatParticipants.forEach(p => {
      if (p.type === teamType) {
        p.isSurprised = participant.isSurprised;
      }
    });
    if (!this.strikeRankLocked) {
      this.updateAllParticipantsSR();
    }
  }

  getMovementSRCost(participant: CombatParticipant): number {
    return this.combatService.calculateMovementSRCost(participant.movementThisRound ?? 0);
  }

  getSurpriseDistancePenalty(participant: CombatParticipant): number {
    if (!participant.isSurprised) return 0;
    const mapState = this.combatService.getCombatMapState();
    const opponentDistance = this.combatService.getOpponentDistance(participant, this.combatParticipants, mapState);
    return this.combatService.calculateSurpriseDistancePenalty(participant.isSurprised, opponentDistance);
  }

  getOpponentDistanceDisplay(participant: CombatParticipant): number {
    if (!participant.isSurprised) return 0;
    const mapState = this.combatService.getCombatMapState();
    const opponentDistance = this.combatService.getOpponentDistance(participant, this.combatParticipants, mapState);
    return opponentDistance;
  }

  getDisplaySR(participant: CombatParticipant): number {
    return participant.effectiveSR ?? participant.finalStrikeRank;
  }

  // ── Rolled initiative (non-strike-rank systems) ──────────────────────────

  getInitiativeDisplay(participant: CombatParticipant): string {
    if (!this.usesRolledInitiative) return String(this.getDisplaySR(participant));
    return participant.initiativeDisplay ?? '—';
  }

  isSrModified(participant: CombatParticipant): boolean {
    return !this.usesRolledInitiative && this.getDisplaySR(participant) !== participant.finalStrikeRank;
  }

  rollInitiative(): void {
    if (!this.usesRolledInitiative) return;
    const lines = this.combatService.rollInitiativeForRound(
      this.combatParticipants, this.initiativeMechanic, p => this.getParticipantStats(p)
    );
    lines.forEach(l => this.combatLogService.addEntry(l));
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(this.combatParticipants);
    this.saveCombat();
  }

  // ── Attack flow ──────────────────────────────────────────────────────────

  rollWeaponDamage(participant: CombatParticipant): void {
    const damage = this.getWeaponDamage(participant);
    if (!damage || participant.isDead) return;

    if (!participant.selectedOpponentId) {
      alert('Please select an opponent first!');
      return;
    }
    const opponent = this.combatParticipants.find(p => p.id === participant.selectedOpponentId);
    if (!opponent || opponent.isDead) {
      alert('Selected opponent is not available!');
      return;
    }

    // Check distance-based weapon restrictions
    const distanceResult = this.checkDistanceWeaponRestriction(participant, opponent);
    if (distanceResult.blocked) {
      alert(distanceResult.message);
      return;
    }

    this.lastAttackerId = participant.id;

    // Consume one shot for missile weapons (miss or hit, shot is spent)
    const rof = this.getWeaponRateOfFire(participant);
    if (isFinite(rof)) {
      participant.attacksUsed = (participant.attacksUsed ?? 0) + 1;
    }

    const mechanic: ToHitMechanic = this.rules.getToHitMechanic?.() ?? { type: 'percentile' };

    // ── OSRIC: d20 + bonus vs defender's Armor Class ─────────────────────────
    if (mechanic.type === 'd20-over-ac') {
      const isRanged = this.weaponList.find(w => w.name === participant.selectedWeapon)?.isMissile ?? false;
      const stats = this.getParticipantStats(participant);
      const attackBonus = stats ? (this.rules.getD20AttackBonus?.(stats, isRanged) ?? 0) : 0;
      const d20Roll = Math.floor(Math.random() * 20) + 1;
      const defenderAC = this.getDefenderAC(opponent);
      const thac0 = this.getAttackerThac0(participant);
      const targetRoll = thac0 - defenderAC;
      const isHit = (d20Roll + attackBonus) >= targetRoll;

      const bonusStr = attackBonus > 0 ? `+${attackBonus}` : attackBonus < 0 ? `${attackBonus}` : '';
      const rollDisplay = bonusStr ? `${d20Roll}${bonusStr}=${d20Roll + attackBonus}` : `${d20Roll}`;
      const hitDisplay = `d20: ${rollDisplay} vs AC ${defenderAC} (THAC0 ${thac0})`;

      if (!isHit) {
        this.combatLogService.addEntry(
          `[MISS] ${participant.name} → ${opponent.name}: missed! (${hitDisplay}, needed ${targetRoll}+)`
        );
        this.lastMissResult.set(participant.id, {
          targetName: opponent.name, attackRoll: d20Roll, attackSkill: targetRoll,
          display: `${hitDisplay}, needed ${targetRoll}+`
        });
        this.saveCombat();
        this.focusNextRollButton();
        if (!this.hasAttacksRemaining(participant)) this.endTurn(participant.id);
        return;
      }

      const result = this.rollDamage(damage);
      this.pendingAttack = {
        attacker: participant, defender: opponent,
        rawDamage: result.total, damageBreakdown: result.breakdown, damageNotation: damage,
        hitLocation: undefined, locationRoll: undefined,
        attackRoll: d20Roll, attackSkill: targetRoll,
        attackRollDisplay: `${hitDisplay} — hit!`,
      };
      if (!this.hasAttacksRemaining(participant)) this.endTurn(participant.id);
      this.lastMissResult.delete(participant.id);
      if (!this.rules.usesParryDodge()) { this.resolveNoDefense(); return; }
      setTimeout(() => this.takeHitBtn?.nativeElement?.focus(), 0);
      return;
    }

    // ── Dragonbane: d20 roll-under skill ─────────────────────────────────────
    if (mechanic.type === 'd20-under') {
      const attackSkill = this.getEffectiveAttackSkill(participant);
      const attackRoll = Math.floor(Math.random() * 20) + 1;
      const isHit = attackRoll <= attackSkill;
      const hitDisplay = `d20: ${attackRoll} vs ${attackSkill}`;

      if (!isHit) {
        this.combatLogService.addEntry(
          `[MISS] ${participant.name} → ${opponent.name}: missed! (${hitDisplay})`
        );
        this.lastMissResult.set(participant.id, {
          targetName: opponent.name, attackRoll, attackSkill,
          display: hitDisplay
        });
        this.saveCombat();
        this.focusNextRollButton();
        this.endTurn(participant.id);
        return;
      }

      const result = this.rollDamage(damage);
      this.pendingAttack = {
        attacker: participant, defender: opponent,
        rawDamage: result.total, damageBreakdown: result.breakdown, damageNotation: damage,
        hitLocation: undefined, locationRoll: undefined,
        attackRoll, attackSkill,
        attackRollDisplay: `${hitDisplay} — hit!`,
      };
      this.endTurn(participant.id);
      this.lastMissResult.delete(participant.id);
      if (!this.rules.usesParryDodge()) { this.resolveNoDefense(); return; }
      setTimeout(() => this.takeHitBtn?.nativeElement?.focus(), 0);
      return;
    }

    // ── Kal-Arath: 2d6 + stat ≥ target (double-6 crit, double-1 fumble) ──────
    if (mechanic.type === '2d6-over') {
      const attackSkill = this.getEffectiveAttackSkill(participant);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2 + attackSkill;
      const isCrit = d1 === 6 && d2 === 6;
      const isFumble = d1 === 1 && d2 === 1;
      const isHit = isCrit || (!isFumble && total >= mechanic.target);
      const isRanged = this.weaponList.find(w => w.name === participant.selectedWeapon)?.isMissile ?? false;
      const statLabel = isRanged ? mechanic.missileStatLabel : mechanic.meleeStatLabel;
      const skillStr = attackSkill > 0 ? `+${attackSkill}` : attackSkill < 0 ? `${attackSkill}` : '';
      const hitDisplay = `2d6+${statLabel}: ${d1}+${d2}${skillStr} = ${total} vs ${mechanic.target}+`;

      if (!isHit) {
        const missTag = isFumble ? '[FUMBLE]' : '[MISS]';
        const missText = isFumble ? 'double 1s — automatic miss!' : 'missed!';
        this.combatLogService.addEntry(
          `${missTag} ${participant.name} → ${opponent.name}: ${missText} (${hitDisplay})`
        );
        this.lastMissResult.set(participant.id, {
          targetName: opponent.name, attackRoll: d1 + d2, attackSkill,
          display: isFumble ? `${hitDisplay} — FUMBLE (double 1s)` : hitDisplay
        });
        this.saveCombat();
        this.focusNextRollButton();
        this.endTurn(participant.id);
        return;
      }

      // Critical success doubles the damage dice: roll the notation twice.
      const result = this.rollDamage(damage);
      let rawDamage = result.total;
      let damageBreakdown = result.breakdown;
      if (isCrit) {
        const critRoll = this.rollDamage(damage);
        rawDamage += critRoll.total;
        damageBreakdown = `${result.breakdown} + ${critRoll.breakdown} (CRIT — dice doubled)`;
      }
      this.pendingAttack = {
        attacker: participant, defender: opponent,
        rawDamage, damageBreakdown, damageNotation: damage,
        hitLocation: undefined, locationRoll: undefined,
        attackRoll: d1 + d2, attackSkill,
        attackRollDisplay: isCrit ? `${hitDisplay} — CRITICAL HIT (double 6s)!` : `${hitDisplay} — hit!`,
      };
      this.endTurn(participant.id);
      this.lastMissResult.delete(participant.id);
      if (!this.rules.usesParryDodge()) { this.resolveNoDefense(); return; }
      setTimeout(() => this.takeHitBtn?.nativeElement?.focus(), 0);
      return;
    }

    // ── Percentile: d100 roll-under (RuneQuest skill %, Mothership Combat stat) ──
    const checkLabel = mechanic.type === 'percentile-under-stat' ? `${mechanic.statLabel} check: ` : '';
    const attackSkill = this.getEffectiveAttackSkill(participant);
    const attackRoll = Math.floor(Math.random() * 100) + 1;

    if (attackRoll > attackSkill) {
      const totalBonus = this.getTotalAttackBonus(participant);
      const baseSkill = attackSkill - totalBonus;
      const bonusParts = totalBonus > 0 ? `+${totalBonus} bonus` : '';
      const hitDisplay = `${checkLabel}rolled ${attackRoll} vs ${attackSkill}%` +
        (bonusParts ? ` (${baseSkill} skill ${bonusParts})` : '');
      this.combatLogService.addEntry(
        `[MISS] ${participant.name} → ${opponent.name}: attack failed! (${hitDisplay})`
      );
      this.lastMissResult.set(participant.id, {
        targetName: opponent.name, attackRoll, attackSkill,
        display: hitDisplay
      });
      this.saveCombat();
      this.focusNextRollButton();
      this.endTurn(participant.id);
      return;
    }

    const result = this.rollDamage(damage);
    const usesLocations = this.gameSystemService.getRules().usesHitLocations();
    const { roll, location } = usesLocations ? this.rollLocation() : { roll: undefined, location: undefined };

    this.pendingAttack = {
      attacker: participant, defender: opponent,
      rawDamage: result.total, damageBreakdown: result.breakdown, damageNotation: damage,
      hitLocation: location, locationRoll: roll,
      attackRoll, attackSkill,
      attackRollDisplay: `${checkLabel}Rolled ${attackRoll} vs ${attackSkill}%`,
    };
    this.endTurn(participant.id);
    this.lastMissResult.delete(participant.id);
    if (!this.rules.usesParryDodge()) { this.resolveNoDefense(); return; }
    setTimeout(() => this.takeHitBtn?.nativeElement?.focus(), 0);
  }

  resolveNoDefense(): void {
    if (!this.pendingAttack) return;
    const { attacker, defender, rawDamage, damageBreakdown, hitLocation, locationRoll, attackRoll, attackRollDisplay } = this.pendingAttack;
    const locationInfo = hitLocation ? ` (d20:${locationRoll} = ${hitLocation})` : '';

    let armor: number;
    let finalDamage: number;
    let armorInfo: string;
    if (this.armorModel.kind === 'save') {
      // Mothership: opposed check. The attack already succeeded; the defender rolls
      // an Armor Save. If the save also succeeds, the higher successful roll wins.
      const target = this.getArmorSaveTarget(defender);
      const saveRoll = Math.floor(Math.random() * 100) + 1;
      const saveSucceeded = saveRoll <= target;
      const attackWins = !saveSucceeded || attackRoll > saveRoll;
      finalDamage = attackWins ? rawDamage : 0;
      armor = attackWins ? 0 : rawDamage;
      armorInfo = ` — Armor Save: ${saveRoll} vs ${target}%` + (
        !saveSucceeded ? ` — failed, ${rawDamage}`
        : attackWins ? ` — saved, but attack ${attackRoll} beats save ${saveRoll} — ${rawDamage}`
        : ' — SAVED, 0'
      );
    } else {
      armor = this.getArmorValue(defender, hitLocation);
      finalDamage = Math.max(0, rawDamage - armor);
      armorInfo = armor > 0 ? ` - ${armor} armor = ${finalDamage}` : ` = ${finalDamage}`;
    }
    const toHitInfo = attackRollDisplay ? ` [${attackRollDisplay}]` : '';
    this.combatLogService.addEntry(
      `[ATTACK] ${attacker.name} → ${defender.name}${toHitInfo}${locationInfo}: ${rawDamage} (${damageBreakdown})${armorInfo} damage`
    );

    const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(defender, finalDamage, hitLocation);

    if (locationMaxed) {
      this.combatLogService.addEntry(`[WOUND] ${defender.name}'s ${hitLocation} — ${locationEffect}!`);
    }
    if (justDied) {
      attacker.kills = (attacker.kills || 0) + 1;
      this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
    }

    // Apply creature conditions (disease, poison, etc.) if attacker has them
    this.applyCreatureConditions(defender, attacker);

    this.lastDamageRolls.set(attacker.id, {
      total: rawDamage, breakdown: damageBreakdown,
      finalDamage, armorAbsorbed: armor, targetName: defender.name,
      attackRollDisplay,
    });

    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  isValidParryItem(participant: CombatParticipant): boolean {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return false;
      const parryItem = participant.selectedParryItem;
      if (!parryItem) return false;
      const shield = character.shields?.find(s => s.name === parryItem);
      if (shield) return true;
      const weapon = character.weapons.find(w => w.name === parryItem);
      return weapon ? this.canWeaponParry(weapon.name) : false;
    }
    const monster = this.monsters.find(m => m.id === participant.monsterId);
    if (!monster) return false;
    const parryItem = participant.selectedParryItem;
    return monster.weapons.some(w => w.name === parryItem && this.canWeaponParry(w.name));
  }

  getParryRestrictionReason(weaponName: string): string {
    const weapon = this.weaponList.find(w => w.name === weaponName);
    if (!weapon) return '';
    if (weapon.canParry) return '';
    if (weapon.isMissile) return 'Ranged weapons cannot parry';
    if (weapon.name.includes('Greatsword') || weapon.name.includes('Great') ||
        weapon.name.includes('Pike') || weapon.name.includes('Maul') ||
        weapon.name.includes('Halberd')) {
      return 'Two-handed weapons require both hands and cannot parry';
    }
    if (weapon.defaultSkill === 'Unarmed') return 'Unarmed attacks cannot parry';
    return 'This weapon cannot parry';
  }

  resolveParry(): void {
    if (!this.pendingAttack) return;
    const { attacker, defender, rawDamage, damageBreakdown, hitLocation, locationRoll } = this.pendingAttack;
    const locationInfo = hitLocation ? ` → ${hitLocation} (d20:${locationRoll})` : '';

    if (!this.isValidParryItem(defender)) {
      this.combatLogService.addEntry(
        `[ERROR] ${defender.name} cannot parry with ${defender.selectedParryItem}!`
      );
      this.pendingAttack = null;
      this.saveCombat();
      return;
    }

    // ── Dragonbane: d20 ≤ weapon/Shields skill; success negates the damage ───
    if (this.toHitMechanic.type === 'd20-under') {
      this.resolveD20Parry();
      return;
    }

    const baseParrySkill = this.getEffectiveParrySkill(defender);
    const charBonus = this.getTotalParryBonus(defender);
    const penalty = this.getParryPenalty(defender, attacker.id);
    const effectiveSkill = Math.max(5, baseParrySkill + charBonus - penalty);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= effectiveSkill;

    // Track this parry attempt so subsequent ones get the repeat-parry penalty
    if (!defender.parriesAgainst) defender.parriesAgainst = {};
    defender.parriesAgainst[attacker.id] = (defender.parriesAgainst[attacker.id] ?? 0) + 1;

    const weaponHP = this.getParryWeaponCurrentHP(defender);
    const armor = this.getArmorValue(defender, hitLocation);

    const bonusParts = [
      charBonus > 0 ? `+${charBonus}` : '',
      penalty > 0 ? `-${penalty} rpt` : '',
    ].filter(Boolean).join(' ');
    const skillLabel = bonusParts
      ? `${baseParrySkill} ${bonusParts} = ${effectiveSkill}%`
      : `${effectiveSkill}%`;

    if (success) {
      const excessDamage = Math.max(0, rawDamage - weaponHP);
      const finalDamage = Math.max(0, excessDamage - armor);

      let logEntry = `[PARRY] ${defender.name} parries! (rolled ${roll} vs ${skillLabel})${locationInfo}`;
      if (excessDamage > 0) {
        logEntry += ` — ${defender.selectedParryItem} absorbs ${weaponHP}, ${excessDamage} excess - ${armor} armor = ${finalDamage} through`;
        this.damageParryWeapon(defender, excessDamage);
        logEntry += `. ${defender.selectedParryItem} takes ${excessDamage} HP!`;
      } else {
        logEntry += ` — fully absorbed by ${defender.selectedParryItem}`;
      }

      this.combatLogService.addEntry(logEntry);

      const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(defender, finalDamage, hitLocation);
      if (locationMaxed) this.combatLogService.addEntry(`[WOUND] ${defender.name}'s ${hitLocation} — ${locationEffect}!`);
      if (justDied) {
        attacker.kills = (attacker.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${defender.name} slain despite the parry!`);
      }

      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage, armorAbsorbed: armor, targetName: defender.name
      });
    } else {
      const finalDamage = Math.max(0, rawDamage - armor);
      this.combatLogService.addEntry(
        `[PARRY FAILED] ${defender.name} failed to parry (rolled ${roll} vs ${skillLabel})${locationInfo}: ${finalDamage} damage`
      );

      const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(defender, finalDamage, hitLocation);
      if (locationMaxed) this.combatLogService.addEntry(`[WOUND] ${defender.name}'s ${hitLocation} — ${locationEffect}!`);
      if (justDied) {
        attacker.kills = (attacker.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
      }

      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage, armorAbsorbed: armor, targetName: defender.name
      });
    }

    // Apply creature conditions (disease, poison, etc.) if attacker has them
    this.applyCreatureConditions(defender, attacker);

    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  // Dragonbane parry reaction: d20 ≤ weapon/Shields skill. Success negates the damage.
  // Dragon (1) = free counterattack opportunity; Demon (20) = parry fails and the
  // weapon/shield loses a point of Durability.
  private resolveD20Parry(): void {
    if (!this.pendingAttack) return;
    const { attacker, defender, rawDamage, damageBreakdown } = this.pendingAttack;

    const skill = this.getEffectiveParrySkill(defender);
    const roll = Math.floor(Math.random() * 20) + 1;
    const isDragon = roll === 1;
    const isDemon = roll === 20;
    const success = !isDemon && roll <= skill;

    if (success) {
      let logEntry = `[PARRY] ${defender.name} parries with ${defender.selectedParryItem}! (d20: ${roll} vs ${skill}) — damage negated`;
      if (isDragon) logEntry += `. DRAGON ROLL — ${defender.name} may make a free counterattack!`;
      this.combatLogService.addEntry(logEntry);
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage: 0, armorAbsorbed: 0, targetName: defender.name
      });
    } else {
      const armor = this.getArmorValue(defender);
      const finalDamage = Math.max(0, rawDamage - armor);
      let logEntry = `[PARRY FAILED] ${defender.name} fails to parry (d20: ${roll} vs ${skill}): ${finalDamage} damage`;
      if (isDemon) logEntry += `. DEMON ROLL — ${defender.selectedParryItem} loses 1 Durability!`;
      this.combatLogService.addEntry(logEntry);

      const { justDied } = this.applyDamageToDefender(defender, finalDamage, undefined);
      if (justDied) {
        attacker.kills = (attacker.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
      }
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage, armorAbsorbed: armor, targetName: defender.name
      });
    }

    this.applyCreatureConditions(defender, attacker);
    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  resolveDodge(): void {
    if (!this.pendingAttack) return;

    // ── Dragonbane: d20 ≤ EVADE; Demon (20) = fall prone ─────────────────────
    if (this.toHitMechanic.type === 'd20-under') {
      this.resolveD20Dodge();
      return;
    }
    // ── Kal-Arath: 2d6 + AGI ≥ 8; double-1 = enemy damage dice doubled ───────
    if (this.toHitMechanic.type === '2d6-over') {
      this.resolve2d6Dodge();
      return;
    }

    const { attacker, defender, rawDamage, damageBreakdown, hitLocation, locationRoll } = this.pendingAttack;
    const locationInfo = hitLocation ? ` (d20:${locationRoll} = ${hitLocation})` : '';

    const dodgeSkill = this.getEffectiveDodgeSkill(defender);
    const dodgeBonus = this.getDodgeBonus(defender);
    const encPenalty = this.getEncPenalty(defender);
    const effectiveSkill = Math.max(5, dodgeSkill + dodgeBonus - encPenalty);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= effectiveSkill;

    const bonusParts = [
      dodgeBonus > 0 ? `+${dodgeBonus}` : '',
      encPenalty > 0 ? `-${encPenalty} ENC` : ''
    ].filter(Boolean).join(' ');
    const skillLabel = bonusParts
      ? `${dodgeSkill} ${bonusParts} = ${effectiveSkill}%`
      : `${effectiveSkill}%`;

    if (success) {
      this.combatLogService.addEntry(
        `[DODGE] ${defender.name} dodges! (rolled ${roll} vs ${skillLabel}) — evades${locationInfo} hit!`
      );
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage: 0, armorAbsorbed: 0, targetName: defender.name
      });
    } else {
      const armor = this.getArmorValue(defender, hitLocation);
      const finalDamage = Math.max(0, rawDamage - armor);
      this.combatLogService.addEntry(
        `[DODGE FAILED] ${defender.name} fails dodge (rolled ${roll} vs ${skillLabel})${locationInfo}: ${finalDamage} damage`
      );

      const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(defender, finalDamage, hitLocation);
      if (locationMaxed) this.combatLogService.addEntry(`[WOUND] ${defender.name}'s ${hitLocation} — ${locationEffect}!`);
      if (justDied) {
        attacker.kills = (attacker.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
      }

      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage, armorAbsorbed: armor, targetName: defender.name
      });
    }

    // Apply creature conditions (disease, poison, etc.) if attacker has them
    this.applyCreatureConditions(defender, attacker);

    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  // Dragonbane dodge reaction: d20 ≤ EVADE avoids the hit entirely.
  // Demon (20) = the dodge fails and the defender falls prone.
  private resolveD20Dodge(): void {
    if (!this.pendingAttack) return;
    const { attacker, defender, rawDamage, damageBreakdown } = this.pendingAttack;

    const skill = this.getEffectiveDodgeSkill(defender);
    const roll = Math.floor(Math.random() * 20) + 1;
    const isDemon = roll === 20;
    const success = !isDemon && roll <= skill;

    if (success) {
      this.combatLogService.addEntry(
        `[DODGE] ${defender.name} evades! (d20: ${roll} vs ${skill})`
      );
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage: 0, armorAbsorbed: 0, targetName: defender.name
      });
    } else {
      const armor = this.getArmorValue(defender);
      const finalDamage = Math.max(0, rawDamage - armor);
      let logEntry = `[DODGE FAILED] ${defender.name} fails to evade (d20: ${roll} vs ${skill}): ${finalDamage} damage`;
      if (isDemon) logEntry += `. DEMON ROLL — ${defender.name} falls prone!`;
      this.combatLogService.addEntry(logEntry);

      const { justDied } = this.applyDamageToDefender(defender, finalDamage, undefined);
      if (justDied) {
        attacker.kills = (attacker.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
      }
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage, armorAbsorbed: armor, targetName: defender.name
      });
    }

    this.applyCreatureConditions(defender, attacker);
    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  // Kal-Arath dodge: 2d6 + AGI vs 8. Double-6 always dodges; double-1 is a critical
  // failure — the attacker's damage dice are doubled (the notation is rolled again).
  private resolve2d6Dodge(): void {
    if (!this.pendingAttack || this.toHitMechanic.type !== '2d6-over') return;
    const { attacker, defender, rawDamage, damageBreakdown, damageNotation } = this.pendingAttack;
    const mechanic = this.toHitMechanic;

    // AGI is stored in the mechanic's missile stat field (DEX) for Kal-Arath
    const agi = this.getParticipantStats(defender)?.[mechanic.missileStat] ?? 1;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2 + agi;
    const isCrit = d1 === 6 && d2 === 6;
    const isFumble = d1 === 1 && d2 === 1;
    const success = isCrit || (!isFumble && total >= mechanic.target);
    const agiStr = agi > 0 ? `+${agi}` : agi < 0 ? `${agi}` : '';
    const rollDisplay = `2d6+AGI: ${d1}+${d2}${agiStr} = ${total} vs ${mechanic.target}+`;

    if (success) {
      this.combatLogService.addEntry(
        `[DODGE] ${defender.name} dodges! (${rollDisplay})${isCrit ? ' — CRITICAL SUCCESS (double 6s)!' : ''}`
      );
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage: 0, armorAbsorbed: 0, targetName: defender.name
      });
    } else {
      let damage = rawDamage;
      let breakdown = damageBreakdown;
      if (isFumble) {
        const extra = this.rollDamage(damageNotation);
        damage += extra.total;
        breakdown = `${damageBreakdown} + ${extra.breakdown} (CRITICAL FAILURE — dice doubled)`;
      }
      const armor = this.getArmorValue(defender);
      const finalDamage = Math.max(0, damage - armor);
      const failText = isFumble ? 'CRITICAL FAILURE (double 1s) — damage dice doubled!' : 'fails to dodge';
      this.combatLogService.addEntry(
        `[DODGE FAILED] ${defender.name} ${failText} (${rollDisplay}): ${finalDamage} damage`
      );

      const { justDied } = this.applyDamageToDefender(defender, finalDamage, undefined);
      if (justDied) {
        attacker.kills = (attacker.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
      }
      this.lastDamageRolls.set(attacker.id, {
        total: damage, breakdown, finalDamage, armorAbsorbed: armor, targetName: defender.name
      });
    }

    this.applyCreatureConditions(defender, attacker);
    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  // ── Spell casting ────────────────────────────────────────────────────────

  private castableSpellsCache = new Map<string, CastableSpell[]>();

  /** True when the system supports casting and this character knows spells. */
  canCast(participant: CombatParticipant): boolean {
    if (participant.type !== 'character' || !participant.characterId) return false;
    if (!this.rules.getCastCheck) return false;
    return this.getCastableSpells(participant).length > 0;
  }

  getCastableSpells(participant: CombatParticipant): CastableSpell[] {
    if (participant.type !== 'character' || !participant.characterId) return [];
    let spells = this.castableSpellsCache.get(participant.characterId);
    if (!spells) {
      const character = this.characters.find(c => c.id === participant.characterId);
      spells = character ? this.spellCastingService.getCastableSpells(character, this.rules) : [];
      this.castableSpellsCache.set(participant.characterId, spells);
    }
    return spells;
  }

  getSelectedSpell(participant: CombatParticipant): CastableSpell | undefined {
    if (!participant.selectedSpell) return undefined;
    return this.getCastableSpells(participant).find(s => s.name === participant.selectedSpell);
  }

  /** Ally/self spells use a separate target select instead of the opponent select. */
  spellNeedsAllyTarget(participant: CombatParticipant): boolean {
    const spell = this.getSelectedSpell(participant);
    return !!spell && spell.effect.target !== 'enemy';
  }

  getAllyTargets(participant: CombatParticipant): CombatParticipant[] {
    return this.combatParticipants.filter(p => p.type === participant.type && !p.isDead);
  }

  onSpellChange(participant: CombatParticipant): void {
    if (this.spellNeedsAllyTarget(participant)) {
      const allies = this.getAllyTargets(participant);
      if (!participant.spellTargetId || !allies.some(a => a.id === participant.spellTargetId)) {
        participant.spellTargetId = participant.id;
      }
    }
    this.debouncedSaveCombat();
  }

  canAffordSelectedSpell(participant: CombatParticipant): boolean {
    const spell = this.getSelectedSpell(participant);
    if (!spell) return false;
    const character = this.characters.find(c => c.id === participant.characterId);
    if (!character) return false;
    return this.spellCastingService.canAfford(
      character, spell, participant.spellSlotsUsed, this.getSpellSlotCaps(participant)
    ).ok;
  }

  private getSpellSlotCaps(participant: CombatParticipant): number[] | undefined {
    if (!this.rules.getSpellSlotsPerDay) return undefined;
    const character = this.characters.find(c => c.id === participant.characterId);
    return this.rules.getSpellSlotsPerDay(
      character?.background?.occupation, character?.resources?.level ?? 1
    );
  }

  getSpellResourceDisplay(participant: CombatParticipant): string | null {
    const character = this.characters.find(c => c.id === participant.characterId);
    if (!character) return null;
    return this.spellCastingService.getResourceDisplay(character, this.rules, participant.spellSlotsUsed);
  }

  getCastButtonTitle(participant: CombatParticipant): string {
    if (participant.cannotCastUntilRest) return 'Casting failed — cannot cast again until a rest';
    const spell = this.getSelectedSpell(participant);
    if (!spell) return 'Select a spell to cast';
    const character = this.characters.find(c => c.id === participant.characterId);
    if (character) {
      const afford = this.spellCastingService.canAfford(
        character, spell, participant.spellSlotsUsed, this.getSpellSlotCaps(participant)
      );
      if (!afford.ok) return afford.reason;
    }
    return `Cast ${spell.name}`;
  }

  /** Rest: refill MP/WP/rune points, reset OSRIC slots, clear the casting lockout. */
  restoreMagic(participant: CombatParticipant): void {
    const character = this.characters.find(c => c.id === participant.characterId);
    if (!character) return;
    this.spellCastingService.restoreResources(character);
    participant.spellSlotsUsed = {};
    participant.cannotCastUntilRest = false;
    this.characters = this.characterService.getCharacters();
    this.combatLogService.addEntry(`[SPELL] ${participant.name} rests — magic restored to full`);
    this.saveCombat();
  }

  castSpell(participant: CombatParticipant): void {
    if (participant.isDead) return;
    const character = this.characters.find(c => c.id === participant.characterId);
    const spell = this.getSelectedSpell(participant);
    if (!character || !spell) return;

    if (participant.cannotCastUntilRest) {
      alert(`${participant.name} cannot cast again until they rest!`);
      return;
    }

    // Resolve the target: offensive spells use the opponent select,
    // ally/self spells use the spell target select (default: the caster)
    let target: CombatParticipant | undefined;
    if (spell.effect.target === 'enemy') {
      if (!participant.selectedOpponentId) {
        alert('Please select an opponent first!');
        return;
      }
      target = this.combatParticipants.find(p => p.id === participant.selectedOpponentId);
      if (!target || target.isDead) {
        alert('Selected opponent is not available!');
        return;
      }
    } else {
      target = this.combatParticipants.find(p => p.id === (participant.spellTargetId || participant.id))
        ?? participant;
    }

    const afford = this.spellCastingService.canAfford(
      character, spell, participant.spellSlotsUsed, this.getSpellSlotCaps(participant)
    );
    if (!afford.ok) {
      alert(afford.reason);
      return;
    }

    this.lastAttackerId = participant.id;
    const casterInfo = this.spellCastingService.buildCasterInfo(character);
    const check = this.rules.getCastCheck!(spell, casterInfo);
    const result = this.spellCastingService.rollCastCheck(check);

    // ── Failed casting roll ──────────────────────────────────────────────
    if (!result.success) {
      const costInfo = this.spellCastingService.deductCost(character, spell, { success: false });
      this.combatLogService.addEntry(
        `[CAST FAILED] ${participant.name}: ${spell.name} (${result.display})${costInfo}`
      );
      const failure = this.rules.getCastFailureEffects?.(result.fumble);
      if (failure) {
        for (const note of failure.logNotes) {
          this.combatLogService.addEntry(`[CAST FAILED] ${participant.name}: ${note}`);
        }
        if (failure.damageToCaster > 0) {
          const { justDied } = this.applyDamageToDefender(participant, failure.damageToCaster, undefined);
          this.combatLogService.addEntry(
            `[CAST FAILED] ${participant.name} takes ${failure.damageToCaster} damage from the backlash`
          );
          if (justDied) this.combatLogService.addEntry(`[SLAIN] ${participant.name} was slain by their own magic!`);
        }
        if (failure.blockCastingUntilRest) {
          participant.cannotCastUntilRest = true;
          this.combatLogService.addEntry(`[CAST FAILED] ${participant.name} cannot cast again until a rest`);
        }
      }
      this.characters = this.characterService.getCharacters();
      this.endTurn(participant.id);
      this.saveCombat();
      this.focusNextRollButton();
      return;
    }

    // ── Pay the cost ─────────────────────────────────────────────────────
    let costInfo = this.spellCastingService.deductCost(character, spell, { success: true });
    if (spell.resource === 'spell-slot') {
      if (!participant.spellSlotsUsed) participant.spellSlotsUsed = {};
      participant.spellSlotsUsed[spell.cost] = (participant.spellSlotsUsed[spell.cost] ?? 0) + 1;
      const caps = this.getSpellSlotCaps(participant);
      const cap = caps?.[spell.cost - 1] ?? 0;
      costInfo = `, −1 L${spell.cost} slot (${participant.spellSlotsUsed[spell.cost]}/${cap} used)`;
    }
    this.characters = this.characterService.getCharacters();

    const effect = spell.effect;
    const checkInfo = check.kind === 'auto' ? '' : `${result.display}`;
    const castDetail = [checkInfo, costInfo.replace(/^, /, '')].filter(Boolean).join(', ');

    // ── RuneQuest resistance: caster's POW must overcome the target's ────
    let overcame = true;
    let resistInfo = '';
    if (effect.resisted && target.id !== participant.id) {
      const casterPow = character.stats.POW ?? 10;
      const targetPow = this.getParticipantStats(target)?.POW ?? 10;
      const res = this.spellCastingService.rollResistance(casterPow, targetPow);
      overcame = res.success;
      resistInfo = `, resistance: ${res.display}`;
    }

    // ── Damage spells ─────────────────────────────────────────────────────
    if (effect.kind === 'damage') {
      let rawDamage: number;
      let breakdown: string;

      if (!overcame) {
        // Target resisted: slaying spells fall back to their notation damage; others fizzle
        if (effect.slays && effect.notation) {
          const roll = this.diceService.rollDiceNotation(effect.notation, { explode: this.rules.damageDiceExplode?.() ?? false });
          rawDamage = roll.total;
          breakdown = `${roll.breakdown} — target resisted the full effect`;
        } else if (effect.halfOnResistFailure) {
          const amount = this.spellCastingService.rollSpellAmount(spell, casterInfo.level ?? 1, {
            explode: this.rules.damageDiceExplode?.() ?? false, doubleDice: false,
          });
          rawDamage = amount && amount !== 'full' ? Math.floor(amount.total / 2) : 0;
          breakdown = amount && amount !== 'full' ? `${amount.breakdown} halved — target resisted` : 'target resisted';
        } else {
          this.combatLogService.addEntry(
            `[RESISTED] ${target.name} resists ${participant.name}'s ${spell.name}! (${castDetail}${resistInfo})`
          );
          this.endTurn(participant.id);
          this.saveCombat();
          this.focusNextRollButton();
          return;
        }
      } else if (effect.slays) {
        rawDamage = this.getHitPointsRemaining(target) + this.getLocationSafetyMargin(target);
        breakdown = 'slain outright';
      } else {
        const amount = this.spellCastingService.rollSpellAmount(spell, casterInfo.level ?? 1, {
          explode: this.rules.damageDiceExplode?.() ?? false,
          doubleDice: result.crit,
        });
        if (!amount || amount === 'full') {
          this.logUtilityCast(participant, spell, castDetail);
          this.endTurn(participant.id);
          this.saveCombat();
          this.focusNextRollButton();
          return;
        }
        rawDamage = amount.total;
        breakdown = amount.breakdown;
      }

      const usesLocations = this.rules.usesHitLocations() && !effect.targetsTotalHp;
      const { roll: locationRoll, location } = usesLocations
        ? this.rollLocation() : { roll: undefined, location: undefined };
      const armor = effect.ignoresArmor ? 0 : this.getArmorValue(target, location);
      const finalDamage = Math.max(0, rawDamage - armor);
      const locationInfo = location ? ` (d20:${locationRoll} = ${location})` : '';
      const armorInfo = armor > 0 ? ` - ${armor} armor = ${finalDamage}`
        : effect.ignoresArmor ? ' (ignores armor)' : ` = ${finalDamage}`;

      this.combatLogService.addEntry(
        `[CAST] ${participant.name} → ${target.name}: ${spell.name} (${castDetail}${resistInfo})${locationInfo}: ` +
        `${rawDamage} (${breakdown})${armorInfo} damage`
      );

      const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(target, finalDamage, location);
      if (locationMaxed) {
        this.combatLogService.addEntry(`[WOUND] ${target.name}'s ${location} — ${locationEffect}!`);
      }
      if (justDied) {
        participant.kills = (participant.kills || 0) + 1;
        this.combatLogService.addEntry(`[SLAIN] ${target.name} was slain by ${participant.name}'s ${spell.name}!`);
      }
      if (effect.description) {
        this.combatLogService.addEntry(`[CAST] ${spell.name}: ${effect.description}`);
      }

      this.lastDamageRolls.set(participant.id, {
        total: rawDamage, breakdown,
        finalDamage, armorAbsorbed: armor, targetName: target.name,
        attackRollDisplay: checkInfo || undefined,
      });
    }

    // ── Healing spells ────────────────────────────────────────────────────
    else if (effect.kind === 'healing') {
      const amount = this.spellCastingService.rollSpellAmount(spell, casterInfo.level ?? 1, {
        explode: this.rules.damageDiceExplode?.() ?? false,
        doubleDice: result.crit,
      });
      if (amount === null) {
        this.logUtilityCast(participant, spell, castDetail);
      } else {
        const healed = this.applyHealingToParticipant(
          target, amount === 'full' ? 'full' : amount.total
        );
        const rollInfo = amount === 'full' ? 'full heal' : `${amount.total} (${amount.breakdown})`;
        const targetLabel = target.id === participant.id ? 'self' : target.name;
        this.combatLogService.addEntry(
          `[HEAL] ${participant.name} → ${targetLabel}: ${spell.name} (${castDetail}) — ${rollInfo}, +${healed} HP restored`
        );
      }
    }

    // ── Utility spells ────────────────────────────────────────────────────
    else {
      this.logUtilityCast(participant, spell, castDetail);
    }

    this.endTurn(participant.id);
    this.saveCombat();
    this.focusNextRollButton();
  }

  private logUtilityCast(participant: CombatParticipant, spell: CastableSpell, castDetail: string): void {
    const desc = spell.effect.description ? ` — ${spell.effect.description}` : '';
    const detail = castDetail ? ` (${castDetail})` : '';
    this.combatLogService.addEntry(`[SPELL] ${participant.name} casts ${spell.name}${detail}${desc}`);
  }

  /**
   * Extra damage needed to guarantee death for slaying spells on hit-location
   * systems (applyDamageToDefender only kills vital locations at double HP).
   */
  private getLocationSafetyMargin(target: CombatParticipant): number {
    return this.rules.usesHitLocations() ? target.maxHitPoints : 0;
  }

  /**
   * Heal a participant: clear HP damage flags, reduce the most-damaged hit
   * locations, revive if no longer at max damage (unless a vital location is
   * destroyed), and write the healing back to the character record.
   */
  private applyHealingToParticipant(target: CombatParticipant, amount: number | 'full'): number {
    const taken = target.currentHitPoints.filter(hp => hp).length;
    if (taken <= 0) return 0;
    const healed = amount === 'full' ? taken : Math.min(amount, taken);
    if (healed <= 0) return 0;

    let toClear = healed;
    for (let i = target.currentHitPoints.length - 1; i >= 0 && toClear > 0; i--) {
      if (target.currentHitPoints[i]) {
        target.currentHitPoints[i] = false;
        toClear--;
      }
    }

    // Hit-location systems: healing goes to the worst-hurt locations first
    if (target.locationDamage) {
      let remaining = healed;
      while (remaining > 0) {
        const damaged = Object.entries(target.locationDamage)
          .filter(([, dmg]) => dmg > 0)
          .sort((a, b) => b[1] - a[1]);
        if (damaged.length === 0) break;
        const [loc, dmg] = damaged[0];
        const reduce = Math.min(remaining, dmg);
        target.locationDamage[loc] = dmg - reduce;
        remaining -= reduce;
      }
    }

    if (target.isDead && (taken - healed) < target.maxHitPoints && !this.hasFatalLocationDestroyed(target)) {
      target.isDead = false;
    }

    if (target.type === 'character' && target.characterId) {
      const character = this.characterService.getCharacter(target.characterId);
      if (character) {
        const maxHP = character.derivedStats.maxHitPoints ?? target.maxHitPoints;
        character.derivedStats.totalHitPoints = Math.min(
          maxHP, character.derivedStats.totalHitPoints + healed
        );
        this.characterService.updateCharacter(character);
        this.characters = this.characterService.getCharacters();
        this.characterUpdateService.notifyCharacterUpdated();
      }
    }

    return healed;
  }

  /** True when a fatal (vital) location has taken double its HP — death healing can't undo. */
  private hasFatalLocationDestroyed(target: CombatParticipant): boolean {
    const effects = this.rules.getLocationEffects();
    if (!effects || !target.locationDamage) return false;
    return Object.entries(target.locationDamage).some(([loc, dmg]) => {
      const max = this.getLocationMaxHP(target, loc);
      return max > 0 && dmg >= max * 2 && (effects[loc]?.fatal ?? false);
    });
  }

  // ── Core damage application ──────────────────────────────────────────────

  private applyDamageToDefender(
    defender: CombatParticipant,
    damage: number,
    location?: string
  ): { justDied: boolean; locationMaxed: boolean; locationEffect: string } {
    if (damage <= 0) return { justDied: false, locationMaxed: false, locationEffect: '' };

    // Track per-location damage
    let locationMaxed = false;
    let locationEffect = '';
    let locationFatal = false;

    if (location) {
      if (!defender.locationDamage) defender.locationDamage = {};
      const prevDmg = defender.locationDamage[location] ?? 0;
      defender.locationDamage[location] = prevDmg + damage;

      // RQ2 Damage Results: reaching 0 location HP disables the location (limb useless /
      // knocked unconscious); reaching −(location max) — i.e. double its HP in damage —
      // severs a limb or instantly kills through a vital (fatal) location.
      const locMax = this.getLocationMaxHP(defender, location);
      const effect = this.rules.getLocationEffects()?.[location];
      const newDmg = defender.locationDamage[location];
      if (locMax > 0 && newDmg >= locMax * 2 && prevDmg < locMax * 2) {
        locationMaxed = true;
        locationFatal = effect?.fatal ?? false;
        locationEffect = locationFatal
          ? 'Location destroyed — INSTANT DEATH'
          : 'Limb severed or irrevocably crushed';
      } else if (locMax > 0 && newDmg >= locMax && prevDmg < locMax) {
        locationMaxed = true;
        locationEffect = effect?.label ?? '';
      }
    }

    // Update overall HP boolean array
    const taken = defender.currentHitPoints.filter(hp => hp).length;
    const newTotal = taken + damage;

    if (newTotal >= defender.maxHitPoints) {
      defender.currentHitPoints.fill(true);
    } else {
      for (let i = 0; i < newTotal; i++) defender.currentHitPoints[i] = true;
    }

    if (defender.type === 'character' && defender.characterId) {
      this.updateCharacterHitPoints(defender.characterId, damage, newTotal >= defender.maxHitPoints || locationFatal);
    }

    const justDied = !defender.isDead && (locationFatal || newTotal >= defender.maxHitPoints);
    if (justDied) {
      defender.isDead = true;
      if (locationFatal) defender.currentHitPoints.fill(true);
    }

    return { justDied, locationMaxed, locationEffect };
  }

  // ── Defense helpers ──────────────────────────────────────────────────────

  getEffectiveParrySkill(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 0;
      const parryItem = participant.selectedParryItem;
      if (!parryItem) return 0;
      const shield = character.shields?.find(s => s.name === parryItem);
      if (shield) {
        // RQ2 shields add their Defense Bonus (+15/20/25%) to the parry roll
        const shieldBonus = this.shieldList.find(sd => sd.name === shield.name)?.parryBonus ?? 0;
        const skill = character.skills[shield.skill] ?? character.skills['Shield'] ?? 0;
        return skill + shieldBonus;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      return weapon ? (character.skills[weapon.skill] || 0) : 0;
    }
    // Default monster parry calibrated to ~40% per mechanic
    return this.toHitMechanic.type === 'd20-under' ? 8 : 40;
  }

  getEffectiveDodgeSkill(participant: CombatParticipant): number {
    const dodgeSkill = this.rules.getDodgeSkillName?.() ?? 'Dodge';
    if (participant.type === 'character') {
      return this.characters.find(c => c.id === participant.characterId)?.skills[dodgeSkill] || 0;
    }
    // Default monster dodge calibrated to ~15-25% per mechanic
    return this.toHitMechanic.type === 'd20-under' ? 5 : 15;
  }

  /** Human-readable parry chance for the defense button, per the system's mechanic. */
  getParryDisplayLabel(participant: CombatParticipant, attackerId: string): string {
    const skill = this.getEffectiveParrySkill(participant);
    if (this.toHitMechanic.type === 'd20-under') return `d20 vs ${skill}`;
    const total = skill + this.getTotalParryBonus(participant) - this.getParryPenalty(participant, attackerId);
    return `${total}%`;
  }

  /** Human-readable dodge chance for the defense button, per the system's mechanic. */
  getDodgeDisplayLabel(participant: CombatParticipant): string {
    if (this.toHitMechanic.type === '2d6-over') {
      const mechanic = this.toHitMechanic;
      const agi = this.getParticipantStats(participant)?.[mechanic.missileStat] ?? 1;
      const agiStr = agi >= 0 ? `+${agi}` : `${agi}`;
      return `2d6${agiStr} vs ${mechanic.target}+`;
    }
    const skill = this.getEffectiveDodgeSkill(participant);
    if (this.toHitMechanic.type === 'd20-under') return `d20 vs ${skill}`;
    return `${skill + this.getDodgeBonus(participant)}%`;
  }

  getEncPenalty(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      return this.characters.find(c => c.id === participant.characterId)?.derivedStats.encumbranceDefensePenalty ?? 0;
    }
    return 0;
  }

  private getParticipantStats(participant: CombatParticipant): CharacterStats | null {
    if (participant.type !== 'character') return null;
    return this.characters.find(c => c.id === participant.characterId)?.stats ?? null;
  }

  // THAC0 for d20-over-ac systems: characters by class/level, monsters by
  // HD-equivalent level (derived from max HP). 20 when the rules don't say.
  private getAttackerThac0(participant: CombatParticipant): number {
    if (!this.rules.getD20AttackTarget) return 20;
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      return this.rules.getD20AttackTarget({
        className: character?.background?.occupation,
        level: character?.resources?.level ?? 1,
      });
    }
    return this.rules.getD20AttackTarget({ monsterMaxHp: participant.maxHitPoints });
  }

  getTotalAttackBonus(participant: CombatParticipant): number {
    const stats = this.getParticipantStats(participant);
    return stats ? this.rules.getAttackBonuses(stats).attack : 0;
  }

  getTotalParryBonus(participant: CombatParticipant): number {
    const stats = this.getParticipantStats(participant);
    return stats ? this.rules.getAttackBonuses(stats).parry : 0;
  }

  getDodgeBonus(participant: CombatParticipant): number {
    const stats = this.getParticipantStats(participant);
    return stats ? this.rules.getAttackBonuses(stats).dodge : 0;
  }

  getParryPenalty(defender: CombatParticipant, attackerId: string): number {
    return (defender.parriesAgainst?.[attackerId] ?? 0) * this.rules.getParryRepeatPenalty();
  }

  getEffectiveAttackSkill(participant: CombatParticipant): number {
    let baseSkill = 0;
    const mechanic = this.rules.getToHitMechanic?.() ?? { type: 'percentile' as const };
    if (participant.type === 'character') {
      if (mechanic.type === 'percentile-under-stat') {
        // Mothership: roll under the Combat stat plus the applicable combat skill
        // bonus (Firearms for ranged weapons, Close-Quarters Combat for melee)
        baseSkill = this.getParticipantStats(participant)?.[mechanic.stat] ?? 0;
        const character = this.characters.find(c => c.id === participant.characterId);
        if (character) {
          const isRanged = this.weaponList.find(w => w.name === participant.selectedWeapon)?.isMissile ?? false;
          const skillName = isRanged ? 'Firearms' : 'Close-Quarters Combat';
          baseSkill += character.skills[skillName] ?? 0;
        }
      } else if (mechanic.type === '2d6-over') {
        // Kal-Arath: stat bonus by weapon type (STR melee / AGI missile)
        const isRanged = this.weaponList.find(w => w.name === participant.selectedWeapon)?.isMissile ?? false;
        baseSkill = this.getParticipantStats(participant)?.[isRanged ? mechanic.missileStat : mechanic.meleeStat] ?? 0;
      } else {
        const character = this.characters.find(c => c.id === participant.characterId);
        if (character) {
          const weapon = character.weapons.find(w => w.name === participant.selectedWeapon);
          baseSkill = weapon ? (character.skills[weapon.skill] || 0) : 0;
        }
      }
    } else {
      // Default monster skill calibrated to ~50% hit rate per mechanic
      baseSkill = mechanic.type === 'd20-under' ? 10   // d20 ≤ 10 = 50%
                : mechanic.type === '2d6-over'  ? 1    // 2d6+1 ≥ 8 ≈ 58%
                : mechanic.type === 'd20-over-ac' ? 0  // OSRIC: not used (uses AC directly)
                : 50;                                   // percentile variants: 50%
    }
    return baseSkill + this.getTotalAttackBonus(participant);
  }

  getParticipantParryItems(participant: CombatParticipant): string[] {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return [];
      const shields = (character.shields || []).map(s => s.name);
      const weapons = (character.weapons || []).filter(w => this.canWeaponParry(w.name)).map(w => w.name);
      return [...shields, ...weapons];
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      return (monster?.weapons || []).filter(w => this.canWeaponParry(w.name)).map(w => w.name);
    }
  }

  getParryWeaponCurrentHP(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      const parryItem = participant.selectedParryItem;
      if (!parryItem || !character) return 0;
      const shield = character.shields?.find(s => s.name === parryItem);
      if (shield) {
        const maxHP = this.shieldList.find(sd => sd.name === shield.name)?.hitPoints ?? 0;
        return shield.currentHitPoints ?? maxHP;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      if (weapon) {
        const maxHP = this.weaponList.find(wd => wd.name === weapon.name)?.hitPoints ?? 0;
        return weapon.currentHitPoints ?? maxHP;
      }
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedParryItem);
      if (weapon) {
        const maxHP = this.weaponList.find(wd => wd.name === weapon.name)?.hitPoints ?? 8;
        return weapon.hitPoints ?? maxHP;
      }
    }
    return 0;
  }

  getParryWeaponMaxHP(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      const parryItem = participant.selectedParryItem;
      if (!parryItem || !character) return 0;
      const shield = character.shields?.find(s => s.name === parryItem);
      if (shield) {
        return this.shieldList.find(sd => sd.name === shield.name)?.hitPoints ?? 0;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      return weapon ? (this.weaponList.find(wd => wd.name === weapon.name)?.hitPoints ?? 0) : 0;
    }
    const monster = this.monsters.find(m => m.id === participant.monsterId);
    const weapon = monster?.weapons.find(w => w.name === participant.selectedWeapon);
    return weapon ? (this.weaponList.find(wd => wd.name === weapon.name)?.hitPoints ?? 8) : 0;
  }

  getWeaponHPDisplay(participant: CombatParticipant): string {
    const maxHP = this.getParryWeaponMaxHP(participant);
    if (maxHP === 0) return '';
    return `${this.getParryWeaponCurrentHP(participant)}/${maxHP}`;
  }

  isWeaponBroken(participant: CombatParticipant): boolean {
    const maxHP = this.getParryWeaponMaxHP(participant);
    return maxHP > 0 && this.getParryWeaponCurrentHP(participant) === 0;
  }

  damageParryWeapon(participant: CombatParticipant, damage: number): void {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      const parryItem = participant.selectedParryItem;
      if (!parryItem || !character) return;
      const shield = character.shields?.find(s => s.name === parryItem);
      if (shield) {
        const maxHP = this.shieldList.find(sd => sd.name === shield.name)?.hitPoints ?? 0;
        shield.currentHitPoints = Math.max(0, (shield.currentHitPoints ?? maxHP) - damage);
        this.characterService.updateCharacter(character);
        this.characters = this.characterService.getCharacters();
        return;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      if (weapon) {
        const maxHP = this.weaponList.find(wd => wd.name === weapon.name)?.hitPoints ?? 0;
        weapon.currentHitPoints = Math.max(0, (weapon.currentHitPoints ?? maxHP) - damage);
        this.characterService.updateCharacter(character);
        this.characters = this.characterService.getCharacters();
      }
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedParryItem);
      if (weapon && monster) {
        const maxHP = this.weaponList.find(wd => wd.name === weapon.name)?.hitPoints ?? 8;
        weapon.hitPoints = Math.max(0, (weapon.hitPoints ?? maxHP) - damage);
        if (this.isCustomMonster(monster.id)) this.combatService.saveMonster(monster);
      }
    }
  }

  // ── Existing helpers ─────────────────────────────────────────────────────

  updateCharacterHitPoints(characterId: string, damageDealt: number, isDead: boolean): void {
    const character = this.characterService.getCharacter(characterId);
    if (!character) return;
    const newHP = character.derivedStats.totalHitPoints - damageDealt;
    character.derivedStats.totalHitPoints = (isDead && newHP > 0) ? 0 : newHP;
    this.characterService.updateCharacter(character);
    this.characters = this.characterService.getCharacters();
    this.characterUpdateService.notifyCharacterUpdated();
  }

  private applyCreatureConditions(defender: CombatParticipant, attacker: CombatParticipant): void {
    // Apply conditions from creature special abilities to character defenders
    if (defender.type !== 'character' || !defender.characterId) return;

    const character = this.characterService.getCharacter(defender.characterId);
    if (!character) return;

    // Check if attacker is a creature with special abilities
    let specialAbilities: string[] = [];
    if (attacker.type === 'monster' && attacker.monsterId) {
      // Check bestiary monsters for special abilities
      const bestiaryMonster = BESTIARY_MONSTERS.find(m => m.id === attacker.monsterId);
      if (bestiaryMonster?.specialAbilities) {
        specialAbilities = bestiaryMonster.specialAbilities;
      }
    }

    // Extract condition keywords from special abilities
    const creatureConditions = specialAbilities
      .filter(ability => {
        const lowerAbility = ability.toLowerCase();
        return lowerAbility.includes('disease') ||
               lowerAbility.includes('poison') ||
               lowerAbility.includes('curse') ||
               lowerAbility.includes('plague') ||
               lowerAbility.includes('venom');
      })
      .map(ability => {
        // Extract condition from ability (e.g., "Disease carrier" → "disease")
        const lower = ability.toLowerCase();
        if (lower.includes('disease')) return 'diseased';
        if (lower.includes('poison')) return 'poisoned';
        if (lower.includes('curse')) return 'cursed';
        if (lower.includes('plague')) return 'plagued';
        if (lower.includes('venom')) return 'venomous';
        return lower;
      });

    if (creatureConditions.length === 0) return;

    // Initialize conditions array if needed
    if (!character.conditions) {
      character.conditions = [];
    }

    // Apply conditions that aren't already present
    let conditionsApplied = false;
    for (const condition of creatureConditions) {
      if (!character.conditions.includes(condition)) {
        character.conditions.push(condition);
        conditionsApplied = true;
      }
    }

    if (conditionsApplied) {
      this.characterService.updateCharacter(character);
      this.characters = this.characterService.getCharacters();
      this.characterUpdateService.notifyCharacterUpdated();
    }
  }

  getLastDamageRoll(participantId: string) {
    return this.lastDamageRolls.get(participantId);
  }

  getLastMiss(participantId: string) {
    return this.lastMissResult.get(participantId);
  }

  clearMissResult(participantId: string): void {
    this.lastMissResult.delete(participantId);
  }

  canParticipantAct(participant: CombatParticipant): boolean {
    return !participant.isDead;
  }

  private focusNextRollButton(): void {
    if (!this.lastAttackerId) return;

    const attackerIndex = this.combatParticipants.findIndex(p => p.id === this.lastAttackerId);
    if (attackerIndex === -1) return;

    let nextIndex = (attackerIndex + 1) % this.combatParticipants.length;
    let nextParticipant = this.combatParticipants[nextIndex];
    let attempts = 0;
    const maxAttempts = this.combatParticipants.length;

    // Skip participants who can't act (dead or surprised)
    while (!this.canParticipantAct(nextParticipant) && attempts < maxAttempts) {
      nextIndex = (nextIndex + 1) % this.combatParticipants.length;
      nextParticipant = this.combatParticipants[nextIndex];
      attempts++;
    }

    // If all participants can't act, don't focus anything
    if (!this.canParticipantAct(nextParticipant)) return;

    setTimeout(() => {
      const buttons = this.rollButtons?.toArray() || [];
      const nextButton = buttons.find(btn => btn.nativeElement.getAttribute('data-participant-id') === nextParticipant.id);
      if (nextButton) {
        nextButton.nativeElement.focus();
      }
    }, 0);
  }

  getRgbaColor(hexColor: string | undefined, opacity: number): string {
    const color = hexColor || '#ffffff';
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  getParticipantGameSystem(participant: CombatParticipant): string | undefined {
    if (participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      return character?.gameSystem;
    }
    return undefined;
  }

  getGameSystemName(system: string | undefined): string {
    if (!system) return 'RuneQuest';
    return getRulesForSystem(system as any).getSystemName();
  }

  getArmorValue(participant: CombatParticipant, location?: string): number {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 0;

      if (this.rules.usesHitLocations()) {
        if (location) {
          const locArmor = character.armor[location as keyof typeof character.armor];
          return locArmor !== undefined ? locArmor : 0;
        }
        const values = Object.values(character.armor);
        return values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0;
      }

      // AC affects the to-hit roll; a save is rolled in resolveNoDefense — neither reduces damage here
      if (this.armorModel.kind === 'ac' || this.armorModel.kind === 'save') return 0;
      // Dragonbane, Kal-Arath: flat Armor Rating subtracts from damage; a carried shield adds its rating
      const armorDef = this.rules.getArmorTypes().find(a => a.name === character.armorType);
      const shieldPoints = (character.shields ?? []).reduce((sum, s) =>
        sum + (this.shieldList.find(sd => sd.name === s.name)?.armorPoints ?? 0), 0);
      return (armorDef?.points ?? 0) + shieldPoints;
    }
    // Monsters: armor is AC (OSRIC) or an Armor Save target (Mothership), not damage reduction
    if (this.armorModel.kind === 'ac' || this.armorModel.kind === 'save') return 0;
    return this.monsters.find(m => m.id === participant.monsterId)?.armor || 0;
  }

  /** Mothership: percentage target for the defender's Armor Save. */
  getArmorSaveTarget(participant: CombatParticipant): number {
    const model = this.armorModel;
    if (model.kind !== 'save') return 0;
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 0;
      const skillPct = character.skills[model.skill] ?? 0;
      const armorPts = this.rules.getArmorTypes().find(a => a.name === character.armorType)?.points ?? 0;
      return skillPct + armorPts;
    }
    // Monster armor value doubles as its Armor Save %
    return this.monsters.find(m => m.id === participant.monsterId)?.armor ?? 0;
  }

  getDefenderAC(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      return this.characters.find(c => c.id === participant.characterId)?.derivedStats.armorClass ?? 10;
    }
    return this.monsters.find(m => m.id === participant.monsterId)?.armor ?? 10;
  }

  clearDamageRoll(participantId: string): void { this.lastDamageRolls.delete(participantId); }

  getAvailableOpponents(participant: CombatParticipant): CombatParticipant[] {
    const targetType = participant.type === 'character' ? 'monster' : 'character';
    return this.combatParticipants.filter(p => p.type === targetType && !p.isDead);
  }

  onOpponentChange(_participant: CombatParticipant): void { this.debouncedSaveCombat(); }

  private checkDistanceWeaponRestriction(attacker: CombatParticipant, defender: CombatParticipant): { blocked: boolean; message: string } {
    const weaponName = attacker.selectedWeapon;
    if (!weaponName) return { blocked: false, message: '' };

    const weapon = this.weaponList.find(w => w.name === weaponName);
    if (!weapon) return { blocked: false, message: '' };

    // Missile weapons can attack from any distance
    if (weapon.isMissile) return { blocked: false, message: '' };

    // Non-missile weapons require melee range (distance <= 1)
    const distance = this.getDistanceToOpponent(attacker, defender);
    if (distance > 1) {
      return {
        blocked: true,
        message: `${weaponName} requires melee range! Your opponent is ${distance} squares away. Switch to a missile weapon or move closer.`
      };
    }

    return { blocked: false, message: '' };
  }

  private getDistanceToOpponent(attacker: CombatParticipant, defender: CombatParticipant): number {
    // Get positions from combat map state
    const mapState = this.combatService.getCombatMapState();
    const attackerPos = mapState.positions[attacker.id];
    const defenderPos = mapState.positions[defender.id];

    if (!attackerPos || !defenderPos) {
      // If positions not found in map, assume they're in melee range
      // (this allows combat to proceed if map isn't being used)
      return 0;
    }

    // Use Chebyshev distance (king's move): max of absolute differences
    return Math.max(Math.abs(attackerPos.x - defenderPos.x), Math.abs(attackerPos.y - defenderPos.y));
  }

  clearCombatLog(): void {
    if (this.combatLog.length > 0 && confirm('Save this combat log to history and clear?')) {
      this.combatService.saveCombatLog(this.combatLog);
      this.combatLogService.clearLog();
      this.saveCombat();
    }
  }

  toggleLogHistory(): void { this.showLogHistory = !this.showLogHistory; }
  getCombatLogHistory() { return this.combatService.getCombatLogHistory(); }

  deleteLogEntry(timestamp: number): void {
    if (confirm('Delete this combat log?')) this.combatService.deleteCombatLogEntry(timestamp);
  }

  clearAllHistory(): void {
    if (confirm('Delete all combat log history? This cannot be undone.')) {
      this.combatService.clearCombatLogHistory();
    }
  }

  autoAssignOpponentsIfNeeded(): void {
    if (this.combatParticipants.length !== 2) return;
    const [first, second] = this.combatParticipants;
    if (first.type === second.type) return;
    if (!first.selectedOpponentId) first.selectedOpponentId = second.id;
    if (!second.selectedOpponentId) second.selectedOpponentId = first.id;
    this.saveCombat();
  }

  getArmorDisplay(participant: CombatParticipant): string {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 'N/A';
      if (this.rules.usesHitLocations()) {
        const values = Object.values(character.armor);
        if (!values.length) return '0';
        const min = Math.min(...values), max = Math.max(...values);
        const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
        return min === max ? `${min}` : `${min}-${max} (avg: ${avg})`;
      }
      if (this.armorModel.kind === 'ac' && character.derivedStats.armorClass !== undefined) {
        return `AC: ${character.derivedStats.armorClass}`;
      }
      if (this.armorModel.kind === 'save') {
        return `Save: ${this.getArmorSaveTarget(participant)}%`;
      }
      const armorDef = this.rules.getArmorTypes().find(a => a.name === character.armorType);
      return armorDef ? `${armorDef.points}` : '0';
    }
    if (this.armorModel.kind === 'save') {
      return `Save: ${this.getArmorSaveTarget(participant)}%`;
    }
    if (this.armorModel.kind === 'ac') {
      return `AC: ${this.getDefenderAC(participant)}`;
    }
    return this.monsters.find(m => m.id === participant.monsterId)?.armor.toString() || '0';
  }

  getArmorTooltip(participant: CombatParticipant): string {
    if (!this.rules.usesHitLocations()) return '';
    if (participant.type !== 'character' || !participant.characterId) return '';
    const character = this.characters.find(c => c.id === participant.characterId);
    if (!character) return '';
    return this.hitLocationsOrder
      .map(loc => `${loc}: ${character.armor[loc] ?? 0}`)
      .join(', ');
  }

}
