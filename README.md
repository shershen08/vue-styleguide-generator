## Vue js compoentns style guide generator

Initially started after reading [this feature request](https://github.com/vuejs/vue-requests/issues/17).
Now only basic proof of concept is availbale which can load .vue file, parse it and extract basic props of it.
Target is to have some tool with at least some of the [React version](https://github.com/styleguidist/react-styleguidist) capabilities.

### How to try

 - Clone or download this repo
 - ```npm install```
 - ```node index.js``` 
 - you should see a simple console output of the 'VueSound.vue' [sample component file](https://github.com/shershen08/vue-styleguide-generator/blob/master/example-components/VueSound.vue) containing **component name, props, data object and other properties of export default object**.
        
         
### Todos
 
 - iterate .vue files in given folder
 - Generate html files
 - Parse .md files in the component's folders (if any)
