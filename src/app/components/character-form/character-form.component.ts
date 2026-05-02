import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Character, CharacterStats, CharacterSkills, ArmorLocations, Weapon, WeaponDefinition, Shield, ShieldDefinition, Passion, Spell, RuneSpell,
  DEFAULT_STATS, DEFAULT_SKILLS, DEFAULT_HIT_LOCATIONS, DEFAULT_BACKGROUND, DEFAULT_DERIVED_STATS,
  DEFAULT_ARMOR, DEFAULT_RUNES, DEFAULT_MAGIC, DEFAULT_RESOURCES, DEFAULT_CULT_STATUS,
  calculateHitLocations, calculateDerivedStats, calculateTotalArmor, WEAPON_LIST, SHIELD_LIST, COMBAT_SKILLS,
  CULTS, HOMELANDS, OCCUPATIONS, COMMON_PASSIONS, SPIRIT_MAGIC_SPELLS, SORCERY_SPELLS, ARMOR_TYPES,
  applySkillBonuses, enforceOpposedRunes, RUNE_SPELL_LIBRARY, OPPOSED_ELEMENTAL_RUNES, OPPOSED_POWER_RUNES,
  initializeSkillsWithModifiers, calculateSkillCategoryModifiers
} from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { DiceService } from '../../services/dice.service';
import { GameSystemService } from '../../services/game-system.service';
import { UIStateService } from '../../services/ui-state.service';
import { FANTASY_NAMES, SKILL_CATEGORIES, CULT_RANKS } from '../../constants';
import { CHARACTER_COLORS } from '../../constants/character-colors.constants';
import { CharacterBackground } from '../character-background/character-background';
import { CharacterCharacteristics } from '../character-characteristics/character-characteristics';
import { CharacterSkills as CharacterSkillsComponent } from '../character-skills/character-skills';
import { CharacterDerivedStats } from '../character-derived-stats/character-derived-stats';
import { CharacterHitLocations } from '../character-hit-locations/character-hit-locations';
import { CharacterArmor } from '../character-armor/character-armor';
import { CharacterShields } from '../character-shields/character-shields';
import { CharacterWeapons } from '../character-weapons/character-weapons';
import { CharacterRunes } from '../character-runes/character-runes';
import { CharacterCultStatus } from '../character-cult-status/character-cult-status';
import { CharacterPassions } from '../character-passions/character-passions';
import { CharacterMagic } from '../character-magic/character-magic';
import { CharacterResources } from '../character-resources/character-resources';
import { CharacterEquipment } from '../character-equipment/character-equipment';
import { CharacterNotes } from '../character-notes/character-notes';
import { CharacterConditions } from '../character-conditions/character-conditions';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CharacterBackground,
    CharacterCharacteristics,
    CharacterSkillsComponent,
    CharacterDerivedStats,
    CharacterHitLocations,
    CharacterArmor,
    CharacterShields,
    CharacterWeapons,
    CharacterRunes,
    CharacterCultStatus,
    CharacterPassions,
    CharacterMagic,
    CharacterResources,
    CharacterEquipment,
    CharacterNotes,
    CharacterConditions
  ],
  templateUrl: './character-form.component.html',
  styleUrl: './character-form.component.css'
})
export class CharacterFormComponent implements OnInit {
  character: Partial<Character> = {
    name: '',
    background: { ...DEFAULT_BACKGROUND },
    stats: { ...DEFAULT_STATS },
    derivedStats: { ...DEFAULT_DERIVED_STATS },
    skills: { ...DEFAULT_SKILLS },
    hitLocations: { ...DEFAULT_HIT_LOCATIONS },
    armor: { ...DEFAULT_ARMOR },
    shields: [],
    weapons: [],
    runes: JSON.parse(JSON.stringify(DEFAULT_RUNES)),
    passions: [],
    magic: {
      spiritMagic: [],
      runeMagic: [],
      sorcery: [],
      runePoints: 0
    },
    resources: { ...DEFAULT_RESOURCES },
    equipment: [],
    notes: '',
    conditions: [],
    cultStatus: { ...DEFAULT_CULT_STATUS }
  };

