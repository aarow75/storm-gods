import { Injectable } from '@angular/core';
import { UIStateService } from './ui-state.service';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  constructor(private uiStateService: UIStateService) {}

  rollD4(): number {
    return this.rollDice(1, 4);
  }

  rollD6(): number {
    return this.rollDice(1, 6);
  }

  rollD8(): number {
    return this.rollDice(1, 8);
  }

  rollD10(): number {
    return this.rollDice(1, 10);
  }

  rollD12(): number {
    return this.rollDice(1, 12);
  }

  rollD20(): number {
    return this.rollDice(1, 20);
  }

  roll3D6(): number {
    return this.rollDice(3, 6);
  }

  roll3D6Configured(): number {
    if (this.uiStateService.use2d6Plus6()) {
      return this.rollDice(2, 6) + 6;
    }
    return this.rollDice(3, 6);
  }

  rollPercentile(): number {
    return this.rollDice(1, 100);
  }

  private rollDice(count: number, sides: number): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
  }

  // Each die showing its maximum is rerolled once and the extra added;
  // a maximum on the reroll counts as-is (no chain).
  private rollDiceExploding(count: number, sides: number): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      total += roll;
      if (roll === sides) {
        total += Math.floor(Math.random() * sides) + 1;
      }
    }
    return total;
  }

  private rollDiceWithBreakdown(count: number, sides: number): { rolls: number[]; total: number } {
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    return {
      rolls,
      total: rolls.reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Roll with Boon - roll one extra die and keep the highest
   * Returns the final result and breakdown showing all rolls
   */
  rollWithBoon(count: number, sides: number): { total: number; breakdown: string; rolls: number[] } {
    const result = this.rollDiceWithBreakdown(count + 1, sides);
    const sorted = [...result.rolls].sort((a, b) => b - a);
    const highest = sorted[0];
    const total = result.rolls.reduce((a, b) => a + b, 0) - Math.min(...result.rolls);
    const breakdown = `${count}d${sides}[Boon] = ${result.rolls.join(',')} → keep ${highest}`;
    return { total, breakdown, rolls: result.rolls };
  }

  /**
   * Roll with Bane - roll one extra die and keep the lowest
   * Returns the final result and breakdown showing all rolls
   */
  rollWithBane(count: number, sides: number): { total: number; breakdown: string; rolls: number[] } {
    const result = this.rollDiceWithBreakdown(count + 1, sides);
    const sorted = [...result.rolls].sort((a, b) => a - b);
    const lowest = sorted[0];
    const total = result.rolls.reduce((a, b) => a + b, 0) - Math.max(...result.rolls);
    const breakdown = `${count}d${sides}[Bane] = ${result.rolls.join(',')} → keep ${lowest}`;
    return { total, breakdown, rolls: result.rolls };
  }

  /**
   * Parse and roll complex dice notation like "1d8+1", "2d6+1d4", "1d6+poison"
   * Returns the total rolled value and a detailed breakdown.
   *
   * options.explode: a die showing its maximum is rerolled once and the extra
   * added (Kal-Arath damage; a second maximum counts as-is).
   */
  rollDiceNotation(notation: string, options?: { explode?: boolean }): { total: number; breakdown: string } {
    // Clean up the notation
    const cleanNotation = notation.toLowerCase().trim();

    // Handle special cases
    if (cleanNotation === 'special' || cleanNotation.includes('special')) {
      return { total: 0, breakdown: 'Special' };
    }

    let total = 0;
    const parts: string[] = [];

    // Split by + and - while preserving the operators
    const segments = cleanNotation.split(/(\+|-)/);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();

      if (segment === '+' || segment === '-' || segment === '') {
        continue;
      }

      // Check if it's a dice roll (e.g., "1d6", "2d8", "d6", "d6/a", "d6/d", "1d%")
      const diceMatch = segment.match(/^(\d*)d(\d+|%)(\/[ad])?$/);
      if (diceMatch) {
        const count = diceMatch[1] ? parseInt(diceMatch[1]) : 1;
        const sidesToken = diceMatch[2]; // '%' = percentile die (d100)
        const sides = sidesToken === '%' ? 100 : parseInt(sidesToken);
        const modifier = diceMatch[3]; // '/a' = advantage, '/d' = disadvantage

        const rollSet = () => options?.explode
          ? this.rollDiceExploding(count, sides)
          : this.rollDice(count, sides);

        let roll: number;
        let label: string;
        const bang = options?.explode ? '!' : '';
        if (modifier === '/a') {
          const r1 = rollSet();
          const r2 = rollSet();
          roll = Math.max(r1, r2);
          label = `${count}d${sidesToken}/a${bang}[${r1},${r2}→${roll}]`;
        } else if (modifier === '/d') {
          const r1 = rollSet();
          const r2 = rollSet();
          roll = Math.min(r1, r2);
          label = `${count}d${sidesToken}/d${bang}[${r1},${r2}→${roll}]`;
        } else {
          roll = rollSet();
          label = `${count}d${sidesToken}${bang}[${roll}]`;
        }

        // Check if this should be subtracted
        const operator = (i > 0 && segments[i - 1] === '-') ? '-' : '+';
        if (operator === '-') {
          total -= roll;
          parts.push(`-${label}`);
        } else {
          total += roll;
          parts.push(label);
        }
        continue;
      }

      // Check if it's a plain number (e.g., "+1", "+2")
      const numberMatch = segment.match(/^(\d+)$/);
      if (numberMatch) {
        const value = parseInt(numberMatch[1]);
        const operator = (i > 0 && segments[i - 1] === '-') ? '-' : '+';
        if (operator === '-') {
          total -= value;
          parts.push(`-${value}`);
        } else {
          total += value;
          parts.push(`+${value}`);
        }
        continue;
      }

      // If it's text (like "poison"), just add it to the breakdown
      if (segment && !/^[\d\s]*$/.test(segment)) {
        parts.push(`+${segment}`);
      }
    }

    // Format the breakdown
    let breakdown = parts.join(' ');
    if (breakdown.startsWith('+')) {
      breakdown = breakdown.substring(1);
    }

    return {
      total: Math.max(0, total),
      breakdown: breakdown
    };
  }

  /**
   * Get just the numeric total from a dice notation
   */
  rollDiceNotationTotal(notation: string): number {
    return this.rollDiceNotation(notation).total;
  }
}
