var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var itemSchema = new Schema({
  chunk:    ObjectId,
  created:  { type: Date,   default: Date.now },
  updated:  { type: Date,   default: Date.now },
  x:        { type: Number, default: 0 },
  y:        { type: Number, default: 0 },
  value:    { type: Number, default: 0 },
  count:    { type: Number, default: 0 }
});

module.exports = {
  Model: mongoose.model('Item', itemSchema),
  Schema: itemSchema
};
