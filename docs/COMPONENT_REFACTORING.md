# Character Form Component Refactoring

## Overview
The monolithic character-form component has been refactored into 15 smaller, focused components. This improves maintainability, testability, and reusability.

## Created Components

### ✅ Fully Implemented Components

1. **character-background** (`src/app/components/character-background/`)
   - Handles: Cult, Occupation, Homeland, Age, Gender
   - Inputs: `background`, `cults[]`, `occupations[]`, `homelands[]`, `isFieldInvalid()`, `isFieldRandomized()`
   - Outputs: `cultChange` event
   - Status: **Fully functional with validation and success styling**

2. **character-family-history** (`src/app/components/character-family-history/`)
   - Handles: Grandfather, Grandmother, Father, Mother, Family Events
   - Inputs: `familyHistory`
   - Outputs: `addEvent`, `removeEvent(index)`
   - Status: **Fully functional**

3. **character-characteristics** (`src/app/components/character-characteristics/`)
   - Handles: All 7 stats (STR, CON, SIZ, DEX, INT, POW, CHA) with dice rolling
   - Inputs: `stats`, `isFieldInvalid()`, `isFieldRandomized()`
   - Outputs: `rollAll`, `rollStat(statName)`
   - Status: **Fully functional with dice rolling and success styling**

4. **character-skills** (`src/app/components/character-skills/`)
   - Handles: All skill categories and individual skills
   - Inputs: `skills`, `skillCategories`, `getCategoryKeys()`, `getSkillKeys(category)`
   - Outputs: `applyBonuses`
   - Status: **Fully functional**

5. **character-derived-stats** (`src/app/components/character-derived-stats/`)
   - Handles: Total HP, Magic Points, Damage Bonus, Healing Rate
   - Inputs: `derivedStats`
   - Outputs: `calculate`
   - Status: **Functional with basic UI**

### 🔨 Placeholder Components (To Be Fully Implemented)

The following components have basic structure but need full implementation:

6. **character-hit-locations** - Hit location HP tracking
7. **character-armor** - Armor by location
8. **character-weapons** - Weapons list with management
9. **character-runes** - Elemental, Power, and Form runes
10. **character-cult-status** - Cult membership and rank
11. **character-passions** - Character passions list
12. **character-magic** - Spirit Magic, Rune Magic, Sorcery
13. **character-resources** - Lunars, Wheels, Clacks, Reputation
14. **character-equipment** - Equipment list
15. **character-notes** - Notes textarea

## Component Architecture

### Input/Output Pattern
All components follow a consistent pattern:
```typescript
@Input() data!: DataType;           // Data binding
@Input() helperFn!: () => Type;     // Helper functions
@Output() action = new EventEmitter<Type>(); // Events
```

### Benefits
1. **Separation of Concerns** - Each component handles one section
2. **Reusability** - Components can be used elsewhere
3. **Testability** - Easier to write unit tests
4. **Maintainability** - Smaller files, focused responsibility
5. **Performance** - Can implement OnPush change detection per component

## How to Use

### Example Usage in Parent Component

See `character-form-with-components-EXAMPLE.html` for a complete example showing how to:

1. Import all components in the parent
2. Bind data with `[property]` syntax
3. Handle events with `(event)` syntax
4. Pass function references with `.bind(this)`

### Key Example:
```html
<app-character-characteristics
  [stats]="character.stats!"
  [isFieldInvalid]="isFieldInvalid.bind(this)"
  [isFieldRandomized]="isFieldRandomized.bind(this)"
  (rollAll)="rollAll3D6()"
  (rollStat)="roll3D6($event)"
></app-character-characteristics>
```

## Files Modified

### Component Files Created
- `src/app/components/character-background/*` (3 files)
- `src/app/components/character-family-history/*` (3 files)
- `src/app/components/character-characteristics/*` (3 files)
- `src/app/components/character-skills/*` (3 files)
- `src/app/components/character-derived-stats/*` (3 files)
- `src/app/components/character-hit-locations/*` (3 files)
- `src/app/components/character-armor/*` (3 files)
- `src/app/components/character-weapons/*` (3 files)
- `src/app/components/character-runes/*` (3 files)
- `src/app/components/character-cult-status/*` (3 files)
- `src/app/components/character-passions/*` (3 files)
- `src/app/components/character-magic/*` (3 files)
- `src/app/components/character-resources/*` (3 files)
- `src/app/components/character-equipment/*` (3 files)
- `src/app/components/character-notes/*` (3 files)