  skillCategories = SKILL_CATEGORIES;
  weaponList = WEAPON_LIST;
  shieldList = SHIELD_LIST;
  combatSkills = COMBAT_SKILLS;
  characterColors = CHARACTER_COLORS;
  cults = CULTS;
  homelands = HOMELANDS;
  occupations = OCCUPATIONS;
  commonPassions = COMMON_PASSIONS;
  spiritMagicSpells = SPIRIT_MAGIC_SPELLS;
  sorcerySpells = SORCERY_SPELLS;
  armorTypes = ARMOR_TYPES;
  runeSpellLibrary = RUNE_SPELL_LIBRARY;
  opposedElementalRunes = OPPOSED_ELEMENTAL_RUNES;
  opposedPowerRunes = OPPOSED_POWER_RUNES;

  editMode = false;
  editingId: string | null = null;
  showValidationErrors = false;
  validationErrorList: string[] = [];

  // Track which fields have been randomized for success styling
  randomizedFields = new Set<string>();

  // Track shield armor to properly calculate changes
  lastShieldArmor: ArmorLocations | null = null;

  cultRanks = CULT_RANKS;
  fantasyNames = FANTASY_NAMES;

  constructor(
    private characterService: CharacterService,
    private diceService: DiceService,
    private router: Router,
    private route: ActivatedRoute,
    public gameSystemService: GameSystemService,
    public uiStateService: UIStateService
  ) {}

  toggleSection(sectionId: string): void {
    this.uiStateService.toggleSection(sectionId);
  }

  isSectionCollapsed(sectionId: string): boolean {
    return this.uiStateService.isSectionCollapsed(sectionId);
  }

