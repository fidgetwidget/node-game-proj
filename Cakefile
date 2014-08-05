
fs            = require 'fs'
path          = require 'path'
{print}       = require 'util'
{spawn, exec} = require 'child_process'



task 'build', 'Compile CoffeeScript using Rehab', ->
  console.log "Compiling project from src/*.coffee to app.js"

  to_single_file =  "--join     public/javascripts/app.js"
  from_files =      "--compile  public/javascripts/src/*.coffee"

  exec "coffee #{to_single_file} #{from_files}", (err, stdout, stderr) ->
    throw err if err