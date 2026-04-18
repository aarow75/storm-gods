import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CombatParticipant, Monster, DEFAULT_MONSTERS, WEAPON_STRIKE_RANKS } from '../../models/combat.model';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { CombatService } from '../../services/combat.service';
import { DiceService } from '../../services/dice.service';
import { CharacterUpdateService } from '../../services/character-update.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-combat-tracker',
  imports: [CommonModule, FormsModule],
  templateUrl: './combat-tracker.component.html',
  styleUrl: './combat-tracker.component.css'
})
export class CombatTrackerComponent implements OnInit {
  characters: Character[] = [];
  monsters: Monster[] = [];
  combatParticipants: CombatParticipant[] = [];

  showAddParticipantModal = false;
  showAddMonsterModal = false;
  selectedEntityType: 'character' | 'monster' = 'character';
  selectedCharacterId = '';
  selectedMonsterId = '';
  selectedWeapon = '';

  newMonster: Monster = {
    id: '',
    name: '',
    hitPoints: 10,
    strikeRank: 10,
    armor: 0,
    weapons: []
  };

  newMonsterWeapon = {
    name: '',
    damage: '',
    strikeRankModifier: 0
  };

  // Track last damage roll for each participant
  lastDamageRolls: Map<string, { total: number; breakdown: string; finalDamage: number; armorAbsorbed: number; targetName: string }> = new Map();
  combatLog: string[] = [];
  showLogHistory = false;

  constructor(
    private characterService: CharacterService,
    private combatService: CombatService,
    private diceService: DiceService,
    private characterUpdateService: CharacterUpdateService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.characters = this.characterService.getCharacters();
    this.monsters = [...DEFAULT_MONSTERS, ...this.combatService.getMonsters()];
    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(
      this.combatService.getCombatParticipants()
    );
    this.autoAssignOpponentsIfNeeded();
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
  }

  onEntityTypeChange(): void {
    this.selectedCharacterId = '';
    this.selectedMonsterId = '';
    this.selectedWeapon = '';
  }

  onCharacterSelect(): void {
    const character = this.characters.find(c => c.id === this.selectedCharacterId);
    if (character && character.weapons.length > 0) {
      this.selectedWeapon = character.weapons[0].name;
    }
  }

  onMonsterSelect(): void {
    const monster = this.monsters.find(m => m.id === this.selectedMonsterId);
    if (monster && monster.weapons.length > 0) {
      this.selectedWeapon = monster.weapons[0].name;
    }
  }

  getAvailableWeapons(): string[] {
    if (this.selectedEntityType === 'character' && this.selectedCharacterId) {
      const character = this.characters.find(c => c.id === this.selectedCharacterId);
      return character?.weapons.map(w => w.name) || [];
    } else if (this.selectedEntityType === 'monster' && this.selectedMonsterId) {
      const monster = this.monsters.find(m => m.id === this.selectedMonsterId);
      return monster?.weapons.map(w => w.name) || [];
    }
    return [];
  }

  addParticipant(): void {
    if (this.selectedEntityType === 'character' && this.selectedCharacterId) {
      const character = this.characters.find(c => c.id === this.selectedCharacterId);
      if (!character) return;

      const baseStrikeRank = character.derivedStats.strikeRank;
      const finalStrikeRank = this.combatService.calculateFinalStrikeRank(
        baseStrikeRank,
        this.selectedWeapon
      );

      const maxHP = character.derivedStats.maxHitPoints || character.derivedStats.totalHitPoints;
      const currentHP = character.derivedStats.totalHitPoints;
      const damageTaken = Math.max(0, maxHP - currentHP);

      // Create HP array with existing damage already marked
      const hpArray = new Array(maxHP).fill(false);
      for (let i = 0; i < damageTaken; i++) {
        hpArray[i] = true;
      }

      const participant: CombatParticipant = {
        id: this.combatService.generateId(),
        name: character.name,
        type: 'character',
        characterId: character.id,
        maxHitPoints: maxHP,
        currentHitPoints: hpArray,
        baseStrikeRank: baseStrikeRank,
        selectedWeapon: this.selectedWeapon,
        finalStrikeRank: finalStrikeRank,
        isDead: currentHP <= 0,
        kills: 0,
        color: character.color || '#3498db'
      };

      this.combatParticipants.push(participant);
    } else if (this.selectedEntityType === 'monster' && this.selectedMonsterId) {
      const monster = this.monsters.find(m => m.id === this.selectedMonsterId);
      if (!monster) return;

      const baseStrikeRank = monster.strikeRank;
      const weapon = monster.weapons.find(w => w.name === this.selectedWeapon);
      const weaponModifier = weapon?.strikeRankModifier || 0;
      const finalStrikeRank = baseStrikeRank + weaponModifier;

      const participant: CombatParticipant = {
        id: this.combatService.generateId(),
        name: monster.name,
        type: 'monster',
        monsterId: monster.id,
        maxHitPoints: monster.hitPoints,
        currentHitPoints: new Array(monster.hitPoints).fill(false),
        baseStrikeRank: baseStrikeRank,
        selectedWeapon: this.selectedWeapon,
        finalStrikeRank: finalStrikeRank,
        isDead: false,
        kills: 0,
        color: '#000000'
      };

      this.combatParticipants.push(participant);
    }

    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(this.combatParticipants);
    this.autoAssignOpponentsIfNeeded();
    this.saveCombat();
    this.closeAddParticipantModal();
  }

