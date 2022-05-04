
const ItemsData     = require(__path_schemas + "items");

module.exports = {

    listItems: (params, option = null) => {
        return ItemsData.find(params.ObjWhere)
        .select("name status ordering created modified")
        .limit(params.panigations.totalItemsPerpage)
        .skip((params.panigations.currentPage - 1) * params.panigations.totalItemsPerpage)
        .sort(params.sort)
    },

    countItems: (params, option = null)=>{
          return ItemsData.count(params);
    },

    changeStatus: ( cid, currentStatus, option = null) => {
        let changeStatus   = (currentStatus === "active") ? "inactive": "active";
        let data    = {
            modified  : {
            user_id   : "er32fsdf",
            user_name : "admin",
            time      : Date.now()
            }
        }
        if(option.task == "update_one_status"){
            data.status    = changeStatus;
            return ItemsData.updateOne({ _id: cid }, data);  
        } 
        if(option.task == "update_many_status") {
            data.status    = currentStatus;
            return ItemsData.updateMany({_id : cid}, data);
        };
        
    },

    changeOrdering: async (cid, getOrdering, option = null) => {
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
               await ItemsData.updateOne({_id : cid[index]}, data);
            }
            return Promise.resolve((count));
           }else{
             return ItemsData.updateOne({_id : cid}, data);
           }
        
        
    }, 
    
    delete: (cid) => {
           if (Array.isArray(cid)) {
                return ItemsData.deleteMany({_id : cid});
           }else{
                return ItemsData.findOneAndRemove({ _id: cid });
           }
        
    },
    add: (filter) => {
        return new ItemsData(filter).save();
    },

    update: (cid, filter) => {
        return ItemsData.updateOne({_id : cid }, filter);
    },

    findById: (cid) =>{
        return  ItemsData.findById({_id : cid});
    }
    
}

