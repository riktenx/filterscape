import * as https from 'https';

import * as mediawiki from './mediawiki';

export const getWikiSource = (url: string): Promise<string> =>
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

export type Module = {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  src: ModuleSource;
};

export type ModuleSource = {
  url: string | string[];
  capture: SourceCapture[];
};

export type SourceCapture = {
  pattern: RegExp;
  transform: (match: string) => string;
};

const clueStep: Module = {
  id: 'cluestep',
  name: 'Clue step items',
  src: {
    url: 'https://oldschool.runescape.wiki/w/STASH',
    capture: [
      {
        pattern: /{{GEP\|[A-Za-z0-9' ]+}}/g, // {{GEP|Leather gloves}}
        transform: (match: string): string =>
          match.replace('{{GEP|', '').replace('}}', ''),
      },
    ],
  },
};

export const generate = async (module: Module): Promise<string> => {
  const source =
    typeof module.src.url === 'string'
      ? await getWikiSource(module.src.url)
      : (await Promise.all(module.src.url.map(getWikiSource))).join('\n');

  const sections = mediawiki.parseSections(source);
  const model: Record<string, string[]> = {};

  for (const section of sections) {
    model[section.name] = [];
    for (const capture of module.src.capture) {
      const match = section.text.match(capture.pattern);
      if (match === null) {
        continue;
      }

      model[section.name] = [
        ...model[section.name],
        ...match.map(capture.transform),
      ];
    }
  }

  for (const [section, items] of Object.entries(model)) {
    if (items.length === 0) {
      delete model[section];
    } else {
      model[section] = [...new Set(items)];
    }
  }

  console.log(model);

  const rs2f = module.id;
  return rs2f;
};

generate(clueStep);
