var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/Utils");
const paramsHelpers = require("./../../helpers/getParams");

/* GET home page. */

router.get("/form", function (req, res, next) {
  res.render("pages/backend/items/form", { pageTitle: "Form items - Add" });
});

router.get("/login", function (req, res, next) {
  res.render("pages/frontend/login", { pageTitle: "Login", layout: false });
});

//filter by status
router.get("(/:status)?", function (req, res, next) {
  let ObjWhere = {};
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'all');
  let keyword = paramsHelpers.getParams(req.query, 'keyword', "");
  let filterStatus  = UtilsHelpers.filterStatus(currentStatus);
  
  if(currentStatus === 'all'  ) {
    if(keyword !== '') ObjWhere = {name : { $regex: keyword, $options: "i" }};
  }else {
      ObjWhere = {status : currentStatus, name : { $regex: keyword, $options: "i" }};
  }

  ItemsModel.find(ObjWhere).then((items) => {
    res.render("pages/backend/items/list", {
      pageTitle: "Items list page",
      items,
      filterStatus,
      currentStatus,
      keyword
    });
  });
});

module.exports = router;
