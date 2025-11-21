const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
    name: String,
    email: String,
    photoURL: String,
    role: String,
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = User;
