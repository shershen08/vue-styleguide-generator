var path = require( 'path' )
var fs = require( 'fs' )
var markdown = require( 'markdown' ).markdown
var Q = require( 'q' )
var css = require( 'css' )
var debug = require('debug')('app');

var fileProcessor = require( './processor' )
var drawer = require( './drawer' )
var utils = require( './utils' )
var walker = require( './walker' )

const OUTPUT_FILENAME = 'index.html'
const CUSTOM_CSS = 'style/custom-styles.css'
let fileReadingList = [];
let allComponentsFiles = []

let runOptions

module.exports = {
  iterateComponentsFolder: ( options ) => {
    runOptions = options

    walker.walk( options.src, runOptions, function ( result ) {
      sortOutResultingList( result )
    })
  }
}
const sortOutResultingList = ( list ) => {
  var nonEmpty = list.filter(( x ) => x.files.length )
  let flatFileList = []

  nonEmpty.forEach( function ( elem ) {


    if ( elem.files.length === 1 ) {
      flatFileList.push( { file: elem.files[ 0 ] })
    } else if ( elem.files.length === 2 ) { // && utils.fileNamesAreComplimentary(elem.files)
      flatFileList = flatFileList.concat( {
        file: elem.files[ 0 ],
        readme: elem.files[ 1 ]
      })
    } else {
      flatFileList = flatFileList.concat( elem.files.map(( f ) => {
        return { file: f }
      }) )
    }


  })
    generateFiles( flatFileList )
}

const generateFullPage = ( treeArray ) => {

  let links = drawer.generateLinkList( treeArray.map(( x ) => x.link ) )
  let comps = treeArray.map(( x ) => drawer.generateComponentDescription( x.comp ) )

  let data = {
    links,
    comps,
    inlineCss: addInlinedCSS( CUSTOM_CSS )
  }
  /*
  * assumption, script path: PROJECT_ROOT/node_modules/vue-styleguide-generator/
  * assumption, output path PROJECT_ROOT/<runOptions.dest>
  */
  var dirPath = path.resolve( __dirname, '..', '..', '..', runOptions.dest )
  var pagePath = path.resolve( __dirname, '..', '..', '..', runOptions.dest, OUTPUT_FILENAME )
  if ( !fs.existsSync( dirPath ) ) {
    fs.mkdirSync( dirPath )
  }
  fs.writeFileSync( pagePath, drawer.generatePage( data ) )
}
const generateFiles = ( files ) => {

  if ( files.length ) {

    // ignore folder with single .md file. what we should do with that?
    files = files.filter( function ( fileObject ) {
      return !( path.basename( fileObject.file ).split( '.' )[ 1 ] === 'md' )
    })

    files.forEach( ( fileItem ) => processSingleFile( fileItem ))

    Q.allSettled( fileReadingList ).then( function ( results ) {
      let finalResults = modifyComponentsTree(formResultsStructure(clearEmptyResults(results)))
      generateFullPage( finalResults )
      logResult( files.length, runOptions.i18n.console_processed )
    }).catch(function(err){
      debug(err);
    })

  } else {
    utils.logParsingError( runOptions.i18n.console_no_files_found )
  }
}
const clearEmptyResults = (results) => {
  return results.filter(( x ) =>  x.value && x.value.fileName)
}
const formResultsStructure = (processedResult) => {
   return processedResult.map( ( item ) => {
      return {
        comp: item.value,
        link: item.value.fileName
      };
    })
}
const modifyComponentsTree = ( list ) => {
  let filtered = list
  if ( !runOptions.showall ) {
    filtered = list.filter(( x ) => x.comp && !x.comp._isWrapper );
  }
  return filtered
}

const addInlinedCSS = ( cssPath ) => {
  const cssfilePath = path.resolve( __dirname, '..', cssPath )
  const cssFile = fs.readFileSync( cssfilePath, { encoding: 'utf8' })
  const obj = css.parse( cssFile, {})

  return css.stringify( obj, {
    inputSourcemaps: false,
    compress: true
  })
}

const processSingleFile = ( fileObject ) => {
  if ( runOptions.verbose ) logResult( runOptions.i18n.console_processing, fileObject.file )
  return readComponent( fileObject )
}
const isSimpleWrapperComponent = ( obj ) => {
  if ( !obj.methods.length && !obj.props.length && !obj.computed.length ) return true
  return false
}

const readComponent = ( fileObject ) => {
  var dfd = Q.defer()
  fileReadingList.push( dfd.promise );
  const loadFile = fileObject.file
  
  fs.readFile( loadFile,  { encoding: 'utf-8' }, function read( err, readFileData ) {
    if ( err ) {
      throw err;
    }

    processComponent( readFileData, fileObject ).then(function(result){
      dfd.resolve( result )
    }).catch(function(errorProcessing){
      debug(errorProcessing);
    })
  })
}

const processComponent = ( vueFile, fileObject ) => {
  var dfd = Q.defer()

  const fileName = fileObject.file

  fileProcessor.processComponentJSCode( vueFile, fileName ).then(function(componentObject){
    if ( componentObject && !isEmpty( componentObject ) ) {

      let component = Object.assign({},
        generateComponentObject(componentObject),
        getComponentReadme(fileObject.readme),
        addFileNameRelatedProps(component.name, fileName))
      dfd.resolve(component)
    } else {
      dfd.resolve({})
    }
  })
  return dfd.promise
}

const getComponentReadme = (readmeFileName) => {
  const readmeHTML = readmeFileName ? readMDfile( readmeFileName ) : ''
  return readmeFileName ? {readmeHTML} : {}
}

const addFileNameRelatedProps = (componentName, fileName) => {
  const baseFileName = path.basename( fileName ).split( '.' )[ 0 ]
  return {
    itemTitle: componentName || baseFileName,
    fileName: fileName,
    htmlBlockId: baseFileName
  }
}

const generateComponentObject = (componentObject) => {
      let data = {
        compInitialData: getComponentData( componentObject ),
        computed: utils.showIfAny( componentObject.computed ),
        props: drawer.generatePropsDetails( componentObject.props ),
        methods: utils.showIfAny( componentObject.methods ),
        componentCode: drawer.generateUsageCode( componentObject, prettyName ),
      }

      data._isWrapper =  isSimpleWrapperComponent( data )
      return data
}

const isEmpty = ( obj ) => Object.keys( obj ).length === 0 && obj.constructor === Object;
const getComponentData = ( component ) => {
  try {
    if ( !component.data ) return '';
    if ( component.data && typeof component.data === 'function' ) return component.data();
  }
  catch ( e ) {
     utils.logParsingError( e )
  }

}

const readMDfile = ( loadFile ) => {
  let mdFile = fs.readFileSync( loadFile, { encoding: 'utf-8' })
  return markdown.toHTML( mdFile )
}
 /* eslint-disable no-console */
const logResult = ( text, suffix ) => {
  console.log( text + ( suffix ? suffix : '' ) )
}
 /* eslint-enable no-console */