const pug = require('pug')
var path = require('path')

const TEMPLATES_FOLDER = 'templates'
const TEMPLATES_PARTIALS_FOLDER = 'partials'

let componentTemplate;
let pageTemplate;

module.exports = {
  generatePage: function (data) {
    let templatePath = path.resolve(__dirname, TEMPLATES_FOLDER, 'pageTemplate.pug')
    return pug.renderFile(templatePath, data)
  },
  generateLinkList: function (componentArray) {
    let templatePath = path.resolve(__dirname, TEMPLATES_FOLDER, TEMPLATES_PARTIALS_FOLDER, 'linkList.pug')
    componentArray = componentArray.map((f) => {
      let fileName = path.basename(f)
      return {
        name: fileName,
        href: '#' + fileName.split('.')[0]
      }
    })
    let data = {
      items: componentArray
    }
    return pug.renderFile(templatePath, data)
  },
  generateComponentDescription: function (componentData) {
    debugger;
    let templatePath = path.resolve(__dirname, TEMPLATES_FOLDER, 'componentTemplate.pug')
    return pug.renderFile(templatePath, componentData)

  // todos:
  //  - data
  //  - ?dependances
  // - child elements from 'components' obj
  }
}
