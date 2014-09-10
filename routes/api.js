var express   = require('express');
var router    = express.Router();

var chunk     = require('../controllers/chunkCtrl.js')
var element   = require('../controllers/elementCtrl.js')
var tile      = require('../controllers/tileCtrl.js')


router.post(    '/',                                      chunk.post );
router.get(     '/:chunk_x_y.:format',                    chunk.get );

router.post(    '/:chunk_x_y/tiles.:format?',             tile.post );
router.delete(  '/:chunk_x_y/tiles.:format?',             tile.del );
router.get(     '/:chunk_x_y/tiles.:format',              tile.get );
router.get(     '/:chunk_x_y/tiles/:tile_x_y.:format',    tile.get );

router.post(    '/:chunk_x_y/elements.:format?',          element.post );
router.delete(  '/:chunk_x_y/elements.:format?',          element.del );
router.get(     '/:chunk_x_y/elements.:format',           element.get );
router.get(     '/:chunk_x_y/elements/:elm_x_y.:format',  element.get );

module.exports = router;
