var path = require('path')
var generator = require('./generator')

const getLocaleFile = (localeValue) => {
  const localeFileName = localeValue + '.json'
  return require(path.resolve(__dirname, '..', 'i18n', localeFileName))
}

const mainMethod = (callOptions) => {
  console.time();
  const options = Object.assign({}, callOptions, {
    i18n: getLocaleFile(callOptions.locale)
  })
  generator.iterateComponentsFolder(options)
}

module.exports = {
  run: mainMethod
}
