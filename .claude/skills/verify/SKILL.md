---
name: verify
description: Build, launch, and drive the Storm Gods app to verify a change end-to-end in the real browser UI.
---

# Verifying Storm Gods changes

## Build & launch

```bash
npm run build                 # production build (typecheck + AOT); pre-existing CSS budget warnings are normal
npm start                     # dev server on http://localhost:4202 (takes ~20s to come up)
```

## Drive the UI (Playwright is a devDependency)

Write a `.mjs` script importing `chromium` from `<repo>/node_modules/playwright/index.mjs` and run it with `node`.

Key gotchas that cost time on the first pass:

- **Game system + data seeding**: seed `localStorage` in `page.addInitScript` — `gameSystem` picks the system, `characters` is the character array. `CharacterService.migrateCharacter()` fills missing fields, so a partial character object works. Navigate to `http://localhost:4202/{system}/...` (system prefix must match the seeded `gameSystem`).
- **Combat tracker flow**: "Add Participant" → modal has Character/Monster tab buttons (`.entity-type-btn`), a `<select>` (bestiary monsters under `optgroup[label="Bestiary"]`), then "Add to Combat". Opponents auto-assign when there's one character and one monster.
- **Participant cards** use class `.combat-participant`; scope button clicks to the right card with `page.locator('.combat-participant', { hasText: '<name>' })` — otherwise the first enabled "Attack" button in DOM order belongs to whoever sorted first in initiative, which may be the monster.
- **Combat log** entries render in `.log-entry` (newest first). Grep for `[ATTACK]`, `[MISS]`, `[INITIATIVE]`, `[FUMBLE]`, `[SLAIN]`.
- **RuneQuest only**: attacks pause on a pending-attack panel — click "Take Hit" (`resolveNoDefense`) or Parry/Dodge to resolve.
- Capture `pageerror` and console `error` events; the app is chatty on real bugs.

## Per-system quick checks

- `/runequest/combat` — strike-rank ordering, d100 attack, hit-location roll, per-location armor, parry/dodge panel.
- `/dragonbane/combat` — Roll Initiative deals unique cards 1–10 (low first), d20-under attack, flat armor.
- `/osric/combat` — per-side d6 initiative each round, d20 vs AC (`needed N+`), armor shows `AC: n`.
- `/kal-arath/combat` — `2d6+STR/AGI vs 8+`, double-6 CRIT doubles dice, double-1 FUMBLE, d6+AGI initiative.
- `/mothership/combat` — `Combat check` rolls under CMB (DEX stat), Armor Save opposed roll after hits, `1d%` damage, Speed-check initiative.
