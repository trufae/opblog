const pp = require ('./pp');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const firstline = require ('firstline');
const path = require ('path');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const readTimestamp = async (function (file) {
  const firstLine = await(firstline(file));
  if (firstLine.substring(0, 2) === '# ') {
    return firstLine.substring(2);
  }
  return null;
});

function sortByTimestamp(mds) {
  return mds.sort((x,y) => {
    return x.timestamp < y.timestamp;
  });
}

function readPost(file) {
  const str = '' + fs.readFileSync(file);
  const nl = str.indexOf('\n');
  return (nl !== -1)? str.substring(nl + 1): str;
}

const parsePosts = async (function () {
  const mds = [];
  const files = fs.readdirSync('d');
  files.forEach(file => {
    const filePath = path.join('d', file);
    const ts = await (readTimestamp(filePath));
    if (ts !== null) {
      const body = readPost(filePath);
      const htmlPath = path.join('o', file.replace(/.md$/, '.html'));
      mds.push({
        name: file.replace(/\..*$/, ''),
        fileName: file,
        timestamp: ts,
        contents: body,
        htmlPath: htmlPath
      });
    }
  });
  return sortByTimestamp(mds);
})

try {
  fs.mkdirSync('o');
} catch (e) {
  /* do nothing */
}
parsePosts().then(function(results) {
  results.forEach(post => {
    pp('t/post.tmpl', post, results);
  });
});
