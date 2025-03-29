import { cmdGenerateModGroup } from './cmd.js';

const setPlane = (mapAreas, key, plane) => {
  mapAreas[key][2] = plane;
  mapAreas[key][5] = plane;
}

const index = [
  {
    name: 'Bloodveld',
    area: -1,
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
];

await cmdGenerateModGroup('slayer', index);
