export interface TranslationDictionary {
  [key: string]: string;
}

export const translations: { [locale: string]: TranslationDictionary } = {
  en: {
    // App title
    'app.title': 'Character Generator',

    // Character Form sections
    'section.background': 'Background',
    'section.familyHistory': 'Family History',
    'section.characteristics': 'Characteristics',
    'section.skills': 'Skills',
    'section.derivedStats': 'Derived Statistics',
    'section.hitLocations': 'Hit Locations',
    'section.armor': 'Armor',
    'section.weapons': 'Weapons',
    'section.runes': 'Runes',
    'section.cultStatus': 'Cult Status',
    'section.passions': 'Passions',
    'section.magic': 'Magic',
    'section.resources': 'Resources',
    'section.equipment': 'Equipment',
    'section.notes': 'Notes',

    // Buttons
    'button.save': 'Save Character',
    'button.cancel': 'Cancel',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.randomize': 'Randomize Character',
    'button.add': 'Add',
    'button.remove': 'Remove',
    'button.clear': 'Clear',
    'button.calculate': 'Calculate',
    'button.applyToAll': 'Apply to All',
    'button.applyBonuses': 'Apply Skill Bonuses',
    'button.rollAll': 'Roll All 3D6',

    // Character Form
    'form.createNew': 'Create New Character',
    'form.editCharacter': 'Edit Character',
    'form.editing': 'Editing',
    'form.characterName': 'Character Name',
    'form.requiredField': 'Required field',
    'form.randomized': 'Randomized',
    'form.characterNamePlaceholder': 'Enter character name',
    'form.randomizeHint': 'Generates random stats, cult, occupation, and homeland',

    // Validation
    'validation.title': 'Required fields missing',
    'validation.message': 'Please fill in the following required fields:',

    // Background
    'background.cult': 'Cult/Religion',
    'background.occupation': 'Occupation',
    'background.homeland': 'Homeland',
    'background.age': 'Age',
    'background.gender': 'Gender',
    'background.selectCult': 'Select Cult',
    'background.selectOccupation': 'Select Occupation',
    'background.selectHomeland': 'Select Homeland',
    'background.selectGender': 'Select Gender',
    'background.genderPlaceholder': 'Male/Female/Other',

    // Dragonbane-specific labels
    'background.kin': 'Kin (Race)',
    'background.profession': 'Profession',
    'background.belief': 'Belief',
    'background.selectKin': 'Select Kin',
    'background.selectProfession': 'Select Profession',
    'background.selectBelief': 'Select Belief',

    // Game System Toggle
    'system.toggle': 'Game System',
    'system.runequest': 'RuneQuest',
    'system.dragonbane': 'Dragonbane',

    // Family History
    'familyHistory.grandfather': 'Grandfather',
    'familyHistory.grandmother': 'Grandmother',
    'familyHistory.father': 'Father',
    'familyHistory.mother': 'Mother',
    'familyHistory.events': 'Family Events',
    'familyHistory.eventPlaceholder': 'Family event description',
    'familyHistory.namePlaceholder': 'Name',
    'familyHistory.noEvents': 'No family events recorded.',

    // Characteristics
    'char.str': 'STR (Strength)',
    'char.con': 'CON (Constitution)',
    'char.siz': 'SIZ (Size)',
    'char.dex': 'DEX (Dexterity)',
    'char.int': 'INT (Intelligence)',
    'char.pow': 'POW (Power)',
    'char.cha': 'CHA (Charisma)',

    // Dragonbane characteristics
    'char.agl': 'AGL (Agility)',
    'char.wil': 'WIL (Willpower)',

    // Derived Stats
    'derived.hitPoints': 'Hit Points',
    'derived.magicPoints': 'Magic Points',
    'derived.damageBonus': 'Damage Bonus',
    'derived.spiritCombatDamage': 'Spirit Combat Damage',
    'derived.healingRate': 'Healing Rate',
    'derived.moveRate': 'Move Rate',
    'derived.strikeRank': 'Strike Rank',

    // Hit Locations
    'hitLoc.rightLeg': 'Right Leg',
    'hitLoc.leftLeg': 'Left Leg',
    'hitLoc.abdomen': 'Abdomen',
    'hitLoc.chest': 'Chest',
    'hitLoc.rightArm': 'Right Arm',
    'hitLoc.leftArm': 'Left Arm',
    'hitLoc.head': 'Head',

    // Armor
    'armor.type': 'Armor Type',
    'armor.selectType': 'Select Armor Type',

    // Weapons
    'weapons.name': 'Weapon Name',
    'weapons.damage': 'Damage',
    'weapons.skill': 'Skill',
    'weapons.selectWeapon': 'Select Weapon',
    'weapons.noWeapons': 'No weapons',

    // Runes
    'runes.elemental': 'Elemental Runes',
    'runes.power': 'Power/Form Runes',
    'runes.form': 'Form Runes',
    'runes.opposed': 'Opposed',

    // Cult Status
    'cult.name': 'Cult Name',
    'cult.rank': 'Rank',
    'cult.selectRank': 'Select Rank',
    'cult.runePoints': 'Rune Points',
    'cult.ranimar': 'Ranimar',
    'cult.runeSpells': 'Rune Spells',
    'cult.spellName': 'Spell Name',
    'cult.cost': 'Cost',
    'cult.rune': 'Rune',
    'cult.reusable': 'Reusable',
    'cult.selectSpell': 'Select Spell',
    'cult.custom': 'Custom',

    // Passions
    'passion.name': 'Passion Name',
    'passion.value': 'Value',
    'passion.select': 'Select Passion',
    'passion.custom': 'Custom',
    'passion.customPlaceholder': 'Enter custom passion',

    // Magic
    'magic.spiritMagic': 'Spirit Magic',
    'magic.runeMagic': 'Rune Magic',
    'magic.sorcery': 'Sorcery',
    'magic.spellName': 'Spell Name',
    'magic.points': 'Points',
    'magic.selectSpell': 'Select Spell',
    'magic.custom': 'Custom',

    // Resources
    'resources.income': 'Income',
    'resources.ransom': 'Ransom',
    'resources.reputation': 'Reputation',

    // Equipment
    'equipment.itemPlaceholder': 'Equipment item',

    // Notes
    'notes.placeholder': 'Additional notes about the character...',

    // Dice Roller
    'diceRoller.title': 'Dice Roller',
    'diceRoller.history': 'Roll History',
    'diceRoller.currentResult': 'Current Result',

    // Character List
    'characterList.title': 'Runequest Characters',
    'characterList.noCharacters': 'No characters yet. Create your first character below!',
    'characterList.characteristics': 'Characteristics',
    'characterList.hitLocations': 'Hit Locations',
    'characterList.weapons': 'Weapons',
    'characterList.deleteConfirm': 'Are you sure you want to delete this character?',

    // Skills
    'skills.category': 'Category',
    'skills.agility': 'Agility',
    'skills.communication': 'Communication',
    'skills.knowledge': 'Knowledge',
    'skills.magic': 'Magic',
    'skills.manipulation': 'Manipulation',
    'skills.perception': 'Perception',
    'skills.stealth': 'Stealth',
  },
  sv: {
    // App title
    'app.title': 'Karaktärsgenerator',

    // Character Form sections
    'section.background': 'Bakgrund',
    'section.familyHistory': 'Familjehistoria',
    'section.characteristics': 'Egenskaper',
    'section.skills': 'Färdigheter',
    'section.derivedStats': 'Härledda Statistik',
    'section.hitLocations': 'Träffytor',
    'section.armor': 'Rustning',
    'section.weapons': 'Vapen',
    'section.runes': 'Runor',
    'section.cultStatus': 'Kultstatus',
    'section.passions': 'Passioner',
    'section.magic': 'Magi',
    'section.resources': 'Resurser',
    'section.equipment': 'Utrustning',
    'section.notes': 'Anteckningar',

    // Buttons
    'button.save': 'Spara Karaktär',
    'button.cancel': 'Avbryt',
    'button.edit': 'Redigera',
    'button.delete': 'Ta bort',
    'button.randomize': 'Slumpa Karaktär',
    'button.add': 'Lägg till',
    'button.remove': 'Ta bort',
    'button.clear': 'Rensa',
    'button.calculate': 'Beräkna',
    'button.applyToAll': 'Applicera på Alla',
    'button.applyBonuses': 'Applicera Färdighetsbonusar',
    'button.rollAll': 'Slå Alla 3T6',

    // Character Form
    'form.createNew': 'Skapa Ny Karaktär',
    'form.editCharacter': 'Redigera Karaktär',
    'form.editing': 'Redigerar',
    'form.characterName': 'Karaktärsnamn',
    'form.requiredField': 'Obligatoriskt fält',
    'form.randomized': 'Slumpad',
    'form.characterNamePlaceholder': 'Ange karaktärsnamn',
    'form.randomizeHint': 'Genererar slumpmässiga egenskaper, kult, yrke och hemland',

    // Validation
    'validation.title': 'Obligatoriska fält saknas',
    'validation.message': 'Vänligen fyll i följande obligatoriska fält:',

    // Background
    'background.cult': 'Kult/Religion',
    'background.occupation': 'Yrke',
    'background.homeland': 'Hemland',
    'background.age': 'Ålder',
    'background.gender': 'Kön',
    'background.selectCult': 'Välj Kult',
    'background.selectOccupation': 'Välj Yrke',
    'background.selectHomeland': 'Välj Hemland',
    'background.selectGender': 'Välj Kön',
    'background.genderPlaceholder': 'Man/Kvinna/Annat',

    // Dragonbane-specific labels
    'background.kin': 'Folkslag',
    'background.profession': 'Yrke',
    'background.belief': 'Tro',
    'background.selectKin': 'Välj Folkslag',
    'background.selectProfession': 'Välj Yrke',
    'background.selectBelief': 'Välj Tro',

    // Game System Toggle
    'system.toggle': 'Spelsystem',
    'system.runequest': 'RuneQuest',
    'system.dragonbane': 'Dragonbane',

    // Family History
    'familyHistory.grandfather': 'Farfar',
    'familyHistory.grandmother': 'Farmor',
    'familyHistory.father': 'Far',
    'familyHistory.mother': 'Mor',
    'familyHistory.events': 'Familjehändelser',
    'familyHistory.eventPlaceholder': 'Beskrivning av familjehändelse',
    'familyHistory.namePlaceholder': 'Namn',
    'familyHistory.noEvents': 'Inga familjehändelser registrerade.',

    // Characteristics
    'char.str': 'STY (Styrka)',
    'char.con': 'KON (Konstitution)',
    'char.siz': 'STO (Storlek)',
    'char.dex': 'SMI (Smidighet)',
    'char.int': 'INT (Intelligens)',
    'char.pow': 'MAK (Makt)',
    'char.cha': 'KAR (Karisma)',

    // Dragonbane characteristics
    'char.agl': 'SMI (Smidighet)',
    'char.wil': 'VIL (Vilja)',

    // Derived Stats
    'derived.hitPoints': 'Kroppspoäng',
    'derived.magicPoints': 'Magipoäng',
    'derived.damageBonus': 'Skadebonus',
    'derived.spiritCombatDamage': 'Andestridsskada',
    'derived.healingRate': 'Läkningshastighet',
    'derived.moveRate': 'Rörelsehastighet',
    'derived.strikeRank': 'Slagrad',

    // Hit Locations
    'hitLoc.rightLeg': 'Höger Ben',
    'hitLoc.leftLeg': 'Vänster Ben',
    'hitLoc.abdomen': 'Buk',
    'hitLoc.chest': 'Bröstkorg',
    'hitLoc.rightArm': 'Höger Arm',
    'hitLoc.leftArm': 'Vänster Arm',
    'hitLoc.head': 'Huvud',

    // Armor
    'armor.type': 'Rustningstyp',
    'armor.selectType': 'Välj Rustningstyp',

    // Weapons
    'weapons.name': 'Vapennamn',
    'weapons.damage': 'Skada',
    'weapons.skill': 'Färdighet',
    'weapons.selectWeapon': 'Välj Vapen',
    'weapons.noWeapons': 'Inga vapen',

    // Runes
    'runes.elemental': 'Elementrunor',
    'runes.power': 'Makt/Formrunor',
    'runes.form': 'Formrunor',
    'runes.opposed': 'Motsatt',

    // Cult Status
    'cult.name': 'Kultnamn',
    'cult.rank': 'Rang',
    'cult.selectRank': 'Välj Rang',
    'cult.runePoints': 'Runpoäng',
    'cult.ranimar': 'Ranimar',
    'cult.runeSpells': 'Runbesvärjelser',
    'cult.spellName': 'Besvärjelsens Namn',
    'cult.cost': 'Kostnad',
    'cult.rune': 'Runa',
    'cult.reusable': 'Återanvändbar',
    'cult.selectSpell': 'Välj Besvärjelse',
    'cult.custom': 'Anpassad',

    // Passions
    'passion.name': 'Passionsnamn',
    'passion.value': 'Värde',
    'passion.select': 'Välj Passion',
    'passion.custom': 'Anpassad',
    'passion.customPlaceholder': 'Ange anpassad passion',

    // Magic
    'magic.spiritMagic': 'Andemagi',
    'magic.runeMagic': 'Runmagi',
    'magic.sorcery': 'Trolldom',
    'magic.spellName': 'Besvärjelsens Namn',
    'magic.points': 'Poäng',
    'magic.selectSpell': 'Välj Besvärjelse',
    'magic.custom': 'Anpassad',

    // Resources
    'resources.income': 'Inkomst',
    'resources.ransom': 'Lösen',
    'resources.reputation': 'Rykte',

    // Equipment
    'equipment.itemPlaceholder': 'Utrustningsföremål',

    // Notes
    'notes.placeholder': 'Ytterligare anteckningar om karaktären...',

    // Dice Roller
    'diceRoller.title': 'Tärningskastare',
    'diceRoller.history': 'Kasthistorik',
    'diceRoller.currentResult': 'Aktuellt Resultat',

    // Character List
    'characterList.title': 'Runequest Karaktärer',
    'characterList.noCharacters': 'Inga karaktärer än. Skapa din första karaktär nedan!',
    'characterList.characteristics': 'Egenskaper',
    'characterList.hitLocations': 'Träffytor',
    'characterList.weapons': 'Vapen',
    'characterList.deleteConfirm': 'Är du säker på att du vill ta bort denna karaktär?',

    // Skills
    'skills.category': 'Kategori',
    'skills.agility': 'Rörlighet',
    'skills.communication': 'Kommunikation',
    'skills.knowledge': 'Kunskap',
    'skills.magic': 'Magi',
    'skills.manipulation': 'Manipulation',
    'skills.perception': 'Perception',
    'skills.stealth': 'Smygning',
  }
};
