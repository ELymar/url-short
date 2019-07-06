const mongoose = require("mongoose");

const ShortUrlSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
});

const ShortUrl = mongoose.model('ShortUrl', ShortUrlSchema); 
module.exports = ShortUrl; 