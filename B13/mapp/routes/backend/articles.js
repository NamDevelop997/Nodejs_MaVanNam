var express         = require("express");
var router          = express.Router();
const util          = require('util');

const moment        = require('moment');


const controllerName   = "articles";
const ArticlesModel    = require(__path_models  + 'articles');
const CategorysModel   = require(__path_schemas + "category");
const UtilsHelpers     = require(__base_app     + "helpers/Utils");
const capitalizeFirstLetterHelpers  = require(__base_app     + "helpers/capitalizeFirstLetter");
const paramsHelpers    = require(__base_app     + "helpers/getParams");
const systemConfig     = require(__path_configs + 'system');
const validateArticles = require(__base_app     + `validations/${controllerName}`);
const notify           = require(__path_configs + 'notify');
const fileHelper       = require(__base_app     + "helpers/file");
const folderUpload     = __path_public + "uploads/"+ controllerName+ "/";
const fileSizeMB       =  systemConfig.file_size_mb;
const uploadThumb      = fileHelper.uploadHelper('file', folderUpload, 6 , fileSizeMB);

const pageTitle     = capitalizeFirstLetter(controllerName)+" Management - ";
const pageTitleAdd  = pageTitle + "Add";
const pageTitleEdit = pageTitle + "Edit";
const pageTitleList = pageTitle + "List";
const linksIndex    = `/${systemConfig.prefix_admin}/post-manager/${controllerName}`;
const folderViewBe  = `admin/pages/backend/${controllerName}/`;

//Get Form: Add or Edit
router.get("/form(/:id)?", async (req, res, next) => {
  
  let errors  =  req.session.errors; 
  let getId   = paramsHelpers.getParams(req.params, "id", "");
  let data    = {
    _id       : "",
    thumb     : "",
    spacecial : "",
    name      : "",
    ordering  : "",
    status    : "",
    content   : "",
    category : {
      id : "",
      name: ""
    }
  }
  let categoryItems = [];
  await CategorysModel.find({}).select('id name').then((categories) => {
    categoryItems = categories;
  })
 
  if( getId === "" ){ //form Add
    req.session.destroy();
    res.render(folderViewBe + "form", {data,  pageTitle  : pageTitleAdd,  errors, categoryItems, fileSizeMB});
  }else{
     //form Edit
    ArticlesModel.findById(getId).then((data) =>{
      req.session.destroy();
      res.render(folderViewBe + "form", { data, pageTitle  : pageTitleEdit, errors, categoryItems, fileSizeMB});
    });
  }
});


// Handler data form 
router.post("/save", (req, res, next) => {
    uploadThumb (req, res, async (errUpload)=> {
        req.body     = JSON.parse(JSON.stringify(req.body));
        let article  =  Object.assign(req.body);
        let taskCurrent  = (typeof article !==undefined && article.id !=="") ? "edit" : "add";
        let errors       = validateArticles.validator(req, errUpload, taskCurrent);
        let nameCategory = "";
        let categoryItems = [];
        await CategorysModel.findById(article.category).then((data)=>{
          nameCategory = data.name;
        });
        
          
        

        await CategorysModel.find({}).select('id name').then((categorys) => {
          categoryItems = categorys;
          categoryItems.forEach((item,i)=>{
            if(item.id === article.categorys){
               nameCategory = item.name;
            }
          });
        });
        
    
        let filter = { name:article.name, status:article.status, spacecial: article.spacecial, ordering: parseInt(article.ordering), content:article.content,
          category : {id: article.category, name: nameCategory},
          modified  : {
            user_id   : "er32fsdf",
            user_name : "Founder",
            time      : Date.now()
          } };
         
      
        if(errors.length <= 0){
           if(article.id !== '' && typeof article.id !== undefined){ //Handler edit
             
             if(req.file === undefined || req.thumb === ''){ // no update img
              article.avatar = article.img_old;
            }
            else{ //update img
              article.thumb = req.file.filename;
              await fileHelper.removeFile(folderUpload, req.body.img_old);
              filter.thumb = article.thumb;
            }
            await ArticlesModel.update(article.id, filter).then(results => {
               req.flash('success' , notify.UPDATE_SUCCESS, false);
                res.redirect(linksIndex);
              });
    
           }else{ // Handler add 
            
            filter = { name:article.name, status:article.status, spacecial: article.spacecial, ordering: parseInt(article.ordering), content:article.content,
              category : {
                id: article.category,
                name: nameCategory
              },
              created : {
                user_id   : "er32fsdf",
                user_name : "Founder",
                time      : Date.now()
              },
              };
              (req.file.filename !== undefined)? filter.thumb = req.file.filename: filter.thumb = "";
            await ArticlesModel.add(filter).then( () => {
              req.flash('success', notify.ADD_SUCCESS, false)
              res.redirect(linksIndex);
            }); 
          } 
           
        }else{
          // Hander have errors    
          req.session.errors = errors;
          //Delete image when form error
          if(req.file !== undefined) await fileHelper.removeFile(folderUpload, req.file.filename);
          res.redirect(linksIndex + '/form/'+article.id);
        }
  
      })
});
    

