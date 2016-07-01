var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// constructor to create schema
var heroSchema = new Schema({
  alias: String,
  first_name: String,
  last_name: String,
  city: String,
  power_name: String
});

// create collection
var Heroes = mongoose.model('Heroes', heroSchema);
module.exports = Heroes;
