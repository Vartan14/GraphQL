const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    text: String,
    authorId: String,
});

module.exports = mongoose.model('Post', PostSchema, 'posts');