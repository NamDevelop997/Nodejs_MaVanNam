var express         = require("express");
var router          = express.Router();
const util          = require('util');

const moment        = require('moment');
const { Session }   = require("inspector");

const controllerName= "groups"
const GroupsModel   = require(__path_models  + 'groups');
const UtilsHelpers  = require(__base_app     + "helpers/Utils");
const capitalizeFirstLetterHelpers  = require(__base_app     + "helpers/capitalizeFirstLetter");
const paramsHelpers = require(__base_app     + "helpers/getParams");
const systemConfig  = require(__path_configs + 'system');
const validateGroups= require(__base_app    + `validations/${controllerName}`);
const notify        = require(__path_configs + 'notify');
const fileHelper    = require(__base_app     + "helpers/file");
const folderUpload  = __path_public + "uploads/"+ controllerName+ "/";
const fileSizeMB    =  systemConfig.file_size_mb;
const uploadThumb   = fileHelper.uploadHelper('file', folderUpload, 6 , fileSizeMB);


const pageTitle     = capitalizeFirstLetter(controllerName)+" Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/manager/${controllerName}`;
const folderViewBe  = `admin/pages/backend/${controllerName}/`;


//Get Form: Add or Edit
router.get("/form(/:id)?",  (req, res, next) => {
  
  let errors  =  req.session.errors; 

  let getId   = paramsHelpers.getParams(req.params, "id", "");
  let data    = {
    _id       : "",
    name      : "",
    ordering  : "",
    status    : "",
    content   : "",
    group_acp : "",
    thumb     : ""
  }
  
  if( getId === "" ){ //form Add
    req.session.destroy();
    res.render(folderViewBe + "form", {data,  pageTitle  : pageTitleAdd,  errors, fileSizeMB});
  }else{
     //form Edit
     req.session.destroy();
      GroupsModel.findById(getId).then((data) =>{
      res.render(folderViewBe + "form", { data, pageTitle  : pageTitleEdit, errors, fileSizeMB});
    });
  }
});

// Handle data form 
router.post("/save",(req, res, next) => {
  uploadThumb(req, res, async (errUpload)=>{
        req.body        = JSON.parse(JSON.stringify(req.body));
        let group       = Object.assign(req.body);
        let taskCurrent = (typeof group !== undefined && group.id !=="") ? "edit" : "add";
        let errors      = validateGroups.validator(req, errUpload,taskCurrent);
        
        let filter = { name:group.name, status:group.status, ordering: parseInt(group.ordering), content:group.content,
          group_acp : group.group_acp,
          modified  : {
          user_id   : "er32fsdf",
          user_name : "Founder",
          time      : Date.now()
        } };
        
        if(errors.length <= 0){
          if(group.id !== '' && typeof group.id !== undefined){
            //Handler edit
            if(req.file === undefined || req.thumb === ''){ // no update img
              group.thumb = group.img_old;
            }
            else{ //update img
              group.thumb = req.file.filename;
              await fileHelper.removeFile(folderUpload, req.body.img_old);
              filter.thumb = group.thumb;
            }
            await GroupsModel.update(group.id, filter).then((result)=>{
                  req.flash('success' , notify.UPDATE_SUCCESS, false);
                  res.redirect(linksIndex);
            });

          }else{
            // Handler add 
          filter = { name:group.name, status:group.status, ordering: parseInt(group.ordering), content:group.content,
            group_acp : group.group_acp,
            created : {
              user_id   : "dfdfd212",
              user_name : "Founder",
              time      : Date.now()
            },
            };
            (req.file.filename !== undefined)? filter.thumb = req.file.filename : filter.thumb = "";
            await GroupsModel.add(filter).then( () => {
              req.flash('success', notify.ADD_SUCCESS, false)
              res.redirect(linksIndex);
            });  
          } 
          
        }else{
          // Hander have errors
          req.session.errors   = errors; 
           //Delete image when form error
          if(req.file !== undefined) await fileHelper.removeFile(folderUpload, req.file.filename);
          res.redirect(linksIndex + "/form/" + group.id);
        }
    });
     
});

