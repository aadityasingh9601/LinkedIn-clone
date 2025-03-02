import mongoose from "mongoose";

const { Schema } = mongoose;

const followSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, //Who has followed.
  userFollowed: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, //Who is being followed.
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
