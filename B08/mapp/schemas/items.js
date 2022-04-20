const mongoose = require("mongoose");
const databaseConfig = require(__path_configs +'database');


const schema = new mongoose.Schema({
  name: String,
  ordering: Number,
  status: String
});

module.exports = mongoose.model(databaseConfig.COLLECTION, schema);
