/// RESTful API for getting the chunks

var Chunk = require('../models/chunks.js');

exports.post = function(req, res) {
  
  var params = req['body']
  var x = params['x']
  var y = params['y']
  var tiles = params['tiles']
  var elements = params['elements']
  var items = params['items']
  

  var query = Chunk.findOne({ x:x, y:y })
  query.exec(function (err, chnk) {
    if (err) res.send(false);
    if (!chnk) chnk = new Chunk({ x:x, y:y }).save()
    
    chnk._tiles = tiles ? tiles : void 0;
    chnk._elements = elements ? elements : void 0;
    chnk._items = items ? items : void 0;
    chnk.save()

    res.send(true);
  });
  

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
      res.send(
        { chunk: chnk }
        )
    });
});
