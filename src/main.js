var path = require('path');
var walker = require('./walker');

const getLocaleFile = (localeValue) => {
  const localeFileName = localeValue + '.json'
  return require(path.resolve(__dirname, '..', 'i18n', localeFileName));
}

const mainMethod = (callOptions) => {
  const options  = Object.assign({}, callOptions, {
    i18n: getLocaleFile(callOptions.locale)
  })
  walker.iterateComponentsFolder(options.src, options.dest, options);
}

module.exports = {
  run : mainMethod
}
