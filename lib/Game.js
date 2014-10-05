var Game;

Game = (function() {
  function Game() {}

  Game.current_connections = 0;

  Game.io = function(server) {
    var io;
    io = require('socket.io')(server);
    return io.on('connection', function(socket) {

      /* CONNECTIONS */
      console.log("new connection.");
      Game.current_connections++;
      console.log("total connections " + Game.current_connections);
      socket.on('disconnect', function() {
        console.log("disconnection.");
        Game.current_connections--;
        return console.log("total connections " + Game.current_connections);
      });

      /* SUBSCRIPTION EVENTS */
      socket.on('subscribe', function(data) {
        console.log("subscribe to " + data.room);
        console.log(data);
        return socket.join(data.room);
      });
      socket.on('unsubscribe', function(data) {
        console.log("ubsubscribe from " + data.room);
        console.log(data);
        return socket.leave(data.room);
      });

      /* ACTIONS PERFORMED */
      socket.on('tiles', function(data) {
        console.log(data);
        return io.sockets["in"](data.room).emit('tiles', data);
      });
      return socket.on('elements', function(data) {
        console.log(data);
        return io.sockets["in"](data.room).emit('elements', data);
      });
    });
  };

  return Game;

})();

module.exports = Game;
