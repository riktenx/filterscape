import { cmdGenerateModGroup } from './cmd.js';

const useAllowlist = (list) => {
  return (table) => {
    const excludes = {};
    for (const [category, items] of Object.entries(table)) {
      excludes[category] = items.filter(item => !list.includes(item));
    }
    return excludes;
  };
};

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
    name: 'Dagannoth Kings',
    area: [2880, 4478, 0, 2943, 4353, 0],
    url: [
      'https://oldschool.runescape.wiki/w/Dagannoth_Rex',
      'https://oldschool.runescape.wiki/w/Dagannoth_Prime',
      'https://oldschool.runescape.wiki/w/Dagannoth_Supreme',
    ],
    transform: {
      updateDropTable: (table) => {
        table["Tertiary"] = [
          "Ensouled dagannoth head",
          "Brimstone key",
        ];
      },
      getDefaults: useAllowlist([
        // 100%
        "Dagannoth bones",
        // Weapons and armour
        "Dragon axe",
        "Berserker ring",
        "Warrior ring",
        "Mud battlestaff",
        "Battlestaff",
        "Seers ring",
        "Archers ring",
        "Archer helm",
        "Farseer helm",
        "Seercull",
        "Mithril knife",
        "Iron knife",
        "Steel knife",
        // Ores and bars
        "Coal",
        "Iron ore",
        "Steel bar",
        // Talismans (noted)
        "Earth talisman",
        "Air talisman",
        "Water talisman",
        // Tertiary
        "Ensouled dagannoth head",
        "Brimstone key",
      ]),
    },
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
    url: [
      'https://oldschool.runescape.wiki/w/Kree%27arra',
      'https://oldschool.runescape.wiki/w/Flight_Kilisa',
      'https://oldschool.runescape.wiki/w/Wingman_Skree',
      'https://oldschool.runescape.wiki/w/Flockleader_Geerin',
    ],
    transform: {
      updateDropTable: (table) => {
        delete table['Uniques'];
        delete table['Unique table'];
        delete table['Godsword shard table'];

      },
      getDefaults: (_) => {
        return {
          "100%": [
            "Big bones",
            "Feather",
            "Bones"
          ],
          "=Food and ammunition=": [
            "Steel arrow",
            "Steel dart",
            "Smoke rune",
          ],
        };
      },
      preScript: () => {
        return `/*@ define:input:kreearra
type: boolean
group: General
label: Hide coin drops from bodyguards
*/
#define VAR_KREEARRA_BOOLEAN_GENERAL_BGHIDECOINS true
CONST_KREEARRA_RULE (VAR_KREEARRA_BOOLEAN_GENERAL_BGHIDECOINS && name:"coins" && quantity:<=1100) {
  hidden = true;
}
`;
      },

    },
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
    area: [1497, 3301, 0, 1529, 3271, 0],
    url: 'https://oldschool.runescape.wiki/w/The_Hueycoatl',
  },
  {
    name: 'Corporeal Beast',
    area: [2961, 4366, 0, 3001, 4399, 0],
    url: 'https://oldschool.runescape.wiki/w/Corporeal_Beast',
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
    area: [3214, 10324, 0, 3252, 10358, 0],
    url: 'https://oldschool.runescape.wiki/w/Scorpia',
  },
  {
    name: 'King Black Dragon',
    area: [2240, 4672, 0, 2303, 4735, 0],
    url: 'https://oldschool.runescape.wiki/w/King_Black_Dragon',
  },
  {
    name: 'Chaos Elemental',
    area: [3200, 3967, 0, 3327, 3904, 0],
    url: 'https://oldschool.runescape.wiki/w/Chaos_Elemental',
  },
//{
//  name: 'Revenant maledictus',
//  area: [3136, 10048, 0, 3263, 10239, 0],
//  url: '', // drop table doesn't work without ref support
//},
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
      getDefaults: (_) => {
        return {
          "Fletching materials": [
            "Sapphire bolt tips",
            "Emerald bolt tips",
            "Ruby bolt tips",
            "Diamond bolt tips",
          ],
          "Other": [
            "Grapes",
            "Wrath talisman",
          ],
          "Tertiary": [
            "Scaly blue dragonhide",
          ],
        };
      },
      preScript: () => {
        return `/*@ define:input:vorkath
type: boolean
group: General
label: Hide un-noted blue d-hide
*/
#define VAR_VORKATH_BOOLEAN_GENERAL_NOHIDE true

/*@ define:input:vorkath
type: boolean
group: General
label: Hide superior dragon bones (why?)
*/
#define VAR_VORKATH_BOOLEAN_GENERAL_NOBONE false

CONST_VORKATH_RULE (VAR_VORKATH_BOOLEAN_GENERAL_NOHIDE && name:"Blue dragonhide" && noted:false) {
  hidden = true;
}
CONST_VORKATH_RULE (VAR_VORKATH_BOOLEAN_GENERAL_NOBONE && name:"Superior dragon bones" && noted:false) {
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
    area: [2053, 6390, 0, 2110, 6355, 0],
    url: 'https://oldschool.runescape.wiki/w/The_Leviathan',
  },
  {
    name: 'The Whisperer',
    area: [2631, 6391, 0, 2684, 6345, 0],
    url: 'https://oldschool.runescape.wiki/w/The_Whisperer',
  },
  {
    name: 'Vardorvis',
    area: [1117, 3428, 0, 1141, 3408, 0],
    url: 'https://oldschool.runescape.wiki/w/Vardorvis',
  },
  // skip: Sporadic bosses
  {
    name: 'Grotesque Guardians',
    area: [1664, 4544, 0, 1727, 4607, 0],
    url: 'https://oldschool.runescape.wiki/w/Grotesque_Guardians',
  },
  {
    name: 'Abyssal Sire',
    area: [2944, 4863, 0, 3135, 4736, 0],
    url: 'https://oldschool.runescape.wiki/w/Abyssal_Sire',
  },
  {
    name: 'Kraken',
    area: [2268, 10021, 0, 2292, 10045, 0],
    url: 'https://oldschool.runescape.wiki/w/Kraken',
  },
  {
    name: 'Cerberus',
    area: [1216, 1343, 0, 1407, 1216, 0],
    url: 'https://oldschool.runescape.wiki/w/Cerberus',
  },  
  {
    name: 'Araxxor',
    area: [3608, 9837, 0, 3651, 9795, 0],
    url: 'https://oldschool.runescape.wiki/w/Araxxor',
  },
  {
    name: 'Thermonuclear smoke devil',
    area: [2345, 9464, 0, 2380, 9434, 0],
    url: 'https://oldschool.runescape.wiki/w/Thermonuclear_smoke_devil',
  },
  {
    name: 'Alchemical Hydra',
    area: [1346, 10287, 0, 1385, 10251, 0],
    url: 'https://oldschool.runescape.wiki/w/Alchemical_Hydra',
  },
];

await cmdGenerateModGroup('boss', index);
