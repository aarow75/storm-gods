import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CombatParticipant } from '@shared/models/combat-participant.model';
import { CombatService } from '@combat/services/combat.service';
import { GameSystemService } from '@shared/services/game-system.service';

/**
 * Narrow interface for features that need to add participants and launch combat
 * without depending on the full CombatService API.
 */
@Injectable({ providedIn: 'root' })
export class EncounterLaunchService {
  private readonly combatService = inject(CombatService);
  private readonly router = inject(Router);
  private readonly gameSystemService = inject(GameSystemService);

  generateId(): string {
    return this.combatService.generateId();
  }

  /** Merges new participants with existing ones, sorts by strike rank, saves, and navigates to combat. */
  launchEncounter(newParticipants: CombatParticipant[]): void {
    const existing = this.combatService.getCombatParticipants();
    const all = [...existing, ...newParticipants];
    this.combatService.saveCombatParticipants(
      this.combatService.sortParticipantsByStrikeRank(all)
    );
    this.router.navigate(this.gameSystemService.link('combat'));
  }

  /** Adds participants to the current combat without navigating. */
  addParticipants(newParticipants: CombatParticipant[]): void {
    const existing = this.combatService.getCombatParticipants();
    this.combatService.saveCombatParticipants([...existing, ...newParticipants]);
  }

  navigateToCombat(): void {
    this.router.navigate(this.gameSystemService.link('combat'));
  }
}
