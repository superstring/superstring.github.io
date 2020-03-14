/** K.Arthur 14/03/2020 */
const fs = require('fs');
const path = require('path');
const { src, dest } = require('gulp');
const gRename = require('gulp-rename');
const gReplace = require('gulp-replace');
const gZip = require('gulp-zip');
const gDel = require('del');

// option
const dataJson = 'index.json';
const option = {
  type: 'life',
  author: 'Superstring',
  date: '',
  title: '',
  subtitle: '',
  content: ''
};
(function() {
  process.argv.forEach((arg, idx) => {
    if (/^--/.test(arg)) {
      const key = arg.substr(2);
      const value = process.argv[idx + 1];

      if (key === 'file') {
        option.content = readContent(value);
      } else {
        option[key] = value;
      }
    }
  });
})();

function readContent(filePath) {
  if (!fs.existsSync(filePath)) {
    return '';
  } else {
    return fs.readFileSync(filePath, { encoding: 'utf-8' });
  }
}

function updateIndexJson(type, info = { title, subtitle, url, cover }) {
  fs.readFile(dataJson, 'utf-8', (err, data) => {
    const blog = JSON.parse(data);
    if (!blog[type]) {
      blog[type] = {
        card: [
          {
            cover: getCover(),
            title: '',
            subtitle: '',
            url: ''
          },
          {
            cover: getCover(),
            title: '',
            subtitle: '',
            url: ''
          }
        ],
        list: []
      };
    }

    blog[type].card[1] = blog[type].card[0];
    blog[type].card[0] = info;
    blog[type].list = [info, ...blog[type].list];
    fs.writeFileSync(dataJson, JSON.stringify(blog));
  });
}

function capital(str) {
  return str.length >= 2 ? str.substr(0, 1).toUpperCase() + str.substr(1) : str;
}

function guid() {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

function getAuthor() {
  return option.author;
}

function getDate() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getTitle(type) {
  const d = new Date();
  return (
    type +
    '-' +
    (option.title || `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`) +
    '-' +
    guid()
  );
}

function getContent() {
  return option.content;
}

function getCover() {
  return `https://picsum.photos/520?${guid()}`;
}

// gulp-task: new life
function gtArticle() {
  const type = option.type;
  const title = capital(option.title);
  const subtitle = option.subtitle;
  const cover = getCover();
  const fileName = getTitle(type);
  const url = `collection/${type}/${fileName}.html`;
  updateIndexJson('life', { url, title, subtitle, cover });
  return src('template/article.html')
    .pipe(gReplace('_AUTHOR_', getAuthor()))
    .pipe(gReplace('_DATE_', getDate()))
    .pipe(gReplace('_TITLE_', title))
    .pipe(gReplace('_SUBTITLE_', subtitle))
    .pipe(gReplace('_CONTENT_', getContent()))
    .pipe(gRename(path => (path.basename = fileName)))
    .pipe(dest(`collection/${type}`));
}

// backup
function gtBackup() {
  return src('collection/*')
    .pipe(gZip(`archive-${getDate()}.zip`))
    .pipe(dest('archive'));
}

// clean
function gtClean(cb) {
  fs.writeFileSync(dataJson, '{}');
  return gDel('collection/**/*', cb);
}

// correct
function correct(filePath = '') {
  const basename = path.basename(filePath);
  if (basename !== '.gitkeep') {
    basenameArray = basename.split('-');
    const type = basenameArray[0];
    const url = `./collection/${type}/${basename}`;
    const title = basenameArray[1];
    const subtitle = '';
    const cover = getCover();
    updateIndexJson(type, { title, subtitle, url, cover });
  }
}
function retrieveCollection(rootPath, callback) {
  const root = path.resolve(rootPath);
  fs.readdir(root, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(fileName => {
        const filePath = path.join(root, fileName);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            if (stats.isFile()) {
              callback(filePath);
            } else if (stats.isDirectory()) {
              retrieveCollection(filePath, callback);
            }
          }
        });
      });
    }
  });
}
function gtCorrect() {
  fs.writeFileSync(dataJson, '{}');
  return retrieveCollection('./collection', correct);
}

exports.default = gtArticle;
exports.correct = gtCorrect;
exports.backup = gtBackup;
exports.clean = gtClean;