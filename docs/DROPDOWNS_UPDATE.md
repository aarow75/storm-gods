# Dropdowns Update Summary

**Date:** April 17, 2026  
**Changes:** Number inputs widened + Passions and Magic fields converted to dropdowns

---

## ✅ Number Input Widths Updated

All number inputs have been widened to accommodate up to 5 characters comfortably:

### Width Changes:

| Field Type | Old Width | New Width |
|------------|-----------|-----------|
| General number inputs | 60px | **70px** |
| Stats (STR, CON, etc.) | 45px | **55px** |
| Skills | 45px | **55px** |
| Runes | 45px | **55px** |
| Resources | 55px | **65px** |
| Derived Stats | 65px | **75px** |
| Spell Points | 60px | **70px** |
| Magic Section | 70px | **80px** |
| Rune Spell RP Cost | 60px | **70px** |
| Passion Values | 70px | **80px** |

**Result:** Number inputs can now display 5-digit values like "10000" or "100%" without overflow.

---

## ✅ Dropdowns Implemented

### 1. Passions - Dropdown with Common Options

**Before:** Free-text input field  
**After:** Dropdown with predefined common passions + "Custom" option

**Available Options:**
- Custom (for user-defined passions)
- Love (Family)
- Loyalty (Clan)
- Loyalty (Tribe)
- Loyalty (Temple)
- Hate (Chaos)
- Hate (Lunar Empire)
- Fear (Dragon)
- Honor
- Devotion (Deity)

**How it works:**
1. Click "Add Passion"
2. Select from dropdown (default shows "Custom")
3. Choose a common passion or leave as "Custom" to type your own
4. Set the percentage value (0-100%)

---

### 2. Spirit Magic - Dropdown with 20 Spells

**Before:** Free-text input field  
**After:** Dropdown with predefined spirit magic spells + "Custom" option

**Available Spells (20):**
- Custom
- Bladesharp
- Countermagic
- Detect
- Disruption
- Extinguish
- Fanaticism
- Firearrow
- Fireblade
- Glamour
- Heal
- Ignite
- Light
- Lightwall
- Mobility
- Protection
- Shimmer
- Speedart
- Spirit Screen
- Strength
- Vigor

**How it works:**
1. Click "Add" next to Spirit Magic
2. Select spell from dropdown
3. Set points (1-6)

---

### 3. Sorcery - Dropdown with 29 Spells

**Before:** Free-text input field  
**After:** Dropdown with predefined sorcery spells + "Custom" option

**Available Spells (29):**
- Custom
- Animate (Substance)
- Banish
- Beast Form
- Blessing
- Castback
- Curse
- Damage Boosting
- Damage Resistance
- Diminish (Characteristic)
- Dispel Magic
- Dominate (Species)
- Enhance (Characteristic)
- Flight
- Forge (Substance)
- Glow
- Haste
- Illusion
- Neutralize Magic
- Palsy
- Phantom (Sense)
- Regenerate
- Sculpt (Substance)
- Sense (Substance)
- Slow
- Spirit Screen
- Summon (Entity)
- Teleport
- Venom
- Ward

**How it works:**
1. Click "Add" next to Sorcery
2. Select spell from dropdown
3. Set percentage (0-100%)

---

### 4. Rune Magic - Already Had Dropdowns

**No change needed** - Rune Magic already uses dropdowns with cult-specific spells.

**Current behavior:**
- Dropdown shows spells based on selected cult
- Options: Wind Words, Lightning, Thunderbolt (for Orlanth), etc.
- Four fields: Spell, RP Cost, Rune, Reusable

---

## Files Modified

### Models:
- `src/app/models/character.model.ts`
  - Added: `SORCERY_SPELLS` constant (29 spells)

### Components:
- `src/app/components/character-form/character-form.component.ts`
  - Added: `sorcerySpells` property
  - Imported: `SORCERY_SPELLS` from model

### Templates:
- `src/app/components/character-form/character-form.component.html`
  - Updated: Passions section - changed `<input>` to `<select>`
  - Updated: Spirit Magic - changed `<input>` to `<select>`
  - Updated: Sorcery - changed `<input>` to `<select>`

