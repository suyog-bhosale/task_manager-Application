const express = require("express");
const validator = require("validator");
const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  name: {
    type: String,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    requried: true,
    ref: "User",
  },
});
module.exports = Task;
