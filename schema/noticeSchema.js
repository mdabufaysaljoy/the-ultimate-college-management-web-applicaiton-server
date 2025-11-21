const { Schema, model } = require("mongoose");

const noticeSchema = new Schema({
  title: String,
  importanceType: String,
  description: String,
  publishDate: String,
  email: String,
  announcedBy: String,
},{timestamps:true});

const Notice = model("notice", noticeSchema);
module.exports = Notice;
