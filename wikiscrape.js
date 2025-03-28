import https from 'https';

https.get('https://oldschool.runescape.wiki/w/Nex?action=raw', {
  headers: {
    'user-agent': 'riktenx/filterscape',
  },
}, resp => {
  let data = '';

  if (resp.statusCode !== 200) {
    throw new Error('http ' + resp.statusCode);
  }

  resp.on('data', d => data += d);
  resp.on('end', () => console.log(data));
});