//filter by status and page list articles
router.get("(/:status)?",async (req, res, next) => {
  
  let params             = {};
  let categoryID         = paramsHelpers.getParams(req.session, "category_id", "");

  params.ObjWhere        = {};
  params.currentStatus   = paramsHelpers.getParams(req.params, "status", "all");
  params.keyword         = paramsHelpers.getParams(req.query, "keyword", "");
  params.getPageOnURL    = paramsHelpers.getParams(req.query, "page", 1);
  params.field_name      = paramsHelpers.getParams(req.session, "field_name", "name");
  params.get_type_sort   = paramsHelpers.getParams(req.session, "type_sort", "asc");
  params.get_category_name  = paramsHelpers.getParams(req.session, "category_name", "novalue");
  params.get_category_id    = paramsHelpers.getParams(req.session, "category_id", "");

  
  params.set_type_sort   = ( params.get_type_sort==="asc") ?  params.get_type_sort = 'desc' :  params.get_type_sort = 'asc'; 
  params.sort            = {};
  params.sort[ params.field_name]=  params.set_type_sort;
    
  params.filterStatusArticles = UtilsHelpers.filterStatusArticles( params.currentStatus);
  params.panigations     = {
    totalItemsPerpage : 10,
    currentPage       :  params.getPageOnURL,
    totalItems        : 1,
    pageRanges        : 3
  };


  if(params.get_category_id !== "" ){
    params.ObjWhere = {'category.id': params.get_category_id};
  }
  if(params.get_category_id === 'all'){
    params.ObjWhere = {};
  }

  if ( params.currentStatus === "all") {
    if ( params.keyword !== "")  params.ObjWhere = { name: { $regex:  params.keyword, $options: "i" } };
   
  } else {
    params.ObjWhere = {
      status:  params.currentStatus,
      name: { $regex:  params.keyword, $options: "i" },
    };
  }
   if( params.get_category_name !== "novalue" &&  params.get_category_name !==undefined){
    params.ObjWhere = {'category.name':  params.get_category_name,}
  }
  
  let categoryItems = [];
  await CategorysModel.find({}).select('id name').then((categorys) => {
    categoryItems = categorys;
  });
  
  await ArticlesModel.countItems( params.ObjWhere).then((data) => {
    params.panigations.totalItems = data;
    
  });
  
  ArticlesModel.listItems(params)
           .then((data) => {
            res.render(`${folderViewBe}list`, {
              pageTitle: pageTitleList,
              moment,
              data,
              params,
              categoryItems,
              categoryID
            });
          });
  
});

// update one status
router.get("/change-status/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  let currentStatus  = paramsHelpers.getParams(req.params, "status", "active");
  
  ArticlesModel.changeStatus(id,currentStatus, option = {task: "update_one_status"}).then((result)=>{
    res.send({'result': result, 'linksIndex': linksIndex});
  });

});

