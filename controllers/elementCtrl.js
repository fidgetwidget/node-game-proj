var mongoose = require('mongoose');
var models = require('../models/models.js');

var Chunk = models.Chunk.Model;

var ElementCtrl = {}

// 
// POST ACTION
// 

ElementCtrl.post = (function(req, res) {

  var params    = req['body'];
  var chunk     = params['chunk'];
  var cx        = chunk['x'];
  var cy        = chunk['y'];
  var element   = params['element'];
  var ex        = element['x'];
  var ey        = element['y'];
  var ev        = element['value'];


  Chunk.findOne({ x:cx, y:cy })
    .exec( function (err, chnk) {
      if (err) return res.send( { error: err } );
      // if there isn't one with those x/y, then make one
      if (!chnk) return res.send( { error: 'chunk x:'+cx+' y:'+cy+' not found'})

      now = Date.now()
      //  search for the element in question
      ent = chnk._elements.filter( function(element) {
          if (element.x == ex && element.y == ey) {
            element.value = ev;
            element.updated = now;
            return element;
          }
        }).pop();

      //  if the element isn't there, then create a new one
      if (!ent) {
        chnk._elements.push({ x: ex, y: ey, value: ev, updated: now, created: now });
      }

      // TODO: do validation to make sure the chunk can be saved
      chnk.save()
      res.send( { chunk: chnk } );
    });
});

// 
// DELETE ACTION
// 

ElementCtrl.del = (function(req, res) {
  var params    = req['body'];
  var chunk     = params['chunk'];
  var cx        = chunk['x'];
  var cy        = chunk['y'];
  var element   = params['element'];
  var ex        = element['x'];
  var ey        = element['y'];

  Chunk.findOne({ x:cx, y:cy })
    .exec( function (err, chnk) {
      if (err) return res.send( { error: err } );
      // if there isn't one with those x/y, then make one
      if (!chnk) return res.send( { error: 'chunk x:'+cx+' y:'+cy+' not found'})
            
      var elm = null;
      var index = -1;
      var i = 0;
      for (i = 0; i < chnk._elements.length && index < 0; i += 1) {
        elm = chnk._elements[i];
        if (elm.x == ex && elm.y == ey) { 
          index = i; 
          break;
        }
      }
      if (index >= 0) {
        chnk._elements.splice(index, 1);  
        chnk.save();
        res.send( { chunk: chnk } );
      } else {
        res.send( { error: 'element '+ex+'_'+ey+' not found, unable to be removed.' } );
      }
      
      res.send( { chunk: chnk } );
    });

});

// 
// GET ACTION
// 

ElementCtrl.get = (function(req, res) {
  var args, cx, cy, tx, ty;

  args  = req.params.chunk_x_y.split('_');
  cx    = args[0];
  cy    = args[1];
  Chunk.findOne({ x: cx, y: cy })
    .exec(function (err, chnk) {
      if (err) return res.send( { error: err } );

      if (req.params.elm_x_y) {
        args  = req.params.elm_x_y.split('_');
        ex    = args[0];
        ey    = args[1];

        elm = chnk._elements.filter( function(element) {
          return element.x == ex && element.y == ey;
        }).pop();
        // show only the tile in question (if there is one)
        res.send({ elements: elm });
      } else {
        // show all of the tiles
        res.send({ elements: chnk._elements });
      }
    });
  
});

module.exports = ElementCtrl
