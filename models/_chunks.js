var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var chunkSchema = new Schema({
  created:    { type: Date,   default: Date.now },
  updated:    { type: Date,   default: Date.now },
  x:          { type: Number, default: 0 },
  y:          { type: Number, default: 0 },
  base:       { type: Number, default: 0 },
  _tiles:     [{ type: ObjectId, ref: 'Tile' }],
  _elements:  [{ type: ObjectId, ref: 'Element' }],
  _items:     [{ type: ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Chunk', chunkSchema);
