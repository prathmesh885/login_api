const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  firstName:String,
  lastName:String,
  email:String,
  password:String,
  mobileNumber:String,
  address:String,
});

module.exports = mongoose.model("user", userSchema);