## Vue js components style guide generator

Initially started after reading [this vue.js feature request](https://github.com/vuejs/vue-requests/issues/17).
Now only basic proof of concept is available which can load folder with .vue files, parse it and extract basic props of it.

Target is to have some tool with at least some of the [React version](https://github.com/styleguidist/react-styleguidist) capabilities.

**EARLY ALPHA MODE NOTICE!**

### Setup

 An NPM version available:

 - ```npm install vue-styleguide-generator --save-dev```
 - add to you package.json in script section - ```"build-components": "node ./node_modules/vue-styleguide-generator/"``` then run ```npm run build-components```
 - You can also manually (or using Gulp/Grunt) run ```node ./node_modules/vue-styleguide-generator/```


### Usage

#### CLI options

 - src : String; source dir __default: 'src'__;
 - dest : String; destination output dir __default: 'components-preview'__;
 - exclude : RegExp; file mask to exclude __default: '/^\./'__;
 - locale : String; output locale __default: 'en'__;
 - verbose : String; output all details while processing  __default: 'false'__;
 - all : String; do not ignore any components  __default: 'false'__;

 E.g.: ```node ./node_modules/vue-styleguide-generator/ --src components --dest preview``` will read components from PROJECT_ROOT/components folder and provide a html page into PROJECT_ROOT/preview folder

#### Who the components are iterated (Why I don't see it in the list ?!)

 If you want to see more information about the component - add a .md file in the same directory.
 While retrieving the files the following assumptions are made:
  - if there are files with the **same name** in one folder (e.g. ```/scr/partials/TabBar.vue``` and ```/scr/partials/TabBar.md```) it's assumed to be one component;
  - if there are **only two** files in the folder and one is .vue and another is .md (e.g. ```/scr/TabBar/codez.vue``` and ```/scr/partials/readers.md```)  it's assumed to be one component;
  - If there are >1 .vue files in the folder and .md file that does not have the same name as one of the .vue files - this .md file is ignored
  - Components with no props, no computed and no methods defined are considered to be a simple wrappers and not outputed


  Found a bug or have a better proposal - please create an issue or tweet me @legkoletat!

### Output UI demo

 ![resulting output](https://raw.githubusercontent.com/shershen08/vue-styleguide-generator/master/demo-output.jpg)

### Todos

- testing and cleanup
- core: move the demo-page to use Vue so that components can be generated from its declaration
- ui: search in list of components
- ui: output extra component parameters (computable, data)

### Bugs and problems

- 'vue-template-compiler' must be the same as the version of 'vue' you're using in your codebase. Now set to 2.1.10. may have to manually put to other version that's used in your project.
