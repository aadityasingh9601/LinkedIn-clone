import mongoose from "mongoose";

const { Schema } = mongoose;

const analyticsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  triggeredBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
      ); // Truncates time
    },
  },
  eventType: {
    type: String,
    enum: ["profile_view", "search_appearance", "follower", "post_impression"],
    required: true,
  },
  metaData: {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
});

analyticsSchema.index(
  { user: 1, triggeredBy: 1, eventType: 1, date: 1, metadata: { postId: 1 } },
  { unique: true }
);

const Analytic = mongoose.model("Analytic", analyticsSchema);

export default Analytic;
