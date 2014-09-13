// TODO: allow for loading and unloading of chunkcs
// TODO: turn chunk data into more useful data
// TODO: per chunk, store groups of tiles/elements that might trigger changes to the world
// TODO: hook into the messaging to send the changes that are made

var Simulation = function() {};

Simulation.prototype = {
    delay: 0
  , interval: undefined
  , setup: function (delay) {
      this.delay = delay || this.delay || 5000;
    }
  , stop: function () {
      clearInterval( this.interval );
    }
  , start: function () {
      this.interval = setInterval( this.step, this.delay );
    }
};

Simulation.prototype.step = function () {
  
}

module.exports = Simulation;