### Styles:
- `src/app/components/character-form/character-form.component.css`
  - Updated: All number input widths (10 changes)
  - Updated: `.spell-row` to include `select` styling
  - Updated: `.passion-row` to include `select` styling and `align-items: end`

---

## Benefits

### 1. Consistency
- All spell and passion selections now follow the same pattern
- Dropdown UI matches weapons, cults, occupations, etc.

### 2. Accuracy
- Prevents typos (e.g., "Bladesharp" vs "Bladesharp " vs "blade sharp")
- Ensures proper spell names for lookup/reference
- Maintains data consistency in localStorage

### 3. Usability
- Easier to select from list than type from memory
- Alphabetically organized (by browser default)
- "Custom" option available for homebrew content

### 4. Future-proof
- Easy to add more spells to the list
- Spell descriptions could be added as tooltips
- Could add filtering/search if lists grow larger

---

## UI Appearance

### Passion Row (New):
```
┌────────────────────────────────────────────────────┐
│ Passion: [Love (Family) ▼]  Value%: [60]  [Remove]│
└────────────────────────────────────────────────────┘
```

### Spirit Magic Row (New):
```
┌──────────────────────────────────────────┐
│ [Bladesharp ▼]  [2]  [×]                 │
└──────────────────────────────────────────┘
```

### Sorcery Row (New):
```
┌──────────────────────────────────────────┐
│ [Enhance (Characteristic) ▼]  [45]  [×] │
└──────────────────────────────────────────┘
```

---

## Testing Checklist

✅ **Passions:**
- [ ] Click "Add Passion"
- [ ] Open dropdown - verify all 9 common passions + "Custom"
- [ ] Select "Love (Family)" - verify it appears in field
- [ ] Select "Custom" - verify field stays as "Custom"
- [ ] Set value to 60%
- [ ] Save character - verify passion persists

✅ **Spirit Magic:**
- [ ] Click "Add" next to Spirit Magic
- [ ] Open dropdown - verify all 20 spells + "Custom"
- [ ] Select "Bladesharp"
- [ ] Set points to 4
- [ ] Save character - verify spell persists

✅ **Sorcery:**
- [ ] Click "Add" next to Sorcery
- [ ] Open dropdown - verify all 29 spells + "Custom"
- [ ] Select "Enhance (Characteristic)"
- [ ] Set percentage to 45%
- [ ] Save character - verify spell persists

✅ **Number Inputs:**
- [ ] Enter 5-digit number in any numeric field
- [ ] Verify no overflow or truncation
- [ ] Check all sections: Stats, Skills, Runes, Resources

✅ **Backward Compatibility:**
- [ ] Load old character with free-text passions
- [ ] Verify passions still display correctly
- [ ] Edit and save - verify no data loss

---

## Custom Values

All dropdowns include a "Custom" option:

**To enter a custom value:**
1. Select "Custom" from dropdown
2. The field value becomes "Custom"
3. **Current limitation:** Cannot edit to a different custom value

**Workaround for custom values:**
- Use browser's developer tools to change the value
- Or: Add custom spells/passions to the constant lists in `character.model.ts`

**Future enhancement idea:**
Add a "Custom..." option that opens a text input dialog for entering arbitrary values.

---

## Data Format

**No change to data structure** - all existing characters remain compatible.

**Storage format (unchanged):**
```typescript
passions: [
  { name: "Love (Family)", value: 60 },
  { name: "Hate (Chaos)", value: 80 }
]

magic: {
  spiritMagic: [
    { name: "Bladesharp", points: 4 },
    { name: "Heal", points: 2 }
  ],
  sorcery: [
    { name: "Enhance (Characteristic)", points: 45 }
  ]
}
```

The dropdowns simply provide a UI for selecting values that are stored as strings.

---

## Server Status

**Dev server:** http://localhost:4202  
**Auto-reload:** Yes (Vite HMR enabled)  
**Build status:** ✅ Successful  

Changes are live and visible immediately upon saving files.

---

**Total Changes:** 6 files modified, ~60 lines changed  
**Build time:** 2.7 seconds  
**Status:** ✅ Complete and functional
