(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.LEFT_KEY = 37;

  this.A_KEY = 65;

  this.UP_KEY = 38;

  this.W_KEY = 87;

  this.RIGHT_KEY = 39;

  this.D_KEY = 68;

  this.DOWN_KEY = 40;

  this.S_KEY = 83;

  this.NUM_0 = 48;

  this.NUM_1 = 49;

  this.NUM_2 = 50;

  this.NUM_3 = 51;

  this.NUM_4 = 52;

  this.NUM_5 = 53;

  this.NUM_6 = 54;

  this.NUM_7 = 55;

  this.NUM_8 = 56;

  this.NUM_9 = 57;

  this.SPACE_BAR = 32;

  this.DIRECTIONS = [LEFT_KEY, A_KEY, UP_KEY, W_KEY, RIGHT_KEY, D_KEY, DOWN_KEY, S_KEY];

  this.NORTH = 'n';

  this.EAST = 'e';

  this.SOUTH = 's';

  this.WEST = 'w';

  this.FACING = [NORTH, EAST, SOUTH, WEST];

  this.DIR_LEFT = [LEFT_KEY, A_KEY];

  this.DIR_UP = [UP_KEY, W_KEY];

  this.DIR_RIGHT = [RIGHT_KEY, D_KEY];

  this.DIR_DOWN = [DOWN_KEY, S_KEY];

  this.DIR_TO_FACING = {
    DIR_LEFT: WEST,
    DIR_UP: NORTH,
    DIR_RIGHT: EAST,
    DIR_DOWN: SOUTH
  };

  this.NUMBER_KEYS = [NUM_0, NUM_1, NUM_2, NUM_3, NUM_4, NUM_5, NUM_6, NUM_7, NUM_8, NUM_9];

  this.CHUNK_WIDTH = 16;

  this.CHUNK_HEIGHT = 16;

  this.HALF_WIDTH = CHUNK_WIDTH / 2;

  this.HALF_HEIGHT = CHUNK_HEIGHT / 2;

  this.TILE_SIZE = 32;

  this.GRID_WIDTH = CHUNK_WIDTH * TILE_SIZE;

  this.GRID_HEIGHT = CHUNK_HEIGHT * TILE_SIZE;

  this.NONE = 'none';

  this.ELM_SPRITEINDEX = ['soil', 'wateredSoil', 'weed', '_0', 19, 35, 17, 49, 48, 51, 21, '_1', 'stick', 19, 19, 'grass', 'tree', 8];

  this.ELM_TYPES = ['soil', 'wateredSoil', 'weed', '_0', 'stump', 'bush', 'branch', 'stones', 'rock', 'ore', 'fence', '_1', 'stick', 'roots', 'thicket', 'grass', 'tree', 'player'];

  this.COLLIDER_ELMS = [false, false, true, false, true, true, true, false, true, true, true, true, false, true, true, false, true, false];

  this.ITEM_TYPES = ['small_stick', 'sharp_stick', 'small_stone', 'sharp_stone', 'large_stone', 'large_stick', 'wood', 'stone'];

  this.TILE_DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  this.TILE_TYPES = ['dirt', 'grass', 'sand', 'worn_path', 'hole', 'dirt_cliff', 'rock_cliff', 'mud', 'water'];

  this.TILE_INDEX = [0, 1, 4, 7, 33, 36, 39, 65, 68];

  this.COLLIDER_TILES = [false, false, false, false, true, true, true, false, true];

  this.TOOLS = ['none', 'dirt', 'grass', 'sand', 'rock', 'water', 'path', 'tree', 'plant', 'stone'];

  this.TOOL = {};

  this.TOOL.NONE = 'none';

  this.TOOL.DIRT = 'dirt';

  this.TOOL.GRASS = 'grass';

  this.TOOL.SAND = 'sand';

  this.TOOL.ROCK = 'rock';

  this.TOOL.WATER = 'water';

  this.TOOL.PATH = 'path';

  this.TOOL.TREE = 'tree';

  this.TOOL.PLANT = 'plant';

  this.TOOL.STONE = 'stone';

  this.Chunk = (function() {
    Chunk.prototype.tiles = void 0;

    Chunk.prototype.elements = void 0;

    Chunk.prototype.items = void 0;

    Chunk.prototype.types = void 0;

    Chunk.prototype.keepEmpty = false;

    Chunk.prototype.width = CHUNK_WIDTH * TILE_SIZE;

    Chunk.prototype.height = CHUNK_HEIGHT * TILE_SIZE;

    Chunk.prototype.cols = CHUNK_WIDTH;

    Chunk.prototype.rows = CHUNK_HEIGHT;

    Chunk.prototype.x = 0;

    Chunk.prototype.y = 0;

    Chunk.prototype.base = 0;

    function Chunk(x, y, base) {
      this.load = __bind(this.load, this);
      x = x || 0;
      y = y || 0;
      base = base || _.indexOf(TILE_TYPES, 'dirt');
      this.x = x;
      this.y = y;
      this.base = base;
      this.tiles = {};
      this.elements = {};
      this.items = {};
      this.types = {};
      this.keepEmpty = false;
    }

    Chunk.prototype.load = function(json) {
      var elm, item, tile, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      if (json) {
        Game._unloadChunk(this.x, this.y, false);
        this.x = json.x;
        this.y = json.y;
        this.base = json.base;
        Game._loadChunk(this.x, this.y, this);
        if (json._tiles != null) {
          _ref = json._tiles;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            tile = _ref[_i];
            Game.setTile_at(tile.x, tile.y, this.x, this.y, tile.value, true);
          }
        }
        if (json._elements != null) {
          _ref1 = json._elements;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            elm = _ref1[_j];
            Game.setElement_at(elm.x, elm.y, this.x, this.y, elm.value, true);
          }
        }
        if (json._items != null) {
          _ref2 = json._items;
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            item = _ref2[_k];
            _results.push(true);
          }
          return _results;
        }
      }
    };

    Chunk.prototype.getTile = function(x, y) {
      if (!this.tiles[x]) {
        return void 0;
      }
      return this.tiles[x][y];
    };

    Chunk.prototype.getElement = function(x, y) {
      if (!this.elements[x]) {
        return void 0;
      }
      return this.elements[x][y];
    };

    Chunk.prototype.getItem = function(x, y) {
      if (!this.items[x]) {
        return void 0;
      }
      return this.items[x][y];
    };

    Chunk.prototype.setTile = function(x, y, value) {
      if (!this.tiles[x]) {
        this.tiles[x] = {};
      }
      if (value === null || value === void 0) {
        if (this.tiles[x][y] != null) {
          this.types["" + TILE_TYPES[this.tiles[x][y]]]--;
          if (!this.keepEmpty) {
            this.tiles[x][y] = null;
          } else {
            delete this.tiles[x][y];
            if (Object.keys(this.tiles[x]).length === 0) {
              delete this.tiles[x];
            }
          }
        }
      } else {
        if (this.tiles[x][y] != null) {
          this.types[TILE_TYPES[this.tiles[x][y]]]--;
        }
        if (this.tiles[x][y] !== value) {
          if (!this.types[TILE_TYPES[value]]) {
            this.types[TILE_TYPES[value]] = 0;
          }
          this.types[TILE_TYPES[value]]++;
          this.tiles[x][y] = value;
        }
      }
      return this;
    };

    Chunk.prototype.setElement = function(x, y, value) {
      if (!this.elements[x]) {
        this.elements[x] = {};
      }
      if (value === null || value === void 0) {
        if (!this.keepEmpty) {
          this.elements[x][y] = null;
        } else {
          delete this.elements[x][y];
          if (Object.keys(this.elements[x]).length === 0) {
            delete this.elements[x];
          }
        }
      } else {
        this.elements[x][y] = value;
      }
      return this;
    };

    Chunk.prototype.setItem = function(x, y, item) {
      if (!this.items[x]) {
        this.items[x] = {};
      }
      if (item === null || item === void 0) {
        if (!this.keepEmpty) {
          this.items[x][y] = null;
        } else {
          delete this.items[x][y];
          if (Object.keys(this.items[x]).length === 0) {
            delete this.items[x];
          }
        }
      } else {
        this.items[x][y] = item;
      }
      return this;
    };

    Chunk.prototype.empty = function(_delete) {
      var x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
      _delete = _delete || this.keepEmpty;
      _ref = this.tiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        _ref1 = this.tiles[x];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          y = _ref1[_j];
          this.tiles[x][y] = null;
          if (_delete) {
            delete this.tiles[x][y];
          }
        }
        if (_delete) {
          delete this.tiles[x];
        }
      }
      _ref2 = this.elements;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        x = _ref2[_k];
        _ref3 = this.elements[x];
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          y = _ref3[_l];
          this.elements[x][y] = null;
          if (_delete) {
            delete this.elements[x][y];
          }
        }
        if (_delete) {
          delete this.elements[x];
        }
      }
      _ref4 = this.items;
      _results = [];
      for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
        x = _ref4[_m];
        _ref5 = this.items[x];
        for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
          y = _ref5[_n];
          this.items[x][y] = null;
          if (_delete) {
            delete this.items[x][y];
          }
        }
        if (_delete) {
          _results.push(delete this.items[x]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Chunk.prototype.toJSON = function() {
      var element, item, tile, x, y, _elements, _i, _items, _j, _ref, _ref1, _tiles;
      _tiles = [];
      _elements = [];
      _items = [];
      for (y = _i = 0, _ref = this.rows; _i < _ref; y = _i += 1) {
        for (x = _j = 0, _ref1 = this.cols; _j < _ref1; x = _j += 1) {
          tile = this.getTile(x, y);
          if (tile) {
            _tiles.push({
              x: x,
              y: y,
              value: tile
            });
          }
          element = this.getElement(x, y);
          if (element) {
            _elements.push({
              x: x,
              y: y,
              value: element
            });
          }
          item = this.getItem(x, y);
          if (item) {
            _items.push({
              x: x,
              y: y,
              value: item.type,
              count: item.count
            });
          }
        }
      }
      return {
        x: this.x,
        y: this.y,
        base: this.base,
        tiles: _tiles,
        elements: _elements,
        items: _items
      };
    };

    Chunk.fromJSON = function(json) {
      var chunk;
      chunk = new Chunk(json.x, json.y);
      chunk.load(json);
      return chunk;
    };

    return Chunk;

  })();

  this.ChunkElm = (function() {
    ChunkElm.prototype.$viewport = void 0;

    ChunkElm.prototype.$chunk = void 0;

    ChunkElm.prototype.$tiles = void 0;

    ChunkElm.prototype.$elements = void 0;

    ChunkElm.prototype.$items = void 0;

    function ChunkElm($viewport, cx, cy) {
      this.$viewport = $viewport;
      this.$chunk = document.createElement('div');
      this.$chunk.className = "chunk cx" + cx + " cy" + cy;
      this.$tiles = document.createElement('div');
      this.$tiles.className = 'tiles';
      this.$elements = document.createElement('div');
      this.$elements.className = 'elements';
      this.$entities = document.createElement('div');
      this.$entities.className = 'entities';
      this.$chunk.appendChild(this.$tiles);
      this.$chunk.appendChild(this.$elements);
      this.$chunk.appendChild(this.$entities);
      this.$viewport.appendChild(this.$chunk);
      return this;
    }

    return ChunkElm;

  })();

  this.Entity = (function() {
    Entity.prototype.name = 'entity_name';

    Entity.prototype.type = 'entity_type';

    Entity.prototype.cx = 0;

    Entity.prototype.cy = 0;

    Entity.prototype.x = 0;

    Entity.prototype.y = 0;

    Entity.prototype.elm = void 0;

    Entity.prototype.$elm = void 0;

    Entity.prototype.sprite = void 0;

    Entity.prototype.$sprite = void 0;

    Entity.prototype.width = 32;

    Entity.prototype.height = 32;

    Entity.prototype.offsetX = 0;

    Entity.prototype.offsetY = 0;

    Entity.prototype.facing = SOUTH;

    function Entity(type, name, x, y) {
      this.type = type;
      this.name = name;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.removeSelf = __bind(this.removeSelf, this);
      this.addSelf = __bind(this.addSelf, this);
      this.rename = __bind(this.rename, this);
      console.log("constructor entity type", this.type);
      this.$spriteEntity = new Sprite(32, 32);
      this.$spriteEntity.image = game.assets["images/entities.png"];
      this.$spriteEntity.frame = ELM_SPRITEINDEX[ELM_TYPES.indexOf(this.type)];
      this.$spriteEntity.scale = 2;
      this.$elm = document.createElement('div');
      this.$elm.className = "entity " + this.type + " ";
      if (Game._debug) {
        console.log("" + this.type + " " + this.name + " created.");
      }
    }

    Entity.prototype.setPosition = function() {
      this.$spriteEntity.x = this.y * TILE_SIZE - this.offsetY;
      this.$spriteEntity.y = this.y * TILE_SIZE - this.offsetY;
      console.log("position ", this.$spriteEntity.x, this.$spriteEntity.y);
      this.$elm.className = "entity " + this.type + " cx" + this.cx + " cy" + this.cy;
      this.$elm.style.top = "" + ((this.y * TILE_SIZE) - this.offsetY) + "px";
      this.$elm.style.left = "" + ((this.y * TILE_SIZE) - this.offsetY) + "px";
      return this;
    };

    Entity.prototype.rename = function(name) {
      var _oldName;
      if (this.name !== name) {
        _oldName = this.name;
        this.name = name;
        if (Game.entities[this.type]) {
          if (Game.entities[this.type][_oldName]) {
            Game.addEntity(this, this.cx, this.cy);
            delete Game.entities[this.type][_oldName];
          }
        }
      }
      if (Game._debug) {
        return console.log("" + this.type + " " + _oldName + " renamed to " + this.name + ".");
      }
    };

    Entity;

    Entity.prototype.addSelf = function(game, cx, cy) {
      game.entities[this.type][this.name] = this;
      return game.$entities.appendChild(this.$elm);
    };

    Entity.prototype.removeSelf = function(game) {
      delete game.entities[this.type][this.name];
      if (this.$elm.parentNode) {
        return this.$elm.parentNode.removeChild(this.$elm);
      }
    };

    Entity.prototype.callbacks = {};

    Entity.prototype.bind = function(event_name, callback) {
      var _base;
      (_base = this.callbacks)[event_name] || (_base[event_name] = []);
      this.callbacks[event_name].push(callback);
      return this;
    };

    Entity.prototype.trigger = function(event_name, data) {
      this._dispatch(event_name, data);
      return this;
    };

    Entity.prototype._dispatch = function(event_name, data) {
      var callback, chain, _i, _len, _results;
      chain = this.callbacks[event_name];
      if (chain != null) {
        _results = [];
        for (_i = 0, _len = chain.length; _i < _len; _i++) {
          callback = chain[_i];
          _results.push(callback(data));
        }
        return _results;
      }
    };

    return Entity;

  })();

  this.Game = (function() {
    function Game() {}

    Game.NAME = 'game-proj';

    Game.VERSION = '0.0.1';

    Game._debug = true;

    Game.entities = void 0;

    Game.players = void 0;

    Game.chunks = void 0;

    Game.chunksElm = void 0;

    Game.$viewport = void 0;

    Game.$entities = void 0;

    Game.$players = void 0;

    Game.listeners = void 0;

    Game.centerX = 0;

    Game.centerY = 0;

    Game._height = 0;

    Game._width = 0;

    Game._gridHeight = 0;

    Game._gridWidth = 0;

    Game.socket = void 0;

    Game.init = function() {
      if (Game._debug) {
        console.log("Game.init() was called.");
      }
      Game.entities = [];
      Game.players = [];
      this.listeners = {};
      this.chunksElm = {};
      Game.$viewport = document.getElementById('main');
      Game.$background = enchant.Group();
      game.rootScene.addChild(Game.$background);
      Game.$background.x = game.width / 2;
      Game.$background.y = game.height / 2;
      Game.$backgroundObjects = enchant.Group();
      Game.$background.addChild(Game.$backgroundObjects);
      this.$players = document.createElement('div');
      this.$players.className = 'players';
      this.$entities = document.createElement('div');
      this.$entities.className = 'entities';
      Game.$viewport.appendChild(this.$players);
      Game.$viewport.appendChild(this.$entities);
      Game._width = Game.$viewport.offsetWidth;
      Game._gridWidth = Game._width / TILE_SIZE;
      Game._height = Game.$viewport.offsetHeight;
      Game._gridHeight = Game._height / TILE_SIZE;
      this.chunks = {};
      this.connect();
      if (Game._debug) {
        console.log("Game.init() complete.");
      }
      return Game;
    };

    Game.connect = function() {
      this.socket = io.connect('/');
      this.socket.on('tiles', function(data) {
        var tle;
        if (data.tile != null) {
          tle = data.tile;
          Game.setTile_at(tle.x, tle.y, 0, 0, tle.value, true);
          return console.log(data);
        } else {
          return console.error('tiles changed error');
        }
      });
      return this.socket.on('elements', function(data) {
        var elm;
        if (data.element != null) {
          elm = data.element;
          Game.setElement_at(elm.x, elm.y, 0, 0, elm.value, true);
          return console.log(data);
        } else {
          return console.error('elements changed error');
        }
      });
    };

    Game.randomWorld = function(cx, cy) {
      var chunk, elm_type, i, rv, rx, ry, _i, _j;
      if (!this.chunks[cx]) {
        this.chunks[cx] = {};
      }
      chunk = new Chunk(cx, cy);
      this.addChunkElm(cx, cy);
      this.chunks[cx][cy] = chunk;
      this.setTilesBaseClass(chunk);
      for (i = _i = 0; _i < 32; i = ++_i) {
        rx = _.random(0, CHUNK_WIDTH - 1);
        ry = _.random(0, CHUNK_HEIGHT - 1);
        rv = _.random(1, 12);
        elm_type = null;
        switch (rv) {
          case 0:
          case 1:
            elm_type = 4;
            break;
          case 2:
          case 3:
          case 4:
            elm_type = 5;
            break;
          case 5:
            elm_type = 10;
            break;
          case 6:
          case 7:
          case 8:
            elm_type = 7;
            break;
          case 9:
            elm_type = 8;
            break;
          case 10:
            elm_type = 9;
            break;
          case 11:
          case 12:
            elm_type = 6;
        }
        if (elm_type !== null) {
          Game.setElement_at(rx, ry, cx, cy, elm_type);
        }
      }
      for (i = _j = 0; _j < 128; i = ++_j) {
        rx = _.random(0, CHUNK_WIDTH - 1);
        ry = _.random(0, CHUNK_HEIGHT - 1);
        Game.setTile_at(rx, ry, cx, cy, 1, true);
      }
      return this;
    };

    Game.addChunkElm = function(cx, cy) {
      var $chnkElm;
      console.log("addChunkElm");
      $chnkElm = new ChunkElm(this.$viewport, cx, cy);
      if (!this.chunksElm[cx]) {
        this.chunksElm[cx] = {};
      }
      this.chunksElm[cx][cy] = $chnkElm;
      return $chnkElm;
    };

    Game.hasChunk = function(cx, cy) {
      return this.chunks[cx] !== void 0 && this.chunks[cx][cy] !== void 0;
    };

    Game.createPlayer = function() {
      var p1, x, y;
      x = 0;
      y = 0;
      p1 = new PlayerEntity(null, x, y);
      this.addPlayer(p1);
      return this.setCenter(p1.x, p1.y, p1.cx, p1.cy);
    };

    Game.setCenter = function(x, y, cx, cy) {
      console.log("set center ", x, y);
      this.$viewport.classList.remove("x" + this.centerX);
      this.$viewport.classList.remove("y" + this.centerY);
      this.centerX = x - HALF_WIDTH;
      this.centerY = y - HALF_HEIGHT;
      this.$viewport.classList.add("x" + this.centerX);
      this.$viewport.classList.add("y" + this.centerY);
      $(this.$viewport).find('.chunk').css({
        marginTop: "" + (GRID_HEIGHT * -cy) + "px",
        marginLeft: "" + (GRID_HEIGHT * -cx) + "px"
      });
      Game.$backgroundObjects.x = -x * TILE_SIZE;
      return Game.$backgroundObjects.y = -y * TILE_SIZE;
    };

    Game._unloadChunk = function(cx, cy, unsub) {
      if (unsub == null) {
        unsub = true;
      }
      if (unsub) {
        this.socket.emit('unsubscribe', {
          room: 'c_' + cx + '_' + cy
        });
      }
      if (this.chunks[cx]) {
        if (this.chunks[cx][cy]) {
          this._removeAllTiles(cx, cy);
          this._removeAllElements(cx, cy);
        }
        return this.chunks[cx][cy] = null;
      }
    };

    Game._removeAllTiles = function(cx, cy) {
      var $tile, $tiles, _i, _len, _results;
      $tiles = this.chunksElm[cx][cy].$tiles.querySelectorAll(".tile.cx" + cx + ".cy" + cy);
      if ($tiles) {
        _results = [];
        for (_i = 0, _len = $tiles.length; _i < _len; _i++) {
          $tile = $tiles[_i];
          _results.push($tile.parentNode.removeChild($tile));
        }
        return _results;
      }
    };

    Game._removeAllElements = function(cx, cy) {
      var $elm, $elms, _i, _len, _results;
      $elms = this.chunksElm[cx][cy].$elements.querySelectorAll(".elm.cx" + cx + ".cy" + cy);
      if ($elms) {
        _results = [];
        for (_i = 0, _len = $elms.length; _i < _len; _i++) {
          $elm = $elms[_i];
          _results.push($elm.parentNode.removeChild($elm));
        }
        return _results;
      }
    };

    Game._loadChunk = function(cx, cy, chunk) {
      if (chunk == null) {
        chunk = null;
      }
      if (!this.chunks[cx]) {
        this.chunks[cx] = {};
      }
      if (chunk) {
        this.chunks[cx][cy] = chunk;
        return this.setTilesBaseClass(chunk);
      } else {
        return this.chunks[cx][cy] = void 0;
      }
    };

    Game.setTilesBaseClass = function(chunk) {
      var $tiles, typ, _i, _len;
      console.log("setTilesBaseClass");
      $tiles = this.chunksElm[chunk.x][chunk.y].$tiles;
      for (_i = 0, _len = TILE_TYPES.length; _i < _len; _i++) {
        typ = TILE_TYPES[_i];
        $tiles.classList.remove(typ);
      }
      return $tiles.classList.add(TILE_TYPES[chunk.base]);
    };

    Game.addEntity = function(entity, cx, cy) {
      var type;
      console.log("addEntity");
      type = entity.type;
      if (!this.entities[type]) {
        this.entities[type] = {};
      }
      if (this.entities[type][entity.name]) {
        return null;
      }
      entity.addSelf(this, cx, cy);
      return entity;
    };

    Game.addTree = function(cx, cy, x, y, treeType) {
      var entity;
      entity = new Tree(treeType, x, y, cx, cy);
      return Game.addEntity(entity, cx, cy);
    };

    Game.addPlayer = function(player) {
      this.players[player.name] = player;
      player.addSelf(this);
      return player;
    };

    Game.getEntity = function(type, name) {
      if (!this.entities[type]) {
        return null;
      }
      return this.entities[type][name];
    };

    Game.removeEntity = function(entitiy) {
      var type;
      type = entitiy.type;
      if (!this.entities[type]) {
        return false;
      }
      if (!this.entities[type][entitiy.name]) {
        return false;
      }
      entity.removeSelf(this);
      return true;
    };

    Game.addItem = function(type, x, y, cx, cy, count) {
      var item;
      if (count == null) {
        count = 1;
      }
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      item = new Item(type, x, y, count);
      this.addEntity(item, cx, cy);
      return this.chunks[cx][cy].setItem(x, y, item);
    };

    Game.addItem_at = function(xi, yi, cx, cy, item) {
      var _item;
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      _item = new Item(item.type, xi, yi, item.count);
      this.addEntity(_item, cx, cy);
      return this.chunks[cx][cy].setItem(xi, yi, _item);
    };

    Game.getItem = function(x, y, cx, cy) {
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      return this.chunks[cx][cy].getItem(x, y);
    };

    Game.removeItem = function(x, y, cx, cy) {
      var item;
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      item = this.chunks[cx][cy].getItem(x, y);
      if (!item) {
        return false;
      }
      this.removeEntity(item);
      this.chunks[cx][cy].setItem(x, y, null);
      return true;
    };

    Game.getElement = function(x, y) {
      var cx, cy, xi, yi;
      xi = Math.floor(x / TILE_SIZE);
      yi = Math.floor(y / TILE_SIZE);
      cx = Math.floor(x / (CHUNK_WIDTH * TILE_SIZE));
      cy = Math.floor(y / (CHUNK_HEIGHT * TILE_SIZE));
      return this.getElement_at(xi, yi, cx, cy);
    };

    Game.setElement = function(x, y, element) {
      var cx, cy, xi, yi;
      console.log("setElement");
      xi = Math.floor(x / TILE_SIZE);
      yi = Math.floor(y / TILE_SIZE);
      cx = Math.floor(x / (CHUNK_WIDTH * TILE_SIZE));
      cy = Math.floor(y / (CHUNK_HEIGHT * TILE_SIZE));
      return this.setElement_at(xi, yi, cx, cy, element);
    };

    Game.getElement_at = function(xi, yi, cx, cy) {
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      return this.chunks[cx][cy].getElement(xi, yi);
    };

    Game.setElement_at = function(xi, yi, cx, cy, element, dontSave) {
      var $element;
      if (dontSave == null) {
        dontSave = false;
      }
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      $element = this.getElementElm(xi, yi, cx, cy);
      if (!(element === void 0 || element === null)) {
        if ($element) {
          if ($element.classList.contains(ELM_TYPES[element])) {
            return;
          }
          this.removeListener($element);
          this.changeElementElm($element, xi, yi, cx, cy, element);
        } else {
          $element = this.addElementElm(xi, yi, cx, cy, element);
        }
        if (!dontSave) {
          this.saveElement(cx, cy, xi, yi, element);
        }
        this.initElement($element, xi, yi, cx, cy, element);
      } else {
        if ($element) {
          this.removeListener($element);
          $element.remove();
          this.removeElement(cx, cy, xi, yi);
        }
      }
      return this.chunks[cx][cy].setElement(xi, yi, element);
    };

    Game.addElementElm = function(xi, yi, cx, cy, element) {
      var $element;
      console.log("addElementElm ", element);
      $element = this.makeElement(cx, cy, xi, yi, ELM_TYPES[element]);
      this.chunksElm[cx][cy].$elements.appendChild($element);
      return $element;
    };

    Game.changeElementElm = function($element, xi, yi, cx, cy, element) {
      var type, was, _i, _len;
      was = this.chunks[cx][cy].getElement(xi, yi);
      console.log("changed element at x:" + xi + " y:" + yi + " from: " + ELM_TYPES[was] + "  to: " + ELM_TYPES[element]);
      for (_i = 0, _len = ELM_TYPES.length; _i < _len; _i++) {
        type = ELM_TYPES[_i];
        $element.classList.remove(type);
      }
      $element.classList.add("" + ELM_TYPES[element]);
      return $element;
    };

    Game.getElementElm = function(xi, yi, cx, cy) {
      return this.chunksElm[cx][cy].$elements.querySelector(".elm.x" + xi + ".y" + yi + ".cx" + cx + ".cy" + cy);
    };

    Game.makeElement = function(cx, cy, xi, yi, element_type) {
      var $element, $spriteEntity, r;
      console.log("makeElement ", element_type, "at", xi, yi);
      r = _.random(0, 3);
      $spriteEntity = new Sprite(16, 16);
      $spriteEntity.image = game.assets["images/elements.png"];
      $spriteEntity.frame = ELM_SPRITEINDEX[ELM_TYPES.indexOf(element_type)];
      console.log("frame ", $spriteEntity.frame);
      $spriteEntity.scale = 2;
      Game.$backgroundObjects.addChild($spriteEntity);
      $spriteEntity.x = xi * TILE_SIZE;
      $spriteEntity.y = yi * TILE_SIZE;
      $element = document.createElement('div');
      $element.className = "elm " + element_type + " x" + xi + " y" + yi + " cx" + cx + " cy" + cy + " r" + r;
      return $element;
    };

    Game.initElement = function($element, xi, yi, cx, cy, value) {
      switch (ELM_TYPES[value]) {
        case 'soil':
          this.addListener('soil', $element, xi, yi, cx, cy);
          break;
        case 'wateredSoil':
          this.addListener('wateredSoil', $element, xi, yi, cx, cy);
      }
      return this;
    };

    Game.getTile = function(x, y) {
      var cx, cy, xi, yi;
      xi = Math.floor(x / TILE_SIZE);
      yi = Math.floor(y / TILE_SIZE);
      cx = Math.floor(x / (CHUNK_WIDTH * TILE_SIZE));
      cy = Math.floor(y / (CHUNK_HEIGHT * TILE_SIZE));
      return this.getTile_at(xi, yi, cx, cy);
    };

    Game.setTile = function(x, y, value) {
      var cx, cy, xi, yi;
      console.log("set tile");
      xi = Math.floor(x / TILE_SIZE);
      yi = Math.floor(y / TILE_SIZE);
      cx = Math.floor(x / (CHUNK_WIDTH * TILE_SIZE));
      cy = Math.floor(y / (CHUNK_HEIGHT * TILE_SIZE));
      return this.setTile_at(xi, yi, cx, cy, value);
    };

    Game.getTile_at = function(xi, yi, cx, cy) {
      if (this.chunks[cx] === void 0 || this.chunks[cx][cy] === void 0) {
        return null;
      }
      return this.chunks[cx][cy].getTile(xi, yi);
    };

    Game.setTile_at = function(xi, yi, cx, cy, value, dontSave) {
      var $tile, _ref;
      if (dontSave == null) {
        dontSave = false;
      }
      if (this.chunks.length < cx || ((_ref = this.chunks[cx]) != null ? _ref.length : void 0) < cy) {
        return null;
      }
      $tile = this.getTileElm(xi, yi, cx, cy);
      if (!(value === void 0 || value === null)) {
        if ($tile) {
          if ($tile.classList.contains(TILE_TYPES[value])) {
            return;
          }
          this.removeListener($tile);
          this.changeTileElm($tile, xi, yi, cx, cy, value);
        } else {
          $tile = this.addTileElm(xi, yi, cx, cy, value);
        }
        if (!dontSave) {
          this.saveTile(cx, cy, xi, yi, value);
        }
      } else {
        if ($tile) {
          this.removeListener($tile);
          $tile.remove();
          this.removeTile(cx, cy, xi, yi);
        }
      }
      this.initTile($tile, xi, yi, cx, cy, value);
      return this.chunks[cx][cy].setTile(xi, yi, value);
    };

    Game.getChunkType = function(cx, cy) {
      var _ref;
      if (this.chunks.length < cx || ((_ref = this.chunks[cx]) != null ? _ref.length : void 0) < cy) {
        return -1;
      }
      return this.chunks[cx][cy].base;
    };

    Game.addTileElm = function(xi, yi, cx, cy, value) {
      var $tile, $tileSprite;
      $tile = this.makeTile(cx, cy, xi, yi, TILE_TYPES[value]);
      $tileSprite = this.makeTileSprite(cx, cy, xi, yi, TILE_INDEX[value]);
      Game.$backgroundObjects.addChild($tileSprite);
      this.chunksElm[cx][cy].$tiles.appendChild($tile);
      return $tile;
    };

    Game.changeTileElm = function($tile, xi, yi, cx, cy, value) {
      var type, _i, _len;
      for (_i = 0, _len = TILE_TYPES.length; _i < _len; _i++) {
        type = TILE_TYPES[_i];
        $tile.classList.remove(type);
      }
      $tile.classList.add("" + TILE_TYPES[value]);
      return $tile;
    };

    Game.getTileElm = function(xi, yi, cx, cy) {
      if (this.chunksElm[cx] === void 0 || this.chunksElm[cx][cy] === void 0) {
        return null;
      }
      return this.chunksElm[cx][cy].$tiles.querySelector(".tile.x" + xi + ".y" + yi + ".cx" + cx + ".cy" + cy);
    };

    Game.makeTile = function(cx, cy, xi, yi, tile_type) {
      var $tile, r;
      r = _.random(0, 3);
      $tile = document.createElement('div');
      $tile.className = "tile " + tile_type + " x" + xi + " y" + yi + " cx" + cx + " cy" + cy + " r" + r;
      return $tile;
    };

    Game.makeTileSprite = function(cx, cy, xi, yi, tile_type) {
      var $tile;
      $tile = new Sprite(16, 16);
      $tile.image = game.assets["images/tiles.png"];
      $tile.frame = tile_type;
      $tile.scale = 2;
      console.log("sprite scale", $tile.scale, "size ", $tile.width, $tile.height);
      $tile.x = xi * TILE_SIZE;
      $tile.y = yi * TILE_SIZE;
      return $tile;
    };

    Game.initTile = function($tile, xi, yi, cx, cy, value) {
      this.setTileKlass($tile, xi, yi, cx, cy, value);
      switch (TILE_TYPES[value]) {
        case 'soil':
          this.addListener('soil', $tile, xi, yi, cx, cy);
          break;
        case 'wateredSoil':
          this.addListener('wateredSoil', $tile, xi, yi, cx, cy);
      }
      return this;
    };

    Game.setTileKlass = function($tile, xi, yi, cx, cy, value) {
      var dir, klass, _i, _len;
      for (_i = 0, _len = TILE_DIRECTIONS.length; _i < _len; _i++) {
        dir = TILE_DIRECTIONS[_i];
        $tile.classList.remove(dir);
      }
      $tile.classList.remove('none');
      klass = this.getNeightbors(value, xi, yi, cx, cy);
      return $tile.className += klass;
    };

    Game.getNeightbors = function(tile_type, xi, yi, cx, cy) {
      var dir, klass, _i, _len;
      klass = '';
      for (_i = 0, _len = TILE_DIRECTIONS.length; _i < _len; _i++) {
        dir = TILE_DIRECTIONS[_i];
        if (this.getNeightbor(tile_type, dir, xi, yi, cx, cy)) {
          klass += " " + dir;
        }
      }
      if (klass === '') {
        klass = ' none';
      }
      return klass;
    };

    Game.getNeightbor = function(tile_type, dir, xi, yi, cx, cy) {
      var elm, tile;
      switch (dir) {
        case 'nw':
          if (xi === 0 && yi === 0) {
            tile = this.getTile_at(CHUNK_WIDTH - 1, CHUNK_HEIGHT - 1, cx - 1, cy - 1);
            elm = this.getTileElm(CHUNK_WIDTH - 1, CHUNK_HEIGHT - 1, cx - 1, cy - 1);
          } else if (xi === 0) {
            tile = this.getTile_at(CHUNK_WIDTH - 1, yi, cx - 1, cy);
            elm = this.getTileElm(CHUNK_WIDTH - 1, yi, cx - 1, cy);
          } else if (yi === 0) {
            tile = this.getTile_at(xi, CHUNK_HEIGHT - 1, cx, cy - 1);
            elm = this.getTileElm(xi, CHUNK_HEIGHT - 1, cx, cy - 1);
          } else {
            tile = this.getTile_at(xi - 1, yi - 1, cx, cy);
            elm = this.getTileElm(xi - 1, yi - 1, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('se');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('se');
          }
          return false;
        case 'n':
          if (yi === 0) {
            tile = this.getTile_at(xi, CHUNK_HEIGHT - 1, cx, cy - 1);
            elm = this.getTileElm(xi, CHUNK_HEIGHT - 1, cx, cy - 1);
          } else {
            tile = this.getTile_at(xi, yi - 1, cx, cy);
            elm = this.getTileElm(xi, yi - 1, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('s');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('s');
          }
          return false;
        case 'ne':
          if (xi === CHUNK_WIDTH && yi === 0) {
            tile = this.getTile_at(0, CHUNK_HEIGHT - 1, cx + 1, cy - 1);
            elm = this.getTileElm(0, CHUNK_HEIGHT - 1, cx + 1, cy - 1);
          } else if (xi === CHUNK_WIDTH) {
            tile = this.getTile_at(0, yi - 1, cx + 1, cy);
            elm = this.getTileElm(0, yi - 1, cx + 1, cy);
          } else if (yi === 0) {
            tile = this.getTile_at(xi + 1, CHUNK_HEIGHT - 1, cx, cy - 1);
            elm = this.getTileElm(xi + 1, CHUNK_HEIGHT - 1, cx, cy - 1);
          } else {
            tile = this.getTile_at(xi + 1, yi - 1, cx, cy);
            elm = this.getTileElm(xi + 1, yi - 1, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('sw');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('sw');
          }
          return false;
        case 'e':
          if (xi === CHUNK_WIDTH) {
            tile = this.getTile_at(0, yi, cx + 1, cy);
            elm = this.getTileElm(0, yi, cx + 1, cy);
          } else {
            tile = this.getTile_at(xi + 1, yi, cx, cy);
            elm = this.getTileElm(xi + 1, yi, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('w');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('w');
          }
          return false;
        case 'se':
          if (xi === CHUNK_WIDTH && yi === CHUNK_HEIGHT) {
            tile = this.getTile_at(0, 0, cx + 1, cy + 1);
            elm = this.getTileElm(0, 0, cx + 1, cy + 1);
          } else if (xi === CHUNK_WIDTH) {
            tile = this.getTile_at(0, yi + 1, cx + 1, cy);
            elm = this.getTileElm(0, yi + 1, cx + 1, cy);
          } else if (yi === CHUNK_HEIGHT) {
            tile = this.getTile_at(xi + 1, 0, cx, cy + 1);
            elm = this.getTileElm(xi + 1, 0, cx, cy + 1);
          } else {
            tile = this.getTile_at(xi + 1, yi + 1, cx, cy);
            elm = this.getTileElm(xi + 1, yi + 1, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('nw');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('nw');
          }
          return false;
        case 's':
          if (yi === CHUNK_HEIGHT) {
            tile = this.getTile_at(xi, 0, cx, cy + 1);
            elm = this.getTileElm(xi, 0, cx, cy + 1);
          } else {
            tile = this.getTile_at(xi, yi + 1, cx, cy);
            elm = this.getTileElm(xi, yi + 1, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('n');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('n');
          }
          return false;
        case 'sw':
          if (xi === 0 && yi === CHUNK_HEIGHT) {
            tile = this.getTile_at(CHUNK_WIDTH - 1, 0, cx - 1, cy + 1);
            elm = this.getTileElm(CHUNK_WIDTH - 1, 0, cx - 1, cy + 1);
          } else if (xi === 0) {
            tile = this.getTile_at(CHUNK_WIDTH - 1, yi + 1, cx - 1, cy);
            elm = this.getTileElm(CHUNK_WIDTH - 1, yi + 1, cx - 1, cy);
          } else if (yi === CHUNK_WIDTH) {
            tile = this.getTile_at(xi - 1, 0, cx, cy + 1);
            elm = this.getTileElm(xi - 1, 0, cx, cy + 1);
          } else {
            tile = this.getTile_at(xi - 1, yi + 1, cx, cy);
            elm = this.getTileElm(xi - 1, yi + 1, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('ne');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('ne');
          }
          return false;
        case 'w':
          if (xi === 0) {
            tile = this.getTile_at(CHUNK_WIDTH - 1, yi, cx - 1, cy);
            elm = this.getTileElm(CHUNK_WIDTH - 1, yi, cx - 1, cy);
          } else {
            tile = this.getTile_at(xi - 1, yi, cx, cy);
            elm = this.getTileElm(xi - 1, yi, cx, cy);
          }
          if (this.isNeightbor(tile, tile_type)) {
            if (elm != null) {
              elm.classList.add('e');
            }
            return true;
          } else if (elm != null) {
            elm.classList.remove('e');
          }
          return false;
        default:
          return false;
      }
    };

    Game.isNeightbor = function(tile, tile_type) {
      return tile === tile_type;
    };

    Game.addListener = function(type, $elm, xi, yi, cx, cy) {
      if (this.listeners[$elm.className]) {
        return this;
      }
      switch (type) {
        case 'soil':
          this.listeners[$elm.className] = setTimeout(function(type, $elm, xi, yi, cx, cy) {
            var r;
            r = _.random(1, 6);
            Game.removeListener($elm);
            if (r < 3) {
              return Game.addListener(type, $elm, xi, yi, cx, cy);
            } else {
              return Game.setElement_at(xi, yi, cx, cy);
            }
          }, 3000, type, $elm, xi, yi, cx, cy);
          break;
        case 'wateredSoil':
          this.listeners[$elm.className] = setTimeout(function(type, $elm, xi, yi, cx, cy) {
            var r;
            r = _.random(1, 6);
            Game.removeListener($elm);
            if (r < 1) {
              return Game.addListener(type, $elm, xi, yi, cx, cy);
            } else {
              return Game.setElement_at(xi, yi, cx, cy, _.indexOf(ELM_TYPES, 'soil'));
            }
          }, 3000, type, $elm, xi, yi, cx, cy);
      }
      return this;
    };

    Game.removeListener = function($elm) {
      if (this.listeners[$elm.className]) {
        clearTimeout(this.listeners[$elm.className]);
        delete this.listeners[$elm.className];
      }
      return this;
    };

    Game.loadChunks = function(cx, cy) {
      var jqXHR;
      cx = cx || 0;
      cy = cy || 0;
      this.addChunkElm(cx, cy);
      this.socket.emit('subscribe', {
        room: 'c_' + cx + '_' + cy
      });
      if (!this.chunks[cx]) {
        this.chunks[cx] = {};
      }
      jqXHR = $.getJSON("/api/" + cx + "_" + cy + ".json");
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          if (data && data.chunk) {
            return _this._loadChunk(cx, cy, Chunk.fromJSON(data.chunk));
          } else {
            console.log("status: " + status + " ");
            return console.log(data);
          }
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error("" + status);
        };
      })(this));
      return this;
    };

    Game.saveChunk = function(cx, cy) {
      var jqXHR;
      if (!(this.chunks[cx] && this.chunks[cx][cy])) {
        console.warn("no chunk @ " + cx + "_" + cy);
        return;
      }
      jqXHR = $.ajax({
        url: "/api",
        method: 'post',
        data: this.chunks[cx][cy].toJSON()
      });
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          console.log(data);
          return console.log(status);
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error(status);
        };
      })(this));
      return this;
    };

    Game.loadTile = function(cx, cy, xi, yi) {
      var jqXHR;
      jqXHR = $.getJSON("/api/" + cx + "_" + cy + "/tiles/" + xi + "_" + yi + ".json");
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          if (data && data.tiles) {
            if (!(data.tiles instanceof Array)) {
              return _this.setTile_at(xi, yi, cx, cy, data.tiles.value, true);
            }
          } else {
            console.log("status: " + status + " ");
            return console.log(data);
          }
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error("" + status);
        };
      })(this));
      return this;
    };

    Game.saveTile = function(cx, cy, xi, yi, value) {
      var jqXHR;
      jqXHR = $.ajax({
        url: "/api/" + cx + "_" + cy + "/tiles.json",
        method: 'post',
        data: {
          chunk: {
            x: cx,
            y: cy
          },
          tile: {
            x: xi,
            y: yi,
            value: value
          }
        }
      });
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          return _this.sendMessage('tiles', cx, cy, xi, yi, value);
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error(status);
        };
      })(this));
      return this;
    };

    Game.removeTile = function(cx, cy, xi, yi) {
      var jqXHR;
      jqXHR = $.ajax({
        url: "/api/" + cx + "_" + cy + "/tiles.json",
        method: 'delete',
        data: {
          chunk: {
            x: cx,
            y: cy
          },
          tile: {
            x: xi,
            y: yi
          }
        }
      });
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          return _this.sendMessage('tiles', cx, cy, xi, yi, null);
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error(status);
        };
      })(this));
      return this;
    };

    Game.loadElement = function(cx, cy, xi, yi) {
      var jqXHR;
      jqXHR = $.getJSON("/api/" + cx + "_" + cy + "/elements/" + xi + "_" + yi + ".json");
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          if (data && data.elements) {
            if (!(data.elements instanceof Array)) {
              return _this.setElement_at(xi, yi, cx, cy, data.elements.value, true);
            }
          } else {
            console.log("status: " + status + " ");
            return console.log(data);
          }
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error("" + status);
        };
      })(this));
      return this;
    };

    Game.saveElement = function(cx, cy, xi, yi, value) {
      var jqXHR;
      jqXHR = $.ajax({
        url: "/api/" + cx + "_" + cy + "/elements.json",
        method: 'post',
        data: {
          chunk: {
            x: cx,
            y: cy
          },
          element: {
            x: xi,
            y: yi,
            value: value
          }
        }
      });
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          return _this.sendMessage('elements', cx, cy, xi, yi, value);
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error(status);
        };
      })(this));
      return this;
    };

    Game.removeElement = function(cx, cy, xi, yi) {
      var jqXHR;
      jqXHR = $.ajax({
        url: "/api/" + cx + "_" + cy + "/elements.json",
        method: 'delete',
        data: {
          chunk: {
            x: cx,
            y: cy
          },
          element: {
            x: xi,
            y: yi
          }
        }
      });
      jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          return _this.sendMessage('elements', cx, cy, xi, yi, null);
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error(status);
        };
      })(this));
      return this;
    };

    Game.sendMessage = function(type, cx, cy, xi, yi, value) {
      var data;
      data = {};
      data.room = 'c_' + cx + '_' + cy;
      switch (type) {
        case 'elements':
          data.element = {
            x: xi,
            y: yi,
            value: value
          };
          this.socket.emit('elements', data);
          break;
        case 'tiles':
          data.tile = {
            x: xi,
            y: yi,
            value: value
          };
          this.socket.emit('tiles', data);
      }
      return this;
    };

    return Game;

  })();

  this.Item = (function(_super) {
    __extends(Item, _super);

    Item.itemCollectedElms = {};

    Item.initialized = false;

    Item.prototype.item_type = void 0;

    Item.prototype.count = 0;


    /*
    @param [type] the type of item
     */

    function Item(type, x, y, count) {
      if (count == null) {
        count = 1;
      }
      this.name = "" + type + "_x" + x + "_y" + y;
      this.item_type = type;
      this.count = count;
      Item.__super__.constructor.call(this, 'Item', this.name, x, y);
      this.facing = SOUTH;
      this.cx = 0;
      this.cy = 0;
      this.setPosition();
      this;
    }

    Item.init = function() {
      var type, _i, _len, _ref, _results;
      Item.initialized = true;
      Item.itemCollectedElms = {};
      _ref = Object.keys(ITEM_TYPES);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        _results.push(Item.itemCollectedElms[type] = Item.newItemIconElm(type));
      }
      return _results;
    };

    Item.itemCollectedElm = function(type, count) {
      var $elm, count_elm;
      if (!Item.initialized) {
        Item.init();
      }
      $elm = Item.itemCollectedElms[type].cloneNode(true);
      count_elm = $elm.querySelector('.count');
      count_elm.innerText = count;
      console.log('item collected icon made');
      return $elm;
    };

    Item.newItemIconElm = function(type) {
      var $count, $elm, $icon;
      $elm = document.createElement('div');
      $elm.className = "item-icon " + type;
      $icon = document.createElement('span');
      $icon.className = 'icon';
      $count = document.createElement('span');
      $count.className = 'count';
      $elm.appendChild($icon);
      $elm.appendChild($count);
      return $elm;
    };

    return Item;

  })(Entity);

  this.PlayerActions = (function() {
    PlayerActions.prototype.player = void 0;

    function PlayerActions(player) {
      this.player = player;
    }

    PlayerActions.prototype.changeTool = function(key) {
      switch (key) {
        case NUM_1:
          return this.player.tool = TOOL.DIRT;
        case NUM_2:
          return this.player.tool = TOOL.GRASS;
        case NUM_3:
          return this.player.tool = TOOL.SAND;
        case NUM_4:
          return this.player.tool = TOOL.ROCK;
        case NUM_5:
          return this.player.tool = TOOL.WATER;
        case NUM_6:
          return this.player.tool = TOOL.PATH;
        case NUM_7:
          return this.player.tool = TOOL.TREE;
        case NUM_8:
          return this.player.tool = TOOL.PLANT;
        case NUM_9:
          return this.player.tool = TOOL.STONE;
        case NUM_0:
          return this.player.tool = TOOL.NONE;
      }
    };

    PlayerActions.prototype.actOnElement = function(elm_type, x, y, cx, cy, alt) {
      if (alt == null) {
        alt = false;
      }
      if (elm_type === void 0) {
        return;
      }
      switch (ELM_TYPES[elm_type]) {
        case 'soil':
          return this.water_soil(x, y, cx, cy);
        case 'wateredSoil':
          return false;
        case 'weed':
        case 'grass':
        case 'stick':
          return this.clear_ground(x, y, cx, cy);
        case 'stump':
        case 'tree':
          this.clear_ground(x, y, cx, cy);
          return this.set_tile(x, y, cx, cy, 'hole');
        case 'bush':
          return this.cut_down_bushes(x, y, cx, cy);
        case 'branch':
        case 'roots':
        case 'ticket':
          return this.clear_ground(x, y, cx, cy);
        case 'rock':
          return this.clear_ground(x, y, cx, cy);
        case 'ore':
          return this.break_rocks(x, y, cx, cy);
        case 'stones':
          return this.clear_ground(x, y, cx, cy);
        case 'fence':
          return this.clear_ground(x, y, cx, cy);
        default:
          return false;
      }
    };

    PlayerActions.prototype.actOnTile = function(tile_type, x, y, cx, cy, alt) {
      if (alt == null) {
        alt = false;
      }
      if (tile_type === void 0) {
        tile_type = Game.getChunkType(cx, cy);
      }
      switch (this.player.tool) {
        case TOOL.DIRT:
          if (alt) {
            switch (TILE_TYPES[tile_type]) {
              case 'dirt':
                return this.set_tile(x, y, cx, cy, 'hole');
              case 'grass':
              case 'sand':
              case 'dirt_cliff':
                return this.set_tile(x, y, cx, cy, 'dirt');
            }
          } else {
            switch (TILE_TYPES[tile_type]) {
              case 'water':
                return this.set_tile(x, y, cx, cy, 'mud');
              case 'dirt':
                return this.set_tile(x, y, cx, cy, 'dirt_cliff');
              case 'mud':
              case 'hole':
                return this.set_tile(x, y, cx, cy, 'dirt');
            }
          }
          break;
        case TOOL.GRASS:
          if (alt && TILE_TYPES[tile_type] === 'grass') {
            this.set_tile(x, y, cx, cy, 'dirt');
          }
          if (!alt && (TILE_TYPES[tile_type] === 'dirt' || TILE_TYPES[tile_type] === 'mud')) {
            return this.set_tile(x, y, cx, cy, 'grass');
          }
          break;
        case TOOL.SAND:
          if (alt && TILE_TYPES[tile_type] === 'sand') {
            this.set_tile(x, y, cx, cy, 'dirt');
          }
          if (!alt) {
            switch (TILE_TYPES[tile_type]) {
              case 'mud':
                return this.set_tile(x, y, cx, cy, 'sand');
              case 'water':
                return this.set_tile(x, y, cx, cy, 'mud');
              case 'dirt':
              case 'grass':
                return this.set_tile(x, y, cx, cy, 'sand');
            }
          }
          break;
        case TOOL.ROCK:
          if (alt && TILE_TYPES[tile_type] === 'rock_cliff') {
            this.set_tile(x, y, cx, cy, 'dirt');
          }
          if (!alt && (TILE_TYPES[tile_type] === 'grass' || TILE_TYPES[tile_type] === 'sand' || TILE_TYPES[tile_type] === 'mud')) {
            return this.set_tile(x, y, cx, cy, 'rock_cliff');
          }
          break;
        case TOOL.WATER:
          if (alt) {
            switch (TILE_TYPES[tile_type]) {
              case 'water':
                return this.set_tile(x, y, cx, cy, 'hole');
              case 'mud':
                return this.set_tile(x, y, cx, cy, 'dirt');
            }
          } else {
            switch (TILE_TYPES[tile_type]) {
              case 'hole':
                return this.set_tile(x, y, cx, cy, 'water');
              case 'sand':
                return this.set_tile(x, y, cx, cy, 'dirt');
              case 'grass':
                return this.set_tile(x, y, cx, cy, 'mud');
              case 'dirt':
                return this.set_tile(x, y, cx, cy, 'mud');
            }
          }
          break;
        case TOOL.PATH:
          if (alt) {
            return this.set_tile(x, y, cx, cy, 'dirt');
          } else {
            return this.set_tile(x, y, cx, cy, 'worn_path');
          }
          break;
        case TOOL.TREE:
          switch (TILE_TYPES[tile_type]) {
            case 'grass':
            case 'dirt':
              return this.add_tree(x, y, cx, cy);
          }
          break;
        case TOOL.PLANT:
          switch (TILE_TYPES[tile_type]) {
            case 'grass':
            case 'dirt':
            case 'mud':
              return this.add_plant(x, y, cx, cy);
          }
          break;
        case TOOL.STONE:
          switch (TILE_TYPES[tile_type]) {
            case 'grass':
            case 'dirt':
            case 'sand':
            case 'mud':
              return this.add_stone(x, y, cx, cy);
          }
          break;
        case TOOL.NONE:
          if (alt) {
            switch (TILE_TYPES[tile_type]) {
              case 'dirt':
                return this.set_tile(x, y, cx, cy, 'hole');
              case 'grass':
              case 'sand':
              case 'mud':
                return this.set_tile(x, y, cx, cy, 'dirt');
              case 'water':
                return this.set_tile(x, y, cx, cy, 'mud');
              case 'dirt_cliff':
              case 'rock_cliff':
                return this.set_tile(x, y, cx, cy, 'dirt');
            }
          } else {
            switch (TILE_TYPES[tile_type]) {
              case 'dirt':
                return this.till_ground(x, y, cx, cy);
              case 'mud':
                return this.set_tile(x, y, cx, cy, 'water');
              case 'grass':
                return false;
            }
          }
      }
    };

    PlayerActions.prototype.till_ground = function(x, y, cx, cy) {
      console.log('tilled ground');
      return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'soil'));
    };

    PlayerActions.prototype.water_soil = function(x, y, cx, cy) {
      console.log('watered soil');
      return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'wateredSoil'));
    };

    PlayerActions.prototype.clear_ground = function(x, y, cx, cy) {
      return Game.setElement_at(x, y, cx, cy);
    };

    PlayerActions.prototype.cut_down_bushes = function(x, y, cx, cy) {
      return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'stump'));
    };

    PlayerActions.prototype.break_rocks = function(x, y, cx, cy, tile_type) {
      return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'stones'));
    };

    PlayerActions.prototype.plant_grass = function(x, y, cx, cy) {
      return Game.setTile_at(x, y, cx, cy, _.indexOf(TILE_TYPES, 'grass'));
    };

    PlayerActions.prototype.remove_grass = function(x, y, cx, cy) {
      return Game.setTile_at(x, y, cx, cy, _.indexOf(TILE_TYPES, 'dirt'));
    };

    PlayerActions.prototype.dig_water_hole = function(x, y, cx, cy) {
      return Game.setTile_at(x, y, cx, cy, _.indexOf(TILE_TYPES, 'water'));
    };

    PlayerActions.prototype.fill_water_hole = function(x, y, cx, cy) {
      return Game.setTile_at(x, y, cx, cy, _.indexOf(TILE_TYPES, 'dirt'));
    };

    PlayerActions.prototype.add_tree = function(x, y, cx, cy) {
      var r;
      r = Math.random();
      if (r >= 0 && r < 0.4) {
        return Game.addTree(cx, cy, x, y, 'large');
      } else if (r >= 0.4 && r < 0.9) {
        return Game.addTree(cx, cy, x, y, 'small');
      } else if (r >= 0.9 && r <= 1) {
        return Game.addTree(cx, cy, x, y, 'bare');
      }
    };

    PlayerActions.prototype.add_plant = function(x, y, cx, cy) {
      var r;
      r = Math.random();
      if (r >= 0 && r < 0.3) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'grass'));
      } else if (r >= 0.3 && r < 0.6) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'roots'));
      } else if (r >= 0.6 && r < 0.9) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'branch'));
      } else if (r >= 0.9 && r <= 1) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'bush'));
      }
    };

    PlayerActions.prototype.add_stone = function(x, y, cx, cy) {
      var r;
      r = Math.random();
      if (r >= 0 && r < 0.4) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'stones'));
      } else if (r >= 0.4 && r < 0.9) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'rock'));
      } else if (r >= 0.9 && r <= 1) {
        return Game.setElement_at(x, y, cx, cy, _.indexOf(ELM_TYPES, 'ore'));
      }
    };

    PlayerActions.prototype.set_tile = function(x, y, cx, cy, tile_type) {
      return Game.setTile_at(x, y, cx, cy, _.indexOf(TILE_TYPES, tile_type));
    };

    return PlayerActions;

  })();

  this.PlayerEntity = (function(_super) {
    __extends(PlayerEntity, _super);

    PlayerEntity.count = 0;

    PlayerEntity.prototype.inventory = void 0;

    PlayerEntity.prototype.actions = void 0;

    PlayerEntity.prototype.tool = void 0;


    /*
    @param [name] the name of the player
     */

    function PlayerEntity(name, x, y) {
      this.addSelf = __bind(this.addSelf, this);
      this.name = name || ("player" + PlayerEntity.count);
      PlayerEntity.count++;
      PlayerEntity.__super__.constructor.call(this, "player", this.name, x, y);
      this.cx = 0;
      this.cy = 0;
      this.tool = 'none';
      this.facing = SOUTH;
      this.actions = new PlayerActions(this);
      this.bindEvents();
      this;
    }

    PlayerEntity.prototype.addSelf = function(toGame) {
      toGame.$players.appendChild(this.$elm);
      return Game.$background.addChild(this.$spriteEntity);
    };

    PlayerEntity.prototype.bindEvents = function() {
      return document.addEventListener('keyup', (function(_this) {
        return function(e) {
          var _ref, _ref1;
          if (_ref = e.which, __indexOf.call(DIRECTIONS, _ref) >= 0) {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
              return _this.face(e.which);
            } else {
              return _this.move(e.which);
            }
          } else if (e.which === SPACE_BAR) {
            return _this["do"](_this.getXFacing(), _this.getYFacing(), e.shiftKey);
          } else {
            if (_ref1 = e.which, __indexOf.call(NUMBER_KEYS, _ref1) >= 0) {
              _this.actions.changeTool(e.which);
            }
            return console.log(e.which);
          }
        };
      })(this));
    };

    PlayerEntity.prototype.face = function(dir) {
      if (this.facing !== dir) {
        this.$elm.classList.remove(this.facing);
        this.facing = dir;
        this.$elm.classList.add(this.facing);
      }
      return this;
    };

    PlayerEntity.prototype.getXFacing = function() {
      if (this.facing === WEST) {
        return this.x - 1;
      } else if (this.facing === EAST) {
        return this.x + 1;
      } else {
        return this.x;
      }
    };

    PlayerEntity.prototype.getYFacing = function() {
      if (this.facing === NORTH) {
        return this.y - 1;
      } else if (this.facing === SOUTH) {
        return this.y + 1;
      } else {
        return this.y;
      }
    };

    PlayerEntity.prototype.move = function(dir) {
      if (__indexOf.call(DIR_LEFT, dir) >= 0) {
        if (this.facing === WEST) {
          this.check(this.x - 1, this.y);
        } else {
          this.face(WEST);
        }
      }
      if (__indexOf.call(DIR_UP, dir) >= 0) {
        if (this.facing === NORTH) {
          this.check(this.x, this.y - 1);
        } else {
          this.face(NORTH);
        }
      }
      if (__indexOf.call(DIR_RIGHT, dir) >= 0) {
        if (this.facing === EAST) {
          this.check(this.x + 1, this.y);
        } else {
          this.face(EAST);
        }
      }
      if (__indexOf.call(DIR_DOWN, dir) >= 0) {
        if (this.facing === SOUTH) {
          this.check(this.x, this.y + 1);
        } else {
          this.face(SOUTH);
        }
      }
      this.collectItems(this.x, this.y);
      Game.setCenter(this.x, this.y, this.cx, this.cy);
      return this;
    };

    PlayerEntity.prototype["do"] = function(x, y, alt) {
      var cx, cy, e, t;
      if (alt == null) {
        alt = false;
      }
      cx = this.cx;
      cy = this.cy;
      if (x < 0) {
        cx -= 1;
        x = x + CHUNK_WIDTH;
      } else if (x >= CHUNK_WIDTH) {
        cx += 1;
        x = x - CHUNK_WIDTH;
      }
      if (y < 0) {
        cy -= 1;
        y = y + CHUNK_HEIGHT;
      } else if (y >= CHUNK_HEIGHT) {
        cy += 1;
        y = y - CHUNK_HEIGHT;
      }
      e = Game.getElement_at(x, y, cx, cy);
      if (e !== void 0 && e !== null) {
        return this.actions.actOnElement(e, x, y, cx, cy, alt);
      } else {
        t = Game.getTile_at(x, y, cx, cy);
        return this.actions.actOnTile(t, x, y, cx, cy, alt);
      }
    };

    PlayerEntity.prototype.check = function(x, y) {
      var cx, cy, elm, tle;
      cx = this.cx;
      cy = this.cy;
      if (x < 0) {
        cx -= 1;
        x = x + CHUNK_WIDTH;
      } else if (x >= CHUNK_WIDTH) {
        cx += 1;
        x = x - CHUNK_WIDTH;
      }
      if (y < 0) {
        cy -= 1;
        y = y + CHUNK_HEIGHT;
      } else if (y >= CHUNK_HEIGHT) {
        cy += 1;
        y = y - CHUNK_HEIGHT;
      }
      elm = Game.getElement_at(x, y, cx, cy);
      if (elm !== void 0 && elm !== null) {
        if (!COLLIDER_ELMS[elm]) {
          return this.updatePos(x, y, cx, cy);
        }
      } else {
        tle = Game.getTile_at(x, y, cx, cy);
        if (tle === null || tle === void 0 || !COLLIDER_TILES[tle]) {
          return this.updatePos(x, y, cx, cy);
        }
      }
    };

    PlayerEntity.prototype.updatePos = function(x, y, cx, cy) {
      this.x = x;
      this.y = y;
      this.cx = cx;
      this.cy = cy;
      if (!Game.hasChunk(cx, cy)) {
        console.log("making new chunk at x: " + cx + " y: " + cy);
        return Game.loadChunks(cx, cy);
      }
    };

    PlayerEntity.prototype.collectItems = function(x, y) {
      var item;
      item = Game.getItem(x, y, this.cx, this.cy);
      if (item !== void 0 && item !== null) {
        return Game.removeItem(x, y, this.cx, this.cy);
      }
    };

    return PlayerEntity;

  })(Entity);

}).call(this);
