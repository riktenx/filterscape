import fs from 'fs';
import slayerIndex from './module/slayer/index.json' with { type: 'json' };
import bossIndex from './module/boss/index.json' with { type: 'json' };

fs.writeFileSync('index.json', JSON.stringify({
  type: 'filter',
  name: 'riktenx/filterscape',
  description: 'All-in-one loot filter for main account gameplay.',
  modules: [
    { 'modulePath': 'module/highlights/module.json' },
    { 'modulePath': 'module/hides/module.json' },
    ...slayerIndex,
    ...bossIndex,
    { "modulePath": "module/cox/module.json" },
    { "modulePath": "module/toa/module.json" },
    { "modulePath": "module/unique/module.json" },
    { "modulePath": "module/potion/module.json" },
    { "modulePath": "module/value/module.json" },
    { "modulePath": "module/currency/module.json" },
    { "modulePath": "module/clue/module.json" },
    { "modulePath": "module/herb/module.json" }
  ],
}, null, 2));
