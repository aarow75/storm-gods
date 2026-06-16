/**
 * Parses damage notation that may include conditions
 * Examples:
 *   "1d6" → { damage: "1d6", conditions: [] }
 *   "1d6+2" → { damage: "1d6+2", conditions: [] }
 *   "1d6 + disease" → { damage: "1d6", conditions: ["disease"] }
 *   "2d6+1 + poison" → { damage: "2d6+1", conditions: ["poison"] }
 *   "1d4 + disease + poisoned" → { damage: "1d4", conditions: ["disease", "poisoned"] }
 */
export function parseDamageWithConditions(damageNotation: string): {
  damage: string;
  conditions: string[];
} {
  if (!damageNotation || typeof damageNotation !== 'string') {
    return { damage: '', conditions: [] };
  }

  // Split by ' + ' to separate dice notation from conditions
  const parts = damageNotation.split('+').map(p => p.trim());

  const conditions: string[] = [];
  let damage = '';

  // First part is always damage
  if (parts.length > 0) {
    damage = parts[0];
  }

  // Check remaining parts
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    // Check if it's a number (modifier) or a condition
    if (/^\d+$/.test(part)) {
      // It's a modifier, add back to damage
      damage += '+' + part;
    } else {
      // It's a condition
      conditions.push(part);
    }
  }

  return { damage, conditions };
}
