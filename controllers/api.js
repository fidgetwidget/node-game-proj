/// RESTful API for getting the chunks

var Chunk = require('../models/chunks.js');

exports.post = function(req, res) {
  var chunk_x, chunk_y;
  chunk_x = req.body.x;
  chunk_y = req.body.y;
  
  var chunk = new Chunk(
    { x: chunk_x, y: chunk_y }
  );

  chunk.save();

}

// get the chunk by the x_y 
exports.show = (function(req, res) {
  // turn the params into useable x, y coords
  var x, y, args;
  args = req.params.x_y.split('_');
  x = args[0];
  y = args[1];
  // get and return the chunk
  Chunk.findOne({ x: x, y: y })
    .populate('_tiles')
    .populate('_elements')
    .populate('_items')
    .exec(function (err, chnk) {
      if (err) return handleError(err);
      res.send([
        { chunk: chnk }
        ])
      // prints "The creator is Aaron"
    });
});
