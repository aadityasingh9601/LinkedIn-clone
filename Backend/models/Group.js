import mongoose from "mongoose";
import Post from "./Post.js";

const { Schema } = mongoose;

const groupSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  groupName: {
    type: String,
    required: true,
    unique: true,
  },
  groupBanner: {
    type: String,
    default:
      "https://media.istockphoto.com/id/482968725/photo/tea-plantation-landscape.jpg?s=2048x2048&w=is&k=20&c=Uol6346npn3RZapveQRiH8YbjgVJETMy3JIxKvw3crg=",
  },
  description: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
    default: "No rules set",
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  //Storing all postIds of a group will cause the document to bloat and hinder scalability,so to tackle that
  //we're storing the posts separately with the groupId.
  //Do the same thing with members too, store the groupId in each user's myGroups field for the same reason.
  visibility: {
    type: String,
    enum: ["Public", "Private"],
    default: "Public",
  },
  tags: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  joinRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Delete all comments related to the post.It's our mongoose middleware.
groupSchema.post("findOneAndDelete", async (group) => {
  if (group) {
    await Post.deleteMany({ groupId: group._id });
  }
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
