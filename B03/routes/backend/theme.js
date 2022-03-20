var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('pages/backend/dashboard/index', { pageTitle: 'Dashboard' });
});


router.get('/login', function(req, res, next) {
  res.render('pages/frontend/login',     { pageTitle: 'Login', layout: false });
});
 
router.get('/list', function(req, res, next) {
  res.render('pages/backend/books/list', { pageTitle: 'Books list page' });
});

router.get('/form', function(req, res, next) {
  res.render('pages/backend/books/form',  { pageTitle: 'Form book - Add' });

});


module.exports = router;
