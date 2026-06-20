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
}
