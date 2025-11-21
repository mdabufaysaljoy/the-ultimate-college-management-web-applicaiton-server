const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

const contactModel = model("contact", contactSchema);

module.exports = contactModel;
