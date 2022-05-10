var express = require('express');
var router = express.Router();


router.use('/category/', require('./category'));
router.use('/dashboard', require('./dashboard'));
router.use('/manager/groups', require('./groups'));
router.use('/manager/users', require('./users'));

module.exports = router;
