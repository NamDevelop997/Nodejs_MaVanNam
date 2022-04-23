var express         = require('express');
var router          = express.Router();

const ItemsModel    = require("../../schemas/items");
const GroupsModel    = require("../../schemas/groups");


/* GET home page. */
router.get('/', async(req, res, next) => {
  let countItems = 0 ;
  let countGroups = 0 ;
  await ItemsModel.count({}).then((count) => { //get count Items
    countItems = count;
  });

  await GroupsModel.count({}).then((count) => { //get count Groups
    countGroups = count;
  });
  
  res.render('pages/backend/dashboard/index', { pageTitle: 'Dashboard' , countItems, countGroups });
});





module.exports = router;
