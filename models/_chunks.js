var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Tile = require('./_tiles.js');
var Element = require('./_elements.js');
var Item = require('./_items.js');

var chunkSchema = new Schema({
  created:    { type: Date,   default: Date.now },
  updated:    { type: Date,   default: Date.now },
  x:          { type: Number, default: 0 },
  y:          { type: Number, default: 0 },
  base:       { type: Number, default: 0 },
  _tiles:     [Tile.Schema],
  _elements:  [Element.Schema],
  _items:     [Item.Schema]
});

module.exports = {
  Model: mongoose.model('Chunk', chunkSchema),
  Schema: chunkSchema
};
