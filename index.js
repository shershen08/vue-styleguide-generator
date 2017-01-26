var libGenerator = require('./src/main');
var argv = require('minimist')(process.argv.slice(2));

const DEFAULT_SOURCE_DIR = 'src-test';
const DEFAULT_DIST_DIR = 'components-preview';
const DEFAULT_LOCALE = 'en';

const parseOptions = () => {
  let options = {};
  options.src = argv.src ? argv.src : DEFAULT_SOURCE_DIR;
  options.dest = argv.dest ? argv.dest : DEFAULT_DIST_DIR;
  options.locale = argv.locale ? argv.locale : DEFAULT_LOCALE;
  options.exclude = argv.exclude ? argv.exclude : undefined;
  options.verbose = argv.verbose ? true : false;
  return options;
}

libGenerator.run(parseOptions());