// update one spacecial
router.get("/change-spacecial/:id/:spacecial",(req, res, next) => {
  let id                = paramsHelpers.getParams(req.params, "id", "");
  let currentSpacecial  = paramsHelpers.getParams(req.params, "spacecial", "yes");
  
  ArticlesModel.changeSpacecial(id,currentSpacecial, option = {task: "update_one_spacecial"}).then((result)=>{
    res.send({'result': result, 'linksIndex': linksIndex});
  });

});

//Update ordering Ajax 
router.post('/change-ordering-ajax', (req, res, next)=>{
  let cid = req.body.id;
  let getOrdering = req.body.ordering;
  
  ArticlesModel.changeOrderingAjax(cid, getOrdering).then((result)=>{
  
    res.send({"message": notify.UPDATE_ORDERING_SUCCESS, "className": "success"});
  });
});

router.post('/change-category-ajax', async (req, res, next)=>{
  let idArticle = req.body.id;
  
  let getIDCategory = req.body.categoryID;
  let categoryName = "";
  await CategorysModel.findById(getIDCategory).then((data)=>{
    categoryName = data.name;
  });
  
  ArticlesModel.changeCategoryAjax(idArticle, getIDCategory, categoryName).then((result)=>{
    res.send({"message": notify.CHANGE_CATEGORY_SUCCESS, "className": "success"});
  });
});

//Delete one articles
router.get("/destroy/:id/:status",(req, res, next) => {
  let id             = paramsHelpers.getParams(req.params, "id", "");
  ArticlesModel.delete(id).then((results) => {
    res.send({"message": notify.DELETE_SUCCESS, "className": "success", id});
  });
});

//  Action multil CRUD and change ordering for articles
router.post("/action",(req, res, next) => {
  
  let getAction     = req.body.action;
  let getCid        = req.body.cid;
  let getOrdering   = req.body.ordering;
  let count         = 0;        
 
  if(getAction !== "" && getCid!== undefined) {
    switch (getAction) {
      case "active":
       
          ArticlesModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((results) => {
            count  = results.matchedCount;
                  req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                  res.redirect(linksIndex);
          });

          break;

      case "inactive":
            ArticlesModel.changeStatus(getCid, getAction, option = {task : "update_many_status"}).then((results) => {
              count  = results.matchedCount;
                    req.flash('success' ,util.format(notify.CHANGE_MULTI_STATUS_SUCCESS, count), false);
                    res.redirect(linksIndex);
            });
         break;
      case "yes":
          ArticlesModel.changeSpacecial(getCid, getAction, option = {task : "update_many_spacecial"}).then((results) => {
            count  = results.matchedCount;
                  req.flash('success' ,util.format(notify.CHANGE_MULTI_SPACECIAL_SUCCESS, count), false);
                  res.redirect(linksIndex);
          });
          break;

      case "no":
            ArticlesModel.changeSpacecial(getCid, getAction, option = {task : "update_many_spacecial"}).then((results) => {
              count  = results.matchedCount;
                    req.flash('success' ,util.format(notify.CHANGE_MULTI_SPACECIAL_SUCCESS, count), false);
                    res.redirect(linksIndex);
            });
            break;
        
      case "delete":
        ArticlesModel.delete(getCid).then((results) => {
          count += results.deletedCount;
          
          req.flash('success' , util.format(notify.DELETE_MULTI_SUCCESS, count), false);
          res.redirect(linksIndex);
          });
           break;
      case "ordering": 
        ArticlesModel.changeOrdering(getCid, getOrdering).then((results)=>{
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


 // Filter Groups 
router.get("/filter-category/:category_id", (req, res, next) => {
  req.session.category_id  = paramsHelpers.getParams(req.params, "category_id", "");
  
  res.redirect(linksIndex);
 });
module.exports = router;
