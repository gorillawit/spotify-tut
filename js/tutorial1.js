require(['$api/models'], function(models) {

    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    function tabs() {
        var args = models.application.arguments;
        if (args) {
            var lastArg = args[args.length - 1];
            if (lastArg !== 'index' && lastArg !== 'tabs') {
                return;
           }
       }

        // compose file
        var file = args.length == 1 ? (args[0] + '.html') : '/tutorials/' + args.slice(0, args.length-1).join('/') + '.html';
        //console.log(file);  //returns either index.html, tabs.html or any of the files in tutorials/
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file);
        xhr.onreadystatechange = function () {
            // basically this says stop running this function if it's got all it's data or it can't retrieve it at all (i think)
            if (xhr.readyState != 4 || xhr.status != 200) return;

            var wrapper = document.getElementById('wrapper');
            // fill #wrapper with... 

            // wrapper.innerHTML = if on index.html, no arguments, else add "back" breadcrumbs
            wrapper.innerHTML = args[0] === 'index' ? '' : '<ul class="breadcrumb"><li><a href="spotify:app:api-tutorial:index">&laquo; Back to main page</a></li></ul>';

            // basically if you're on the home page replace any injected child divs with the content that is actually in the original index.html file
            // if home tab (index page) is clicked or onLoad...
            if (args[0] === 'index') {
                // create a variable to hold the outermost div (parent of wrapper)
                var aux = document.createElement('div');
                // add file's html to the aux div
                aux.innerHTML = xhr.responseText;
                // wrapper.innerHTML = index.html > div > #wrapper > child div
                wrapper.innerHTML = aux.querySelector('#wrapper').innerHTML;
            } else {
                // else load the partial html from the tutorial link selected's partial html file (ev: tutorials/getting-started/arguments)
                wrapper.innerHTML += xhr.responseText;
                console.log(wrapper.innerHTML);
            }

            window.scrollTo(0, 0);
            // check all selectors ".html-snippet" and store them in an array
            var htmlSnippets = wrapper.querySelectorAll(".html-snippet");
            // iterate over all the .html-snippets and check if they have an attribute of "data-container"
            for (i = 0; i < htmlSnippets.length; i++) {
                container = htmlSnippets[i].getAttribute("data-container");
                // if it has a "data-container" attr...
                if (container) {
                    // add a <pre><code> around it and display the script as a code snippet (will not see as a script)
                    document.getElementById(container).innerHTML = '<pre><code data-language="html">' + htmlEscape(htmlSnippets[i].innerHTML) + '</code></pre>';
                }
            }

            // search for js snippets with a <script>, add to scripts array
            var scripts = wrapper.querySelectorAll("script");
            // iterate over scripts array
            for (var i = 0; i < scripts.length; i++) {
                // if current <script> has a type="script/snippet"
                if (scripts[i].getAttribute('type') == 'script/snippet') {
                    // get the value of it's "data-execute" attr and store in dataExecute var
                    var dataExecute = scripts[i].getAttribute('data-execute');
                    // if no "data-execute" at all or "data-execute"s value isn't 'no'
                    if (!dataExecute || dataExecute != 'no') {
                        // run that script
                        eval(scripts[i].innerHTML);
                    }
                    // add all <script>s with "data-container" attr to container var
                    var container = scripts[i].getAttribute("data-container");
                    // if it does...
                    if (container) {
                        // display it as a code snippet 
                        document.getElementById(container).innerHTML = '<pre><code data-language="javascript">' + htmlEscape(scripts[i].innerHTML) + '</code></pre>';
                    }
                }
            }

            // search html snippets
            Rainbow.color();
            // i guess color code the code snippets
        };
        xhr.send(null);
    }

    // When application has loaded, run pages function
    models.application.load('arguments').done(tabs);

    // When arguments change, run pages function
    models.application.addEventListener('arguments', tabs);
}); // require
