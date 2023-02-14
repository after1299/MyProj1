const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    postDate: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
        default: [],
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;