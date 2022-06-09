var express = require('express');
var router = express.Router();


router.use('/post-manager/category', require('./category'));
router.use('/post-manager/articles', require('./articles'));
router.use('/dashboard', require('./dashboard'));
router.use('/manager/groups', require('./groups'));
router.use('/manager/users', require('./users'));

module.exports = router;
