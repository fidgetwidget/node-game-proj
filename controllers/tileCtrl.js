var mongoose = require('mongoose');
var models = require('../models/models.js');

var Chunk = models.Chunk.Model;

var tile = {}

// 
// POST ACTION
// 

tile.post = (function(req, res) {

  var params    = req['body'];
  var chunk     = params['chunk'];
  var cx        = chunk['x'];
  var cy        = chunk['y'];
  var tile      = params['tile'];
  var tx        = tile['x'];
  var ty        = tile['y'];
  var tv        = tile['value'];


  Chunk.findOne({ x:cx, y:cy })
    .exec( function (err, chnk) {
      if (err) return res.send( { error: err } );
      // if there isn't one with those x/y, then make one
      if (!chnk) return res.send( { error: 'chunk x:'+cx+' y:'+cy+' not found'} );
      
      now = Date.now();
      
      //  search for the tile in question
      tle = chnk._tiles.filter( 
        function(tile) {
          if (tile.x == tx && tile.y == ty) {
            tile.value = tv;
            tile.updated = now;
            return tile;
          }
        }).pop();

      //  if the tile isn't there, then create a new one
      if (!tle) {
        chnk._tiles.push({ x: tx, y: ty, value: tv, updated: now, created: now });
      }

      // TODO: do validation to make sure the chunk can be saved
      chnk.save()
      res.send( { chunk: chnk } );
    });
});

// 
// DELETE ACTION
// 

tile.del = (function(req, res) {
  var params    = req['body'];
  var chunk     = params['chunk'];
  var cx        = chunk['x'];
  var cy        = chunk['y'];
  var tile      = params['tile'];
  var ex        = tile['x'];
  var ey        = tile['y'];

  Chunk.findOne({ x:cx, y:cy })
    .exec( function (err, chnk) {
      if (err) return res.send( { error: err } );
      // if there isn't one with those x/y, then make one
      if (!chnk) return res.send( { error: 'chunk x:'+cx+' y:'+cy+' not found'})
            
      var tle = null;
      var index = -1;
      for (i = 0; i >= chnk._tiles.length || index > 0; i += 1) {
        tle = chnk._tiles[i]
        if (tle.x == ex && tle.y == ey) { index = i; }
      }
      if (index > 0) {
        chnk._tiles.splice(index, 1);  
        chnk.save()
      }
      
      res.send( { chunk: chnk } );
    });

});

// 
// GET ACTION
// 

tile.get = (function(req, res) {
  var args, cx, cy, tx, ty;

  args  = req.params.chunk_x_y.split('_');
  cx    = args[0];
  cy    = args[1];
  Chunk.findOne({ x: cx, y: cy })
    .exec(function (err, chnk) {
      if (err) return res.send( { error: err } );

      if (req.params.tile_x_y) {
        args  = req.params.tile_x_y.split('_');
        tx    = args[0];
        ty    = args[1];

        tle = chnk._tiles.filter( function(tile) {
          return tile.x == tx && tile.y == ty;
        }).pop();
        // show only the tile in question (if there is one)
        res.send({ tiles: tle });
      } else {
        // show all of the tiles
        res.send({ tiles: chnk._tiles });
      }
    });
  
});

module.exports = tile
