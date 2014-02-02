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
      var aux, dropBox, dropBoxMessage, playlistPlayer, wrapper;
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return;
      }
      wrapper = document.getElementById('wrapper');
      wrapper.innerHTML = '';
      aux = document.createElement('div');
      aux.innerHTML = xhr.responseText;
      wrapper.innerHTML = aux.querySelector('#wrapper').innerHTML;
      window.scrollTo(0, 0);
      dropBox = document.querySelector('#drop-box');
      dropBoxMessage = dropBox.querySelector('p');
      playlistPlayer = document.getElementById('playlist-player');
      dropBox.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/html', this.innerHTML);
        return e.dataTransfer.effectAllowed = 'copy';
      }, false);
      dropBox.addEventListener('dragenter', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return this.classList.add('over');
      }, false);
      dropBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
      }, false);
      dropBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        return this.classList.remove('over');
      }, false);
      return dropBox.addEventListener('drop', function(e) {
        var list, playlist;
        e.preventDefault();
        playlist = models.Playlist.fromURI(e.dataTransfer.getData('text'));
        list = List.forPlaylist(playlist);
        playlistPlayer.appendChild(list.node);
        list.init();
        dropBoxMessage.setAttribute("class", "hidden");
        dropBox.setAttribute("class", "hidden");
        return this.classList.remove('over');
      }, false);
    };
    return xhr.send(null);
  };
  return models.application.load().done(tabs);
});

//# sourceMappingURL=../js/main.js.map
