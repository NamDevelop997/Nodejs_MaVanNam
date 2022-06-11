var express         = require("express");
var router          = express.Router();
const util          = require('util');

const moment        = require('moment');

const ArticlesModel = require(__path_models  + 'articles');
const folderViewFE  = 'frontend/pages/home/index';
const layoutFE      = `frontend/frontend`;


router.get('/', async (req, res) => {
  let listItemsSpecial = [];
  await ArticlesModel.listItemsSpecial().then((data)=>{
    listItemsSpecial = data;
  });

  res.render(folderViewFE, {
      layout: layoutFE,
      topPost: true,
      listItemsSpecial,
      moment
  })
});

module.exports = router;
