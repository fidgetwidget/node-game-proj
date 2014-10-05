var Str = require('string');

var model_names = [
  'chunk', 
  'element',
  'item',
  'tile',
  'container',
  'player'
  ];

var l = model_names.length;
var models = {};

for (var i = 0; i < l; i++) {
  var model = './_' + model_names[i] + 's.js';
  var key = Str(model_names[i]).capitalize().s
  models[key] = require(model);
}

module.exports = models
