var debug = require('debug')('app')
var path = require('path')
var open = require('open')

const methods = {
  kebabToCamel: (myString) => {
    return myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() })
  },
  snakeToCamel: (s) => {
    return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase()})
  },
  componentCodeFromName: (componentObject) => {
    return componentObject.name ? ('<' + componentObject.name + '></' + componentObject.name + '>') : ''
  },
  getProperComponentName: (componentObject, componentFileName) => {
    if (!componentObject.name) {
      return componentFileName.split('.')[0]
    }
    return module.exports.kebabToCamel(componentObject.name)
  },
  showIfAny: (obj) => obj ? Object.keys(obj) : [],
  capitalizeFirstLetter: (str) => {
    return str[0].toUpperCase() + str.substr(1)
  },
  logParsingError: (error) => {
    debug(error)
  },
  fileNamesAreComplimentary: (filesArray) => {
    const f1 = path.basename(filesArray[ 0 ])
    const f2 = path.basename(filesArray[ 1 ])
    if ((f1.split('.')[ 0 ] == f2.split('.')[ 0 ]) && (f1.split('.')[ 1 ] != f2.split('.')[ 1 ])) return true
    return false
  },
  openBrowser: (fullLocalPath) => open(fullLocalPath)
}
module.exports = methods
