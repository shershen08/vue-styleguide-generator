## Vue js components style guide generator

> Initially started after reading [this vue.js feature request](https://github.com/vuejs/vue-requests/issues/17).
Now only basic proof of concept is available which can load folder with .vue files, parse it and extract basic props of it.

Target is to have some tool with at least some of the [React version](https://github.com/styleguidist/react-styleguidist) capabilities.

**ALPHA MODE NOTICE!**

## Setup

  1. ```npm install vue-styleguide-generator --save-dev```

  2. add to you package.json in script section - ```"build-components": "node ./node_modules/vue-styleguide-generator/"``` then run ```npm run build-components```

  You can also manually (or using Gulp/Grunt) run ```node ./node_modules/vue-styleguide-generator/```


## Usage

#### CLI options

| Name | type | default | description |
| ---: | ---- |  ------ |------------ |
| src  | String|Source dir|src|
| dest | String|Destination output dir| components-preview|
|exclude| RegExp|File mask to exclude |/^\./|
|locale|String|Output locale|en|
 |verbose|String|Output all details while processing|false|
 |all|String|Do not ignore any components| false|

 E.g.: ```node ./node_modules/vue-styleguide-generator/ --src components --dest preview``` will read components from PROJECT_ROOT/components folder and provide a html page into PROJECT_ROOT/preview folder

#### How the components are iterated

 If you want to see more information about the component - add a .md file in the same directory.
 While retrieving the files the following assumptions are made:
  - if there are files with the **same name** in one folder (e.g. ```/scr/partials/TabBar.vue``` and ```/scr/partials/TabBar.md```) it's assumed to be one component;
  - if there are **only two** files in the folder and one is .vue and another is .md (e.g. ```/scr/TabBar/codez.vue``` and ```/scr/partials/readers.md```)  it's assumed to be one component;
  - If there are >1 .vue files in the folder and .md file that does not have the same name as one of the .vue files - this .md file is ignored
  - Components with no props, no computed and no methods defined are considered to be a simple wrappers and not outputed


  Found a bug or have a proposal - please [create an issue](https://github.com/shershen08/vue-styleguide-generator/issueshttps://github.com/shershen08/vue-styleguide-generator/issues) or tweet me [@legkoletat](https://twitter.com/legkoletat)!

### Output UI demo

 ![resulting output](https://raw.githubusercontent.com/shershen08/vue-styleguide-generator/master/demo-output.jpg)

### Todos
- core: add tests
- core: move the demo-page to use Vue so that components can be generated from its declaration
- core: parse props with validation
- ui: search in list of components
- ui: output extra component parameters (computable, data)
- various use cases testing

#### Contributions are welcome!

Especially on following:
 - translations
 - extra features

### Bugs and problems

- 'vue-template-compiler' must be the same as the version of 'vue' you're using in your codebase. Now set to 2.1.10. may have to manually put to other version that's used in your project.
