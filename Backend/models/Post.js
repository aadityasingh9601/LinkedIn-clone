import mongoose from "mongoose";
import Comment from "./Comment.js";
import Like from "./Like.js";
const { Schema } = mongoose;

const postSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  content: {
    type: String,
    required: true,
  },
  media: {
    mediaType: String,
    url: String,
    filename: String,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],
  postType: {
    type: String,
    enum: ["anyone", "connections"],
    required: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Delete all comments related to the post.It's our mongoose middleware.
postSchema.post("findOneAndDelete", async (post) => {
  if (post) {
    await Comment.deleteMany({ postId: post._id });
    await Like.deleteMany({ postId: post._id });
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
