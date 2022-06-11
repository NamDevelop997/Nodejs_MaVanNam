var express         = require('express');
var router          = express.Router();

const ItemsModel    = require("../../schemas/category");
const GroupsModel   = require("../../schemas/groups");
const UsersModel    = require("../../schemas/users");
const ArticlesModel = require("../../schemas/articles");

const folderViewBe  = 'admin/pages/backend/dashboard/index';



/* GET home page. */
router.get('/', async(req, res, next) => {
  
  let countItems    = 0 ;
  let countGroups   = 0 ;
  let countUsers    = 0 ;
  let countArticles = 0 ;
  await ItemsModel.count({}).then((count) => { //get count Items
    countItems = count;
  });

  await GroupsModel.count({}).then((count) => { //get count Groups
    countGroups = count;
  });
  

  await UsersModel.count({}).then((count) => { //get count Users
    countUsers = count;
  });

  await ArticlesModel.count({}).then((count) => { //get count Users
    countArticles = count;
  });
  res.render(folderViewBe, { pageTitle: 'Dashboard' , countItems, countGroups, countUsers, countArticles});
});





module.exports = router;
