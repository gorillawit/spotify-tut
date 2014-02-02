module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({

      watch: {
        options: {
            livereload: true,
        },
        scripts: {
          files: ['src/*.coffee'],
          tasks: ['coffee'],
          options: {
              spawn: false,
          }
        },
        css: {
          files: ['sass/*.scss'],
          tasks: ['sass'],
          options: {
              spawn: false,
          }
        },
        html: {
          files: ['*.haml', 'tutorials/playing/*.haml'],
          tasks: ['haml'],
          options: {
              spawn: false,
          }
        }
      },
      sass: {
        dist: {
          options: {
            style: 'expanded',
            sourcemap: true
          },
          files: {
            'css/app.css': ['sass/*.scss']
          }
        }
      },
      haml: {
        dist: {
          files: {
            'index.html': 'index.haml', 
            'tutorials/playing/play-track.html' : 'tutorials/playing/play-track.haml',
            'tutorials/playing/play-list-tracks.html' : 'tutorials/playing/play-list-tracks.haml'
          }
        }
      },
      coffee: {
        compileWithMaps: {
          options: {
            sourceMap: true,
            bare: true
          },
          files: {
            'lib/main.js' : ['src/*.coffee'] // concat then compile into single file
            // 'js/tutorial.js' : ['coffee/*.coffee'] // concat then compile into single file
          }
        }
      }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-haml');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['sass', 'haml', 'coffee']);
};