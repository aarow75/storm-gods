import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MONSTERS } from '../../constants/monsters.constants';
import { ENCOUNTER_TABLES, EncounterTable } from '../../constants/encounters.constants';
import { HIT_LOCATION_TEMPLATES } from '../../constants/hit-location-templates.constants';
import { Monster, calculateMonsterHitLocations } from '../../models/monster.model';
import { CombatParticipant, Monster as CombatMonster } from '../../models/combat.model';
import { getSizeModifier, getDexterityModifier } from '../../models/character.model';
import { CustomMonsterService } from '../../services/custom-monster.service';
import { GameSystemService } from '../../services/game-system.service';
import { CombatService } from '../../services/combat.service';

@Component({
  selector: 'app-bestiary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bestiary.component.html',
  styleUrls: ['./bestiary.component.css']
})
export class BestiaryComponent implements OnInit {
  monsters: Monster[] = [];
  encounterTables: EncounterTable[] = ENCOUNTER_TABLES;
  systemFilter = signal<'all' | 'runequest' | 'dragonbane'>('all');
  searchQuery = signal('');
  categoryFilter = signal<string>('all');
  expandedMonsterId = signal<string | null>(null);
  activeTab = signal<'bestiary' | 'encounters'>('bestiary');
  expandedTerrainId = signal<string | null>(null);
  selectedTerrain = signal<string | null>(null);
  lastRoll = signal<number | null>(null);
  isRolling = signal(false);
  addedToCombat = signal(false);
  addedCreatureName = signal<string | null>(null);
  countRoll = signal<number | null>(null);
  isCountRolling = signal(false);

  filteredMonsters = computed(() => {
    let result = this.monsters;

    // Filter by system
    const systemFilter = this.systemFilter();
    if (systemFilter === 'runequest') {
      result = result.filter(m => m.gameSystem === 'runequest' || m.gameSystem === 'both');
    } else if (systemFilter === 'dragonbane') {
      result = result.filter(m => m.gameSystem === 'dragonbane' || m.gameSystem === 'both');
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(m => m.name.toLowerCase().includes(query));
    }

    // Filter by category
    const category = this.categoryFilter();
    if (category !== 'all') {
      result = result.filter(m => m.category === category);
    }

    return result;
  });

  categories = ['humanoid', 'beast', 'undead', 'chaos', 'dragon', 'spirit', 'npc', 'mount'];

  constructor(
    private customMonsterService: CustomMonsterService,
    public gameSystemService: GameSystemService,
    private combatService: CombatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMonsters();
  }

  loadMonsters(): void {
    const customMonsters = this.customMonsterService.getMonsters();
    this.monsters = [...MONSTERS, ...customMonsters];
  }

  deleteCustomMonster(id: string): void {
    if (window.confirm('Are you sure you want to delete this custom monster?')) {
      this.customMonsterService.deleteMonster(id);
      this.loadMonsters();
    }
  }

  isCustomMonster(monster: Monster): boolean {
    return monster.isCustom === true;
  }

  toggleSystemFilter(system: 'all' | 'runequest' | 'dragonbane'): void {
    this.systemFilter.set(system);
  }

  toggleCategoryFilter(category: string): void {
    if (this.categoryFilter() === category) {
      this.categoryFilter.set('all');
    } else {
      this.categoryFilter.set(category);
    }
  }

  toggleExpanded(monsterId: string): void {
    if (this.expandedMonsterId() === monsterId) {
      this.expandedMonsterId.set(null);
    } else {
      this.expandedMonsterId.set(monsterId);
    }
  }

