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
  },
  {
    name: 'Aberrant spectre',
    url: 'https://oldschool.runescape.wiki/w/Aberrant_spectre',
  },
  {
    name: 'Dust devil',
    url: 'https://oldschool.runescape.wiki/w/Dust_devil',
  },
  {
    name: 'Smoke devil',
    url: 'https://oldschool.runescape.wiki/w/Smoke_devil',
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
  },
];

await cmdGenerateModGroup('slayer', index);
