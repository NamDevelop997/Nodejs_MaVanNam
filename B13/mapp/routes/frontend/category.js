var express         = require("express");
var router          = express.Router();
const util          = require('util');

const moment        = require('moment');

const ArticlesModel = require(__path_models  + 'articles');
const CategoryModel = require(__path_models  + 'category');
const folderViewFE  = 'frontend/pages/lifeStyle/index';
const layoutFE      = `frontend/frontend`;
const paramsHelpers = require(__base_app     + "helpers/getParams");

router.get('/:id', async (req, res) => {
  let getIdCategory       = paramsHelpers.getParams(req.params, "id", "");
  let listCategory        = [];
  let listItemsInCategory = [];

  //Get categories in menu
  await CategoryModel.listItemsCategory(null, {task : "items-category-in-menu"}).then((data)=>{
    listCategory = data;
  });

   //Article in category 
   await ArticlesModel.listItemsCategory({id : getIdCategory}, {task : "items-in-category"}).then((data)=>{
    listItemsInCategory = data;
  });
  console.log(getIdCategory);
  
  console.log(listItemsInCategory);
  
  
  res.render(folderViewFE, {
      title : "test",
      layout: layoutFE,
      layoutStyle: "sidebar-left",
      topPost: false,
      listCategory,
      listItemsInCategory,
      moment
  })
});

module.exports = router;
