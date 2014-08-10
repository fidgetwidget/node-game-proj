#
# The Player Entity
#
class @PlayerEntity extends Entity

  # Class Variables
  @count: 0

  # Instance Variables
  inventory:  undefined
  tool:       undefined # equiped tool
  #
  # Player Constructor
  #
  ###
  @param [name] the name of the player
  ###
  constructor: (name, x, y) ->
    @name = name || "player#{PlayerEntity.count}"
    PlayerEntity.count++

    x = x || Game._gridWidth/2
    y = y || Game._gridHeight/2
    super( "Player", @name, x, y )
    @cx = 0
    @cy = 0

    @tool = NONE
    @facing = DOWN
    @inventory = new PlayerInventory(this)
    @actions.player = this
    
    @setPosition()
    @bindEvents()
    @


  # attach events the player should be listenting to
  bindEvents: () ->
    document.addEventListener 'keyup', (e) =>
      if e.which in DIRECTIONS
        e.preventDefault()
        e.stopPropagation()
        if e.shiftKey
          @face e.which
        else
          @move e.which
      else if e.which is SPACE_BAR
        @do @getXFacing(), @getYFacing()
      else 
        console.log e.which
    
  face: (dir) ->
    # TODO: do this better...
    dir = LEFT  if dir is A
    dir = UP    if dir is W
    dir = RIGHT if dir is D
    dir = DOWN  if dir is S
    # only change it when it changes
    unless @facing is dir
      @facing = dir
    @

  getXFacing: () ->
    if @facing is LEFT
      return @x-1
    else if @facing is RIGHT
      return @x+1
    else 
      return @x

  getYFacing: () ->
    if @facing is UP
      return @y-1
    else if @facing is DOWN
      return @y+1
    else 
      return @y

  # move the player in a given direction
  move: (dir) ->
    switch dir
      when LEFT, A
        @face LEFT
        if @check @x-1, @y
          @x--
      when UP, W
        @face UP
        if @check @x, @y-1
          @y--
      when RIGHT, D
        @face RIGHT
        if @check @x+1, @y
          @x++
      when DOWN, S
        @face DOWN
        if @check @x, @y+1
          @y++
    
    @collectItems @x, @y
    Game.setCenter @x, @y
    @setPosition()
    @

  do: (x, y) ->
    # test for edges of screen (TEMP: this will be how to move from chunk to chunk later...)
    return false if x < 0 or y < 0 or x >= CHUNK_WIDTH or y >= CHUNK_HEIGHT

    # get the tile at the desired location
    e = Game.getElement_at(x, y, @cx, @cy)
    if e != undefined and e != null
      @actOnElement(e, x, y)
      
    else
      t = Game.getTile_at(x, y, @cx, @cy)
      # act on the tile even if the there isn't one (act on the chunk default_tile)
      @actOnTile(t, x, y)

  check: (x, y) ->
    return false if x < 0 or y < 0 or x >= CHUNK_WIDTH or y >= CHUNK_HEIGHT

    e = Game.getElement_at(x, y, @cx, @cy)

    if e != undefined and e != null
      return !COLLIDER[e]

    else 
      t = Game.getTile_at(x, y, @cx, @cy)
      return true if t is null or t is undefined
      return !COLLIDER_TILES[t]


  collectItems: (x, y) ->
    item = Game.getItem(x, y, @cx, @cy)
    if item != undefined and item != null
      @inventory.addItem(item.type, item.count)
      Game.removeItem(x, y, @cx, @cy)


  actOnElement: (elm_type, x, y) ->

    return if elm_type is undefined

    switch ELM_TYPES[elm_type]
      when 'soil'
        @actions.water_soil(x, y, @cx, @cy)
      when 'wateredSoil'
        # TODO: based on selected tool/item
        false
      when 'weed'
        @actions.cut_weed(x, y, @cx, @cy)
      when 'stump'
        @actions.dig_up_stump(x, y, @cx, @cy)
      when 'bush'
        @actions.chop_down_bush(x, y, @cx, @cy)
      when 'branch'
        @actions.collect_branch(x, y, @cx, @cy)
      when 'rock'
        @actions.smash_rock(x, y, @cx, @cy)
      when 'ore'
        @actions.smash_ore(x, y, @cx, @cy)
      # when 'stones'
      # when 'fence'

      else 

      


  actOnTile: (tile_type, x, y) ->
    # depending on the type of tile, do something
    # and update the state of the tile in the game.

    if tile_type is undefined
      tile_type = Game.getChunkType(@cx, @cy)

    switch TILE_TYPES[tile_type]
      when "dirt"
        @actions.till_ground(x, y, @cx, @cy)

        

  #
  # Player Actions
  #
  PlayerEntity::actions = {}
  PlayerEntity::actions.till_ground = (x, y, cx, cy) ->
    console.log 'tilled ground'
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'soil'

  PlayerEntity::actions.water_soil = (x, y, cx, cy) ->
    console.log 'watered soil'
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'wateredSoil'

  PlayerEntity::actions.cut_weed = (x, y, cx, cy) ->
    Game.setElement_at x, y, cx, cy

  PlayerEntity::actions.dig_up_stump = (x, y, cx, cy) ->
    Game.setElement_at x, y, cx, cy

  PlayerEntity::actions.chop_down_bush = (x, y, cx, cy) ->
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'stump'

  PlayerEntity::actions.collect_branch = (x, y, cx, cy) ->
    Game.setElement_at x, y, cx, cy

  PlayerEntity::actions.smash_rock = (x, y, cx, cy, tile_type) ->
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'stones'

  PlayerEntity::actions.smash_ore = (x, y, cx, cy, tile_type) ->
    Game.setElement_at x, y, cx, cy    

       