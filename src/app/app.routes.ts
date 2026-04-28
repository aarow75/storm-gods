import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterFormComponent } from './components/character-form/character-form.component';
import { CombatTrackerComponent } from './components/combat-tracker/combat-tracker.component';
import { CombatMapComponent } from './components/combat-map/combat-map.component';
import { RulesReferenceComponent } from './components/rules-reference/rules-reference.component';
import { BestiaryComponent } from './components/bestiary/bestiary.component';
import { MonsterCreatorComponent } from './components/monster-creator/monster-creator.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterListComponent },
  { path: 'create', component: CharacterFormComponent },
  { path: 'combat', component: CombatTrackerComponent },
  { path: 'combat-map', component: CombatMapComponent },
  { path: 'rules', component: RulesReferenceComponent },
  { path: 'bestiary', component: BestiaryComponent },
  { path: 'monster-creator', component: MonsterCreatorComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/characters' }
];
