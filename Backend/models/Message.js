import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  chatId: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
