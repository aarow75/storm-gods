import { inject } from '@angular/core';
import { Routes, Router, CanActivateFn } from '@angular/router';

const LAST_USED_SYSTEM_KEY = 'gameSystem';

const redirectToLastSystem: CanActivateFn = () => {
  const router = inject(Router);
  const stored = localStorage.getItem(LAST_USED_SYSTEM_KEY);
  const valid = ['runequest', 'dragonbane', 'kal-arath', 'osric'];
  const system = valid.includes(stored ?? '') ? stored! : 'runequest';
  return router.parseUrl(`/${system}/characters`);
};

const gameSystemRoutes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  {
    path: 'characters',
    loadComponent: () =>
      import('@characters/components/character-list/character-list.component')
        .then(m => m.CharacterListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('@characters/components/character-form/character-form.component')
        .then(m => m.CharacterFormComponent)
  },
  {
    path: 'combat',
    loadComponent: () =>
      import('@combat/components/combat-tracker/combat-tracker.component')
        .then(m => m.CombatTrackerComponent)
  },
  {
    path: 'combat-map',
    loadComponent: () =>
      import('@combat/components/combat-map/combat-map.component')
        .then(m => m.CombatMapComponent)
  },
  {
    path: 'wilderness-map',
    loadComponent: () =>
      import('@maps/components/wilderness-map/wilderness-map.component')
        .then(m => m.WildernessMapComponent)
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('@docs/components/docs/docs.component')
        .then(m => m.DocsComponent),
    children: [
      {
        path: 'rules',
        loadComponent: () =>
          import('@docs/components/rules-reference/rules-reference.component')
            .then(m => m.RulesReferenceComponent)
      },
      {
        path: 'publications',
        loadComponent: () =>
          import('@docs/components/publications/publications.component')
            .then(m => m.PublicationsComponent)
      },
      {
        path: 'gm-screen',
        loadComponent: () =>
          import('@docs/components/game-masters-screen/game-masters-screen.component')
            .then(m => m.GameMastersScreenComponent)
      },
      {
        path: 'page',
        loadComponent: () =>
          import('@docs/components/markdown-page/markdown-page.component')
            .then(m => m.MarkdownPageComponent)
      },
      {
        path: '',
        loadComponent: () =>
          import('@docs/components/docs/docs-home.component')
            .then(m => m.DocsHomeComponent),
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'bestiary',
    loadComponent: () =>
      import('@bestiary/components/bestiary/bestiary.component')
        .then(m => m.BestiaryComponent)
  },
  {
    path: 'monster-creator',
    loadComponent: () =>
      import('@bestiary/components/monster-creator/monster-creator.component')
        .then(m => m.MonsterCreatorComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('@settings/components/settings/settings.component')
        .then(m => m.SettingsComponent)
  },
  {
    path: 'campaigns',
    loadComponent: () =>
      import('@campaigns/components/campaign-planner/campaign-planner.component')
        .then(m => m.CampaignPlannerComponent)
  },
  {
    path: 'campaigns/:campaignId',
    loadComponent: () =>
      import('@campaigns/components/campaign-detail/campaign-detail.component')
        .then(m => m.CampaignDetailComponent)
  }
];

export const routes: Routes = [
  { path: 'runequest', children: gameSystemRoutes },
  { path: 'dragonbane', children: gameSystemRoutes },
  { path: 'kal-arath', children: gameSystemRoutes },
  { path: 'osric', children: gameSystemRoutes },
  { path: '', pathMatch: 'full', canActivate: [redirectToLastSystem], children: [] },
  { path: '**', canActivate: [redirectToLastSystem], children: [] }
];
