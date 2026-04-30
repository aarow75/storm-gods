import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterFormComponent } from './components/character-form/character-form.component';
import { CombatTrackerComponent } from './components/combat-tracker/combat-tracker.component';
import { CombatMapComponent } from './components/combat-map/combat-map.component';
import { RulesReferenceComponent } from './components/rules-reference/rules-reference.component';
import { BestiaryComponent } from './components/bestiary/bestiary.component';
import { MonsterCreatorComponent } from './components/monster-creator/monster-creator.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WildernessMapComponent } from './components/wilderness-map/wilderness-map.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { DocsComponent } from './components/docs/docs.component';
import { GameMastersScreenComponent } from './components/game-masters-screen/game-masters-screen.component';

export const routes: Routes = [
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterListComponent },
  { path: 'create', component: CharacterFormComponent },
  { path: 'combat', component: CombatTrackerComponent },
  { path: 'combat-map', component: CombatMapComponent },
  { path: 'wilderness-map', component: WildernessMapComponent },
  {
    path: 'docs',
    component: DocsComponent,
    children: [
      { path: 'rules', component: RulesReferenceComponent },
      { path: 'publications', component: PublicationsComponent },
      { path: 'gm-screen', component: GameMastersScreenComponent },
      { path: '', redirectTo: 'rules', pathMatch: 'full' }
    ]
  },
  { path: 'bestiary', component: BestiaryComponent },
  { path: 'monster-creator', component: MonsterCreatorComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/characters' }
];
