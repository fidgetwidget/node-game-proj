
class @PlayerActions

  player: undefined


  constructor: (@player) ->


  changeTool: (key) ->
    switch key
      when NUM_1
        @player.tool = TOOL.DIRT
      when NUM_2
        @player.tool = TOOL.GRASS
      when NUM_3
        @player.tool = TOOL.SAND
      when NUM_4
        @player.tool = TOOL.ROCK
      when NUM_5
        @player.tool = TOOL.WATER
      when NUM_6
        false
      when NUM_7
        false
      when NUM_8
        false
      when NUM_9
        false
      when NUM_0
        @player.tool = TOOL.NONE

  actOnElement: (elm_type, x, y, cx, cy) ->

    return if elm_type is undefined

    # TODO: make some of this require/change based on tool

    switch ELM_TYPES[elm_type]
      when 'soil'
        @water_soil(x, y, cx, cy)
      when 'wateredSoil'
        false

      when 'weed'
        @clear_ground(x, y, cx, cy)
      when 'stump'
        @clear_ground(x, y, cx, cy)
      when 'bush'
        @cut_down_bushes(x, y, cx, cy)
      when 'branch'
        @clear_ground(x, y, cx, cy)
      when 'rock'
        @clear_ground(x, y, cx, cy)
      when 'ore'
        @break_rocks(x, y, cx, cy)
      when 'stones'
        @clear_ground(x, y, cx, cy)
      when 'fence'
        @clear_ground(x, y, cx, cy)

      else 
        false


  actOnTile: (tile_type, x, y, cx, cy) ->
    # depending on the type of tile, do something
    # and update the state of the tile in the game.

    if tile_type is undefined
      tile_type = Game.getChunkType(cx, cy)


    switch @player.tool
      # DIRT
      when TOOL.DIRT
        if TILE_TYPES[tile_type] is 'grass' or TILE_TYPES[tile_type] is 'sand' or TILE_TYPES[tile_type] is 'mud'
          @set_tile(x, y, cx, cy, 'dirt')

        else if TILE_TYPES[tile_type] is 'water'
          @set_tile(x, y, cx, cy, 'mud')

        else if TILE_TYPES[tile_type] is 'dirt' or TILE_TYPES[tile_type] is 'dirt_cliff'
          @set_tile(x, y, cx, cy, 'dirt_cliff')

      # GRASS
      when TOOL.GRASS
        if TILE_TYPES[tile_type] is 'dirt' or TILE_TYPES[tile_type] is 'mud'
          @set_tile(x, y, cx, cy, 'grass')

      # SAND
      when TOOL.SAND
        if TILE_TYPES[tile_type] is 'dirt' or TILE_TYPES[tile_type] is 'grass'
          @set_tile(x, y, cx, cy, 'sand')

        else if TILE_TYPES[tile_type] is 'mud'
          @set_tile(x, y, cx, cy, 'dirt')

        else if TILE_TYPES[tile_type] is 'water'
          @set_tile(x, y, cx, cy, 'mud')

      # ROCK
      when TOOL.ROCK
        if TILE_TYPES[tile_type] is 'grass' or TILE_TYPES[tile_type] is 'sand' or TILE_TYPES[tile_type] is 'mud'
          @set_tile(x, y, cx, cy, 'rock_cliff')

      # WATER
      when TOOL.WATER
        if TILE_TYPES[tile_type] is 'mud' or TILE_TYPES[tile_type] is 'water'
          @set_tile(x, y, cx, cy, 'water')

        else if TILE_TYPES[tile_type] is 'dirt' or TILE_TYPES[tile_type] is 'grass' or TILE_TYPES[tile_type] is 'sand'
          @set_tile(x, y, cx, cy, 'mud')

      # NONE
      when TOOL.NONE
        if TILE_TYPES[tile_type] is 'dirt'
          @till_ground(x, y, cx, cy)
        else if TILE_TYPES[tile_type] is 'dirt_cliff'
          @set_tile(x, y, cx, cy, 'dirt')
        else if TILE_TYPES[tile_type] is 'rock_cliff'
          @set_tile(x, y, cx, cy, 'dirt')


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

  plant_grass: (x, y, cx, cy) ->
    Game.setTile_at x, y, cx, cy, _.indexOf TILE_TYPES, 'grass'

  remove_grass: (x, y, cx, cy) ->
    Game.setTile_at x, y, cx, cy, _.indexOf TILE_TYPES, 'dirt'

  dig_water_hole: (x, y, cx, cy) ->
    Game.setTile_at x, y, cx, cy, _.indexOf TILE_TYPES, 'water'

  fill_water_hole: (x, y, cx, cy) ->
    Game.setTile_at x, y, cx, cy, _.indexOf TILE_TYPES, 'dirt'


  set_tile: (x, y, cx, cy, tile_type) ->
    Game.setTile_at x, y, cx, cy, _.indexOf TILE_TYPES, tile_type    