const mongoose = require("mongoose");

const rawFileSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true,
    max: 1000,
  },
  s3_path: {
    type: String,
    required: true,
    max: 1000,
  },
  duration: {
    type: Number,
    max: 100,
    default: null,
  },
  size: {
    type: Number,
    max: 100,
    default: null,
  },
  date_time: {
    type: Date,
    default: Date.now,
  },
  incident_files: {
    type: Array,
  },
});

module.exports = mongoose.model("Raw_File", rawFileSchema);
