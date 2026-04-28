import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: {
    type: String,
    default:
      "https://tse4.mm.bing.net/th?id=OIP._pBOCluCuO5MXAp236xmhgHaHw&pid=Api&P=0&h=180",
  },
  companyDescription: { type: String, required: true },
  location: { type: String, required: true },
  jobDescription: { type: String, required: true },
  qualifications: {
    type: [String], //Means this field is an array of strings.
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  skills: {
    type: [String], //Means this field is an array of strings.
    required: true,
  },
  salary: { type: Number, required: true },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    required: true,
  },
  jobMode: {
    type: String,
    enum: ["On-site", "Remote"],
    required: true,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postedDate: { type: Date, default: Date.now },
  applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
