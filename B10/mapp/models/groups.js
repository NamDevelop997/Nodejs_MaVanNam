
const GroupsData     = require(__path_schemas + "groups");
const notify         = require(__path_configs + 'notify');


module.exports = {

    listItems: (params, option = null) => {
        return GroupsData.find(params.ObjWhere)
        .select("name status ordering created modified group_acp")
        .limit(params.panigations.totalItemsPerpage)
        .skip((params.panigations.currentPage - 1) * params.panigations.totalItemsPerpage)
        .sort(params.sort)
    },

    countItems: async(params, option = null)=>{
          return await  GroupsData.count(params);
    },

    changeStatus: async (cid, currentStatus, option = null) => {
        let changeStatus   = (currentStatus === "active") ? "inactive": "active";
        let data    = {
            modified  : {
            user_id   : "er32fsdf",
            user_name : "admin",
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
           await GroupsData.updateOne({ _id: cid }, data);  
           return result;
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

    changeGroups: async (cid, currentGroup, option = null) => {
        let changeGroup   = (currentGroup === "true") ? "false": "true";
        let data    = {
            modified  : {
            user_id   : "er32fsdf",
            user_name : "admin",
            time      : Date.now()
            }
        }
        let result = {cid, changeGroup,
            notify: {
                'title': notify.CHANGE_GROUPS_SUCCESS,
                className: "success"
           }};
           data.group_acp    = changeGroup;
           await GroupsData.updateOne({ _id: cid }, data);  
           return result;
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

