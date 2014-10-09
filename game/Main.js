var Main;

Main = (function() {
  function Main() {}

  Main.current_connections = 0;

  Main.io = function(server) {
    var io;
    io = require('socket.io')(server);
    return io.on('connection', function(socket) {

      /* CONNECTIONS */
      console.log("new connection.");
      Main.current_connections++;
      console.log("total connections " + Main.current_connections);
      socket.on('disconnect', function() {
        console.log("disconnection.");
        Main.current_connections--;
        return console.log("total connections " + Main.current_connections);
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

  return Main;

})();

module.exports = Main;
