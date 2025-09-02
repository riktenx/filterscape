// old gen script
// todo: migrate to ts
import fs from 'fs';

const index = {
  type: 'filter',
  name: 'riktenx/filterscape',
  description: 'All-in-one loot filter for main account gameplay.',
  modules: [
    { modulePath: 'module/general/module.json' },
    { modulePath: 'module/junk/module.json' },
    { modulePath: 'module/slayer/module.json' },
    { modulePath: 'module/boss/module.json' },
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

const oldDefaultHeader = `/*@ define:module:header
hidden: true
name: header
*/
meta {
  name = "[default: FilterScape]";
}
`;
const oldDefaultFilter = [
  oldDefaultHeader,
  ...index.modules.map((module) => {
    const rs2fPath = module.modulePath.replace('json', 'rs2f');
    return fs.readFileSync(rs2fPath, 'utf-8');
  }),
].join('\n\n');
fs.writeFileSync('filterscape.rs2f', oldDefaultFilter);

const defaultHeader = `/*@ define:module:header
hidden: true
name: header
*/
meta {
  name = "[default: Rikten's filter]";
}
`;
const defaultFilter = [
  defaultHeader,
  ...index.modules.map((module) => {
    const rs2fPath = module.modulePath.replace('json', 'rs2f');
    return fs.readFileSync(rs2fPath, 'utf-8');
  }),
].join('\n\n');
fs.writeFileSync('default.rs2f', defaultFilter);

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
