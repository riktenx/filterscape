import fs from 'fs';

const modulePath = process.argv[2];

const rs2f = fs.readFileSync(`${modulePath}/module.rs2f`, 'utf-8');
const mod = JSON.parse(fs.readFileSync(`${modulePath}/module.json`, 'utf-8'));

const modIdent = mod.name.toLowerCase().replaceAll(' ', '_');

let header = `
/*@ define:module:${modIdent}
---
name: ${mod.name}
`;
if (!!mod.subtitle) {
  header += `subtitle: ${mod.subtitle}\n`;
}
if (!!mod.description) {
  const description = mod.description
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');
  header += `description: |
${description}
`;
}
header += '*/';

const lines = rs2f.split('\n');

const migrated = [header];

for (const line of lines) {
  if (line.startsWith('// module') || line.startsWith('// endmodule')) {
    continue; // don't HAVE to remove it, but cleans up the migrated output
  }

  if (!line.startsWith('#define')) {
    migrated.push(line);
    continue;
  }

  const [_, ident] = line.split(' ');
  const input = mod.inputs.find(input => input.macroName === ident);
  if (!input) {
    migrated.push(line);
    continue;
  }

  let inputDefine = `/*@ define:input:${modIdent}
type: ${input.type}
label: ${input.label}
`;
  if (!!input.group) {
    inputDefine += `group: ${input.group}\n`;
  }
  if (!!input.exampleItem) {
    inputDefine += `exampleItem: ${input.exampleItem}\n`;
  }
  if (!!input.enum) {
    inputDefine += `enum: ${JSON.stringify(input.enum, null, 2)}\n`;
  }
  inputDefine += '*/';

  migrated.push(inputDefine);
  migrated.push(line + '\n');
}

fs.writeFileSync(`${modulePath}/module_migrated.rs2f`, migrated.join('\n'));
