import { cmdGenerateModGroup } from './cmd.js';

const setPlane = (mapAreas, key, plane) => {
  mapAreas[key][2] = plane;
  mapAreas[key][5] = plane;
}

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
          "Weapons and armour": [
            "Steel axe",
            "Steel full helm",
            "Steel scimitar",
            "Mithril sq shield",
            "Mithril chainbody",
          ],
          "Other": [
            "Bones",
            "Meat pizza",
          ],
        };
      },
    },
  },
  {
    name: 'Nechryael',
    url: 'https://oldschool.runescape.wiki/w/Nechryael',
    transform: {
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
          "Weapons and armour": [
            "Steel axe",
            "Mithril kiteshield",
            "Adamant platelegs",
          ],
          "Coins": [
            "Coins",
          ],
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
          "=100%=": [
            "Bones",
          ],
          "=Weapons and armour=": [
            "Adamant axe",
            "Rune dagger",
            "Red d'hide vambraces",
            "Black d'hide vambraces",
            "Air battlestaff",
            "Earth battlestaff",
          ],
          "=Runes and ammunition=": [
            "Rune arrow",
          ],
          "=Other=": [
            "Ugthanki kebab",
          ],
        };
      },
    },
  },
  {
    name: 'Smoke devil',
    url: 'https://oldschool.runescape.wiki/w/Smoke_devil',
    transform: {
      getDefaults: (_) => {
        return {
          "100%": [
            "Ashes"
          ],
          "Weapons and armour": [
            "Adamant battleaxe",
            "Rune dagger",
            "Air battlestaff",
            "Black d'hide vambraces",
            "Fire battlestaff",
            "Mithril plateskirt",
            "Red d'hide body",
          ],
          "Runes and ammunition": [
            "Smoke rune",
            "Runite bolts",
            "Fire rune",
            "Air rune",
            "Soul rune",
            "Rune arrow"
          ],
          "Coins": [
            "Coins"
          ],
          "Other": [
            "Shark",
            "Steel bar",
            "Magic logs",
            "Coal",
            "Adamantite bar",
            "Crossbow string",
            "Ugthanki kebab"
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
  },
  {
    name: 'Abyssal demon',
    url: 'https://oldschool.runescape.wiki/w/Abyssal_demon',
    transform: {
      getDefaults: () => {
        return {
          "=Weapons and armour=": [
            "Black sword",
            "Steel battleaxe",
            "Black axe",
            "Mithril kiteshield",
          ],
          "=Runes=": [
            "Air rune",
            "Chaos rune",
            "Blood rune",
            "Law rune",
          ],
          "=Materials=": [
            "Pure essence",
            "Adamantite bar",
          ],
          "=Coins=": [
            "Coins",
          ],
        };
      },
    },
  },
];

await cmdGenerateModGroup('slayer', index);
