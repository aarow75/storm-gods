import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Monster } from '../../models/monster.model';
import { CustomMonsterService } from '../../services/custom-monster.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-monster-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './monster-creator.component.html',
  styleUrls: ['./monster-creator.component.css']
})
export class MonsterCreatorComponent implements OnInit {
  monsters: Monster[] = [];
  editingMonster: Monster | null = null;
  showForm = false;

  form: {
    name: string;
    description: string;
    category: 'humanoid' | 'beast' | 'undead' | 'chaos' | 'dragon' | 'spirit';
    gameSystem: 'runequest' | 'dragonbane' | 'both';
    hitPoints: number;
    armor: number;
    armorDescription: string;
    movement: number;
    strikeRank: number;
    stats: { STR: number; CON: number; SIZ: number; DEX: number; INT: number; POW: number; CHA: number };
    attacks: { name: string; damage: string; skill: number }[];
    specialAbilities: string[];
  } = {
    name: '',
    description: '',
    category: 'humanoid',
    gameSystem: 'runequest',
    hitPoints: 10,
    armor: 0,
    armorDescription: '',
    movement: 10,
    strikeRank: 10,
    stats: {
      STR: 10,
      CON: 10,
      SIZ: 10,
      DEX: 10,
      INT: 10,
      POW: 10,
      CHA: 10
    },
    attacks: [{ name: '', damage: '', skill: 50 }],
    specialAbilities: ['']
  };

  categories = ['humanoid', 'beast', 'undead', 'chaos', 'dragon', 'spirit'];
  gameSystems = [
    { value: 'runequest', label: 'RuneQuest' },
    { value: 'dragonbane', label: 'DragonBane' },
    { value: 'both', label: 'Both Systems' }
  ];

  constructor(
    private monsterService: CustomMonsterService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadMonsters();
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        const monster = this.monsters.find(m => m.id === params['edit']);
        if (monster) {
          this.editMonster(monster);
        }
      }
    });
  }

  loadMonsters(): void {
    this.monsters = this.monsterService.getMonsters();
  }

  startNew(): void {
    this.editingMonster = null;
    this.resetForm();
    this.showForm = true;
    window.scrollTo(0, 0);
  }

  editMonster(monster: Monster): void {
    this.editingMonster = monster;
    this.populateForm(monster);
    this.showForm = true;
    window.scrollTo(0, 0);
  }

  populateForm(monster: Monster): void {
    this.form = {
      name: monster.name,
      description: monster.description,
      category: monster.category,
      gameSystem: monster.gameSystem,
      hitPoints: monster.hitPoints,
      armor: monster.armor,
      armorDescription: monster.armorDescription,
      movement: monster.movement,
      strikeRank: monster.strikeRank || 10,
      stats: { ...monster.stats },
      attacks: monster.attacks.length > 0 ? [...monster.attacks] : [{ name: '', damage: '', skill: 50 }],
      specialAbilities: monster.specialAbilities && monster.specialAbilities.length > 0
        ? [...monster.specialAbilities]
        : ['']
    };
  }

  resetForm(): void {
    this.form = {
      name: '',
      description: '',
      category: 'humanoid',
      gameSystem: 'runequest',
      hitPoints: 10,
      armor: 0,
      armorDescription: '',
      movement: 10,
      strikeRank: 10,
      stats: {
        STR: 10,
        CON: 10,
        SIZ: 10,
        DEX: 10,
        INT: 10,
        POW: 10,
        CHA: 10
      },
      attacks: [{ name: '', damage: '', skill: 50 }],
      specialAbilities: ['']
    };
  }

  saveMonster(): void {
    if (!this.form.name.trim()) {
      alert('Monster name is required');
      return;
    }

    const monsterToSave: Monster = {
      id: this.editingMonster?.id || this.monsterService.generateId(),
      name: this.form.name,
      description: this.form.description,
      category: this.form.category,
      gameSystem: this.form.gameSystem,
      hitPoints: this.form.hitPoints,
      armor: this.form.armor,
      armorDescription: this.form.armorDescription,
      movement: this.form.movement,
      strikeRank: this.form.strikeRank,
      stats: this.form.stats,
      attacks: this.form.attacks.filter(a => a.name.trim()),
      specialAbilities: this.form.specialAbilities.filter(a => a.trim()),
      isCustom: true
    };

    this.monsterService.saveMonster(monsterToSave);
    this.loadMonsters();
    this.resetForm();
    this.showForm = false;
    this.editingMonster = null;
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingMonster = null;
    this.resetForm();
  }

  deleteMonster(id: string): void {
    if (window.confirm('Are you sure you want to delete this monster?')) {
      this.monsterService.deleteMonster(id);
      this.loadMonsters();
      if (this.editingMonster?.id === id) {
        this.cancelEdit();
      }
    }
  }

  addAttack(): void {
    this.form.attacks.push({ name: '', damage: '', skill: 50 });
  }

  removeAttack(index: number): void {
    this.form.attacks.splice(index, 1);
  }

  addAbility(): void {
    this.form.specialAbilities.push('');
  }

  removeAbility(index: number): void {
    this.form.specialAbilities.splice(index, 1);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'humanoid': 'Humanoid',
      'beast': 'Beast',
      'undead': 'Undead',
      'chaos': 'Chaos',
      'dragon': 'Dragon',
      'spirit': 'Spirit'
    };
    return labels[category] || category;
  }

  getGameSystemLabel(system: string): string {
    return this.gameSystems.find(s => s.value === system)?.label || system;
  }

  getStat(stat: string): number {
    return this.form.stats[stat as keyof typeof this.form.stats] || 10;
  }

  setStat(stat: string, value: number): void {
    this.form.stats[stat as keyof typeof this.form.stats] = value;
  }

  updateAbility(index: number, value: string): void {
    this.form.specialAbilities[index] = value;
  }
}
