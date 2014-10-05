var Chunk, TileCtrl, models, mongoose;

mongoose = require('mongoose');

models = require('../models/models.js');

Chunk = models.Chunk.Model;

TileCtrl = (function() {
  function TileCtrl() {}


  /* POST ACTION */

  TileCtrl.post = function(req, res) {
    var chunk, cx, cy, params, tile, tv, tx, ty;
    params = req['body'];
    chunk = params['chunk'];
    cx = +chunk['x'];
    cy = +chunk['y'];
    tile = params['tile'];
    tx = +tile['x'];
    ty = +tile['y'];
    tv = +tile['value'];
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      var now, tle;
      if (err) {
        return res.send({
          error: err
        });
      }
      if (!chnk) {
        return res.send({
          error: "chunk " + cx + "_" + cy + " not found."
        });
      }
      now = Date.now();
      tle = chnk._tiles.filter(function(tile) {
        if (tile.x === tx && tile.y === ty) {
          tile.value = tv;
          tile.updated = now;
          return tile;
        }
      }).pop();
      if (!tle) {
        chnk._tiles.push({
          x: tx,
          y: ty,
          value: tv,
          updated: now,
          created: now
        });
        console.log("tile " + tx + "_" + ty + " in chunk " + cx + "_" + cy + " created.");
      } else {
        console.log("tile " + tx + "_" + ty + " in chunk " + cx + "_" + cy + " changed.");
      }
      chnk.save();
      res.send({
        chunk: chnk
      });
    });
  };


  /* DELETE ACTION */

  TileCtrl.del = function(req, res) {
    var chunk, cx, cy, params, tile, tx, ty;
    params = req['body'];
    chunk = params['chunk'];
    cx = +chunk['x'];
    cy = +chunk['y'];
    tile = params['tile'];
    tx = +tile['x'];
    ty = +tile['y'];
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      var i, index, tle;
      if (err) {
        return res.send({
          error: err
        });
      }
      if (!chnk) {
        console.log("chunk " + cx + "_" + cy + " not found");
        return res.send({
          error: "chunk " + cx + "_" + cy + " not found."
        });
      }
      index = -1;
      i = 0;
      tle = null;
      while (i >= chnk._tiles.length && index > 0) {
        tle = chnk._tiles[i];
        if (tle.x === tx && tle.y === ty) {
          index = i;
        }
        i++;
      }
      if (index >= 0) {
        chnk._tiles.splice(index, 1);
        chnk.save();
        console.log("tile " + tx + "_" + ty + " DEL in chunk " + cx + "_" + cy);
      } else {
        console.log("tile " + tx + "_" + ty + " in chunk " + cx + "_" + cy + " not found, unable to be removed.");
        return res.send({
          error: "tile " + tx + "_" + ty + " in chunk " + cx + "_" + cy + " not found, unable to be removed"
        });
      }
      return res.send({
        chunk: chnk
      });
    });
  };


  /* GET ACTION */

  TileCtrl.get = function(req, res) {
    var args, cx, cy;
    args = req.params.chunk_x_y.split('_');
    cx = args[0];
    cy = args[1];
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      var tle, tx, ty;
      if (err) {
        return res.send({
          error: err
        });
      }
      if (req.params.tile_x_y) {
        args = req.params.tile_x_y.split('_');
        tx = args[0];
        ty = args[1];
        tle = chnk._tiles.filter(function(tile) {
          return tile.x === tx && tile.y === ty;
        }).pop();
        res.send({
          tiles: tle
        });
      } else {
        res.send({
          tiles: chnk._tiles
        });
      }
    });
  };

  return TileCtrl;

})();

module.exports = TileCtrl;
