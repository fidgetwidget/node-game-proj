var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var chunkSchema = new Schema({
  created:    { type: Date,   default: Date.now },
  updated:    { type: Date,   default: Date.now },
  x:          { type: Number, default: 0 },
  y:          { type: Number, default: 0 },
  _tiles:     [{ type: Schema.Types.ObjectId, ref: 'Tile' }],
  _elements:  [{ type: Schema.Types.ObjectId, ref: 'Element' }],
  _items:     [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Chunk', chunkSchema);
