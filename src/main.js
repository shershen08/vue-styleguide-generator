var walker = require('./walker');

const mainMethod = (from, to, options) => {
  walker.iterateComponentsFolder(from, to, options);
}

module.exports = {
  run : mainMethod
}
