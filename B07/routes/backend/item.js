var express         = require("express");
var router          = express.Router();

const {check, body,validationResult}     = require('express-validator');    


const ItemsModel    = require("./../../schemas/items");
const UtilsHelpers  = require("./../../helpers/Utils");
const paramsHelpers = require("./../../helpers/getParams");
const systemConfig  = require('./../../config/system');
const validateItems = require('../../validations/item')

const pageTitle     = "Item Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/item`;


//Get Form: Add or Edit
router.get("/form(/:id)?",  (req, res, next) => {
  
  let errors = ""; 
  let getId  = paramsHelpers.getParams(req.params, "id", "");
  let data   = {
    _id       : "",
    name      : "",
    ordering  : "",
    status    : ""
  }
  
  if( getId === "" ){ //form Add
    res.render("pages/backend/items/form", {data,  pageTitle  : pageTitleAdd,  errors});
  }else{
     //form Edit
    ItemsModel.findById({_id : getId}).then((data) =>{
      res.render("pages/backend/items/form", { data, pageTitle  : pageTitleEdit,errors});
    });
  }
});

// Handle data form 
router.post("/save", validateItems.validatorItems() ,(req, res, next) => {
    let errors = validationResult(req).array();
    let data   = {
      _id       : "",
      name      : "",
      ordering  : "",
      status    : ""
    }
    if (errors.length <= 0) { //not errs
        let item = {
        name     : req.body.name,
        ordering : parseInt(req.body.ordering),
        status   : req.body.status,
      }
      // Save item 
      
      new ItemsModel(item).save().then( () => {
        req.flash('success', "Successfully added new item!", false)
        res.redirect(linksIndex);
      }); 
    }else{ // have err
      console.log(errors.length);
        res.render("pages/backend/items/form", { pageTitle  : pageTitleAdd, data, errors} );
      //  next()
    }

});

router.get("/login", (req, res, next) => {
  res.render("pages/frontend/login", { pageTitle: "Login", layout: false });
});

//filter by status
router.get("(/:status)?", (req, res, next) => {
  let ObjWhere        = {};
  let currentStatus   = paramsHelpers.getParams(req.params, "status", "all");
  let keyword         = paramsHelpers.getParams(req.query, "keyword", "");
  let getPageOnURL    = paramsHelpers.getParams(req.query, "page", 1);

  let filterStatus    = UtilsHelpers.filterStatus(currentStatus);
  let panigations     = {
    totalItemsPerpage : 5,
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
        pageTitle: pageTitleList,
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
      req.flash('success' , `Changes status success!`, false);
      res.redirect(linksIndex);
    }
  });

});

//Delete one item
router.get("/delete/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");

  ItemsModel.findOneAndRemove({ _id: id }, (err, result)=> {
    if (err) {
      res.send(err);
    } else {
      req.flash('success' , `Delete entries success!`, false);
      res.redirect(linksIndex);
    }
  });

});

//  Action multil CRUD and change ordering for items
router.post("/action",(req, res, next) => {
  
  let getAction     = req.body.action;
  let getCid        = req.body.cid;
  let getOrdering   = req.body.ordering;
  let count         = 0;        
   
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":
          ItemsModel.updateMany({_id:getCid}, 
            {status:getAction}, function (err, results) {
            if (err){
                console.log(err)
            }
            else{
              count  = results.modifiedCount;
              req.flash('success' , `Change status ${count} entries success!`, false);
              res.redirect(linksIndex);
            }
        });
          break;

      case "inactive":
            ItemsModel.updateMany({_id : getCid}, 
              {status : getAction},  (err, results) =>{
              if (err){
                  console.log(err);
              }
              else{
                count  = results.modifiedCount;
                req.flash('success' , `Change status ${count} entries success!`, false);
                res.redirect(linksIndex);
              }
          });
         break;
        
      case "delete":
            ItemsModel.deleteMany({_id : getCid},(err, results) => {
              if (err){
                  console.log(err);
              }
              else{
                count = results.deletedCount;
                req.flash('success' , `Delete ${count} entries success!`, false);
                res.redirect(linksIndex);
              }
          });
           break;
      case "ordering":
        if (Array.isArray(getCid)) {
           count = getCid.length;
           getCid.forEach((item, index) => {
              ItemsModel.updateOne({_id : item},{ordering: parseInt(getOrdering[index]) },(err, results) => {
              });

            }); 
            req.flash('success' , `Change ordering ${count} entries success!`, false);
            res.redirect(linksIndex);
          }else{

          ItemsModel.updateOne({_id : getCid},{ordering: parseInt(getOrdering) },(err, results) => {
            if (err) {
              console.log(err);
            }else{
             
              req.flash('success' , "Change ordering success!", false);
              res.redirect(linksIndex);
            }
          });   
        }
        break;
    
      default:
        break;
    }
  }
  
});

module.exports = router;
