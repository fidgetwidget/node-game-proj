
class @PlayerActions

  player: undefined


  constructor: (@player) ->


  #
  # Player Actions
  #
  till_ground: (x, y, cx, cy) ->
    console.log 'tilled ground'
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'soil'

  water_soil: (x, y, cx, cy) ->
    console.log 'watered soil'
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'wateredSoil'

  clear_ground: (x, y, cx, cy) ->
    Game.setElement_at x, y, cx, cy

  cut_down_bushes: (x, y, cx, cy) ->
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'stump'

  break_rocks: (x, y, cx, cy, tile_type) ->
    Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'stones'
