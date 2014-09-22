
class @Tree extends Entity

  treeType:   'small'
  _$elm:  undefined

  constructor: ( treeType, x, y, cx, cy ) ->
    @name = "tree_#{x}_#{y}"
    @treeType = treeType || 'small'
    @type = 'tree ' + @treeType
    super( @type, @name, x, y )
    @cx = cx || 0
    @cy = cy || 0

    @facing = SOUTH
    @setPosition()
    @


  addSelf: (game, cx, cy) =>
    super(game, cx, cy)
    game.setElement_at(@x, @y, @cx, @cy, _.indexOf(ELM_TYPES, 'tree'))
    @_$elm = game.getElementElm @x, @y, @cx, @cy
    

  removeSelf: (game) =>
    super(game)
    @_$elm.parentNode.removeChild(@$_elm) if @_$elm.parentNode

