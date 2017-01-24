var path = require('path')
var fs = require('fs')

// var args = process.argv.slice(2)
// class Walker

/* walker */
const componentsPath = ''

const iterateComponents = (componentsPath) => {
  // https://github.com/fshost/node-dir

  // 1 load
  // /replace with comand line or some more inteligent way
  let filename = 'VueSound.vue'
  let loadFile = './example-components/' + filename
  let vueFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})
}
