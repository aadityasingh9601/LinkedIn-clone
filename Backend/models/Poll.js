import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const pollSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
  voters: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      optionIndex: {
        type: Number,
        required: true,
      },
    },
  ],
  expiresAt: {
    //Take the time like 24 hrs, 7 days, etc from the user and create a date that's current date + time
    //given by the user, and we'll create a TTL that will delete it automatically asa expiry date is reached.
    type: Date,
    required: true,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: () => new Date() },
});

//Create your model.

const Poll = mongoose.model("Poll", pollSchema);

//Create TTL index to delete old polls automatically.
pollSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default Poll;