  ngOnInit(): void {
    // Check if we're editing an existing character
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.editCharacter(params['id']);
      }
    });
  }

  saveCharacter(): void {
    const missingFields = this.validateCharacter();
    if (missingFields.length > 0) {
      this.showValidationErrors = true;
      this.validationErrorList = missingFields;
      this.scrollToFirstError();
      return;
    }

    // Clear validation errors if save is successful
    this.showValidationErrors = false;
    this.validationErrorList = [];

    // Apply skill category modifiers based on final characteristic values
    const skillsWithModifiers = this.character.stats
      ? initializeSkillsWithModifiers(this.character.stats, this.character.skills!)
      : this.character.skills!;

    const characterData: Character = {
      id: this.editMode && this.editingId ? this.editingId : '',
      name: this.character.name!,
      color: this.character.color,
      background: this.character.background!,
      stats: this.character.stats!,
      derivedStats: this.character.derivedStats!,
      skills: skillsWithModifiers,
      hitLocations: this.character.hitLocations!,
      armor: this.character.armor!,
      shields: this.character.shields,
      weapons: this.character.weapons!,
      runes: this.character.runes!,
      passions: this.character.passions!,
      magic: this.character.magic!,
      resources: this.character.resources!,
      equipment: this.character.equipment!,
      notes: this.character.notes!,
      cultStatus: this.character.cultStatus
    };

    if (this.editMode && this.editingId) {
      this.characterService.updateCharacter(characterData);
    } else {
      this.characterService.addCharacter(characterData);
    }

    this.resetForm();
    this.router.navigate(this.gameSystemService.link('characters'));
  }

  editCharacter(id: string): void {
    const character = this.characterService.getCharacter(id);
    if (character) {
      this.character = {
        name: character.name,
        color: character.color,
        background: { ...character.background },
        stats: { ...character.stats },
        derivedStats: { ...character.derivedStats },
        skills: { ...character.skills },
        hitLocations: { ...character.hitLocations },
        armor: { ...character.armor },
        shields: character.shields ? [...character.shields.map(s => ({ ...s }))] : [],
        weapons: character.weapons ? [...character.weapons.map(w => ({ ...w }))] : [],
        runes: JSON.parse(JSON.stringify(character.runes)),
        passions: character.passions ? [...character.passions.map(p => ({ ...p }))] : [],
        magic: {
          spiritMagic: character.magic?.spiritMagic ? [...character.magic.spiritMagic.map(s => ({ ...s }))] : [],
          runeMagic: character.magic?.runeMagic ? [...character.magic.runeMagic.map(s => ({ ...s }))] : [],
          sorcery: character.magic?.sorcery ? [...character.magic.sorcery.map(s => ({ ...s }))] : [],
          runePoints: character.magic?.runePoints || 0
        },
        resources: { ...character.resources },
        equipment: character.equipment ? [...character.equipment] : [],
        notes: character.notes || '',
        cultStatus: character.cultStatus ? {
          ...character.cultStatus,
          runeSpells: [...(character.cultStatus.runeSpells || [])]
        } : { ...DEFAULT_CULT_STATUS }
      };
      this.editingId = id;
      this.editMode = true;
      this.updateArmorFromShields();

      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  rollD20(stat: keyof CharacterStats): void {
    if (this.character.stats) {
      this.character.stats[stat] = this.diceService.rollD20();
    }
  }

  roll3D6(stat: keyof CharacterStats): void {
    if (this.character.stats) {
      this.character.stats[stat] = this.diceService.roll3D6Configured();
      this.randomizedFields.add(stat.toLowerCase());
    }
  }

  rollPercentile(stat: keyof CharacterStats): void {
    if (this.character.stats) {
      this.character.stats[stat] = this.diceService.rollPercentile();
    }
  }

  rollAll3D6(): void {
    if (this.character.stats) {
      this.character.stats.STR = this.diceService.roll3D6Configured();
      this.character.stats.CON = this.diceService.roll3D6Configured();
      this.character.stats.SIZ = this.diceService.roll3D6Configured();
      this.character.stats.DEX = this.diceService.roll3D6Configured();
      this.character.stats.INT = this.diceService.roll3D6Configured();
      this.character.stats.POW = this.diceService.roll3D6Configured();
      this.character.stats.CHA = this.diceService.roll3D6Configured();
      this.calculateDerivedValues();

      // Mark all stats as randomized
      this.randomizedFields.add('str');
      this.randomizedFields.add('con');
      this.randomizedFields.add('siz');
      this.randomizedFields.add('dex');
      this.randomizedFields.add('int');
      this.randomizedFields.add('pow');
      this.randomizedFields.add('cha');
    }
  }

  randomizeCharacter(): void {
    // Only for new characters, not editing
    if (this.editMode) return;

    // Randomly select a character name from the fantasy names list
    const randomNameIndex = Math.floor(Math.random() * this.fantasyNames.length);
    this.character.name = this.fantasyNames[randomNameIndex];
    this.randomizedFields.add('name');

    // Randomize all stats
    this.rollAll3D6();

    // Get dynamic lists based on current game system
    const cults = this.gameSystemService.getCults();
    const occupations = this.gameSystemService.getOccupations();
    const homelands = this.gameSystemService.getHomelands();

    // Randomly select cult/belief
    if (this.character.background) {
      const randomCultIndex = Math.floor(Math.random() * cults.length);
      this.character.background.cult = cults[randomCultIndex];
      this.randomizedFields.add('cult');

      // Randomly select occupation/profession
      const randomOccIndex = Math.floor(Math.random() * occupations.length);
      this.character.background.occupation = occupations[randomOccIndex];
      this.randomizedFields.add('occupation');

      // Randomly select homeland/kin
      const randomHomelandIndex = Math.floor(Math.random() * homelands.length);
      this.character.background.homeland = homelands[randomHomelandIndex];
      this.randomizedFields.add('homeland');

      // Update cult status to match selected cult
      this.onCultChange();
    }

    // Clear validation errors since we're populating required fields
    this.dismissValidationErrors();
  }

  calculateHitPoints(): void {
    if (this.character.stats && this.character.hitLocations) {
      this.character.hitLocations = calculateHitLocations(
        this.character.stats.CON,
        this.character.stats.SIZ
      );
    }
  }

  calculateDerivedValues(): void {
    if (this.character.stats) {
      this.character.derivedStats = calculateDerivedStats(this.character.stats, this.character.equipment || [], this.character.weapons || [], this.character.shields || []);
      this.calculateHitPoints();
    }
  }

  addWeapon(): void {
    if (!this.character.weapons) {
      this.character.weapons = [];
    }
    const firstWeapon = this.weaponList[0];
    this.character.weapons.push({
      name: firstWeapon.name,
      damage: firstWeapon.damage,
      skill: firstWeapon.defaultSkill,
      currentHitPoints: firstWeapon.hitPoints
    });
  }

  removeWeapon(index: number): void {
    if (this.character.weapons) {
      this.character.weapons.splice(index, 1);
    }
  }

  onWeaponChange(index: number): void {
    if (!this.character.weapons) return;

    const weapon = this.character.weapons[index];
    const weaponDef = this.weaponList.find(w => w.name === weapon.name);

    if (weaponDef) {
      weapon.damage = weaponDef.damage;
      weapon.skill = weaponDef.defaultSkill;
      weapon.currentHitPoints = weaponDef.hitPoints;
    }
  }

  addShield(): void {
    if (!this.character.shields) {
      this.character.shields = [];
    }
    const firstShield = this.shieldList[0];
    this.character.shields.push({
      name: firstShield.name,
      skill: 'Shield',
      currentHitPoints: firstShield.hitPoints
    });
    this.updateArmorFromShields();
  }

  removeShield(index: number): void {
    if (this.character.shields) {
      this.character.shields.splice(index, 1);
      this.updateArmorFromShields();
    }
  }

  onShieldChange(index: number): void {
    if (!this.character.shields) return;

    const shield = this.character.shields[index];
    const shieldDef = this.shieldList.find(s => s.name === shield.name);

    if (shieldDef) {
      shield.currentHitPoints = shieldDef.hitPoints;
    }
    this.updateArmorFromShields();
  }

  private updateArmorFromShields(): void {
    // Calculate total armor from worn armor + shields
    this.character.armor = calculateTotalArmor(this.character.armorType, this.character.shields || []);
  }

  onArmorTypeChange(armorType: string): void {
    this.character.armorType = armorType;
    this.updateArmorFromShields();
  }

  getSkillKeys(category: string): string[] {
    return this.skillCategories[category as keyof typeof this.skillCategories] || [];
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.skillCategories);
  }

  getHitLocationKeys(): string[] {
    return ['Right Leg', 'Left Leg', 'Abdomen', 'Chest', 'Right Arm', 'Left Arm', 'Head'];
  }

  getRuneKeys(type: 'elemental' | 'power' | 'form'): string[] {
    if (!this.character.runes) return [];
    return Object.keys(this.character.runes[type]);
  }

  addPassion(): void {
    if (!this.character.passions) {
      this.character.passions = [];
    }
    this.character.passions.push({ name: '', value: 60 });
  }

  removePassion(index: number): void {
    if (this.character.passions) {
      this.character.passions.splice(index, 1);
    }
  }

  addSpell(type: 'spiritMagic' | 'sorcery'): void {
    if (!this.character.magic) return;
    this.character.magic[type].push({ name: '', points: 1 });
  }

  removeSpell(type: 'spiritMagic' | 'sorcery', index: number): void {
    if (this.character.magic) {
      this.character.magic[type].splice(index, 1);
    }
  }

  addEquipment(item: import('../../models/character.model').EquipmentItem): void {
    if (!this.character.equipment) {
      this.character.equipment = [];
    }
    this.character.equipment.push(item);
    this.calculateDerivedValues();
  }

  removeEquipment(index: number): void {
    if (this.character.equipment) {
      this.character.equipment.splice(index, 1);
      this.calculateDerivedValues();
    }
  }

  applyArmorToAll(): void {
    if (!this.character.armor) return;
    const armorValue = this.character.armor['Chest'];
    const locations = this.getHitLocationKeys();
    locations.forEach(loc => {
      if (this.character.armor) {
        this.character.armor[loc] = armorValue;
      }
    });
  }

  applyAllSkillBonuses(): void {
    if (!this.character.skills || !this.character.background) return;

    this.character.skills = applySkillBonuses(
      DEFAULT_SKILLS,
      this.character.background.occupation,
      this.character.background.homeland,
      this.character.background.cult
    );
  }

  onRuneChange(): void {
    if (!this.character.runes) return;
    this.character.runes = enforceOpposedRunes(this.character.runes);
  }

  addRuneSpell(): void {
    if (!this.character.magic) return;

    // If cult is selected and has spells in library, use first spell as template
    if (this.character.background?.cult) {
      const cultSpells = this.runeSpellLibrary[this.character.background.cult];
      if (cultSpells && cultSpells.length > 0) {
        this.character.magic.runeMagic.push({ ...cultSpells[0] });
        return;
      }
    }

    // Default rune spell (no cult or cult not in library)
    this.character.magic.runeMagic.push({
      name: '',
      runePointCost: 1,
      associatedRune: 'Air',
      reusable: true
    });
  }

  removeRuneSpell(index: number): void {
    if (this.character.magic) {
      this.character.magic.runeMagic.splice(index, 1);
    }
  }

  getAvailableRuneSpells(): RuneSpell[] {
    if (!this.character.background?.cult) return [];
    return this.runeSpellLibrary[this.character.background.cult] || [];
  }

  onCultChange(): void {
    if (!this.character.cultStatus || !this.character.background) return;
    this.character.cultStatus.cultName = this.character.background.cult;
  }

  getOpposedRuneValue(rune: string, type: 'elemental' | 'power'): number {
    if (!this.character.runes) return 0;

    const opposedPairs = type === 'elemental' ? this.opposedElementalRunes : this.opposedPowerRunes;

    for (const [rune1, rune2] of opposedPairs) {
      if (rune === rune1) {
        return 100 - (this.character.runes[type][rune2] || 0);
      }
      if (rune === rune2) {
        return 100 - (this.character.runes[type][rune1] || 0);
      }
    }
    return 0;
  }

  // Helper methods to determine if value is custom
  isCustomPassion(name: string): boolean {
    // Show custom input if name is empty (Custom selected) OR not in predefined list
    return !name || !this.commonPassions.includes(name);
  }

  isCustomSpell(name: string, type: 'spirit' | 'sorcery'): boolean {
    // Show custom input if name is empty (Custom selected) OR not in predefined list
    const list = type === 'spirit' ? this.spiritMagicSpells : this.sorcerySpells;
    return !name || !list.includes(name);
  }

  getPassionDropdownValue(passion: Passion): string {
    if (this.commonPassions.includes(passion.name)) {
      return passion.name;
    }
    return '';
  }

  getSpiritSpellDropdownValue(spell: Spell): string {
    if (this.spiritMagicSpells.includes(spell.name)) {
      return spell.name;
    }
    return '';
  }

  getSorcerySpellDropdownValue(spell: Spell): string {
    if (this.sorcerySpells.includes(spell.name)) {
      return spell.name;
    }
    return '';
  }

  isCustomRuneSpell(spell: RuneSpell): boolean {
    // Show custom input if name is empty (Custom selected) OR not in predefined list
    const availableSpells = this.getAvailableRuneSpells();
    return !spell.name || !availableSpells.some(s => s.name === spell.name);
  }

  getRuneSpellDropdownValue(spell: RuneSpell): string {
    const availableSpells = this.getAvailableRuneSpells();
    if (availableSpells.some(s => s.name === spell.name)) {
      return spell.name;
    }
    return '';
  }

  validateCharacter(): string[] {
    const missing: string[] = [];

    // Required: Character name
    if (!this.character.name || this.character.name.trim() === '') {
      missing.push('- Character Name');
    }

    // Required: All characteristics must be filled
    if (this.character.stats) {
      const statNames = ['STR', 'CON', 'SIZ', 'DEX', 'INT', 'POW', 'CHA'];
      statNames.forEach(stat => {
        const value = this.character.stats![stat as keyof CharacterStats];
        if (!value || value < 1) {
          missing.push(`- ${stat} (Characteristic)`);
        }
      });
    } else {
      missing.push('- All Characteristics (STR, CON, SIZ, DEX, INT, POW, CHA)');
    }

    // Required: Background fields
    if (!this.character.background?.occupation || this.character.background.occupation.trim() === '') {
      missing.push('- Occupation');
    }
    if (!this.character.background?.homeland || this.character.background.homeland.trim() === '') {
      missing.push('- Homeland');
    }
    if (!this.character.background?.cult || this.character.background.cult.trim() === '') {
      missing.push('- Cult/Religion');
    }

    return missing;
  }

  isFieldInvalid(fieldName: string): boolean {
    switch (fieldName) {
      case 'name':
        return !this.character.name || this.character.name.trim() === '';
      case 'occupation':
        return !this.character.background?.occupation || this.character.background.occupation.trim() === '';
      case 'homeland':
        return !this.character.background?.homeland || this.character.background.homeland.trim() === '';
      case 'cult':
        return !this.character.background?.cult || this.character.background.cult.trim() === '';
      case 'stats':
        return !this.character.stats ||
               this.character.stats.STR < 1 ||
               this.character.stats.CON < 1 ||
               this.character.stats.SIZ < 1 ||
               this.character.stats.DEX < 1 ||
               this.character.stats.INT < 1 ||
               this.character.stats.POW < 1 ||
               this.character.stats.CHA < 1;
      default:
        return false;
    }
  }

  isFieldRandomized(fieldName: string): boolean {
    return this.randomizedFields.has(fieldName);
  }

  scrollToFirstError(): void {
    // Order of validation checks (top to bottom in form)
    const validationOrder = ['name', 'cult', 'occupation', 'homeland', 'stats'];

    for (const fieldName of validationOrder) {
      if (this.isFieldInvalid(fieldName)) {
        // Find the element to scroll to
        let elementId: string;

        switch (fieldName) {
          case 'name':
            elementId = 'name';
            break;
          case 'cult':
            elementId = 'cult';
            break;
          case 'occupation':
            elementId = 'occupation';
            break;
          case 'homeland':
            elementId = 'homeland';
            break;
          case 'stats':
            elementId = 'str'; // Scroll to first stat
            break;
          default:
            continue;
        }

        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the field after scrolling
          setTimeout(() => {
            element.focus();
          }, 500);
          break;
        }
      }
    }
  }

  dismissValidationErrors(): void {
    this.showValidationErrors = false;
    this.validationErrorList = [];
  }

  private resetForm(): void {
    this.character = {
      name: '',
      background: { ...DEFAULT_BACKGROUND },
      stats: { ...DEFAULT_STATS },
      derivedStats: { ...DEFAULT_DERIVED_STATS },
      skills: { ...DEFAULT_SKILLS },
      hitLocations: { ...DEFAULT_HIT_LOCATIONS },
      armor: { ...DEFAULT_ARMOR },
      shields: [],
      weapons: [],
      runes: JSON.parse(JSON.stringify(DEFAULT_RUNES)),
      passions: [],
      magic: {
        spiritMagic: [],
        runeMagic: [],
        sorcery: [],
        runePoints: 0
      },
      resources: { ...DEFAULT_RESOURCES },
      equipment: [],
      notes: '',
      cultStatus: { ...DEFAULT_CULT_STATUS }
    };
    this.editMode = false;
    this.editingId = null;
    this.showValidationErrors = false;
    this.validationErrorList = [];
    this.randomizedFields.clear();
  }
}
