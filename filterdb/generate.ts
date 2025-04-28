import * as https from 'https';
import * as fs from 'fs';

import { FilterDB, FilterDBItemList } from './types.ts';
import * as mediawiki from './mediawiki.ts';

export type ItemListSource = {
  name: string;
  url: string | string[];
  capture: SourceCapture[];
};

export type SourceCapture = {
  sections?: string[];
  pattern: RegExp;
  transform: (match: string) => string[];
};

const getWikiSource = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const options = {
      headers: { 'user-agent': 'github.com/riktenx/filterscape' },
    };

    https.get(`${url}?action=raw`, options, (resp) => {
      if (resp.statusCode !== 200) {
        return reject(new Error('http ' + resp.statusCode));
      }

      let data = '';
      resp.on('data', (d) => {
        data += d;
      });
      resp.on('end', () => resolve(data));
    });
  });

const generateItemList = async (
  src: ItemListSource
): Promise<FilterDBItemList> => {
  const source =
    typeof src.url === 'string'
      ? await getWikiSource(src.url)
      : (await Promise.all(src.url.map(getWikiSource))).join('\n');

  const sections = mediawiki.parseSections(source);
  const model: FilterDBItemList = {
    name: src.name,
    items: [],
  };

  for (const section of sections) {
    for (const capture of src.capture) {
      if (
        capture.sections !== undefined &&
        !capture.sections.includes(section.name)
      ) {
        continue;
      }

      const match = section.text.match(capture.pattern);
      if (match === null) {
        continue;
      }

      model.items = [
        ...model.items,
        ...match.flatMap((match) =>
          capture.transform(match).map((name) => ({ name }))
        ),
      ];
    }
  }

  model.items = [...new Set(model.items)];

  return model;
};

const WIKI = 'https://oldschool.runescape.wiki/w/';

const wikiURL = (path: string | string[]): string | string[] =>
  typeof path === 'string' ? WIKI + path : path.map((p) => WIKI + p);

const equipmentList = (
  name: string,
  path: string | string[]
): ItemListSource => ({
  name,
  url: wikiURL(path),
  capture: [
    {
      pattern: /{{Infotable Bonuses\|.+}}/g,
      transform: (match: string): string[] =>
        match
          .replace('{{Infotable Bonuses|', '')
          .replace('}}', '')
          .split('|')
          .filter((name) => !name.includes('='))
          .map((name) => {
            const hashIndex = name.indexOf('#');
            return hashIndex === -1 ? name : name.substring(0, hashIndex);
          }),
    },
  ],
});

const seedList = (name: string, path: string | string[]) => ({
  name,
  url: wikiURL(path),
  capture: [
    {
      pattern: /{{plinkp\|.+ seed}}/g,
      transform: (match: string): string[] => [
        match.replace('{{plinkp|', '').replace('}}', ''),
      ],
    },
  ],
});

const petList: ItemListSource = {
  name: 'PET',
  url: wikiURL('Pet'),
  capture: [
    {
      pattern: /{{plinkt\|[- A-Za-z]+}}/g,
      transform: (match: string): string[] => [
        match.replace('{{plinkt|', '').replace('}}', ''),
      ],
    },
  ],
};

const dropList = (
  name: string,
  path: string | string[],
  sections?: string[]
): ItemListSource => ({
  name,
  url: wikiURL(path),
  capture: [
    {
      sections,
      pattern: /{{DropsLineReward\|name=[^|]+/g,
      transform: (match: string): string[] => [
        match.replace('{{DropsLineReward|name=', ''),
      ],
    },
  ],
});

const gepList = (
  // {{GEP|<item name>}}
  name: string,
  path: string | string[],
  sections?: string[]
): ItemListSource => ({
  name,
  url: wikiURL(path),
  capture: [
    {
      sections,
      pattern: /{{GEP\|[A-Za-z0-9' ]+}}/g,
      transform: (match: string): string[] => [
        match.replace('{{GEP|', '').replace('}}', ''),
      ],
    },
  ],
});

(async function () {
  const sources: ItemListSource[] = [
    equipmentList('EQUIP_BRONZE', 'Bronze_equipment'),
    equipmentList('EQUIP_IRON', 'Iron_equipment'),
    equipmentList('EQUIP_STEEL', 'Steel_equipment'),
    equipmentList('EQUIP_BLACK', 'Black_equipment'),
    equipmentList('EQUIP_MITHRIL', '_equipment'),
    equipmentList('EQUIP_ADAMANT', 'Adamant_equipment'),
    equipmentList('EQUIP_RUNE', 'Rune_equipment'),

    seedList('SEED_ALLOTMENT', 'Allotment_patch/Seeds'),
    seedList('SEED_FLOWER', 'Flower_patch/Seeds'),
    seedList('SEED_HERB', 'Herb_patch/Seeds'),
    seedList('SEED_HOPS', 'Hops_patch/Seeds'),
    seedList('SEED_BUSH', 'Bush_patch/Seeds'),
    seedList('SEED_TREE', 'Tree_patch/Seeds'),
    seedList('SEED_FRUITTREE', 'Fruit_tree_patch/Seeds'),
    //seedList('SEED_SPECIAL_MISC', ''),
    //seedList('SEED_SPECIAL_ANIMA', ''),
    //seedList('SEED_SPECIAL_TREE', ''),
    //seedList('SEED_SPECIAL_CACTI', ''),

    petList,

    dropList('UNIQUE_CLUE_BEGINNER', 'Reward_casket_(beginner)', [
      'Beginner clue uniques',
    ]),
    dropList('UNIQUE_CLUE_EASY', 'Reward_casket_(easy)', ['Easy clue uniques']),
    dropList('UNIQUE_CLUE_MEDIUM', 'Reward_casket_(medium)', [
      'Medium clue uniques',
    ]),
    dropList('UNIQUE_CLUE_HARD', 'Reward_casket_(hard)', ['Hard clue uniques']),
    dropList('UNIQUE_CLUE_ELITE', 'Reward_casket_(elite)', [
      'Elite clue uniques',
    ]),
    dropList('UNIQUE_CLUE_MASTER', 'Reward_casket_(master)', [
      'Master clue uniques',
    ]),

    gepList('CLUE_STEP_BEGINNER', 'STASH', ['Beginner']),
    gepList('CLUE_STEP_EASY', 'STASH', ['Easy']),
    gepList('CLUE_STEP_MEDIUM', 'STASH', ['Medium']),
    gepList('CLUE_STEP_HARD', 'STASH', ['Hard']),
    gepList('CLUE_STEP_ELITE', 'STASH', ['Elite']),
    gepList('CLUE_STEP_MASTER', 'STASH', ['Master']),
  ];

  const filterDB: FilterDB = {
    items: {},
  };

  const lists = await Promise.all(sources.map(generateItemList));
  for (const list of lists) {
    filterDB.items[list.name] = list;
  }

  fs.writeFileSync('filterdb.json', JSON.stringify(filterDB, null, 2));
})();
