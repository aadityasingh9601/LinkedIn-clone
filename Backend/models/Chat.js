import mongoose from "mongoose";
import Message from "./Message.js";

const { Schema } = mongoose;

const chatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
});

// Delete all messages related to the chat.It's our mongoose middleware.
chatSchema.post("findOneAndDelete", async (chat) => {
  if (chat) {
    await Message.deleteMany({ chatId: chat._id });
  }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
