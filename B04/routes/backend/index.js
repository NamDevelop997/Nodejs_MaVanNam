var express = require('express');
var router = express.Router();


router.use('/book', require('./book'));
router.use('/dashboard', require('./dashboard'));

module.exports = router;
