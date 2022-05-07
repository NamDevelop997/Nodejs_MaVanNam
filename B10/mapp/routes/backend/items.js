var express         = require("express");
var router          = express.Router();
const util          = require('util');

const {check, body,validationResult}     = require('express-validator');    
const moment        = require('moment');
const { Session }   = require("inspector");

const controllerName= "items";

const UtilsHelpers  = require(__base_app     + "helpers/Utils");
const capitalizeFirstLetterHelpers  = require(__base_app     + "helpers/capitalizeFirstLetter");
const paramsHelpers = require(__base_app     + "helpers/getParams");
const systemConfig  = require(__path_configs +'system');
const validateItems = require(__base_app     +'validations/item');
const notify        = require(__path_configs + 'notify');
const ItemsModel    = require(__path_models  + 'items');

const pageTitle     = capitalizeFirstLetter(controllerName)+ " Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/${controllerName}`;
const folderViewBe  = `pages/backend/${controllerName}/`;
const folderViewFe  = "pages/frontend/";

//Get Form: Add or Edit
router.get("/form(/:id)?",  (req, res, next) => {
  
  let errors  = ""; 
  let getId   = paramsHelpers.getParams(req.params, "id", "");
  let data    = {
    _id       : "",
    name      : "",
    ordering  : "",
    status    : "",
    content   : ""
  }
  
  if( getId === "" ){ //form Add
    res.render(folderViewBe + "form", {data,  pageTitle  : pageTitleAdd,  errors});
  }else{
     //form Edit
      ItemsModel.findById(getId).then((data) =>{
      res.render(folderViewBe + "form", { data, pageTitle  : pageTitleEdit, errors});
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
      status    : "",
      content   : ""
    } 

    let item   = Object.assign(req.body);
    let filter = { name:item.name, status:item.status, ordering: parseInt(item.ordering), content:item.content,
      modified : {
      user_id   : "er32fsdf",
      user_name : "abcd",
      time      : Date.now()
    } };
    
    if(errors.length <= 0){
       if(item.id !== '' && typeof item.id !== undefined){
         //Handler edit
         ItemsModel.update(item.id, filter).then((results)=>{
              req.flash('success' , notify.UPDATE_SUCCESS, false);
              res.redirect(linksIndex);
         });

      }else{
        // Handler add 
       filter = { name:item.name, status:item.status, ordering: parseInt(item.ordering), content:item.content,
        created : {
          user_id   : "dfdfd",
          user_name : "user1",
          time      : Date.now()
         },
        };
        ItemsModel.add(filter).then( () => {
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
  
  let params = {};
  params.ObjWhere        = {};
  params.currentStatus   = paramsHelpers.getParams(req.params, "status", "all");
  params.keyword         = paramsHelpers.getParams(req.query, "keyword", "");
  params.getPageOnURL    = paramsHelpers.getParams(req.query, "page", 1);
  params.field_name      = paramsHelpers.getParams(req.session, "field_name", "name");
  params.get_type_sort   = paramsHelpers.getParams(req.session, "type_sort", "asc");
  params.filterStatusItems  = UtilsHelpers.filterStatusItems(params.currentStatus);
  params.set_type_sort   = (params.get_type_sort==="asc") ? params.set_type_sort = 'desc' : params.set_type_sort = 'asc'; 
  params.sort            = {};
  params.sort[params.field_name] = params.set_type_sort;


  params.panigations     = {
    totalItemsPerpage : 15,
    currentPage       : params.getPageOnURL,
    totalItems        : 1,
    pageRanges        : 3
  };
 
  if (params.currentStatus === "all") {
    if (params.keyword !== "") params.ObjWhere = { name: { $regex: params.keyword, $options: "i" } };
  } else {
    params.ObjWhere = {
      status: params.currentStatus,
      name: { $regex: params.keyword, $options: "i" },
    };
  }

   await ItemsModel.countItems(params.ObjWhere).then((data) => {
         params.panigations.totalItems = data;
    
  });
  
  ItemsModel.listItems(params)
          .then((items) => {
            res.render(`${folderViewBe}list`, {
              pageTitle: pageTitleList,
              items,
              params,
              moment,
            });
          });
  
});

// Update one status
router.get("/change-status/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  let currentStatus  = paramsHelpers.getParams(req.params, "status", "active");

  ItemsModel.changeStatus(id,currentStatus, {task: "update_one_status"}).then((result) => {
        res.send({'result': result, 'linksIndex': linksIndex});
    
  });
});

//Update ordering Ajax 
router.post('/change-ordering-ajax', (req, res, next)=>{
    let cid = req.body.id;
    let getOrdering = req.body.ordering;
    
    ItemsModel.changeOrderingAjax(cid, getOrdering).then((result)=>{
    
      res.send({"message": notify.UPDATE_ORDERING_SUCCESS, "className": "success"});
    });
});

//Delete one item
router.get("/delete/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");

   ItemsModel.delete(id).then((results) => {
    req.flash('success' , notify.DELETE_SUCCESS , false);
    res.redirect(linksIndex);
  });

});

//  Action multil CRUD and change ordering for items
router.post("/action", async(req, res, next) => {
  
  let getAction     = req.body.action;
  let getCid        = req.body.cid;
  let getOrdering   = req.body.ordering;
  let count         = 0;        
  
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":
       
        ItemsModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((result) => {
          count  = result.matchedCount;
                req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                res.redirect(linksIndex);
        });
         break;
      

      case "inactive":
         ItemsModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((result) => {
          console.log(result );
          count  = result.matchedCount;
                req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                res.redirect(linksIndex);
        });
         break;
        
      case "delete":
          ItemsModel.delete(getCid).then((results) => {
          count += results.deletedCount;
          
          req.flash('success' , util.format(notify.DELETE_MULTI_SUCCESS, count), false);
          res.redirect(linksIndex);
          });
           break;
      case "ordering":
          ItemsModel.changeOrdering(getCid, getOrdering).then((results)=>{
            req.flash('success' , util.format(notify.CHANGE_MULTI_ORDERING_SUCCESS, results), false);
            res.redirect(linksIndex);
        });
           
        break;
    
      default:
        break;
    }
  }else{
    req.flash('warning' , notify.ALERT_BULK_ACTION , false);
    res.redirect(linksIndex);
  }
  
});

// Sort
router.get("/sort(/:status)?/:field_name/:type_sort",(req, res, next) => {
 req.session.field_name = paramsHelpers.getParams(req.params, "field_name", "name");
 req.session.type_sort  = paramsHelpers.getParams(req.params, "type_sort", "asc");
 req.session.status     = paramsHelpers.getParams(req.params, "status", "all");

 if(req.session.status !== "all"){
    res.redirect(linksIndex + "/" + req.session.status);
 }
 res.redirect(linksIndex);
 
});
module.exports = router;
