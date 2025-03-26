import fs from 'fs';

const source = fs.readFileSync('wikisource', 'utf8');

const lines = source.split('\n');

let currentList;
let lists = {};

lines.forEach(line => {
  if (line.startsWith('===') && line.endsWith('===')) {
    currentList = line.substring(3, line.length - 3);
    console.log(currentList);
    lists[currentList] = [];
    return;
  }

  const [preamble, nameDecl] = line.split('|');
  if (preamble !== '{{DropsLine' || !nameDecl || !nameDecl.startsWith('name=')) {
    return;
  }

  const [_, name] = nameDecl.split('=');
  lists[currentList].push(name);
});

const out = Object.entries(lists).map(([category, items]) => {
  const jvalue = JSON.stringify(items);
  const ident = category.split(' ')[0].toUpperCase();
  return `// label:${category}
// enum:${jvalue}}
#define VAR_MOD_ENUMLIST_FILTER_${ident} []
if (name:VAR_MOD_ENUMLIST_FILTER_${ident}) {
  hidden = true;
}
`
}).join('\n\n');

fs.writeFileSync('lists', out);