  removeParticipant(id: string): void {
    this.combatParticipants = this.combatParticipants.filter(p => p.id !== id);

    // Clear opponent selections that pointed to the removed participant
    this.combatParticipants.forEach(p => {
      if (p.selectedOpponentId === id) {
        p.selectedOpponentId = undefined;
      }
    });

    this.autoAssignOpponentsIfNeeded();
    this.saveCombat();
  }

  onWeaponChange(participant: CombatParticipant): void {
    if (participant.type === 'character') {
      participant.finalStrikeRank = this.combatService.calculateFinalStrikeRank(
        participant.baseStrikeRank,
        participant.selectedWeapon
      );
    } else if (participant.type === 'monster') {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedWeapon);
      const weaponModifier = weapon?.strikeRankModifier || 0;
      participant.finalStrikeRank = participant.baseStrikeRank + weaponModifier;
    }

    this.combatParticipants = this.combatService.sortParticipantsByStrikeRank(this.combatParticipants);
    this.saveCombat();
  }

  toggleHitPoint(participant: CombatParticipant, index: number): void {
    participant.currentHitPoints[index] = !participant.currentHitPoints[index];
    this.saveCombat();
  }

  getHitPointsRemaining(participant: CombatParticipant): number {
    const damageTaken = participant.currentHitPoints.filter(hp => hp).length;
    return participant.maxHitPoints - damageTaken;
  }

  getHitPointsDisplay(participant: CombatParticipant): string {
    const remaining = this.getHitPointsRemaining(participant);
    if (remaining < 0) {
      return `${remaining} / ${participant.maxHitPoints}`;
    }
    return `${remaining} / ${participant.maxHitPoints}`;
  }

  clearCombat(): void {
    if (confirm('Clear all combat participants? (Combat log will be saved to history)')) {
      // Save current log to history before clearing
      if (this.combatLog.length > 0) {
        this.combatService.saveCombatLog(this.combatLog);
      }

      this.combatParticipants = [];
      this.combatService.clearCombat();
      this.combatLog = [];
      this.lastDamageRolls.clear();
    }
  }

  saveCombat(): void {
    this.combatService.saveCombatParticipants(this.combatParticipants);
  }

  // Monster management
  openAddMonsterModal(): void {
    this.showAddMonsterModal = true;
    this.newMonster = {
      id: this.combatService.generateId(),
      name: '',
      hitPoints: 10,
      strikeRank: 10,
      armor: 0,
      weapons: []
    };
    this.newMonsterWeapon = {
      name: '',
      damage: '',
      strikeRankModifier: 0
    };
  }

  closeAddMonsterModal(): void {
    this.showAddMonsterModal = false;
  }

  addWeaponToNewMonster(): void {
    if (this.newMonsterWeapon.name && this.newMonsterWeapon.damage) {
      this.newMonster.weapons.push({ ...this.newMonsterWeapon });
      this.newMonsterWeapon = {
        name: '',
        damage: '',
        strikeRankModifier: 0
      };
    }
  }

  removeWeaponFromNewMonster(index: number): void {
    this.newMonster.weapons.splice(index, 1);
  }

  saveNewMonster(): void {
    if (this.newMonster.name && this.newMonster.weapons.length > 0) {
      this.combatService.saveMonster(this.newMonster);
      this.loadData();
      this.closeAddMonsterModal();
    }
  }

  deleteCustomMonster(id: string): void {
    if (confirm('Delete this custom monster?')) {
      this.combatService.deleteMonster(id);
      this.loadData();
    }
  }

  isCustomMonster(monsterId: string): boolean {
    return !DEFAULT_MONSTERS.find(m => m.id === monsterId);
  }

  getParticipantWeapons(participant: CombatParticipant): string[] {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      return character?.weapons.map(w => w.name) || [];
    } else if (participant.type === 'monster' && participant.monsterId) {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      return monster?.weapons.map(w => w.name) || [];
    }
    return [];
  }

  getWeaponDamage(participant: CombatParticipant): string {
    if (!participant.selectedWeapon) return '';

    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      const weapon = character?.weapons.find(w => w.name === participant.selectedWeapon);
      return weapon?.damage || '';
    } else if (participant.type === 'monster' && participant.monsterId) {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      const weapon = monster?.weapons.find(w => w.name === participant.selectedWeapon);
      return weapon?.damage || '';
    }
    return '';
  }

  rollWeaponDamage(participant: CombatParticipant): void {
    const damage = this.getWeaponDamage(participant);
    if (!damage || participant.isDead) return;

    // Check if opponent is selected
    if (!participant.selectedOpponentId) {
      alert('Please select an opponent first!');
      return;
    }

    const opponent = this.combatParticipants.find(p => p.id === participant.selectedOpponentId);
    if (!opponent || opponent.isDead) {
      alert('Selected opponent is not available!');
      return;
    }

    const result = this.diceService.rollDiceNotation(damage);
    const opponentArmor = this.getArmorValue(opponent);
    const finalDamage = Math.max(0, result.total - opponentArmor);

    // Apply damage to opponent
    const currentDamage = opponent.currentHitPoints.filter(hp => hp).length;
    const newDamage = currentDamage + finalDamage;

    // Mark hit points - check all boxes if overkill
    if (newDamage >= opponent.maxHitPoints) {
      // Mark all HP boxes as checked when dead
      for (let i = 0; i < opponent.currentHitPoints.length; i++) {
        opponent.currentHitPoints[i] = true;
      }
    } else {
      // Normal damage - only mark up to newDamage
      for (let i = 0; i < opponent.currentHitPoints.length && i < newDamage; i++) {
        opponent.currentHitPoints[i] = true;
      }
    }

    // Update character's actual HP in storage if it's a character
    if (opponent.type === 'character' && opponent.characterId && finalDamage > 0) {
      this.updateCharacterHitPoints(opponent.characterId, finalDamage, newDamage >= opponent.maxHitPoints);
    }

    // Check if opponent died
    const wasDead = opponent.isDead;
    if (newDamage >= opponent.maxHitPoints && !wasDead) {
      opponent.isDead = true;
      participant.kills = (participant.kills || 0) + 1;
      const excessDamage = newDamage - opponent.maxHitPoints;
      if (excessDamage > 0) {
        this.combatLog.unshift(`[SLAIN] ${opponent.name} was slain by ${participant.name}! (${excessDamage} overkill damage)`);
      } else {
        this.combatLog.unshift(`[SLAIN] ${opponent.name} was slain by ${participant.name}!`);
      }
    }

    // Store the result
    this.lastDamageRolls.set(participant.id, {
      total: result.total,
      breakdown: result.breakdown,
      finalDamage: finalDamage,
      armorAbsorbed: opponentArmor,
      targetName: opponent.name
    });

    this.combatLog.unshift(
      `[ATTACK] ${participant.name} attacks ${opponent.name}: ${result.total} damage - ${opponentArmor} armor = ${finalDamage} damage dealt`
    );

    this.saveCombat();
  }

  updateCharacterHitPoints(characterId: string, damageDealt: number, isDead: boolean): void {
    const character = this.characterService.getCharacter(characterId);
    if (!character) return;

    // Reduce current hit points (can go negative)
    const newHP = character.derivedStats.totalHitPoints - damageDealt;

    if (isDead && newHP > 0) {
      // If marked as dead but HP is still positive, set to 0
      character.derivedStats.totalHitPoints = 0;
    } else {
      // Allow negative HP to show overkill
      character.derivedStats.totalHitPoints = newHP;
    }

    this.characterService.updateCharacter(character);

    // Reload just the characters list (not combat participants, as they're already updated)
    this.characters = this.characterService.getCharacters();

    // Notify other components that a character was updated
    this.characterUpdateService.notifyCharacterUpdated();
  }

  getLastDamageRoll(participantId: string): { total: number; breakdown: string; finalDamage: number; armorAbsorbed: number; targetName: string } | undefined {
    return this.lastDamageRolls.get(participantId);
  }

  getArmorValue(participant: CombatParticipant): number {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 0;

      // Use average armor for simplicity in combat
      const armorValues = Object.values(character.armor);
      const total = armorValues.reduce((sum, val) => sum + val, 0);
      return Math.round(total / armorValues.length);
    } else if (participant.type === 'monster' && participant.monsterId) {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      return monster?.armor || 0;
    }
    return 0;
  }

  clearDamageRoll(participantId: string): void {
    this.lastDamageRolls.delete(participantId);
  }

  getAvailableOpponents(participant: CombatParticipant): CombatParticipant[] {
    // Characters can only target monsters, monsters can only target characters
    const targetType = participant.type === 'character' ? 'monster' : 'character';
    return this.combatParticipants.filter(p =>
      p.type === targetType && !p.isDead
    );
  }

  onOpponentChange(participant: CombatParticipant): void {
    this.saveCombat();
  }

  clearCombatLog(): void {
    if (this.combatLog.length > 0) {
      if (confirm('Save this combat log to history and clear?')) {
        this.combatService.saveCombatLog(this.combatLog);
        this.combatLog = [];
        this.saveCombat();
      }
    }
  }

  toggleLogHistory(): void {
    this.showLogHistory = !this.showLogHistory;
  }

  getCombatLogHistory() {
    return this.combatService.getCombatLogHistory();
  }

  deleteLogEntry(timestamp: number): void {
    if (confirm('Delete this combat log?')) {
      this.combatService.deleteCombatLogEntry(timestamp);
    }
  }

  clearAllHistory(): void {
    if (confirm('Delete all combat log history? This cannot be undone.')) {
      this.combatService.clearCombatLogHistory();
    }
  }

  autoAssignOpponentsIfNeeded(): void {
    // Only auto-assign if there are exactly 2 participants
    if (this.combatParticipants.length !== 2) {
      return;
    }

    const [first, second] = this.combatParticipants;

    // Check if they are opposite types (character vs monster)
    if (first.type === second.type) {
      // Both same type, can't auto-assign (character can only fight monster and vice versa)
      return;
    }

    // Auto-assign each to the other if not already assigned
    if (!first.selectedOpponentId) {
      first.selectedOpponentId = second.id;
    }

    if (!second.selectedOpponentId) {
      second.selectedOpponentId = first.id;
    }

    this.saveCombat();
  }

  getArmorDisplay(participant: CombatParticipant): string {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return 'N/A';

      // Calculate average armor across all hit locations
      const armorValues = Object.values(character.armor);
      const total = armorValues.reduce((sum, val) => sum + val, 0);
      const average = Math.round(total / armorValues.length);

      // Find min and max armor
      const min = Math.min(...armorValues);
      const max = Math.max(...armorValues);

      // If all armor is the same, just show one number
      if (min === max) {
        return `${min}`;
      }

      // Otherwise show range
      return `${min}-${max} (avg: ${average})`;
    } else if (participant.type === 'monster' && participant.monsterId) {
      const monster = this.monsters.find(m => m.id === participant.monsterId);
      return monster?.armor.toString() || '0';
    }
    return 'N/A';
  }

  getArmorTooltip(participant: CombatParticipant): string {
    if (participant.type === 'character' && participant.characterId) {
      const character = this.characters.find(c => c.id === participant.characterId);
      if (!character) return '';

      const locations = [
        `Head: ${character.armor['Head']}`,
        `Chest: ${character.armor['Chest']}`,
        `Abdomen: ${character.armor['Abdomen']}`,
        `R.Arm: ${character.armor['Right Arm']}`,
        `L.Arm: ${character.armor['Left Arm']}`,
        `R.Leg: ${character.armor['Right Leg']}`,
        `L.Leg: ${character.armor['Left Leg']}`
      ];

      return locations.join(', ');
    }
    return '';
  }
}
