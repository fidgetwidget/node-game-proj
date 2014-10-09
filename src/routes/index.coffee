express = require('express')
router = express.Router()

router.get '/', (req, res) ->
  res.render 'index', { title: 'Node Game Proj' }


module.exports = router
