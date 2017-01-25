/*
* vue single file components parser
* from vue-loader
*/
var compiler = require('vue-template-compiler')
var cache = require('lru-cache')(100)
var hash = require('hash-sum')

var splitRE = /\r?\n/g
var emptyRE = /^(?:\/\/)?\s*$/

module.exports = function (content, filename, needMap) {
  var cacheKey = hash(filename + content)
  // source-map cache busting for hot-reloadded modules
  var filenameWithHash = filename + '?' + cacheKey
  var output = cache.get(cacheKey)
  if (output) return output
  output = compiler.parseComponent(content, { pad: true })
  if (needMap) {
    if (output.script && !output.script.src) {
      output.script.map = generateSourceMap(
        filenameWithHash,
        content,
        output.script.content
      )
    }
    if (output.styles) {
      output.styles.forEach(style => {
        if (!style.src) {
          style.map = generateSourceMap(
            filenameWithHash,
            content,
            style.content
          )
        }
      })
    }
  }
  cache.set(cacheKey, output)
  return output
}
