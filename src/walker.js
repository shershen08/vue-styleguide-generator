var path = require('path')
var fs = require('fs')
var dir = require('node-dir')
var Q = require('Q')

let runOptions
let folderSearchCallbacks = []
let fileSearchCallbacks = []
let allSubdirs = []
let allApplicableFiles = []
const RegExVueAndMdFiles = /.vue$|.md/

const recursivelyIterateComponentsFolder = (folderFromName) => {
  var dfd = Q.defer()
  folderSearchCallbacks.push(dfd.promise)

  getSubDirsList(folderFromName).then(function (subdirs) {
    if (subdirs.length) {
      allSubdirs = allSubdirs.concat(subdirs)
      subdirs.forEach(function (dir) {
        recursivelyIterateComponentsFolder(dir)
      })
    }
    dfd.resolve(folderFromName)
  })
}

const collectFiles = (foldersArray) => {

  foldersArray.forEach(function (folder) {
    var dfd = Q.defer()
    fileSearchCallbacks.push(dfd.promise)

    readFlatFiles(folder).then(function (files) {
      allApplicableFiles.push(files)
      dfd.resolve(files)
    })
  })
}
const getSubDirsList = (dirPath, callback) => {
  var dfd = Q.defer()

  dir.subdirs(dirPath, function (err, subdirs) {
    if (err) throw err
    dfd.resolve(subdirs)
  })
  return dfd.promise
}
const readFlatFiles = (dirPath) => {
  var dfd = Q.defer()

  dir.readFiles(dirPath, {
    match: RegExVueAndMdFiles,
    exclude: (runOptions.exclude || /^\./),
    excludeDir: runOptions.excludeDir,
    matchDir: runOptions.matchDir,
    recursive: false
  }, function (err, content, next) {
    next()
  },
    function (err, files) {
      if (err) throw err
      dfd.resolve({
      dirPath,files})
    })
  return dfd.promise
}
const treeParsingErrorCallback = (error) => {
  console.log('Smth went wrong.', error)
}
const mainIterator = (folderFromName, optionsObj, callback) => {
  runOptions = optionsObj
  allSubdirs = [folderFromName]

  recursivelyIterateComponentsFolder(folderFromName)

  Q.allSettled(folderSearchCallbacks).then(function () {
    collectFiles(allSubdirs)
    Q.allSettled(fileSearchCallbacks).then(function () {
      callback(allApplicableFiles)
    }).catch(treeParsingErrorCallback)
  }).catch(treeParsingErrorCallback)
}
module.exports = {
  walk: mainIterator
}
