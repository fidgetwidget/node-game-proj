var messaging = (function(server) {
 
  var io = require('socket.io')(server)

  io.on('connection', function (socket) {

    // Joing/Leave a chunk's notifications
    socket.on('subscribe', function (data) { 
      console.log(data);
      socket.join(data.room); 
    });

    socket.on('unsubscribe', function (data) { 
      console.log(data);
      socket.leave(data.room); 
    });


    socket.on('tiles', function (data) {
      console.log(data);
      io.sockets.in(data.room).emit('tiles', data);
    });

    socket.on('elements', function(data) {
      console.log(data);
      io.sockets.in(data.room).emit('elements', data);
    });
    
  });

});

module.exports = messaging;