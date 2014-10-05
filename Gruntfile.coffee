module.exports = (grunt) ->
  grunt.initConfig
  
    coffee:
      compileJoined:
        options:
          join: true
        files:
          'public/javascripts/app.js':
            [ 'public/coffee/*.coffee', 'public/coffee/src/*.coffee' ]

      coffee_to_js:
        options:
          bare: true
        expand:   true
        flatten:  false
        cwd:      'src'
        src:      ['**/*.coffee']
        dest:     ''
        ext:      '.js'

    watch:
      files: '**/*.coffee'
      tasks:
        [ 'coffee' ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee']