var path = require('path')
var fs = require('fs')
var nodedir = require('node-dir');
var markdown = require( "markdown" ).markdown;

var fileProcessor = require('./processor');
var drawer = require('./drawer');
var utils = require('./utils');

const COMPONENTS_FOLDER = 'example-components'
const OUTPUT_FOLDER = 'collection-preview'
const OUTPUT_FILENAME = 'index.html'

let outputPath;
let runOptions;
let componentTree = [];

module.exports = {
  iterateComponentsFolder : (folderFromName, folderToName, options) => {

    setVariables(folderFromName, folderToName, options);

    nodedir.readFiles(folderFromName, {
      match: /.vue$/, //|.md
      exclude: (runOptions.exclude || /^\./)
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
const generateFullPage = (treeArray) => {
  debugger;
  let links = drawer.generateLinkList(treeArray.map((x) => x.link))
  let comps = treeArray.map((x) => drawer.generateComponentDescription(x.comp))

  let data = {
    links,
    comps
  }
  var pagePath = path.resolve(outputPath, OUTPUT_FILENAME);
  fs.writeFileSync(pagePath, drawer.generatePage(data));
}
const generateFiles = (err, files) => {
  if (err) throw err;

  if(files.length) {
    items = files.map(function(file){
      return {
          comp: processFileByType(file),
          link: file
      };
    });

    generateFullPage(modifyComponentsTree(items));

    logResult(files.length, runOptions.i18n.console_processed);
  } else {
    logError(runOptions.i18n.console_no_files_found);
  }
}
const modifyComponentsTree = (list) => {
  let filtered = list.filter((x) => !x.comp._isWrapper)
  return filtered;
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
const isSimpleWrapperComponent = (obj) => {
  if(!obj.methods.length && !obj.props.length && !obj.computed.length) return true;
  return false;
}

const readComponent = (loadFile) => {
  let vueFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})

  let componentObject = fileProcessor.processComponent(vueFile);
  let componentCode = utils.componentCodeFromName(componentObject);

  let data = {
    _isWrapper: false,
    itemTitle: componentObject.name || path.basename(loadFile).split('.')[0],
    loadFile,
    compInitialData : (componentObject.data ? componentObject.data() : ''),
    computed: utils.showIfAny(componentObject.computed),
    props: utils.showIfAny(componentObject.props),
    methods: utils.showIfAny(componentObject.methods),
    componentCode,
    htmlBlockId: path.basename(loadFile).split('.')[0]
  };

  if(isSimpleWrapperComponent(data)){
    data._isWrapper = true;
  }

  return data;
}

const readMDfile = (loadFile) => {
  let mdFile = fs.readFileSync(loadFile, {encoding: 'utf-8'});
  return markdown.toHTML(mdFile);
}

const logResult = (text, suffix) => {
  console.log(text + suffix)
}
const logError = (text) => {
  console.log(text)
}
