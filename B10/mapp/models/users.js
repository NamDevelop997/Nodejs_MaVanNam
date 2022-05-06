
const UsersData     = require(__path_schemas + "users");
const notify        = require(__path_configs + 'notify');

module.exports = {

    listItems: (params, option = null) => {
        return UsersData.find(params.ObjWhere)
        .select("name status ordering created modified group")
        .limit(params.panigations.totalItemsPerpage)
        .skip((params.panigations.currentPage - 1) * params.panigations.totalItemsPerpage)
        .sort(params.sort)
    },

    countItems: (params, option = null)=>{
          return UsersData.count(params);
    },

    changeStatus: async (cid, currentStatus, option = null) => {
        let changeStatus   = (currentStatus === "active") ? "inactive": "active";
        let data    = {
            status: changeStatus,
            modified : {
              user_id   : "er32fsdf",
              user_name : "Founder",
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
           await UsersData.updateOne({ _id: cid }, data);  
           return result;  
        } 
        if(option.task == "update_many_status") {
            data.status    = currentStatus;
            return UsersData.updateMany({_id : cid}, data);
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
               await UsersData.updateOne({_id : cid[index]}, data);
            }
            return Promise.resolve((count));
           }else{
             return UsersData.updateOne({_id : cid}, data);
           }
        
        
    }, 
    
    delete: (cid) => {
           if (Array.isArray(cid)) {
                return UsersData.deleteMany({_id : cid});
           }else{
                return UsersData.findOneAndRemove({ _id: cid });
           }
        
    },
    add: (filter) => {
        return new UsersData(filter).save();
    },

    update: (cid, filter) => {
        return UsersData.updateOne({_id : cid }, filter);
    },

    findById: (cid) =>{
        return  UsersData.findById({_id : cid});
    }
    
}

