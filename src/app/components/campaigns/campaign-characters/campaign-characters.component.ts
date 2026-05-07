import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CampaignData } from '../../../models/campaign.model';
import { Character } from '../../../models/character.model';
import { CampaignService } from '../../../services/campaign.service';
import { CharacterService } from '../../../services/character.service';
import { GameSystemService } from '../../../services/game-system.service';

@Component({
  selector: 'app-campaign-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './campaign-characters.component.html',
  styleUrl: './campaign-characters.component.css'
})
export class CampaignCharactersComponent implements OnInit, OnChanges {
  @Input() campaignData!: CampaignData;
  @Output() dataChanged = new EventEmitter<void>();

  campaignCharacters: Character[] = [];
  availableCharacters: Character[] = [];
  showAddModal = false;
  selectedCharacterIds: Set<string> = new Set();

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    public gameSystemService: GameSystemService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData'] && !changes['campaignData'].firstChange) {
      this.loadCharacters();
    }
  }

  loadCharacters(): void {
    const allCharacters = this.characterService.getCharacters();
    const campaignCharacterIds = new Set(this.campaignData.campaign.characterIds);

    this.campaignCharacters = allCharacters.filter(c => campaignCharacterIds.has(c.id));
    this.availableCharacters = allCharacters.filter(c => !campaignCharacterIds.has(c.id));
  }

  openAddModal(): void {
    this.selectedCharacterIds.clear();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedCharacterIds.clear();
  }

  toggleCharacterSelection(characterId: string): void {
    if (this.selectedCharacterIds.has(characterId)) {
      this.selectedCharacterIds.delete(characterId);
    } else {
      this.selectedCharacterIds.add(characterId);
    }
  }

  addSelectedCharacters(): void {
    if (this.selectedCharacterIds.size === 0) {
      alert('Please select at least one character');
      return;
    }

    this.selectedCharacterIds.forEach(characterId => {
      this.campaignService.addCharacterToCampaign(this.campaignData.campaign.id, characterId);
    });

    this.closeAddModal();
    this.loadCharacters();
    this.dataChanged.emit();
  }

  removeCharacter(characterId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Remove this character from the campaign?')) {
      this.campaignService.removeCharacterFromCampaign(this.campaignData.campaign.id, characterId);
      this.loadCharacters();
      this.dataChanged.emit();
    }
  }

  getCharacterHP(character: Character): string {
    const current = character.derivedStats.totalHitPoints;
    const max = character.derivedStats.maxHitPoints || character.derivedStats.totalHitPoints;
    return `${current}/${max}`;
  }

  getCharacterOccupation(character: Character): string {
    return character.background?.occupation || 'Unknown';
  }

  getCharacterCult(character: Character): string {
    return character.background?.cult || 'Unknown';
  }

  getCharacterMainSkills(character: Character): string {
    if (!character.skills) return 'No skills';
    const skillEntries = Object.entries(character.skills);
    if (skillEntries.length === 0) return 'No skills';
    return skillEntries.slice(0, 3).map(([_, value]) => value).join(', ');
  }
}
