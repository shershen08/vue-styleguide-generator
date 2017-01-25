const pug = require('pug')
var path = require('path')

const TEMPLATES_FOLDER = 'templates'
const TEMPLATES_PARTIALS_FOLDER = 'partials'

let componentTemplate;
let pageTemplate;

module.exports = {
  generatePage: function (data) {
    let pageTemplatePath = path.resolve(__dirname, TEMPLATES_FOLDER, 'pageTemplate.pug')
    return pug.renderFile(pageTemplatePath, data)
  },
  generateLinkList: function (componentArray) {
    let linkListTemplatePath = path.resolve(__dirname, TEMPLATES_FOLDER, TEMPLATES_PARTIALS_FOLDER, 'linkList.pug')
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
    return pug.renderFile(linkListTemplatePath, data)
  },
  generateComponentDescription: function (componentData) {
    let componentDescriptionTemplatePath = path.resolve(__dirname, TEMPLATES_FOLDER, 'componentTemplate.pug')
    return pug.renderFile(componentDescriptionTemplatePath, componentData)

  // todos: data, ?dependances, child elements from 'components' obj
  }
}
