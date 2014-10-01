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
    super( "player", @name, x, y )
    @cx = 0
    @cy = 0

    @tool = 'none'
    @facing = SOUTH
    # @inventory = new PlayerInventory(this)
    @actions = new PlayerActions(this)
    
    @bindEvents()
    @


  addSelf: (toGame) =>
    toGame.$players.appendChild @$elm
    Game.$background.addChild(@$spriteEntity)


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
      @$elm.classList.remove(@facing)
      @facing = dir
      @$elm.classList.add(@facing)
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
      if @facing is WEST
        @check @x-1, @y
      else
        @face WEST

    if dir in DIR_UP
      if @facing is NORTH 
        @check @x, @y-1
      else
        @face NORTH

    if dir in DIR_RIGHT
      if @facing is EAST
        @check @x+1, @y
      else
        @face EAST

    if dir in DIR_DOWN
      console.log("down")
      if @facing is SOUTH
        @check @x, @y+1
      else
        @face SOUTH
    
    @collectItems @x, @y
    Game.setCenter @x, @y, @cx, @cy
    @

  do: (x, y, alt=false) ->
    cx = @cx
    cy = @cy
    if x < 0 
      cx -= 1
      x = x + CHUNK_WIDTH
    else if x >= CHUNK_WIDTH
      cx += 1
      x = x - CHUNK_WIDTH

    if y < 0
      cy -= 1
      y = y + CHUNK_HEIGHT
    else if y >= CHUNK_HEIGHT
      cy += 1
      y = y - CHUNK_HEIGHT

    # get the tile at the desired location
    e = Game.getElement_at(x, y, cx, cy)
    if e != undefined and e != null
      @actions.actOnElement(e, x, y, cx, cy, alt)
      
    else
      t = Game.getTile_at(x, y, cx, cy)
      # act on the tile even if the there isn't one (act on the chunk default_tile)
      @actions.actOnTile(t, x, y, cx, cy, alt)

  check: (x, y) ->
    cx = @cx
    cy = @cy
    if x < 0 
      cx -= 1
      x = x + CHUNK_WIDTH
    else if x >= CHUNK_WIDTH
      cx += 1
      x = x - CHUNK_WIDTH

    if y < 0
      cy -= 1
      y = y + CHUNK_HEIGHT
    else if y >= CHUNK_HEIGHT
      cy += 1
      y = y - CHUNK_HEIGHT

    elm = Game.getElement_at(x, y, cx, cy)

    if elm != undefined and elm != null
      if !COLLIDER_ELMS[elm]
        @updatePos(x, y, cx, cy)

    else 
      tle = Game.getTile_at(x, y, cx, cy)
      if tle is null or tle is undefined or !COLLIDER_TILES[tle]
        @updatePos(x, y, cx, cy)  

  updatePos: (x, y, cx, cy) ->
    @x = x
    @y = y
    @cx = cx
    @cy = cy
    unless Game.hasChunk(cx, cy)
      console.log "making new chunk at x: #{cx} y: #{cy}"
      Game.loadChunks(cx, cy)
      # Game.randomWorld(cx, cy)
      # Game.saveChunk(cx, cy)



  collectItems: (x, y) ->
    item = Game.getItem(x, y, @cx, @cy)
    if item != undefined and item != null
      # @inventory.addItem(item.type, item.count)
      Game.removeItem(x, y, @cx, @cy)

       