import { EquipmentDefinition } from '@characters/models/character.model';

export const EQUIPMENT_DEFAULTS = {
  QUANTITY: 1,
  COST: 0,
  HIT_POINTS: 0,
  ENCUMBRANCE: 0,
};

export const MAGIC_DEFAULTS = {
  DEFAULT_RUNE: 'Air',
  DEFAULT_REUSABLE: true,
};

// ─── RuneQuest ────────────────────────────────────────────────────────────────
// Costs in Lunars (L). Encumbrance in ENC units (weighted, e.g. knife=0.25).
// hitPoints = item durability / structural HP.
export const RUNEQUEST_EQUIPMENT_LIST: EquipmentDefinition[] = [
  // Adventuring Gear
  { name: 'Backpack',         category: 'Adventuring Gear', cost: 5,  hitPoints: 4,  encumbrance: 1   },
  { name: 'Bedroll',          category: 'Adventuring Gear', cost: 3,  hitPoints: 3,  encumbrance: 1   },
  { name: 'Blanket',          category: 'Adventuring Gear', cost: 2,  hitPoints: 2,  encumbrance: 1   },
  { name: 'Canteen',          category: 'Adventuring Gear', cost: 2,  hitPoints: 2,  encumbrance: 0.5 },
  { name: 'Flint & Steel',    category: 'Adventuring Gear', cost: 1,  hitPoints: 1,  encumbrance: 0   },
  { name: 'Grappling Hook',   category: 'Adventuring Gear', cost: 5,  hitPoints: 6,  encumbrance: 1   },
  { name: 'Lantern',          category: 'Adventuring Gear', cost: 8,  hitPoints: 4,  encumbrance: 0.5 },
  { name: 'Oil Flask',        category: 'Adventuring Gear', cost: 1,  hitPoints: 1,  encumbrance: 0.5 },
  { name: 'Rope (10m)',       category: 'Adventuring Gear', cost: 3,  hitPoints: 6,  encumbrance: 1   },
  { name: 'Sack',             category: 'Adventuring Gear', cost: 1,  hitPoints: 3,  encumbrance: 0   },
  { name: 'Torch',            category: 'Adventuring Gear', cost: 1,  hitPoints: 1,  encumbrance: 0.5 },
  { name: 'Waterskin',        category: 'Adventuring Gear', cost: 2,  hitPoints: 2,  encumbrance: 0.5 },
  { name: 'Pole (3m)',        category: 'Adventuring Gear', cost: 2,  hitPoints: 6,  encumbrance: 2   },
  { name: 'Signal Whistle',   category: 'Adventuring Gear', cost: 2,  hitPoints: 1,  encumbrance: 0   },
  { name: 'Mirror (Small)',   category: 'Adventuring Gear', cost: 5,  hitPoints: 2,  encumbrance: 0   },
  { name: 'Bell',             category: 'Adventuring Gear', cost: 2,  hitPoints: 2,  encumbrance: 0   },
  { name: 'Candle',           category: 'Adventuring Gear', cost: 1,  hitPoints: 1,  encumbrance: 0   },
  { name: 'Chain (1m)',       category: 'Adventuring Gear', cost: 5,  hitPoints: 8,  encumbrance: 1   },
  // Clothing
  { name: 'Boots',            category: 'Clothing', cost: 5,  hitPoints: 6, encumbrance: 1 },
  { name: 'Cloak',            category: 'Clothing', cost: 3,  hitPoints: 4, encumbrance: 1 },
  { name: 'Common Clothes',   category: 'Clothing', cost: 3,  hitPoints: 4, encumbrance: 1 },
  { name: 'Fine Clothes',     category: 'Clothing', cost: 20, hitPoints: 4, encumbrance: 1 },
  { name: 'Gloves',           category: 'Clothing', cost: 2,  hitPoints: 3, encumbrance: 0 },
  { name: 'Hat',              category: 'Clothing', cost: 1,  hitPoints: 2, encumbrance: 0 },
  // Food & Provisions
  { name: 'Rations (1 day)',  category: 'Food & Provisions', cost: 1,  hitPoints: 1, encumbrance: 0.5 },
  { name: 'Rations (1 week)', category: 'Food & Provisions', cost: 6,  hitPoints: 1, encumbrance: 2   },
  { name: 'Ale (mug)',        category: 'Food & Provisions', cost: 1,  hitPoints: 1, encumbrance: 0.5 },
  { name: 'Wine (bottle)',    category: 'Food & Provisions', cost: 3,  hitPoints: 1, encumbrance: 0.5 },
  { name: 'Dried Meat',       category: 'Food & Provisions', cost: 2,  hitPoints: 1, encumbrance: 0.5 },
  // Tools
  { name: 'Chisel',           category: 'Tools', cost: 2,  hitPoints: 4,  encumbrance: 0.5 },
  { name: 'Crowbar',          category: 'Tools', cost: 4,  hitPoints: 10, encumbrance: 1   },
  { name: 'Hammer',           category: 'Tools', cost: 2,  hitPoints: 6,  encumbrance: 1   },
  { name: 'Pickaxe',          category: 'Tools', cost: 5,  hitPoints: 8,  encumbrance: 2   },
  { name: 'Saw',              category: 'Tools', cost: 3,  hitPoints: 6,  encumbrance: 1   },
  { name: 'Shovel',           category: 'Tools', cost: 4,  hitPoints: 6,  encumbrance: 1   },
  { name: "Thieves' Tools",   category: 'Tools', cost: 25, hitPoints: 3,  encumbrance: 0.5 },
  { name: 'Lock',             category: 'Tools', cost: 5,  hitPoints: 6,  encumbrance: 0.5 },
  { name: 'Padlock',          category: 'Tools', cost: 4,  hitPoints: 4,  encumbrance: 0.5 },
  // Medical
  { name: 'Bandages',         category: 'Medical', cost: 2,  hitPoints: 1, encumbrance: 0 },
  { name: "Healer's Kit",     category: 'Medical', cost: 10, hitPoints: 1, encumbrance: 1 },
  { name: 'Healing Herbs',    category: 'Medical', cost: 5,  hitPoints: 1, encumbrance: 0 },
  { name: 'Antidote',         category: 'Medical', cost: 10, hitPoints: 1, encumbrance: 0 },
  { name: 'Poison Antidote',  category: 'Medical', cost: 15, hitPoints: 1, encumbrance: 0 },
  // Writing & Navigation
  { name: 'Map',                  category: 'Writing & Navigation', cost: 5,  hitPoints: 1, encumbrance: 0   },
  { name: 'Compass',              category: 'Writing & Navigation', cost: 10, hitPoints: 1, encumbrance: 0   },
  { name: 'Ink',                  category: 'Writing & Navigation', cost: 2,  hitPoints: 1, encumbrance: 0   },
  { name: 'Parchment (sheet)',    category: 'Writing & Navigation', cost: 1,  hitPoints: 1, encumbrance: 0   },
  { name: 'Quill',                category: 'Writing & Navigation', cost: 1,  hitPoints: 1, encumbrance: 0   },
  { name: 'Spellbook',            category: 'Writing & Navigation', cost: 50, hitPoints: 4, encumbrance: 1   },
  // Transport & Storage
  { name: 'Saddlebags',           category: 'Transport & Storage', cost: 10,  hitPoints: 6,  encumbrance: 1 },
  { name: 'Saddlebags (Large)',   category: 'Transport & Storage', cost: 20,  hitPoints: 8,  encumbrance: 2 },
  { name: 'Cart',                 category: 'Transport & Storage', cost: 50,  hitPoints: 20, encumbrance: 0 },
  { name: 'Small Boat',           category: 'Transport & Storage', cost: 150, hitPoints: 30, encumbrance: 0 },
];