  getSystemBadgeClass(gameSystem: string): string {
    if (gameSystem === 'runequest') return 'system-runequest';
    if (gameSystem === 'dragonbane') return 'system-dragonbane';
    return 'system-both';
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'humanoid': 'Humanoid',
      'beast': 'Beast',
      'undead': 'Undead',
      'chaos': 'Chaos',
      'dragon': 'Dragon',
      'spirit': 'Spirit',
      'npc': 'NPC',
      'mount': 'Mount'
    };
    return labels[category] || category;
  }

  toggleTerrainExpanded(terrain: string): void {
    if (this.expandedTerrainId() === terrain) {
      this.expandedTerrainId.set(null);
    } else {
      this.expandedTerrainId.set(terrain);
    }
  }

  setActiveTab(tab: 'bestiary' | 'encounters'): void {
    this.activeTab.set(tab);
  }

  selectTerrain(terrain: string): void {
    this.selectedTerrain.set(terrain);
    this.lastRoll.set(null);
  }

  rollD20(): void {
    this.isRolling.set(true);
    this.countRoll.set(null);
    const roll = Math.floor(Math.random() * 20) + 1;

    setTimeout(() => {
      this.lastRoll.set(roll);
      this.isRolling.set(false);
    }, 600);
  }

  getEncounterForRoll(terrain: string | null, roll: number): any {
    if (!terrain) return null;
    const table = this.encounterTables.find(t => t.terrain === terrain);
    if (!table) return null;

    const entry = table.entries.find(e => {
      const rollParts = e.roll.split('-').map(r => parseInt(r.trim()));
      if (rollParts.length === 2) {
        return roll >= rollParts[0] && roll <= rollParts[1];
      }
      return parseInt(e.roll) === roll;
    });

    return entry || null;
  }

  isRowHighlighted(rollRange: string, currentRoll: number | null): boolean {
    if (!currentRoll) return false;
    const rollParts = rollRange.split('-').map(r => parseInt(r.trim()));
    if (rollParts.length === 2) {
      return currentRoll >= rollParts[0] && currentRoll <= rollParts[1];
    }
    return parseInt(rollRange) === currentRoll;
  }

  addCreatureToCombat(creatureName: string): void {
    const bestiaryMonster = MONSTERS.find(m => m.name === creatureName);
    if (!bestiaryMonster) {
      console.error('Creature not found:', creatureName);
      return;
    }

    // Convert bestiary monster to combat monster with weapons
    const combatMonster: CombatMonster = {
      id: `bestiary-${bestiaryMonster.id}-${this.combatService.generateId().substring(0, 8)}`,
      name: bestiaryMonster.name,
      hitPoints: bestiaryMonster.hitPoints,
      strikeRank: getSizeModifier(bestiaryMonster.stats.SIZ) + getDexterityModifier(bestiaryMonster.stats.DEX),
      armor: bestiaryMonster.armor,
      weapons: bestiaryMonster.attacks.map(a => ({
        name: a.name,
        damage: a.damage,
        strikeRankModifier: 0
      }))
    };

    // Save the combat monster
    this.combatService.saveMonster(combatMonster);

    // Create combat participant
    const combatParticipant: CombatParticipant = {
      id: this.combatService.generateId(),
      name: bestiaryMonster.name,
      type: 'monster',
      monsterId: combatMonster.id,
      maxHitPoints: bestiaryMonster.hitPoints,
      currentHitPoints: Array(bestiaryMonster.hitPoints).fill(false),
      baseStrikeRank: combatMonster.strikeRank,
      finalStrikeRank: combatMonster.strikeRank,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    const participants = this.combatService.getCombatParticipants();
    participants.push(combatParticipant);
    this.combatService.saveCombatParticipants(participants);

    this.addedToCombat.set(true);
    this.addedCreatureName.set(creatureName);

    setTimeout(() => {
      this.addedToCombat.set(false);
      this.addedCreatureName.set(null);
    }, 3000);
  }

  navigateToCombat(): void {
    this.router.navigate(this.gameSystemService.link('combat'));
  }

  getGameSystemName(system: string): string {
    if (system === 'runequest') return 'RuneQuest';
    if (system === 'dragonbane') return 'DragonBane';
    return 'Both';
  }

  getMonsterHitLocations(monster: Monster): { name: string; hp: number }[] | null {
    if (!monster.hitLocationTemplateId) return null;
    const template = HIT_LOCATION_TEMPLATES.find(t => t.id === monster.hitLocationTemplateId);
    return template
      ? calculateMonsterHitLocations(monster.stats.CON, monster.stats.SIZ, template)
      : null;
  }

  parseDiceExpression(countStr: string): { quantity: number; sides: number } | null {
    const match = countStr.match(/^(\d+)d(\d+)$/i);
    if (!match) return null;
    return {
      quantity: parseInt(match[1]),
      sides: parseInt(match[2])
    };
  }

  rollCount(countStr: string): void {
    const parsed = this.parseDiceExpression(countStr);
    if (!parsed) return;
    this.isCountRolling.set(true);
    let total = 0;
    for (let i = 0; i < parsed.quantity; i++) {
      total += Math.floor(Math.random() * parsed.sides) + 1;
    }
    setTimeout(() => {
      this.countRoll.set(total);
      this.isCountRolling.set(false);
    }, 400);
  }
}
