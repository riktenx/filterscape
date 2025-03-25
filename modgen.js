const fs = require('fs');

const parseStyle = (value) => {
  const style = {};
  const parts = value.split(';');

  parts.forEach(part => {
    const [k, v] = part.split('=').map(s => s.trim());
    style[k] = v;
  });

  return style;
};

const parseDefault = (type, value) => {
  if (type === 'NUMBER') {
    return parseInt(value);
  } else if (type === 'BOOLEAN') {
    return value === 'true';
  } else if (type === 'STYLE') {
    return parseStyle(value);
  } else if (type === 'STRINGLIST') {
    return JSON.parse(value);
  }
  throw new Error(`idk what type "${type}" is`);
};

const rs2f = fs.readFileSync('module.rs2f', 'utf8');

const lines = rs2f.split('\n');

const moduleData = {
  name: 'TODO',
  rs2fPath: 'module.rs2f',
  inputs: [],
};

lines.forEach(line => {
  if (line.startsWith('// module:')) {
    const [_, moduleName] = line.split(':');
    moduleData.name = moduleName;
    return;
  }

  if (!line.startsWith('#define')) {
    return;
  }

  const [_, ident, ...vvalue] = line.split(' ');
  const value = vvalue.join(' ');
  console.log(ident, value);

  const [decl, __, type, group, name] = ident.split('_', 4);
  if (decl !== 'VAR') {
    console.log('skip', ident);
    return;
  }

  console.log(group, type, value);

  moduleData.inputs.push({
    type: type.toLowerCase(),
    group: group,
    label: ident,
    macroName: ident,
    default: parseDefault(type, value),
  });
});

const moduleJson = JSON.stringify(moduleData, null, 2);
fs.writeFileSync('module.json', moduleJson);
