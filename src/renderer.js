var Vue = require('vue')
var renderer = require('vue-server-renderer').createRenderer()
var path = require('path');
var parse = require('./parser')
var fs = require('fs')

var app = new Vue({
  render: function (h) {
    return h('p', 'hello world')
  }
})


const renderFunction = (component, callback) => {
    let piece;
    var componentPath = path.resolve(__dirname, '..', component.fileName)
    var file = fs.readFileSync(componentPath, {encoding: 'utf-8'});
    var vueFile = parse(file, 'name', false)
    console.log(vueFile.script);
    // var stream = renderer.renderToString(vueFile, function(html){
    //   console.log(html);
    // });
    //   stream.on('data', function (chunk) {
    //    piece += chunk
    //  })
    //  stream.on('end', function () {
    //    callback(piece)
    //  })

    // renderer.renderToString(app, function (error, html) {
    //   if (error) throw error
    //   callback(html)
    // })
}

module.exports = {
  render : renderFunction
}
