# RuneQuest Character Form - Component Structure

## Component Hierarchy

```
character-form (Main Container)
│
├── Character Name (inline in main form)
│
├── character-background
│   ├── Cult/Religion (dropdown with validation)
│   ├── Occupation (dropdown with validation)
│   ├── Homeland (dropdown with validation)
│   ├── Age (number input)
│   └── Gender (text input)
│
├── character-family-history
│   ├── Grandfather (text input)
│   ├── Grandmother (text input)
│   ├── Father (text input)
│   ├── Mother (text input)
│   └── Family Events (dynamic list)
│
├── character-characteristics
│   ├── STR (with dice roller)
│   ├── CON (with dice roller)
│   ├── SIZ (with dice roller)
│   ├── DEX (with dice roller)
│   ├── INT (with dice roller)
│   ├── POW (with dice roller)
│   ├── CHA (with dice roller)
│   └── Roll All Stats button
│
├── character-skills
│   ├── Combat Skills category
│   ├── Magic Skills category
│   ├── Knowledge Skills category
│   ├── Communication Skills category
│   ├── Manipulation Skills category
│   ├── Perception Skills category
│   ├── Stealth Skills category
│   ├── Agility Skills category
│   └── Apply Bonuses button
│
├── character-derived-stats
│   ├── Total Hit Points (readonly)
│   ├── Magic Points (readonly)
│   ├── Damage Bonus (readonly)
│   ├── Healing Rate (readonly)
│   └── Calculate button
│
├── character-hit-locations (placeholder)
│   └── Hit location HP by body part
│
├── character-armor (placeholder)
│   └── Armor points by location
│
├── character-weapons (placeholder)
│   └── Weapons list with add/remove
│
├── character-runes (placeholder)
│   ├── Elemental Runes
│   ├── Power Runes
│   └── Form Runes
│
├── character-cult-status (placeholder)
│   ├── Cult Name
│   ├── Rank
│   └── Rune Spells
│
├── character-passions (placeholder)
│   └── Passions list with add/remove
│
├── character-magic (placeholder)
│   ├── Spirit Magic
│   ├── Rune Magic
│   └── Sorcery
│
├── character-resources (placeholder)
│   ├── Lunars
│   ├── Wheels
│   ├── Clacks
│   ├── Reputation
│   └── Ransom
│
├── character-equipment (placeholder)
│   └── Equipment list with add/remove
│
├── character-notes (placeholder)
│   └── Notes textarea
│
└── Form Actions (inline in main form)
    ├── Save/Update button
    └── Cancel button (edit mode only)
```

## Data Flow

### Input Flow (Parent → Child)
```
character-form.component.ts
        ↓ [property]="value"
    child-component.ts
        ↓ template binding
    child-component.html
```

### Output Flow (Child → Parent)
```
child-component.html
        ↓ (click)="event.emit()"
    child-component.ts
        ↓ @Output() event
    character-form.component.ts
```

## Component Status Legend

### ✅ Fully Implemented
- **character-background**: Complete with validation and success styling
- **character-family-history**: Complete with add/remove events
- **character-characteristics**: Complete with dice rolling integration
- **character-skills**: Complete with category organization
- **character-derived-stats**: Complete with basic UI

### 🔨 Placeholder Components
- character-hit-locations
- character-armor
- character-weapons
- character-runes
- character-cult-status
- character-passions
- character-magic
- character-resources
- character-equipment
- character-notes

*Placeholder components have structure and typing but need full HTML/logic implementation*

## Component Communication

### Example 1: Background Component
**Parent → Child (Input)**
```typescript
[background]="character.background!"
[cults]="cults"
[isFieldInvalid]="isFieldInvalid.bind(this)"
```

**Child → Parent (Output)**
```typescript
(cultChange)="onCultChange()"
```

### Example 2: Characteristics Component
**Parent → Child (Input)**
```typescript
[stats]="character.stats!"
[isFieldRandomized]="isFieldRandomized.bind(this)"
```

**Child → Parent (Output)**
```typescript
(rollAll)="rollAll3D6()"
(rollStat)="roll3D6($event)"
```

### Example 3: Family History Component
**Parent → Child (Input)**
```typescript
[familyHistory]="character.familyHistory!"
```

**Child → Parent (Output)**
```typescript
(addEvent)="addFamilyEvent()"
(removeEvent)="removeFamilyEvent($event)"
```

## File Organization

```
src/app/components/
├── character-form/
│   ├── character-form.component.ts (main controller)
│   ├── character-form.component.html (template - to be updated)
│   ├── character-form.component.css (shared styles)
│   └── character-form-with-components-EXAMPLE.html (reference)
│
├── character-background/
│   ├── character-background.ts
│   ├── character-background.html
│   └── character-background.css
│
├── character-family-history/
│   ├── character-family-history.ts
│   ├── character-family-history.html
│   └── character-family-history.css
│
├── character-characteristics/
│   ├── character-characteristics.ts
│   ├── character-characteristics.html
│   └── character-characteristics.css
│
├── character-skills/
│   ├── character-skills.ts
│   ├── character-skills.html
│   └── character-skills.css
│
└── [10 more component folders...]
```

## Integration Checklist

To fully integrate these components into the main form:

- [ ] Update `character-form.component.html` to use component tags
- [ ] Remove old inline HTML sections
- [ ] Test all @Input bindings work correctly
- [ ] Test all @Output events fire properly
- [ ] Verify two-way data binding with [(ngModel)]
- [ ] Test validation styling flows to child components
- [ ] Test success styling flows to child components
- [ ] Verify dice rolling functionality
- [ ] Test form save/update with new structure
- [ ] Test edit mode with components
- [ ] Complete placeholder component implementations
- [ ] Add component-specific CSS as needed
- [ ] Write unit tests for each component

## Advantages of This Structure

1. **Modularity**: Each component is self-contained
2. **Reusability**: Components can be used in other forms
3. **Maintainability**: Smaller files are easier to work with
4. **Testability**: Components can be tested in isolation
5. **Performance**: Can add OnPush change detection per component
6. **Clarity**: Clear separation of concerns
7. **Scalability**: Easy to add new sections as components
8. **Team Development**: Multiple developers can work on different components

## Original vs Refactored Size

### Before:
- **character-form.component.html**: ~800 lines
- **character-form.component.ts**: ~610 lines
- **Total**: ~1,410 lines in 2 files

### After (when fully implemented):
- **character-form.component.html**: ~200 lines (projected)
- **character-form.component.ts**: ~610 lines (unchanged)
- **15 child components**: ~150 lines each × 15 = ~2,250 lines
- **Total**: ~3,060 lines in 47 files

**Note**: While total lines increase, code is now properly organized and maintainable!
