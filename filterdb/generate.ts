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
  pattern: RegExp;
  transform: (match: string) => string[];
};

const getWikiSource = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const options = {
      headers: { 'user-agent': 'riktenx/filterscape' },
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

const equipmentList = (
  name: string,
  url: string | string[]
): ItemListSource => ({
  name,
  url: typeof url === 'string' ? WIKI + url : url.map((u) => WIKI + u),
  capture: [
    {
      pattern: /{{Infotable Bonuses\|.+}}/g,
      transform: (match) =>
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

(async function () {
  const sources: ItemListSource[] = [
    equipmentList('EQUIP_BRONZE', 'Bronze_equipment'),
    equipmentList('EQUIP_IRON', 'Iron_equipment'),
    equipmentList('EQUIP_STEEL', 'Steel_equipment'),
    equipmentList('EQUIP_BLACK', 'Black_equipment'),
    equipmentList('EQUIP_ADAMANT', 'Adamant_equipment'),
    equipmentList('EQUIP_RUNE', 'Rune_equipment'),
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
