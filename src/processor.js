var parse = require('./parser')
var babel = require('babel-core')
const vm = require('vm')
const util = require('util')

module.exports = {
  processComponent: (content) => {
    const jscode = getComponentModuleJSCode(content)
    if(!jscode) return;
    const babelifycode = babelifyCode(jscode)
    return evalComponentCode(babelifycode.code)
  }
}

const babelifyCode = (code) => {
  const options = {
    ast: false,
    comments: false,
    presets: ['es2015']
  }
  return babel.transform(code, options)
}
const getComponentModuleJSCode = (file) => {
  var parts = parse(file, 'name', false)
  return parts.script ? parts.script.content : '';
}

const evalComponentCode = (code) => {
  const sandbox = {
    exports: {},
    require: function () {},
    window: {},
    console: {
      log: function () {}
    }
  }
  const script = new vm.Script(code, {})
  const context = new vm.createContext(sandbox)
  script.runInContext(context)
  const runResults = util.inspect(sandbox)
  return sandbox.exports.default
}
