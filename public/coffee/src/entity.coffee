
#
# Abstract Entity
#
class @Entity

  name:     'entity_name' # the entities id
  type:     'entity_type' # the entity type name

  cx:       0
  cy:       0
  x:        0
  y:        0

  elm:      undefined
  $elm:     undefined

  sprite:      undefined
  $sprite:     undefined

  width:    32
  height:   32
  offsetX:  0
  offsetY:  0

  facing:   SOUTH
  
  #
  # Entity Constructor
  #
  constructor: (@type, @name, @x=0, @y=0) ->
    console.log("constructor entity type", @type)
    @$spriteEntity = new Sprite(32, 32)
    @$spriteEntity.image = game.assets["images/entities.png"]
    @$spriteEntity.frame = ELM_SPRITEINDEX[ELM_TYPES.indexOf(@type)]
    @$spriteEntity.scale = 2
    #Game.$background.addChild(@$spriteEntity)
    @$elm = document.createElement('div')
    @$elm.className = "entity #{@type} "

    ## DEBUG
    console.log "#{@type} #{@name} created." if Game._debug


  setPosition: () ->
    @$spriteEntity.x = @y*TILE_SIZE - @offsetY
    @$spriteEntity.y = @y*TILE_SIZE - @offsetY
    console.log("position ",@$spriteEntity.x,@$spriteEntity.y)
    @$elm.className   = "entity #{@type} cx#{@cx} cy#{@cy}"
    @$elm.style.top   = "#{(@y*TILE_SIZE) - @offsetY}px"
    @$elm.style.left  = "#{(@y*TILE_SIZE) - @offsetY}px"
    @


  # Rename the entity, and move it in storage if needed
  rename: (name) =>
    # first check for change
    unless @name is name
      _oldName = @name
      @name = name
      if Game.entities[@type]
        # do we have to move the entity?
        if Game.entities[@type][_oldName]
          Game.addEntity this, @cx, @cy
          delete Game.entities[@type][_oldName]

     ## DEBUG
     console.log "#{@type} #{_oldName} renamed to #{@name}." if Game._debug
     # end check for change
    @


  # Allows entities to add themselves to the game
  # this way complex entities can add tiles and elements to the game
  # along with themselves
  # DEFAULT behaviour:
  # - add self to the games entities
  # - and selfs element to the entities container
  addSelf: (game, cx, cy) =>
    game.entities[@type][@name] = this
    game.$entities.appendChild @$elm
    

  removeSelf: (game) =>
    delete game.entities[@type][@name]
    @$elm.parentNode.removeChild(@$elm) if @$elm.parentNode
    

  #
  # Simple Event Dispatcher
  #
  callbacks: {}

  # bind a callback to an event
  bind: (event_name, callback) ->
    @callbacks[event_name] or= []
    @callbacks[event_name].push callback
    @

  # trigger an event
  trigger: (event_name, data) ->
    @_dispatch event_name, data
    @

  # internal event dispatch
  _dispatch: (event_name, data) ->
    chain = @callbacks[event_name]
    callback data for callback in chain if chain?
