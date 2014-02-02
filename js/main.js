require(['$api/models', '$views/list#List'], function(models, List) {
  var htmlEscape, tabs;
  htmlEscape = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  tabs = function() {
    var file, xhr;
    file = 'index.html';
    xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.onreadystatechange = function() {
      var aux, dropBox, list, playlist, wrapper;
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return;
      }
      wrapper = document.getElementById('wrapper');
      wrapper.innerHTML = '';
      aux = document.createElement('div');
      aux.innerHTML = xhr.responseText;
      wrapper.innerHTML = aux.querySelector('#wrapper').innerHTML;
      window.scrollTo(0, 0);
      playlist = models.Playlist.fromURI('spotify:user:gorillawit:playlist:3SD5mWUVQG7TJfuJmJDwKq');
      list = List.forPlaylist(playlist);
      document.getElementById('playlist-player').appendChild(list.node);
      list.init();
      dropBox = document.querySelector('#drop-box');
      dropBox.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/html', this.innerHTML);
        return e.dataTransfer.effectAllowed = 'copy';
      });
      dropBox.addEventListener('dragenter', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return this.classList.add('over');
      });
      dropBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
      });
      dropBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        return this.classList.remove('over');
      });
      return dropBox.addEventListener('drop', function(e) {
        var drop, successMessage;
        e.preventDefault();
        drop = models.Playlist.fromURI(e.dataTransfer.getData('text'));
        this.classList.remove('over');
        successMessage = document.createElement('p');
        successMessage.innerHTML = 'Playlist successfully dropped: ' + drop.uri;
        return this.appendChild(successMessage);
      });
    };
    return xhr.send(null);
  };
  models.application.load('arguments').done(tabs);
  return models.application.addEventListener('arguments', tabs);
});

//# sourceMappingURL=../js/main.js.map
