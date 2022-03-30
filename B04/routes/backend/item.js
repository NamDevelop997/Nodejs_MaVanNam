var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");

/* GET home page. */

router.get("/", function (req, res, next) {
  ItemsModel.find({}).then((items) => {
    res.render("pages/backend/items/list", {
      pageTitle: "Items list page",
      items,
    });
  });
});

router.get("/login", function (req, res, next) {
  res.render("pages/frontend/login", { pageTitle: "Login", layout: false });
});

router.get("/form", function (req, res, next) {
  res.render("pages/backend/items/form", { pageTitle: "Form items - Add" });
});

module.exports = router;
