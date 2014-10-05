mongoose  = require 'mongoose'
models    = require '../models/models.js'

Chunk     = models.Chunk.Model

class ChunkCtrl

  ### POST ACTIONS ### 
  
  @post: (req, res) ->
  
    params    = req['body']
    x         = params['x']
    y         = params['y']
    base      = params['base']
    tiles     = params['tiles']
    elements  = params['elements']
    items     = params['items']

    Chunk.findOne({ x:x, y:y })
      .exec (err, chnk) ->
        if (err) 
          return res.send({error: err})

        # if there isn't one with those x/y, then make one
        if (!chnk) 
          chnk = new Chunk({x:x, y:y})

        chnk.base = base

        # TODO: optimize this so that it saves only the differences if the chunk already existed
        chnk._tiles     = tiles     || undefined
        chnk._elements  = elements  || undefined
        chnk._items     = items     || undefined

        console.log "save chunk x#{x} y#{y}"
        chnk.save()
        res.send({chunk: chnk})
        return


  ### GET ACTIONS ###

  @get: (req, res) ->
  
    # turn the params into useable x, y coords
    args    = req.params.chunk_x_y.split '_'
    cx      = parseInt args[0]
    cy      = parseInt args[1]
    Chunk.findOne({x: cx, y: cy})
      .exec (err, chnk) ->
        if (err) 
          return res.send({error: err})
            
        res.send({chunk: chnk})
        return


module.exports = ChunkCtrl
