var parse = require( './parser' )
var babel = require( 'babel-core' )
const vm = require( 'vm' )

var utils = require( './utils' )

module.exports = {
  processComponent: ( content ) => {
    const jscode = getComponentModuleJSCode( content )
    if ( !jscode ) return;
    const babelifycode = babelifyCode( jscode )
    return evalComponentCode( babelifycode.code )
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
const getComponentModuleJSCode = ( file ) => {
  var parts = parse( file, 'name', false )
  return parts.script ? parts.script.content : '';
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
