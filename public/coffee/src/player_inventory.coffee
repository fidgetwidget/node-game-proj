
# class @PlayerInventory

#   player:   undefined
#   items:    undefined
  
#   $elms:    undefined
#   $items:   undefined
#   timeouts: undefined


#   constructor: (player) ->
#     @player = player
#     @items = {}
#     @$items = {}
#     @$elms = document.createElement('div')
#     # Game.$inventory.appendChild @$elms
#     @


#   addItem: (type, count) ->
#     if @items[type] is undefined
#       @items[type] = 0
#       # Add the Inventory Icon for the Item
#       @$items[type] = @newItemIconElm(type)
#       @$elms.appendChild @$items[type]
#       # Make the icon fade in
#       setTimeout( =>
#           classie.add @$items[type], 'in'
#         , 200)

#     # Add the Item collected icon
#     @showItemCollectedIcon type, count

#     @items[type] += count
#     count_elm = @$items[type].querySelector('.count')
#     count_elm.innerText = @items[type]

#   showItemCollectedIcon: (type, count) ->
#     @timeouts = {} unless @timeouts
#     $item = @player.$elm.querySelector ".item-icon.#{type}"
#     if $item
#       clearTimeout @timeouts[type]
#       $count = $item.querySelector ".count"
#       count += parseInt $count.innerText
#       $count.innerText = count
#     else
#       $item = Item.itemCollectedElm type, count
#       @player.$elm.appendChild $item

#     @timeouts[type] = setTimeout( =>
#         $item.remove()
#       , 1000)


#   getCount: (type) ->
#     return 0 if @items[type] is undefined
#     return @items[type]


#   newItemIconElm: (type) ->
#     $elm = document.createElement('div')
#     $elm.className = "inventory-item #{type} fade"
#     $icon = document.createElement('span')
#     $icon.className = 'icon'
#     $count = document.createElement('span')
#     $count.className = 'count'

#     $elm.appendChild $icon
#     $elm.appendChild $count
#     return $elm
