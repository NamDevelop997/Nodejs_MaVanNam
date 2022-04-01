var express = require('express');
var router = express.Router();


router.use('/item', require('./item'));
router.use('/dashboard', require('./dashboard'));

module.exports = router;
