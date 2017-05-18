document.addEventListener("DOMContentLoaded", function(event) {
var options = {valueNames: ['name']};
var pluginList = new List('plugin-list', options);
if(window.hljs) highlightCodeBlocks();
document.getElementById('search-input').addEventListener('keyup', function(event) {
    if(event.which === 27){ 
    pluginList.search();
    event.target.value = '';
    }
}, false);
});
var highlightCodeBlocks =  function(event) {Array.prototype.forEach.call(document.getElementsByClassName('javascript'), function(block) {window.hljs.highlightBlock(block);})};
