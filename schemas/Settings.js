const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  max: {
    type: Number,
    required: true
  },
  coprime: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
});

const Settings = mongoose.model('Settings', SettingsSchema); 
module.exports = Settings; 