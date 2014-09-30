
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
        @player.tool = TOOL.PATH
      when NUM_7
        @player.tool = TOOL.TREE
      when NUM_8
        @player.tool = TOOL.PLANT
      when NUM_9
        @player.tool = TOOL.STONE
      when NUM_0
        @player.tool = TOOL.NONE

  actOnElement: (elm_type, x, y, cx, cy, alt=false) ->

    return if elm_type is undefined

    # TODO: make some of this require/change based on tool

    switch ELM_TYPES[elm_type]
      when 'soil'
        @water_soil(x, y, cx, cy)
      when 'wateredSoil'
        false

      when 'weed', 'grass', 'stick'
        @clear_ground(x, y, cx, cy)
      when 'stump', 'tree'
        @clear_ground(x, y, cx, cy)
        @set_tile(x, y, cx, cy, 'hole')
      when 'bush'
        @cut_down_bushes(x, y, cx, cy)
      when 'branch', 'roots', 'ticket'
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


  actOnTile: (tile_type, x, y, cx, cy, alt=false) ->
    # Game.randomWorld(0,0);
    # Game.saveChunk(0,0);

    # depending on the type of tile, do something
    # and update the state of the tile in the game.

    if tile_type is undefined
      tile_type = Game.getChunkType(cx, cy)


    switch @player.tool
      # DIRT
      when TOOL.DIRT
        if alt 
          switch TILE_TYPES[tile_type]
            when 'dirt'
              @set_tile(x, y, cx, cy, 'hole')
            when 'grass', 'sand', 'dirt_cliff'
              @set_tile(x, y, cx, cy, 'dirt')

        else
          switch TILE_TYPES[tile_type]
            when 'water'
              @set_tile(x, y, cx, cy, 'mud')
            when 'dirt'
              @set_tile(x, y, cx, cy, 'dirt_cliff')
            when 'mud', 'hole'
              @set_tile(x, y, cx, cy, 'dirt')

      # GRASS
      when TOOL.GRASS
        if alt and TILE_TYPES[tile_type] is 'grass'
          @set_tile(x, y, cx, cy, 'dirt')

        if !alt and (TILE_TYPES[tile_type] is 'dirt' or TILE_TYPES[tile_type] is 'mud')
          @set_tile(x, y, cx, cy, 'grass')

      # SAND
      when TOOL.SAND
        if alt and TILE_TYPES[tile_type] is 'sand'
          @set_tile(x, y, cx, cy, 'dirt')

        if !alt
          switch TILE_TYPES[tile_type]
            when 'mud'
              @set_tile(x, y, cx, cy, 'sand')
            when 'water'
              @set_tile(x, y, cx, cy, 'mud')
            when 'dirt', 'grass'
              @set_tile(x, y, cx, cy, 'sand')

      # ROCK
      when TOOL.ROCK
        if alt and TILE_TYPES[tile_type] is 'rock_cliff'
          @set_tile(x, y, cx, cy, 'dirt')
        if !alt and (TILE_TYPES[tile_type] is 'grass' or TILE_TYPES[tile_type] is 'sand' or TILE_TYPES[tile_type] is 'mud')
          @set_tile(x, y, cx, cy, 'rock_cliff')

      # WATER
      when TOOL.WATER
        if alt
          switch TILE_TYPES[tile_type]
            when 'water'
              @set_tile(x, y, cx, cy, 'hole')
            when 'mud'
              @set_tile(x, y, cx, cy, 'dirt')
        else
          switch TILE_TYPES[tile_type]
            when 'hole'
              @set_tile(x, y, cx, cy, 'water')
            when 'sand'
              @set_tile(x, y, cx, cy, 'dirt')
            when 'grass'
              @set_tile(x, y, cx, cy, 'mud')
            when 'dirt'
              @set_tile(x, y, cx, cy, 'mud')

      when TOOL.PATH
        if alt
          @set_tile(x, y, cx, cy, 'dirt')
        else
          @set_tile(x, y, cx, cy, 'worn_path')


      when TOOL.TREE
        switch TILE_TYPES[tile_type]
          when 'grass', 'dirt'
            @add_tree(x, y, cx, cy)

      when TOOL.PLANT
        switch TILE_TYPES[tile_type]
          when 'grass', 'dirt', 'mud'
            @add_plant(x, y, cx, cy)

      when TOOL.STONE
        switch TILE_TYPES[tile_type]
          when 'grass', 'dirt', 'sand', 'mud'
            @add_stone(x, y, cx, cy)

      # NONE
      when TOOL.NONE
        if alt
          switch TILE_TYPES[tile_type]
            when 'dirt'
              @set_tile(x, y, cx, cy, 'hole')
            when 'grass', 'sand', 'mud'
              @set_tile(x, y, cx, cy, 'dirt')
            when 'water'
              @set_tile(x, y, cx, cy, 'mud')
            when 'dirt_cliff', 'rock_cliff'
              @set_tile(x, y, cx, cy, 'dirt')
        else
          switch TILE_TYPES[tile_type]
            when 'dirt'
              @till_ground(x, y, cx, cy)    
            when 'mud'
              @set_tile(x, y, cx, cy, 'water')
            when 'grass'
              false #TODO: make this grow a grass elm on the grass...
          
        


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

  add_tree: (x, y, cx, cy) ->
    r = Math.random()
    if r >= 0 and r < 0.4
      Game.addTree cx, cy, x, y, 'large'
    else if r >= 0.4 and r < 0.9
      Game.addTree cx, cy, x, y, 'small'
    else if r >= 0.9 and r <= 1
      Game.addTree cx, cy, x, y, 'bare'

  add_plant: (x, y, cx, cy) ->
    r = Math.random()
    if r >= 0 and r < 0.3
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'grass'
    else if r >= 0.3 and r < 0.6
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'roots'
    else if r >= 0.6 and r < 0.9
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'branch'
    else if r >= 0.9 and r <= 1
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'bush'

  add_stone: (x, y, cx, cy) ->
    r = Math.random()
    if r >= 0 and r < 0.4
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'stones'
    else if r >= 0.4 and r < 0.9
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'rock'
    else if r >= 0.9 and r <= 1
      Game.setElement_at x, y, cx, cy, _.indexOf ELM_TYPES, 'ore'


  set_tile: (x, y, cx, cy, tile_type) ->
    Game.setTile_at x, y, cx, cy, _.indexOf TILE_TYPES, tile_type    