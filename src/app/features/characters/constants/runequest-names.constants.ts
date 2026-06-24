const MALE_PREFIXES = [
  'Andrin', 'Andror', 'Avent', 'Bar', 'Barn', 'Beren', 'Bro', 'Dar', 'Der', 'Des',
  'Destor', 'Din', 'Dor', 'Enjos', 'Erin', 'Fin', 'Garin', 'Hantra', 'Harad', 'Haran',
  'Hedkor', 'Hend', 'Ir', 'Jarstar', 'Korl', 'Korol', 'Kul', 'Lond', 'Markal', 'Or',
  'Orl', 'Orst', 'Orvan', 'Rasta', 'Ros', 'Saro', 'Senren', 'Stark', 'Van', 'Ven', 'Varan',
];

const MALE_SUFFIXES = [
  'alor', 'aldes', 'and', 'angian', 'arl', 'aventus', 'brast', 'dath', 'daral', 'dovar',
  'drinor', 'dros', 'en', 'estan', 'fin', 'gandi', 'ganvar', 'gor', 'gradus', 'harl',
  'illo', 'ister', 'kar', 'kos', 'lanth', 'vanth', 'lakar', 'larant', 'lor', 'makt',
  'manar', 'mal', 'marl', 'mast', 'niskis', 'onil', 'orth', 'restos', 'rik', 'rolar',
  'serian', 'staval', 'tand', 'tar', 'taros', 'tos', 'ulf', 'veste', 'venos', 'vil', 'yan',
];

const FEMALE_PREFIXES = [
  'Ar', 'Dara', 'Davor', 'Der', 'Dor', 'Dush', 'Ent', 'Erin', 'Ernal', 'Ernalda',
  'Esra', 'Esrol', 'Feren', 'Har', 'Hend', 'In', 'Ivarn', 'Jareen', 'Jarnarn', 'Jen',
  'Kall', 'Ken', 'Leika', 'Lond', 'Mern', 'Mir', 'Morgan', 'Natal', 'Nerest', 'Ondur',
  'Onel', 'Oran', 'Ori', 'Samast', 'Senren', 'Sora', 'Seren', 'Serze', 'Vasan', 'Yan', 'Yerest',
];

const FEMALE_SUFFIXES = [
  'a', 'ala', 'ale', 'ali', 'ana', 'arios', 'asa', 'ava', 'dessa', 'destra',
  'dinna', 'dira', 'drella', 'durisa', 'ela', 'erlanda', 'esting', 'eth', 'eva', 'gala',
  'i', 'ias', 'illa', 'ina', 'ioth', 'ira', 'isen', 'yr', 'karne', 'lartha',
  'randa', 'renava', 'sin', 'sta', 'sulva', 'vale',
];

function buildNames(prefixes: string[], suffixes: string[]): string[] {
  const names: string[] = [];
  for (const prefix of prefixes) {
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    names.push(prefix + suffix);
  }
  return names;
}

export const RUNEQUEST_NAMES: string[] = [
  ...buildNames(MALE_PREFIXES, MALE_SUFFIXES),
  ...buildNames(FEMALE_PREFIXES, FEMALE_SUFFIXES),
  // Well-known canonical names included for flavor
  'Argrath', 'Broyan', 'Dorasor', 'Farnan', 'Harmast', 'Gringle', 'Jarstakos', 'Kalf',
  'Maniski', 'Ortossi', 'Robasart', 'Saronil', 'Sarotar', 'Tarkalor', 'Venharl', 'Aslandar',
  'Beneva', 'Berra', 'Dorasa', 'Dushi', 'Erissa', 'Erynn', 'Insterid', 'Ivarne',
  'Jareen', 'Kallyr', 'Leika', 'Morganeth', 'Onelisen', 'Sora', 'Vasana', 'Yanioth',
];
