import { GameSystem } from '@shared/models/game-system.model';
import { GameSystemRules } from './game-system-rules.interface';
import { RuneQuestRules } from './runequest-rules';
import { DragonbaneRules } from './dragonbane-rules';
import { KalArathRules } from './kal-arath-rules';
import { OsricRules } from './osric-rules';
import { MothershipRules } from './mothership-rules';

const RULES: Record<GameSystem, GameSystemRules> = {
  runequest: new RuneQuestRules(),
  dragonbane: new DragonbaneRules(),
  'kal-arath': new KalArathRules(),
  osric: new OsricRules(),
  mothership: new MothershipRules(),
};

export function getRulesForSystem(system: GameSystem): GameSystemRules {
  return RULES[system] ?? RULES['runequest'];
}
