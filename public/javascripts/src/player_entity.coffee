#
# The Player Entity
#
class @PlayerEntity extends Entity

  # Class Variables
  @count: 0

  # Instance Variables
  inventory:  undefined
  actions:    undefined

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
    super( "player", @name, x, y )
    @cx = 0
    @cy = 0

    @tool = 'none'
    @facing = SOUTH
    @inventory = new PlayerInventory(this)
    @actions = new PlayerActions(this)
    
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
        @do @getXFacing(), @getYFacing(), e.shiftKey
      else
        if e.which in  NUMBER_KEYS
          @actions.changeTool(e.which)

        console.log e.which
    
  face: (dir) ->
    # only change it when it changes
    unless @facing is dir
      classie.removeClass @$elm, @facing
      @facing = dir
      classie.addClass @$elm, @facing
    @

  getXFacing: () ->
    if @facing is WEST
      return @x-1
    else if @facing is EAST
      return @x+1
    else 
      return @x

  getYFacing: () ->
    if @facing is NORTH
      return @y-1
    else if @facing is SOUTH
      return @y+1
    else 
      return @y

  # move the player in a given direction
  move: (dir) ->
    if dir in DIR_LEFT
      @face WEST
      if @check @x-1, @y
        @x--
    if dir in DIR_UP
      @face NORTH
      if @check @x, @y-1
        @y--
    if dir in DIR_RIGHT
      @face EAST
      if @check @x+1, @y
        @x++
    if dir in DIR_DOWN
      @face SOUTH
      if @check @x, @y+1
        @y++
    
    @collectItems @x, @y
    Game.setCenter @x, @y
    @setPosition()
    @

  do: (x, y, alt=false) ->
    # test for edges of screen (TEMP: this will be how to move from chunk to chunk later...)
    return false if x < 0 or y < 0 or x >= CHUNK_WIDTH or y >= CHUNK_HEIGHT

    # get the tile at the desired location
    e = Game.getElement_at(x, y, @cx, @cy)
    if e != undefined and e != null
      @actions.actOnElement(e, x, y, @cx, @cy, alt)
      
    else
      t = Game.getTile_at(x, y, @cx, @cy)
      # act on the tile even if the there isn't one (act on the chunk default_tile)
      @actions.actOnTile(t, x, y, @cx, @cy, alt)

  check: (x, y) ->
    return false if x < 0 or y < 0 or x >= CHUNK_WIDTH or y >= CHUNK_HEIGHT

    e = Game.getElement_at(x, y, @cx, @cy)

    if e != undefined and e != null
      return !COLLIDER_ELMS[e]

    else 
      t = Game.getTile_at(x, y, @cx, @cy)
      return true if t is null or t is undefined
      return !COLLIDER_TILES[t]


  collectItems: (x, y) ->
    item = Game.getItem(x, y, @cx, @cy)
    if item != undefined and item != null
      @inventory.addItem(item.type, item.count)
      Game.removeItem(x, y, @cx, @cy)

       