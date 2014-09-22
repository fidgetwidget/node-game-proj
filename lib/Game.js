var Game = {}

Game.io = (function(server) {
 
  var io = require('socket.io')(server)

  io.on('connection', function (socket) {

    // 
    // SUBSCRIPTION EVENTS
    // 

    // Listen to (and send) Messages for a given chunk
    socket.on('subscribe', function (data) { 
      console.log(data);
      socket.join(data.room); 
    });

    // Stop listenting on a chunk
    socket.on('unsubscribe', function (data) { 
      console.log(data);
      socket.leave(data.room); 
    });

    // 
    // ACTIONS PERFORMED
    // 

    // Tiles
    socket.on('tiles', function (data) {
      console.log(data);
      io.sockets.in(data.room).emit('tiles', data);
    });

    // Elements
    socket.on('elements', function(data) {
      console.log(data);
      io.sockets.in(data.room).emit('elements', data);
    });
    
  });

});

Game.sim = (function() {

  


});

module.exports = Game;