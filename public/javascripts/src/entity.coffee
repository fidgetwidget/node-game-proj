
#
# Abstract Entity
#
class Entity

  name: 'entity_name' # the entities id
  type: 'entity_type' # the entity type name
  elm:  undefined
  $elm: undefined
  facing: DOWN
  
  #
  # Entity Constructor
  #
  constructor: (@type, @name) ->
    @$elm = document.createElement('div')
    @$elm.className = "entity #{@type}"

    ## DEBUG
    console.log "#{@type} #{@name} created." if Game._debug


  setPosition: () ->
    @$elm.style.top = "#{@y*TILE_SIZE}px"
    @$elm.style.left = "#{@x*TILE_SIZE}px"
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
          Game.addEntity this 
          delete Game.entities[@type][_oldName]

     ## DEBUG
     console.log "#{@type} #{_oldName} renamed to #{@name}." if Game._debug
     # end check for change
    @


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
