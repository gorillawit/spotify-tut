module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

      watch: {
        options: {
            livereload: true,
        },
        scripts: {
          files: ['coffee/*.coffee'],
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
          files: ['./*.haml'],
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
            'css/app.css': 'sass/app.scss'
          }
        }
      },
      haml: {
        dist: {
          files: {
            'index.html': 'index.haml'
          }
        }
      },
      coffee: {
        compileWithMaps: {
          options: {
            sourceMap: true
          },
          files: {
            'js/scripts.js': 'coffee/scripts.coffee'
          }
        },
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