/*
* vue single file components parser
* from vue-loader
*/
var compiler = require('vue-template-compiler')
var cache = require('lru-cache')(100)
var hash = require('hash-sum')

module.exports = function (content, filename) {
  var cacheKey = hash(filename + content)
  // source-map cache busting for hot-reloadded modules
  var output = cache.get(cacheKey)
  if (output) return output
  output = compiler.parseComponent(content, { pad: true })
  cache.set(cacheKey, output)
  return output
}
