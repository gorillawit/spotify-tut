require ['$api/models'], (models) ->

    htmlEscape = (str) ->
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')

    tabs = () ->
        args = models.application.arguments
        if args
            lastArg = args[args.length - 1]
            return if lastArg isnt 'index' and lastArg isnt 'tabs'

        # compose file 
        # a = if true then 5 else 10
        if args.length is 1
            file = (args[0] + '.html') 
        else
            file = '/tutorials/' + args.slice(0, args.length-1).join('/') + '.html'
        # console.log(file);  //returns either index.html, tabs.html or any of the files in tutorials/
        xhr = new XMLHttpRequest()
        xhr.open 'GET', file
        xhr.onreadystatechange = () -> 
             # basically this says stop running this function if it's got all it's data or it can't retrieve it at all (i think)
            if xhr.readyState isnt 4 or xhr.status isnt 200 then return

            wrapper = document.getElementById 'wrapper'
            # fill #wrapper with... 

            # wrapper.innerHTML = if on index.html, no arguments, else add "back" breadcrumbs
            if args[0] is 'index'
                wrapper.innerHTML = '' 
            else 
                wrapper.innerHTML = '<ul class="breadcrumb"><li><a href="spotify:app:api-tutorial:index">&laquo; Back to main page</a></li></ul>'
            
            # basically if you're on the home page replace any injected child divs with the content that is actually in the original index.html file
            # if home tab (index page) is clicked or onLoad...
            if args[0] is 'index'
                # create a variable to hold the outermost div (parent of wrapper)
                aux = document.createElement 'div'
                # add file's html to the aux div
                aux.innerHTML = xhr.responseText
                # wrapper.innerHTML = index.html > div > #wrapper > child div
                wrapper.innerHTML = aux.querySelector('#wrapper').innerHTML
            else
                # else load the partial html from the tutorial link selected's partial html file (ev: tutorials/getting-started/arguments)
                wrapper.innerHTML += xhr.responseText

            window.scrollTo 0, 0
            # check all selectors ".html-snippet" and store them in an array
            htmlSnippets = wrapper.querySelectorAll(".html-snippet")
            console.log htmlSnippets
            # iterate over all the .html-snippets and check if they have an attribute of "data-container"
            for snips in htmlSnippets
                container = snips.getAttribute "data-container"
                # if it has a "data-container" attr...
                if container then document.getElementById(container).innerHTML = '<pre><code data-language="html">' + htmlEscape(snips.innerHTML) + '</code></pre>'
                    # add a <pre><code> around it and display the script as a code snippet (will not see as a script)

            # search for js snippets with a <script>, add to scripts array
            scripts = wrapper.querySelectorAll "script"
            # iterate over scripts array
            for sc in scripts
                # if current <script> has a type="script/snippet"
                if sc.getAttribute('type') is 'script/snippet'
                    # get the value of it's "data-execute" attr and store in dataExecute var
                    dataExecute = sc.getAttribute 'data-execute'
                    # if no "data-execute" at all or "data-execute"s value isn't 'no'
                    if !dataExecute or dataExecute isnt 'no'
                        # run that script
                        eval sc.innerHTML
                    # add all <script>s with "data-container" attr to container var
                    container = sc.getAttribute "data-container"
                    # if it does...
                    if container
                        document.getElementById(container).innerHTML = '<pre><code data-language="javascript">' + htmlEscape(sc.innerHTML) + '</code></pre>'
                        # display it as a code snippet 

            # search html snippets
            Rainbow.color()
            # i guess color code the code snippets

        xhr.send null

    # When application has loaded, run pages function
    models.application.load('arguments').done(tabs)

    # When arguments change, run pages function
    models.application.addEventListener 'arguments', tabs
# require
