
const CategoryData     = require(__path_schemas + "category");
const notify        = require(__path_configs + 'notify');


module.exports = {

    listCategory: (params, option = null) => {
        return CategoryData.find(params.ObjWhere)
        .select("name status ordering created modified slug")
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
    
    delete: (cid) => {
           if (Array.isArray(cid)) {
                return CategoryData.deleteMany({_id : cid});
           }else{
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
    }
    
}

