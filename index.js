var libGenerator = require('./src/main');

const myComponentsPath = 'example-components'
const myOutputPath = 'collection-preview';
const options = {};

libGenerator.run(myComponentsPath, myOutputPath, options);
