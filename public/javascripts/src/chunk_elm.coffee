
class @ChunkElm

  $viewport:  undefined

  $chunk:     undefined
  $tiles:     undefined
  $elements:  undefined
  $items:     undefined

  constructor: ($viewport, cx, cy) ->

    @$viewport = $viewport

    @$chunk = document.createElement('div')
    @$chunk.className = "chunk cx#{cx} cy#{cy}"

    @$tiles = document.createElement('div')
    @$tiles.className = 'tiles'

    @$elements = document.createElement('div')
    @$elements.className = 'elements'

    @$entities = document.createElement('div')
    @$entities.className = 'entities'

    @$chunk.appendChild @$tiles
    @$chunk.appendChild @$elements
    @$chunk.appendChild @$entities

    @$viewport.appendChild @$chunk

    return @

