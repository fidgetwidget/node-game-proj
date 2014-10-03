var mongoose = require('mongoose');
var models = require('../models/models.js');

var Chunk = models.Chunk.Model;
var Tile = models.Tile.Model;
var Element = models.Element.Model;

var ChunkCtrl = {}

// TODO: move game variable in some other common place
var CHUNK_WIDTH = 16
var CHUNK_HEIGHT = 16

//

ChunkCtrl.del = (function(req, res) {
  var args, cx, cy;
  // turn the params into useable x, y coords
  args    = req.params.chunk_x_y.split('_');
  cx      = parseInt(args[0]);
  cy      = parseInt(args[1]);
  Chunk.remove({ x:cx, y:cy })
	.exec( function (err, chnk) {
	  if (!err) console.log("removed chunk "+cx+","+cy);
	});   
    return
});


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
	  console.log("ChunkCtrl.findOne "+x+"/"+y);
      // if there isn't one with those x/y, then make one
      //if (!chnk) chnk = new Chunk({ x:x, y:y })
      if (!chnk) chnk = generateOne({ x:x, y:y })

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
  console.log("ChunkCtrl.get "+cx+"/"+cy);
  Chunk.findOne({ x: cx, y: cy })
    .exec(function (err, chnk) {
      if (!err && !chnk) {
      	console.log("chunck doesn't exists");
      	console.log("generate a new chunk"+cx+"/"+cy);
		var element_type, i, rv, rx, ry, _i;
		chnk = new Chunk({ x:cx, y:cy })
		// elements
		for (i = _i = 0; _i < 32; i = ++_i) {
		  rx = Math.floor((Math.random() * CHUNK_WIDTH));//_.random(0, CHUNK_WIDTH - 1);
		  ry = Math.floor((Math.random() * CHUNK_HEIGHT));//_.random(0, CHUNK_HEIGHT - 1);
		  rv = Math.floor((Math.random() * 12) + 1);//_.random(1, 12);
		  element_type = null;
		  switch (rv) {
			case 0:
			case 1:
			  element_type = 4;
			  break;
			case 2:
			case 3:
			case 4:
			  element_type = 5;
			  break;
			case 5:
			  element_type = 10;
			  break;
			case 6:
			case 7:
			case 8:
			  element_type = 7;
			  break;
			case 9:
			  element_type = 8;
			  break;
			case 10:
			  element_type = 9;
			  break;
			case 11:
			case 12:
			  element_type = 6;
		  }
		  element = new Element({ x:rx, y:ry })
		  if (element_type !== null) {
		    element.value = element_type;
		  } else {
		  	element.value = 0;
		  }
		  element.updated = Date.now();
		  chnk._elements[i] = element;
		}
		// tiles
		for (i = _j = 0; _j < 128; i = ++_j) {
  			rx = Math.floor((Math.random() * CHUNK_WIDTH));
  			ry = Math.floor((Math.random() * CHUNK_HEIGHT));
  			tile = new Tile({ x:rx, y:ry })
  			tile.value = 1;
  			tile.updated = Date.now();
  			chnk._tiles[i] = tile;
		}
		console.log('save chunk x'+cx+' y'+cy);
		chnk.save()
      }
      if (err) {
      	console.log("db error")
      	return res.send( { error: err } );
      }
      res.send( { chunk: chnk } );
    });
});

module.exports = ChunkCtrl
