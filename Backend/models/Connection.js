import mongoose from "mongoose";

const { Schema } = mongoose;

const connectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, //the user who is sending the request.
  connectedUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, //the user to whom the request is being sent.
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
