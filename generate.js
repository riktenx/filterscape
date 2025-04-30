import fs from 'fs';

import slayerIndex from './module/slayer/index.json' with { type: 'json' };
import bossIndex from './module/boss/index.json' with { type: 'json' };

const index = {
  type: 'filter',
  name: 'riktenx/filterscape',
  description: 'All-in-one loot filter for main account gameplay.',
  modules: [
    { modulePath: 'module/readme/module.json' },
    { modulePath: 'module/ownership/module.json' },
    { modulePath: 'module/defaults/module.json' },
    { modulePath: 'module/highlights/module.json' },
    { modulePath: 'module/hides/module.json' },
    { modulePath: 'module/junk/module.json' },
    ...slayerIndex,
    ...bossIndex,
    { modulePath: 'module/cox/module.json' },
    { modulePath: 'module/toa/module.json' },
    { modulePath: 'module/shadesofmortton/module.json' },
    { modulePath: 'module/defender/module.json' },
    { modulePath: 'module/unique/module.json' },
    { modulePath: 'module/potion/module.json' },
    { modulePath: 'module/clue/module.json' },
    { modulePath: 'module/herb/module.json' },
    { modulePath: 'module/currency/module.json' },
    { modulePath: 'module/value/module.json' },
  ],
};

const header = `/*@ define:module:header
hidden: true
name: header
*/
meta {
  name = "[default: FilterScape]";
}
`;

const defaultFilterscape = [
  header,
  ...index.modules.map((module) => {
    const rs2fPath = module.modulePath.replace('json', 'rs2f');
    return fs.readFileSync(rs2fPath, 'utf-8');
  }),
].join('\n\n');

fs.writeFileSync('filterscape.rs2f', defaultFilterscape);

const header2 = `/*@ define:module:header
hidden: true
name: header
*/
meta {
  name = "riktenx/filterscape";
}
`;

const defaultFilterscape2 = [
  header2,
  ...index.modules.map((module) => {
    const rs2fPath = module.modulePath.replace('json', 'rs2f');
    return fs.readFileSync(rs2fPath, 'utf-8');
  }),
].join('\n\n');

fs.writeFileSync('filter.rs2f', defaultFilterscape2);
