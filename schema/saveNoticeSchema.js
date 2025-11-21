const { Schema, model } = require("mongoose");

const saveNoticeSchema = new Schema(
  {
    email: String,
    noticeId: String,
  },
  { timestamps: true }
);

const saveNotice = model("saveNotice", saveNoticeSchema);

module.exports = saveNotice;