//filter by status
router.get("(/:status)?",async (req, res, next) => {
  let params          = {};
  params.ObjWhere        = {};
  params.currentStatus   = paramsHelpers.getParams(req.params, "status", "all");
  params.keyword         = paramsHelpers.getParams(req.query, "keyword", "");
  params.getPageOnURL    = paramsHelpers.getParams(req.query, "page", 1);
  params.field_name      = paramsHelpers.getParams(req.session, "field_name", "name");
  params.get_type_sort   = paramsHelpers.getParams(req.session, "type_sort", "asc");
  params.set_type_sort   = (params.get_type_sort==="asc") ? params.get_type_sort = 'desc' : params.get_type_sort = 'asc'; 
  
  params.sort            = {};
  params.sort[params.field_name] = params.set_type_sort;
     
  

  params.filterStatusGroups    = UtilsHelpers.filterStatusGroups(params.currentStatus);
  params.panigations     = {
    totalItemsPerpage : 15,
    currentPage       : params.getPageOnURL,
    totalItems        : 1,
    pageRanges        : 3
  };

  if (params.currentStatus === "all") {
    if (params.keyword !== "") ObjWhere = { name: { $regex: params.keyword, $options: "i" } };
  } else {
    params.ObjWhere = {
      status: params.currentStatus,
      name: { $regex: params.keyword, $options: "i" },
    };
  }

  if (params.currentStatus === "lock") {
    params.ObjWhere = {
      group_acp: 'false',
      name: { $regex: params.keyword, $options: "i" },
    };
  }
  await GroupsModel.countItems(params.ObjWhere).then((data) => {
    params.panigations.totalItems = data;

});
    GroupsModel.listItems(params)
          .then((groups) => {
            res.render(`${folderViewBe}list`, {
              pageTitle: pageTitleList,
              groups,
              params,
              moment,
            });
          });
  
});

// update one status
router.get("/change-status/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  let currentStatus  = paramsHelpers.getParams(req.params, "status", "active");
  
  GroupsModel.changeStatus(id,currentStatus, option = {task: "update_one_status"}).then((result) => {
    res.send({'result': result, 'linksIndex': linksIndex});

  });

});

// Change group ACP
router.get("/change-acp/:id/:acp",(req, res, next) => {
  let id          = paramsHelpers.getParams(req.params, "id", "");
  let currentACP  = paramsHelpers.getParams(req.params, "acp", "false");
  
  GroupsModel.changeGroups(id, currentACP).then((result) => {
    res.send({'result': result, 'linksIndex': linksIndex});
  });
});


//Update ordering Ajax 
router.post('/change-ordering-ajax', (req, res, next)=>{
  let cid = req.body.id;
  let getOrdering = req.body.ordering;
  
  GroupsModel.changeOrderingAjax(cid, getOrdering).then((result)=>{
  
    res.send({"message": notify.UPDATE_ORDERING_SUCCESS, "className": "success"});
  });
});

//Delete one groups
router.get("/destroy/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  GroupsModel.delete(id).then((results) => {
    res.send({"message": notify.DELETE_SUCCESS, "className": "success", id});
  });
});

//  Action multil CRUD and change ordering for groups
router.post("/action",(req, res, next) => {
  
  let getAction     = req.body.action;
  let getCid        = req.body.cid;
  let getOrdering   = req.body.ordering;
  let count         = 0;        
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":  
        GroupsModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((result) => {
          count  = result.matchedCount;
                req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                res.redirect(linksIndex);
        });
         break;

      case "inactive":
        GroupsModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((result) => {
          count  = result.matchedCount;
                req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                res.redirect(linksIndex);
        });
         break;
        
      case "delete":
        GroupsModel.delete(getCid).then((results) => {
          count += results.deletedCount;
          
          req.flash('success' , util.format(notify.DELETE_MULTI_SUCCESS, count), false);
          res.redirect(linksIndex);
          });
           break;
      case "ordering":
        
        GroupsModel.changeOrdering(getCid, getOrdering).then((results)=>{
          req.flash('success' , util.format(notify.CHANGE_MULTI_ORDERING_SUCCESS, results), false);
          res.redirect(linksIndex);
      });
    
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
