import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
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

  /**
   * Parse and roll complex dice notation like "1d8+1", "2d6+1d4", "1d6+poison"
   * Returns the total rolled value and a detailed breakdown
   */
  rollDiceNotation(notation: string): { total: number; breakdown: string } {
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

      // Check if it's a dice roll (e.g., "1d6", "2d8")
      const diceMatch = segment.match(/(\d+)d(\d+)/);
      if (diceMatch) {
        const count = parseInt(diceMatch[1]);
        const sides = parseInt(diceMatch[2]);
        const roll = this.rollDice(count, sides);

        // Check if this should be subtracted
        const operator = (i > 0 && segments[i - 1] === '-') ? '-' : '+';
        if (operator === '-') {
          total -= roll;
          parts.push(`-${count}d${sides}[${roll}]`);
        } else {
          total += roll;
          parts.push(`${count}d${sides}[${roll}]`);
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
