import https from 'https';

export const getWikiSource = (url) => new Promise((resolve, reject) => {
  const options = {
    headers: { 'user-agent': 'riktenx/filterscape' },
  };

  https.get(`${url}?action=raw`, options, resp => {
    if (resp.statusCode !== 200) {
      return reject(new Error('http ' + resp.statusCode));
    }

    let data = '';
    resp.on('data', d => {
      data += d;
    });
    resp.on('end', () => resolve(data));
  });
});

export const buildDropTable = (wikiSource) => {
  const lines = wikiSource.split('\n');
  let currentList;
  let lists = {};

  for (const line of lines) {
    if (line.startsWith('===') && line.endsWith('===')) {
      currentList = line.substring(3, line.length - 3);
      if (!lists[currentList]) {
        lists[currentList] = [];
      }
      continue;
    }

    const [preamble, nameDecl] = line.split('|');
    if (preamble !== '{{DropsLine' || !nameDecl || !nameDecl.startsWith('name=')) {
      continue;
    }

    const [_, name] = nameDecl.split('=');
    lists[currentList].push(name);
  }

  return lists;
};
