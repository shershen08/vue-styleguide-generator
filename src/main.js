var walker = require('./walker');

const mainMethod = () => {
  walker.iterateComponentsFolder();
}

module.exports = {
  run : mainMethod
}
