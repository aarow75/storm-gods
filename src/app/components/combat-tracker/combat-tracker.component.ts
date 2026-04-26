import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CombatParticipant, Monster, DEFAULT_MONSTERS } from '../../models/combat.model';
import { Character, WEAPON_LIST, SHIELD_LIST, calculateHitLocations, getSizeModifier, getDexterityModifier, canWeaponParry } from '../../models/character.model';
import { Monster as BestiaryMonster } from '../../models/monster.model';
import { MONSTERS as BESTIARY_MONSTERS } from '../../constants/monsters.constants';
import { CharacterService } from '../../services/character.service';
import { CustomMonsterService } from '../../services/custom-monster.service';
import { CombatService } from '../../services/combat.service';
import { CombatLogService } from '../../services/combat-log.service';
import { DiceService } from '../../services/dice.service';
import { CharacterUpdateService } from '../../services/character-update.service';
import { TranslationService } from '../../services/translation.service';

// d20 → hit location (RuneQuest standard table)
const HIT_LOCATION_TABLE: { [roll: number]: string } = {
  1: 'Right Leg', 2: 'Right Leg', 3: 'Right Leg', 4: 'Right Leg',
  5: 'Left Leg',  6: 'Left Leg',  7: 'Left Leg',  8: 'Left Leg',
  9: 'Abdomen',  10: 'Abdomen',  11: 'Abdomen',
  12: 'Chest',
  13: 'Right Arm', 14: 'Right Arm', 15: 'Right Arm',
  16: 'Left Arm',  17: 'Left Arm',  18: 'Left Arm',
  19: 'Head', 20: 'Head',
};

const LOCATION_EFFECTS: { [location: string]: { label: string; fatal: boolean } } = {
  'Head':      { label: 'Instant Death', fatal: true  },
  'Chest':     { label: 'Incapacitated', fatal: false },
  'Abdomen':   { label: 'Incapacitated', fatal: false },
  'Right Arm': { label: 'Arm Useless',   fatal: false },
  'Left Arm':  { label: 'Arm Useless',   fatal: false },
  'Right Leg': { label: 'Leg Useless',   fatal: false },
  'Left Leg':  { label: 'Leg Useless',   fatal: false },
};

const HIT_LOCATIONS_ORDER = ['Head', 'Right Arm (Weapon)', 'Chest', 'Left Arm (Shield)', 'Abdomen', 'Right Leg', 'Left Leg'];

interface PendingAttack {
  attacker: CombatParticipant;
  defender: CombatParticipant;
  rawDamage: number;
  damageBreakdown: string;
  hitLocation: string;
  locationRoll: number;
  attackRoll: number;         // d100 roll made
  attackSkill: number;        // effective skill rolled against
}

@Component({
  standalone: true,
  selector: 'app-combat-tracker',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './combat-tracker.component.html',
  styleUrl: './combat-tracker.component.css'
})
export class CombatTrackerComponent implements OnInit, OnDestroy {
  @ViewChildren('rollDamageBtn', { read: ElementRef }) rollButtons!: QueryList<ElementRef<HTMLButtonElement>>;

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
  addParticipantDistance = 0;
  addParticipantSurprised = false;

  lastDamageRolls: Map<string, { total: number; breakdown: string; finalDamage: number; armorAbsorbed: number; targetName: string }> = new Map();
  lastMissResult: Map<string, { targetName: string; attackRoll: number; attackSkill: number }> = new Map();
  showLogHistory = false;

  pendingAttack: PendingAttack | null = null;

  readonly hitLocationsOrder = HIT_LOCATIONS_ORDER;

  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly SAVE_DELAY_MS = 300;

