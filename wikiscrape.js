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

const computeMapArea = (points, plane) => {
  if (points.length === 0) {
    return [-1, -1, -1, -1, -1, -1];
  }

  let x0 = points[0].x;
  let y0 = points[0].y;
  let x1 = points[0].x;
  let y1 = points[0].y;

  for (const point of points) {
    x0 = Math.min(x0, point.x);
    y0 = Math.min(y0, point.y);
    x1 = Math.max(x1, point.x);
    y1 = Math.max(y1, point.y);
  }

  return [x0, y0, plane, x1, y1, plane];
};

const parseLocLineProperty = (line) => {
  const [_, value] = line.substring(1).split('=');
  return value.trim();
}

const parseLocLinePoints = (line) => {
  var pointDecls = line.substring(1);
  var parts = pointDecls.split('|');
  return parts.map(part => {
    const [xDecl, yDecl] = part.split(',');
    const [_, xStr] = xDecl.split(':');
    const [__, yStr] = yDecl.split(':');
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    return { x, y };
  });
};

export const buildMapAreas = (wikiSource) => {
  const lines = wikiSource.split('\n');
  let areas = {};

  let inLocLine = false;
  let current;
  for (const line of lines) {
    if (line === '{{LocLine') {
      inLocLine = true;
      current = { name: '', plane: -1, points: [] };
    }

    if (!inLocLine) {
      continue;
    }

    if (line.startsWith('|location')) {
      current.name = parseLocLineProperty(line);
    } else if (line.startsWith('|plane')) {
      current.plane = parseInt(parseLocLineProperty(line));
    } else if (line.startsWith('|x')) {
      current.points = parseLocLinePoints(line);
    }

    if (line === '}}' && inLocLine) { // flush
      inLocLine = false;
      areas[current.name] = computeMapArea(current.points, current.plane);
    }
  }

  return areas;
}

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
    if (!lists[currentList].includes(name)) {
      lists[currentList].push(name);
    }
  }

  return lists;
};
