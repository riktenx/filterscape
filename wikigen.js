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
  return `// ${category}
// ${JSON.stringify(items)}`
}).join('\n\n');

fs.writeFileSync('lists', out);
