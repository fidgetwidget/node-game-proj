var random = {};

random.between = function(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = random;
