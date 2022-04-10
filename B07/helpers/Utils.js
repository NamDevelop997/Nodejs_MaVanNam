const ItemsModel = require("./../schemas/items");

filterStatus = (currentStatus) => {
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

module.exports = {
  filterStatus,
};
