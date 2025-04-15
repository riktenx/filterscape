const parseStyle = (value) => {
  const style = {};
  const parts = value.split(';');

  parts.forEach(part => {
    const [k, v] = part.split('=').map(s => s.trim());
    if (k === 'fontType' || k === 'textAccent') {
      style[k] = parseInt(v);
    } else if (k === 'showLootbeam') {
      style[k] = v === 'true';
    } else if (v !== undefined) {
      style[k] = v.substring(1, v.length - 1);
    }
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

const toMacroIdent = (str) => str
  .replace(/\W/g, '')
  .toUpperCase();

const generateMultiAreaCond = (moduleScope, areas) => {
  let rs2f = '';

  let index = 0;
  const idents = [];
  for (const [name, area] of Object.entries(areas)) {
    const ident = `CONST_AREA_${moduleScope}${index}`;
    rs2f += `#define ${ident} ${JSON.stringify(area)} // ${name}`;
    rs2f += '\n';
    idents.push(ident);
    ++index;
  }

  const areasExpr = idents
    .map(ident => `area:${ident}`)
    .join(' || \\\n  ');
  rs2f += `#define CONST_${moduleScope}_RULE(_cond) rule ((${areasExpr}) && (_cond))`;

  return rs2f;
};

const toModuleName = (str) => str
  .toLowerCase()
  .replace("'", '')
  .replaceAll(' ', '');

export const generateRs2f = (name, area, dropTable, transform) => {
  const moduleName = toModuleName(name);

  let rs2f = '';

  rs2f += `
/*@ define:module:${moduleName}
name: ${name}
*/`;
  rs2f += '\n\n';

  const moduleScope = toMacroIdent(name);
  if (!!transform.preScript) {
    rs2f += transform.preScript(moduleScope);
    rs2f += '\n\n';
  }

  if (typeof area[0] === 'number') {
    const areaDefine = JSON.stringify(area);
    rs2f += `#define CONST_AREA_${moduleScope} ${areaDefine}`;
    rs2f += '\n';
    rs2f += `#define CONST_${moduleScope}_RULE(_cond) rule (area:CONST_AREA_${moduleScope} && (_cond))`;
    rs2f += '\n\n';
  } else {
    rs2f += generateMultiAreaCond(moduleScope, area);
    rs2f += '\n\n';
  }

  rs2f += Object.entries(dropTable).map(([category, items]) => {
    if (items.length === 0) {
      return '';
    }

    const defaults = !!transform.getDefaults
      ? transform.getDefaults(dropTable)[category] || []
      : [];
    const jvalue = JSON.stringify(items);
    const ident = toMacroIdent(category);
    // some categories parse with additional = surrounding the mediawiki section, just chop that off for now
    return `/*@ define:input:${moduleName}
type: enumlist
label: ${category.startsWith('=') ? category.substring(1, category.length - 1) : category}
group: Hide drops
enum: ${jvalue}
*/
#define VAR_${moduleScope}_ENUMLIST_FILTER_${ident} ${JSON.stringify(defaults)}
CONST_${moduleScope}_RULE (name:VAR_${moduleScope}_ENUMLIST_FILTER_${ident}) {
  hidden = true;
}`;
  }).filter(it => !!it).join('\n\n');

  rs2f += '\n\n';
  rs2f += `// endmodule:${name}`;

  return rs2f;
};
