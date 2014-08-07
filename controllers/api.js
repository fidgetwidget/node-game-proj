/// RESTful API for getting the chunks

var Chunk = require('../models/chunks.js');

exports.post = function(req, res) {

  new Chunk(
    {
      x:        req.body.x, 
      y:        req.body.y,
      tiles:    [{}],
      elements: [{}],
      items:    [{}]
    }
  ).save();

}

// get the chunk by the x_y 
exports.show = (function(req, res) {
  // turn the params into useable x, y coords
  var x, y, args;
  args = req.params.x_y.split('_');
  x = args[0];
  y = args[1];
  // get and return the chunk
  Chunk.findOne(
    { x: x, y: y },
    function(err, chnk) {
      res.send([{chunk: chnk}]);
    })
});
