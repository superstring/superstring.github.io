/** K.Arthur 14/03/2020 */
const { src, dest } = require('gulp');
const gRename = require('gulp-rename');
const gReplace = require('gulp-replace');

// option
const option = {
  author: 'Superstring',
  date: '',
  title: '',
  content: ''
};
(function() {
  process.argv.forEach((arg, idx) => {
    if (/^--/.test(arg)) {
      const key = arg.substr(2);
      const value = process.argv[idx + 1];
      option[key] = value;
    }
  });
})();

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
    '_' +
    guid()
  );
}

function getContent() {
  return option.content;
}

// gulp-task: new life
function gtArticle(type = 'life') {
  return () =>
    src('template/article.html')
      .pipe(gReplace('_AUTHOR_', getAuthor()))
      .pipe(gReplace('_DATE_', getDate()))
      .pipe(gReplace('_TITLE_', type.toUpperCase()))
      .pipe(gReplace('_CONTENT_', getContent()))
      .pipe(gRename(path => (path.basename = getTitle(type))))
      .pipe(dest(`collection/${type}`));
}

exports.life = gtArticle('life');
exports.tech = gtArticle('technology');
