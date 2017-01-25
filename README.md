## Vue js components style guide generator

Initially started after reading [this feature request](https://github.com/vuejs/vue-requests/issues/17).
Now only basic proof of concept is availbale which can load .vue file, parse it and extract basic props of it.
Target is to have some tool with at least some of the [React version](https://github.com/styleguidist/react-styleguidist) capabilities.

### NPM version available

 - ```npm install vue-styleguide-generator --save-dev```
 - add to you package.json in script section - ```"build-components": "node ./node_modules/vue-styleguide-generator/"``` then run ```npm run build-components```
 - You can also manually (or using Gulp/Grunt) run ```node ./node_modules/vue-styleguide-generator/```

### Output UI demo

 ![resulting output](https://raw.githubusercontent.com/shershen08/vue-styleguide-generator/master/demo-output.jpg)

### Todos

- CLI options (src, dest, ignore)
- core: merge component file with .md file in the same directory
- core: move the demo-page to use Vue so that components can be generated from its declaration
- ui: search in list of components
- ui: output extra component parameters (computable, data)
