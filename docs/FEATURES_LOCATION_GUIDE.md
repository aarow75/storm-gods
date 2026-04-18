# Where to Find the New Features

**Application URL:** http://localhost:4202

All features are implemented and visible in the character creation form. Here's exactly where to find each one:

---

## 🎯 Quick Visual Guide

### 1. Family History
**Scroll to:** Right after the Background section (after Gender field)

```
┌─────────────────────────────────────┐
│ Background                          │
│ [Cult] [Occupation] [Homeland]     │
│ [Age] [Gender]                      │
└─────────────────────────────────────┘
          ↓↓↓ NEW ↓↓↓
┌─────────────────────────────────────┐
│ 📜 Family History                   │  ← LOOK HERE
│ [Grandfather] [Grandmother]         │
│ [Father] [Mother]                   │
│                                     │
│ Family Events [Add Event]           │
│ [Event 1...] [×]                    │
└─────────────────────────────────────┘
```

**Visual identifier:** Light yellow background

---

### 2. Apply Skill Bonuses Button
**Scroll to:** Skills section header

```
┌─────────────────────────────────────────────────┐
│ Skills [Apply Occupation/Homeland/Cult Bonuses] │  ← LOOK HERE
│                                                 │
│ Combat Skills                                   │
│ Sword & Shield [15] Two-Handed [10]            │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

**To use:**
1. First set Occupation, Homeland, and Cult in Background section
2. Click this button to automatically add bonuses to skills

**Example result (Warrior/Sartar/Orlanth):**
- Sword & Shield: 15 → 30
- Rune Magic: 0 → 15
- Speak (Native): 50 → 65

---

### 3. Opposed Rune Constraints
**Scroll to:** Runes section

```
┌─────────────────────────────────────────────────────┐
│ Runes (Opposed runes must total 100%)              │  ← LOOK HERE
│                                                     │
│ Elemental Runes                                     │
│ Air% [__] Earth% [__]  Fire% [__] Water% [__]     │
│ Moon% [__] Darkness% [__]                          │
│                                                     │
│ Power Runes                                         │
│ Death% [__] Fertility% [__] ...                    │
└─────────────────────────────────────────────────────┘
```

**To test:**
1. Type 70 in Air field
2. Type 50 in Earth field  
3. Tab or click elsewhere
4. **Watch:** Values auto-adjust to total 100% (e.g., Air 58%, Earth 42%)

**Opposed pairs automatically enforced:**
- Air ↔ Earth
- Fire ↔ Water
- Moon ↔ Darkness
- Death ↔ Fertility
- Harmony ↔ Disorder
- Truth ↔ Illusion
- Stasis ↔ Movement

---

### 4. Cult Status
**Scroll to:** After Runes section, before Passions

```
┌─────────────────────────────────────┐
│ Runes (...)                         │
│ ...                                 │
└─────────────────────────────────────┘
          ↓↓↓ NEW ↓↓↓
