var Chunk, ElementCtrl, models, mongoose;

mongoose = require('mongoose');

models = require('../models/models.js');

Chunk = models.Chunk.Model;

ElementCtrl = (function() {
  function ElementCtrl() {}


  /* POST ACTION */

  ElementCtrl.post = function(req, res) {
    var chunk, cx, cy, element, ev, ex, ey, params;
    params = req['body'];
    chunk = params['chunk'];
    cx = +chunk['x'];
    cy = +chunk['y'];
    element = params['element'];
    ex = +element['x'];
    ey = +element['y'];
    ev = +element['value'];
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      var ent, now;
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
      ent = chnk._elements.filter(function(element) {
        if (element.x === ex && element.y === ey) {
          element.value = ev;
          element.updated = now;
          return element;
        }
      }).pop();
      if (!ent) {
        chnk._elements.push({
          x: ex,
          y: ey,
          value: ev,
          updated: now,
          created: now
        });
        console.log("element " + ex + "_" + ey + " in chunk " + cx + "_" + cy + " created.");
      } else {
        console.log("element " + ex + "_" + ey + " in chunk " + cx + "_" + cy + " changed.");
      }
      chnk.save();
      res.send({
        chunk: chnk
      });
    });
  };


  /* DELETE ACTION */

  ElementCtrl.del = function(req, res) {
    var chunk, cx, cy, element, ex, ey, params;
    params = req['body'];
    chunk = params['chunk'];
    cx = +chunk['x'];
    cy = +chunk['y'];
    element = params['element'];
    ex = +element['x'];
    ey = +element['y'];
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      var elm, i, index;
      if (err) {
        return res.send({
          error: err
        });
      }
      if (!chnk) {
        console.log("chunk " + cx + "_" + cy + " not found");
        return res.send({
          error: "chunk " + cx + "_" + cy + " not found"
        });
      }
      index = -1;
      i = 0;
      elm = null;
      while (i < chnk._elements.length && index < 0) {
        elm = chnk._elements[i];
        if (elm.x === ex && elm.y === ey) {
          index = i;
        }
        i++;
      }
      if (index >= 0) {
        chnk._elements.splice(index, 1);
        chnk.save();
        console.log("element " + ex + "_" + ey + " DEL in chunk " + cx + "_" + cy);
      } else {
        console.log("element " + ex + "_" + ey + " in chunk " + cx + "_" + cy + " not found, unable to be removed.");
        return res.send({
          error: "element " + ex + "_" + ey + " in chunk " + cx + "_" + cy + " not found, unable to be removed"
        });
      }
      return res.send({
        chunk: chnk
      });
    });
  };


  /* GET ACTION */

  ElementCtrl.get = function(req, res) {
    var args, cx, cy;
    args = req.params.chunk_x_y.split('_');
    cx = args[0];
    cy = args[1];
    return Chunk.findOne({
      x: cx,
      y: cy
    }).exec(function(err, chnk) {
      var elm, ex, ey;
      if (err) {
        return res.send({
          error: err
        });
      }
      if (req.params.elm_x_y) {
        args = req.params.elm_x_y.split('_');
        ex = args[0];
        ey = args[1];
        elm = chnk._elements.filter(function(element) {
          return element.x === ex && element.y === ey;
        }).pop();
        res.send({
          elements: elm
        });
      } else {
        res.send({
          elements: chnk._elements
        });
      }
    });
  };

  return ElementCtrl;

})();

module.exports = ElementCtrl;
