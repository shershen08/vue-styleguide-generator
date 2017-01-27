var path = require('path')
var fs = require('fs')
var markdown = require('markdown').markdown
var Q = require('Q')
var css = require('css')

var fileProcessor = require('./processor')
var drawer = require('./drawer')
var utils = require('./utils')
var walker = require('./walker')

const OUTPUT_FILENAME = 'index.html'
const CUSTOM_CSS = 'style/custom-styles.css'

let runOptions

module.exports = {
  iterateComponentsFolder: (options) => {
    runOptions = options

    walker.walk(options.src, runOptions, function (result) {
      sortOutResultingList(result)
    })
  }
}
const sortOutResultingList = (list) => {
  var nonEmpty = list.filter((x) => x.files.length)
  let flatFileList = []

  nonEmpty.forEach(function (elem) {
    if (elem.files.length === 1) {
      flatFileList.push({file: elem.files[0]})
    } else if (elem.files.length === 2) { // && fileNamesAreComplimentary(elem.files)
      flatFileList = flatFileList.concat({
        file: elem.files[0],
        readme: elem.files[1]
      })
    } else {
      flatFileList = flatFileList.concat(elem.files.map((f) => {
        return {file: f}
      }))
    }
  })
  generateFiles(flatFileList)
}

const fileNamesAreComplimentary = (filesArray) => {
  const f1 = path.basename(filesArray[0])
  const f2 = path.basename(filesArray[1])
  if ((f1.split('.')[0] == f2.split('.')[0]) && (f1.split('.')[1] != f2.split('.')[1])) return true
  return false
}

const generateFullPage = (treeArray) => {

  let links = drawer.generateLinkList(treeArray.map((x) => x.link))
  let comps = treeArray.map((x) => drawer.generateComponentDescription(x.comp))

  let data = {
    links,
    comps,
    inlineCss: addInlinedCSS(CUSTOM_CSS)
  }
  /*
  * assumption, script path: PROJECT_ROOT/node_modules/vue-styleguide-generator/
  * assumption, output path PROJECT_ROOT/<runOptions.dest>
  */
  var dirPath = path.resolve(__dirname, '..', '..', '..', runOptions.dest)
  var pagePath = path.resolve(__dirname, '..', '..', '..', runOptions.dest, OUTPUT_FILENAME)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
  fs.writeFileSync(pagePath, drawer.generatePage(data))
}
const generateFiles = (files) => {

  if (files.length) {

    // ignore folder with single .md file. what we should do with that?
    files = files.filter(function (fileObject) {
      return !(path.basename(fileObject.file).split('.')[1] === 'md')
    })

    items = files.map(function (fileItem) {
      return {
        comp: fileItem.readme ? processWithReadmeFiles(fileItem) : processSingleFiles(fileItem),
        link: fileItem.file
      }
    })

    generateFullPage(modifyComponentsTree(items))

    logResult(files.length, runOptions.i18n.console_processed)
  } else {
    logError(runOptions.i18n.console_no_files_found)
  }
}
const modifyComponentsTree = (list) => {
  let filtered = list
  if (!runOptions.showall) {
    filtered = list.filter((x) => !x.comp._isWrapper)
  }
  return filtered
}

const getFile = (filename) => {
  return path.resolve(componentsFolder, filename)
}

const addInlinedCSS = (cssPath) => {
  const cssfilePath = path.resolve(__dirname, '..', cssPath)
  const cssFile = fs.readFileSync(cssfilePath, { encoding: 'utf8' })
  const obj = css.parse(cssFile, {})

  return css.stringify(obj, {
    inputSourcemaps: false,
    compress: true
  })
}

const processSingleFiles = (fileObject) => {
  if (runOptions.verbose) logResult(runOptions.i18n.console_processing, fileObject.file)
  return readComponent(fileObject)
}
const processWithReadmeFiles = (fileObject) => {
  if (runOptions.verbose) logResult(runOptions.i18n.console_processing, fileObject.file)

  const readmeContent = readMDfile(fileObject.readme)
  return readComponent(fileObject, readmeContent)
}
const isSimpleWrapperComponent = (obj) => {
  if (!obj.methods.length && !obj.props.length && !obj.computed.length) return true
  return false
}

const readComponent = (fileObject, readmeHTML) => {
  const loadFile = fileObject.file
  let vueFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})
  let componentObject = fileProcessor.processComponent(vueFile)
  let componentCode = utils.componentCodeFromName(componentObject)

  let data = {
    _isWrapper: false,
    itemTitle: componentObject.name || path.basename(loadFile).split('.')[0],
    fileName: loadFile,
    compInitialData: (componentObject.data ? componentObject.data() : ''),
    computed: utils.showIfAny(componentObject.computed),
    props: utils.showIfAny(componentObject.props),
    methods: utils.showIfAny(componentObject.methods),
    componentCode,
    htmlBlockId: path.basename(loadFile).split('.')[0],
    readmeHTML: readmeHTML ? readmeHTML : ''
  }

  if (isSimpleWrapperComponent(data)) {
    data._isWrapper = true
  }

  return data
}

const readMDfile = (loadFile) => {
  let mdFile = fs.readFileSync(loadFile, {encoding: 'utf-8'})
  return markdown.toHTML(mdFile)
}

const logResult = (text, suffix) => {
  console.log(text + (suffix ? suffix : ''))
}
const logError = (text) => {
  console.log(text)
}
