var path = require('path')
var fs = require('fs')
var nodedir = require('node-dir');
var markdown = require( "markdown" ).markdown;

var fileProcessor = require('./processor');
var drawer = require('./drawer');


const COMPONENTS_FOLDER = 'example-components'
const OUTPUT_FOLDER = 'collection-preview'
const OUTPUT_FILENAME = 'index.html'


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
const generateFullPage = (links, comps) => {
  let data = {
    links,
    comps
  }

  fs.writeFileSync(path.resolve(OUTPUT_FOLDER, OUTPUT_FILENAME), drawer.generatePage(data));
}
const generateFiles = (err, files) => {
  if (err) throw err;

  let linksHTML = drawer.generateLinkList(files);
  let compsHTML = [];

  if(files.length) files.forEach(function(file){
    compsHTML.push(processFileByType(file));
  })

  generateFullPage(linksHTML, compsHTML);
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
  return drawer.generateComponentDescription(fileProcessor.processComponent(vueFile), loadFile);
}

const readMDfile = (loadFile) => {
  let mdFile = fs.readFileSync(loadFile, {encoding: 'utf-8'});
  return markdown.toHTML(mdFile);
}
