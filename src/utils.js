const methods = {
  kebabToCamel: (myString) => {
    return myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
  },
  componentCodeFromName: (componentObject) => {
    return componentObject.name ? ('<' + componentObject.name + '></'+ componentObject.name + '>') : '';
  },
  getProperComponentName: (componentObject, componentFileName) => {
      if (!componentObject.name){
        return componentFileName.split('.')[0];
      }
      return module.exports.kebabToCamel(componentObject.name);
  },
  showIfAny: (obj) => {
    return obj ? Object.keys(obj) : [];
  }
}
module.exports = methods;
