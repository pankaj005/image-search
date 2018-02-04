var mongoose = require('mongoose');

  var ImageSchema = mongoose.Schema({
    name: String,
    images : [],
    searched:Number
  });
  var images = mongoose.model('images', ImageSchema); 
  module.exports.images = images;