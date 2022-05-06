var express         = require("express");
var router          = express.Router();
const util          = require('util');

const {check, body,validationResult}     = require('express-validator');    
const moment        = require('moment');
const { Session }   = require("inspector");
const { group }     = require("console");

const controllerName= "users";
const UsersModel    = require(__path_models  + 'users');
const GroupsModel   = require(__path_schemas + "groups");
const UtilsHelpers  = require(__base_app     + "helpers/Utils");
const capitalizeFirstLetterHelpers  = require(__base_app     + "helpers/capitalizeFirstLetter");
const paramsHelpers = require(__base_app     + "helpers/getParams");
const systemConfig  = require(__path_configs + 'system');
const validateUsers = require(__base_app    + `validations/${controllerName}`);
const notify        = require(__path_configs + 'notify');

const pageTitle     = capitalizeFirstLetter(controllerName)+" Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/manager/${controllerName}`;
const folderViewBe  = `pages/backend/${controllerName}/`;
const folderViewFe  = "pages/frontend/";

//Get Form: Add or Edit
router.get("/form(/:id)?", async (req, res, next) => {
  
  let errors  = ""; 
  let getId   = paramsHelpers.getParams(req.params, "id", "");
  let data    = {
    _id       : "",
    name      : "",
    ordering  : "",
    status    : "",
    content   : "",
    group : {
      id : "",
      name: ""
    }
  }
  let groupsItems = [];
  await GroupsModel.find({}).select('id name').then((groups) => {
    groupsItems = groups;
  })
 
  if( getId === "" ){ //form Add
    res.render(folderViewBe + "form", {data,  pageTitle  : pageTitleAdd,  errors, groupsItems});
  }else{
     //form Edit
    UsersModel.findById(getId).then((data) =>{
      res.render(folderViewBe + "form", { data, pageTitle  : pageTitleEdit, errors, groupsItems});
    });
  }
});

// Handle data form 
router.post("/save", validateUsers.validatorUsers() , async (req, res, next) => {
    let errors = validationResult(req).array();
    let data   = {
      _id       : "",
    name   : "",
    ordering  : "",
    status    : "",
    content   : "",
    group : {
      id : "",
      name: ""
    }
  };
  
    let user   = Object.assign(req.body);
    let nameGroup = "";
   
    let groupsItems = [];
    await GroupsModel.find({}).select('id name').then((groups) => {
      groupsItems = groups;
      groupsItems.forEach((item,i)=>{
        if(item.id === user.groups){
           nameGroup = item.name;
        }
      });
    });
    

    let filter = { name:user.name, status:user.status, ordering: parseInt(user.ordering), content:user.content,
      group : {id: user.groups, name: nameGroup},
      modified  : {
        user_id   : "er32fsdf",
        user_name : "Founder",
        time      : Date.now()
      } };
     
  
    if(errors.length <= 0){
       if(user.id !== '' && typeof user.id !== undefined){ //Handler edit
        
         UsersModel.update(user.id, filter).then(results => {
           req.flash('success' , notify.UPDATE_SUCCESS, false);
            res.redirect(linksIndex);
          });

      }else{ // Handler add 
       
       filter = { name:user.name, status:user.status, ordering: parseInt(user.ordering), content:user.content,
        group : {
          id: user.groups,
          
        },
        created : {
          user_id   : "dfdfd212",
          user_name : "Founder",
          time      : Date.now()
         },
        };
        UsersModel.add(filter).then( () => {
          req.flash('success', notify.ADD_SUCCESS, false)
          res.redirect(linksIndex);
        }); 
      } 
       
    }else{
      // Hander have errors
      res.render(`${folderViewBe}form`, { pageTitle  : pageTitleAdd, data, errors, groupsItems} );
    }
     
});

//filter by status and page list users
router.get("(/:status)?",async (req, res, next) => {
  let params             = {};
  params.ObjWhere        = {};
  params.currentStatus   = paramsHelpers.getParams(req.params, "status", "all");
  params.keyword         = paramsHelpers.getParams(req.query, "keyword", "");
  params.getPageOnURL    = paramsHelpers.getParams(req.query, "page", 1);
  params.field_name      = paramsHelpers.getParams(req.session, "field_name", "name");
  params.get_type_sort   = paramsHelpers.getParams(req.session, "type_sort", "asc");
  params.get_group_name  = paramsHelpers.getParams(req.session, "group_name", "novalue");
  
  params.set_type_sort   = ( params.get_type_sort==="asc") ?  params.get_type_sort = 'desc' :  params.get_type_sort = 'asc'; 
  params.sort            = {};
  params.sort[ params.field_name]=  params.set_type_sort;
    
  params.filterStatusUsers = UtilsHelpers.filterStatusUsers( params.currentStatus);
  params.panigations     = {
    totalItemsPerpage : 10,
    currentPage       :  params.getPageOnURL,
    totalItems        : 1,
    pageRanges        : 3
  };

  if ( params.currentStatus === "all") {
    if ( params.keyword !== "")  params.ObjWhere = { name: { $regex:  params.keyword, $options: "i" } };
   
  } else {
    params.ObjWhere = {
      status:  params.currentStatus,
      name: { $regex:  params.keyword, $options: "i" },
    };
  }
   if( params.get_group_name !== "novalue" &&  params.get_group_name !==undefined){
    params.ObjWhere = {'group.name':  params.get_group_name,}
  }
  
  let groupsItems = [];
  await GroupsModel.find({}).select('id name').then((groups) => {
    
    groupsItems = groups;
  });
  
  await UsersModel.countItems( params.ObjWhere).then((data) => {
    params.panigations.totalItems = data;
    
  });
  
  UsersModel.listItems(params)
           .then((data) => {
            res.render(`${folderViewBe}list`, {
              pageTitle: pageTitleList,
              moment,
              data,
              params,
              groupsItems

            });
          });
  
});

// update one status
router.get("/change-status/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  let currentStatus  = paramsHelpers.getParams(req.params, "status", "active");
  
  UsersModel.changeStatus(id,currentStatus, option = {task: "update_one_status"}).then((result)=>{
    res.send({'result': result, 'linksIndex': linksIndex});
  });

});


//Delete one users
router.get("/delete/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");

  UsersModel.delete(id).then((results) => {
    req.flash('success' , notify.DELETE_SUCCESS , false);
    res.redirect(linksIndex);
  });
});

//  Action multil CRUD and change ordering for users
router.post("/action",(req, res, next) => {
  
  let getAction     = req.body.action;
  let getCid        = req.body.cid;
  let getOrdering   = req.body.ordering;
  let count         = 0;        
 
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":
       
          UsersModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((results) => {
            count  = results.matchedCount;
                  req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                  res.redirect(linksIndex);
          });

          break;

      case "inactive":
            UsersModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((results) => {
              count  = results.matchedCount;
                    req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                    res.redirect(linksIndex);
            });
         break;
        
      case "delete":
        UsersModel.delete(getCid).then((results) => {
          count += results.deletedCount;
          
          req.flash('success' , util.format(notify.DELETE_MULTI_SUCCESS, count), false);
          res.redirect(linksIndex);
          });
           break;
      case "ordering":
        
        UsersModel.changeOrdering(getCid, getOrdering).then((results)=>{
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

// Filter groups for module users
// router.post("/group-filter", (req, res, next)=>{
//   req.session.group_name = req.body.group_name;
//   res.redirect(linksIndex);
  
// });

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
