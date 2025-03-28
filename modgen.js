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
  } else if (type === 'STRINGLIST' || type === 'ENUMLIST') {
    return JSON.parse(value);
  }
  throw new Error(`idk what type "${type}" is`);
};

const toCategoryName = (str) => str.split(' ')[0].replace('%', '').toUpperCase();

const toAreaMacroIdent = (str) => str
  .toUpperCase()
  .replace("'", '')
  .replaceAll(' ', '')
  .replaceAll('-', '');

export const generateRs2f = (name, area, dropTable) => {
  let rs2f = '';

  rs2f += `// module:${name}`;
  rs2f += '\n\n';

  const areaIdent = toAreaMacroIdent(name);
  const areaDefine = JSON.stringify(area);
  rs2f += `#define CONST_AREA_${areaIdent} ${areaDefine}`;
  rs2f += '\n';
  rs2f += `#define CONST_${areaIdent}_IF(_cond) if (area:CONST_AREA_${areaIdent} && (_cond))`;
  rs2f += '\n\n';

  rs2f += Object.entries(dropTable).map(([category, items]) => {
    if (items.length === 0) {
      return '';
    }

    const jvalue = JSON.stringify(items);
    const ident = toCategoryName(category);
    return `// label:${category}
// enum:${jvalue}
#define VAR_MOD_ENUMLIST_FILTER_${ident} []
CONST_${areaIdent}_IF (name:VAR_MOD_ENUMLIST_FILTER_${ident}) {
  hidden = true;
}`;
  }).join('\n\n');

  rs2f += '\n\n';
  rs2f += `// endmodule:${name}`;

  return rs2f;
};

export const generateJson = (rs2f) => {
  const lines = rs2f.split('\n');

  const moduleData = {
    name: 'TODO',
    rs2fPath: 'module.rs2f',
    inputs: [],
  };

  let nextProps = {};

  lines.forEach(line => {
    if (line.startsWith('// module:')) {
      const [_, moduleName] = line.split(':');
      moduleData.name = moduleName;
      return;
    }

    if (line.startsWith('// ')) {
      const [prop, value] = line.substring(3).split(':');
      nextProps[prop] = value;
      return;
    }

    if (!line.startsWith('#define')) {
      return;
    }

    const [_, ident, ...vvalue] = line.split(' ');
    const value = vvalue.join(' ');

    const [decl, __, type, group] = ident.split('_', 4);
    if (decl !== 'VAR') {
      return;
    }

    const m = {
      type: type.toLowerCase(),
      group: group,
      label: ident,
      macroName: ident,
      default: parseDefault(type, value),
      ...nextProps,
    };
    if (!!m.enum) {
      m.enum = JSON.parse(m.enum);
    }

    moduleData.inputs.push(m);
    nextProps = {};
  });

  return moduleData;
};
