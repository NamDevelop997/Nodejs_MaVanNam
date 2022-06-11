
const ArticlesData  = require(__path_schemas + "articles");
const notify        = require(__path_configs + 'notify');
const fileHelper    = require(__base_app   + "helpers/file");

module.exports = {

  // For backend
    listItems: (params, option = null) => {
        return ArticlesData.find(params.ObjWhere)
        .select("name status ordering created category modified thumb spacecial")
        .limit(params.panigations.totalItemsPerpage)
        .skip((params.panigations.currentPage - 1) * params.panigations.totalItemsPerpage)
        .sort(params.sort)
    },

    countItems: (params, option = null)=>{
          return ArticlesData.count(params);
    },

    changeStatus: async (cid, currentStatus, option = null) => {
        let changeStatus   = (currentStatus === "active") ? "inactive": "active";
        let data    = {
            status: changeStatus,
            modified : {
              user_id   : "er32fsdf",
              user_id_name : "Founder",
              time      : Date.now()
            }
          }
        if(option.task == "update_one_status"){
            let result = {cid, changeStatus,
                notify: {
                   'title': notify.CHANGE_STATUS_SUCCESS,
                   className: "success"
           }};
           data.status    = changeStatus;
           await ArticlesData.updateOne({ _id: cid }, data);  
           return result;  
        } 
        if(option.task == "update_many_status") {
            data.status    = currentStatus;
            return ArticlesData.updateMany({_id : cid}, data);
        };
        
    },

    changeSpacecial: async (cid, currentSpacecial, option = null) => {
      let changeSpacecial   = (currentSpacecial === "yes") ? "no": "yes";
      let data    = {
          spacecial: changeSpacecial,
          modified : {
            user_id   : "er32fsdf",
            user_name : "Founder",
            time      : Date.now()
          }
        }
      if(option.task == "update_one_spacecial"){
          let result = {cid, changeSpacecial,
              notify: {
                 'title': notify.CHANGE_SPACECIALS_SUCCESS ,
                 className: "success"
         }};
         data.spacecial    = changeSpacecial;
         await ArticlesData.updateOne({ _id: cid }, data);  
         return result;  
      } 
      if(option.task == "update_many_spacecial") {
          data.spacecial    = currentSpacecial;
          return ArticlesData.updateMany({_id : cid}, data);
      };
      
  },

    changeOrdering: async (cid, getOrdering) => {
        let  count = 0;
        data = {
            ordering: parseInt(getOrdering), 
            modified : {
            user_id   : "er32fsdf",
            user_name : "abcd",
            time      : Date.now()
          }};
        if (Array.isArray(cid)) {
            for (let index = 0 ; index < cid.length; index++ ){
               count +=1;
               data.ordering = parseInt(getOrdering[index])
               await ArticlesData.updateOne({_id : cid[index]}, data);
            }
            return Promise.resolve((count));
           }else{
             return ArticlesData.updateOne({_id : cid}, data);
           }
        
        
    }, 
    changeOrderingAjax: (cid, getOrdering) => {
        data = {
            ordering  : parseInt(getOrdering), 
            modified  : {
            user_id   : "er32fsdf",
            user_name : "abcd",
            time      : Date.now()
          }};
            return ArticlesData.updateOne({_id : cid}, data); 
           
    },  
    changeCategoryAjax: (idArticle, idCategory, getCategoryName) => {
      data = {
          category: {
            id  : idCategory,
            name: getCategoryName
          },
          modified  : {
            user_id   : "er32fsdf",
            user_name : "admin",
            time      : Date.now()
        }};
        return ArticlesData.updateOne({_id : idArticle}, data); 
         
  }, 
    
    
    delete: async (cid) => {
      let filePath = __path_public +'uploads/articles/';
        if (Array.isArray(cid)) {
            for (const key of cid) {
              await ArticlesData.findById(key).then((data)=>{
               
                
                  fileHelper.removeFile(filePath, data.avatar);
               });
                 
             }
                return ArticlesData.deleteMany({_id : cid});
        }else{
          await ArticlesData.findById(cid).then((data)=>{
            fileHelper.removeFile(filePath, data.thumb);
           });
                return ArticlesData.findOneAndRemove({ _id: cid });
          }
        
    },
    add: (filter) => {
        return new ArticlesData(filter).save();
    },

    update: (cid, filter) => {
        return ArticlesData.updateOne({_id : cid }, filter);
    },

    findById: (cid) =>{
        return  ArticlesData.findById({_id : cid});
    },
  // end for backend

  // For frontend
    listItemsSpecial: (params= null, option= null) =>{
      let filter = {};
      let select = '';
      let limit  = 4 ;
      let sort   = 'desc';

      if(option.task == "list-items-special"){
          filter = {status: 'active', spacecial: 'yes'};
          select = 'name thumb category.name created.user_name created.time';
      }

      if(option.task == "list-items-latest-news"){
          filter = {status: 'active'};
          select = 'name thumb short_content category.name created.user_name created.time';
    }

      return ArticlesData
        .find(filter)
        .select(select)
        .limit(limit)
        .sort(sort)
    }
  // End for frontend
    
}

