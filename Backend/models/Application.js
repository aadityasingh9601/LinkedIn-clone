import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
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
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "uploads.files",
      required: true,
    },
  },
  appliedAt: {
    type: Date,
    default: new Date(),
  },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
