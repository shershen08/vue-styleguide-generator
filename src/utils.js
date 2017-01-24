const methods = {
  kebabToCamel: (myString) => {
    return myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
  },
  propsTable: () => {
  },
  methodsList: () => {
  }
}
module.exports = methods;
