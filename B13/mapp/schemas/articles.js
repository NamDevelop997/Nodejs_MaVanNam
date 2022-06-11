const mongoose = require("mongoose");
const databaseConfig = require(__path_configs +'database');


const schema = new mongoose.Schema({
  name       : String,
  spacecial  : String,
  thumb      : String,
  ordering   : Number,
  status     : String,
  content    : String,
  short_content    : String,
  category   : {
    id  : String,
    name: String,
  },
  created     : {
    user_id   : String,
    user_name : String,
    time      : Date
  },
  modified : {
    user_id   : String,
    user_name : String,
    time      : Date
  }

});

module.exports = mongoose.model(databaseConfig.COLLECTION_ARTICLES, schema);
