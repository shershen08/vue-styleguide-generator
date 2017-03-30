const pug = require('pug')
var path = require('path')
var utils = require('./utils')

const TEMPLATES_FOLDER = 'templates'
const TEMPLATES_PARTIALS_FOLDER = 'partials'

module.exports = {
  generatePropsDetails: function (propsArray) {
    if (!propsArray) return []
    let tableListArray = []

    if (propsArray.length) {
      return propsArray.map((p) => {
        return {name: p, required: '',default: '',type: ''}
      })
    }
    Object.keys(propsArray).forEach(function (prop) {
      let val = propsArray[prop]
      let res = {
        name: prop,
        required: '',
        default: '',
        type: ''
      }
      
      if (typeof val === 'object') {
        if (val.required) res.required = val.required.toString()
        if (val.default) res.default = val.default
        if (val.type) {
          res.default = val.type.toString().split('()')[0].split(' ')[1]
        }
      } else if (typeof val === 'function') {
        res.type =  '-'
        if( val() === false){
           res.default = 'Boolean'
        } else if (typeof val() === "string") {
          res.default = 'String'
        // } else if (typeof val() === "string" && val().indexOf("Date") > -1) {
        //   res.default = 'Date'
        } else if (typeof val() === "number") {
          res.default = 'Number'
        } else {
          res.default = 'Boolean'
        }
      }
      tableListArray.push(res)
    })
    return tableListArray
  },
  generateUsageCode: function (comp, file) {
    let templatePart = utils.componentCodeFromName(comp)
    let importPart = generateImportStatement(comp, file)

    return `${importPart}
            
${templatePart}`
  },
  generatePage: function (data) {
    let pageTemplatePath = path.resolve(__dirname, TEMPLATES_FOLDER, 'pageTemplate.pug')
    data.comps = data.comps.join('')
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
const generateImportStatement = (comp, file) => {
  let conventionalComponentName

  if (comp.name) {
    conventionalComponentName = utils.snakeToCamel(comp.name)
  } else {
    if (file.indexOf('-')) {
      conventionalComponentName = utils.snakeToCamel(file)
    } else {
      conventionalComponentName = file
    }
  }

  return `import \{${utils.capitalizeFirstLetter(conventionalComponentName)}\} from '${file}';`
}
