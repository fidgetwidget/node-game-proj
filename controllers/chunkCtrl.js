var mongoose = require('mongoose');
var models = require('../models/models.js');

var Chunk = models.Chunk.Model;

var ChunkCtrl = {}

// 
// POST ACTIONS
// 

ChunkCtrl.post = (function(req, res) {
  
  var params    = req['body'];
  // TODO: ensure the params are safe
  var x         = params['x'];
  var y         = params['y'];
  var base      = params['base'];
  var tiles     = params['tiles'];
  var elements  = params['elements'];
  var items     = params['items'];

  Chunk.findOne({ x:x, y:y })
    .exec( function (err, chnk) {
      if (err) return res.send( { error: err } );

      // if there isn't one with those x/y, then make one
      if (!chnk) chnk = new Chunk({ x:x, y:y })

      chnk.base = base;
      // TODO: optimize this so that it saves only the differences if the chunk already existed
      chnk._tiles = tiles ? tiles : void 0;
      chnk._elements = elements ? elements : void 0;
      chnk._items = items ? items : void 0;

      console.log('save chunk x'+x+' y'+y);
      chnk.save()
      res.send( { chunk: chnk } );
    });
});

// 
// GET ACTIONS
// 

// get the chunk
ChunkCtrl.get = (function(req, res) {
  var args, cx, cy;
  // turn the params into useable x, y coords
  args    = req.params.chunk_x_y.split('_');
  cx      = parseInt(args[0]);
  cy      = parseInt(args[1]);
  Chunk.findOne({ x: cx, y: cy })
    .exec(function (err, chnk) {
      if (err) return res.send( { error: err } );
      res.send( { chunk: chnk } );
    });
});

module.exports = ChunkCtrl
