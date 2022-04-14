const mongoose = require("mongoose");
const databaseConfig = require('./../config/database');


const schema = new mongoose.Schema({
  name: String,
  ordering: Number,
  status: String
});

module.exports = mongoose.model(databaseConfig.COLLECTION, schema);
