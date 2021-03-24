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
    date_time: {
      type: Number,
      required: true,
      default: Date.now,
    },
    internal_review: {
      reviewer: {
        flag: { type: Boolean, required: true },
        comments: { type: String },
      },
      manager_review: {
        flag: { type: Boolean, required: true },
        comments: { type: String },
      },
    },
    client_review: {
      flag: { type: Boolean, required: true },
      comments: { type: String },
    },
  },
});

module.exports = mongoose.model("Incident", incidentSchema);
