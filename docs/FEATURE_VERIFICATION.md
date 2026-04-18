# Feature Verification Checklist

**Application URL:** http://localhost:4202

All 6 critical features have been implemented. Here's where to find each one:

---

## ✅ 1. Family History
**Location:** Appears right after the Background section (before Characteristics)

**What to look for:**
- Section header: "Family History"
- 4 text inputs: Grandfather, Grandmother, Father, Mother
- "Add Event" button
- List of family events with remove buttons
- Light yellow background (#fffbf0)

**How to test:**
1. Fill in ancestor names
2. Click "Add Event" button
3. Type a family event (e.g., "Battle of Boldhome, 1625")
4. Save character
5. Reload page - family history should persist

---

## ✅ 2. Opposed Rune Constraints
**Location:** Runes section

**What to look for:**
- Section header: "Runes (Opposed runes must total 100%)"
- Automatic adjustment when changing opposed runes
- Opposed pairs:
  - Elemental: Air/Earth, Fire/Water, Moon/Darkness
  - Power: Death/Fertility, Harmony/Disorder, Truth/Illusion, Stasis/Movement

**How to test:**
1. Scroll to Runes section
2. Set Air to 70%
3. Set Earth to 50%
4. Click elsewhere or change focus
5. **Expected:** System should auto-adjust values to total 100% (e.g., Air 58%, Earth 42%)

---

## ✅ 3. Starting Skill Distribution
**Location:** Skills section

**What to look for:**
- Skills section header with button: "Apply Occupation/Homeland/Cult Bonuses"
- Button appears right after "Skills" heading

**How to test:**
1. Select Occupation: "Warrior"
2. Select Homeland: "Sartar"  
3. Select Cult: "Orlanth"
4. Scroll to Skills section
5. Click "Apply Occupation/Homeland/Cult Bonuses" button
6. **Expected changes:**
   - Sword & Shield: 15 → 30 (Warrior +15)
   - Spear: 10 → 20 (Warrior +10)
   - Rune Magic: 0 → 15 (Orlanth +15)
   - Speak (Native): 50 → 65 (Sartar +10, Orlanth +5)

---

## ✅ 4. Rune Spell Details (Enhanced Format)
**Location:** Magic section → Rune Magic subsection

**What to look for:**
- "Add" button next to "Rune Magic" heading
- Rune spell rows with purple background (#f5f0ff)
- Four fields per spell:
  1. **Spell:** Dropdown with cult-specific spells
  2. **RP Cost:** Number input (1-5)
  3. **Rune:** Text input (Air/Earth/etc)
  4. **Reusable:** Checkbox

**How to test:**
1. Select Cult: "Orlanth" in Background
2. Scroll to Magic section
3. Click "Add" button next to "Rune Magic"
4. **Expected:** Dropdown should show Orlanth spells:
   - Wind Words (RP: 1, Rune: Air, Reusable: Yes)
   - Lightning (RP: 2, Rune: Air, Reusable: Yes)
   - Thunderbolt (RP: 3, Rune: Air, Reusable: No)
5. Select a spell - fields should auto-populate
6. Or enter custom spell manually

---

## ✅ 5. Cult Status
**Location:** Appears right before Passions section (after Runes)

**What to look for:**
- Section header: "Cult Status"
- Light blue background (#f0f4ff)
- Two fields:
  1. **Cult:** (readonly, auto-populated)
  2. **Rank:** Dropdown with 4 options

**How to test:**
1. In Background section, select Cult: "Humakt"
2. Scroll to Cult Status section
3. **Expected:** Cult field should show "Humakt" (readonly)
4. Click Rank dropdown
5. **Expected options:**
   - Lay Member
   - Initiate
   - Rune Lord/Priest
   - High Priest

---

## ✅ 6. Profession Skill Bonuses
**Integrated with Feature #3** - The "Apply Occupation/Homeland/Cult Bonuses" button applies profession (occupation) bonuses.

**Occupation bonus examples:**
- **Warrior:** +15 Sword & Shield, +10 Spear, +5 Bow, +10 Dodge, +10 Ride
- **Farmer:** +20 Farm, +10 Craft, +10 Lore (Plant), +5 Ride
- **Hunter:** +15 Bow, +15 Track, +10 Scan, +10 Hide, +10 Lore (Animal)
- **Priest:** +20 Rune Magic, +15 Lore (World), +10 Speak (Native)

---

## Viewing Order in Form

The form sections appear in this order:

1. Character Name
2. **Background** (Cult, Occupation, Homeland, Age, Gender)
3. **Family History** ← NEW
4. Characteristics (STR, CON, SIZ, DEX, INT, POW, CHA)
5. **Skills** (with Apply Bonuses button) ← ENHANCED
6. Derived Stats
7. Hit Locations
8. Armor
9. Weapons
10. **Runes** (with opposed pairs hint) ← ENHANCED
11. **Cult Status** ← NEW
12. Passions
13. **Magic** (with enhanced Rune Magic) ← ENHANCED
14. Resources
15. Equipment
16. Notes

---

## Browser Console Check

If features don't appear:

1. Open browser console (F12)
2. Look for JavaScript errors
3. Common issues:
   - TypeScript compilation errors → Check terminal
   - Template syntax errors → Check console
   - Missing imports → Verify character.model.ts exports

---

## Quick Smoke Test

**Create a complete character:**

1. Name: "Rurik Spearbreaker"
2. Background:
   - Cult: Orlanth
   - Occupation: Warrior
   - Homeland: Sartar
   - Age: 21
3. Family History:
   - Father: "Korol the Bold"
   - Add event: "Father died at Boldhome"
4. Roll all stats (3d6 button)
5. Click "Apply Occupation/Homeland/Cult Bonuses"
6. Calculate derived stats
7. Add weapon: Broadsword
8. Runes: Set Air to 80 (Earth should auto-adjust to 20)
9. Cult Status: Rank = Initiate
10. Add Rune Magic spell (should see Orlanth spells)
11. Create Character

**Verification:**
- Character appears in list
- Edit character - all fields populated
- Family history persists
- Cult status shows correctly
- Rune spells have all 4 fields

---

## Known Issues

1. **CSS Budget Warning** - Production build exceeds 8KB CSS limit
   - Non-critical; app functions correctly
   - Fix: Adjust angular.json budgets or optimize CSS

2. **Port Conflicts** - Default port (4200) may be in use
   - Current server: port 4202
   - Use: `ng serve --port XXXX`

---

## Development Server

**Current Status:** Running on http://localhost:4202

**Commands:**
- Start: `npm start` or `ng serve --port 4202`
- Build: `npm run build` (production) or `ng build --configuration development`
- Test: `npm test`

---

## Files Modified

**Models:**
- `src/app/models/character.model.ts`
  - Added: FamilyHistory, CultStatus, RuneSpell interfaces
  - Added: Skill bonus tables (occupation, homeland, cult)
  - Added: Rune spell library
  - Added: enforceOpposedRunes(), applySkillBonuses() functions

**Components:**
- `src/app/components/character-form/character-form.component.ts`
  - Added: Family event methods
  - Added: Rune change handler
  - Added: Skill bonus application
  - Added: Rune spell methods
  - Added: Cult status sync

**Templates:**
- `src/app/components/character-form/character-form.component.html`
  - Added: Family History section (lines 57-87)
  - Enhanced: Skills section with bonus button (line 210)
  - Enhanced: Runes section with hint (line 338)
  - Added: Cult Status section (lines 379-393)
  - Enhanced: Rune Magic with detailed fields (lines 432-459)

**Styles:**
- `src/app/components/character-form/character-form.component.css`
  - Added: .family-history-section
  - Added: .cult-status-section
  - Added: .rune-spell-row
  - Added: .rune-hint

**Services:**
- `src/app/services/character.service.ts`
  - Added: Migration for familyHistory
  - Added: Migration for cultStatus
  - Added: Migration for rune spell format

---

## Success Criteria

✅ All features visible in form  
✅ No console errors  
✅ Character creation works  
✅ Character editing works  
✅ Data persists in localStorage  
✅ Migrations handle old characters  
✅ UI is styled and user-friendly  

