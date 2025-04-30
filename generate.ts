import fs from 'fs';

import { FragmentGeneratorBase } from './filterdb/fragmentgenerator.ts';

import db from './filterdb.json' with { type: 'json' };

const MODULE_PATH = './module';

(async function () {
  const files = fs.readdirSync(MODULE_PATH, {
    recursive: true,
    withFileTypes: true,
  });

  const codegenModules = files
    .filter((f) => f.isDirectory())
    .map((f) => `${f.parentPath}/${f.name}`)
    .filter((path) => fs.existsSync(`${path}/index.ts`));

  for (const mod of codegenModules) {
    const Generator = (await import(`${mod}/index.ts`)).default!!;
    const generator = new Generator();
    if (!(generator instanceof FragmentGeneratorBase)) {
      console.log(generator);
      throw new Error(
        `${mod}: generator does not implement FragmentGeneratorBase`
      );
    }

    const rs2f = generator.generate(db);
    fs.writeFileSync(`${mod}/module.rs2f`, rs2f);
  }
})();
