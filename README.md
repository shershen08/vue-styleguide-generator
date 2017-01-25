## Vue js components style guide generator

Initially started after reading [this vue.js feature request](https://github.com/vuejs/vue-requests/issues/17).
Now only basic proof of concept is available which can load folder with .vue files, parse it and extract basic props of it.

Target is to have some tool with at least some of the [React version](https://github.com/styleguidist/react-styleguidist) capabilities.

**Very early alpha mode**

### NPM version available

 - ```npm install vue-styleguide-generator --save-dev```
 - add to you package.json in script section - ```"build-components": "node ./node_modules/vue-styleguide-generator/"``` then run ```npm run build-components```
 - You can also manually (or using Gulp/Grunt) run ```node ./node_modules/vue-styleguide-generator/```


### CLI options

 - src : String, source dir; __default: 'src'__
 - dest : String, destination output dir; __default: 'components-preview'__
 - exclude : RegExp, file mask to exclude; __default: '/^\./'__
 - locale : String; __default: 'en'__

 E.g.: ```node ./node_modules/vue-styleguide-generator/ --src components --dest preview``` will read components from PROJECT_ROOT/components folder and provide a html page into PROJECT_ROOT/preview folder


### Output UI demo

 ![resulting output](https://raw.githubusercontent.com/shershen08/vue-styleguide-generator/master/demo-output.jpg)

### Todos

- testing and cleanup
- core: merge component file with .md file in the same directory
- core: move the demo-page to use Vue so that components can be generated from its declaration
- ui: search in list of components
- ui: output extra component parameters (computable, data)

### Bugs and problems

- 'vue-template-compiler' must be the same as the version of 'vue' you're using in your codebase. Now set to 2.1.10. may have to manually put to other version that's used in your project.
