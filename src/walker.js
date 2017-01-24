var path = require('path')
var fs = require('fs')
var nodedir = require('node-dir');
var markdown = require( "markdown" ).markdown;

var fileProcessor = require('./processor');
var display = require('./drawer');

const COMPONENTS_FOLDER = 'example-components'


module.exports = {
  iterateComponentsFolder : (folderName) => {
    if(!folderName) folderName = COMPONENTS_FOLDER;

    nodedir.readFiles(folderName, {
      match: /.vue|.md$/,
      exclude: /^\./
      }, function(err, content, next) {
          next();
      },
      function(err, files){
          if (err) throw err;
          if(files.length) files.forEach(function(file){
            processFileByType(file);
          })
      });
  }
}

const getFile = (filename) => {
  return path.resolve(componentsFolder, filename);
}

const processFileByType = (file) => {
  console.log('\n\n File name ', file);
  var ext = file.split('.')[1];
  if(ext === 'md'){
    readMDfile(file)
  } else {
    readComponent(file)
  }
}
const readComponent = (loadFile) => {
  let vueFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})
  display.generateComponentDescription(fileProcessor.processComponent(vueFile));
}

const readMDfile = (loadFile) => {
  let mdFile = fs.readFileSync(loadFile, {encoding: 'utf-8'});
  console.log( markdown.toHTML(mdFile) );
}
