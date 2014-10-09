var Container, Schema, mongoose, playerSchema;

mongoose = require('mongoose');

Schema = mongoose.Schema;

Container = require('./_containers.js');

playerSchema = new Schema({
  name: {
    type: String,
    "default": ''
  },
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
  cx: {
    type: Number,
    "default": 0
  },
  cy: {
    type: Number,
    "default": 0
  },
  _containers: [Container.Schema]
});

module.exports = {
  Model: mongoose.model('Player', playerSchema),
  Schema: playerSchema
};
