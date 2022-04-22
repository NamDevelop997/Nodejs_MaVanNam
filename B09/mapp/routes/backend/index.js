var express = require('express');
var router = express.Router();


router.use('/items/', require('./item'));
router.use('/dashboard', require('./dashboard'));
router.use('/manager/groups', require('./groups'));

module.exports = router;
