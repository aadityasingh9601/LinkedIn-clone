import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  signupDate: {
    type: Date,
    default: new Date(),
  },
  refreshTokens: [],
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
});

//Defining our user model.

const User = mongoose.model("User", userSchema);

export default User;
