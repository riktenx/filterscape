import fs from 'fs';

const renderDefault = (input) => {
  switch (input.type) {
    case 'number':
      return input.default || 0;
    case 'boolean':
      return input.default || false;
    case 'stringlist':
    case 'enumlist':
      return JSON.stringify(input.default || []);
    case 'style':
      return renderStyle(input.default || {});
    default:
      throw new Error(`unhandled renderDefault '${input.type}'`);
  }
};

const renderStyle = (style) => {
  const props = [
    renderStyleColor('textColor', style.textColor),
    renderStyleColor('backgroundColor', style.backgroundColor),
    renderStyleColor('borderColor', style.borderColor),
    renderStyleColor('textAccentColor', style.textAccentColor),
    renderStyleColor('lootbeamColor', style.lootbeamColor),
    renderStyleColor('menuTextColor', style.menuTextColor),
    renderStyleColor('tileStrokeColor', style.tileStrokeColor),
    renderStyleColor('tileHighlightColor', style.tileHighlightColor),
    renderStyleInt('textAccent', style.textAccent),
    renderStyleInt('fontType', style.fontType),
    renderStyleBool('showLootbeam', style.showLootbeam),
    renderStyleBool('showValue', style.showValue),
    renderStyleBool('showDespawn', style.showDespawn),
    renderStyleBool('notify', style.notify),
    renderStyleBool('hideOverlay', style.hideOverlay),
    renderStyleBool('highlightTile', style.highlightTile),
    renderStyleString('sound', style.sound),
  ];

  const actualProps = props.filter(prop => !!prop);
  return actualProps.length > 0
    ? '\\\n  ' + actualProps.join('\\\n  ')
    : '';
}

const renderStyleColor = (name, value) =>
  !!value ? `${name} = "${value}";` : '';

const renderStyleInt = (name, value) =>
  !!value ? `${name} = ${value};` : '';

const renderStyleBool = (name, value) =>
  !!value ? `${name} = ${value};` : '';

const renderStyleString = (name, value) =>
  !!value ? `${name} = "${value}";` : '';

const modulePath = process.argv[2];

const filename = process.argv[3] || 'module';

const rs2f = fs.readFileSync(`${modulePath}/${filename}.rs2f`, 'utf-8');
const mod = JSON.parse(fs.readFileSync(`${modulePath}/${filename}.json`, 'utf-8'));

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
  migrated.push(`#define ${ident} ${renderDefault(input)}\n`);
}

fs.writeFileSync(`${modulePath}/${filename}.rs2f`, migrated.join('\n'));
fs.rmSync(`${modulePath}/${filename}.json`);
