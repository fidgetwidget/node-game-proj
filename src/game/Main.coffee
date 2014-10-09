class Main

  @current_connections: 0

  @io: (server) ->
    io = require('socket.io')(server)

    io.on 'connection', (socket) ->

      ### CONNECTIONS ###

      # on 'connection' 
      console.log "new connection."
      Main.current_connections++
      console.log "total connections #{Main.current_connections}"


      socket.on 'disconnect', () ->
        console.log "disconnection."
        Main.current_connections--
        console.log "total connections #{Main.current_connections}"



      ### SUBSCRIPTION EVENTS ###

      # Listen to (and send) Messages for a given chunk
      socket.on 'subscribe', (data) ->
        console.log "subscribe to #{data.room}"
        console.log data
        socket.join data.room

      # Stop listenting on a chunk
      socket.on 'unsubscribe', (data) ->
        console.log "ubsubscribe from #{data.room}"
        console.log data
        socket.leave data.room



      ### ACTIONS PERFORMED ###

      # Tiles
      socket.on 'tiles', (data) ->
        console.log data
        io.sockets
          .in data.room
          .emit 'tiles', data

      # Elements
      socket.on 'elements', (data) ->
        console.log data
        io.sockets
          .in data.room
          .emit 'elements', data



module.exports = Main;