#
# CONSTANTS
#

this.LEFT_KEY       = 37
this.A_KEY          = 65
this.UP_KEY         = 38
this.W_KEY          = 87
this.RIGHT_KEY      = 39
this.D_KEY          = 68
this.DOWN_KEY       = 40
this.S_KEY          = 83 

this.NUM_0          = 48
this.NUM_1          = 49
this.NUM_2          = 50
this.NUM_3          = 51
this.NUM_4          = 52
this.NUM_5          = 53
this.NUM_6          = 54
this.NUM_7          = 55
this.NUM_8          = 56
this.NUM_9          = 57

this.SPACE_BAR      = 32


this.DIRECTIONS = [
  LEFT_KEY, A_KEY
  UP_KEY, W_KEY
  RIGHT_KEY, D_KEY
  DOWN_KEY, S_KEY
]

this.NORTH  = 'n'
this.EAST   = 'e'
this.SOUTH  = 's'
this.WEST   = 'w'

this.FACING = [
  NORTH
  EAST
  SOUTH
  WEST
]

this.DIR_LEFT   = [ LEFT_KEY, A_KEY ]
this.DIR_UP     = [ UP_KEY, W_KEY ]  
this.DIR_RIGHT  = [ RIGHT_KEY, D_KEY ]
this.DIR_DOWN   = [ DOWN_KEY, S_KEY ]

this.DIR_TO_FACING = {
  DIR_LEFT: WEST
  DIR_UP: NORTH
  DIR_RIGHT: EAST
  DIR_DOWN: SOUTH
}

this.NUMBER_KEYS = [
  NUM_0
  NUM_1
  NUM_2
  NUM_3
  NUM_4
  NUM_5
  NUM_6
  NUM_7
  NUM_8
  NUM_9
]

  
this.CHUNK_WIDTH    = 16
this.CHUNK_HEIGHT   = 16
this.HALF_WIDTH     = CHUNK_WIDTH/2
this.HALF_HEIGHT    = CHUNK_HEIGHT/2
this.TILE_SIZE      = 32
this.GRID_WIDTH     = CHUNK_WIDTH * TILE_SIZE
this.GRID_HEIGHT     = CHUNK_HEIGHT * TILE_SIZE

# Player tools
this.NONE = 'none'
