const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, min: 8 },
  resetPasswordToken: { type: String, default: null },
});

module.exports = mongoose.model("User", UserSchema);
