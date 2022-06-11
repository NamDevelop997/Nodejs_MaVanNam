var express         = require("express");
var router          = express.Router();
const util          = require('util');

const moment        = require('moment');

const folderViewFE  = 'frontend/pages/home/index';
const layoutFE      = `frontend/frontend`;


router.get('/', (req, res) => {
  res.render(folderViewFE, {
      layout: layoutFE
  })
});

module.exports = router;
