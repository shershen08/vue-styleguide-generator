var renderer = require('./renderer');

const deferredRenderer = (comp) => {
  var deferred = Q.defer();
    renderer.render(comp, function(html){
        deferred.resolve(html);
    })
  return deferred.promise;
}


//let views = treeArray.map((x) => deferredRenderer(x.comp));
  console.log(views)
Q.spread(views, function () {
    console.log(agruments)
});
