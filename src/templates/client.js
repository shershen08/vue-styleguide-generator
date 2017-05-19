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
function CopyClipboard(eventTarget){
  let t = document.createElement('textarea')
  t.id = 't'
  t.style.height = 0
  document.body.appendChild(t)
  t.value = eventTarget.parentElement.childNodes[1].innerText;
  let selector = document.querySelector('#t')
  selector.select()
  document.execCommand('copy')
  document.body.removeChild(t)
}
var highlightCodeBlocks =  function(event) {Array.prototype.forEach.call(document.getElementsByClassName('javascript'), function(block) {window.hljs.highlightBlock(block);})};
