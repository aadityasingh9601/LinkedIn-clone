import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      type: String,
      required: true,
    },
  ],
  resume: {
    filename: {
      type: String,
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: "uploads.files",
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["New", "Reviewed"],
    default: "New",
  },
  appliedAt: {
    type: Date,
    default: new Date(),
  },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
