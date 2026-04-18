# D20 Skill Conversion

Each skill in the character sheet now displays a d20 equivalent next to the percentage value.

## Conversion Formula

**Percentage ÷ 5 = d20 Target Number**

This allows players to easily use d20 systems or compare skill values to d20-based mechanics.

## Conversion Table

| Percentage | d20 Equivalent | Description |
|------------|---------------|-------------|
| 5% | 1 | Critical failure range |
| 10% | 2 | Very poor |
| 15% | 3 | Poor |
| 20% | 4 | Below average |
| 25% | 5 | Below average |
| 30% | 6 | Slightly below average |
| 35% | 7 | Average |
| 40% | 8 | Average |
| 45% | 9 | Above average |
| 50% | 10 | Above average |
| 55% | 11 | Good |
| 60% | 12 | Good |
| 65% | 13 | Very good |
| 70% | 14 | Very good |
| 75% | 15 | Excellent |
| 80% | 16 | Excellent |
| 85% | 17 | Exceptional |
| 90% | 18 | Exceptional |
| 95% | 19 | Near mastery |
| 100% | 20 | Complete mastery |

## Visual Display

In the skills section, each skill now shows:
```
Skill Name:          [55]  [d20: 11]
```

The layout uses:
- **Skill Label**: Flexible width (80-120px)
- **Percentage Input**: Fixed 55px width
- **D20 Badge**: Fixed 45px width badge with background

### Grid Layout
- Skills grid uses 240px minimum column width to prevent overlap
- Each skill row contains: label + input + d20 display
- 8px vertical gap, 12px horizontal gap between items
- Responsive design adjusts columns based on available width

## Examples

- **Sword & Shield: 50%** → displays "d20: 10"
- **Dodge: 75%** → displays "d20: 15"
- **Climb: 20%** → displays "d20: 4"
- **Listen: 85%** → displays "d20: 17"

This conversion is purely informational and doesn't affect the RuneQuest mechanics, but provides a useful reference for cross-system comparison.
