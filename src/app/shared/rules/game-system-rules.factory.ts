import { GameSystem } from '@shared/models/game-system.model';
import { GameSystemRules } from './game-system-rules.interface';
import { RuneQuestRules } from './runequest-rules';
import { DragonbaneRules } from './dragonbane-rules';

const RULES: Record<GameSystem, GameSystemRules> = {
  runequest: new RuneQuestRules(),
  dragonbane: new DragonbaneRules(),
};

export function getRulesForSystem(system: GameSystem): GameSystemRules {
  return RULES[system] ?? RULES['runequest'];
}
