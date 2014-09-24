module.exports = (grunt) ->
  grunt.initConfig
  
    coffee:
      compileJoined:
        options:
          join: true
        files:
          'public/javascripts/app.js':
            [ 'public/coffee/*.coffee', 'public/coffee/src/*.coffee' ]

    watch:
      files: 'public/coffee/*.coffee'
      tasks:
        [ 'coffee' ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee']