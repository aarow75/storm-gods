import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { DATA_PORT } from '@shared/services/data-port.service';
import { CharacterService } from '@characters/services/character.service';
import { CombatLogService } from '@combat/services/combat-log.service';
import { CustomMonsterService } from '@bestiary/services/custom-monster.service';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { ScenarioMapService } from '@maps/services/scenario-map.service';
import { CampaignService } from '@campaigns/services/campaign.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: DATA_PORT, useExisting: CharacterService, multi: true },
    { provide: DATA_PORT, useExisting: CombatLogService, multi: true },
    { provide: DATA_PORT, useExisting: CustomMonsterService, multi: true },
    { provide: DATA_PORT, useExisting: WildernessMapService, multi: true },
    { provide: DATA_PORT, useExisting: ScenarioMapService, multi: true },
    { provide: DATA_PORT, useExisting: CampaignService, multi: true },
  ]
};