// ─── Dragonbane ───────────────────────────────────────────────────────────────
// Costs in Silver Pieces (SP); 10 CP = 1 SP, 10 SP = 1 GP.
// Encumbrance: slot count (each normal item = 1 slot; tiny items = 0).
// Max slots = STR ÷ 2, rounded up. Over limit → bane on all physical rolls.
// supply: availability rating ('Common' | 'Uncommon' | 'Rare').
// hitPoints not tracked for general gear (0); weapons/armor handled separately.
export const DRAGONBANE_EQUIPMENT_LIST: EquipmentDefinition[] = [
  // Clothes
  { name: 'Common Clothes',     category: 'Clothing', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Traveling Clothes',  category: 'Clothing', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Fine Clothes',       category: 'Clothing', cost: 20, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Cloak',              category: 'Clothing', cost: 3,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Winter Outfit',      category: 'Clothing', cost: 10, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Sleeping Fur',       category: 'Clothing', cost: 3,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  // Trade Goods
  { name: 'Rope (10m)',         category: 'Trade Goods', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Chain (3m)',         category: 'Trade Goods', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Grappling Hook',     category: 'Trade Goods', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Lantern',            category: 'Trade Goods', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Lamp Oil (flask)',   category: 'Trade Goods', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Candles (10)',       category: 'Trade Goods', cost: 1,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Torches (10)',       category: 'Trade Goods', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Rations (1 day)',    category: 'Trade Goods', cost: 0.5,hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Waterskin',          category: 'Trade Goods', cost: 1,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Blanket',            category: 'Trade Goods', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Tent (1–2 person)',  category: 'Trade Goods', cost: 20, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Map (region)',       category: 'Trade Goods', cost: 10, hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  { name: 'Ink & Quill',        category: 'Trade Goods', cost: 3,  hitPoints: 0, encumbrance: 0, supply: 'Common'   },
  { name: 'Parchment (10)',     category: 'Trade Goods', cost: 2,  hitPoints: 0, encumbrance: 0, supply: 'Common'   },
  { name: 'Spyglass',           category: 'Trade Goods', cost: 50, hitPoints: 0, encumbrance: 1, supply: 'Uncommon' },
  { name: 'Lockpicks',          category: 'Trade Goods', cost: 10, hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  // Tools
  { name: 'Climbing Gear',      category: 'Tools', cost: 15, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Fishing Rod',        category: 'Tools', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Fishing Net',        category: 'Tools', cost: 10, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Hunting Traps (3)',  category: 'Tools', cost: 10, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Shovel',             category: 'Tools', cost: 3,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Crowbar',            category: 'Tools', cost: 3,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Hammer',             category: 'Tools', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Chisel',             category: 'Tools', cost: 2,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Saw',                category: 'Tools', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  // Containers
  { name: 'Belt Pouch',         category: 'Containers', cost: 1,  hitPoints: 0, encumbrance: 0, supply: 'Common'   },
  { name: 'Backpack',           category: 'Containers', cost: 5,  hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Saddlebag',          category: 'Containers', cost: 10, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Chest (Small)',      category: 'Containers', cost: 10, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Chest (Large)',      category: 'Containers', cost: 20, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Sack',               category: 'Containers', cost: 0.5,hitPoints: 0, encumbrance: 0, supply: 'Common'   },
  // Studies & Magic
  { name: 'Grimoire (blank)',       category: 'Studies & Magic', cost: 20, hitPoints: 0, encumbrance: 1, supply: 'Uncommon' },
  { name: 'Spell Focus',            category: 'Studies & Magic', cost: 30, hitPoints: 0, encumbrance: 1, supply: 'Uncommon' },
  { name: 'Ritual Candles (10)',    category: 'Studies & Magic', cost: 10, hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  { name: 'Incense (ritual)',       category: 'Studies & Magic', cost: 5,  hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  { name: 'Healing Herbs (dose)',   category: 'Studies & Magic', cost: 5,  hitPoints: 0, encumbrance: 0, supply: 'Common'   },
  { name: 'Antidote (lethal)',      category: 'Studies & Magic', cost: 20, hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  { name: 'Antidote (other)',       category: 'Studies & Magic', cost: 10, hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  { name: 'Holy Water (vial)',      category: 'Studies & Magic', cost: 10, hitPoints: 0, encumbrance: 0, supply: 'Uncommon' },
  { name: "Physician's Kit",        category: 'Studies & Magic', cost: 30, hitPoints: 0, encumbrance: 1, supply: 'Uncommon' },
  { name: 'Alchemical Supplies',    category: 'Studies & Magic', cost: 20, hitPoints: 0, encumbrance: 1, supply: 'Uncommon' },
  // Musical Instruments
  { name: 'Lute',   category: 'Musical Instruments', cost: 30, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Flute',  category: 'Musical Instruments', cost: 10, hitPoints: 0, encumbrance: 0, supply: 'Common'   },
  { name: 'Drum',   category: 'Musical Instruments', cost: 20, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Lyre',   category: 'Musical Instruments', cost: 40, hitPoints: 0, encumbrance: 1, supply: 'Uncommon' },
  { name: 'Horn',   category: 'Musical Instruments', cost: 15, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
  { name: 'Fiddle', category: 'Musical Instruments', cost: 25, hitPoints: 0, encumbrance: 1, supply: 'Common'   },
];

// ─── OSRIC ────────────────────────────────────────────────────────────────────
// Costs in Gold Pieces (GP); 10 SP = 1 GP, 100 CP = 1 GP.
// Encumbrance in lbs. Max 150 lbs (adjusted for STR bonus).
// hitPoints = item structural HP (for item saving throws).
export const OSRIC_EQUIPMENT_LIST: EquipmentDefinition[] = [
  // Adventuring Gear
  { name: 'Backpack',               category: 'Adventuring Gear', cost: 2,  hitPoints: 4,  encumbrance: 10 },
  { name: 'Flint and Steel',        category: 'Adventuring Gear', cost: 1,  hitPoints: 1,  encumbrance: 0  },
  { name: 'Grappling Hook',         category: 'Adventuring Gear', cost: 1,  hitPoints: 6,  encumbrance: 4  },
  { name: 'Iron Spikes (dozen)',     category: 'Adventuring Gear', cost: 1,  hitPoints: 2,  encumbrance: 5  },
  { name: 'Lantern (hooded)',        category: 'Adventuring Gear', cost: 7,  hitPoints: 4,  encumbrance: 2  },
  { name: 'Lantern (bullseye)',      category: 'Adventuring Gear', cost: 12, hitPoints: 4,  encumbrance: 3  },
  { name: 'Mirror (small steel)',    category: 'Adventuring Gear', cost: 20, hitPoints: 2,  encumbrance: 1  },
  { name: 'Mirror (small silver)',   category: 'Adventuring Gear', cost: 45, hitPoints: 2,  encumbrance: 1  },
  { name: 'Pole (10 ft)',            category: 'Adventuring Gear', cost: 0,  hitPoints: 6,  encumbrance: 8  },
  { name: 'Rope (50 ft hemp)',       category: 'Adventuring Gear', cost: 1,  hitPoints: 6,  encumbrance: 10 },
  { name: 'Rope (50 ft silk)',       category: 'Adventuring Gear', cost: 10, hitPoints: 6,  encumbrance: 5  },
  { name: 'Torch',                   category: 'Adventuring Gear', cost: 0,  hitPoints: 1,  encumbrance: 1  },
  { name: 'Waterskin (3 pint)',      category: 'Adventuring Gear', cost: 1,  hitPoints: 2,  encumbrance: 1  },
  { name: 'Caltrops',               category: 'Adventuring Gear', cost: 1,  hitPoints: 2,  encumbrance: 2  },
  { name: 'Chain (per 10 ft)',       category: 'Adventuring Gear', cost: 30, hitPoints: 8,  encumbrance: 10 },
  // Clothing
  { name: 'Common Clothes',         category: 'Clothing', cost: 0,  hitPoints: 4, encumbrance: 3  },
  { name: 'Fine Clothes',           category: 'Clothing', cost: 10, hitPoints: 4, encumbrance: 3  },
  { name: 'Traveling Cloak',        category: 'Clothing', cost: 2,  hitPoints: 3, encumbrance: 2  },
  { name: 'Boots (leather)',        category: 'Clothing', cost: 3,  hitPoints: 6, encumbrance: 3  },
  // Food & Provisions
  { name: 'Rations, Standard (1 day)', category: 'Food & Provisions', cost: 2, hitPoints: 1, encumbrance: 2 },
  { name: 'Rations, Trail (1 day)',    category: 'Food & Provisions', cost: 6, hitPoints: 1, encumbrance: 1 },
  // Tools
  { name: "Thieves' Tools",         category: 'Tools', cost: 30, hitPoints: 3, encumbrance: 1  },
  { name: 'Lock',                   category: 'Tools', cost: 20, hitPoints: 6, encumbrance: 1  },
  { name: 'Shovel',                 category: 'Tools', cost: 2,  hitPoints: 6, encumbrance: 8  },
  { name: 'Pickaxe',                category: 'Tools', cost: 3,  hitPoints: 8, encumbrance: 12 },
  { name: 'Crowbar',                category: 'Tools', cost: 1,  hitPoints: 8, encumbrance: 5  },
  { name: 'Hammer',                 category: 'Tools', cost: 0,  hitPoints: 6, encumbrance: 5  },
  // Religious & Magic
  { name: 'Holy Symbol (silver)',   category: 'Religious & Magic', cost: 25, hitPoints: 2, encumbrance: 1 },
  { name: 'Holy Symbol (pewter)',   category: 'Religious & Magic', cost: 5,  hitPoints: 2, encumbrance: 1 },
  { name: 'Holy Symbol (wooden)',   category: 'Religious & Magic', cost: 0,  hitPoints: 2, encumbrance: 1 },
  { name: 'Holy Water (vial)',      category: 'Religious & Magic', cost: 25, hitPoints: 1, encumbrance: 1 },
  { name: 'Spellbook (blank)',      category: 'Religious & Magic', cost: 25, hitPoints: 4, encumbrance: 5 },
  { name: 'Oil, Lamp (per pint)',   category: 'Religious & Magic', cost: 0,  hitPoints: 1, encumbrance: 1 },
  // Transport & Storage
  { name: 'Saddlebags',            category: 'Transport & Storage', cost: 4,  hitPoints: 6,  encumbrance: 8  },
  { name: 'Cart',                  category: 'Transport & Storage', cost: 15, hitPoints: 20, encumbrance: 0  },
];

// ─── Kal-Arath ────────────────────────────────────────────────────────────────
// Costs in Silver (S). Encumbrance = item slot count (1 per item).
// Max slots = STR + 8; over limit → disadvantage on all physical rolls.
// hitPoints = item durability.
export const KAL_ARATH_EQUIPMENT_LIST: EquipmentDefinition[] = [
  // Adventuring Gear
  { name: 'Rope',               category: 'Adventuring Gear', cost: 3,  hitPoints: 6,  encumbrance: 1 },
  { name: 'Grappling Hook',     category: 'Adventuring Gear', cost: 5,  hitPoints: 6,  encumbrance: 1 },
  { name: 'Lantern',            category: 'Adventuring Gear', cost: 15, hitPoints: 4,  encumbrance: 1 },
  { name: 'Lamp Oil (flask)',   category: 'Adventuring Gear', cost: 2,  hitPoints: 1,  encumbrance: 1 },
  { name: 'Bundle of Torches',  category: 'Adventuring Gear', cost: 10, hitPoints: 1,  encumbrance: 1 },
  { name: 'Flint & Steel',      category: 'Adventuring Gear', cost: 2,  hitPoints: 1,  encumbrance: 0 },
  { name: 'Bedroll',            category: 'Adventuring Gear', cost: 5,  hitPoints: 3,  encumbrance: 1 },
  { name: 'Tent',               category: 'Adventuring Gear', cost: 20, hitPoints: 6,  encumbrance: 1 },
  { name: 'Waterskin',          category: 'Adventuring Gear', cost: 2,  hitPoints: 2,  encumbrance: 1 },
  { name: 'Mirror (small)',     category: 'Adventuring Gear', cost: 10, hitPoints: 2,  encumbrance: 0 },
  { name: 'Signal Whistle',     category: 'Adventuring Gear', cost: 3,  hitPoints: 1,  encumbrance: 0 },
  // Clothing
  { name: 'Rough Clothes',      category: 'Clothing', cost: 3,  hitPoints: 4, encumbrance: 1 },
  { name: 'Traveling Clothes',  category: 'Clothing', cost: 10, hitPoints: 4, encumbrance: 1 },
  { name: 'Fine Clothes',       category: 'Clothing', cost: 30, hitPoints: 4, encumbrance: 1 },
  { name: 'Cloak',              category: 'Clothing', cost: 5,  hitPoints: 3, encumbrance: 1 },
  { name: 'Boots',              category: 'Clothing', cost: 8,  hitPoints: 6, encumbrance: 1 },
  // Food & Provisions
  { name: 'Meal (1 day)',       category: 'Food & Provisions', cost: 1,  hitPoints: 1, encumbrance: 1 },
  { name: 'Rations (1 week)',   category: 'Food & Provisions', cost: 6,  hitPoints: 1, encumbrance: 1 },
  { name: 'Ale (mug)',          category: 'Food & Provisions', cost: 1,  hitPoints: 1, encumbrance: 1 },
  // Tools
  { name: 'Simple Tool',        category: 'Tools', cost: 3,  hitPoints: 4, encumbrance: 1 },
  { name: 'Crowbar',            category: 'Tools', cost: 5,  hitPoints: 8, encumbrance: 1 },
  { name: 'Shovel',             category: 'Tools', cost: 5,  hitPoints: 6, encumbrance: 1 },
  { name: 'Pickaxe',            category: 'Tools', cost: 8,  hitPoints: 8, encumbrance: 1 },
  { name: 'Lockpicks',          category: 'Tools', cost: 30, hitPoints: 3, encumbrance: 0 },
  // Medical
  { name: 'Healing Herbs',      category: 'Medical', cost: 15, hitPoints: 1, encumbrance: 0 },
  { name: 'Bandages',           category: 'Medical', cost: 2,  hitPoints: 1, encumbrance: 0 },
  { name: 'Antidote',           category: 'Medical', cost: 20, hitPoints: 1, encumbrance: 0 },
  // Writing & Navigation
  { name: 'Map',                category: 'Writing & Navigation', cost: 10, hitPoints: 1, encumbrance: 0 },
  { name: 'Ink & Quill',        category: 'Writing & Navigation', cost: 3,  hitPoints: 1, encumbrance: 0 },
  { name: 'Parchment (sheet)',  category: 'Writing & Navigation', cost: 1,  hitPoints: 1, encumbrance: 0 },
  { name: 'Grimoire (blank)',   category: 'Writing & Navigation', cost: 50, hitPoints: 4, encumbrance: 1 },
  // Transport & Storage
  { name: 'Backpack',           category: 'Transport & Storage', cost: 8,  hitPoints: 4, encumbrance: 1 },
  { name: 'Saddlebags',         category: 'Transport & Storage', cost: 15, hitPoints: 6, encumbrance: 1 },
  { name: 'Cart',               category: 'Transport & Storage', cost: 100,hitPoints: 20,encumbrance: 0 },
  { name: 'Wagon',              category: 'Transport & Storage', cost: 300,hitPoints: 30,encumbrance: 0 },
];
