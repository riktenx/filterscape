import fs from 'fs';

import { getWikiSource, buildDropTable, buildMapAreas } from './wikiscrape.js';
import { generateRs2f } from './modgen.js';

const toModuleName = (str) => str
  .toLowerCase()
  .replace("'", '')
  .replaceAll(' ', '');

export const cmdGenerateModGroup = async (groupName, index) => {
  const modulePath = `module/${groupName}`

  const rs2fs = [];
  rs2fs.push(`/*@ define:module:boss
name: PvM: ${groupName}
*/

`);

  for (const mod of index) {
    if (!mod.url) {
      console.log('skip', mod.name);
      continue;
    }

    console.log('generate', mod.name, '...');

    if (!mod.transform) {
      mod.transform = {};
    }

    const wikiSource = typeof mod.url === 'string'
      ? await getWikiSource(mod.url)
      : (await Promise.all(mod.url.map(url => getWikiSource(url)))).join('\n');

    const dropTable = buildDropTable(wikiSource);
    const mapAreas = buildMapAreas(wikiSource);
    if (mod.area === undefined) {
      mod.area = mapAreas;
    }

    if (!!mod.transform.updateDropTable) {
      mod.transform.updateDropTable(dropTable);
    }
    if (!!mod.transform.updateMapAreas) {
      mod.transform.updateMapAreas(mapAreas);
    }

    const moduleName = toModuleName(mod.name);

    const rs2f = generateRs2f(mod.name, mod.area, dropTable, mod.transform);
    rs2fs.push(rs2f);


    fs.writeFileSync(`${modulePath}/${groupName}.wikiSource`, wikiSource);
    fs.writeFileSync(`${modulePath}/${groupName}.dropTable`, JSON.stringify(dropTable, null, 2));
    fs.writeFileSync(`${modulePath}/${groupName}.mapAreas`, JSON.stringify(mapAreas, null, 2));
  }

  fs.writeFileSync(`${modulePath}/module.rs2f`, rs2fs.join('\n'));
}
