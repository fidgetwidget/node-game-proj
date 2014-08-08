var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var tileSchema = new Schema({
  chunk:    ObjectId,
  created:  { type: Date,   default: Date.now },
  updated:  { type: Date,   default: Date.now },
  x:        { type: Number, default: 0 },
  y:        { type: Number, default: 0 },
  base:     { type: Number, default: 0 },
  value:    { type: Number, default: 0 }
});


var elementSchema = new Schema({
  chunk:    ObjectId,
  created:  { type: Date,   default: Date.now },
  updated:  { type: Date,   default: Date.now },
  x:        { type: Number, default: 0 },
  y:        { type: Number, default: 0 },
  value:    { type: Number, default: 0 }
});


var itemSchema = new Schema({
  chunk:    ObjectId,
  created:  { type: Date,   default: Date.now },
  updated:  { type: Date,   default: Date.now },
  x:        { type: Number, default: 0 },
  y:        { type: Number, default: 0 },
  value:    { type: Number, default: 0 },
  count:    { type: Number, default: 0 }
});


var chunkSchema = new Schema({
  created:    { type: Date,   default: Date.now },
  updated:    { type: Date,   default: Date.now },
  x:          { type: Number, default: 0 },
  y:          { type: Number, default: 0 },
  _tiles:     [tileSchema],
  _elements:  [elementSchema],
  _items:     [itemSchema]
});

module.exports = mongoose.model('Chunk', chunkSchema);
