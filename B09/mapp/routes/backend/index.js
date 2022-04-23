var express = require('express');
var router = express.Router();


router.use('/items/', require('./items'));
router.use('/dashboard', require('./dashboard'));
router.use('/manager/groups', require('./groups'));
router.use('/manager/users', require('./users'));

module.exports = router;