**Total: 45 new files (15 components × 3 files each)**

### Modified Files
- `src/app/components/character-form/character-form.component.ts` - Added component imports

## Next Steps to Complete Refactoring

### 1. Replace HTML Template Sections
In `character-form.component.html`, replace each section with its component tag:

**Before:**
```html
<h4>Background</h4>
<div class="background-grid">
  <!-- 70 lines of form fields -->
</div>
```

**After:**
```html
<app-character-background
  [background]="character.background!"
  [cults]="cults"
  [occupations]="occupations"
  [homelands]="homelands"
  [isFieldInvalid]="isFieldInvalid.bind(this)"
  [isFieldRandomized]="isFieldRandomized.bind(this)"
  (cultChange)="onCultChange()"
></app-character-background>
```

### 2. Complete Placeholder Components
Implement full functionality for components currently showing "To be fully implemented":
- Hit Locations (with calculate button)
- Armor (with apply to all)
- Weapons (with add/remove)
- Runes (with opposed rune logic)
- Cult Status (with rank selection)
- Passions (with add/remove and dropdown)
- Magic (all three types with add/remove)
- Resources (money and reputation)
- Equipment (list with add/remove)
- Notes (textarea)

### 3. Add CSS to Components
Currently all CSS is in the main form. Consider:
- Moving shared styles to a parent or global stylesheet
- Adding component-specific styles to each `.css` file
- Using `::ng-deep` sparingly for child component styling

### 4. Add Unit Tests
Each component can now be tested independently:
```typescript
describe('CharacterBackground', () => {
  it('should emit cultChange when cult is changed', () => {
    // Test isolated component behavior
  });
});
```

## Migration Strategy

### Option 1: Gradual Migration
1. Keep original HTML as backup
2. Replace one section at a time
3. Test thoroughly after each replacement
4. Remove old HTML sections as you go

### Option 2: Complete Replacement
1. Use the EXAMPLE.html file as template
2. Replace entire template at once
3. Test all functionality together
4. Fix any issues that arise

## Benefits Realized

### Before Refactoring
- **character-form.component.html**: ~800 lines
- **character-form.component.ts**: ~610 lines
- Single responsibility: ❌ (handles everything)
- Reusability: ❌ (monolithic)
- Testability: ⚠️ (difficult to isolate)

### After Refactoring
- **Main form**: ~200 lines (projected)
- **Each component**: ~50-150 lines
- Single responsibility: ✅ (focused components)
- Reusability: ✅ (can use elsewhere)
- Testability: ✅ (easy to isolate)

## Example: Full Implementation Pattern

Here's how the Background component was fully implemented:

### TypeScript (.ts)
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterBackground as CharacterBackgroundModel } from '../../models/character.model';

@Component({
  selector: 'app-character-background',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-background.html',
  styleUrl: './character-background.css',
})
export class CharacterBackground {
  @Input() background!: CharacterBackgroundModel;
  @Input() cults: string[] = [];
  @Input() occupations: string[] = [];
  @Input() homelands: string[] = [];
  @Input() isFieldInvalid!: (field: string) => boolean;
  @Input() isFieldRandomized!: (field: string) => boolean;

  @Output() cultChange = new EventEmitter<void>();
}
```

### Template (.html)
- Uses `[(ngModel)]` for two-way binding
- Uses `*ngFor` for lists
- Uses `*ngIf` for conditional display
- Calls `isFieldInvalid()` and `isFieldRandomized()` for styling
- Emits `cultChange` event on change

### Usage
```html
<app-character-background
  [background]="character.background!"
  [cults]="cults"
  [occupations]="occupations"
  [homelands]="homelands"
  [isFieldInvalid]="isFieldInvalid.bind(this)"
  [isFieldRandomized]="isFieldRandomized.bind(this)"
  (cultChange)="onCultChange()"
></app-character-background>
```

## Build Status
✅ TypeScript compiles successfully
✅ All components are registered
⚠️ CSS budget warning (unrelated to refactoring)
⚠️ Some components not yet used in template (expected)

## Conclusion
The component refactoring creates a solid foundation for a more maintainable RuneQuest character creator. The structure is in place and ready for the HTML template to be updated to use these new modular components.
