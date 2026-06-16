import { HitLocationTemplate } from '@bestiary/models/monster.model';

export const HIT_LOCATION_TEMPLATES: HitLocationTemplate[] = [
  {
    id: 'humanoid',
    label: 'Humanoid',
    locations: [
      { name: 'Right Leg', weight: 0.33 },
      { name: 'Left Leg', weight: 0.33 },
      { name: 'Abdomen', weight: 0.33 },
      { name: 'Chest', weight: 0.40 },
      { name: 'Right Arm', weight: 0.25 },
      { name: 'Left Arm', weight: 0.25 },
      { name: 'Head', weight: 0.33 },
    ],
  },
  {
    id: 'centaur',
    label: 'Centaur',
    locations: [
      { name: 'Right Hind Leg', weight: 0.33 },
      { name: 'Left Hind Leg', weight: 0.33 },
      { name: 'Hindquarters', weight: 0.40 },
      { name: 'Forequarters', weight: 0.40 },
      { name: 'Right Fore Leg', weight: 0.33 },
      { name: 'Left Fore Leg', weight: 0.33 },
      { name: 'Right Arm', weight: 0.25 },
      { name: 'Left Arm', weight: 0.25 },
      { name: 'Head', weight: 0.33 },
    ],
  },
  {
    id: 'scorpion_man',
    label: 'Scorpion Man',
    locations: [
      { name: 'Tail', weight: 0.40 },
      { name: 'Right Claw', weight: 0.25 },
      { name: 'Left Claw', weight: 0.25 },
      { name: 'Chest', weight: 0.40 },
      { name: 'Head', weight: 0.33 },
      { name: 'Right Leg', weight: 0.33 },
      { name: 'Left Leg', weight: 0.33 },
    ],
  },
  {
    id: 'quadruped',
    label: 'Quadruped (Bear/Wolf)',
    locations: [
      { name: 'Right Hind Leg', weight: 0.33 },
      { name: 'Left Hind Leg', weight: 0.33 },
      { name: 'Hindquarters', weight: 0.40 },
      { name: 'Forequarters', weight: 0.40 },
      { name: 'Right Fore Leg', weight: 0.33 },
      { name: 'Left Fore Leg', weight: 0.33 },
      { name: 'Head', weight: 0.33 },
    ],
  },
  {
    id: 'giant_spider',
    label: 'Giant Spider',
    locations: [
      { name: 'Right Leg 1', weight: 0.20 },
      { name: 'Right Leg 2', weight: 0.20 },
      { name: 'Right Leg 3', weight: 0.20 },
      { name: 'Left Leg 1', weight: 0.20 },
      { name: 'Left Leg 2', weight: 0.20 },
      { name: 'Left Leg 3', weight: 0.20 },
      { name: 'Abdomen', weight: 0.40 },
      { name: 'Cephalothorax', weight: 0.40 },
    ],
  },
];
