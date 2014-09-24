
#
# World Chunk
#
class @Chunk

  tiles:      undefined
  elements:   undefined
  items:      undefined
  
  types:      undefined
  keepEmpty:  false

  width:      CHUNK_WIDTH * TILE_SIZE
  height:     CHUNK_HEIGHT * TILE_SIZE
  cols:       CHUNK_WIDTH
  rows:       CHUNK_HEIGHT
  x:          0
  y:          0
  base:       0

  #
  # Constructor
  #
  constructor: (x, y, base) ->
    x = x || 0
    y = y || 0
    base = base || _.indexOf TILE_TYPES, 'dirt'
    @x = x
    @y = y
    @base = base
    # Initialize the Tile Arrays
    @tiles = {}
    @elements = {}
    @items = {}
    @types = {}
    @keepEmpty = false
    

  load: (json) =>
    if json
      Game._unloadChunk @x, @y, false
      @x = json.x
      @y = json.y
      @base = json.base
      Game._loadChunk @x, @y, this
      if json._tiles?
        for tile in json._tiles 
          Game.setTile_at tile.x, tile.y, @x, @y, tile.value, true
      if json._elements?
        for elm in json._elements
          Game.setElement_at elm.x, elm.y, @x, @y, elm.value, true
      if json._items?
        for item in json._items
          true # TODO: add saving/loading of items too?


  # 
  # Getter
  # 
  getTile: (x, y) ->
    return undefined unless @tiles[x]
    return @tiles[x][y]

  getElement: (x, y) ->
    return undefined unless @elements[x]
    return @elements[x][y]

  getItem: (x, y) ->
    return undefined unless @items[x]
    return @items[x][y]

  #
  # Setter
  #
  setTile: (x, y, value) ->
    @tiles[x] = {} unless @tiles[x]
    if value is null or value is undefined
      
      if @tiles[x][y]?
        @types["#{TILE_TYPES[@tiles[x][y]]}"]--

        if !@keepEmpty
          @tiles[x][y] = null
        else
          delete @tiles[x][y] 
          delete @tiles[x] if Object.keys(@tiles[x]).length is 0
            
    else
      if @tiles[x][y]?
        @types[TILE_TYPES[@tiles[x][y]]]--
      unless @tiles[x][y] is value
        @types[TILE_TYPES[value]] = 0 unless @types[TILE_TYPES[value]]
        @types[TILE_TYPES[value]]++
        @tiles[x][y] = value
    return @

  setElement: (x, y, value) ->
    @elements[x] = {} unless @elements[x]
    if value is null or value is undefined
      if !@keepEmpty
        @elements[x][y] = null
      else
        delete @elements[x][y] 
        if Object.keys(@elements[x]).length is 0
          delete @elements[x]
    else
      @elements[x][y] = value
    return @

  setItem: (x, y, item) ->
    @items[x] = {} unless @items[x]
    if item is null or item is undefined
      if !@keepEmpty
        @items[x][y] = null
      else
        delete @items[x][y] 
        if Object.keys(@items[x]).length is 0
          delete @items[x]
    else
      @items[x][y] = item
    return @

  #
  # 'Empty' the array of values
  #  - set the values to null... 
  #
  empty: (_delete) ->
    _delete = _delete || @keepEmpty
    
    for x in @tiles
      for y in @tiles[x]
        @tiles[x][y] = null
        delete @tiles[x][y] if _delete
      delete @tiles[x] if _delete

    for x in @elements
      for y in @elements[x]
        @elements[x][y] = null
        delete @elements[x][y] if _delete
      delete @elements[x] if _delete

    for x in @items
      for y in @items[x]
        @items[x][y] = null
        delete @items[x][y] if _delete
      delete @items[x] if _delete
      
  #
  # Exports as a JSON chunk
  #
  toJSON: () ->
    _tiles = []
    _elements = []
    _items = []
    for y in [0...@rows] by 1
      for x in [0...@cols] by 1
        tile = @getTile(x, y)
        if tile
          _tiles.push { x: x, y: y, value: tile }
        element = @getElement(x, y)
        if element
          _elements.push { x: x, y: y, value: element }
        item = @getItem(x, y)
        if item
          _items.push { x: x, y: y, value: item.type, count: item.count }

    return { x: @x, y: @y, base: @base, tiles: _tiles, elements: _elements, items: _items }


  @fromJSON: (json) ->
    chunk = new Chunk(json.x, json.y)
    chunk.load(json)
    return chunk


  