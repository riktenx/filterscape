import { cmdGenerateModGroup } from './cmd.js';

const index = [
  {
    name: 'Bloodveld',
    area: -1,
    url: 'https://oldschool.runescape.wiki/w/Bloodveld',
  },
];

await cmdGenerateModGroup('slayer', index);
