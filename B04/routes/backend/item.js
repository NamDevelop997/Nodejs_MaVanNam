var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/Utils");
const paramsHelpers = require("./../../helpers/getParams");

/* GET home page. */

//filter by status
router.get("(/:status)?", function (req, res, next) {
  let ObjWhere = {};
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active');
  let filterStatus  = UtilsHelpers.filterStatus(currentStatus);
  
  if(currentStatus !== 'all') ObjWhere = {status : currentStatus};
  

  ItemsModel.find(ObjWhere).then((items) => {
    res.render("pages/backend/items/list", {
      pageTitle: "Items list page",
      items,
      filterStatus
    });
  });
});



router.get("/login", function (req, res, next) {
  res.render("pages/frontend/login", { pageTitle: "Login", layout: false });
});

router.get("/form", function (req, res, next) {
  res.render("pages/backend/items/form", { pageTitle: "Form items - Add" });
});

module.exports = router;
