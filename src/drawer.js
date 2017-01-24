const pug = require('pug');
var path = require('path')

const TEMPLATES_FOLDER = 'templates';
const TEMPLATES_PARTIALS_FOLDER = 'partials';

let componentTemplate;
let pageTemplate;

const initTemplates = () => {
  // componentTemplate = pug.compile('string of pug', options);
  // pageTemplate = pug.compile('string of pug', options);
}
module.exports = {
  generatePage : function(data){
    let templatePath = path.resolve('src', TEMPLATES_FOLDER, 'pageTemplate.pug')
    return pug.renderFile(templatePath, data);
  },
  generateLinkList: function (componentArray) {
    let templatePath = path.resolve('src', TEMPLATES_FOLDER, TEMPLATES_PARTIALS_FOLDER, 'linkList.pug')
    //componentArray = componentArray.map(x => x.split('/')
    let data = {
      items: componentArray
    }
    return pug.renderFile(templatePath, data);
  },
  generateComponentDescription : function (componentObject, fileName) {
    let componentCode = componentObject.name ? ('<' + componentObject.name + '></'+ componentObject.name + '>') : '';
    let data = {
      itemTitle: componentObject.name,
      subBlock: 'test',
      fileName,
      props: Object.keys(componentObject.props),
      methods: Object.keys(componentObject.methods),
      componentCode
    };
    const options = {}
    let templatePath = path.resolve('src', TEMPLATES_FOLDER, 'componentTemplate.pug')
    return pug.renderFile(templatePath, data);

   // name
   // props, computed props, watch props
   // description ?? in .md or /*****/
   // data
   // ?dependances
   // child elements 'components' obj
  }
}
