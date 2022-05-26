const ItemsModel = require("../schemas/category");
const GroupsModel= require("../schemas/groups");
const UsersModel = require("../schemas/users");
const ArticlesModel = require("../schemas/articles");


filterStatusCategory = (currentStatus) => {
  let filterStatus = [
    {
      name: "All",
      value: "all",
      count: 1,
      link: "#",
      class: "btn-outline-primary",
    },
    {
      name: "Active",
      value: "active",
      count: 1,
      link: "#",
      class: "btn-outline-success",
    },
    {
      name: "InActive",
      value: "inactive",
      count: 1,
      link: "#",
      class: "btn-outline-warning",
    },
  ];

  let conditions = {};
  filterStatus.forEach((status, index) => {
    if (status.value !== "all") conditions = { status: status.value };
    ItemsModel.count(conditions).then((data) => {
      filterStatus[index].count = data;
    });
    if (
      currentStatus === filterStatus[index].value &&
      currentStatus !== undefined
    ) {
      switch (filterStatus[index].value) {
        case "all":
          filterStatus[index].class = "btn-primary";
          break;
        case "active":
          filterStatus[index].class = "btn-success";
          break;
        case "inactive":
          filterStatus[index].class = "btn-warning";
          break;

        default:
          break;
      }
    }
  });

  return filterStatus;
};

filterStatusGroups = (currentStatus) => {
  let filterStatus = [
    {
      name: "All",
      value: "all",
      count: 1,
      link: "#",
      class: "btn-outline-primary",
    },
    {
      name: "Active",
      value: "active",
      count: 1,
      link: "#",
      class: "btn-outline-success",
    },
    {
      name: "InActive",
      value: "inactive",
      count: 1,
      link: "#",
      class: "btn-outline-warning",
    },

    {
      name: "Lock",
      value: "lock",
      count: 12,
      link: "#",
      class: "btn-outline-secondary",
    },
  ];

  let conditions = {};
  filterStatus.forEach((status, index) => {
    if (status.value !== "all") conditions = { status: status.value };
    if (status.value == "lock") conditions = { group_acp: "false"};
    GroupsModel.count(conditions).then((data) => {
      filterStatus[index].count = data;
    });
    if (
      currentStatus === filterStatus[index].value &&
      currentStatus !== undefined
    ) {
      switch (filterStatus[index].value) {
        case "all":
          filterStatus[index].class = "btn-primary";
          break;
        case "active":
          filterStatus[index].class = "btn-success";
          break;
        case "inactive":
          filterStatus[index].class = "btn-warning";
          break;
        case "lock":
            filterStatus[index].class = "btn-secondary";
            break;

        default:
          break;
      }
    }
  });

  return filterStatus;
};

filterStatusUsers = (currentStatus) => {
  let filterStatus = [
    {
      name: "All",
      value: "all",
      count: 1,
      link: "#",
      class: "btn-outline-primary",
    },
    {
      name: "Active",
      value: "active",
      count: 1,
      link: "#",
      class: "btn-outline-success",
    },
    {
      name: "InActive",
      value: "inactive",
      count: 1,
      link: "#",
      class: "btn-outline-warning",
    },

  ];

  let conditions = {};
  filterStatus.forEach((status, index) => {
    if (status.value !== "all") conditions = { status: status.value };
    if (status.value == "lock") conditions = { group_acp: "false"};
    UsersModel.count(conditions).then((data) => {
      filterStatus[index].count = data;
    });
    if (
      currentStatus === filterStatus[index].value &&
      currentStatus !== undefined
    ) {
      switch (filterStatus[index].value) {
        case "all":
          filterStatus[index].class = "btn-primary";
          break;
        case "active":
          filterStatus[index].class = "btn-success";
          break;
        case "inactive":
          filterStatus[index].class = "btn-warning";
          break;
        case "lock":
            filterStatus[index].class = "btn-secondary";
            break;

        default:
          break;
      }
    }
  });

  return filterStatus;
};

filterStatusArticles = (currentStatus) => {
  let filterStatus = [
    {
      name: "All",
      value: "all",
      count: 1,
      link: "#",
      class: "btn-outline-primary",
    },
    {
      name: "Active",
      value: "active",
      count: 1,
      link: "#",
      class: "btn-outline-success",
    },
    {
      name: "InActive",
      value: "inactive",
      count: 1,
      link: "#",
      class: "btn-outline-warning",
    },

  ];

  let conditions = {};
  filterStatus.forEach((status, index) => {
    if (status.value !== "all") conditions = { status: status.value };
    if (status.value == "lock") conditions = { group_acp: "false"};
    ArticlesModel.count(conditions).then((data) => {
      filterStatus[index].count = data;
    });
    if (
      currentStatus === filterStatus[index].value &&
      currentStatus !== undefined
    ) {
      switch (filterStatus[index].value) {
        case "all":
          filterStatus[index].class = "btn-primary";
          break;
        case "active":
          filterStatus[index].class = "btn-success";
          break;
        case "inactive":
          filterStatus[index].class = "btn-warning";
          break;
        case "lock":
            filterStatus[index].class = "btn-secondary";
            break;

        default:
          break;
      }
    }
  });

  return filterStatus;
};

module.exports = {
  filterStatusCategory,
  filterStatusGroups,
  filterStatusUsers,
  filterStatusArticles
};