  constructor(
    private characterService: CharacterService,
    private customMonsterService: CustomMonsterService,
    private combatService: CombatService,
    private combatLogService: CombatLogService,
    private diceService: DiceService,
    private characterUpdateService: CharacterUpdateService,
    public translationService: TranslationService
  ) {}

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
    participant.effectiveSR = this.combatService.calculateEffectiveSR(participant);
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(this.combatParticipants);
    this.debouncedSaveCombat();
  }

  private updateAllParticipantsSR(): void {
    this.combatParticipants.forEach(p => {
      p.effectiveSR = this.combatService.calculateEffectiveSR(p);
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
    this.characters = this.characterService.getCharacters();
    this.defaultMonsters = structuredClone(DEFAULT_MONSTERS);
    this.bestiaryMonsters = BESTIARY_MONSTERS.map(m => this.convertBestiaryMonster(m));
    this.customMonsters = this.customMonsterService.getMonsters().map(m => this.convertBestiaryMonster(m));
    this.monsters = [
      ...this.defaultMonsters,
      ...this.bestiaryMonsters,
      ...this.customMonsters
    ];
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(
      this.combatService.getCombatParticipants()
    );
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
    this.addParticipantDistance = 0;
    this.addParticipantSurprised = false;
  }
  onEntityTypeChange(): void {
    this.selectedCharacterId = '';
    this.selectedMonsterId = '';
    this.selectedWeapon = '';
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
      const finalStrikeRank = this.combatService.calculateFinalStrikeRank(baseStrikeRank, this.selectedWeapon);
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
        distanceToOpponent: this.addParticipantDistance || 0,
        movementThisRound: 0,
        isSurprised: this.addParticipantSurprised
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
        distanceToOpponent: this.addParticipantDistance || 0,
        movementThisRound: 0,
        isSurprised: this.addParticipantSurprised
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
      participant.finalStrikeRank = this.combatService.calculateFinalStrikeRank(
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
      this.combatService.clearCombat();
      this.combatLogService.clearLog();
      this.lastDamageRolls.clear();
      this.pendingAttack = null;
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
      strikeRank: getSizeModifier(bm.stats.SIZ) + getDexterityModifier(bm.stats.DEX),
      armor: bm.armor,
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
    return { roll, location: HIT_LOCATION_TABLE[roll] };
  }

  getLocationMaxHP(participant: CombatParticipant, location: string): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      return character?.hitLocations[location] ?? 0;
    }
    // Monsters: derive from total HP using the standard RQ ratios
    const locs = calculateHitLocations(participant.maxHitPoints, participant.maxHitPoints);
    return locs[location] ?? 0;
  }

  getLocationDamage(participant: CombatParticipant, location: string): number {
    return participant.locationDamage?.[location] ?? 0;
  }

  getLocationCurrentHP(participant: CombatParticipant, location: string): number {
    return Math.max(0, this.getLocationMaxHP(participant, location) - this.getLocationDamage(participant, location));
  }

  isLocationMaxed(participant: CombatParticipant, location: string): boolean {
    return this.getLocationDamage(participant, location) >= this.getLocationMaxHP(participant, location)
      && this.getLocationMaxHP(participant, location) > 0;
  }

  getLocationEffectLabel(location: string): string {
    return LOCATION_EFFECTS[location]?.label ?? '';
  }

  isLocationFatal(location: string): boolean {
    return LOCATION_EFFECTS[location]?.fatal ?? false;
  }

  getLocationStatusClass(participant: CombatParticipant, location: string): string {
    const maxed = this.isLocationMaxed(participant, location);
    if (!maxed) {
      return this.getLocationDamage(participant, location) > 0 ? 'loc-damaged' : 'loc-healthy';
    }
    return LOCATION_EFFECTS[location]?.fatal ? 'loc-fatal' : 'loc-useless';
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
    const def = WEAPON_LIST.find(w => w.name === participant.selectedWeapon);
    if (!def?.isMissile) return Infinity; // melee: unlimited within pendingAttack constraint
    return def.rateOfFire ?? 1;
  }

  hasAttacksRemaining(participant: CombatParticipant): boolean {
    const rof = this.getWeaponRateOfFire(participant);
    if (!isFinite(rof)) return true;
    return (participant.attacksUsed ?? 0) < rof;
  }

  getWeaponMissileInfo(participant: CombatParticipant): { range: string; rof: number } | null {
    const def = WEAPON_LIST.find(w => w.name === participant.selectedWeapon);
    if (!def?.isMissile) return null;
    return { range: def.range ?? '-', rof: def.rateOfFire ?? 1 };
  }

  resetRound(): void {
    this.combatParticipants.forEach(p => {
      p.attacksUsed = 0;
      p.parriesAgainst = {};
      p.movementThisRound = 0;
      p.isSurprised = false;
    });
    this.pendingAttack = null;
    this.updateAllParticipantsSR();
  }

  updateMovement(participant: CombatParticipant): void {
    this.updateParticipantSR(participant);
  }

  toggleSurprise(participant: CombatParticipant): void {
    participant.isSurprised = !participant.isSurprised;
    this.updateParticipantSR(participant);
  }

  getMovementSRCost(participant: CombatParticipant): number {
    return this.combatService.calculateMovementSRCost(participant.movementThisRound ?? 0);
  }

  getDisplaySR(participant: CombatParticipant): number {
    return participant.effectiveSR ?? participant.finalStrikeRank;
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

    this.lastAttackerId = participant.id;

    // Consume one shot for missile weapons (miss or hit, shot is spent)
    const rof = this.getWeaponRateOfFire(participant);
    if (isFinite(rof)) {
      participant.attacksUsed = (participant.attacksUsed ?? 0) + 1;
    }

    // Roll to hit: d100 under effective attack skill
    const attackSkill = this.getEffectiveAttackSkill(participant);
    const attackRoll = Math.floor(Math.random() * 100) + 1;

    if (attackRoll > attackSkill) {
      // Miss — log and stop; no defence roll needed
      const strB = this.getAttackerStrBonus(participant);
      const intB = this.getAttackerIntBonus(participant);
      const powB = this.getAttackerPowBonus(participant);
      const dexB = this.getAttackerDexBonus(participant);
      const baseSkill = attackSkill - strB - intB - powB - dexB;
      const bonusParts = [
        strB > 0 ? `+${strB} STR` : '',
        intB > 0 ? `+${intB} INT` : '',
        powB > 0 ? `+${powB} POW` : '',
        dexB > 0 ? `+${dexB} DEX` : '',
      ].filter(Boolean).join(' ');
      this.combatLogService.addEntry(
        `[MISS] ${participant.name} → ${opponent.name}: attack failed! ` +
        `(rolled ${attackRoll} vs ${attackSkill}%` +
        (bonusParts ? `: ${baseSkill} skill ${bonusParts}` : '') + `)`
      );
      this.lastMissResult.set(participant.id, {
        targetName: opponent.name,
        attackRoll,
        attackSkill
      });
      this.saveCombat();
      this.focusNextRollButton();
      return;
    }

    const result = this.diceService.rollDiceNotation(damage);
    const { roll, location } = this.rollLocation();

    this.pendingAttack = {
      attacker: participant,
      defender: opponent,
      rawDamage: result.total,
      damageBreakdown: result.breakdown,
      hitLocation: location,
      locationRoll: roll,
      attackRoll,
      attackSkill,
    };
    this.lastMissResult.delete(participant.id);
  }

  resolveNoDefense(): void {
    if (!this.pendingAttack) return;
    const { attacker, defender, rawDamage, damageBreakdown, hitLocation, locationRoll } = this.pendingAttack;

    const armor = this.getArmorValue(defender, hitLocation);
    const finalDamage = Math.max(0, rawDamage - armor);

    this.combatLogService.addEntry(
      `[ATTACK] ${attacker.name} → ${defender.name} (d20:${locationRoll} = ${hitLocation}): ${rawDamage} (${damageBreakdown}) - ${armor} armor = ${finalDamage} damage`
    );

    const { justDied, locationMaxed, locationEffect } = this.applyDamageToDefender(defender, finalDamage, hitLocation);

    if (locationMaxed) {
      this.combatLogService.addEntry(`[WOUND] ${defender.name}'s ${hitLocation} — ${locationEffect}!`);
    }
    if (justDied) {
      attacker.kills = (attacker.kills || 0) + 1;
      this.combatLogService.addEntry(`[SLAIN] ${defender.name} was slain by ${attacker.name}!`);
    }

    this.lastDamageRolls.set(attacker.id, {
      total: rawDamage, breakdown: damageBreakdown,
      finalDamage, armorAbsorbed: armor, targetName: defender.name
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
      return weapon ? canWeaponParry(weapon.name) : false;
    }
    const monster = this.monsters.find(m => m.id === participant.monsterId);
    if (!monster) return false;
    const parryItem = participant.selectedParryItem;
    return monster.weapons.some(w => w.name === parryItem && canWeaponParry(w.name));
  }

  getParryRestrictionReason(weaponName: string): string {
    const weapon = WEAPON_LIST.find(w => w.name === weaponName);
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

    if (!this.isValidParryItem(defender)) {
      this.combatLogService.addEntry(
        `[ERROR] ${defender.name} cannot parry with ${defender.selectedParryItem}!`
      );
      this.pendingAttack = null;
      this.saveCombat();
      return;
    }

    const baseParrySkill = this.getEffectiveParrySkill(defender);
    const strB = this.getDefenderStrBonus(defender);
    const sizB = this.getDefenderSizBonus(defender);
    const powB = this.getDefenderPowBonus(defender);
    const dexB = this.getDefenderDexBonus(defender);
    const charBonus = strB + sizB + powB + dexB;
    const penalty = this.getParryPenalty(defender, attacker.id);
    const effectiveSkill = Math.max(5, baseParrySkill + charBonus - penalty);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= effectiveSkill;

    // Track this parry attempt so subsequent ones get the -20% penalty
    if (!defender.parriesAgainst) defender.parriesAgainst = {};
    defender.parriesAgainst[attacker.id] = (defender.parriesAgainst[attacker.id] ?? 0) + 1;

    const weaponHP = this.getParryWeaponCurrentHP(defender);
    const armor = this.getArmorValue(defender, hitLocation);

    // Build human-readable label for the log
    const bonusParts = [
      strB > 0 ? `+${strB} STR` : '',
      sizB > 0 ? `+${sizB} SIZ` : '',
      powB > 0 ? `+${powB} POW` : '',
      dexB > 0 ? `+${dexB} DEX` : '',
      penalty > 0 ? `-${penalty} rpt` : '',
    ].filter(Boolean).join(' ');
    const skillLabel = bonusParts
      ? `${baseParrySkill} ${bonusParts} = ${effectiveSkill}%`
      : `${effectiveSkill}%`;

    if (success) {
      const excessDamage = Math.max(0, rawDamage - weaponHP);
      const finalDamage = Math.max(0, excessDamage - armor);

      let logEntry = `[PARRY] ${defender.name} parries! (rolled ${roll} vs ${skillLabel}) → ${hitLocation} (d20:${locationRoll})`;
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
        `[PARRY FAILED] ${defender.name} failed to parry (rolled ${roll} vs ${skillLabel}) → ${hitLocation} (d20:${locationRoll}): ${finalDamage} damage`
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

    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
  }

  resolveDodge(): void {
    if (!this.pendingAttack) return;
    const { attacker, defender, rawDamage, damageBreakdown, hitLocation, locationRoll } = this.pendingAttack;

    const dodgeSkill = this.getEffectiveDodgeSkill(defender);
    const dexBonus = this.getDefenderDexBonus(defender);
    const intBonus = this.getDefenderIntBonus(defender);
    const encPenalty = this.getEncPenalty(defender);
    const effectiveSkill = Math.max(5, dodgeSkill + dexBonus + intBonus - encPenalty);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= effectiveSkill;

    const bonusParts = [
      dexBonus > 0 ? `+${dexBonus} DEX` : '',
      intBonus > 0 ? `+${intBonus} INT` : '',
      encPenalty > 0 ? `-${encPenalty} ENC` : ''
    ].filter(Boolean).join(' ');
    const bonusPart = bonusParts
      ? ` + ${bonusParts} = ${effectiveSkill}%`
      : `${effectiveSkill}%`;

    if (success) {
      this.combatLogService.addEntry(
        `[DODGE] ${defender.name} dodges! (rolled ${roll} vs ${dodgeSkill}${bonusPart}) — evades ${hitLocation} (d20:${locationRoll}) hit!`
      );
      this.lastDamageRolls.set(attacker.id, {
        total: rawDamage, breakdown: damageBreakdown,
        finalDamage: 0, armorAbsorbed: 0, targetName: defender.name
      });
    } else {
      const armor = this.getArmorValue(defender, hitLocation);
      const finalDamage = Math.max(0, rawDamage - armor);
      this.combatLogService.addEntry(
        `[DODGE FAILED] ${defender.name} fails dodge (rolled ${roll} vs ${dodgeSkill}${bonusPart}) → ${hitLocation} (d20:${locationRoll}): ${finalDamage} damage`
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

    this.pendingAttack = null;
    this.saveCombat();
    this.focusNextRollButton();
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

      const locMax = this.getLocationMaxHP(defender, location);
      if (locMax > 0 && defender.locationDamage[location] >= locMax && prevDmg < locMax) {
        locationMaxed = true;
        locationEffect = LOCATION_EFFECTS[location]?.label ?? '';
        locationFatal = LOCATION_EFFECTS[location]?.fatal ?? false;
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
      if (shield) return character.skills['Shield'] || 0;
      const weapon = character.weapons.find(w => w.name === parryItem);
      return weapon ? (character.skills[weapon.skill] || 0) : 0;
    }
    return 40;
  }

  getEffectiveDodgeSkill(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      return this.characters.find(c => c.id === participant.characterId)?.skills['Dodge'] || 0;
    }
    return 15;
  }

  getEncPenalty(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      return this.characters.find(c => c.id === participant.characterId)?.derivedStats.encumbranceDefensePenalty ?? 0;
    }
    return 0;
  }

  getDefenderDexBonus(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      return this.getParryDexBonus(character?.stats.DEX ?? 10);
    }
    return 0;
  }

  // ── Attacker characteristic bonuses (STR, INT, POW, DEX) ─────────────────

  getAttackerStrBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getAttackStrBonus(char?.stats.STR ?? 10);
  }

  getAttackerIntBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getAttackIntBonus(char?.stats.INT ?? 10);
  }

  getAttackerPowBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getAttackPowBonus(char?.stats.POW ?? 10);
  }

  getAttackerDexBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getAttackDexBonus(char?.stats.DEX ?? 10);
  }

  getTotalAttackBonus(participant: CombatParticipant): number {
    return this.getAttackerStrBonus(participant)
         + this.getAttackerIntBonus(participant)
         + this.getAttackerPowBonus(participant)
         + this.getAttackerDexBonus(participant);
  }

  getEffectiveAttackSkill(participant: CombatParticipant): number {
    let baseSkill = 0;
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (character) {
        const weapon = character.weapons.find(w => w.name === participant.selectedWeapon);
        baseSkill = weapon ? (character.skills[weapon.skill] || 0) : 0;
      }
    } else {
      baseSkill = 50; // default monster attack skill
    }
    return baseSkill + this.getTotalAttackBonus(participant);
  }

  getParticipantParryItems(participant: CombatParticipant): string[] {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return [];
      const shields = (character.shields || []).map(s => s.name);
      const weapons = (character.weapons || []).filter(w => canWeaponParry(w.name)).map(w => w.name);
      return [...shields, ...weapons];
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      return (monster?.weapons || []).filter(w => canWeaponParry(w.name)).map(w => w.name);
    }
  }

  // ── Defender parry characteristic bonuses (STR, SIZ, POW, DEX) ───────────

  getDefenderStrBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getParryStrBonus(char?.stats.STR ?? 10);
  }

  getDefenderSizBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getParrySizBonus(char?.stats.SIZ ?? 10);
  }

  getDefenderPowBonus(participant: CombatParticipant): number {
    if (participant.type !== 'character') return 0;
    const char = this.characters.find(c => c.id === participant.characterId);
    return this.getParryPowBonus(char?.stats.POW ?? 10);
  }

  getTotalParryBonus(participant: CombatParticipant): number {
    return this.getDefenderStrBonus(participant)
         + this.getDefenderSizBonus(participant)
         + this.getDefenderPowBonus(participant)
         + this.getDefenderDexBonus(participant);
  }

  getParryPenalty(defender: CombatParticipant, attackerId: string): number {
    return (defender.parriesAgainst?.[attackerId] ?? 0) * 20;
  }

  getDefenderIntBonus(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      return this.getAttackIntBonus(character?.stats.INT ?? 10);
    }
    return 0;
  }

  getParryWeaponCurrentHP(participant: CombatParticipant): number {
    if (participant.type === 'character') {
      const character = this.characters.find(c => c.id === participant.characterId);
      const parryItem = participant.selectedParryItem;
      if (!parryItem || !character) return 0;
      const shield = character.shields?.find(s => s.name === parryItem);
      if (shield) {
        const maxHP = SHIELD_LIST.find(sd => sd.name === shield.name)?.hitPoints ?? 0;
        return shield.currentHitPoints ?? maxHP;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      if (weapon) {
        const maxHP = WEAPON_LIST.find(wd => wd.name === weapon.name)?.hitPoints ?? 0;
        return weapon.currentHitPoints ?? maxHP;
      }
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedParryItem);
      if (weapon) {
        const maxHP = WEAPON_LIST.find(wd => wd.name === weapon.name)?.hitPoints ?? 8;
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
        return SHIELD_LIST.find(sd => sd.name === shield.name)?.hitPoints ?? 0;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      return weapon ? (WEAPON_LIST.find(wd => wd.name === weapon.name)?.hitPoints ?? 0) : 0;
    }
    const monster = this.monsters.find(m => m.id === participant.monsterId);
    const weapon = monster?.weapons.find(w => w.name === participant.selectedWeapon);
    return weapon ? (WEAPON_LIST.find(wd => wd.name === weapon.name)?.hitPoints ?? 8) : 0;
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
        const maxHP = SHIELD_LIST.find(sd => sd.name === shield.name)?.hitPoints ?? 0;
        shield.currentHitPoints = Math.max(0, (shield.currentHitPoints ?? maxHP) - damage);
        this.characterService.updateCharacter(character);
        this.characters = this.characterService.getCharacters();
        return;
      }
      const weapon = character.weapons.find(w => w.name === parryItem);
      if (weapon) {
        const maxHP = WEAPON_LIST.find(wd => wd.name === weapon.name)?.hitPoints ?? 0;
        weapon.currentHitPoints = Math.max(0, (weapon.currentHitPoints ?? maxHP) - damage);
        this.characterService.updateCharacter(character);
        this.characters = this.characterService.getCharacters();
      }
    } else {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedParryItem);
      if (weapon && monster) {
        const maxHP = WEAPON_LIST.find(wd => wd.name === weapon.name)?.hitPoints ?? 8;
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
    return !participant.isDead && !participant.isSurprised;
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
    return system === 'dragonbane' ? 'Dragonbane' : 'RuneQuest';
  }

  getArmorValue(participant: CombatParticipant, location?: string): number {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 0;

      // If location is provided, always use location-specific armor
      if (location) {
        const locArmor = character.armor[location as keyof typeof character.armor];
        return locArmor !== undefined ? locArmor : 0;
      }

      // No location provided, return average
      const values = Object.values(character.armor);
      return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
    }
    return this.monsters.find(m => m.id === participant.monsterId)?.armor || 0;
  }

  clearDamageRoll(participantId: string): void { this.lastDamageRolls.delete(participantId); }

  getAvailableOpponents(participant: CombatParticipant): CombatParticipant[] {
    const targetType = participant.type === 'character' ? 'monster' : 'character';
    return this.combatParticipants.filter(p => p.type === targetType && !p.isDead);
  }

  onOpponentChange(_participant: CombatParticipant): void { this.debouncedSaveCombat(); }

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
      const values = Object.values(character.armor);
      const total = values.reduce((s, v) => s + v, 0);
      const avg = Math.round(total / values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);
      return min === max ? `${min}` : `${min}-${max} (avg: ${avg})`;
    }
    return this.monsters.find(m => m.id === participant.monsterId)?.armor.toString() || '0';
  }

  getArmorTooltip(participant: CombatParticipant): string {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return '';
      return [
        `Head: ${character.armor['Head']}`,
        `Chest: ${character.armor['Chest']}`,
        `Abdomen: ${character.armor['Abdomen']}`,
        `R.Arm: ${character.armor['Right Arm']}`,
        `L.Arm: ${character.armor['Left Arm']}`,
        `R.Leg: ${character.armor['Right Leg']}`,
        `L.Leg: ${character.armor['Left Leg']}`
      ].join(', ');
    }
    return '';
  }

  // ── Characteristic Bonus Lookup Tables ───────────────────────────────────

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

  private getParryStrBonus(str: number): number {
    if (str <= 4) return -5;
    if (str <= 8) return 0;
    if (str <= 12) return 0;
    if (str <= 16) return 5;
    if (str <= 20) return 5;
    return 5 + Math.floor((str - 20) / 4) * 5;
  }

  private getParrySizBonus(siz: number): number {
    if (siz <= 4) return 5;
    if (siz <= 12) return 0;
    if (siz <= 16) return 0;
    if (siz <= 20) return -5;
    return -5 - Math.floor((siz - 20) / 4) * 5;
  }

  private getParryPowBonus(pow: number): number {
    if (pow <= 4) return -5;
    if (pow <= 12) return 0;
    if (pow <= 16) return 5;
    if (pow <= 20) return 5;
    return 5 + Math.floor((pow - 20) / 4) * 5;
  }

  private getParryDexBonus(dex: number): number {
    if (dex <= 4) return -10;
    if (dex <= 8) return -5;
    if (dex <= 12) return 0;
    if (dex <= 16) return 5;
    if (dex <= 20) return 10;
    return 10 + Math.floor((dex - 20) / 4) * 5;
  }
}
