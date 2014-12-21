
enchant()

$loading = $('#loading')
$content = $('#content')
$content.hide()

$(window).load ->

  this.enchantGame = new Core(512, 512)
  enchantGame.rootScene.backgroundColor = '#AE9363'
  enchantGame.preload("images/entities.png")
  enchantGame.preload("images/tiles.png")
  enchantGame.preload("images/elements.png")

  enchantGame.onload = () ->

    Game.init(enchant, enchantGame)
      .loadChunks(-1,-1)
      .loadChunks(0,-1)
      .loadChunks(-1,0)
      .loadChunks(0,0)
    Game.createPlayer()

    $content.show()
    $loading.find('.text').hide()
    $loading.fadeOut(1400)

  enchantGame.start()
  console.log("game started")
