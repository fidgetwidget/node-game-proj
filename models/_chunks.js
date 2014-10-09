var Element, Item, ObjectId, Schema, Tile, chunkSchema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

ObjectId = mongoose.Schema.Types.ObjectId;

Tile = require('./_tiles.js');

Element = require('./_elements.js');

Item = require('./_items.js');

chunkSchema = new Schema({
  created: {
    type: Date,
    "default": Date.now
  },
  updated: {
    type: Date,
    "default": Date.now
  },
  x: {
    type: Number,
    "default": 0
  },
  y: {
    type: Number,
    "default": 0
  },
  base: {
    type: Number,
    "default": 0
  },
  _tiles: [Tile.Schema],
  _elements: [Element.Schema],
  _items: [Item.Schema]
});

module.exports = {
  Model: mongoose.model('Chunk', chunkSchema),
  Schema: chunkSchema
};
