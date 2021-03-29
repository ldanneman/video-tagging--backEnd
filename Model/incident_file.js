const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
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
  raw_file_id: {
    type: String,
    required: true,
    unique: true,
    max: 1000,
  },
  size: {
    type: Number,
    default: null,
    max: 100,
  },
  duration: {
    type: Number,
    default: null,
    max: 100,
  },
  classifier_id: {
    type: Number,
    required: true,
    default: 0,
  },
  tags_for_review: {
    internal_review: {
      reviewer: {
        date_time: { type: Date, default: Date.now },
        flag: { type: Boolean, default: null },
        comments: { type: String, default: null },
      },
      manager_review: {
        date_time: { type: Date, default: Date.now },
        flag: { type: Boolean, default: null },
        comments: { type: String, default: null },
      },
    },
    client_review: {
      date_time: { type: Date, default: Date.now },
      flag: { type: Boolean, default: null },
      comments: { type: String, default: null },
    },
  },
});

module.exports = mongoose.model("Incident", incidentSchema);
