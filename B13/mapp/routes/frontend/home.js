var express         = require("express");
var router          = express.Router();
const util          = require('util');

const moment        = require('moment');

const ArticlesModel = require(__path_models  + 'articles');
const folderViewFE  = 'frontend/pages/home/index';
const layoutFE      = `frontend/frontend`;


router.get('/', async (req, res) => {
  let listItemsSpecial    = [];
  let listItemsLatestNews = [];

  await ArticlesModel.listItemsSpecial(null, {task : "list-items-special"}).then((data)=>{
    listItemsSpecial = data;
  });

  await ArticlesModel.listItemsSpecial(null, {task : "list-items-latest-news"}).then((data)=>{
    listItemsLatestNews = data;
  });
  
  res.render(folderViewFE, {
      layout: layoutFE,
      topPost: true,
      listItemsSpecial,
      listItemsLatestNews,
      moment
  })
});

module.exports = router;
