/// RESTful API for getting the chunks
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Chunk = models.Chunk.Model;

// save/update the chunk
exports.post = (function(req, res) {
  
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

      // TODO: do validation to make sure the chunk can be saved
      chnk.save()
      res.send( { chunk: chnk } );
    });
});

// get the chunk
exports.show = (function(req, res) {
  // turn the params into useable x, y coords
  var args  = req.params.x_y.split('_');
  var x     = args[0];
  var y     = args[1];

  // get and return the chunk
  Chunk.findOne({ x: x, y: y })
    .populate('_tiles')
    .populate('_elements')
    .populate('_items')
    .exec(function (err, chnk) {
      if (err) return res.send( { error: err } );
      res.send( { chunk: chnk } );
    });
});
