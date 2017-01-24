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
      },
      intermediateCheck,
      generateFiles);
  }
}
const intermediateCheck = (err, content, next) => {
  next();
}
const generateFiles = (err, files) => {
  if (err) throw err;

  console.log(display.generateLinkList(files));

  if(files.length) files.forEach(function(file){
    let res = processFileByType(file);
    console.log(res);
  })
}
const getFile = (filename) => {
  return path.resolve(componentsFolder, filename);
}

const processFileByType = (file) => {
  var ext = file.split('.')[1];
  if(ext === 'md'){
    return readMDfile(file)
  } else {
    return readComponent(file)
  }
}
const readComponent = (loadFile) => {
  let vueFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})
  return display.generateComponentDescription(fileProcessor.processComponent(vueFile), loadFile);
}

const readMDfile = (loadFile) => {
  let mdFile = fs.readFileSync(loadFile, {encoding: 'utf-8'});
  return markdown.toHTML(mdFile);
}
