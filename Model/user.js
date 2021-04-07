const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 25,
  },
  email: {
    type: String,
    required: true,
    min: 10,
    max: 40,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1000,
    // select: false,
  },
  companyID: {
    type: String,
    required: true,
    min: 2,
    max: 25,
  },
  role: {
    type: Number,
    default: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
