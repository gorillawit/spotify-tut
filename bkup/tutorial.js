require(['$api/models'], function(models) {
  var htmlEscape, tabs;
  htmlEscape = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  tabs = function() {
    var args, file, lastArg, xhr;
    args = models.application["arguments"];
    console.log(args);
    if (args) {
      lastArg = args[args.length - 1];
      if (lastArg !== 'index' && lastArg !== 'tabs') {
        return;
      }
    }
    if (args.length === 1) {
      file = args[0] + '.html';
    } else {
      file = '/tutorials/' + args.slice(0, args.length - 1).join('/') + '.html';
    }
    xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.onreadystatechange = function() {
      var aux, container, dataExecute, sc, scripts, wrapper, _i, _len;
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return;
      }
      wrapper = document.getElementById('wrapper');
      if (args[0] === 'index') {
        wrapper.innerHTML = '';
      } else {
        wrapper.innerHTML = '<ul class="breadcrumb"><li><a href="spotify:app:api-tutorial:index">&laquo; Back to main page</a></li></ul>';
      }
      if (args[0] === 'index') {
        aux = document.createElement('div');
        aux.innerHTML = xhr.responseText;
        wrapper.innerHTML = aux.querySelector('#wrapper').innerHTML;
      } else {
        wrapper.innerHTML += xhr.responseText;
      }
      window.scrollTo(0, 0);
      scripts = wrapper.querySelectorAll("script");
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        sc = scripts[_i];
        if (sc.getAttribute('type') === 'script/snippet') {
          dataExecute = sc.getAttribute('data-execute');
          if (!dataExecute || dataExecute !== 'no') {
            eval(sc.innerHTML);
          }
          container = sc.getAttribute("data-container");
          if (container) {
            document.getElementById(container).innerHTML = '<pre><code data-language="javascript">' + htmlEscape(sc.innerHTML) + '</code></pre>';
          }
        }
      }
      return Rainbow.color();
    };
    return xhr.send(null);
  };
  models.application.load('arguments').done(tabs);
  return models.application.addEventListener('arguments', tabs);
});
