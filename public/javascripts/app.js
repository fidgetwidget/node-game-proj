// Generated by CoffeeScript 1.7.1
(function() {
  var Entity, PLAYERSKILLS,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.DIRECTIONS = [37, 38, 39, 40, 65, 87, 68, 83];

  this.LEFT = 37;

  this.A = 65;

  this.UP = 38;

  this.W = 87;

  this.RIGHT = 39;

  this.D = 68;

  this.DOWN = 40;

  this.S = 83;

  this.SPACE_BAR = 32;

  this.CHUNK_WIDTH = 32;

  this.CHUNK_HEIGHT = 32;

  this.TILE_SIZE = 32;

  this.TILE_TYPES = ['dirt', 'grass', 'grassR', 'grassB', 'grassL', 'grassT'];

  this.COLLIDER_TILES = [false, false, false, false, false, false];

  this.ELM_TYPES = ['soil', 'wateredSoil', 'weed', '_0', 'stump', 'bush', 'branch', 'stones', 'rock', 'ore', 'fence', '_1'];

  this.COLLIDER = [false, false, true, false, true, true, true, false, true, true, true, false];

  this.ITEM_TYPES = {
    'small_stick': 'small_stick',
    'sharp_stick': 'sharp_stick',
    'small_stone': 'small_stone',
    'sharp_stone': 'sharp_stone',
    'large_stone': 'large_stone',
    'large_stick': 'large_stick',
    'wood': 'wood',
    'stone': 'stone'
  };

  this.NONE = 'none';

  this.Chunk = (function() {
    Chunk.prototype.tiles = void 0;

    Chunk.prototype.elements = void 0;

    Chunk.prototype.items = void 0;

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
      this.keepEmpty = false;
    }

    Chunk.prototype.load = function(json) {
      var elm, item, tile, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      if (json) {
        Game._unloadChunk(this.x, this.y);
        this.x = json.x;
        this.y = json.y;
        this.base = json.base;
        Game._loadChunk(this.x, this.y, this);
        if (json._tiles != null) {
          _ref = json._tiles;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            tile = _ref[_i];
            Game.setTile_at(tile.x, tile.y, this.x, this.y, tile.value);
          }
        }
        if (json._elements != null) {
          _ref1 = json._elements;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            elm = _ref1[_j];
            Game.setElement_at(elm.x, elm.y, this.x, this.y, elm.value);
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
        if (!this.keepEmpty) {
          this.tiles[x][y] = null;
        } else {
          delete this.tiles[x][y];
          if (Object.keys(this.tiles[x]).length === 0) {
            delete this.tiles[x];
          }
        }
      } else {
        this.tiles[x][y] = value;
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

  Entity = (function() {
    Entity.prototype.name = 'entity_name';

    Entity.prototype.type = 'entity_type';

    Entity.prototype.cx = 0;

    Entity.prototype.cy = 0;

    Entity.prototype.x = 0;

    Entity.prototype.y = 0;

    Entity.prototype.elm = void 0;

    Entity.prototype.$elm = void 0;

    Entity.prototype.width = 32;

    Entity.prototype.height = 32;

    Entity.prototype.offsetX = 0;

    Entity.prototype.offsetY = 0;

    Entity.prototype.facing = DOWN;

    function Entity(type, name, x, y) {
      this.type = type;
      this.name = name;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.addElm = __bind(this.addElm, this);
      this.rename = __bind(this.rename, this);
      this.$elm = document.createElement('div');
      this.$elm.className = "entity " + this.type + " w" + this.width + " h" + this.height;
      if (Game._debug) {
        console.log("" + this.type + " " + this.name + " created.");
      }
    }

    Entity.prototype.setPosition = function() {
      this.$elm.style.top = "" + ((this.y * TILE_SIZE) - this.offsetY) + "px";
      this.$elm.style.left = "" + ((this.x * TILE_SIZE) - this.offsetX) + "px";
      return this;
    };

    Entity.prototype.rename = function(name) {
      var _oldName;
      if (this.name !== name) {
        _oldName = this.name;
        this.name = name;
        if (Game.entities[this.type]) {
          if (Game.entities[this.type][_oldName]) {
            Game.addEntity(this);
            delete Game.entities[this.type][_oldName];
          }
        }
      }
      if (Game._debug) {
        return console.log("" + this.type + " " + _oldName + " renamed to " + this.name + ".");
      }
    };

    Entity;

    Entity.prototype.addElm = function(game) {
      return game.$entities.appendChild(this.$elm);
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

    Game.chunks = void 0;

    Game.$container = void 0;

    Game.$tiles = void 0;

    Game.$elements = void 0;

    Game.$entities = void 0;

    Game.listeners = void 0;

    Game.$inventory = void 0;

    Game.$stats = void 0;

    Game.$combat = void 0;

    Game.centerX = 0;

    Game.centerY = 0;

    Game._height = 0;

    Game._width = 0;

    Game._gridHeight = 0;

    Game._gridWidth = 0;

    Game.init = function() {
      var $wrapper, _fragment;
      if (Game._debug) {
        console.log("Game.init() was called.");
      }
      Game.entities = [];
      Game.$container = document.getElementById('main');
      Game.$inventory = document.getElementById('inventory');
      Game.$stats = document.getElementById('stast');
      Game.$combat = document.getElementById('combat');
      $wrapper = document.createElement('div');
      $wrapper.className = 'wrapper';
      this.$tiles = document.createElement('div');
      this.$tiles.className = 'tiles';
      this.$elements = document.createElement('div');
      this.$elements.className = 'elements';
      this.$entities = document.createElement('div');
      this.$entities.className = 'entities';
      this.listeners = {};
      _fragment = document.createDocumentFragment();
      _fragment.appendChild(this.$tiles);
      _fragment.appendChild(this.$elements);
      _fragment.appendChild(this.$entities);
      $wrapper.appendChild(_fragment);
      Game.$container.appendChild($wrapper);
      Game._width = Game.$container.offsetWidth;
      Game._gridWidth = Game._width / TILE_SIZE;
      Game._height = Game.$container.offsetHeight;
      Game._gridHeight = Game._height / TILE_SIZE;
      this.chunks = {};
      if (Game._debug) {
        console.log("Game.init() complete.");
      }
      return Game;
    };

    Game.randomWorld = function() {
      var chunk, elm_type, i, rv, rx, ry, _i;
      this.chunks[0] = {};
      chunk = new Chunk(0, 0);
      this.chunks[0][0] = chunk;
      this.setTilesBaseClass(chunk);
      for (i = _i = 0; _i < 32; i = ++_i) {
        rx = _.random(0, CHUNK_WIDTH);
        ry = _.random(0, CHUNK_HEIGHT);
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
          Game.setElement_at(rx, ry, 0, 0, elm_type);
        }
      }
      return this;
    };

    Game.createPlayer = function() {
      var p1;
      p1 = new PlayerEntity();
      this.addEntity(p1);
      return this.setCenter(p1.x, p1.y);
    };

    Game.setCenter = function(x, y) {
      classie.remove(this.$container, "x" + this.offsetX);
      classie.remove(this.$container, "y" + this.offsetY);
      this.centerX = x;
      this.centerY = y;
      if (this.centerX <= 8) {
        this.offsetX = 0;
      } else if (this.centerX > 8 && this.centerX < 24) {
        this.offsetX = this.centerX - 8;
      } else {
        this.offsetX = 16;
      }
      if (this.centerY <= 8) {
        this.offsetY = 0;
      } else if (this.centerY > 8 && this.centerY < 24) {
        this.offsetY = this.centerY - 8;
      } else {
        this.offsetY = 16;
      }
      classie.add(this.$container, "x" + this.offsetX);
      return classie.add(this.$container, "y" + this.offsetY);
    };

    Game.loadChunks = function(cx, cy) {
      var jqXHR;
      cx = cx || 0;
      cy = cy || 0;
      if (!this.chunks[cx]) {
        this.chunks[cx] = {};
      }
      jqXHR = $.getJSON("/chunk/" + cx + "_" + cy + ".json");
      return jqXHR.done((function(_this) {
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
    };

    Game.saveChunk = function(cx, cy) {
      var jqXHR;
      if (!(this.chunks[cx] && this.chunks[cx][cy])) {
        console.warn("no clunk @ " + cx + "_" + cy);
        return;
      }
      jqXHR = $.ajax({
        url: "/chunk",
        method: 'post',
        data: this.chunks[cx][cy].toJSON()
      });
      return jqXHR.done((function(_this) {
        return function(data, status, jqXHR) {
          return console.log(status);
        };
      })(this)).fail((function(_this) {
        return function(jqXHR, status, error) {
          return console.error(status);
        };
      })(this));
    };

    Game._unloadChunk = function(cx, cy) {
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
      $tiles = this.$tiles.querySelectorAll(".tile.cx" + cx + ".cy" + cy);
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
      $elms = this.$elements.querySelectorAll(".elm.cx" + cx + ".cy" + cy);
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
      var typ, _i, _len;
      for (_i = 0, _len = TILE_TYPES.length; _i < _len; _i++) {
        typ = TILE_TYPES[_i];
        classie.remove(this.$tiles, typ);
      }
      return classie.add(this.$tiles, TILE_TYPES[chunk.base]);
    };

    Game.addEntity = function(entity) {
      var type;
      type = entity.type;
      if (!this.entities[type]) {
        this.entities[type] = {};
      }
      if (this.entities[type][entity.name]) {
        return null;
      }
      this.entities[type][entity.name] = entity;
      entity.addElm(this);
      return entity;
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
      delete this.entities[type][entitiy.name];
      if (entitiy.$elm.parentNode) {
        entitiy.$elm.parentNode.removeChild(entitiy.$elm);
      }
      return true;
    };

    Game.addItem = function(type, x, y, cx, cy, count) {
      var item;
      if (count == null) {
        count = 1;
      }
      item = new Item(type, x, y, count);
      this.addEntity(item);
      return this.chunks[cx][cy].setItem(x, y, item);
    };

    Game.addItem_at = function(xi, yi, cx, cy, item) {
      var _item;
      _item = new Item(item.type, xi, yi, item.count);
      this.addEntity(_item);
      return this.chunks[cx][cy].setItem(xi, yi, _item);
    };

    Game.getItem = function(x, y, cx, cy) {
      return this.chunks[cx][cy].getItem(x, y);
    };

    Game.removeItem = function(x, y, cx, cy) {
      var item;
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
      xi = Math.floor(x / TILE_SIZE);
      yi = Math.floor(y / TILE_SIZE);
      cx = Math.floor(x / (CHUNK_WIDTH * TILE_SIZE));
      cy = Math.floor(y / (CHUNK_HEIGHT * TILE_SIZE));
      return this.setElement_at(xi, yi, cx, cy, element);
    };

    Game.getElement_at = function(xi, yi, cx, cy) {
      var _ref;
      if (this.chunks.length < cx || ((_ref = this.chunks[cx]) != null ? _ref.length : void 0) < cy) {
        return null;
      }
      return this.chunks[cx][cy].getElement(xi, yi);
    };

    Game.setElement_at = function(xi, yi, cx, cy, element) {
      var $element, _ref;
      if (this.chunks.length < cx || ((_ref = this.chunks[cx]) != null ? _ref.length : void 0) < cy) {
        return null;
      }
      $element = this.getElementElm(xi, yi, cx, cy);
      if (!(element === void 0)) {
        if ($element) {
          this.removeListener($element);
          this.changeElementElm($element, xi, yi, cx, cy, element);
        } else {
          $element = this.addElementElm(xi, yi, cx, cy, element);
        }
        this.initElement($element, xi, yi, cx, cy, element);
      } else {
        if ($element) {
          this.removeListener($element);
          $element.remove();
        }
      }
      return this.chunks[cx][cy].setElement(xi, yi, element);
    };

    Game.addElementElm = function(xi, yi, cx, cy, element) {
      var $element;
      $element = this.makeElement(cx, cy, xi, yi, ELM_TYPES[element]);
      this.$elements.appendChild($element);
      return $element;
    };

    Game.changeElementElm = function($element, xi, yi, cx, cy, element) {
      var type, was, _i, _len;
      was = this.chunks[cx][cy].getElement(xi, yi);
      console.log("changed element at x:" + xi + " y:" + yi + " from: " + ELM_TYPES[was] + "  to: " + ELM_TYPES[element]);
      for (_i = 0, _len = ELM_TYPES.length; _i < _len; _i++) {
        type = ELM_TYPES[_i];
        classie.remove($element, type);
      }
      classie.add($element, "" + ELM_TYPES[element]);
      return $element;
    };

    Game.getElementElm = function(xi, yi, cx, cy) {
      return this.$elements.querySelector(".elm.x" + xi + ".y" + yi + ".cx" + cx + ".cy" + cy);
    };

    Game.makeElement = function(cx, cy, xi, yi, element_type) {
      var $element, r;
      r = _.random(0, 3);
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
      xi = Math.floor(x / TILE_SIZE);
      yi = Math.floor(y / TILE_SIZE);
      cx = Math.floor(x / (CHUNK_WIDTH * TILE_SIZE));
      cy = Math.floor(y / (CHUNK_HEIGHT * TILE_SIZE));
      return this.setTile_at(xi, yi, cx, cy, value);
    };

    Game.getTile_at = function(xi, yi, cx, cy) {
      var _ref;
      if (this.chunks.length < cx || ((_ref = this.chunks[cx]) != null ? _ref.length : void 0) < cy) {
        return null;
      }
      return this.chunks[cx][cy].getTile(xi, yi);
    };

    Game.setTile_at = function(xi, yi, cx, cy, value) {
      var $tile, _ref;
      if (this.chunks.length < cx || ((_ref = this.chunks[cx]) != null ? _ref.length : void 0) < cy) {
        return null;
      }
      $tile = this.getTileElm(xi, yi, cx, cy);
      if (!(value === void 0)) {
        if ($tile) {
          this.removeListener($tile);
          this.changeTileElm($tile, xi, yi, cx, cy, value);
        } else {
          $tile = this.addTileElm(xi, yi, cx, cy, value);
        }
        this.initTile($tile, xi, yi, cx, cy, value);
      } else {
        if ($tile) {
          this.removeListener($tile);
          $tile.remove();
        }
      }
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
      var $tile;
      $tile = this.makeTile(cx, cy, xi, yi, TILE_TYPES[value]);
      this.$tiles.appendChild($tile);
      return $tile;
    };

    Game.changeTileElm = function($tile, xi, yi, cx, cy, value) {
      var type, _i, _len;
      console.log("changed tile at x:" + xi + " y:" + yi);
      for (_i = 0, _len = TILE_TYPES.length; _i < _len; _i++) {
        type = TILE_TYPES[_i];
        classie.remove($tile, type);
      }
      classie.add($tile, "" + TILE_TYPES[value]);
      return $tile;
    };

    Game.getTileElm = function(xi, yi, cx, cy) {
      return this.$tiles.querySelector(".tile.x" + xi + ".y" + yi + ".cx" + cx + ".cy" + cy);
    };

    Game.makeTile = function(cx, cy, xi, yi, tile_type) {
      var $tile, r;
      r = _.random(0, 3);
      $tile = document.createElement('div');
      $tile.className = "tile " + tile_type + " x" + xi + " y" + yi + " cx" + cx + " cy" + cy + " r" + r;
      return $tile;
    };

    Game.initTile = function($tile, xi, yi, cx, cy, value) {
      switch (TILE_TYPES[value]) {
        case 'soil':
          this.addListener('soil', $tile, xi, yi, cx, cy);
          break;
        case 'wateredSoil':
          this.addListener('wateredSoil', $tile, xi, yi, cx, cy);
      }
      return this;
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
      this.facing = DOWN;
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
      this.name = name || ("player" + PlayerEntity.count);
      PlayerEntity.count++;
      x = x || Game._gridWidth / 2;
      y = y || Game._gridHeight / 2;
      PlayerEntity.__super__.constructor.call(this, "player", this.name, x, y);
      this.cx = 0;
      this.cy = 0;
      this.tool = NONE;
      this.facing = DOWN;
      this.inventory = new PlayerInventory(this);
      this.actions = new PlayerActions(this);
      this.setPosition();
      this.bindEvents();
      this;
    }

    PlayerEntity.prototype.bindEvents = function() {
      return document.addEventListener('keyup', (function(_this) {
        return function(e) {
          var _ref;
          if (_ref = e.which, __indexOf.call(DIRECTIONS, _ref) >= 0) {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
              return _this.face(e.which);
            } else {
              return _this.move(e.which);
            }
          } else if (e.which === SPACE_BAR) {
            return _this["do"](_this.getXFacing(), _this.getYFacing());
          } else {
            return console.log(e.which);
          }
        };
      })(this));
    };

    PlayerEntity.prototype.face = function(dir) {
      if (dir === A) {
        dir = LEFT;
      }
      if (dir === W) {
        dir = UP;
      }
      if (dir === D) {
        dir = RIGHT;
      }
      if (dir === S) {
        dir = DOWN;
      }
      if (this.facing !== dir) {
        this.facing = dir;
      }
      return this;
    };

    PlayerEntity.prototype.getXFacing = function() {
      if (this.facing === LEFT) {
        return this.x - 1;
      } else if (this.facing === RIGHT) {
        return this.x + 1;
      } else {
        return this.x;
      }
    };

    PlayerEntity.prototype.getYFacing = function() {
      if (this.facing === UP) {
        return this.y - 1;
      } else if (this.facing === DOWN) {
        return this.y + 1;
      } else {
        return this.y;
      }
    };

    PlayerEntity.prototype.move = function(dir) {
      switch (dir) {
        case LEFT:
        case A:
          this.face(LEFT);
          if (this.check(this.x - 1, this.y)) {
            this.x--;
          }
          break;
        case UP:
        case W:
          this.face(UP);
          if (this.check(this.x, this.y - 1)) {
            this.y--;
          }
          break;
        case RIGHT:
        case D:
          this.face(RIGHT);
          if (this.check(this.x + 1, this.y)) {
            this.x++;
          }
          break;
        case DOWN:
        case S:
          this.face(DOWN);
          if (this.check(this.x, this.y + 1)) {
            this.y++;
          }
      }
      this.collectItems(this.x, this.y);
      Game.setCenter(this.x, this.y);
      this.setPosition();
      return this;
    };

    PlayerEntity.prototype["do"] = function(x, y) {
      var e, t;
      if (x < 0 || y < 0 || x >= CHUNK_WIDTH || y >= CHUNK_HEIGHT) {
        return false;
      }
      e = Game.getElement_at(x, y, this.cx, this.cy);
      if (e !== void 0 && e !== null) {
        return this.actOnElement(e, x, y);
      } else {
        t = Game.getTile_at(x, y, this.cx, this.cy);
        return this.actOnTile(t, x, y);
      }
    };

    PlayerEntity.prototype.check = function(x, y) {
      var e, t;
      if (x < 0 || y < 0 || x >= CHUNK_WIDTH || y >= CHUNK_HEIGHT) {
        return false;
      }
      e = Game.getElement_at(x, y, this.cx, this.cy);
      if (e !== void 0 && e !== null) {
        return !COLLIDER[e];
      } else {
        t = Game.getTile_at(x, y, this.cx, this.cy);
        if (t === null || t === void 0) {
          return true;
        }
        return !COLLIDER_TILES[t];
      }
    };

    PlayerEntity.prototype.collectItems = function(x, y) {
      var item;
      item = Game.getItem(x, y, this.cx, this.cy);
      if (item !== void 0 && item !== null) {
        this.inventory.addItem(item.type, item.count);
        return Game.removeItem(x, y, this.cx, this.cy);
      }
    };

    PlayerEntity.prototype.actOnElement = function(elm_type, x, y) {
      if (elm_type === void 0) {
        return;
      }
      switch (ELM_TYPES[elm_type]) {
        case 'soil':
          return this.actions.water_soil(x, y, this.cx, this.cy);
        case 'wateredSoil':
          return false;
        case 'weed':
          return this.actions.clear_ground(x, y, this.cx, this.cy);
        case 'stump':
          return this.actions.clear_ground(x, y, this.cx, this.cy);
        case 'bush':
          return this.actions.cut_down_bushes(x, y, this.cx, this.cy);
        case 'branch':
          return this.actions.clear_ground(x, y, this.cx, this.cy);
        case 'rock':
          return this.actions.break_rocks(x, y, this.cx, this.cy);
        case 'ore':
          return this.actions.break_rocks(x, y, this.cx, this.cy);
        case 'stones':
          return this.actions.clear_ground(x, y, this.cx, this.cy);
        case 'fence':
          return this.actions.clear_ground(x, y, this.cx, this.cy);
        default:
          return false;
      }
    };

    PlayerEntity.prototype.actOnTile = function(tile_type, x, y) {
      if (tile_type === void 0) {
        tile_type = Game.getChunkType(this.cx, this.cy);
      }
      switch (TILE_TYPES[tile_type]) {
        case "dirt":
          return this.actions.till_ground(x, y, this.cx, this.cy);
      }
    };

    return PlayerEntity;

  })(Entity);

  this.PlayerInventory = (function() {
    PlayerInventory.prototype.player = void 0;

    PlayerInventory.prototype.items = void 0;

    PlayerInventory.prototype.$elms = void 0;

    PlayerInventory.prototype.$items = void 0;

    PlayerInventory.prototype.timeouts = void 0;

    function PlayerInventory(player) {
      this.player = player;
      this.items = {};
      this.$items = {};
      this.$elms = document.createElement('div');
      Game.$inventory.appendChild(this.$elms);
      this;
    }

    PlayerInventory.prototype.addItem = function(type, count) {
      var count_elm;
      if (this.items[type] === void 0) {
        this.items[type] = 0;
        this.$items[type] = this.newItemIconElm(type);
        this.$elms.appendChild(this.$items[type]);
        setTimeout((function(_this) {
          return function() {
            return classie.add(_this.$items[type], 'in');
          };
        })(this), 200);
      }
      this.showItemCollectedIcon(type, count);
      this.items[type] += count;
      count_elm = this.$items[type].querySelector('.count');
      return count_elm.innerText = this.items[type];
    };

    PlayerInventory.prototype.showItemCollectedIcon = function(type, count) {
      var $count, $item;
      if (!this.timeouts) {
        this.timeouts = {};
      }
      $item = this.player.$elm.querySelector(".item-icon." + type);
      if ($item) {
        clearTimeout(this.timeouts[type]);
        $count = $item.querySelector(".count");
        count += parseInt($count.innerText);
        $count.innerText = count;
      } else {
        $item = Item.itemCollectedElm(type, count);
        this.player.$elm.appendChild($item);
      }
      return this.timeouts[type] = setTimeout((function(_this) {
        return function() {
          return $item.remove();
        };
      })(this), 1000);
    };

    PlayerInventory.prototype.getCount = function(type) {
      if (this.items[type] === void 0) {
        return 0;
      }
      return this.items[type];
    };

    PlayerInventory.prototype.newItemIconElm = function(type) {
      var $count, $elm, $icon;
      $elm = document.createElement('div');
      $elm.className = "inventory-item " + type + " fade";
      $icon = document.createElement('span');
      $icon.className = 'icon';
      $count = document.createElement('span');
      $count.className = 'count';
      $elm.appendChild($icon);
      $elm.appendChild($count);
      return $elm;
    };

    return PlayerInventory;

  })();

  PLAYERSKILLS = ['FARMING', 'FORESTRY', 'MINING', 'HERBALISM', 'HUSBANDRY', 'BLACKSMITHING'];

  this.PlayerStats = (function() {
    function PlayerStats() {}

    PlayerStats.prototype.player = void 0;

    PlayerStats.prototype.timers = void 0;

    PlayerStats.prototype.health = void 0;

    PlayerStats.prototype.fatigue = 0;

    PlayerStats.prototype.hunger = 0;

    PlayerStats.prototype.thirst = 0;

    PlayerStats.prototype.physical = 1;

    PlayerStats.prototype.intelect = 1;

    PlayerStats.prototype.mystical = 1;

    PlayerStats.prototype.skills = {
      'woodcutting': 0
    };

    return PlayerStats;

  })();

}).call(this);
