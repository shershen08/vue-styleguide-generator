var jade = require('jade')
//
// export default class Drawer {
//   generateComponentList (conponentsArray) {}
//
// }

module.exports = {
  generateComponentDescription : function (componentObject) {

   // name
   // props, computed props, watch props
   // description ?? in .md or /*****/
   // data
   // ?dependances
   // child elements 'components' obj

   //console.log('\n\nComponent', filename)
   console.log('conponent name:', componentObject.name)
   console.log('conponent props:', Object.keys(componentObject.props))
   console.log('conponent methods:', Object.keys(componentObject.methods))
  }
}
