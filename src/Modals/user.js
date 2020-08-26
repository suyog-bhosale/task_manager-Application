const express = require("express");
const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    trim: true,
    requried: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email address in not validate");
      }
    },
  },
  password: {
    trim: true,
    type: String,
    requried: true,
  },
  tokens: [
    {
      token: {
        type: String,
        requried: true,
      },
    },
  ],
  avtar: {
    type: Buffer,
  },
});

//virtual bit
userSchema.virtual("task", {
  ref: "Task", //modal name ''
  localField: "_id",
  foreignField: "owner",
});

//login user !!
userSchema.statics.findByEmailandPassword = async (email, password) => {
  //find user by email
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("unable to loging");
  }
  isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

//auth tokens

userSchema.methods.AuthTokenGenator = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "helloiamrobot");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  // user.Tokens = user.Tokens.concat({ token: token });
  //await user.save()
  return token;
};

//Hiding data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

//password hasing while updatring and creting new user
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});
///delteuser task after user is delete

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });

  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
