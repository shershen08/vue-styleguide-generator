var parse = require('./lib/parser')
var babel = require('babel-core')
const vm = require('vm')
const util = require('util')

// export default class Processor

const processComponent = (content) => {
  let tmp = getComponentModuleCode(content)
  getVariables(tmp)

/*

// 2 parse
var parts = parse(vueFile, 'name', false)
var componentScript = parts.script.content

// 3 babel
const options = {
ast: false,
comments: false,
presets: ['es2015']
}
var result = babel.transform(componentScript, options)

// 4 safe eval
const sandbox = {
exports: {}
}
const script = new vm.Script(result.code, {})
const context = new vm.createContext(sandbox)
script.runInContext(context)
const runResults = util.inspect(sandbox)
const component = sandbox.exports.default

*/
}

const getComponentModuleCode = () => {
}

const getComponentVariables = () => {
}
