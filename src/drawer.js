const pug = require('pug');
var path = require('path')
var utils = require('./utils');

const TEMPLATES_FOLDER = 'templates';
const TEMPLATES_PARTIALS_FOLDER = 'partials';

let componentTemplate;
let pageTemplate;

module.exports = {
  generatePage : function(data){
    let templatePath = path.resolve('src', TEMPLATES_FOLDER, 'pageTemplate.pug')
    return pug.renderFile(templatePath, data);
  },
  generateLinkList: function (componentArray) {
    let templatePath = path.resolve('src', TEMPLATES_FOLDER, TEMPLATES_PARTIALS_FOLDER, 'linkList.pug')
    componentArray = componentArray.map((f) =>
    {
      let fileName = path.basename(f);
      return {
        name: fileName,
        href: '#' + fileName.split('.')[0]
      }
    });
    let data = {
      items: componentArray
    }
    return pug.renderFile(templatePath, data);
  },
  generateComponentDescription : function (componentObject, fileName) {
    let componentCode = utils.componentCodeFromName(componentObject);
    let data = {
      itemTitle: componentObject.name,
      subBlock: 'test',
      fileName,
      props: Object.keys(componentObject.props),
      methods: Object.keys(componentObject.methods),
      componentCode,
      htmlBlockId: path.basename(fileName).split('.')[0]
    };
    const options = {}
    let templatePath = path.resolve('src', TEMPLATES_FOLDER, 'componentTemplate.pug')
    return pug.renderFile(templatePath, data);

    //todos:
   //  - computed props, watch props
   //  - data
   //  - ?dependances
   // - child elements from 'components' obj
  }
}
