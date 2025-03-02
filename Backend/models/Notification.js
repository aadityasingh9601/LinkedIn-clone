import mongoose from "mongoose";

const { Schema } = mongoose;

const notiSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  notiType: {
    type: String,
    enum: ["like", "comment", "connection", "groupjoinreq", "job", "response"],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  sentDate: {
    type: Date,
    default: Date.now,
  },
  //Optional, you can also add related documents id or link to, so that user can redirect to it, if he wants.
});

//Now we'll add method so that notifications older than 30 days will get deleted automatically from the database.
// TTL index to delete notifications older than 30 days
notiSchema.index({ sentDate: 1 }, { expireAfterSeconds: 2592000 });

const Notification = mongoose.model("Notification", notiSchema);

export default Notification;
