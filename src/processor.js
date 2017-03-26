var parse = require( './parser' )
var babel = require( 'babel-core' )
const vm = require( 'vm' )
var Q = require( 'q' )
var fs = require( 'fs' )
var path = require( 'path' )

var utils = require( './utils' )

module.exports = {
  processComponentJSCode: ( content , name) => {
    var dfd = Q.defer()
    let jscodeReqest = getComponentModuleJSCode( content , name)
    jscodeReqest.then(function(jsCode){
      const babelifycode = babelifyCode( jsCode )
      dfd.resolve(evalComponentCode( babelifycode.code ))
    })

    return dfd.promise;
  }
}

const babelifyCode = ( code ) => {
  const options = {
    ast: false,
    comments: false,
    presets: [ 'es2015' ]
  }
  return babel.transform( code, options )
}
const getComponentModuleJSCode = ( file, fullPath ) => {
  var parts = parse( file, 'name', false )
  var dfd = Q.defer()

  if(!parts.script) {
    dfd.reject('No script code')
  }
  
  if(parts.script.src){
    const jsFilePath = path.join(path.dirname(fullPath), parts.script.src)
    readSeparateScriptFile(jsFilePath, dfd);
  } else {
    dfd.resolve(parts.script.content);
  }
  return dfd.promise;
}

const readSeparateScriptFile = (fileName, deferredObject) => {
  fs.readFile( fileName,  { encoding: 'utf-8' }, function read( err, data ) {
    if ( err ) {
      throw err;
    }
    deferredObject.resolve( data );
  })
}

const evalComponentCode = ( code ) => {
  const script = new vm.Script( code, {})
  const context = new vm.createContext( sandbox )
  try {
    script.runInContext( context )
    return sandbox.exports.default
  }
  catch ( e ) {
    utils.logParsingError( e )
  }
}
const sandbox = {
  exports: {},
  require: function () { },
  window: {
    location: {}
  },
  alert: function () { },
  confirm: function () { },
  console: {
    log: function () { }
  },
  localStorage: {
    getItem: function () { },
    setItem: function () { },
    removeItem: function () { }
  },
  _moment2: {
    default: function () { }
  }

}
