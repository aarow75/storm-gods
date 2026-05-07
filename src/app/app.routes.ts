import { inject } from '@angular/core';
import { Routes, Router, CanActivateFn } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterFormComponent } from './components/character-form/character-form.component';
import { CombatTrackerComponent } from './components/combat-tracker/combat-tracker.component';
import { CombatMapComponent } from './components/combat-map/combat-map.component';
import { RulesReferenceComponent } from './components/rules-reference/rules-reference.component';
import { MarkdownPageComponent } from './components/markdown-page/markdown-page.component';
import { BestiaryComponent } from './components/bestiary/bestiary.component';
import { MonsterCreatorComponent } from './components/monster-creator/monster-creator.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WildernessMapComponent } from './components/wilderness-map/wilderness-map.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { DocsComponent } from './components/docs/docs.component';
import { GameMastersScreenComponent } from './components/game-masters-screen/game-masters-screen.component';
import { CampaignPlannerComponent } from './components/campaigns/campaign-planner/campaign-planner.component';
import { CampaignDetailComponent } from './components/campaigns/campaign-detail/campaign-detail.component';

const LAST_USED_SYSTEM_KEY = 'gameSystem';

const redirectToLastSystem: CanActivateFn = () => {
  const router = inject(Router);
  const stored = localStorage.getItem(LAST_USED_SYSTEM_KEY);
  const system = stored === 'dragonbane' ? 'dragonbane' : 'runequest';
  return router.parseUrl(`/${system}/characters`);
};

const gameSystemRoutes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
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
      { path: 'page', component: MarkdownPageComponent },
      { path: '', redirectTo: 'rules', pathMatch: 'full' }
    ]
  },
  { path: 'bestiary', component: BestiaryComponent },
  { path: 'monster-creator', component: MonsterCreatorComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'campaigns', component: CampaignPlannerComponent },
  { path: 'campaigns/:campaignId', component: CampaignDetailComponent }
];

export const routes: Routes = [
  { path: 'runequest', children: gameSystemRoutes },
  { path: 'dragonbane', children: gameSystemRoutes },
  { path: '', pathMatch: 'full', canActivate: [redirectToLastSystem], children: [] },
  { path: '**', canActivate: [redirectToLastSystem], children: [] }
];
