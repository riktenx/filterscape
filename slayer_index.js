import { cmdGenerateModGroup } from './cmd.js';

const setPlane = (mapAreas, key, plane) => {
  mapAreas[key][2] = plane;
  mapAreas[key][5] = plane;
};

const index = [
  {
    name: 'Bloodveld',
    url: 'https://oldschool.runescape.wiki/w/Bloodveld',
    transform: {
      updateMapAreas: (areas) => {
        // wiki is wrong
        setPlane(areas, '[[Slayer Tower]] (basement)', 3);

        // wiki has a formatting quirk that breaks the parser
        areas['Slayer tower (upstairs)'] = [3404, 3556, 1, 3429, 3579, 1];
      },
      getDefaults: () => {
        return {
          'Weapons and armour': [
            'Steel axe',
            'Steel full helm',
            'Steel scimitar',
            'Mithril sq shield',
            'Mithril chainbody',
          ],
          Other: ['Bones', 'Meat pizza'],
        };
      },
    },
  },
  {
    name: 'Kurask',
    url: 'https://oldschool.runescape.wiki/w/Kurask',
    transform: {
      getDefaults: () => {
        return {
          '100%': ['Bones'],
          'Weapons and armour': ['Mithril kiteshield'],
          Other: ['Flax'],
        };
      },
      preScript: (scope) => {
        return `/*@ define:input
type: boolean
group: Kurask
label: Hide non-10k coin drops
*/
#define VAR_${scope}_BOOLEAN_HIDESMALLCOINS true
CONST_${scope}_RULE (VAR_${scope}_BOOLEAN_HIDESMALLCOINS && name:"Coins" && value:<10_000) {
  hidden = true;
}
`;
      },
    },
  },
  {
    name: 'Nechryael',
    url: [
      'https://oldschool.runescape.wiki/w/Nechryael',
      'https://oldschool.runescape.wiki/w/Greater_Nechryael',
    ],
    transform: {
      preScript: () => {
        return `/*@ define:group
name: Nechryael
description: |
  Includes Greater nechryaels.
*/`;
      },
      updateMapAreas: (areas) => {
        setPlane(areas, '[[Slayer Tower]] Basement', 3); // wiki is wrong
      },
    },
  },
  {
    name: 'Vyre',
    url: 'https://oldschool.runescape.wiki/w/Vyrewatch_Sentinel',
    transform: {
      getDefaults: () => {
        return {};
      },
    },
  },
  {
    name: 'Aberrant spectre',
    url: 'https://oldschool.runescape.wiki/w/Aberrant_spectre',
    transform: {
      updateDropTable: (table) => {
        delete table['Other'];
        delete table['Tertiary'];
      },
      getDefaults: () => {
        return {
          'Weapons and armour': [
            'Steel axe',
            'Mithril kiteshield',
            'Adamant platelegs',
          ],
          Coins: ['Coins'],
        };
      },
    },
  },
  {
    name: 'Dust devil',
    url: 'https://oldschool.runescape.wiki/w/Dust_devil',
    transform: {
      getDefaults: (_) => {
        return {
          '100%': ['Bones'],
          'Weapons and armour': [
            'Adamant axe',
            'Rune dagger',
            "Red d'hide vambraces",
            "Black d'hide vambraces",
            'Air battlestaff',
            'Earth battlestaff',
          ],
          'Runes and ammunition': ['Rune arrow'],
          Other: ['Ugthanki kebab'],
        };
      },
    },
  },
  {
    name: 'Smoke devil',
    url: 'https://oldschool.runescape.wiki/w/Smoke_devil',
    transform: {
      updateMapAreas: (table) => {
        // there are some strays in thermy's room so this breaks the thermy
        // boss module, just adjust it manually
        delete table['[[Smoke Devil Dungeon]]'];
        table['[[Smoke Devil Dungeon]]'] = [2377, 9412, 0, 2427, 9471, 0];
      },
      getDefaults: (_) => {
        return {
          '100%': ['Ashes'],
          'Weapons and armour': [
            'Adamant battleaxe',
            'Rune dagger',
            'Air battlestaff',
            "Black d'hide vambraces",
            'Fire battlestaff',
            'Mithril plateskirt',
            "Red d'hide body",
          ],
          'Runes and ammunition': [
            'Smoke rune',
            'Runite bolts',
            'Fire rune',
            'Air rune',
            'Soul rune',
            'Rune arrow',
          ],
          Coins: ['Coins'],
          Other: [
            'Shark',
            'Steel bar',
            'Magic logs',
            'Coal',
            'Adamantite bar',
            'Crossbow string',
            'Ugthanki kebab',
          ],
        };
      },
    },
  },
  {
    name: 'Skeletal wyvern',
    url: 'https://oldschool.runescape.wiki/w/Skeletal_Wyvern',
  },
  {
    name: 'Gargoyle',
    url: 'https://oldschool.runescape.wiki/w/Gargoyle',
    transform: {
      updateMapAreas: (areas) => {
        areas['[[Slayer Tower]] top floor'] = [3430, 3554, 2, 3452, 3531, 2];
        setPlane(areas, '[[Slayer Tower]] basement (Slayer task only)', 3); // wiki is wrong
      },
      getDefaults: () => {
        return {
          'Weapons and armour': ['Adamant platelegs', 'Adamant boots'],
          Runes: ['Fire rune'],
          Materials: ['Gold ore', 'Pure essence', 'Gold bar'],
        };
      },
      preScript: (scope) => {
        return `/*@ define:input
type: boolean
group: Gargoyle
label: Hide non-10k coin drops
*/
#define VAR_${scope}_BOOLEAN_HIDESMALLCOINS true
CONST_${scope}_RULE (VAR_${scope}_BOOLEAN_HIDESMALLCOINS && name:"Coins" && value:<10_000) {
  hidden = true;
}
`;
      },
    },
  },
  {
    name: 'Abyssal demon',
    url: 'https://oldschool.runescape.wiki/w/Abyssal_demon',
    transform: {
      getDefaults: () => {
        return {
          'Weapons and armour': [
            'Black sword',
            'Steel battleaxe',
            'Black axe',
            'Mithril kiteshield',
          ],
          Runes: ['Air rune', 'Chaos rune', 'Blood rune', 'Law rune'],
          Materials: ['Pure essence', 'Adamantite bar'],
          Coins: ['Coins'],
        };
      },
    },
  },
  {
    name: 'Araxyte',
    url: 'https://oldschool.runescape.wiki/w/Araxyte',
    transform: {
      updateMapAreas: (table) => {
        // wiki source is cooked here, just do our own
        delete table['[[Morytania Spider Cave]] (task-only area)'];
        table['[[Morytania Spider Cave]]'] = [3653, 9793, 0, 3710, 9868, 0];
      },
      updateDropTable: (table) => {
        table['Other'] = table['Other'].filter(
          (item) => item !== 'Araxyte venom sack'
        );
      },
      getDefaults: () => {
        return {
          'Weapons and armour': ['Adamant longsword', 'Adamant battleaxe'],
        };
      },
    },
  },
  {
    name: 'Demonic gorilla',
    url: 'https://oldschool.runescape.wiki/w/Demonic_gorilla',
    transform: {},
  },
  {
    name: 'Tormented demon',
    url: 'https://oldschool.runescape.wiki/w/Tormented_Demon',
    transform: {
      updateMapAreas: (areas) => {
        // wiki has the spawns but the script didn't compute the right thing,
        // not sure why
        areas['[[Ancient Guthixian Temple]]'] = [4032, 4352, 0, 4159, 4479, 0];
      },
      preScript: (scope) => {
        return `/*@ define:input
type: style
group: Tormented demon 
label: Smouldering pile of flesh
*/
#define VAR_${scope}_FLESHSTYLE \
  textColor = "#000000";\
  backgroundColor = "#aaff0000";\
  textAccent = 3;
rule (name:"Smouldering pile of flesh") { VAR_${scope}_FLESHSTYLE }

/*@ define:input
type: style
group: Tormented demon 
label: Smouldering gland
*/
#define VAR_${scope}_GLANDSTYLE \
  textColor = "#000000";\
  backgroundColor = "#aa00ffff";\
  textAccent = 3;
rule (name:"Smouldering gland") { VAR_${scope}_GLANDSTYLE }

/*@ define:input
type: style
group: Tormented demon 
label: Smouldering heart
*/
#define VAR_${scope}_HEARTSTYLE \
  textColor = "#000000";\
  backgroundColor = "#aaff00ff";\
  textAccent = 3;
rule (name:"Smouldering heart") { VAR_${scope}_HEARTSTYLE }
`;
      },
    },
  },
];

const desc = `Provides per-monster filtering for common slayer tasks. Defaults are being added over time.

Please contact Rikten X in the filterscape discord if:
* this section is missing a mob you'd like to see
* the filter isn't working for a specific mob`;

await cmdGenerateModGroup('slayer', desc, index);
