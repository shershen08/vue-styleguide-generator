var path = require('path');
var walker = require('./walker');

const locale = 'en'//todo:use some system var
const localeFileName = locale + '.json'

var localeFile = require(path.resolve(__dirname, '..', 'i18n', localeFileName))

const mainMethod = (callOptions) => {
  const options  = Object.assign({}, callOptions, {
    i18n: localeFile
  })
  walker.iterateComponentsFolder(options.src, options.dest, options);
}

module.exports = {
  run : mainMethod
}
