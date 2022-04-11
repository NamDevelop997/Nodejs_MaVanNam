var express         = require('express');
var router          = express.Router();

const ItemsModel    = require("./../../schemas/items");


/* GET home page. */
router.get('/', async(req, res, next) => {
  let countItems = 0 ;
  await ItemsModel.count({}).then((count) => { //get count Items
    countItems = count;
  });
  
  res.render('pages/backend/dashboard/index', { pageTitle: 'Dashboard' , countItems });
});





module.exports = router;
