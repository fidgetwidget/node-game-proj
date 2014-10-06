var ChunkCtrl, ElementCtrl, TileCtrl, express, router;

express = require('express');

router = express.Router();

ChunkCtrl = require('../controllers/chunk_ctrl.js');

ElementCtrl = require('../controllers/element_ctrl.js');

TileCtrl = require('../controllers/tile_ctrl.js');

router.post('/', ChunkCtrl.post);

router.get('/:chunk_x_y.:format', ChunkCtrl.get);

router.post('/:chunk_x_y/tiles.:format?', TileCtrl.post);

router["delete"]('/:chunk_x_y/tiles.:format?', TileCtrl.del);

router.get('/:chunk_x_y/tiles.:format', TileCtrl.get);

router.get('/:chunk_x_y/tiles/:tile_x_y.:format', TileCtrl.get);

router.post('/:chunk_x_y/elements.:format?', ElementCtrl.post);

router["delete"]('/:chunk_x_y/elements.:format?', ElementCtrl.del);

router.get('/:chunk_x_y/elements.:format', ElementCtrl.get);

router.get('/:chunk_x_y/elements/:elm_x_y.:format', ElementCtrl.get);

module.exports = router;
