const methods = {
  kebabToCamel: (myString) => {
    return myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
  },
  propsTable: () => {
  },
  methodsList: () => {
  },
  componentCodeFromName: (componentObject) => {
    return componentObject.name ? ('<' + componentObject.name + '></'+ componentObject.name + '>') : '';
  },
  getProperComponentName: (componentObject, componentFileName) => {
      if (!componentObject.name){
        return componentFileName.split('.')[0];
      }
      return module.exports.kebabToCamel(componentObject.name);
  }
}
module.exports = methods;
