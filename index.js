var path = require('path')
var parse = require('./lib/parser')
var fs = require('fs')
var babel = require('babel-core')
const vm = require('vm')
const util = require('util')
// var args = process.argv.slice(2)

// 1 load
// /replace with comand line or some more inteligent way
let filename = 'VueSound.vue'
let loadFile = './example-components/' + filename
let vueFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})

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

console.log('\n\nComponent', filename)
console.log('conponent name:', component.name)
console.log('conponent props:', Object.keys(component.props))
console.log('conponent methods:', Object.keys(component.methods))
