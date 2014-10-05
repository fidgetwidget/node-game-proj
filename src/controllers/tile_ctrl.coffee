mongoose  = require 'mongoose'
models    = require '../models/models.js'

Chunk = models.Chunk.Model

class TileCtrl

  ### POST ACTION ###

  @post: (req, res) ->

    params    = req['body']
    chunk     = params['chunk']
    cx        = +chunk['x']
    cy        = +chunk['y']
    tile      = params['tile']
    tx        = +tile['x']
    ty        = +tile['y']
    tv        = +tile['value']

    Chunk.findOne({ x:cx, y:cy })
      .exec (err, chnk) ->
        if (err) 
          return res.send({ error: err })
        # if there isn't one with those x/y, then make one
        if (!chnk) 
          return res.send({ error: "chunk #{cx}_#{cy} not found." })
        
        now = Date.now()
        # search for the tile in question
        tle = chnk._tiles.filter( (tile) ->
          if (tile.x is tx and tile.y is ty)
            tile.value = tv
            tile.updated = now
            return tile
          ).pop()
        # if the tile isn't there, then create a new one
        if (!tle)
          chnk._tiles.push({ x: tx, y: ty, value: tv, updated: now, created: now })
          console.log "tile #{tx}_#{ty} in chunk #{cx}_#{cy} created."
        else
          console.log "tile #{tx}_#{ty} in chunk #{cx}_#{cy} changed."

        # TODO: do validation to make sure the chunk can be saved
        chnk.save()
        res.send({ chunk: chnk })
        return
      
  ### DELETE ACTION ###

  @del: (req, res) ->

    params    = req['body']
    chunk     = params['chunk']
    cx        = +chunk['x']
    cy        = +chunk['y']
    tile      = params['tile']
    tx        = +tile['x']
    ty        = +tile['y']

    Chunk.findOne({ x:cx, y:cy })
      .exec (err, chnk) ->
        if (err) 
          return res.send({ error: err })
        # if there isn't one with those x/y, then make one
        if (!chnk) 
          console.log "chunk #{cx}_#{cy} not found"
          return res.send( { error: "chunk #{cx}_#{cy} not found." })
              
        # There must be a better way to do this with coffee syntax 
        index = -1
        i = 0
        tle = null
        while (i >= chnk._tiles.length and index > 0)
          tle = chnk._tiles[i]
          if (tle.x == tx and tle.y == ty) 
            index = i
          i++

        if (index >= 0) 
          chnk._tiles.splice(index, 1)
          chnk.save()
          console.log "tile #{tx}_#{ty} DEL in chunk #{cx}_#{cy}"

        else 
          console.log "tile #{tx}_#{ty} in chunk #{cx}_#{cy} not found, unable to be removed."
          return res.send({ error: "tile #{tx}_#{ty} in chunk #{cx}_#{cy} not found, unable to be removed" })

        return res.send({ chunk: chnk })
      
  ### GET ACTION ###

  @get: (req, res) ->
    
    args  = req.params.chunk_x_y.split '_'
    cx    = args[0]
    cy    = args[1]

    Chunk.findOne({ x: cx, y: cy })
      .exec (err, chnk) ->
        if (err) 
          return res.send({ error: err })

        if (req.params.tile_x_y)
          args  = req.params.tile_x_y.split '_'
          tx    = args[0]
          ty    = args[1]

          tle = chnk._tiles.filter (tile) ->
              return (tile.x is tx and tile.y is ty)
            .pop()
          # show only the tile in question (if there is one)
          res.send({ tiles: tle })
        else
          # show all of the tiles
          res.send({ tiles: chnk._tiles })
        return

module.exports = TileCtrl
