require ['$api/models', '$views/list#List'], (models, List) ->
    htmlEscape = (str) ->
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')

    tabs = () ->
        # THIS PART IS FOR IF YOU WANT TABS AT THE TOP, 
        # args = models.application.arguments # arguments are in the manifest.json file
        # if args
            # lastArg = args[args.length - 1] #lastArg is always index until I change it
            # return if lastArg isnt 'index' and lastArg isnt 'tabs'

        # compose file 
        # if args.length is 1
            # file = (args[0] + '.html') 
        # else
            # file = '/tutorials/' + args.slice(0, args.length-1).join('/') + '.html'
        # console.log(file);  //returns either index.html, tabs.html or any of the files in tutorials/

        # args = models.application.arguments
        file = ('index.html')

        xhr = new XMLHttpRequest()
        xhr.open 'GET', file
        xhr.onreadystatechange = () -> 
             # basically this says stop running this function if it's got all it's data or it can't retrieve it at all (i think)
            if xhr.readyState isnt 4 or xhr.status isnt 200 then return

            wrapper = document.getElementById 'wrapper'
            # fill #wrapper with... 
            wrapper.innerHTML = ''
            aux = document.createElement 'div'
            aux.innerHTML = xhr.responseText
            wrapper.innerHTML = aux.querySelector('#wrapper').innerHTML

            window.scrollTo 0, 0
              
            playlist = models.Playlist.fromURI 'spotify:user:gorillawit:playlist:3SD5mWUVQG7TJfuJmJDwKq'
            list = List.forPlaylist playlist
            document.getElementById('playlist-player').appendChild list.node
            list.init()

            # Handle drag and drops
            dropBox = document.querySelector '#drop-box'

            # add "copy" icon to mouse cursor
            dropBox.addEventListener 'dragstart', (e) ->
                e.dataTransfer.setData 'text/html', @innerHTML
                e.dataTransfer.effectAllowed = 'copy'
                # false

            # drop-box turns to green outline when dragging and hovered over
            dropBox.addEventListener 'dragenter', (e) ->
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
                @classList.add 'over'
                # false

            # prevents the default action of showing the default Spotify playlist view
            dropBox.addEventListener 'dragover', (e) ->
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
                return false
                # false

            # drop-box returns to black outline when dragging off of it
            dropBox.addEventListener 'dragleave', (e) ->
                e.preventDefault()
                @classList.remove 'over'
                # false

            # on drop, show the uri address for the playlist (from which we'll be getting all the data)
            dropBox.addEventListener 'drop', (e) ->
                e.preventDefault()
                drop = models.Playlist.fromURI e.dataTransfer.getData 'text'
                @classList.remove 'over'
                successMessage = document.createElement 'p'
                successMessage.innerHTML = 'Playlist successfully dropped: ' + drop.uri
                @appendChild successMessage
                # false

            # search for js snippets with a <script>, add to scripts array
            # scripts = wrapper.querySelectorAll "script"
            # iterate over scripts array
            # for sc in scripts
                # if current <script> has a type="script/snippet"
                # if sc.getAttribute('type') is 'script/snippet'
                    # get the value of it's "data-execute" attr and store in dataExecute var
                    # dataExecute = sc.getAttribute 'data-execute'
                    # if no "data-execute" at all or "data-execute"s value isn't 'no'
                    # if !dataExecute or dataExecute isnt 'no'
                        # run that script
                        # eval sc.innerHTML
                    # add all <script>s with "data-container" attr to container var
                    # container = sc.getAttribute "data-container"
                    # if it does...
                    # if container
                        # document.getElementById(container).innerHTML = '<pre><code data-language="javascript">' + htmlEscape(sc.innerHTML) + '</code></pre>'
                        # display it as a code snippet 

            # search html snippets
            # Rainbow.color()
            # i guess color code the code snippets

        xhr.send null

    # When application has loaded, run pages function
    models.application.load('arguments').done(tabs)

    # When arguments change, run pages function
    models.application.addEventListener 'arguments', tabs
# require
