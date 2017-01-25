var libGenerator = require('./src/main');

var args = process.argv.slice(2);
/*
* Availbale options:
*   - src : String, source dir
*   - dest : String, destination optput dir
*   - exclude : RegExp
*   - excludeDir : RegExp
*   - matchDir : RegExp
*   - locale : String : en, cn, ru
*/
console.log(args);

const options = {
  src: 'src',
  dest: 'components-preview'
};

libGenerator.run(options);
