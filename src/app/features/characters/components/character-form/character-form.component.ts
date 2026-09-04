import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Character, CharacterStats, CharacterSkills, ArmorLocations, Weapon, WeaponDefinition, Shield, ShieldDefinition, Passion, Spell, RuneSpell,
  DEFAULT_STATS, DEFAULT_SKILLS, DEFAULT_HIT_LOCATIONS, DEFAULT_BACKGROUND, DEFAULT_DERIVED_STATS,
  DEFAULT_ARMOR, DEFAULT_RUNES, DEFAULT_MAGIC, DEFAULT_RESOURCES, DEFAULT_CULT_STATUS,
  calculateHitLocations, calculateDerivedStats, calculateTotalArmor, COMBAT_SKILLS,
  CULTS, HOMELANDS, OCCUPATIONS, COMMON_PASSIONS, SPIRIT_MAGIC_SPELLS, SORCERY_SPELLS,
  enforceOpposedRunes, RUNE_SPELL_LIBRARY, OPPOSED_ELEMENTAL_RUNES, OPPOSED_POWER_RUNES,
  initializeSkillsWithModifiers, calculateSkillCategoryModifiers,
  WEAPON_SKILLS
} from '@characters/models/character.model';
import { OsricRules } from '@shared/rules/osric-rules';
import { CharacterService } from '@characters/services/character.service';
import { DiceService } from '@shared/services/dice.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { UIStateService } from '@shared/services/ui-state.service';
import { ExportService } from '@shared/services/export.service';
import { SKILL_CATEGORIES, CULT_RANKS } from '../../constants';
import { CHARACTER_COLORS } from '@characters/constants/character-colors.constants';
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
import { CharacterConditionsComponent } from '../character-conditions/character-conditions.component';
import { CharacterAbilities } from '../character-abilities/character-abilities';
import { DB_SPELLS_BY_DISCIPLINE } from '@shared/rules/dragonbane-rules';

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
    CharacterConditionsComponent,
    CharacterAbilities
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
    armorType: undefined,
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
    acquiredAbilities: [],
    cultStatus: { ...DEFAULT_CULT_STATUS }
  };

  skillCategories = SKILL_CATEGORIES;
  get dbSkillCategories() {
    const cats: Record<string, string[]> = {};
    for (const c of this.gameSystemService.getRules().getSkillCategories()) {
      cats[c.name] = c.skills;
    }
    return cats;
  }
  get weaponList() { return this.gameSystemService.getRules().getWeaponList(); }
  get shieldList() { return this.gameSystemService.getRules().getShieldList(); }
  get currencyLabel() { return this.gameSystemService.getRules().getCurrencyLabel(); }
  get isRuneQuest(): boolean { return this.gameSystemService.getRules().usesHitLocations(); }
  get isOsric(): boolean { return this.gameSystemService.getRules().getMagicSystemType() === 'osric'; }
  get showConditions(): boolean {
    const t = this.gameSystemService.getRules().getMagicSystemType();
    return t !== 'kal-arath' && t !== 'osric' && t !== 'mothership';
  }

  get osricClassUsesMagic(): boolean {
    const rules = this.gameSystemService.getRules() as OsricRules;
    return rules.classUsesMagic?.(this.character.background?.occupation ?? '') ?? true;
  }

  get osricClassHasThiefSkills(): boolean {
    const occ = this.character.background?.occupation ?? '';
    return occ === 'Thief' || occ === 'Assassin';
  }

  // Race/class level cap (OSRIC). undefined = no cap (999 sentinel or system without caps).
  get levelCap(): number | undefined {
    const rules = this.gameSystemService.getRules();
    const race = this.character.background?.homeland ?? '';
    const className = this.character.background?.occupation ?? '';
    if (!rules.getMaxCharacterLevel || !race || !className) return undefined;
    const cap = rules.getMaxCharacterLevel(race, className);
    return cap >= 999 ? undefined : cap;
  }
  combatSkills = COMBAT_SKILLS;
  weaponSkills = WEAPON_SKILLS;
  characterColors = CHARACTER_COLORS;
  cults = CULTS;
  homelands = HOMELANDS;
  occupations = OCCUPATIONS;
  commonPassions = COMMON_PASSIONS;
  spiritMagicSpells = SPIRIT_MAGIC_SPELLS;
  sorcerySpells = SORCERY_SPELLS;
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

  constructor(
    private characterService: CharacterService,
    private diceService: DiceService,
    private router: Router,
    private route: ActivatedRoute,
    public gameSystemService: GameSystemService,
    public uiStateService: UIStateService,
    private exportService: ExportService
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
      } else {
        this.character.stats = { ...this.systemDefaultStats };
      }
    });
  }

  private get systemDefaultStats(): CharacterStats {
    return this.gameSystemService.getRules().getDefaultStats();
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

    // Only apply skill category modifiers on initial character creation, not when editing
    // (Editing characters already have modifiers applied from previous saves)
    let skillsToSave = this.character.skills!;
    if (!this.editMode) {
      skillsToSave = this.character.stats
        ? initializeSkillsWithModifiers(this.character.stats, this.character.skills!)
        : this.character.skills!;
    }

    const characterData: Character = {
      id: this.editMode && this.editingId ? this.editingId : '',
      name: this.character.name!,
      color: this.character.color,
      gameSystem: this.gameSystemService.gameSystem(),
      background: this.character.background!,
      stats: this.character.stats!,
      derivedStats: this.character.derivedStats!,
      skills: skillsToSave,
      hitLocations: this.character.hitLocations!,
      armor: this.character.armor!,
      armorType: this.character.armorType,
      shields: this.character.shields,
      weapons: this.character.weapons!,
      runes: this.character.runes!,
      passions: this.character.passions!,
      magic: this.character.magic!,
      resources: this.character.resources!,
      equipment: this.character.equipment!,
      conditions: this.character.conditions ?? [],
      acquiredAbilities: this.character.acquiredAbilities ?? [],
      notes: this.character.notes!,
      cultStatus: this.character.cultStatus,
    };

    if (this.editMode && this.editingId) {
      this.characterService.updateCharacter(characterData);
    } else {
      this.characterService.addCharacter(characterData);
    }

    this.resetForm();
    this.router.navigate(this.gameSystemService.link('characters'));
  }

  exportCharacter(): void {
    const slug = (this.character.name || 'character').toLowerCase().replace(/\s+/g, '-');
    this.exportService.download(`character-${slug}`, {
      exportedAt: new Date().toISOString(),
      characters: [this.character],
    });
  }

  editCharacter(id: string): void {
    const character = this.characterService.getCharacter(id);
    if (character) {
      if (character.gameSystem && character.gameSystem !== this.gameSystemService.gameSystem()) {
        this.router.navigate(this.gameSystemService.link('characters'));
        return;
      }
      this.character = {
        name: character.name,
        color: character.color,
        gameSystem: character.gameSystem,
        background: { ...character.background },
        stats: { ...character.stats },
        derivedStats: { ...character.derivedStats },
        skills: { ...character.skills },
        hitLocations: { ...character.hitLocations },
        armor: { ...character.armor },
        armorType: character.armorType,
        shields: character.shields ? [...character.shields.map(s => ({ ...s }))] : [],
        weapons: character.weapons ? [...character.weapons.map(w => ({ ...w }))] : [],
        runes: JSON.parse(JSON.stringify(character.runes)),
        passions: character.passions ? [...character.passions.map(p => ({ ...p }))] : [],
        magic: {
          spiritMagic: character.magic?.spiritMagic ? [...character.magic.spiritMagic.map(s => ({ ...s }))] : [],
          runeMagic: character.magic?.runeMagic ? [...character.magic.runeMagic.map(s => ({ ...s }))] : [],
          sorcery: character.magic?.sorcery ? [...character.magic.sorcery.map(s => ({ ...s }))] : [],
          runePoints: character.magic?.runePoints || 0,
          doom: character.magic?.doom || '',
          dragonbaneSpells: character.magic?.dragonbaneSpells ? [...character.magic.dragonbaneSpells.map(s => ({ ...s }))] : [],
        },
        resources: { ...character.resources },
        equipment: character.equipment ? [...character.equipment] : [],
        conditions: character.conditions ? [...character.conditions] : [],
        acquiredAbilities: character.acquiredAbilities ? [...character.acquiredAbilities] : [],
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
      this.character.stats[stat] = this.rollStatForSystem(stat);
      this.randomizedFields.add(stat.toLowerCase());
    }
  }

  // Use the system's own generation method (RQ2 2d6+6 for SIZ/INT, Dragonbane 4d6
  // drop lowest, Mothership 6d10); fall back to the app-wide configured 3d6 roll.
  private rollStatForSystem(stat: keyof CharacterStats): number {
    const rules = this.gameSystemService.getRules();
    return rules.rollStat ? rules.rollStat(stat) : this.diceService.roll3D6Configured();
  }

  rollPercentile(stat: keyof CharacterStats): void {
    if (this.character.stats) {
      this.character.stats[stat] = this.diceService.rollPercentile();
    }
  }

  rollAll3D6(): void {
    if (!this.character.stats) return;
    const visibleKeys = this.gameSystemService.getRules().getStatDefinitions()
      .filter(s => s.visible)
      .map(s => s.key);
    for (const key of visibleKeys) {
      this.character.stats[key] = this.rollStatForSystem(key);
      this.randomizedFields.add(key.toLowerCase());
    }
    this.calculateDerivedValues();
  }

  randomizeCharacter(): void {
    // Only for new characters, not editing
    if (this.editMode) return;

    const names = this.gameSystemService.getRules().getCharacterNames();
    this.character.name = names[Math.floor(Math.random() * names.length)];
    this.randomizedFields.add('name');

    // Randomize all stats (point-buy systems skip this)
    if (this.gameSystemService.getRules().canRollStats()) {
      this.rollAll3D6();
    }

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
      const rules = this.gameSystemService.getRules();
      if (rules.usesHitLocations()) {
        this.character.hitLocations = rules.calculateHitLocations(this.character.stats) ?? this.character.hitLocations;
      }
    }
  }

  onHpRolled(hp: number): void {
    if (this.character.derivedStats) {
      this.character.derivedStats.totalHitPoints = hp;
      this.character.derivedStats.maxHitPoints = hp;
    }
  }

  calculateDerivedValues(): void {
    if (this.character.stats) {
      const rules = this.gameSystemService.getRules();
      const prevHp = this.character.derivedStats?.totalHitPoints;
      const prevMaxHp = this.character.derivedStats?.maxHitPoints;
      const prevCurrentMp = this.character.derivedStats?.currentMagicPoints;

      this.character.derivedStats = rules.calculateDerivedStats(
        this.character.stats,
        this.character.equipment ?? [],
        this.character.weapons ?? [],
        this.character.shields ?? [],
        this.character.background,
        this.character.armorType
      );
      // Recalculation replaces the whole object — keep the spendable MP pool,
      // capped at the (possibly changed) max
      this.character.derivedStats.currentMagicPoints = Math.min(
        prevCurrentMp ?? this.character.derivedStats.magicPoints,
        this.character.derivedStats.magicPoints
      );
      this.calculateHitPoints();

      // OSRIC HP is rolled manually — don't overwrite a higher value with the formula default
      if (this.gameSystemService.getRules().getMagicSystemType() === 'osric' && prevHp != null && prevHp > this.character.derivedStats.totalHitPoints) {
        this.character.derivedStats.totalHitPoints = prevHp;
        this.character.derivedStats.maxHitPoints = prevMaxHp ?? prevHp;
      }
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
    if (!this.gameSystemService.getRules().usesHitLocations()) return;
    this.character.armor = calculateTotalArmor(this.character.armorType, this.character.shields || []);
  }

  onArmorTypeChange(armorType: string): void {
    this.character.armorType = armorType;
    const rules = this.gameSystemService.getRules();
    if (rules.usesHitLocations()) {
      this.updateArmorFromShields();
    } else {
      const def = rules.getArmorTypes().find(a => a.name === armorType);
      const ar = def?.points ?? 0;
      if (this.character.armor) {
        const locations = ['Right Leg', 'Left Leg', 'Abdomen', 'Chest', 'Right Arm', 'Left Arm', 'Head'] as const;
        for (const loc of locations) {
          this.character.armor[loc] = ar;
        }
      }
    }
    this.calculateDerivedValues();
  }

  getDbSkillKeys(category: string): string[] {
    return this.dbSkillCategories[category as keyof typeof this.dbSkillCategories] || [];
  }
  
  getSkillKeys(category: string): string[] {
    return this.skillCategories[category as keyof typeof this.skillCategories] || [];
  }

  getDbCategoryKeys(): string[] {
    return Object.keys(this.dbSkillCategories);
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

  addDragonbaneSpell(discipline: string): void {
    if (!this.character.magic) return;
    if (!this.character.magic.dragonbaneSpells) this.character.magic.dragonbaneSpells = [];
    const defaultName = DB_SPELLS_BY_DISCIPLINE[discipline]?.[0] ?? '';
    this.character.magic.dragonbaneSpells.push({ discipline, name: defaultName });
  }

  removeDragonbaneSpell(index: number): void {
    if (this.character.magic?.dragonbaneSpells) {
      this.character.magic.dragonbaneSpells.splice(index, 1);
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

  deductEquipmentCost(amount: number): void {
    const key = this.gameSystemService.getPrimaryCurrencyKey();
    const resources = this.character.resources as unknown as Record<string, number>;
    const current = resources[key as string] ?? 0;
    resources[key as string] = Math.max(0, current - amount);
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
    const rules = this.gameSystemService.getRules();
    this.character.skills = rules.applyBackgroundBonuses(
      rules.getDefaultSkills(),
      this.character.background,
      this.character.stats
    ) as CharacterSkills;
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

    // Required: all visible characteristics must be filled
    if (this.character.stats) {
      const visibleStats = this.gameSystemService.getRules().getStatDefinitions().filter(s => s.visible);
      const statMin = this.gameSystemService.getRules().getStatRange().min;
      visibleStats.forEach(s => {
        const value = this.character.stats![s.key];
        if (value === undefined || value === null || value < statMin) {
          missing.push(`- ${s.label} (Characteristic)`);
        }
      });
    } else {
      missing.push('- All Characteristics');
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
      case 'stats': {
        if (!this.character.stats) return true;
        const statMin = this.gameSystemService.getRules().getStatRange().min;
        return this.gameSystemService.getRules().getStatDefinitions()
          .filter(s => s.visible)
          .some(s => {
            const v = this.character.stats![s.key];
            return v === undefined || v === null || v < statMin;
          });
      }
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
      stats: { ...this.systemDefaultStats },
      derivedStats: { ...DEFAULT_DERIVED_STATS },
      skills: { ...DEFAULT_SKILLS },
      hitLocations: { ...DEFAULT_HIT_LOCATIONS },
      armor: { ...DEFAULT_ARMOR },
      armorType: undefined,
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
