var path = require('path')
var fs = require('fs')
var nodedir = require('node-dir');
var markdown = require( "markdown" ).markdown;

var fileProcessor = require('./processor');
var drawer = require('./drawer');

const COMPONENTS_FOLDER = 'example-components'
const OUTPUT_FOLDER = 'collection-preview'
const OUTPUT_FILENAME = 'index.html'

let outputPath;
let runOptions;

module.exports = {
  iterateComponentsFolder : (folderFromName, folderToName, options) => {

    setVariables(folderFromName, folderToName, options);

    nodedir.readFiles(folderFromName, {
      match: /.vue|.md$/,
      exclude: /^\./
      },
      intermediateCheck,
      generateFiles);
  }
}
const setVariables = (folderFromName, folderToName, options) => {
  runOptions = options;
  folderFromName = folderFromName || COMPONENTS_FOLDER;
  outputPath = folderToName || OUTPUT_FOLDER;
}
const intermediateCheck = (err, content, next) => {
  next();
}
const generateFullPage = (links, comps) => {
  let data = {
    links,
    comps
  }
  var pagePath = path.resolve(outputPath, OUTPUT_FILENAME);
  fs.writeFileSync(pagePath, drawer.generatePage(data));
}
const generateFiles = (err, files) => {
  if (err) throw err;

  let linksHTML = drawer.generateLinkList(files);
  let compsHTML = [];

  if(files.length) {
    files.forEach(function(file){
      compsHTML.push(processFileByType(file));
    });
    generateFullPage(linksHTML, compsHTML);
    logResult(files.length, runOptions.i18n.console_processed);
  }
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

const logResult = (text, suffix) => {
  console.log(text + suffix)
}
