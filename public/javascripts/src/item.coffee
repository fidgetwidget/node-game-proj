#
# The Item Entity
#
class @Item extends Entity

  # Class Variables
  @itemCollectedElms: {}
  @initialized:       false

  # Instance Variables
  cx:     0
  cy:     0
  type:   undefined
  count:  0
  

  #
  # Item Constructor
  #
  ###
  @param [type] the type of item
  ###
  constructor: (type, x, y, count=1) ->
    @name = "#{type}_x#{x}_y#{y}"
    @type = type
    @count = count
    
    super( "#{type}", @name )
    @facing = DOWN
    @x = x
    @y = y
    @cx = 0
    @cy = 0
    @setPosition()
    @

  # 
  # Class Methods
  # 

  # Initialize the Class Values
  @init: () =>
    @initialized = true;
    @itemCollectedElms = {}
    for type in Object.keys ITEM_TYPES
      @itemCollectedElms[type] = @newItemIconElm(type)


  # Get the element for a given type of item collection
  # set the count value
  @itemCollectedElm: (type, count) =>
    @init() unless @initialized
    $elm = @itemCollectedElms[type].cloneNode true
    count_elm = $elm.querySelector '.count'
    count_elm.innerText = count
    console.log 'item collected icon made'
    return $elm


  #
  # Dom Element Creation Helper
  #
  @newItemIconElm: (type) =>
    $elm = document.createElement('div')
    $elm.className = "item-icon #{type}"
    $icon = document.createElement('span')
    $icon.className = 'icon'
    $count = document.createElement('span')
    $count.className = 'count'

    $elm.appendChild $icon
    $elm.appendChild $count
    return $elm

