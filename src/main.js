var path = require('path');
var walker = require('./walker');

const locale = 'en'//todo:use some system var
const localeFileName = locale + '.json'

var localeFile = require(path.resolve('i18n', localeFileName));

const mainMethod = (from, to, callOptions) => {
  const options  = Object.assign({}, callOptions, {
    i18n: localeFile
  })
  walker.iterateComponentsFolder(from, to, options);
}

module.exports = {
  run : mainMethod
}
