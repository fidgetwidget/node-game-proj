mongoose  = require 'mongoose'
models    = require '../models/models.js'

Chunk = models.Chunk.Model

class ElementCtrl

  ### POST ACTION ###

  @post:  (req, res) ->

    params    = req['body']
    chunk     = params['chunk']
    cx        = +chunk['x']
    cy        = +chunk['y']
    element   = params['element']
    ex        = +element['x']
    ey        = +element['y']
    ev        = +element['value']

    Chunk.findOne({ x:cx, y:cy })
      .exec (err, chnk) ->
        if (err) 
          return res.send({error: err})
        # if there isn't one with those x/y, then make one
        if (!chnk) 
          return res.send({error: "chunk #{cx}_#{cy} not found."})

        now = Date.now()
        #  search for the element in question
        ent = chnk._elements.filter (element) ->
            if (element.x is ex and element.y is ey) 
              element.value = ev
              element.updated = now
              return element
          .pop()

        # if the element isn't there, then create a new one
        if (!ent) 
          chnk._elements.push({ x: ex, y: ey, value: ev, updated: now, created: now })
          console.log "element #{ex}_#{ey} in chunk #{cx}_#{cy} created."
        else
          console.log "element #{ex}_#{ey} in chunk #{cx}_#{cy} changed."

        # TODO: do validation to make sure the chunk can be saved
        chnk.save()
        res.send({ chunk: chnk })
        return

  ### DELETE ACTION ###

  @del = (req, res) ->

    params    = req['body']
    chunk     = params['chunk']
    cx        = +chunk['x']
    cy        = +chunk['y']
    element   = params['element']
    ex        = +element['x']
    ey        = +element['y']

    Chunk.findOne({x:cx, y:cy})
      .exec (err, chnk) ->
        if (err) 
          return res.send({ error: err })
        # if there isn't one with those x/y, then make one
        if (!chnk) 
          console.log "chunk #{cx}_#{cy} not found"
          return res.send({ error: "chunk #{cx}_#{cy} not found" })
              
        # There must be a better way to do this with coffee syntax 
        index = -1
        i = 0
        while (i < chnk._elements.length and index < 0)
          elm = chnk._elements[i]
          if (elm.x is ex and elm.y is ey)
            index = i
          i++

        if (index >= 0) 
          chnk._elements.splice(index, 1)
          chnk.save()
          console.log "element #{ex}_#{ey} DEL in chunk #{cx}_#{cy}"

        else 
          console.log "element #{ex}_#{ey} in chunk #{cx}_#{cy} not found, unable to be removed."
          return res.send({ error: "element #{ex}_#{ey} in chunk #{cx}_#{cy} not found, unable to be removed" })
        
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

        if (req.params.elm_x_y)
          args  = req.params.elm_x_y.split '_'
          ex    = args[0]
          ey    = args[1]

          elm = chnk._elements.filter (element) ->
              return (element.x is ex and element.y is ey)
            .pop()
          # show only the tile in question (if there is one)
          res.send({ elements: elm })
        else
          # show all of the tiles
          res.send({ elements: chnk._elements })
        return

module.exports = ElementCtrl
