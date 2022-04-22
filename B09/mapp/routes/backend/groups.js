var express         = require("express");
var router          = express.Router();
const util          = require('util');

const {check, body,validationResult}     = require('express-validator');    
const moment        = require('moment');
const { Session }   = require("inspector");


const GroupsModel   = require(__path_schemas + "groups");
const UtilsHelpers  = require(__base_app     + "helpers/Utils");
const paramsHelpers = require(__base_app     + "helpers/getParams");
const systemConfig  = require(__path_configs + 'system');
const validateGroups = require(__base_app     + 'validations/groups');
const notify        = require(__path_configs + 'notify');

const pageTitle     = "Groups Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/manager/groups`;
const folderViewBe  = "pages/backend/groups/";
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
    content   : "",
    group_acp : ""
  }
  
  if( getId === "" ){ //form Add
    res.render(folderViewBe + "form", {data,  pageTitle  : pageTitleAdd,  errors});
  }else{
     //form Edit
    GroupsModel.findById({_id : getId}).then((data) =>{
      res.render(folderViewBe + "form", { data, pageTitle  : pageTitleEdit, errors});
    });
  }
});

// Handle data form 
router.post("/save", validateGroups.validatorGroups() ,(req, res, next) => {
    let errors = validationResult(req).array();
    let data   = {
      _id       : "",
      name      : "",
      ordering  : "",
      status    : "",
      content   : "",
      group_acp : ""
    } 

    let group   = Object.assign(req.body);
    let filter = { name:group.name, status:group.status, ordering: parseInt(group.ordering), content:group.content,
      group_acp : group.group_acp,
      modified  : {
      user_id   : "er32fsdf",
      user_name : "abcd",
      time      : Date.now()
    } };
    
    if(errors.length <= 0){
       if(group.id !== '' && typeof group.id !== undefined){
         //Handler edit
         GroupsModel.updateOne({_id : group.id }, 
                              filter, (err, result)=> {if (err) {
                                          res.send(err);
                                        } else {
                                          req.flash('success' , notify.UPDATE_SUCCESS, false);
                                          res.redirect(linksIndex);
                                        }
         });

      }else{
        // Handler add 
       filter = { name:group.name, status:group.status, ordering: parseInt(group.ordering), content:group.content,
        created : {
          user_id   : "dfdfd",
          user_name : "aaaaaaaa",
          time      : Date.now()
         },
        };
        new GroupsModel(filter).save().then( () => {
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
  let field_name      = paramsHelpers.getParams(req.session, "field_name", "name");
  let get_type_sort   = paramsHelpers.getParams(req.session, "type_sort", "asc");
  let set_type_sort   = (get_type_sort==="asc") ? get_type_sort = 'desc' : get_type_sort = 'asc'; 
  
  let sort            = {};
      sort[field_name]= set_type_sort;
     
  

  let filterStatusGroups    = UtilsHelpers.filterStatusGroups(currentStatus);
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
  if (currentStatus === "lock") {
    ObjWhere = {
      group_acp: 'false',
      name: { $regex: keyword, $options: "i" },
    };
  }
   await GroupsModel.count(ObjWhere).then((data) => {
         panigations.totalItems = data;
    
  });
     GroupsModel.find(ObjWhere)
          .select("name status ordering created modified group_acp")
          .limit(panigations.totalItemsPerpage)
          .skip((panigations.currentPage - 1) * panigations.totalItemsPerpage)
          .sort(sort)
          .then((groups) => {
            res.render(`${folderViewBe}list`, {
              pageTitle: pageTitleList,
              groups,
              filterStatusGroups,
              currentStatus,
              keyword,
              panigations,
              moment,
              set_type_sort,
              field_name,
              
              
            });
          });
  
});

// update one status
router.get("/change-status/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  let currentStatus  = paramsHelpers.getParams(req.params, "status", "active");
  let changeStatus   = (currentStatus === "active") ? "inactive": "active";
  let data    = {
    status: changeStatus,
    modified : {
      user_id   : "er32fsdf",
      user_name : "abcd",
      time      : Date.now()
    }
  }
  
  GroupsModel.updateOne({ _id: id }, data, (err, result)=> {
    if (err) {
      res.send(err);
    } else {
      req.flash('success' , notify.CHANGE_STATUS_SUCCESS, false);
      res.redirect(linksIndex);
    }
  });

});

// Change group ACP
router.get("/change-acp/:id/:acp",(req, res, next) => {
  let id          = paramsHelpers.getParams(req.params, "id", "");
  let currentACP  = paramsHelpers.getParams(req.params, "acp", "true");
  
  let changeACP   = (currentACP === "true") ? "false": "true";
  let data        = {
    group_acp     : changeACP,
    modified      : {
      user_id     : "admin-acp232323",
      user_name   : "admin_acp",
      time        : Date.now()
    }
  }
  
  GroupsModel.updateOne({ _id: id }, data, (err, result)=> {
    if (err) {
      res.send(err);
    } else {
      req.flash('success' , notify.CHANGE_STATUS_SUCCESS, false);
      res.redirect(linksIndex);
    }
  });

});

//Delete one groups
router.get("/delete/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");

  GroupsModel.findOneAndRemove({ _id: id }, (err, result)=> {
    if (err) {
      res.send(err);
    } else {
      req.flash('success' , notify.DELETE_SUCCESS , false);
      res.redirect(linksIndex);
    }
  });

});

//  Action multil CRUD and change ordering for groups
router.post("/action",(req, res, next) => {
  
  let getAction     = req.body.action;
  let getCid        = req.body.cid;
  let getOrdering   = req.body.ordering;
  let count         = 0;        
  let data          = {
                      status: getAction,
                      modified : {
                      user_id   : "er32fsdf",
                      user_name : "abcd",
                      time      : Date.now()
                    }
                }
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":
       
          GroupsModel.updateMany({_id:getCid}, 
            data, function (err, results) {
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
            GroupsModel.updateMany({_id : getCid}, 
              data,  (err, results) =>{
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
            GroupsModel.deleteMany({_id : getCid},(err, results) => {
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
           getCid.forEach((group, index) => {
              GroupsModel.updateOne({_id : group},{ordering: parseInt(getOrdering[index]),  modified : {
                user_id   : "er32fsdf",
                user_name : "abcd",
                time      : Date.now()
              } },(err, results) => {
              });

            }); 
            req.flash('success' , util.format(notify.CHANGE_MULTI_ORDERING_SUCCESS, count), false);
            res.redirect(linksIndex);
          }else{

          GroupsModel.updateOne({_id : getCid},{ordering: parseInt(getOrdering), modified : {
            user_id   : "er32fsdf",
            user_name : "abcd",
            time      : Date.now()
          } },(err, results) => {
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

// Sort
router.get("/sort(/:status)?/:field_name/:type_sort",(req, res, next) => {
 req.session.field_name = paramsHelpers.getParams(req.params, "field_name", "name");
 req.session.type_sort  = paramsHelpers.getParams(req.params, "type_sort", "asc");
 req.session.status     = paramsHelpers.getParams(req.params, "status", "all");
//  console.log(req.session);
 if(req.session.status !== "all"){
    res.redirect(linksIndex + "/" + req.session.status);
 }
 res.redirect(linksIndex);
 
});
module.exports = router;
