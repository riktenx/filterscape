import fs from 'fs';

import { getWikiSource, buildDropTable } from './wikiscrape.js';
import { generateRs2f, generateJson } from './modgen.js';

const index = [
  // skip: barrows (they don't drop anything)
  {
    name: 'Scurrius',
    area: [3285, 9856, 0, 3310, 9879, 0],
    url: 'https://oldschool.runescape.wiki/w/Scurrius',
  },
  {
    name: 'Giant Mole',
    area: [1728, 5120, 0, 1791, 5247, 0],
    url: 'https://oldschool.runescape.wiki/w/Giant_Mole',
  },
  {
    name: 'Deranged archaeologist',
    area: [3669, 3694, 0, 3698, 3722, 0],
    url: 'https://oldschool.runescape.wiki/w/Deranged_archaeologist',
  },
  {
    name: 'Dagannoths',
    area: [],
    url: '',
  },
  {
    name: 'Sarachnis',
    area: [1829, 9890, 0, 1855, 9911, 0],
    url: 'https://oldschool.runescape.wiki/w/Sarachnis',
  },
  // skip: perilous moons (loot is from chest)
  {
    name: 'Kalphite Queen',
    area: [3456, 9472, 0, 3519, 9535, 0],
    url: 'https://oldschool.runescape.wiki/w/Kalphite_Queen',
  },
  {
    name: "Kree'arra",
    area: [2823, 5295, 2, 2843, 5309, 2],
    url: 'https://oldschool.runescape.wiki/w/Kree%27arra',
  },
  {
    name: 'Commander Zilyana',
    area: [2888, 5257, 0, 2908, 5276, 0],
    url: 'https://oldschool.runescape.wiki/w/Commander_Zilyana',
  },
  {
    name: 'General Graardor',
    area: [2863, 5350, 2, 2877, 5370, 2],
    url: 'https://oldschool.runescape.wiki/w/General_Graardor',
  },
  {
    name: "K'ril Tsutsaroth",
    area: [2917, 5317, 2, 2937, 5332, 2],
    url: 'https://oldschool.runescape.wiki/w/K%27ril_Tsutsaroth',
  },
  {
    name: 'The Hueycoatl',
    area: [],
    url: '',
  },
  {
    name: 'Corporeal Beast',
    area: [],
    url: '',
  },
  {
    name: 'Nex',
    area: [2910, 5188, 0, 2940, 5218, 0],
    url: 'https://oldschool.runescape.wiki/w/Nex',
  },
  {
    name: 'Chaos Fanatic',
    area: [2973, 3849, 0, 2988, 3863, 0],
    url: 'https://oldschool.runescape.wiki/w/Chaos_Fanatic',
  },
  {
    name: 'Crazy archaeologist',
    area: [2953, 3679, 0, 2985, 3708, 0],
    url: 'https://oldschool.runescape.wiki/w/Crazy_archaeologist',
  },
  {
    name: 'Scorpia',
    area: [],
    url: '',
  },
  {
    name: 'King Black Dragon',
    area: [2240, 4672, 0, 2303, 4735, 0],
    url: 'https://oldschool.runescape.wiki/w/King_Black_Dragon',
  },
  {
    name: 'Chaos Elemental',
    area: [],
    url: '',
  },
  {
    name: 'Revenant maledictus',
    area: [],
    url: '',
  },
  {
    name: "Vet'ion",
    area: [3282, 10187, 1, 3307, 10216, 1],
    url: 'https://oldschool.runescape.wiki/w/Vet%27ion',
  },
  {
    name: 'Venenatis',
    area: [3402, 10181, 2, 3443, 10225, 2],
    url: 'https://oldschool.runescape.wiki/w/Venenatis',
  },
  {
    name: 'Callisto',
    area: [3342, 10311, 0, 3374, 10344, 0],
    url: 'https://oldschool.runescape.wiki/w/Callisto',
  },
  {
    name: 'Amoxliatl',
    area: [1347, 4493, 0, 1383, 4529, 0],
    url: 'https://oldschool.runescape.wiki/w/Amoxliatl',
  },
  // skip: royal titans, no drop
  {
    name: 'Zulrah',
    area: [2259, 3065, 0, 2277, 3080, 0],
    url: 'https://oldschool.runescape.wiki/w/Zulrah',
  },
  {
    name: 'Vorkath',
    area: [2256, 4051, 0, 2288, 4080, 0],
    url: 'https://oldschool.runescape.wiki/w/Vorkath',
    transform: {
      updateDropTable: (table) => {
        delete table['100%'];
      },
      preScript: () => {
        return `// label:Hide un-noted blue d-hide
#define VAR_VORKATH_BOOLEAN_GENERAL_NOHIDE true
// label:Hide superior dragon bones (why?)
#define VAR_VORKATH_BOOLEAN_GENERAL_NOBONE false
CONST_VORKATH_IF (VAR_VORKATH_BOOLEAN_GENERAL_NOHIDE && name:"Blue dragonhide" && noted:false) {
  hidden = true;
}
CONST_VORKATH_IF (VAR_VORKATH_BOOLEAN_GENERAL_NOBONE && name:"Superior dragon bones" && noted:false) {
  hidden = true;
}`;
      },
    },
  },
  {
    name: 'Phantom Muspah',
    area: [2816, 4224, 0, 2879, 4287, 0],
    url: 'https://oldschool.runescape.wiki/w/Phantom_Muspah',
  },
  {
    name: 'The Nightmare',
    area: [3840, 9920, 3, 3903, 9983, 3],
    url: 'https://oldschool.runescape.wiki/w/The_Nightmare',
  },
  {
    name: 'Duke Sucellus',
    area: [3027, 6433, 0, 3051, 6458, 0],
    url: 'https://oldschool.runescape.wiki/w/Duke_Sucellus',
  },
  {
    name: 'The Leviathan',
    area: [],
    url: '',
  },
  {
    name: 'The Whisperer',
    area: [],
    url: '',
  },
  {
    name: 'Vardorvis',
    area: [],
    url: '',
  },
  // skip: Sporadic bosses
  {
    name: 'Grotesque Guardians',
    area: [],
    url: '',
  },
  {
    name: 'Abyssal Sire',
    area: [],
    url: '',
  },
  {
    name: 'Kraken',
    area: [],
    url: '',
  },
  {
    name: 'Cerberus',
    area: [],
    url: '',
  },
  // skip: araxxor: no drop
  {
    name: 'Thermonuclear smoke devil',
    area: [],
    url: '',
  },
  {
    name: 'Alchemical Hydra',
    area: [],
    url: '',
  },
];

const toModuleName = (str) => str.toLowerCase().replace("'", '').replaceAll(' ', '');

for (const boss of index) {
  if (!boss.url) {
    console.log('skip', boss.name);
    continue;
  }

  if (!boss.transform) {
    boss.transform = {};
  }

  const wikiSource = await getWikiSource(boss.url);
  const dropTable = buildDropTable(wikiSource);
  if (!!boss.transform.updateDropTable) {
    boss.transform.updateDropTable(dropTable);
  }

  const moduleName = toModuleName(boss.name);
  const rs2f = generateRs2f(boss.name, boss.area, dropTable, boss.transform);
  const module = generateJson(rs2f);

  const modulePath = `boss/${moduleName}`;
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath);
  }

  fs.writeFileSync(`${modulePath}/dropTable`, JSON.stringify(dropTable, null, 2));
  fs.writeFileSync(`${modulePath}/module.rs2f`, rs2f);
  fs.writeFileSync(`${modulePath}/module.json`, JSON.stringify(module, null, 2));
}

