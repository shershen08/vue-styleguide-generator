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
let allComponentsFiles = [];

var parentProjectData = require(path.resolve( __dirname, '..', '..', '..', 'package.json'));

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
    inlineCss: addInlinedCSS( CUSTOM_CSS ),
    pageTitle: (parentProjectData.name ? parentProjectData.name : '') + ' ' + (parentProjectData.version ? parentProjectData.version : ' ') + ' ' + runOptions.title,
    i18n: runOptions.i18n
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
  fs.writeFile( pagePath,
                drawer.generatePage( data ),
              () => {
                if(runOptions.openBrowser) {
                  utils.openBrowser(pagePath);
                }
              })
}
const generateFiles = ( files ) => {

  if ( files.length ) {

    // ignore folder with single .md file. what we should do with that?
    files = files.filter( function ( fileObject ) {
      return !( path.basename( fileObject.file ).split( '.' )[ 1 ] === 'md' )
    })

    files.forEach( function ( fileItem ) {
      fileItem.readme ? processWithReadmeFiles( fileItem ) : processSingleFiles( fileItem )
    })

    Q.allSettled( fileReadingList ).then( function ( results ) {

      let processedResult = results.filter(( x ) =>  x.value && x.value.fileName)

      let finalResults = processedResult.map( ( item ) => {
        return {
          comp: item.value,
          link: item.value.fileName
        };
      })

      generateFullPage( modifyComponentsTree( finalResults ) )
      logResult( files.length, runOptions.i18n.console_processed )
    }).catch(function(err){
      debug(err);
    })

  } else {
    utils.logParsingError( runOptions.i18n.console_no_files_found )
  }
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

const processSingleFiles = ( fileObject ) => {
  if ( runOptions.verbose ) logResult( runOptions.i18n.console_processing, fileObject.file )
  return readComponent( fileObject )
}
const processWithReadmeFiles = ( fileObject ) => {
  if ( runOptions.verbose ) logResult( runOptions.i18n.console_processing, fileObject.file )

  const readmeContent = readMDfile( fileObject.readme )
  return readComponent( fileObject, readmeContent )
}
const isSimpleWrapperComponent = ( obj ) => {
  if ( !obj.methods.length && !obj.props.length && !obj.computed.length ) return true
  return false
}

const readComponent = ( fileObject, readmeHTML ) => {
  var dfd = Q.defer()
  fileReadingList.push( dfd.promise );

  const loadFile = fileObject.file

  fs.readFile( loadFile,  { encoding: 'utf-8' }, function read( err, data ) {
    if ( err ) {
      throw err;
    }

    processComponent( data, loadFile, readmeHTML ).then(function(result){
      dfd.resolve( result )
    }).catch(function(errorProcessing){
      debug(errorProcessing);
    })
  })

}
const processComponent = ( vueFile, fileName, readmeHTML ) => {
  
  var dfd = Q.defer()

  let componentObjectRequest = fileProcessor.processComponentJSCode( vueFile, fileName )

  componentObjectRequest.then(function(componentObject){

    if ( componentObject && !isEmpty( componentObject ) ) {
      //TODO: this check is obsolete now ?

      let prettyName = componentObject.name || path.basename( fileName ).split( '.' )[ 0 ]
      let data = {
        _isWrapper: false,
        itemTitle: prettyName,
        fileName: fileName,
        compInitialData: getComponentData( componentObject ),
        computed: utils.showIfAny( componentObject.computed ),
        props: drawer.generatePropsDetails( componentObject.props ),
        methods: utils.showIfAny( componentObject.methods ),
        componentCode: drawer.generateUsageCode( componentObject, prettyName ),
        htmlBlockId: path.basename( fileName ).split( '.' )[ 0 ],
        readmeHTML: readmeHTML ? readmeHTML : ''
      }

      if ( isSimpleWrapperComponent( data ) ) {
        data._isWrapper = true
      }

      dfd.resolve(data)
    } else {
       dfd.resolve({})
    }
  })

  return dfd.promise
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