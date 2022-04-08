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

//delete one item
router.get("/delete/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  // let currentStatus  = paramsHelpers.getParams(req.params, "status", "all");

  ItemsModel.findOneAndRemove({ _id: id }, (err, result)=> {
    if (err) {
      res.send(err);
    } else {
      res.redirect(`/${systemConfig.prefix_admin}/item`);
    }
  });

});


router.post("/action",(req, res, next) => {
  
  let getAction = req.body.action;
  let getCid    = req.body.cid;
  console.log(getAction);
  
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":
            ItemsModel.updateMany({_id:getCid}, 
              {status:getAction}, function (err, results) {
              if (err){
                  console.log(err)
              }
              else{
                res.redirect(`/${systemConfig.prefix_admin}/item`);
              }
          });
          break;

      case "inactive":
            ItemsModel.updateMany({_id : getCid}, 
              {status : getAction}, function (err, results) {
              if (err){
                  console.log(err)
              }
              else{
                res.redirect(`/${systemConfig.prefix_admin}/item`);
              }
          });
         break;
    
      default:
        break;
    }
  }else{
    res.send("phai chon chuc nang va doi tuong muon thay doi");
  }
  
  
});

module.exports = router;
