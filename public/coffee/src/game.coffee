
#
# The Game 
#
class @Game

  @NAME:        'game-proj'
  @VERSION:     '0.0.1'
  @_debug:      true

  @entities:    undefined
  @players:     undefined
  @chunks:      undefined
  @chunksElm:   undefined

  @$viewport:  undefined
  
  @$entities:   undefined
  @$players:    undefined

  @listeners:   undefined

  @centerX:      0
  @centerY:      0
  @centerChunkX: 0
  @centerChunkY: 0
  
  @_height:     0
  @_width:      0
  @_gridHeight: 0  # number of tiles height
  @_gridWidth:  0  # number of tiles wide

  @socket:      undefined
  

  # Initialize the Game
  @init: () ->
    console.log "Game.init() was called." if Game._debug
      
    Game.entities = []
    Game.players = []

    @listeners = {}
    @chunksElm = {}

    # setup the layers
    Game.$viewport = document.getElementById 'main'
    # adding a layer to position everything correctly in the scene
    Game.$background = enchant.Group()
    enchantGame.rootScene.addChild(Game.$background)
    Game.$background.x = enchantGame.width/2
    Game.$background.y = enchantGame.height/2

    # adding a layer to position all objects (except player) for apparent movement
    Game.$backgroundObjects = enchant.Group()
    Game.$background.addChild(Game.$backgroundObjects)

    # Layers for to handle chunk pre-loading/display
    Game.$groupRight1 = enchant.Group()
    Game.$groupRight2 = enchant.Group()
    Game.$groupLeft1 = enchant.Group()
    Game.$groupLeft2 = enchant.Group()
    Game.$groupSE = Game.$groupRight1
    Game.$groupNE = Game.$groupRight2
    Game.$groupSW = Game.$groupLeft1
    Game.$groupNW = Game.$groupLeft2
    Game.$backgroundObjects.addChild(Game.$groupRight1)
    Game.$backgroundObjects.addChild(Game.$groupRight2)
    Game.$backgroundObjects.addChild(Game.$groupLeft1)
    Game.$backgroundObjects.addChild(Game.$groupLeft2)
    Game.$groupLeft2.x = - enchantGame.width
    Game.$groupLeft2.y = - enchantGame.height
    Game.$groupLeft1.x = - enchantGame.width
    Game.$groupLeft1.y = 0
    Game.$groupRight1.x = 0 
    Game.$groupRight1.y = 0 
    Game.$groupRight2.x = 0
    Game.$groupRight2.y = - enchantGame.height

    @$players = document.createElement('div')
    @$players.className = 'players'
    @$entities = document.createElement('div')
    @$entities.className = 'entities'    

    Game.$viewport.appendChild @$players
    Game.$viewport.appendChild @$entities

    # TODO: create the chunkElms

    @centerChunkX = 0
    @centerChunkY = 0
    Game._width = Game.$viewport.offsetWidth
    Game._gridWidth = Game._width / TILE_SIZE
    Game._height = Game.$viewport.offsetHeight
    Game._gridHeight = Game._height / TILE_SIZE

    # array for chunks
    @chunks = {}

    # connect to the server
    @connect()

    console.log "Game.init() complete." if Game._debug
    return Game  

  # Initialize socket communications
  #
  @connect: () ->
    @socket = io.connect('/')

    @socket.on('tiles', (data) ->
        if data.tile?
          tle = data.tile
          Game.setTile_at tle.x, tle.y, 0, 0, tle.value, true
          console.log data
        else
          console.error 'tiles changed error'
      )
    @socket.on('elements', (data) ->
        if data.element?
          elm = data.element
          Game.setElement_at elm.x, elm.y, 0, 0, elm.value, true
          console.log data
        else
          console.error 'elements changed error'
      )

  #
  #
  @findLayerFromChunkCoordinate: (cx, cy) ->
    console.log("looking for layer for chunk ",cx,cy,"center chunk is ",@centerChunkX,@centerChunkY)
    $layer = undefined
    if (cx == @centerChunkX && cy == @centerChunkY)
      $layer = Game.$groupSE # SE
    else if (cx < @centerChunkX && cy == @centerChunkY)
      $layer = Game.$groupSW #initial SW
    else if (cx == @centerChunkX && cy < @centerChunkY)
      $layer = Game.$groupNE # NE
    else if (cx < @centerChunkX && cy < @centerChunkY)
      $layer = Game.$groupNW #initialy NW
    return $layer
  
  @updateChunks: () ->
    console.log("chunk changed")
    return

  #
  #
  @addChunkElm: (cx, cy) ->
    #console.log("addChunkElm")
    $chnkElm = new ChunkElm(@$viewport, cx, cy)
    @chunksElm[cx] = {} unless @chunksElm[cx]
    @chunksElm[cx][cy] = $chnkElm
    return $chnkElm;
  #
  #
  @hasChunk: (cx, cy) ->
    return @chunks[cx] isnt undefined and @chunks[cx][cy] isnt undefined

  # Create Player
  #
  @createPlayer: () ->
    x = 0 #|| Game._gridWidth/2
    y = 0 #|| Game._gridHeight/2
    p1 = new PlayerEntity(null, x, y)
    @addPlayer p1
    @setCenter p1.x, p1.y, p1.cx, p1.cy

    enchantGame.rootScene.on "touchstart", (evt) ->
      console.log("touched start")
      return

    enchantGame.rootScene.on "touchend", (evt) ->
      console.log("touched background end ",evt.x,evt.y)
      #console.log("touched relative position ",evt.x - Game.$background.x,evt.y - Game.$background.y)
      #console.log("player relative position ",Game.$backgroundObjects.x,Game.$backgroundObjects.y)
      # check where the click was made relatively to player (backGroundObjects)
      # adding the tile size as a dampner
      if evt.x - Game.$background.x + TILE_SIZE < 0
        console.log("touched on player left")
        Game.players[0].move DIR_LEFT
      else if evt.x - Game.$background.x - TILE_SIZE > 0
        console.log("touched on player right")
        Game.players[0].move DIR_RIGHT
      
      if evt.y - Game.$background.y + TILE_SIZE < 0
        console.log("touched on player top")
        Game.players[0].move DIR_UP
      else if evt.y - Game.$background.y - TILE_SIZE > 0
        console.log("touched on player 0 bottom")
        Game.players[0].move DIR_DOWN
      return

  # Move the scene to the center (apparent player movement)
  #
  @setCenter: (x, y, cx, cy) ->
    console.log("set center ",x,y)
    @$viewport.classList.remove("x#{@centerX}")
    @$viewport.classList.remove("y#{@centerY}")
    @centerX = x - HALF_WIDTH
    @centerY = y - HALF_HEIGHT
    @$viewport.classList.add("x#{@centerX}")
    @$viewport.classList.add("y#{@centerY}")

    $(@$viewport).find('.chunk').css({
      marginTop:  "#{GRID_HEIGHT*-cy}px"
      marginLeft: "#{GRID_HEIGHT*-cx}px"
      })
    # switching layer for chunk when chunk not visible anymore (vertical)
    if ((cy < @centerChunkY && y < CHUNK_HEIGHT/2) || (cy == @centerChunkY && y > CHUNK_HEIGHT/2)) #player in top half of the N layer or bottom of S
      console.log("switching chunk vertically")
      # switching layers NE -> SE NW -> SW

      if (@findLayerFromChunkCoordinate(@centerChunkX,@centerChunkY) == Game.$groupRight1)
        Game.$groupRight2.y = 0
        Game.$groupLeft2.y = 0
        Game.$groupRight1.y = - enchantGame.height
        Game.$groupLeft1.y = - enchantGame.height
        while Game.$groupRight1.firstChild
          Game.$groupRight1.removeChild Game.$groupRight1.firstChild
        while Game.$groupLeft1.firstChild
          Game.$groupLeft1.removeChild Game.$groupLeft1.firstChild
        Game.$groupSE = Game.$groupRight2
        Game.$groupNE = Game.$groupRight1
        Game.$groupSW = Game.$groupLeft2
        Game.$groupNW = Game.$groupLeft1
      else
        Game.$groupRight2.y = - enchantGame.height
        Game.$groupLeft2.y = - enchantGame.height
        Game.$groupRight1.y = 0
        Game.$groupLeft1.y = 0
        while Game.$groupRight2.firstChild
          Game.$groupRight2.removeChild Game.$groupRight2.firstChild
        while Game.$groupLeft2.firstChild
          Game.$groupLeft2.removeChild Game.$groupLeft2.firstChild
        Game.$groupSE = Game.$groupRight1
        Game.$groupNE = Game.$groupRight2
        Game.$groupSW = Game.$groupLeft1
        Game.$groupNW = Game.$groupLeft2

      # reset centerChunkY
      @centerChunkY = cy
      @loadChunks(cx, cy+(@centerChunkY+cy)) #-1
      @loadChunks(cx-1, cy+(@centerChunkY+cy))

    # move the layer offsetting with chunck position  
    if (cx == @centerChunkX) 
      Game.$backgroundObjects.x = - x * TILE_SIZE
    else if (cx < @centerChunkX )
      Game.$backgroundObjects.x = - (x - (@centerChunkX - cx) * CHUNK_WIDTH) * TILE_SIZE
    if (cy == @centerChunkY)
      Game.$backgroundObjects.y = - y * TILE_SIZE
    else if (cy < @centerChunkY)
      Game.$backgroundObjects.y = - (y - (@centerChunkY - cy) * CHUNK_HEIGHT) * TILE_SIZE


  # Unload a chunk
  #
  @_unloadChunk: (cx, cy, unsub=true) ->

    @socket.emit('unsubscribe', { room: 'c_'+cx+'_'+cy }) if unsub

    if @chunks[cx]
      if @chunks[cx][cy]

        @_removeAllTiles(cx, cy)
        @_removeAllElements(cx, cy)

      @chunks[cx][cy] = null

  # Clear all tiles of a chunk
  @_removeAllTiles: (cx, cy) ->
    $tiles = @chunksElm[cx][cy].$tiles.querySelectorAll ".tile.cx#{cx}.cy#{cy}"
    if $tiles
      for $tile in $tiles
        $tile.parentNode.removeChild $tile

  # Clean all element of a chunk
  #
  @_removeAllElements: (cx, cy) ->
    $elms = @chunksElm[cx][cy].$elements.querySelectorAll ".elm.cx#{cx}.cy#{cy}"
    if $elms
      for $elm in $elms
        $elm.parentNode.removeChild $elm

  # Load a Chunk
  #
  @_loadChunk: (cx, cy, chunk=null) ->
    @chunks[cx] = {} unless @chunks[cx]
    if chunk
      @chunks[cx][cy] = chunk
      @setTilesBaseClass chunk
    else
      @chunks[cx][cy] = undefined

  #
  #
  @setTilesBaseClass: (chunk) ->
    #console.log("setTilesBaseClass")
    $tiles = @chunksElm[chunk.x][chunk.y].$tiles
    for typ in TILE_TYPES
        $tiles.classList.remove(typ)
      $tiles.classList.add(TILE_TYPES[chunk.base])

  # Insert an entity to the game
  #
  @addEntity: (entity, cx, cy) ->
    #console.log("addEntity")
    type = entity.type
    unless @entities[type]
      @entities[type] = {}  
    return null if @entities[type][entity.name]

    entity.addSelf this, cx, cy

    return entity

  #
  #
  @addTree: (cx, cy, x, y, treeType) ->
    entity = new Tree(treeType, x, y, cx, cy)
    Game.addEntity(entity, cx, cy)

  #
  #
  @addPlayer: (player) ->
    @players[player.name] = player
    player.addSelf this

    return player

  # Get the entity of a given type and name
  #
  @getEntity: (type, name) ->
    return null unless @entities[type]
    return @entities[type][name]


  # Remove an Entity
  @removeEntity: (entitiy) ->
    type = entitiy.type
    return false unless @entities[type]
    return false unless @entities[type][entitiy.name]

    entity.removeSelf this
    return true


  #
  # Items
  #
  # TODO: allow for multiple items in a tile
  
  # Add an Item @ world location
  @addItem: (type, x, y, cx, cy, count=1) ->
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    item = new Item(type, x, y, count)
    @addEntity(item, cx, cy)
    @chunks[cx][cy].setItem(x, y, item)


  # Add an Item @ grid location
  @addItem_at: (xi, yi, cx, cy, item) ->
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    _item = new Item(item.type, xi, yi, item.count)
    @addEntity(_item, cx, cy)
    @chunks[cx][cy].setItem(xi, yi, _item)


  # Get an Item
  @getItem: (x, y, cx, cy) ->
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    return @chunks[cx][cy].getItem(x, y)


  # Remove an Item
  @removeItem: (x, y, cx, cy) ->
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    item = @chunks[cx][cy].getItem(x, y)
    return false unless item
    @removeEntity item
    @chunks[cx][cy].setItem(x, y, null)
    return true


  #
  # Elements
  #

  @getElement: (x, y) ->
    xi = Math.floor(x / TILE_SIZE)
    yi = Math.floor(y / TILE_SIZE)
    cx = Math.floor(x / (CHUNK_WIDTH*TILE_SIZE))
    cy = Math.floor(y / (CHUNK_HEIGHT*TILE_SIZE))
    return @getElement_at xi, yi, cx, cy

  @setElement: (x, y, element) ->
    console.log("setElement")
    xi = Math.floor(x / TILE_SIZE)
    yi = Math.floor(y / TILE_SIZE)
    cx = Math.floor(x / (CHUNK_WIDTH*TILE_SIZE))
    cy = Math.floor(y / (CHUNK_HEIGHT*TILE_SIZE))
    return @setElement_at xi, yi, cx, cy, element


  @getElement_at: (xi, yi, cx, cy) ->
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    return @chunks[cx][cy].getElement(xi, yi)


  @setElement_at: (xi, yi, cx, cy, element, dontSave=false) ->
    #console.log("setElement_at")
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    $element = @getElementElm xi, yi, cx, cy
    if !(element is undefined or element is null)
      if $element
        return if $element.classList.contains(ELM_TYPES[element])
        # CHANGE TILE AT
        @removeListener $element
        @changeElementElm($element, xi, yi, cx, cy, element)
      else
        # INSERT TILE AT
        $element = @addElementElm(xi, yi, cx, cy, element)

      @saveElement(cx, cy, xi, yi, element) unless dontSave

      # Init on non remove
      @initElement($element, xi, yi, cx, cy, element)

    else
      #REMOVE TILE AT
      if $element
        @removeListener $element
        $element.remove()

        @removeElement(cx, cy, xi, yi)
          
    return @chunks[cx][cy].setElement(xi, yi, element)


  # add the tile elm to the dom
  @addElementElm: (xi, yi, cx, cy, element) ->
    #console.log("addElementElm ",element)
    $element = @makeElement(cx, cy, xi, yi, ELM_TYPES[element])
    @chunksElm[cx][cy].$elements.appendChild $element
    return $element

  # alter the tile elm to match the new value
  @changeElementElm: ($element, xi, yi, cx, cy, element) ->
    was = @chunks[cx][cy].getElement(xi, yi)
    console.log "changed element at x:#{xi} y:#{yi} from: #{ELM_TYPES[was]}  to: #{ELM_TYPES[element]}"
    for type in ELM_TYPES
        $element.classList.remove(type)
      $element.classList.add("#{ELM_TYPES[element]}")
    return $element


  @getElementElm: (xi, yi, cx, cy) ->
    return @chunksElm[cx][cy].$elements.querySelector ".elm.x#{xi}.y#{yi}.cx#{cx}.cy#{cy}"


  @makeElement: (cx, cy, xi, yi, element_type) ->
    #console.log("makeElement ", element_type, "at", xi,yi)
    r = _.random(0,3)
    $spriteEntity = new Sprite(16, 16)
    $spriteEntity.image = enchantGame.assets["images/elements.png"]
    $spriteEntity.frame = ELM_SPRITEINDEX[ELM_TYPES.indexOf(element_type)]
    #console.log("frame ",$spriteEntity.frame)
    $spriteEntity.scale = 2
    # find the layer where to display
    $layer = @findLayerFromChunkCoordinate(cx,cy)
    $layer.addChild($spriteEntity)
    $spriteEntity.x = xi * TILE_SIZE
    $spriteEntity.y = yi * TILE_SIZE 
    $element = document.createElement('div')
    $element.className = "elm #{element_type} x#{xi} y#{yi} cx#{cx} cy#{cy} r#{r}"
    return $element

  # do any work regarding a tile being added/changed
  @initElement: ($element, xi, yi, cx, cy, value) ->
    switch ELM_TYPES[value]
      when 'soil'
        @addListener 'soil', $element, xi, yi, cx, cy
    
      when 'wateredSoil'
        @addListener 'wateredSoil', $element, xi, yi, cx, cy
    return @

  #
  # Tiles
  #

  # get the tile with the given pixel x, y
  @getTile: (x, y) ->
    xi = Math.floor(x / TILE_SIZE)
    yi = Math.floor(y / TILE_SIZE)
    cx = Math.floor(x / (CHUNK_WIDTH*TILE_SIZE))
    cy = Math.floor(y / (CHUNK_HEIGHT*TILE_SIZE))
    return @getTile_at xi, yi, cx, cy


  # set the tile with the given pixel x, y
  @setTile: (x, y, value) ->
    console.log("set tile")
    xi = Math.floor(x / TILE_SIZE)
    yi = Math.floor(y / TILE_SIZE)
    cx = Math.floor(x / (CHUNK_WIDTH*TILE_SIZE))
    cy = Math.floor(y / (CHUNK_HEIGHT*TILE_SIZE))
    return @setTile_at xi, yi, cx, cy, value


  # get the tile from the given coords
  @getTile_at: (xi, yi, cx, cy) ->
    return null if @chunks[cx] is undefined or @chunks[cx][cy] is undefined
    return @chunks[cx][cy].getTile(xi, yi)


  # set the value of a tile at the given coords
  @setTile_at: (xi, yi, cx, cy, value, dontSave=false) ->
    #console.log("setTile_at")
    return null if @chunks.length < cx or @chunks[cx]?.length < cy

    $tile = @getTileElm xi, yi, cx, cy
    if !(value is undefined or value is null)
      if $tile
        return if $tile.classList.contains(TILE_TYPES[value])
        # CHANGE TILE AT
        @removeListener $tile
        @changeTileElm($tile, xi, yi, cx, cy, value)
      else
        # INSERT TILE AT
        $tile = @addTileElm(xi, yi, cx, cy, value)

      @saveTile(cx, cy, xi, yi, value) unless dontSave

    else
      #REMOVE TILE AT
      if $tile
        @removeListener $tile
        $tile.remove()

        @removeTile(cx, cy, xi, yi)

    # Init on non remove
    @initTile($tile, xi, yi, cx, cy, value)
          
    return @chunks[cx][cy].setTile(xi, yi, value)


  @getChunkType: (cx, cy) ->
    return -1 if @chunks.length < cx or @chunks[cx]?.length < cy
    return @chunks[cx][cy].base

  # add the tile elm to the dom
  @addTileElm: (xi, yi, cx, cy, value) ->
    #console.log("addTileElm at ", xi,yim "chunk ",cx,cy)
    $tile = @makeTile(cx, cy, xi, yi, TILE_TYPES[value])
    $layer = @findLayerFromChunkCoordinate(cx,cy)
    $layer.addChild($tile.sprite)
    @chunksElm[cx][cy].$tiles.appendChild $tile
    return $tile

  # alter the tile elm to match the new value
  @changeTileElm: ($tile, xi, yi, cx, cy, value) ->
    #console.log "changed tile at x:#{xi} y:#{yi}"
    for type in TILE_TYPES
        $tile.classList.remove(type)
      $tile.classList.add("#{TILE_TYPES[value]}")
    return $tile


  @getTileElm: (xi, yi, cx, cy) ->
    return null if @chunksElm[cx] is undefined or @chunksElm[cx][cy] is undefined
    return @chunksElm[cx][cy].$tiles.querySelector ".tile.x#{xi}.y#{yi}.cx#{cx}.cy#{cy}"


  @makeTile: (cx, cy, xi, yi, tile_type) ->
    #console.log("makeTile - creating a tile at", xi,yi)
    r = _.random(0,3)
    $tile = document.createElement('div')
    $tile.className = "tile #{tile_type} x#{xi} y#{yi} cx#{cx} cy#{cy} r#{r}"
    # adding the sprite
    $tileSprite = new Sprite(16, 16)
    $tileSprite.image = enchantGame.assets["images/tiles.png"]
    value = _.indexOf(TILE_TYPES, tile_type)
    $tileSprite.frame = TILE_INDEX[value]
    $tileSprite.scale = 2
    console.log("adding tile for chunk",cx,cy,"position ",xi,yi)
    $tileSprite.x = xi * TILE_SIZE;
    $tileSprite.y = yi * TILE_SIZE;
    $tile.sprite = $tileSprite
    return $tile

  # do any work regarding a tile being added/changed
  @initTile: ($tile, xi, yi, cx, cy, value) ->
    
    @setTileKlass($tile, xi, yi, cx, cy, value)

    switch TILE_TYPES[value]
      when 'soil'
        @addListener 'soil', $tile, xi, yi, cx, cy
    
      when 'wateredSoil'
        @addListener 'wateredSoil', $tile, xi, yi, cx, cy
    return @


  @setTileKlass: ($tile, xi, yi, cx, cy, value) ->
    for dir in TILE_DIRECTIONS
      $tile.classList.remove(dir)
    $tile.classList.remove('none')

    klass = @getNeightbors(value, xi, yi, cx, cy)
    $tile.className += klass


  @getNeightbors: (tile_type, xi, yi, cx, cy) ->
    klass = ''
    for dir in TILE_DIRECTIONS
      klass += " #{dir}" if @getNeightbor(tile_type, dir, xi, yi, cx, cy)
    klass = ' none' if klass is ''
    return klass


  @getNeightbor: (tile_type, dir, xi, yi, cx, cy) ->
    switch dir

      when 'nw' 
        if xi is 0 and yi is 0
          tile  = @getTile_at( CHUNK_WIDTH-1, CHUNK_HEIGHT-1, cx-1, cy-1 )
          elm   = @getTileElm( CHUNK_WIDTH-1, CHUNK_HEIGHT-1, cx-1, cy-1 )
        else if xi is 0
          tile  = @getTile_at( CHUNK_WIDTH-1, yi, cx-1, cy )
          elm   = @getTileElm( CHUNK_WIDTH-1, yi, cx-1, cy )
        else if yi is 0
          tile  = @getTile_at( xi, CHUNK_HEIGHT-1, cx, cy-1 )
          elm   = @getTileElm( xi, CHUNK_HEIGHT-1, cx, cy-1 )
        else
          tile  = @getTile_at( xi-1, yi-1, cx, cy)
          elm   = @getTileElm( xi-1, yi-1, cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('se') if elm?
          return true
        else if elm?
          elm.classList.remove('se')
        return false

      when 'n'  
        if yi is 0
          tile  = @getTile_at( xi, CHUNK_HEIGHT-1, cx, cy-1 )
          elm   = @getTileElm( xi, CHUNK_HEIGHT-1, cx, cy-1 )
        else
          tile  = @getTile_at( xi,   yi-1, cx, cy)
          elm   = @getTileElm( xi,   yi-1, cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('s') if elm?
          return true
        else if elm?
          elm.classList.remove('s')
        return false

      when 'ne' 
        if xi is CHUNK_WIDTH and yi is 0
          tile  = @getTile_at( 0, CHUNK_HEIGHT-1, cx+1, cy-1)
          elm   = @getTileElm( 0, CHUNK_HEIGHT-1, cx+1, cy-1)
        else if xi is CHUNK_WIDTH
          tile  = @getTile_at( 0, yi-1, cx+1, cy)
          elm   = @getTileElm( 0, yi-1, cx+1, cy)
        else if yi is 0
          tile  = @getTile_at( xi+1, CHUNK_HEIGHT-1, cx, cy-1)
          elm   = @getTileElm( xi+1, CHUNK_HEIGHT-1, cx, cy-1)
        else
          tile  = @getTile_at( xi+1, yi-1, cx, cy)
          elm   = @getTileElm( xi+1, yi-1, cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('sw') if elm?
          return true
        else if elm?
          elm.classList.remove('sw')
        return false
        
      when 'e'  
        if xi is CHUNK_WIDTH
          tile  = @getTile_at( 0, yi,   cx+1, cy)
          elm   = @getTileElm( 0, yi,   cx+1, cy)
        else
          tile  = @getTile_at( xi+1, yi,   cx, cy)
          elm   = @getTileElm( xi+1, yi,   cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('w') if elm?
          return true
        else if elm?
          elm.classList.remove('w')
        return false
        
      when 'se' 
        if xi is CHUNK_WIDTH and yi is CHUNK_HEIGHT
          tile  = @getTile_at( 0, 0, cx+1, cy+1)
          elm   = @getTileElm( 0, 0, cx+1, cy+1)
        else if xi is CHUNK_WIDTH
          tile  = @getTile_at( 0, yi+1, cx+1, cy)
          elm   = @getTileElm( 0, yi+1, cx+1, cy)
        else if yi is CHUNK_HEIGHT
          tile  = @getTile_at( xi+1, 0, cx, cy+1)
          elm   = @getTileElm( xi+1, 0, cx, cy+1)
        else
          tile  = @getTile_at( xi+1, yi+1, cx, cy)
          elm   = @getTileElm( xi+1, yi+1, cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('nw') if elm?
          return true
        else if elm?
          elm.classList.remove('nw')
        return false

      when 's'
        if yi is CHUNK_HEIGHT
          tile  = @getTile_at( xi,   0, cx, cy+1)
          elm   = @getTileElm( xi,   0, cx, cy+1)
        else
          tile  = @getTile_at( xi,   yi+1, cx, cy)
          elm   = @getTileElm( xi,   yi+1, cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('n') if elm?
          return true
        else if elm?
          elm.classList.remove('n')
        return false

      when 'sw' 
        if xi is 0 and yi is CHUNK_HEIGHT
          tile  = @getTile_at( CHUNK_WIDTH-1, 0, cx-1, cy+1)
          elm   = @getTileElm( CHUNK_WIDTH-1, 0, cx-1, cy+1)
        else if xi is 0
          tile  = @getTile_at( CHUNK_WIDTH-1, yi+1, cx-1, cy)
          elm   = @getTileElm( CHUNK_WIDTH-1, yi+1, cx-1, cy)
        else if yi is CHUNK_WIDTH
          tile  = @getTile_at( xi-1, 0, cx, cy+1)
          elm   = @getTileElm( xi-1, 0, cx, cy+1)
        else
          tile  = @getTile_at( xi-1, yi+1, cx, cy)
          elm   = @getTileElm( xi-1, yi+1, cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('ne') if elm?
          return true
        else if elm?
          elm.classList.remove('ne')
        return false

      when 'w'
        if xi is 0
          tile  = @getTile_at( CHUNK_WIDTH-1, yi,   cx-1, cy)
          elm   = @getTileElm( CHUNK_WIDTH-1, yi,   cx-1, cy)
        else
          tile  = @getTile_at( xi-1, yi,   cx, cy)
          elm   = @getTileElm( xi-1, yi,   cx, cy)

        if @isNeightbor(tile, tile_type)
          elm.classList.add('e') if elm?
          return true
        else if elm?
          elm.classList.remove('e')
        return false

      else 
        return false



  @isNeightbor: (tile, tile_type) ->
    return tile is tile_type

  # TODO: make this cycle more complex (lower chances, shorter times?, chances based on number of times through?)
  @addListener: (type, $elm, xi, yi, cx, cy) ->
    return @ if @listeners[$elm.className]

    switch type
      when 'soil'
        @listeners[$elm.className] = setTimeout( (type, $elm, xi, yi, cx, cy) ->
            r = _.random(1,6)
            Game.removeListener $elm
            # 3 in 6 chance (50%)
            if r < 3
              Game.addListener type, $elm, xi, yi, cx, cy
            else
              Game.setElement_at xi, yi, cx, cy 
          , 3000, type, $elm, xi, yi, cx, cy)

      when 'wateredSoil'
        @listeners[$elm.className] = setTimeout( (type, $elm, xi, yi, cx, cy) ->
            r = _.random(1,6)
            Game.removeListener $elm
            # 1 in 6 chance (~16%)
            if r < 1 
              Game.addListener type, $elm, xi, yi, cx, cy
            else
              Game.setElement_at xi, yi, cx, cy, _.indexOf ELM_TYPES, 'soil'
          , 3000, type, $elm, xi, yi, cx, cy)
    return @

  # remove a listener if one exists for the given element
  @removeListener: ($elm) ->
    if @listeners[$elm.className]
      clearTimeout @listeners[$elm.className]
      delete @listeners[$elm.className]
    return @


  #
  # SAVING AND LOADING
  #

  ## CHUNK

  @loadChunks: (cx, cy) ->
    cx = cx || 0
    cy = cy || 0
    
    @addChunkElm(cx, cy)
    @socket.emit('subscribe', { room: 'c_'+cx+'_'+cy} )

    unless @chunks[cx]
      @chunks[cx] = {}
    
    jqXHR = $.getJSON "/api/#{cx}_#{cy}.json"
    jqXHR
      .done (data, status, jqXHR) =>
        if data and data.chunk
          @_loadChunk(cx, cy, Chunk.fromJSON(data.chunk))
        else
          console.log "status: #{status} "
          console.log data

      .fail (jqXHR, status, error) =>
        console.error "#{status}"
    return @

  # attempt to save the chunk to the server
  @saveChunk: (cx, cy) ->
    unless @chunks[cx] and @chunks[cx][cy]
      console.warn "no chunk @ #{cx}_#{cy}"
      return  

    jqXHR = $.ajax {
        url: "/api"
        method: 'post'
        data: @chunks[cx][cy].toJSON()
      }

    jqXHR
      .done (data, status, jqXHR) =>
        console.log data
        console.log status
      .fail (jqXHR, status, error) =>
        console.error status
    return @
  
  ## TILES
  
  @loadTile: (cx, cy, xi, yi) ->
    jqXHR = $.getJSON "/api/#{cx}_#{cy}/tiles/#{xi}_#{yi}.json"

    jqXHR
      .done (data, status, jqXHR) =>
        if data and data.tiles
          unless data.tiles instanceof Array
            @setTile_at(xi, yi, cx, cy, data.tiles.value, true)
        else
          console.log "status: #{status} "
          console.log data

      .fail (jqXHR, status, error) =>
        console.error "#{status}"
    return @


  @saveTile: (cx, cy, xi, yi, value) ->
    jqXHR = $.ajax {
        url: "/api/#{cx}_#{cy}/tiles.json"
        method: 'post'
        data: 
          chunk:
            x: cx
            y: cy
          tile: 
            x: xi
            y: yi
            value: value
      }

    jqXHR
      .done (data, status, jqXHR) =>
        @sendMessage('tiles', cx, cy, xi, yi, value)
      .fail (jqXHR, status, error) =>
        console.error status
    return @


  @removeTile: (cx, cy, xi, yi) ->
    jqXHR = $.ajax {
        url: "/api/#{cx}_#{cy}/tiles.json"
        method: 'delete'
        data: 
          chunk:
            x: cx
            y: cy
          tile: 
            x: xi
            y: yi
      }

    jqXHR
      .done (data, status, jqXHR) =>
        @sendMessage('tiles', cx, cy, xi, yi, null)
      .fail (jqXHR, status, error) =>
        console.error status
    return @


  ## ELEMENTS
  @loadElement: (cx, cy, xi, yi) ->
    jqXHR = $.getJSON "/api/#{cx}_#{cy}/elements/#{xi}_#{yi}.json"

    jqXHR
      .done (data, status, jqXHR) =>
        if data and data.elements
          unless data.elements instanceof Array
            @setElement_at(xi, yi, cx, cy, data.elements.value, true)
        else
          console.log "status: #{status} "
          console.log data

      .fail (jqXHR, status, error) =>
        console.error "#{status}"
    return @


  @saveElement: (cx, cy, xi, yi, value) ->
    jqXHR = $.ajax {
        url: "/api/#{cx}_#{cy}/elements.json"
        method: 'post'
        data: 
          chunk:
            x: cx
            y: cy
          element: 
            x: xi
            y: yi
            value: value
      }

    jqXHR
      .done (data, status, jqXHR) =>
        @sendMessage('elements', cx, cy, xi, yi, value)

      .fail (jqXHR, status, error) =>
        console.error status
    return @


  @removeElement: (cx, cy, xi, yi) ->
    jqXHR = $.ajax {
        url: "/api/#{cx}_#{cy}/elements.json"
        method: 'delete'
        data: 
          chunk:
            x: cx
            y: cy
          element: 
            x: xi
            y: yi
      }

    jqXHR
      .done (data, status, jqXHR) =>
        @sendMessage('elements', cx, cy, xi, yi, null)
      .fail (jqXHR, status, error) =>
        console.error status
    return @


  @sendMessage: (type, cx, cy, xi, yi, value) ->
    data = {}
    data.room = 'c_'+cx+'_'+cy
    switch type
      when 'elements'
        data.element = {
            x: xi
            y: yi
            value: value
          }
        @socket.emit( 'elements', data )

      when 'tiles'
        data.tile = {
            x: xi
            y: yi
            value: value
          }
        @socket.emit( 'tiles', data )
    return @
