import { Component, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  selector: 'app-game-masters-screen',
  imports: [CommonModule],
  templateUrl: './game-masters-screen.component.html',
  styleUrl: './game-masters-screen.component.css'
})
export class GameMastersScreenComponent {
  isFullscreen = false;

  constructor(
    public gameSystemService: GameSystemService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    this.cdr.markForCheck();
  }

  toggleFullscreen() {
    const el = this.elementRef.nativeElement.querySelector('.gm-screen');
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // ─── RuneQuest Data ──────────────────────────────────────────────────────────

  rqCharacteristicRolls = [
    { mult: '×5', difficulty: 'Easy' },
    { mult: '×4', difficulty: 'Moderate' },
    { mult: '×3', difficulty: 'Average' },
    { mult: '×2', difficulty: 'Difficult' },
    { mult: '×1', difficulty: 'Very Difficult' }
  ];

  strikeRankModifiers = [
    { siz: '22+',   sizMod: 0,  dex: '19–21', dexMod: -1 },
    { siz: '15–21', sizMod: 1,  dex: '16–18', dexMod: 0 },
    { siz: '7–14',  sizMod: 2,  dex: '13–15', dexMod: 1 },
    { siz: '1–6',   sizMod: 3,  dex: '9–12',  dexMod: 2 },
    { dex: '6–8',   dexMod: 3 },
    { dex: '3–5',   dexMod: 4 }
  ];

  runesquestHitLocations = [
    { location: 'Right Leg', range: '01–04' },
    { location: 'Left Leg',  range: '05–08' },
    { location: 'Abdomen',   range: '09–11' },
    { location: 'Chest',     range: '12' },
    { location: 'Right Arm', range: '13–15' },
    { location: 'Left Arm',  range: '16–18' },
    { location: 'Head',      range: '19–20' }
  ];

  rqDamageByLocation = [
    { location: 'Limb',    atZero: 'Limb useless; character may fight on', atNeg: 'Severed or irrevocably crushed' },
    { location: 'Abdomen', atZero: 'Unconscious; die in 1D6 rounds without magic', atNeg: 'Instant death' },
    { location: 'Chest',   atZero: 'Unconscious; die in 1D6 rounds without magic', atNeg: 'Instant death' },
    { location: 'Head',    atZero: 'Unconscious; die in 1D6 rounds without magic', atNeg: 'Instant death' }
  ];

  rqHpPerLocation = [
    { totalHp: '1–3',   head: 1, arm: 1, chest: 2, abdomen: 2, leg: 2 },
    { totalHp: '4–6',   head: 2, arm: 2, chest: 3, abdomen: 3, leg: 3 },
    { totalHp: '7–9',   head: 3, arm: 3, chest: 4, abdomen: 4, leg: 4 },
    { totalHp: '10–12', head: 4, arm: 3, chest: 5, abdomen: 4, leg: 5 },
    { totalHp: '13–15', head: 5, arm: 4, chest: 6, abdomen: 5, leg: 6 },
    { totalHp: '16–18', head: 6, arm: 5, chest: 7, abdomen: 6, leg: 7 },
    { totalHp: '19–21', head: 7, arm: 5, chest: 8, abdomen: 7, leg: 8 }
  ];

  rqDamageBonus = [
    { strsiz: '1–6',    bonus: '−1D4' },
    { strsiz: '7–12',   bonus: 'None' },
    { strsiz: '13–16',  bonus: '+1D4' },
    { strsiz: '17–20',  bonus: '+1D6' },
    { strsiz: 'each +8', bonus: '+1D6 more' }
  ];

  rqArmorTable = [
    { type: 'Leather',      ap: 1, enc: 2, penalty: 'None' },
    { type: 'Ringmail',     ap: 2, enc: 3, penalty: '−5% DEX skills' },
    { type: 'Scalemail',    ap: 3, enc: 4, penalty: '−10% DEX skills' },
    { type: 'Chainmail',    ap: 4, enc: 5, penalty: '−20% DEX skills' },
    { type: 'Bronze Plate', ap: 4, enc: 5, penalty: '−25% DEX skills' },
    { type: 'Platemail',    ap: 5, enc: 6, penalty: '−30% DEX skills' }
  ];

  rqShieldTable = [
    { type: 'Small',  defBonus: '+15%', hp: 9,  enc: 1 },
    { type: 'Medium', defBonus: '+20%', hp: 12, enc: 1.5 },
    { type: 'Large',  defBonus: '+25%', hp: 15, enc: 2 }
  ];

  rqAttackResults = [
    { result: 'Critical',    roll: '≤ 5% of skill',  effect: 'Vs. normal parry: parry negated; full damage ignores armor. Vs. critical parry: parry succeeds.' },
    { result: 'Impale',      roll: '≤ 20% of skill (impaling only)', effect: 'Max damage. Weapon stays in wound; each round 1–2 falls out, 3–6 stays (pull out = full damage again).' },
    { result: 'Normal Hit',  roll: '≤ skill%',        effect: 'Roll weapon damage. Armor absorbs, remainder hits location.' },
    { result: 'Fumble',      roll: '96–00',           effect: 'Roll on Fumble table (D100).' }
  ];

  rqFumbleTable = [
    { roll: '01–10', result: 'Drop weapon' },
    { roll: '11–20', result: 'Fall prone' },
    { roll: '21–30', result: 'Strike ally (randomly determined)' },
    { roll: '31–40', result: 'Strike self' },
    { roll: '41–50', result: 'Weapon breaks' },
    { roll: '51–60', result: 'Lose next action' },
    { roll: '61–70', result: 'Stagger — lose this action' },
    { roll: '71–80', result: 'Lose shield' },
    { roll: '81–90', result: 'Stumble — opponent gets free attack' },
    { roll: '91–00', result: 'Roll twice' }
  ];

  rqSpellSR = [
    { powCost: '1', sr: '1' },
    { powCost: '2', sr: '2' },
    { powCost: '3', sr: '3' },
    { powCost: '4', sr: '4' },
    { powCost: '5+', sr: '+1 per POW' }
  ];

  rqBattleMagicSpells = [
    { spell: 'Bladesharp 1–4',    cost: '1–4', effect: '+5% attack, +1 damage per level (cutting/thrusting)' },
    { spell: 'Bludgeon 1–4',      cost: '1–4', effect: '+5% attack, +1 damage per level (bludgeoning)' },
    { spell: 'Protection 1–4',    cost: '1–4', effect: '+1 AP per level to all locations' },
    { spell: 'Countermagic 1–3',  cost: '1–3', effect: 'Blocks incoming spells up to this POW level' },
    { spell: 'Coordination 1–4',  cost: '1–4', effect: '+5% per level to all DEX-based skills' },
    { spell: 'Strength 1–4',      cost: '1–4', effect: '+1 STR per level for DB and STR rolls' },
    { spell: 'Parry 1–4',         cost: '1–4', effect: '+5% per level to one parry skill' },
    { spell: 'Healing 1–6',       cost: '1–6', effect: 'Restores 1 HP per level to one location' },
    { spell: 'Detect Enemies',    cost: '1',   effect: 'Direction of all harmful beings within POW×3m' },
    { spell: 'Detect Life',       cost: '1',   effect: 'Direction of all living beings within POW×3m' },
    { spell: 'Detect Magic',      cost: '1',   effect: 'Senses magic within POW×3m' },
    { spell: 'Detect Traps',      cost: '1',   effect: 'Location of traps within POW×3m' },
    { spell: 'Fanaticism',        cost: '1',   effect: '+10% attack; cannot parry or flee; fights to death' },
    { spell: 'Demoralize',        cost: '2',   effect: 'Target (resist POW): −30% combat, won\'t attack' },
    { spell: 'Befuddle',          cost: '2',   effect: 'Target (resist INT): −50% skills, acts randomly' },
    { spell: 'Mobility',          cost: '1',   effect: 'Movement doubled' },
    { spell: 'Slow',              cost: '1',   effect: 'Target (resist DEX): movement halved' },
    { spell: 'Speedart',          cost: '1',   effect: '+3% to hit, +1D6 damage to one missile' },
    { spell: 'Firearrow',         cost: '1',   effect: 'One missile deals +1D6 fire damage on hit' },
    { spell: 'Fireblade',         cost: '3',   effect: 'Weapon deals +2D6 fire damage per strike' },
    { spell: 'Multimissile 1–4',  cost: '1–4', effect: 'Missile splits into 2–5 projectiles (one per target)' },
    { spell: 'Invisibility',      cost: '3',   effect: 'Caster becomes invisible' },
    { spell: 'Light',             cost: '1',   effect: 'Creates light in an area' },
    { spell: 'Darkwall',          cost: '2',   effect: 'Creates 3×3m impenetrable darkness zone' }
  ];

  // ─── Dragonbane Data ─────────────────────────────────────────────────────────

  dbConditions = [
    { condition: 'Exhausted',      attribute: 'AGL', cure: 'Rest' },
    { condition: 'Sickly',         attribute: 'CON', cure: 'Rest or HEALING' },
    { condition: 'Dazed',          attribute: 'INT', cure: 'Rest' },
    { condition: 'Angry',          attribute: 'CHA', cure: 'Rest' },
    { condition: 'Scared',         attribute: 'WIL', cure: 'Rest' },
    { condition: 'Grievous Wound', attribute: 'STR', cure: 'Rest or HEALING' }
  ];

  dbArmorTable = [
    { type: 'Leather',         ar: 1, cost: '20 SP',  supply: 'Common',   notes: '—' },
    { type: 'Studded Leather', ar: 2, cost: '40 SP',  supply: 'Common',   notes: '—' },
    { type: 'Chain Mail',      ar: 3, cost: '80 SP',  supply: 'Uncommon', notes: 'Bane: SNEAKING, SWIMMING, ACROBATICS' },
    { type: 'Plate Armor',     ar: 4, cost: '200 SP', supply: 'Rare',     notes: 'Bane: SNEAKING, SWIMMING, ACROBATICS' },
    { type: 'Full Plate',      ar: 6, cost: '500 SP', supply: 'Rare',     notes: 'STR 15 req; Bane: SNEAKING, SWIMMING, ACROBATICS' },
    { type: 'Open Helmet',     ar: 1, cost: '20 SP',  supply: 'Common',   notes: 'Head only' },
    { type: 'Great Helm',      ar: 2, cost: '50 SP',  supply: 'Uncommon', notes: 'Head only; Bane: AWARENESS' }
  ];

  dbCriticalHitMelee = [
    { d6: '1', effect: 'Double damage' },
    { d6: '2', effect: 'Opponent drops weapon' },
    { d6: '3', effect: 'Opponent knocked prone' },
    { d6: '4', effect: 'Ignore armor (bypass AR)' },
    { d6: '5', effect: 'Opponent suffers condition (your choice)' },
    { d6: '6', effect: 'Severed limb / lethal wound → roll Severe Injury (D20)' }
  ];

  dbFumbleMelee = [
    { d6: '1', effect: 'Drop your weapon' },
    { d6: '2', effect: 'Fall prone' },
    { d6: '3', effect: 'Hit an ally (if any adjacent)' },
    { d6: '4', effect: 'Weapon breaks (Durability −1)' },
    { d6: '5', effect: 'Lose your next action' },
    { d6: '6', effect: 'Suffer D6 damage' }
  ];

  dbCriticalHitRanged = [
    { d6: '1', effect: 'Double damage' },
    { d6: '2', effect: 'Opponent drops weapon' },
    { d6: '3', effect: 'Opponent knocked prone' },
    { d6: '4', effect: 'Ignore armor' },
    { d6: '5', effect: 'Opponent suffers condition (your choice)' },
    { d6: '6', effect: 'Pinned — cannot move until condition removed' }
  ];

  dbFumbleRanged = [
    { d6: '1', effect: 'Weapon jams / breaks string (fast action to fix)' },
    { d6: '2', effect: 'Hit a nearby ally (if in line of fire)' },
    { d6: '3', effect: 'Ammunition lost / wasted D3 shots' },
    { d6: '4', effect: 'Drop the weapon' },
    { d6: '5', effect: 'Lose next action' },
    { d6: '6', effect: 'Weapon breaks (Durability −1)' }
  ];

  dbSevereInjury = [
    { d20: '1–2',   injury: 'Broken hand — weapon falls; bane to all STR/AGL rolls' },
    { d20: '3–4',   injury: 'Broken arm — cannot use arm; lose held weapon' },
    { d20: '5–6',   injury: 'Broken leg — movement halved, cannot run' },
    { d20: '7–8',   injury: 'Damaged eye — bane to all sight-based rolls' },
    { d20: '9–10',  injury: 'Ruptured ear — bane to hearing-based AWARENESS' },
    { d20: '11–12', injury: 'Deep wound to torso — lose D6 HP/round until treated' },
    { d20: '13–14', injury: 'Crushed ribs — bane to all STR/CON rolls' },
    { d20: '15–16', injury: 'Knocked out — unconscious until rallied (D6 rounds)' },
    { d20: '17–18', injury: 'Lost finger(s) — minor but permanent' },
    { d20: '19',    injury: 'Disemboweled — die in D6 rounds unless HEALING (with bane)' },
    { d20: '20',    injury: 'Decapitated — instant death' }
  ];

  dbMagicalMishap = [
    { d20: '1',    mishap: 'Caster takes D6 damage' },
    { d20: '2',    mishap: 'Lose D6 WP' },
    { d20: '3',    mishap: 'Spell affects caster instead of target' },
    { d20: '4',    mishap: 'Spell affects a random nearby creature' },
    { d20: '5',    mishap: 'Caster becomes Dazed' },
    { d20: '6',    mishap: 'Violent discharge — all within 2m take D6 damage' },
    { d20: '7',    mishap: 'Caster loses their next action' },
    { d20: '8',    mishap: 'Caster flung back D6 meters' },
    { d20: '9',    mishap: 'Spell fires at max PL regardless of WP spent' },
    { d20: '10',   mishap: 'Wild surge — random nearby spell effect (GM decides)' },
    { d20: '11',   mishap: 'Voice silenced D6 rounds (no Word-spells)' },
    { d20: '12',   mishap: 'Hands numbed — bane on spell rolls for D6 rounds' },
    { d20: '13',   mishap: 'Portal opens briefly — something comes through' },
    { d20: '14',   mishap: 'Caster ages D6 years' },
    { d20: '15',   mishap: 'Reverse effect — spell causes opposite of intended' },
    { d20: '16',   mishap: 'Caster becomes Scared' },
    { d20: '17',   mishap: 'Gravity reverses around caster for 1 round' },
    { d20: '18',   mishap: 'Caster\'s focus/grimoire is destroyed' },
    { d20: '19',   mishap: 'All prepared spells become unprepared' },
    { d20: '20',   mishap: 'Catastrophic — double all damage/effects of the mishap' }
  ];

  dbFearTable = [
    { d8: '1', effect: 'Paralyzed — lose all actions this round' },
    { d8: '2', effect: 'Flee — move away at full speed' },
    { d8: '3', effect: 'Scream — alerts all nearby creatures' },
    { d8: '4', effect: 'Drop all held items' },
    { d8: '5', effect: 'Frozen — cannot act until ally snaps you out' },
    { d8: '6', effect: 'Panic attack — bane on all rolls for D6 rounds' },
    { d8: '7', effect: 'Become Scared (condition)' },
    { d8: '8', effect: 'Faint — unconscious for D6 rounds' }
  ];

  // ─── Kal-Arath Data ──────────────────────────────────────────────────────────

  kalArathCoreResolution = [
    { situation: 'Standard task', roll: '2d6 + Stat, 8+' },
    { situation: 'Very difficult', roll: 'Disadvantage (3d6, take 2 lowest)' },
    { situation: 'Very easy / under pressure', roll: 'Advantage (3d6, take 2 highest)' },
    { situation: 'Critical Success', roll: 'Two 6s — always succeeds, best effect' },
    { situation: 'Critical Failure', roll: 'Two 1s — always fails, worst effect' }
  ];

  kalArathStats = [
    { stat: 'STR', use: 'Melee attacks, physical might' },
    { stat: 'TOU', use: 'Starting HP, death rolls, endurance' },
    { stat: 'AGI', use: 'Missile attacks, dodge, initiative, dexterity' },
    { stat: 'INT', use: 'Spells, perception, "smart" rolls' },
    { stat: 'PRE', use: 'Reactions, charisma, lying, intimidation, social' }
  ];

  kalArathWeaponsLight = [
    { weapon: 'Dagger/Knife', special: 'Throwable (AGI); d6/a when grappling or vs. prone' },
    { weapon: 'Hatchet', special: 'Throwable; on critical, auto-grapple instead of bonus die' },
    { weapon: 'Staff/Stick', special: 'On critical, knock enemy prone instead of bonus die' }
  ];

  kalArathWeaponsMedium = [
    { weapon: 'Sword', special: 'On critical Dodge, immediately counterattack' },
    { weapon: 'Battle Axe', special: 'On critical, tear enemy\'s weapon away' },
    { weapon: 'Flail', special: 'Ignores shields' },
    { weapon: 'Spear', special: 'Interrupt anyone moving into attack range regardless of initiative' },
    { weapon: 'Mace', special: 'On critical, stun 1 round instead of bonus die' }
  ];

  kalArathWeaponsHeavy = [
    { weapon: 'Greataxe', special: 'On critical, enemy knocked prone' },
    { weapon: 'Two-Handed Sword', special: 'On killing blow, attack again immediately' },
    { weapon: 'Maul', special: 'On critical, stun d6 rounds + prone instead of bonus die' }
  ];

  kalArathWeaponsMissile = [
    { weapon: 'Sling', dmg: 'd6/d', special: 'On 6 damage, stun 1 round instead of explode' },
    { weapon: 'Javelin', dmg: 'd6', special: 'On hit, may destroy enemy shield instead of damage' },
    { weapon: 'Shortbow', dmg: 'd6', special: 'May move–attack–move in one round' },
    { weapon: 'Longbow', dmg: 'd6', special: 'Up to 3 rounds aiming for +1 attack & damage each round' }
  ];

  kalArathArmor = [
    { type: 'Light', reduction: '–1', notes: 'Leather, piecemeal, studs' },
    { type: 'Medium', reduction: '–2', notes: 'Lamellar, ring-on-leather, full suit' },
    { type: 'Heavy', reduction: '–3', notes: 'Custom plate/scale/chain — rare' },
    { type: 'Shield', reduction: '–1', notes: 'May sacrifice to reduce one attack\'s damage to 0' }
  ];

  kalArathDeathWounding = [
    { roll: '2', result: 'Instant Death' },
    { roll: '3', result: 'Fatal Wound — die in d6 rounds' },
    { roll: '4', result: 'Severed/destroyed limb — die in 2d6 rounds without healing; –2 AGI permanently; d6 weeks to heal past 50% HP' },
    { roll: '5', result: 'Shattered — roll d6: 1=Face –1 PRE / 2=Leg –1 AGI / 3=Arm –1 STR / 4–5=Core –1 TOU / 6=Head –1 INT; d6 days to heal past ½ HP' },
    { roll: '6', result: 'Broken/Slashed/Pierced — –1 HP permanently; d6 days to heal' },
    { roll: '7–8', result: 'Unconscious 2d6 rounds (helm = stunned 1 round)' },
    { roll: '9', result: 'Stunned 1 round (helm = knocked down)' },
    { roll: '10', result: 'Knocked down; standing costs an action; attack/dodge at disadvantage while prone' },
    { roll: '11', result: 'Reeling but still fighting' },
    { roll: '12', result: 'Adrenaline surge — gain d6 HP; at combat\'s end, black out for d6 rounds' }
  ];

  kalArathHealing = [
    { when: 'End of battle', recovery: 'Regain 1 + TOU (minimum 1)' },
    { when: 'Full rest (no interruptions, with rations)', recovery: 'Regain d6 + TOU' }
  ];

  kalArathReaction = [
    { roll: '2–3', reaction: 'KILL' },
    { roll: '4–6', reaction: 'Angered / Hostile' },
    { roll: '7–8', reaction: 'Neutral' },
    { roll: '9–10', reaction: 'Friendly' },
    { roll: '11–12', reaction: 'Actively Helpful' }
  ];

  kalArathMagicTiers = [
    { tier: 'Tier 1', difficulty: '8', minInt: '+1' },
    { tier: 'Tier 2', difficulty: '9', minInt: '+2' },
    { tier: 'Tier 3', difficulty: '10', minInt: '+3' },
    { tier: 'Tier 4', difficulty: '11', minInt: '+4' },
    { tier: 'Tier 5', difficulty: '12', minInt: '+5' }
  ];

  kalArathArcaneDaster = [
    { roll: '2', disaster: 'Possessed by demon — adventure ends' },
    { roll: '3', disaster: 'Blood vessels burst — 0 HP, –2 TOU permanently (roll Death Table)' },
    { roll: '4', disaster: 'Psychic damage — –2 INT, vivid hallucinations' },
    { roll: '5', disaster: 'Soul torn — –1 INT, –1 PRE, horror and emptiness' },
    { roll: '6', disaster: 'Cursed — lose Fate Point until curse is broken' },
    { roll: '7', disaster: 'Monstrous appearance — –1 PRE, +1 PRE for intimidation' },
    { roll: '8', disaster: 'Spell sigils scarred into flesh — –1 PRE, STR checks at disadvantage' },
    { roll: '9', disaster: 'Magic lashes back — –1 permanent HP' },
    { roll: '10', disaster: 'Psychic echo — –1 INT for d6 sessions' },
    { roll: '11', disaster: 'Vitality drained — –1 STR for remainder of session' },
    { roll: '12', disaster: 'Minor psychic backlash — spell fails, nothing worse' }
  ];

  kalArathDemonicPacts = [
    { d6: '1', pact: 'Blood' },
    { d6: '2', pact: 'Destruction' },
    { d6: '3', pact: 'Corruption' },
    { d6: '4', pact: 'Illumination' },
    { d6: '5', pact: 'Shadow' },
    { d6: '6', pact: 'Domination' }
  ];

  kalArathDooms = [
    { d6: '1', doom: 'No metal weapons or armor' },
    { d6: '2', doom: 'Sacrifice something of great value each new moon' },
    { d6: '3', doom: 'Must speak demon\'s names aloud when casting; cannot cast if silenced' },
    { d6: '4', doom: 'Must make periodic d6-day pilgrimages to a desolate sacred site' },
    { d6: '5', doom: 'Each spell must be inscribed on a blood-written scroll (costs 1 HP permanently)' },
    { d6: '6', doom: 'Cannot speak for hours equal to the tier of the last spell cast' }
  ];

  kalArathForaging = [
    { d6: '1–2', result: 'Nothing found' },
    { d6: '3', result: '1 ration' },
    { d6: '4', result: '3 rations' },
    { d6: '5', result: '5 rations' },
    { d6: '6', result: '5 rations + d6 doses of random herb' }
  ];

  kalArathHerbs = [
    { d6: '1', herb: 'Zhar\'um', effect: 'Restores d6 HP' },
    { d6: '2', herb: 'Gruul', effect: '+1 AGI for 1 day' },
    { d6: '3', herb: 'Tarnak Berry', effect: 'Skip one ration' },
    { d6: '4', herb: 'Valkash', effect: 'Valuable dye/ink (20s)' },
    { d6: '5', herb: 'Mor Blossom', effect: '+2 INT checks for 1 hour' },
    { d6: '6', herb: 'Thun Spore', effect: 'Regain spent Fate Point' }
  ];

  kalArathNightEncounters = [
    { roll: '2', encounter: 'Giant' },
    { roll: '3', encounter: 'Eukarya' },
    { roll: '4', encounter: 'Giant Owl' },
    { roll: '5', encounter: 'Poor Travelers' },
    { roll: '6', encounter: 'Black Legion' },
    { roll: '7', encounter: 'Nomads' },
    { roll: '8', encounter: 'Sons of Akkai' },
    { roll: '9', encounter: 'Wolves' },
    { roll: '10', encounter: 'Skeleton Warriors' },
    { roll: '11', encounter: 'Dark Sorcerer/Mystic' },
    { roll: '12', encounter: 'Demon Emissary' }
  ];

  kalArathBestiary = [
    { creature: 'Ash\'Hassim', hp: '2d6', armor: '1', attack: 'Dagger d6/d', morale: '8', special: 'Stealth (INT 8+); backstab +d6' },
    { creature: 'Beastmen', hp: 'd6', armor: '0', attack: 'Claw/Club d6/d or d6', morale: '6', special: 'Pack Tactics: PCs –2 Dodge when outnumbered' },
    { creature: 'Black Legion Champ', hp: '5d6', armor: '2', attack: 'Greatsword d6/a ×2/rd', morale: '10', special: 'Intimidate (PRE 8+ or foe at disadvantage)' },
    { creature: 'Duelist/Pit Fighter', hp: '3d6', armor: '1–2', attack: 'Sword d6 ×2/rd', morale: '8', special: '—' },
    { creature: 'Eukarya (Giant Mantis)', hp: '5d6', armor: '2', attack: 'Claw d6 + Bite d6 ×2/rd', morale: '8', special: 'Leaping Attack: claw hit from 10\'+ → prone + auto bite' },
    { creature: 'Ghoul', hp: '2d6', armor: '1', attack: 'Claw d6', morale: 'N/A', special: 'Paralyzing Touch (TOU 8+ or paralyzed d6 rds)' },
    { creature: 'Giant', hp: '6d6', armor: '1', attack: 'Club 2d6', morale: '11', special: 'Throw Boulder: ranged 2d6' },
    { creature: 'Giant Owl', hp: '3d6', armor: '0', attack: 'Talons d6', morale: '10', special: 'Swoop: carry & drop for d6×10 dmg, ignores armor' },
    { creature: 'Giant Snake', hp: '4d6', armor: '0', attack: 'Bite d6+poison (TOU 8+)', morale: '8', special: 'Constrict: auto bite + d6 per round; STR disadv to escape' },
    { creature: 'Giant Spider', hp: '3d6', armor: '1', attack: 'Bite d6+paralysis (TOU 8+)', morale: '6', special: 'Webbing (AGI 8+ or immobilized until STR check)' },
    { creature: 'Kuyu', hp: 'd6', armor: '1', attack: 'Club/Spear d6', morale: '8', special: '—' },
    { creature: 'Lion', hp: '4d6', armor: '0', attack: 'Claw d6 + Bite d6 ×2/rd', morale: '9', special: 'Leaping Attack (same as Eukarya)' },
    { creature: 'Mercenary', hp: 'd6', armor: '2', attack: 'Sword d6', morale: '7', special: '—' },
    { creature: 'Nomad Scout', hp: 'd6', armor: '0', attack: 'Shortbow d6', morale: '7', special: '—' },
    { creature: 'Nomad Warrior', hp: '2d6', armor: '2', attack: 'Spear/Sword d6', morale: '8', special: 'Mounted: attacks at advantage on horseback' },
    { creature: 'Raptor Lizard', hp: '5d6', armor: '1', attack: 'Claw d6 + Bite 2d6 ×2/rd', morale: '10', special: 'Advantage when alongside another Raptor' },
    { creature: 'Skeleton Warrior', hp: '2d6', armor: '1', attack: 'Sword d6', morale: 'N/A', special: 'Immune fear/mind spells; slashing/piercing at disadvantage' },
    { creature: 'Sorcerer', hp: '2d6', armor: '0', attack: 'Staff d6', morale: '6', special: 'Spells up to Tier 3, random Pact, at INT+3' },
    { creature: 'Steppe Jackal', hp: 'd6', armor: '0', attack: 'Bite d6', morale: '6', special: 'Pack Tactics' },
    { creature: 'Teradun (Pteranodon)', hp: '4d6', armor: '1', attack: 'Beak d6', morale: '6', special: 'Swoop' },
    { creature: 'Wolves', hp: '2d6', armor: '0', attack: 'Bite d6 ×2/rd', morale: '8', special: 'Pack Tactics' }
  ];

  kalArathBossCreatures = [
    { creature: 'Kuyu Cannibal Champion', hp: '24', armor: '—', attack: 'Bone Sword (5–6 explode)', special: 'Consume: 1–2 on d6 each round → bite d6/a, gains HP equal to damage' },
    { creature: 'Tentacled Horror', hp: '28', armor: '1', attack: 'd6 ×4/rd', special: 'Grapple (auto-crush d6/rd, STR 8+ to break); Cloud of Chaos: 1-in-6, 30\' confusion cloud, INT 8+ to act' },
    { creature: 'Tyrant Lizard', hp: '32', armor: '2', attack: 'Bite 2d6; Tail d6 (ignores armor, knock d6×5\' away)', special: 'Awful Roar at start (PRE 8+ or lose action); count down d6 each round to next roar' },
    { creature: 'Temple Guardians', hp: '15/18', armor: '3', attack: 'd6/a (polearms)', special: 'Leaping Strike at start and every 2 rounds: if hits = critical' },
    { creature: 'Warlord (Ancient)', hp: '5d6 (20)', armor: '1', attack: 'Rune Sword d6 ×2/rd', special: 'Critical hit = auto Death Table roll' },
    { creature: 'Blood Demon (Pact)', hp: '5d6', armor: '2', attack: 'Claws 2d6', special: 'Morale 10' },
    { creature: 'Shadow Demon (Pact)', hp: '24', armor: '2', attack: '2d6', special: 'Morale 10' }
  ];

  // ─── OSRIC Data ──────────────────────────────────────────────────────────────

  osricCoreMechanic = [
    { item: 'Attack Roll', rule: 'Roll d20 + modifiers. Hit if result ≥ (THAC0 − target AC).' },
    { item: 'Critical / Fumble', rule: 'No automatic critical on 20; no automatic fumble on 1 by default (GM option).' },
    { item: 'Melee to-hit', rule: 'STR hit bonus applies; DEX bonus does not.' },
    { item: 'Missile to-hit', rule: 'DEX missile bonus applies; STR bonus applies only to hurled weapons.' },
    { item: 'Surprise', rule: 'Roll d6 at encounter start. Roll 1: surprised 1 segment. Roll 2: surprised 2 segments. Roll 3+: not surprised.' },
  ];

  osricThac0 = [
    { classes: 'Fighter / Paladin / Ranger', l1_2: 20, l3_4: 18, l5_6: 16, l7_8: 14, l9_10: 12, l11_12: 10, l13_14: 8, l15_16: 6, l17_18: 4, l19: 2 },
    { classes: 'Cleric / Druid',            l1_2: 20, l3_4: 20, l5_6: 18, l7_8: 18, l9_10: 16, l11_12: 14, l13_14: 12, l15_16: 10, l17_18: 8, l19: 8 },
    { classes: 'Thief / Assassin',          l1_2: 20, l3_4: 20, l5_6: 18, l7_8: 18, l9_10: 16, l11_12: 16, l13_14: 14, l15_16: 14, l17_18: 12, l19: 12 },
    { classes: 'Magic User / Illusionist',  l1_2: 20, l3_4: 20, l5_6: 20, l7_8: 18, l9_10: 18, l11_12: 16, l13_14: 16, l15_16: 14, l17_18: 14, l19: 12 },
  ];

  osricStrTable = [
    { str: '3',         hit: '−3', dmg: '−1', enc: '−35 lbs' },
    { str: '4–5',       hit: '−2', dmg: '−1', enc: '−25 lbs' },
    { str: '6–7',       hit: '−1', dmg: '0',  enc: '−15 lbs' },
    { str: '8–11',      hit: '0',  dmg: '0',  enc: '0' },
    { str: '12–13',     hit: '0',  dmg: '0',  enc: '+10 lbs' },
    { str: '14–15',     hit: '0',  dmg: '0',  enc: '+20 lbs' },
    { str: '16',        hit: '0',  dmg: '+1', enc: '+35 lbs' },
    { str: '17',        hit: '+1', dmg: '+1', enc: '+50 lbs' },
    { str: '18',        hit: '+1', dmg: '+2', enc: '+75 lbs' },
    { str: '18/01–50',  hit: '+1', dmg: '+3', enc: '+100 lbs' },
    { str: '18/51–75',  hit: '+2', dmg: '+3', enc: '+125 lbs' },
    { str: '18/76–90',  hit: '+2', dmg: '+4', enc: '+150 lbs' },
    { str: '18/91–99',  hit: '+2', dmg: '+5', enc: '+200 lbs' },
    { str: '19',        hit: '+3', dmg: '+6', enc: '+300 lbs' },
  ];

  osricDexTable = [
    { dex: '3',    surprise: '−3', missile: '−3', ac: '+4' },
    { dex: '4',    surprise: '−2', missile: '−2', ac: '+3' },
    { dex: '5',    surprise: '−1', missile: '−1', ac: '+2' },
    { dex: '6–14', surprise: '0',  missile: '0',  ac: '0 or +1' },
    { dex: '15',   surprise: '0',  missile: '0',  ac: '−1' },
    { dex: '16',   surprise: '+1', missile: '+1', ac: '−2' },
    { dex: '17',   surprise: '+2', missile: '+2', ac: '−3' },
    { dex: '18–19',surprise: '+3', missile: '+3', ac: '−4' },
  ];

  osricConTable = [
    { con: '3',    hpMod: '−2',     res: '40%',    shock: '35%' },
    { con: '4–5',  hpMod: '−1',     res: '45–50%', shock: '40–45%' },
    { con: '6–7',  hpMod: '−1',     res: '55–60%', shock: '50–55%' },
    { con: '8–14', hpMod: '0',      res: '65–92%', shock: '60–88%' },
    { con: '15',   hpMod: '+1',     res: '94%',    shock: '91%' },
    { con: '16',   hpMod: '+2',     res: '96%',    shock: '95%' },
    { con: '17',   hpMod: '+2/+3†', res: '98%',    shock: '97%' },
    { con: '18',   hpMod: '+2/+4†', res: '100%',   shock: '99%' },
    { con: '19',   hpMod: '+2/+5†', res: '100%',   shock: '99%' },
  ];

  osricCombatMods = [
    { situation: 'Cover 25%',               effect: '−2 to attacker\'s to-hit' },
    { situation: 'Cover 50%',               effect: '−4 to attacker\'s to-hit' },
    { situation: 'Cover 75%',               effect: '−7 to attacker\'s to-hit' },
    { situation: 'Invisible opponent',      effect: '−4 to attacker\'s to-hit; no flanking' },
    { situation: 'Prone opponent',          effect: '+4 to hit; negates shield & DEX AC' },
    { situation: 'Rear attack',             effect: '+2 to hit; negates shield & DEX AC' },
    { situation: 'Stunned / Sleeping',      effect: '+4 to hit; negates shield & DEX AC' },
    { situation: 'Flank attack',            effect: 'Negates shield; rear negates shield & DEX' },
    { situation: 'Fleeing target',          effect: '+4 to hit on immediate attacks' },
    { situation: 'Charge',                  effect: '+2 to hit; −DEX AC bonus to charger' },
    { situation: 'Two-weapon fighting',     effect: 'Primary −2, off-hand −4 to hit (dagger/hand axe only)' },
    { situation: 'Shooting into melee',     effect: 'Miss range: ally in line of fire may be hit instead' },
  ];

  osricSavingThrows = [
    { cls: 'Fighter', lvl: '1–3',   death: 14, wands: 16, para: 15, breath: 17, spell: 17 },
    { cls: 'Fighter', lvl: '4–6',   death: 13, wands: 15, para: 14, breath: 16, spell: 16 },
    { cls: 'Fighter', lvl: '7–9',   death: 11, wands: 13, para: 12, breath: 13, spell: 14 },
    { cls: 'Fighter', lvl: '10–12', death: 10, wands: 12, para: 11, breath: 11, spell: 12 },
    { cls: 'Fighter', lvl: '13–15', death:  8, wands: 10, para:  9, breath:  9, spell: 10 },
    { cls: 'Fighter', lvl: '16+',   death:  7, wands:  9, para:  8, breath:  7, spell:  8 },
    { cls: 'Cleric',  lvl: '1–3',   death: 10, wands: 14, para: 13, breath: 16, spell: 15 },
    { cls: 'Cleric',  lvl: '4–6',   death:  9, wands: 13, para: 12, breath: 15, spell: 14 },
    { cls: 'Cleric',  lvl: '7–9',   death:  7, wands: 11, para: 10, breath: 13, spell: 12 },
    { cls: 'Cleric',  lvl: '10–12', death:  6, wands: 10, para:  9, breath: 12, spell: 11 },
    { cls: 'Cleric',  lvl: '13–15', death:  5, wands:  9, para:  8, breath: 11, spell: 10 },
    { cls: 'Cleric',  lvl: '16+',   death:  4, wands:  8, para:  7, breath: 10, spell:  9 },
    { cls: 'Thief',   lvl: '1–4',   death: 13, wands: 14, para: 12, breath: 16, spell: 15 },
    { cls: 'Thief',   lvl: '5–8',   death: 12, wands: 12, para: 11, breath: 15, spell: 13 },
    { cls: 'Thief',   lvl: '9–12',  death: 11, wands: 10, para: 10, breath: 14, spell: 11 },
    { cls: 'Thief',   lvl: '13–16', death: 10, wands:  8, para:  9, breath: 13, spell:  9 },
    { cls: 'Thief',   lvl: '17+',   death:  9, wands:  6, para:  8, breath: 12, spell:  7 },
    { cls: 'MU/Ill.', lvl: '1–5',   death: 14, wands: 11, para: 13, breath: 15, spell: 12 },
    { cls: 'MU/Ill.', lvl: '6–10',  death: 13, wands:  9, para: 11, breath: 13, spell: 10 },
    { cls: 'MU/Ill.', lvl: '11–15', death: 11, wands:  7, para:  9, breath: 11, spell:  8 },
    { cls: 'MU/Ill.', lvl: '16–20', death: 10, wands:  5, para:  7, breath:  9, spell:  6 },
    { cls: 'MU/Ill.', lvl: '21+',   death:  8, wands:  3, para:  5, breath:  7, spell:  4 },
  ];

  osricTurnUndead = [
    { type: 'Skeleton',  c1: '13', c2: '10', c3: '7',  c4: 'T',  c5: 'T',  c6: 'D',  c7: 'D',  c8: 'D',  c9_13: 'D', c14_18: 'D', c19: 'D' },
    { type: 'Zombie',    c1: '16', c2: '13', c3: '10', c4: '7',  c5: 'T',  c6: 'T',  c7: 'D',  c8: 'D',  c9_13: 'D', c14_18: 'D', c19: 'D' },
    { type: 'Ghoul',     c1: '19', c2: '16', c3: '13', c4: '10', c5: '7',  c6: 'T',  c7: 'T',  c8: 'D',  c9_13: 'D', c14_18: 'D', c19: 'D' },
    { type: 'Shadow',    c1: '20', c2: '19', c3: '16', c4: '13', c5: '10', c6: '7',  c7: 'T',  c8: 'T',  c9_13: 'D', c14_18: 'D', c19: 'D' },
    { type: 'Wight',     c1: '—',  c2: '20', c3: '19', c4: '16', c5: '13', c6: '10', c7: '7',  c8: 'T',  c9_13: 'T', c14_18: 'D', c19: 'D' },
    { type: 'Ghast',     c1: '—',  c2: '—',  c3: '20', c4: '19', c5: '16', c6: '13', c7: '10', c8: '7',  c9_13: 'T', c14_18: 'T', c19: 'D' },
    { type: 'Wraith',    c1: '—',  c2: '—',  c3: '—',  c4: '20', c5: '19', c6: '16', c7: '13', c8: '10', c9_13: '7', c14_18: 'T', c19: 'D' },
    { type: 'Mummy',     c1: '—',  c2: '—',  c3: '—',  c4: '—',  c5: '20', c6: '19', c7: '16', c8: '13', c9_13: '10', c14_18: '7', c19: 'T' },
    { type: 'Spectre',   c1: '—',  c2: '—',  c3: '—',  c4: '—',  c5: '—',  c6: '20', c7: '19', c8: '16', c9_13: '13', c14_18: '10', c19: '7' },
    { type: 'Vampire',   c1: '—',  c2: '—',  c3: '—',  c4: '—',  c5: '—',  c6: '—',  c7: '20', c8: '19', c9_13: '16', c14_18: '13', c19: '10' },
    { type: 'Ghost',     c1: '—',  c2: '—',  c3: '—',  c4: '—',  c5: '—',  c6: '—',  c7: '—',  c8: '20', c9_13: '19', c14_18: '16', c19: '13' },
    { type: 'Lich',      c1: '—',  c2: '—',  c3: '—',  c4: '—',  c5: '—',  c6: '—',  c7: '—',  c8: '—',  c9_13: '20', c14_18: '19', c19: '16' },
    { type: 'Special',   c1: '—',  c2: '—',  c3: '—',  c4: '—',  c5: '—',  c6: '—',  c7: '—',  c8: '—',  c9_13: '—',  c14_18: '20', c19: '19' },
  ];

  osricArmorAc = [
    { armor: 'None',             ac: 10, enc: '—',    move: '120 ft', cost: '—' },
    { armor: 'Leather',          ac:  8, enc: '15 lbs', move: '120 ft', cost: '5 gp' },
    { armor: 'Padded Gambeson',  ac:  8, enc: '10 lbs', move: '90 ft',  cost: '4 gp' },
    { armor: 'Studded Leather',  ac:  7, enc: '20 lbs', move: '90 ft',  cost: '15 gp' },
    { armor: 'Ring Mail',        ac:  7, enc: '35 lbs', move: '90 ft',  cost: '30 gp' },
    { armor: 'Scale / Lamellar', ac:  6, enc: '40 lbs', move: '60 ft',  cost: '45 gp' },
    { armor: 'Chain Mail',       ac:  5, enc: '30 lbs', move: '90 ft',  cost: '75 gp' },
    { armor: 'Elfin Chain',      ac:  5, enc: '15 lbs', move: '120 ft', cost: 'Gift only' },
    { armor: 'Banded',           ac:  4, enc: '35 lbs', move: '90 ft',  cost: '90 gp' },
    { armor: 'Splint',           ac:  4, enc: '40 lbs', move: '60 ft',  cost: '80 gp' },
    { armor: 'Plate',            ac:  3, enc: '45 lbs', move: '60 ft',  cost: '400 gp' },
    { armor: 'Field Plate (opt)',ac:  2, enc: '50 lbs', move: '90 ft',  cost: 'Varies' },
    { armor: 'Shield',           ac: '+1', enc: '5–10 lbs', move: '—', cost: '10–15 gp' },
  ];

  osricEncumbrance = [
    { weight: 'Up to 35 lbs',  move: '120 ft/round', surprise: '+1 (lighter than chain)' },
    { weight: '36–70 lbs',     move: '90 ft/round',  surprise: 'Normal' },
    { weight: '71–105 lbs',    move: '60 ft/round',  surprise: 'No bonuses' },
    { weight: '106–150 lbs',   move: '30 ft/round',  surprise: 'No bonuses; −1 penalty' },
    { weight: 'Over 150 lbs',  move: 'No movement',  surprise: '—' },
  ];

  osricFallingDamage = [
    { distance: 'Less than 5 ft', damage: 'None' },
    { distance: 'Up to 10 ft',    damage: '1d6' },
    { distance: 'Up to 20 ft',    damage: '3d6' },
    { distance: 'Up to 30 ft',    damage: '6d6' },
    { distance: 'Up to 40 ft',    damage: '10d6' },
    { distance: 'Up to 50 ft',    damage: '15d6' },
    { distance: 'Over 50 ft',     damage: '20d6' },
  ];

  osricMorale = [
    { situation: 'Per friend killed, surrendered, or fled', mod: '+5%' },
    { situation: 'Own side at 25% casualties',             mod: '+5%' },
    { situation: 'Numerical inferiority',                  mod: '+10%' },
    { situation: 'Own side at 50% casualties',             mod: '+15%' },
    { situation: 'Greatly outnumbered (2:1+)',             mod: '+20%' },
    { situation: 'Own leader hors de combat',              mod: '+25%' },
    { situation: 'Per foe killed, surrendered, or fled',   mod: '−5%' },
    { situation: 'Inflicted 25% casualties on enemy',      mod: '−5%' },
    { situation: 'Numerical superiority',                  mod: '−10%' },
    { situation: 'Inflicted 50% casualties on enemy',      mod: '−15%' },
  ];

  osricThiefSkills = [
    { skill: 'Climb Walls',       lv1: '85%', note: '' },
    { skill: 'Find/Remove Traps', lv1: '10%', note: '' },
    { skill: 'Hide in Shadows',   lv1: '10%', note: '' },
    { skill: 'Move Quietly',      lv1: '15%', note: '' },
    { skill: 'Open Locks',        lv1: '15%', note: '' },
    { skill: 'Pick Pockets',      lv1: '30%', note: '20%+ failure alerts target' },
    { skill: 'Read Languages',    lv1: '1%',  note: 'Level 10: read arcane scrolls' },
  ];

  // ─── Mothership Data ─────────────────────────────────────────────────────────

  msClassSaves = [
    { className: 'Teamster', sanity: 30, fear: 35, body: 30, armor: 35, skills: 'Zero-G, Mechanical Repair + 1 choice; +4 Skill Pts' },
    { className: 'Android',  sanity: 25, fear: 35, body: 45, armor: 25, skills: 'Computers, Mathematics, Linguistics; +2 Skill Pts' },
    { className: 'Scientist',sanity: 40, fear: 25, body: 25, armor: 25, skills: '2 of: Biology, Geology, Computers, Mathematics, Chemistry; +3 Skill Pts' },
    { className: 'Marine',   sanity: 25, fear: 30, body: 35, armor: 50, skills: 'Military Training; +3 Skill Pts; nearby Marines grant +5/+5' },
  ];

  msSkillRanks = [
    { rank: 'Untrained', bonus: '+0%', cost: '—',       note: 'May have Disadvantage on complex tasks' },
    { rank: 'Trained',   bonus: '+10%', cost: '1 pt',   note: 'First rank; prerequisite for Expert' },
    { rank: 'Expert',    bonus: '+15%', cost: '2 pts',  note: 'Requires Trained prerequisite' },
    { rank: 'Master',    bonus: '+20%', cost: '3 pts',  note: 'Requires Expert prerequisite' },
  ];

  msWeapons = [
    { name: 'Revolver',        dmg: '3d10', range: '2/30/125m',  shots: 8,   cost: '750 Cr',   note: 'Crit: Knock-down' },
    { name: 'SMG',             dmg: '4d10', range: '10/75/150m', shots: '1(5)', cost: '1,200 Cr', note: 'Fully automatic' },
    { name: 'Combat Shotgun',  dmg: '2d10', range: '10/20/30m',  shots: 4,   cost: '1,400 Cr', note: '½ dmg at med; ¼ at long' },
    { name: 'Pulse Rifle',     dmg: '5d10', range: '15/125/300m',shots: '1(3)', cost: '1,600 Cr', note: 'Fully automatic; has grenade launcher' },
    { name: 'Smart Rifle',     dmg: '1d10', range: '25/200/500m',shots: 12,  cost: '12,000 Cr',note: 'Crit: ×3 DMG; AP ammo' },
    { name: 'Vibechete',       dmg: '2d10', range: 'CQC',        shots: '—', cost: '75 Cr',    note: 'Crit: Hack off limb' },
    { name: 'Stun Baton',      dmg: '1d10', range: 'CQC',        shots: '—', cost: '115 Cr',   note: 'Crit: No save; Body save or stunned' },
    { name: 'Frag Grenade',    dmg: '1d10', range: '20/30/40m',  shots: 1,   cost: '70 Cr',    note: '15m radius; can do 1 MDMG to ships' },
    { name: 'Flame Thrower',   dmg: '2d10', range: '2/10/20m',   shots: 8,   cost: '2,000 Cr', note: 'Body save or catch fire: 1d10/turn' },
  ];

  msArmor = [
    { type: 'Standard Crew Attire', bonus: '+0%',  notes: 'Default for all classes' },
    { type: 'Hazard Suit',          bonus: '+5%',  notes: 'Air filter, 1hr air tank, heat/cold protection, comms' },
    { type: 'Vaccsuit',             bonus: '+7%',  notes: '12hr O2 w/tank; Speed checks at Disadvantage' },
    { type: 'Standard Battle Dress',bonus: '+10%', notes: 'Light plated; standard marine dress' },
    { type: 'Advanced Battle Dress',bonus: '+15%', notes: 'Exoskeleton (carry ×2); Speed checks at Disadvantage' },
  ];

  msPanicTable = [
    { roll: '2–3',  effect: 'Laser Focus — Advantage on all rolls for 1d10 hours' },
    { roll: '4–5',  effect: 'Major Adrenaline Rush — Advantage for 3d10 minutes' },
    { roll: '6–7',  effect: 'Minor Adrenaline Rush — Advantage for 1d10 minutes' },
    { roll: '8–9',  effect: 'Anxious — gain 1 Stress' },
    { roll: '10–11',effect: 'Nervous Twitch — gain 2 Stress; nearest crew gains 1 Stress' },
    { roll: '12–13',effect: 'Cowardice — gain 1 Stress; Fear save to enter combat for 1d10 hours' },
    { roll: '14–15',effect: 'Hallucinations — trouble distinguishing reality for 2d10 hours' },
    { roll: '16–17',effect: 'Crippling Fear — gain permanent phobia; encounter triggers Fear save at Disadvantage' },
    { roll: '18–19',effect: 'Overwhelmed — gain 1d10 Stress' },
    { roll: '20–21',effect: 'Rattled — Disadvantage all rolls for 2d10 minutes' },
    { roll: '22',   effect: 'Paranoid — Fear save on anyone joining group or gain 1 Stress (1d10 days)' },
    { roll: '23',   effect: 'Death Drive — Sanity save vs. stranger/enemy or immediately attack (Stress×d10 days)' },
    { roll: '24',   effect: 'Catatonic — unresponsive for Stress×d10 minutes' },
    { roll: '25',   effect: 'Broken — Panic roll whenever nearby crew fails a save (Stress×d10 days)' },
    { roll: '26',   effect: 'Psychotic — attack nearest crew member until dealing 2d10 damage' },
    { roll: '27',   effect: 'Compounding Problems — roll twice on this table' },
    { roll: '28',   effect: 'Descent into Madness — 2 new phobias; Stress cannot drop below 5' },
    { roll: '29',   effect: 'Psychological Collapse — permanently insane; character played by Warden' },
    { roll: '30',   effect: 'Heart Attack — instant death' },
  ];

  msUnconscious = [
    { d10: '1',    result: 'Comatose & brain-dead; only extraordinary measures help' },
    { d10: '2–3',  result: 'In 1d10 days: 1 HP. −5 STR, −5 SPD, −5 INT (permanent). Disadvantage all rolls 1d10 days. +1d10 Stress' },
    { d10: '4–6',  result: 'In 1d10 hours: 1 HP. −5 STR, −5 SPD (permanent). Disadvantage all rolls 1d10 hrs. +3 Stress' },
    { d10: '7–9',  result: 'In 1d10 minutes: 1 HP. −5 STR (permanent). Disadvantage all rolls 3d10 min. +2 Stress' },
    { d10: '10',   result: 'Immediately: 1 HP. Disadvantage all rolls 1d10 minutes. +1 Stress' },
  ];

  msHealing = [
    { outcome: 'Success',          result: 'Heal HP = amount roll succeeded by (Body score − roll)' },
    { outcome: 'Critical Success', result: 'Double the amount healed' },
    { outcome: 'Failure',          result: 'No healing' },
    { outcome: 'Critical Failure', result: 'Lose 1d10 Health' },
  ];

  msCombatSequence = [
    { step: '1', action: 'Check for Surprise', detail: 'Surprised crew: Fear save or stunned 1 round' },
    { step: '2', action: 'Speed Check',         detail: 'Pass = act before enemies; crit success = extra action; crit fail = 1 action' },
    { step: '3', action: 'Take 2 Actions',      detail: 'Significant: attack, bandage, reload, run; Insignificant: talk, look, cover' },
    { step: '4', action: 'Attack (Ranged)',      detail: 'Attacker: Combat check vs. defender Armor save (opposed). Win = roll damage' },
    { step: '5', action: 'Attack (CQC)',         detail: 'Attacker: Combat check. Defender chooses: Armor save / Combat counter / Body to flee' },
    { step: '6', action: 'Damage Triggers',      detail: 'Panic if: critical hit OR > ½ max HP in one hit' },
  ];

  msXpTable = [
    { level: 0, xp: 0   }, { level: 1, xp: 10  }, { level: 2, xp: 25  }, { level: 3, xp: 50  },
    { level: 4, xp: 75  }, { level: 5, xp: 125 }, { level: 6, xp: 175 }, { level: 7, xp: 225 },
    { level: 8, xp: 300 }, { level: 9, xp: 375 }, { level: 10, xp: 500 },
  ];

  // ─── Basic Role-Playing Data ─────────────────────────────────────────────────

  brpCombatSequence = [
    { step: '1', action: 'Statement of Intent',  detail: 'Everyone declares actions; a stated action may be aborted but not substituted' },
    { step: '2', action: 'Movement',             detail: 'Non-engaged characters move (24m/round, 36m 4-legged); movers can\'t fight until next round' },
    { step: '3', action: 'Resolution',           detail: 'Missiles first, then hand combat in descending DEX order; killed/KO\'d before acting = no attack' },
    { step: '4', action: 'Bookkeeping',          detail: 'Record damage, healing, and successful skill use (for experience checks)' },
  ];

  brpCharacteristicRolls = [
    { roll: 'Idea',       formula: 'INT × 5', use: 'Realize something the character would know (referee may lower the multiplier)' },
    { roll: 'Luck',       formula: 'POW × 5', use: 'Avoid mischance — land safely from a fall, be in the right place' },
    { roll: 'Dodge',      formula: 'DEX × 5', use: 'Dive out of the way of a seen threat (thrown/missile weapons, charges)' },
    { roll: 'Persuasion', formula: 'CHA × 5', use: 'Talk your way in or out (CHA × 3 if the listener is suspicious)' },
  ];

  brpSkills = [
    { skill: 'Climbing', pct: '55%' },
    { skill: 'Hide', pct: '55%' },
    { skill: 'Jumping', pct: '45%' },
    { skill: 'Throw', pct: '45%' },
    { skill: 'Listening', pct: '45%' },
    { skill: 'First Aid', pct: '45%' },
    { skill: 'Spot Hidden Item', pct: '25%' },
    { skill: 'Move Quietly', pct: '25%' },
  ];

  brpWeapons = [
    { name: 'Fist',           type: 'Natural',   pct: '50%', dmg: '1d3',   breakage: '—', note: 'Poor vs. armor' },
    { name: 'Mace',           type: 'Hand',      pct: '30%', dmg: '1d6+2', breakage: '20', note: 'Any blunt instrument (coal shovel, big stick)' },
    { name: 'Axe',            type: 'Hand',      pct: '25%', dmg: '1d8+2', breakage: '15', note: 'Most damage of the hand weapons' },
    { name: '2-Handed Spear', type: 'Thrusting', pct: '25%', dmg: '1d8+1', breakage: '15', note: 'Impales; 2nd rank; attack+parry or parry ×2' },
    { name: 'Sword',          type: 'Hand',      pct: '15%', dmg: '1d8+1', breakage: '20', note: 'Durable but hardest to learn' },
    { name: 'Rock',           type: 'Thrown',    pct: '45%', dmg: '1d4',   breakage: '—', note: 'Weak vs. any armor' },
    { name: 'Javelin',        type: 'Thrown',    pct: '20%', dmg: '1d10',  breakage: '—', note: 'Impales' },
    { name: 'Bow',            type: 'Missile',   pct: '10%', dmg: '1d6+1', breakage: '—', note: 'Impales; best range' },
    { name: 'Shield',         type: 'Parry only',pct: '25%', dmg: '—',     breakage: 'Never breaks', note: 'Blocks 12 points on a successful parry' },
  ];

  brpArmor = [
    { type: 'Leather',   points: 2, notes: 'Jerkin, leggings, hood — "a heavy motorcycle jacket"' },
    { type: 'Ring Mail', points: 4, notes: 'Can be worn over leather for 6 points total' },
    { type: 'Plate',     points: 6, notes: 'The best armor available' },
    { type: 'Shield',    points: 12, notes: 'Only on a successful parry; blocks before armor applies' },
  ];

  brpResolutionMatrix = [
    { attack: 'Hits',   parry: 'Misses', result: 'Defender takes damage (armor subtracts its points)' },
    { attack: 'Hits',   parry: 'Parries', result: 'No damage to defender; a parrying weapon takes the rolled damage toward breakage' },
    { attack: 'Misses', parry: 'Parries', result: 'No damage' },
    { attack: 'Misses', parry: 'Misses', result: 'No damage' },
  ];

  brpCombatNotes = [
    { rule: 'Rear attack',       effect: '+20% to hit; target cannot parry attacks from a foe they\'ve turned away from' },
    { rule: 'Impale (spear/javelin/arrow)', effect: 'Attack roll ≤ 20% of skill → rolled damage + weapon maximum; weapon sticks (full round + D100 ≤ impale ×2 to pull free)' },
    { rule: 'Two parries',       effect: 'With weapon + shield a character may parry twice instead of attacking; one shield parry per round' },
    { rule: 'Thrown/missile',    effect: 'Cannot be parried — only dodged (DEX × 5); resolved before hand combat' },
    { rule: 'Changing weapons',  effect: 'Takes a full melee round; may still shield-parry or dodge' },
    { rule: 'Resistance Table',  effect: 'Active vs. passive characteristic: 50% + (active − passive) × 5% chance of success' },
  ];

  brpDamageRules = [
    { rule: 'Hit Points',   effect: 'HP = CON; no penalty for cumulative damage above 1 HP' },
    { rule: 'Unconscious',  effect: 'At 1 HP or less; will not wake naturally — needs tending or First Aid' },
    { rule: 'Death',        effect: 'Damage exceeding total HP kills the character' },
    { rule: 'Falling',      effect: '~1d6 per 2 meters (4m fall = 2d6); Jumping or Luck roll may avoid' },
    { rule: 'Healing',      effect: '1 HP per game week; healing potions restore up to 5 points' },
  ];

  brpExperience = [
    { step: '1', detail: 'After the adventure, list each skill used successfully during play (marked when it happened)' },
    { step: '2', detail: 'Learning threshold = 100 − current skill %' },
    { step: '3', detail: 'Roll D100 ≤ threshold → add 5% to the skill; otherwise no change' },
    { step: '4', detail: 'One check per skill per adventure; attack and parry advance separately; characteristic rolls never improve' },
  ];
}
