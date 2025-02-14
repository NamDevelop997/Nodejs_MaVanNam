var express         = require("express");
var router          = express.Router();
const util          = require('util');

const {check, body,validationResult}     = require('express-validator');    


const ItemsModel    = require(__path_schemas + "items");
const UtilsHelpers  = require(__base_app     + "helpers/Utils");
const paramsHelpers = require(__base_app     + "helpers/getParams");
const systemConfig  = require(__path_configs  +'system');
const validateItems = require(__base_app     +'validations/item');
const notify        = require(__path_configs  + 'notify');

const pageTitle     = "Item Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/items`;
const folderViewBe  = "pages/backend/items/";
const folderViewFe  = "pages/frontend/";

//Get Form: Add or Edit
router.get("/form(/:id)?",  (req, res, next) => {
  
  let errors  = ""; 
  let getId   = paramsHelpers.getParams(req.params, "id", "");
  let data    = {
    _id       : "",
    name      : "",
    ordering  : "",
    status    : ""
  }
  
  if( getId === "" ){ //form Add
    res.render(folderViewBe + "form", {data,  pageTitle  : pageTitleAdd,  errors});
  }else{
     //form Edit
    ItemsModel.findById({_id : getId}).then((data) =>{
      res.render(folderViewBe + "form", { data, pageTitle  : pageTitleEdit,errors});
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

    let item   = Object.assign(req.body);
    let filter = { name:item.name, status:item.status, ordering: parseInt(item.ordering)};
    console.log(item.id);
    if(errors.length <= 0){
       if(item.id !== '' && typeof item.id !== undefined){
         //Handler edit
         ItemsModel.updateOne({_id : item.id }, 
                              filter, (err, result)=> {if (err) {
                                          res.send(err);
                                        } else {
                                          req.flash('success' , notify.UPDATE_SUCCESS, false);
                                          res.redirect(linksIndex);
                                        }
         });

      }else{
        // Handler add 
        new ItemsModel(filter).save().then( () => {
          req.flash('success', notify.ADD_SUCCESS, false)
          res.redirect(linksIndex);
        }); 
      } 
       
    }else{
      // Hander have errors
      res.render(`${folderViewBe}form`, { pageTitle  : pageTitleAdd, data, errors} );
    }
     
});

router.get("/login", (req, res, next) => {
  res.render(`${folderViewFe}login`, { pageTitle: "Login", layout: false });
});

//filter by status
router.get("(/:status)?",async (req, res, next) => {
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
   await ItemsModel.count(ObjWhere).then((data) => {
         panigations.totalItems = data;
    
  });
     ItemsModel.find(ObjWhere)
          .limit(panigations.totalItemsPerpage)
          .skip((panigations.currentPage - 1) * panigations.totalItemsPerpage)
          .sort({ name: 1 })
          .then((items) => {
            res.render(`${folderViewBe}list`, {
              pageTitle: pageTitleList,
              items,
              filterStatus,
              currentStatus,
              keyword,
              panigations,
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
      req.flash('success' , notify.CHANGE_STATUS_SUCCESS, false);
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
      req.flash('success' , notify.DELETE_SUCCESS , false);
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
              req.flash('success' , util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
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
                req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
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
                req.flash('success' , util.format(notify.DELETE_MULTI_SUCCESS, count), false);
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
            req.flash('success' , util.format(notify.CHANGE_MULTI_ORDERING_SUCCESS, count), false);
            res.redirect(linksIndex);
          }else{

          ItemsModel.updateOne({_id : getCid},{ordering: parseInt(getOrdering) },(err, results) => {
            if (err) {
              console.log(err);
            }else{
             
              req.flash('success' , notify.CHANGE_ORDERING_MULTI_SUCCESS, false);
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
