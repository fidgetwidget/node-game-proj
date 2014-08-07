var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var chunkSchema = new Schema({

  created:  { type: Date,   default: Date.now },
  updated:  { type: Date,   default: Date.now },
  x:        { type: Number, default: 0 },
  y:        { type: Number, default: 0 },
  tiles:    [ Schema.Types.Mixed ],
  elements: [ Schema.Types.Mixed ],
  items:    [ Schema.Types.Mixed ]

});

module.exports = mongoose.model('Chunk', chunkSchema);
