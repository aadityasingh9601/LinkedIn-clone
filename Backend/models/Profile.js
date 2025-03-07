import mongoose from "mongoose";

const { Schema } = mongoose;

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },

  profileImage: {
    filename: String,
    url: {
      type: String,
      default:
        "https://tse3.mm.bing.net/th?id=OIP.puMo9ITfruXP8iQx9cYcqwHaGJ&pid=Api&P=0&h=180",
    },
  },
  bannerImage: {
    filename: String,
    url: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th?id=OIP.SqkKcPmn7j_ats47Zt8NKAHaCq&pid=Api&P=0&h=180",
    },
  },
  headline: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  contactInfo: {
    phone: {
      type: Number,
    },
    email: {
      type: String,
    },
  },
  location: {
    type: String,
    default: "",
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  connCount: {
    type: Number,
    default: 0,
  },

  skills: [
    {
      type: String,
    },
  ],
  education: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      institution: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      started: Date,
      ended: Date,
    },
  ],
  experience: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      jobTitle: {
        type: String,
        required: true,
      },
      companyName: {
        type: String,
        required: true,
      },
      started: {
        type: Date,
      },
      ended: {
        type: Date,
      },
      description: {
        type: String,
      },
    },
  ],

  chatList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  myJobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  //It'll save groups the user is a member of , that also includes the groups created by the user itself.
  myGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

//Defining our profile model.

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
