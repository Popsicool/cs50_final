const mongoose = require("mongoose")
const Schema = mongoose.Schema
const PostSchema = new Schema({
    title: {
        type: String,
        requied: true,
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: String
    },
    userName: {
        type: String,
        required: true
    }
})

const Post = mongoose.model("Post", PostSchema);
module.exports = Post