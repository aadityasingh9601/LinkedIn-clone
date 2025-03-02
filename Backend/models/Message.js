import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  chatId: {
    //The chat group of which this message belongs to.
    type: Schema.Types.ObjectId,
    ref: "Chat",
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  media: {
    mediaType: String,
    url: String,
    filename: String,
  },
  content: {
    type: String,

    default: "",
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
