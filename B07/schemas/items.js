const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  ordering: Number,
  status: String
});

module.exports = mongoose.model("items", schema);
