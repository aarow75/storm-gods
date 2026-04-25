import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MONSTERS } from '../../constants/monsters.constants';
import { Monster } from '../../models/monster.model';
import { GameSystemService } from '../../services/game-system.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-bestiary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bestiary.component.html',
  styleUrls: ['./bestiary.component.css']
})
export class BestiaryComponent implements OnInit {
  monsters = MONSTERS;
  systemFilter = signal<'all' | 'runequest' | 'dragonbane'>('all');
  searchQuery = signal('');
  categoryFilter = signal<string>('all');
  expandedMonsterId = signal<string | null>(null);

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

  categories = ['humanoid', 'beast', 'undead', 'chaos', 'dragon', 'spirit'];

  constructor(
    private gameSystemService: GameSystemService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {}

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
      'spirit': 'Spirit'
    };
    return labels[category] || category;
  }

  getGameSystemName(system: string): string {
    if (system === 'runequest') return 'RuneQuest';
    if (system === 'dragonbane') return 'DragonBane';
    return 'Both';
  }
}
