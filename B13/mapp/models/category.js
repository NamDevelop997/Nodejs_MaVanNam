
const CategoryData    = require(__path_schemas + "category");
const notify          = require(__path_configs + 'notify');
const fileHelper      = require(__base_app     + "helpers/file");

module.exports = {

    //For backend
    listCategory: (params, option = null) => {
        return CategoryData.find(params.ObjWhere)
        .select("name status ordering created modified slug thumb")
        .limit(params.panigations.totalItemsPerpage)
        .skip((params.panigations.currentPage - 1) * params.panigations.totalItemsPerpage)
        .sort(params.sort)
    },

    countCategory: (params, option = null)=>{
          return CategoryData.count(params);
    },

    changeStatus: async ( cid, currentStatus, option = null) => {
        let changeStatus   = (currentStatus === "active") ? "inactive": "active";
        let data    = {
            modified  : {
            user_id   : "er32fsdf",
            user_name : "admin",
            time      : Date.now()
            }
        };

        if(option.task == "update_one_status"){
            let result = {cid, changeStatus,
                 notify: {
                    'title': notify.CHANGE_STATUS_SUCCESS,
                    className: "success"
            }};
            data.status    = changeStatus;
            await CategoryData.updateOne({ _id: cid }, data);  
            return result;
        } 
        if(option.task == "update_many_status") {
            data.status    = currentStatus;
            return CategoryData.updateMany({_id : cid}, data);
        };
        
    },

    changeOrdering: async (cid, getOrdering, option = null) => {
        let  count = 0;
        data = {
            ordering  : parseInt(getOrdering), 
            modified  : {
            user_id   : "er32fsdf",
            user_name : "abcd",
            time      : Date.now()
          }};
        if (Array.isArray(cid)) {
            for (let index = 0 ; index < cid.length; index++ ){
              count +=1;
               data.ordering = parseInt(getOrdering[index])
               await CategoryData.updateOne({_id : cid[index]}, data);
            }
            return Promise.resolve((count));
           }else{
               
             return CategoryData.updateOne({_id : cid}, data);
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
            return CategoryData.updateOne({_id : cid}, data); 
           
    },  
    
    delete: async (cid) => {
        let filePath = __path_public +'uploads/category/';
        if (Array.isArray(cid)) {
               for (const key of cid) {
                await CategoryData.findById(key).then((data)=>{
                    fileHelper.removeFile(filePath, data.thumb);
                 });
                   
               }
                return CategoryData.deleteMany({_id : cid});
           }else{
                
              await CategoryData.findById(cid).then((data)=>{
                fileHelper.removeFile(filePath, data.thumb);
               });
           
                return CategoryData.findOneAndRemove({ _id: cid });
           }
        
    },
    add: (filter) => {
        return new CategoryData(filter).save();
    },

    update: (cid, filter) => {
        return CategoryData.updateOne({_id : cid }, filter);
    },

    findById: (cid) =>{
        return  CategoryData.findById({_id : cid});
    },
    //End for backend
    
   // For frontend
   listItemsCategory: (params= null, option= null) =>{
    let filter = {};
    let select = '';
    let sort   = 'desc';

    if( option.task == "items-category-in-menu"){
        filter = {status: 'active'};
        select = 'name thumb slug created.user_name created.time';
    }

    

    return CategoryData
      .find(filter)
      .select(select)
      .sort(sort)
  }
    // End for frontend
    
}

