const { Schema, model } = require('mongoose');

const noticeSchema = new Schema({
    id: Number,
    title: String,
    type: String,
    badge: String,
    animation: String,
    description: String,
    publishDate: String
})

const Notice = model('notice', noticeSchema);
module.exports = Notice;