# Vue js components styleguide generator 📚

> Initially started after reading [this vue.js feature request](https://github.com/vuejs/vue-requests/issues/17).
Now only basic proof of concept is available which can load folder with .vue files, parse it and extract basic props of it.

Target is to have some tool with at least some of the [React version](https://github.com/styleguidist/react-styleguidist) capabilities.

Idea is to have what [vue-play](https://github.com/vue-play/vue-play) does but in automated way - with one task run, plus READMEs, etc.

**Generate single html file containing all components listed with details and search out from your .vue project files.**

## 1. Examples

### Running on large components collections

Installing and running styleguide generator on [vuikit](https://github.com/vuikit/vuikit) repo results in [**DEMO html-file**](https://shershen08.github.io/vue-plugins-demo-static/vuikit-demo-index.html). As you can see there are missing parts, but still it's totaly automated and I am working hard to have more consistent output.

### Output UI demo
 ![resulting output](https://raw.githubusercontent.com/shershen08/vue-styleguide-generator/master/demo-output.jpg)


## 2. Setup

  1. ```npm install vue-styleguide-generator --save-dev```

  2. add to you package.json in script section - for example like this ```"build-components": "node ./node_modules/vue-styleguide-generator/"``` and then run ```npm run build-components``` from the root folder of the project.

  🏃 You can also manually (or using Gulp/Grunt) run ```node ./node_modules/vue-styleguide-generator/```

## 3. Usage

✅ Works only for Vue 2.x projects.

#### CLI options

| Name | Type | Default | Description |
| ---: | ---- |  ------ |------------ |
| --src  | String|Source dir, will be recursively scanned|src|
| --dest | String|Destination output dir, file index.html will be placed there| components-preview|
| --exclude| RegExp|File mask to exclude certain type of files|/^\./|
| --locale|String|Output locale language|en|
| --verbose| String|Output all details while processing| false|
| --all| String|Do not ignore any components| false|

 E.g.: ```node ./node_modules/vue-styleguide-generator/ --src components --dest preview``` will read components from PROJECT_ROOT/components folder and provide a html page into PROJECT_ROOT/preview folder


#### How the components are iterated

 If you want to see more information about the component - add a .md file in the same directory.
 While retrieving the files the following assumptions are made:
  - if there are files with the **same name** in one folder (e.g. ```/scr/partials/TabBar.vue``` and ```/scr/partials/TabBar.md```) it's assumed to be one component;
  - if there are **only two** files in the folder and one is .vue and another is .md (e.g. ```/scr/TabBar/codez.vue``` and ```/scr/partials/readers.md```)  it's assumed to be one component;
  - If there are >1 .vue files in the folder and .md file that does not have the same name as one of the .vue files - this .md file is ignored
  - Components with no props, no computed and no methods defined are considered to be a simple wrappers and not outputed


  Found a bug or have a proposal - please [create an issue](https://github.com/shershen08/vue-styleguide-generator/issueshttps://github.com/shershen08/vue-styleguide-generator/issues) or tweet me [@legkoletat](https://twitter.com/legkoletat)!

### Todos

- core: add tests
- core: move the demo-page to use Vue so that components can be generated from its declaration
- ui: output extra component parameters (computable, data)
- various use cases testing

#### Contributions are welcome 👍!

Especially on following:
 - [translations](https://github.com/shershen08/vue-styleguide-generator/tree/master/i18n)
 - extra features
 - implementing SSR

### Bugs and problems
-  window object [may not be patched fully](https://github.com/shershen08/vue-styleguide-generator/blob/master/src/processor.js#L29) so some component's code execution may fail
- 'vue-template-compiler' must be the same as the version of 'vue' you're using in your codebase. Now set to 2.1.10. may have to manually put to other version that's used in your project.
