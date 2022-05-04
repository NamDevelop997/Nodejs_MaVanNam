
const GroupsData     = require(__path_schemas + "groups");

module.exports = {

    listItems: (params, option = null) => {
        return GroupsData.find(params.ObjWhere)
        .select("name status ordering created modified group_acp")
        .limit(params.panigations.totalItemsPerpage)
        .skip((params.panigations.currentPage - 1) * params.panigations.totalItemsPerpage)
        .sort(params.sort)
    },

    countItems: (params, option = null)=>{
          return GroupsData.count(params);
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
            return GroupsData.updateOne({ _id: cid }, data);  
        } 
        if(option.task == "update_many_status") {
            data.status    = currentStatus;
            return GroupsData.updateMany({_id : cid}, data);
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
               await GroupsData.updateOne({_id : cid[index]}, data);
            }
            return Promise.resolve((count));
           }else{
             return GroupsData.updateOne({_id : cid}, data);
           }
        
        
    }, 

    changeGroups: ( cid, currentGroup, option = null) => {
        let changeGroup   = (currentGroup === "true") ? "false": "true";
        let data    = {
            modified  : {
            user_id   : "er32fsdf",
            user_name : "admin",
            time      : Date.now()
            }
        }
            data.group_acp    = changeGroup;
            return GroupsData.updateOne({_id: cid }, data);  
    },
    delete: (cid) => {
           if (Array.isArray(cid)) {
                return GroupsData.deleteMany({_id : cid});
           }else{
                return GroupsData.findOneAndRemove({ _id: cid });
           }
        
    },
    add: (filter) => {
        return new GroupsData(filter).save();
    },

    update: (cid, filter) => {
        return GroupsData.updateOne({_id : cid }, filter);
    },

    findById: (cid) =>{
        return  GroupsData.findById({_id : cid});
    }
    
}

