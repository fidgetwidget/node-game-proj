var Chunk, ChunkCtrl, models, mongoose;

mongoose = require('mongoose');

models = require('../models/models.js');

Chunk = models.Chunk.Model;

ChunkCtrl = (function() {
  function ChunkCtrl() {}


  /* POST ACTIONS */

  ChunkCtrl.post = function(req, res) {
    var base, elements, items, params, tiles, x, y;
    params = req['body'];
    x = params['x'];
    y = params['y'];
    base = params['base'];
    tiles = params['tiles'];
    elements = params['elements'];
    items = params['items'];
    return Chunk.findOne({
      x: x,
      y: y
    }).exec(function(err, chnk) {
      if (err) {
        return res.send({
          error: err
        });
      }
      if (!chnk) {
        chnk = new Chunk({
          x: x,
          y: y
        });
      }
      chnk.base = base;
      chnk._tiles = tiles || void 0;
      chnk._elements = elements || void 0;
      chnk._items = items || void 0;
      console.log("save chunk x" + x + " y" + y);
      chnk.save();
      res.send({
        chunk: chnk
      });
    });
  };


  /* GET ACTIONS */

  ChunkCtrl.get = function(req, res) {
    var args, cx, cy;
    args = req.params.chunk_x_y.split('_');
    cx = parseInt(args[0]);
    cy = parseInt(args[1]);
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      if (err) {
        return res.send({
          error: err
        });
      }
      res.send({
        chunk: chnk
      });
    });
  };

  return ChunkCtrl;

})();

module.exports = ChunkCtrl;
