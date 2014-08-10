
#
# The Game 
#
class @Game

  @NAME:        'game-proj'
  @VERSION:     '0.0.1'
  @_debug:      true

  @entities:    undefined
  @chunks:      undefined
  @$container:  undefined
  @$tiles:      undefined
  @$elements:   undefined
  @$entities:   undefined
  @listeners:   undefined

  @$inventory:  undefined
  @$stats:      undefined
  @$combat:     undefined

  @centerX:     0
  @centerY:     0
  
  @_height:     0
  @_width:      0
  @_gridHeight: 0  # number of tiles height
  @_gridWidth:  0  # number of tiles wide
  

  # Initialize the Game
  @init: () ->
    console.log "Game.init() was called." if Game._debug
      
    Game.entities = []
    Game.$container = document.getElementById 'main'
    Game.$inventory = document.getElementById 'inventory'
    Game.$stats = document.getElementById 'stast'
    Game.$combat = document.getElementById 'combat'

    $wrapper = document.createElement('div')
    $wrapper.className = 'wrapper'

    @$tiles = document.createElement('div')
    @$tiles.className = 'tiles'

    @$elements = document.createElement('div')
    @$elements.className = 'elements'
    
    @$entities = document.createElement('div')
    @$entities.className = 'entities'

    @listeners = {}

    # Optimization, use a document fragment
    _fragment = document.createDocumentFragment()
    _fragment.appendChild @$tiles
    _fragment.appendChild @$elements
    _fragment.appendChild @$entities
    $wrapper.appendChild _fragment

    Game.$container.appendChild $wrapper

    Game._width = Game.$container.offsetWidth
    Game._gridWidth = Game._width / TILE_SIZE
    Game._height = Game.$container.offsetHeight
    Game._gridHeight = Game._height / TILE_SIZE

    @chunks = {}

    console.log "Game.init() complete." if Game._debug
    return Game  


  # Create a random World
  @randomWorld: () ->
    
    @chunks[0] = {}
    chunk = new Chunk(0, 0)
    @chunks[0][0] = chunk

    @setTilesBaseClass chunk
      
    for i in [0...32]
      rx = _.random(0,CHUNK_WIDTH)
      ry = _.random(0,CHUNK_HEIGHT)
      rv = _.random(1,12)
      elm_type = null
      switch rv
        when 0, 1
          elm_type = 4
        when 2, 3, 4
          elm_type = 5
        when 5
          elm_type = 10
        when 6, 7, 8
          elm_type = 7
        when 9
          elm_type = 8
        when 10
          elm_type = 9
        when 11, 12
          elm_type = 6

      unless elm_type is null
        Game.setElement_at(rx, ry, 0, 0, elm_type)

    return this


  # Create Player
  @createPlayer: () ->
    p1 = new PlayerEntity()
    @addEntity p1
    @setCenter p1.x, p1.y


  # Set Center
  @setCenter: (x, y) ->
    classie.remove @$container, "x#{@offsetX}"
    classie.remove @$container, "y#{@offsetY}"
    @centerX = x
    @centerY = y
    if @centerX <= 8
      @offsetX = 0
    else if @centerX > 8 and @centerX < 24
      @offsetX = @centerX - 8
    else
      @offsetX = 16

    if @centerY <= 8
      @offsetY = 0
    else if @centerY > 8 and @centerY < 24
      @offsetY = @centerY - 8
    else
      @offsetY = 16

    classie.add @$container, "x#{@offsetX}"
    classie.add @$container, "y#{@offsetY}"


  @loadChunks: (cx, cy) ->
    cx = cx || 0
    cy = cy || 0
    unless @chunks[cx]
      @chunks[cx] = {}
    
    jqXHR = $.getJSON "/chunk/#{cx}_#{cy}.json"
    jqXHR
      .done (data, status, jqXHR) =>
        if data and data.chunk
          @_loadChunk(cx, cy, Chunk.fromJSON(data.chunk))
        else
          console.log "status: #{status} "
          console.log data

      .fail (jqXHR, status, error) =>
        console.error "#{status}"

  # attempt to save the chunk to the server
  @saveChunk: (cx, cy) ->
    unless @chunks[cx] and @chunks[cx][cy]
      console.warn "no clunk @ #{cx}_#{cy}"
      return  

    jqXHR = $.ajax {
        url: "/chunk"
        method: 'post'
        data: @chunks[cx][cy].toJSON()
      }

    jqXHR
      .done (data, status, jqXHR) =>
        console.log status
      .fail (jqXHR, status, error) =>
        console.error status


  # Unload a chunk
  @_unloadChunk: (cx, cy) ->
    if @chunks[cx]
      if @chunks[cx][cy]

        @_removeAllTiles(cx, cy)
        @_removeAllElements(cx, cy)

      @chunks[cx][cy] = null

  @_removeAllTiles: (cx, cy) ->
    $tiles = @$tiles.querySelectorAll ".tile.cx#{cx}.cy#{cy}"
    if $tiles
      for $tile in $tiles
        $tile.parentNode.removeChild $tile

  @_removeAllElements: (cx, cy) ->
    $elms = @$elements.querySelectorAll ".elm.cx#{cx}.cy#{cy}"
    if $elms
      for $elm in $elms
        $elm.parentNode.removeChild $elm

  # Load a Chunk
  @_loadChunk: (cx, cy, chunk=null) ->
    @chunks[cx] = {} unless @chunks[cx]
    if chunk
      @chunks[cx][cy] = chunk
      @setTilesBaseClass chunk
    else
      @chunks[cx][cy] = undefined


  @setTilesBaseClass: (chunk) ->
    for typ in TILE_TYPES
        classie.remove @$tiles, typ
      classie.add @$tiles, TILE_TYPES[chunk.base]

  # Insert an entity to the game
  @addEntity: (entity) ->
    type = entity.type
    unless @entities[type]
      @entities[type] = {}  
    return null if @entities[type][entity.name]

    @entities[type][entity.name] = entity
    # add the entity to the game container
    @$entities.appendChild entity.$elm
    return entity


  # Get the entity of a given type and name
  @getEntity: (type, name) ->
    return null unless @entities[type]
    return @entities[type][name]


  # Remoge an Entity
  @removeEntity: (entitiy) ->
    type = entitiy.type
    return false unless @entities[type]
    return false unless @entities[type][entitiy.name]

    delete @entities[type][entitiy.name]
    entitiy.$elm.parentNode.removeChild(entitiy.$elm) if entitiy.$elm.parentNode
    return true


  #
  # Items
  #
  # TODO: allow for multiple items in a tile
  
  # Add an Item @ world location
  @addItem: (type, x, y, cx, cy, count=1) ->
    item = new Item(type, x, y, count)
    @addEntity(item)
    @chunks[cx][cy].setItem(x, y, item)


  # Add an Item @ grid location
  @addItem_at: (xi, yi, cx, cy, item) ->
    _item = new Item(item.type, xi, yi, item.count)
    @addEntity(_item)
    @chunks[cx][cy].setItem(xi, yi, _item)


  # Get an Item
  @getItem: (x, y, cx, cy) ->
    return @chunks[cx][cy].getItem(x, y)


  # Remove an Item
  @removeItem: (x, y, cx, cy) ->
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
    xi = Math.floor(x / TILE_SIZE)
    yi = Math.floor(y / TILE_SIZE)
    cx = Math.floor(x / (CHUNK_WIDTH*TILE_SIZE))
    cy = Math.floor(y / (CHUNK_HEIGHT*TILE_SIZE))
    return @setElement_at xi, yi, cx, cy, element


  @getElement_at: (xi, yi, cx, cy) ->
    return null if @chunks.length < cx or @chunks[cx]?.length < cy
    return @chunks[cx][cy].getElement(xi, yi)


  @setElement_at: (xi, yi, cx, cy, element) ->
    return null if @chunks.length < cx or @chunks[cx]?.length < cy
    $element = @getElementElm xi, yi, cx, cy
    if !(element is undefined)
      if $element
        # CHANGE TILE AT
        @removeListener $element
        @changeElementElm($element, xi, yi, cx, cy, element)
      else
        # INSERT TILE AT
        $element = @addElementElm(xi, yi, cx, cy, element)

      # Init on non remove
      @initElement($element, xi, yi, cx, cy, element)

    else
      #REMOVE TILE AT
      if $element
        @removeListener $element
        $element.remove()
          
    return @chunks[cx][cy].setElement(xi, yi, element)


  # add the tile elm to the dom
  @addElementElm: (xi, yi, cx, cy, element) ->
    $element = @makeElement(cx, cy, xi, yi, ELM_TYPES[element])
    @$elements.appendChild $element
    return $element

  # alter the tile elm to match the new value
  @changeElementElm: ($element, xi, yi, cx, cy, element) ->
    was = @chunks[cx][cy].getElement(xi, yi)
    console.log "changed element at x:#{xi} y:#{yi} from: #{ELM_TYPES[was]}  to: #{ELM_TYPES[element]}"
    for type in ELM_TYPES
        classie.remove $element, type
      classie.add $element, "#{ELM_TYPES[element]}"
    return $element


  @getElementElm: (xi, yi, cx, cy) ->
    return @$elements.querySelector ".elm.x#{xi}.y#{yi}.cx#{cx}.cy#{cy}"


  @makeElement: (cx, cy, xi, yi, element_type) ->
    r = _.random(0,3)
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
    xi = Math.floor(x / TILE_SIZE)
    yi = Math.floor(y / TILE_SIZE)
    cx = Math.floor(x / (CHUNK_WIDTH*TILE_SIZE))
    cy = Math.floor(y / (CHUNK_HEIGHT*TILE_SIZE))
    return @setTile_at xi, yi, cx, cy, value


  # get the tile from the given coords
  @getTile_at: (xi, yi, cx, cy) ->
    return null if @chunks.length < cx or @chunks[cx]?.length < cy
    return @chunks[cx][cy].getTile(xi, yi)


  # set the value of a tile at the given coords
  @setTile_at: (xi, yi, cx, cy, value) ->
    return null if @chunks.length < cx or @chunks[cx]?.length < cy
    $tile = @getTileElm xi, yi, cx, cy
    if !(value is undefined)
      if $tile
        # CHANGE TILE AT
        @removeListener $tile
        @changeTileElm($tile, xi, yi, cx, cy, value)
      else
        # INSERT TILE AT
        $tile = @addTileElm(xi, yi, cx, cy, value)

      # Init on non remove
      @initTile($tile, xi, yi, cx, cy, value)

    else
      #REMOVE TILE AT
      if $tile
        @removeListener $tile
        $tile.remove()
          
    return @chunks[cx][cy].setTile(xi, yi, value)


  @getChunkType: (cx, cy) ->
    return -1 if @chunks.length < cx or @chunks[cx]?.length < cy
    return @chunks[cx][cy].base



  # add the tile elm to the dom
  @addTileElm: (xi, yi, cx, cy, value) ->
    $tile = @makeTile(cx, cy, xi, yi, TILE_TYPES[value])
    @$tiles.appendChild $tile
    return $tile

  # alter the tile elm to match the new value
  @changeTileElm: ($tile, xi, yi, cx, cy, value) ->
    console.log "changed tile at x:#{xi} y:#{yi}"
    for type in TILE_TYPES
        classie.remove $tile, type
      classie.add $tile, "#{TILE_TYPES[value]}"
    return $tile


  @getTileElm: (xi, yi, cx, cy) ->
    return @$tiles.querySelector ".tile.x#{xi}.y#{yi}.cx#{cx}.cy#{cy}"


  @makeTile: (cx, cy, xi, yi, tile_type) ->
    r = _.random(0,3)
    $tile = document.createElement('div')
    $tile.className = "tile #{tile_type} x#{xi} y#{yi} cx#{cx} cy#{cy} r#{r}"
    return $tile

  # do any work regarding a tile being added/changed
  @initTile: ($tile, xi, yi, cx, cy, value) ->
    switch TILE_TYPES[value]
      when 'soil'
        @addListener 'soil', $tile, xi, yi, cx, cy
    
      when 'wateredSoil'
        @addListener 'wateredSoil', $tile, xi, yi, cx, cy
    return @



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


