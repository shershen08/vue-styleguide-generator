var path = require('path')
var fs = require('fs')
var dir = require('node-dir');
var Q = require('Q');

let runOptions;
let allReadFiles = [];
let allCallbacks = [];

const recursivelyIterateComponentsFolder = (folderFromName) => {
  var dfd = Q.defer();
  allCallbacks.push(dfd.promise);

  getSubDirsList(folderFromName).then(function(subdirs){
    if(subdirs.length) {
      subdirs.forEach(function(dir){
        recursivelyIterateComponentsFolder(dir)
      })
    }
  });

  readFlatFiles(folderFromName).then(function(files){
      allReadFiles.push(files);
      dfd.resolve(files)
  });
}

const getSubDirsList = (dirPath, callback) =>{
  var dfd = Q.defer();

  dir.subdirs(dirPath, function(err, subdirs){
    if (err) throw err;
    dfd.resolve(subdirs);
  })
  return dfd.promise;
}
const readFlatFiles = (dirPath) => {
  var dfd = Q.defer();

  dir.readFiles(dirPath, {
      match: /.vue$|.md/,
      exclude: (runOptions.exclude || /^\./),
      excludeDir: runOptions.excludeDir,
      matchDir:runOptions.matchDir,
      recursive: false
    }, function(err, content, next) {
        next();
    },
    function(err, files){
        if (err) throw err;

        dfd.resolve({
          dirPath,
          files
        });
    });
    return dfd.promise;
}
const mainIterator = (folderFromName, optionsObj, callback) => {
    runOptions = optionsObj;

    recursivelyIterateComponentsFolder(folderFromName);

    Q.allSettled(allCallbacks).then(function(){
      callback(allReadFiles);
    }).catch(function (error) {
      console.log('Smth went wrong.', error);
      callback(allReadFiles);
    });
}
module.exports = {
  walk : mainIterator
};
