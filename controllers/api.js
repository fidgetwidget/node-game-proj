var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');

var Chunk = models.Chunk.Model;

// 
// POST ACTIONS
// 

// save/update the chunk
var post_chunk = (function(req, res) {
  
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

// TODO: maybe change the param syntax?
// save/ update a single tile
var post_tile = (function(req, res) {

  var params    = req['body'];
  var chunk     = params['chunk'];
  var cx        = chunk['x'];
  var cy        = chunk['y'];
  var tile      = params['tile']
  var tx        = tile['x']
  var ty        = tile['y']
  var tv        = tile['value']


  Chunk.findOne({ x:cx, y:cy })
    .exec( function (err, chnk) {
      if (err) return res.send( { error: err } );
      // if there isn't one with those x/y, then make one
      if (!chnk) return res.send( { error: 'chunk x:'+cx+' y:'+cy+' not found'})
      
      now = Date.now()
      
      //  search for the tile in question
      tle = chnk._tiles.filter( function(tile) {
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
// GET ACTIONS
// 

// get the chunk
var get_chunk = (function(req, res) {
  var args, cx, cy;
  // turn the params into useable x, y coords
  args    = req.params.chunk_x_y.split('_');
  cx      = args[0];
  cy      = args[1];
  Chunk.findOne({ x: cx, y: cy })
    .exec(function (err, chnk) {
      if (err) return res.send( { error: err } );
      res.send( { chunk: chnk } );
    });
});

var get_tile = (function(req, res) {
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

router.post('/',                                    post_chunk );
router.post('/:chunk_x_y/tiles.:format?',           post_tile );

router.get( '/:chunk_x_y.:format',                  get_chunk );
router.get( '/:chunk_x_y/tiles.:format',            get_tile );
router.get( '/:chunk_x_y/tiles/:tile_x_y.:format',  get_tile );

module.exports = router;