┌─────────────────────────────────────┐
│ ⛪ Cult Status                      │  ← LOOK HERE
│ Cult: [Orlanth] (readonly)          │
│ Rank: [Initiate ▼]                  │
│       • Lay Member                  │
│       • Initiate                    │
│       • Rune Lord/Priest            │
│       • High Priest                 │
└─────────────────────────────────────┘
```

**Visual identifier:** Light blue background

**Note:** Cult name auto-fills when you select a cult in Background section

---

### 5. Enhanced Rune Magic Spells
**Scroll to:** Magic section → Rune Magic subsection

```
┌─────────────────────────────────────────────────────────┐
│ Magic                                                   │
│ Rune Points: [0]                                        │
│                                                         │
│ Spirit Magic [Add]                                      │
│ [Bladesharp] [2] [×]                                   │
│                                                         │
│ Rune Magic [Add]  ← LOOK HERE                          │
│ ┌──────────────────────────────────────────────┐      │
│ │ Spell: [Wind Words ▼] RP Cost: [1]           │      │
│ │ Rune: [Air] Reusable: [✓]  [×]               │      │
│ └──────────────────────────────────────────────┘      │
│                                                         │
│ Sorcery [Add]                                           │
└─────────────────────────────────────────────────────────┘
```

**Visual identifier:** Purple/lavender background for rune spell rows

**Fields per spell:**
1. **Spell dropdown:** Shows cult-specific spells (Wind Words, Lightning, etc.)
2. **RP Cost:** How many Rune Points it costs (1-5)
3. **Rune:** Associated rune (Air, Earth, Death, etc.)
4. **Reusable checkbox:** Can cast multiple times (checked) or one-use (unchecked)

**Cult-specific spell libraries:**
- **Orlanth:** Wind Words, Lightning, Thunderbolt
- **Ernalda:** Bless Crops, Heal Body
- **Humakt:** Truesword, Shield, Sever Spirit
- **Seven Mothers:** Reflection, Axis Mundi

---

## 📋 Step-by-Step Test

**To see ALL features in 2 minutes:**

1. **Open browser:** http://localhost:4202

2. **Scroll down through the form:**
   - Character Name
   - Background section
   - **→ Family History** (yellow box) ✓
   - Characteristics
   - **→ Skills with bonus button** ✓
   - Derived Stats
   - Hit Locations
   - Armor
   - Weapons
   - **→ Runes with hint text** ✓
   - **→ Cult Status** (blue box) ✓
   - Passions
   - **→ Magic with enhanced Rune Magic** ✓
   - Resources
   - Equipment
   - Notes

3. **Quick interaction test:**
   ```
   Background:
   - Cult: Orlanth
   - Occupation: Warrior
   - Homeland: Sartar

   Family History:
   - Father: "Korol"
   - [Add Event] → "Battle of Boldhome"

   Skills:
   - [Apply Occupation/Homeland/Cult Bonuses] → Numbers change!

   Runes:
   - Air: 70, Earth: 50 → Auto-adjusts to 100 total

   Cult Status:
   - Shows "Orlanth" automatically
   - Rank: Initiate

   Magic → Rune Magic:
   - [Add] → Dropdown shows Wind Words, Lightning, Thunderbolt
   ```

---

## 🐛 If Features Don't Appear

### Check 1: Server is running
```bash
curl http://localhost:4202
```
Should return HTML

### Check 2: Check browser console (F12)
Look for red errors

### Check 3: Verify compilation
```bash
cd c:/Users/aarons/Documents/testproject/runequest-characters
ng build --configuration development
```
Should complete without errors

### Check 4: Hard refresh
Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Check 5: Clear cache
- Chrome: `Ctrl + Shift + Delete`
- Clear "Cached images and files"
- Reload

---

## ✅ Success Indicators

You'll know features are working when you see:

1. **Yellow box** labeled "Family History" after Background
2. **Button** next to "Skills" heading that says "Apply Occupation/Homeland/Cult Bonuses"
3. **Hint text** "(Opposed runes must total 100%)" next to Runes heading
4. **Blue box** labeled "Cult Status" after Runes section
5. **Purple boxes** for Rune Magic spells with 4 fields each (Spell, RP Cost, Rune, Reusable)

---

## 📊 Line Numbers in Template

For developers debugging:

| Feature | Line Number | File |
|---------|-------------|------|
| Family History section | 57-87 | character-form.component.html |
| Skills bonus button | 210 | character-form.component.html |
| Runes hint | 338 | character-form.component.html |
| Cult Status section | 379-393 | character-form.component.html |
| Enhanced Rune Magic | 432-459 | character-form.component.html |

---

## 🎨 Visual Styling

Each new section has distinct styling:

- **Family History:** `background: #fffbf0` (light yellow)
- **Cult Status:** `background: #f0f4ff` (light blue)
- **Rune Spell Rows:** `background: #f5f0ff` (light purple)
- **Hint Text:** `color: #666, font-style: italic, font-size: 11px`

---

**Last Updated:** April 17, 2026  
**Server:** http://localhost:4202  
**Status:** ✅ All features implemented and visible
