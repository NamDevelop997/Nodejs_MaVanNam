var express         = require("express");
var router          = express.Router();

const ItemsModel    = require("./../../schemas/items");
const UtilsHelpers  = require("./../../helpers/Utils");
const paramsHelpers = require("./../../helpers/getParams");
const systemConfig = require('./../../config/system');

/* GET home page. */

router.get("/form", function (req, res, next) {
  res.render("pages/backend/items/form", { pageTitle: "Form items - Add" });
});

router.get("/login", function (req, res, next) {
  res.render("pages/frontend/login", { pageTitle: "Login", layout: false });
});

//filter by status
router.get("(/:status)?", function (req, res, next) {
  let ObjWhere        = {};
  let currentStatus   = paramsHelpers.getParams(req.params, "status", "all");
  let keyword         = paramsHelpers.getParams(req.query, "keyword", "");
  let getPageOnURL    = paramsHelpers.getParams(req.query, "page", 1);

  let filterStatus    = UtilsHelpers.filterStatus(currentStatus);
  let panigations      = {
    totalItemsPerpage : 3,
    currentPage       : getPageOnURL,
    totalItems        : 1,
    pageRanges        : 3
  };

  if (currentStatus === "all") {
    if (keyword !== "") ObjWhere = { name: { $regex: keyword, $options: "i" } };
  } else {
    ObjWhere = {
      status: currentStatus,
      name: { $regex: keyword, $options: "i" },
    };
  }
   ItemsModel.count(ObjWhere).then((data) => {
    panigations.totalItems = data;
    ItemsModel.find(ObjWhere)
    .limit(panigations.totalItemsPerpage)
    .skip((panigations.currentPage - 1) * panigations.totalItemsPerpage)
    .sort({ ordering: "asc" })
    .then((items) => {
      res.render("pages/backend/items/list", {
        pageTitle: "Items list page",
        items,
        filterStatus,
        currentStatus,
        keyword,
        panigations,
      });
    });
  });

  
});

// update one status
router.get("/change-status/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  let currentStatus  = paramsHelpers.getParams(req.params, "status", "active");
  let changeStatus   = (currentStatus === "active") ? "inactive": "active";
 
  ItemsModel.updateOne({ _id: id }, { status: changeStatus  }, (err, result)=> {
    if (err) {
      res.send(err);
    } else {
      res.redirect(`/${systemConfig.prefix_admin}/item`);
    }
  });

});

module.exports = router;
