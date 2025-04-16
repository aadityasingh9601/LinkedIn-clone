import Application from "../models/Application.js";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import Profile from "../models/Profile.js";

const conn = mongoose.connection;

const applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const { data } = req.body;
  const { filename, id } = req.file;
  const userId = req.user._id;
  const currUser = await Profile.findOne({ userId: userId });
  const job = await Job.findById(jobId).populate("applications");
  if (job.postedBy.toString() === userId.toString()) {
    return res.status(400).send("You can't apply to a job posted by you!");
  }

  const existingApplication = job.applications.filter(
    (j) => j.applicantId.toString() === userId.toString()
  );

  if (existingApplication.length > 0) {
    return res.status(400).send("You have already applied to this job");
  } else {
    const newApplication = new Application({
      jobId: jobId,
      applicantId: req.user._id,
      answers: data.answers,
      resume: {
        filename: filename,
        id: id,
      },
    });

    await newApplication.save();
    //console.log(newApplication);

    job.applications.push(newApplication);
    currUser.myJobs.push(job._id);
    await job.save();
    await currUser.save();

    res.status(200).send("Applied successfully");
  }
};

const getAllApplications = async (req, res) => {
  const { jobId } = req.params;
  console.log(jobId);
  const allApplications = await Application.find({ jobId: jobId });

  console.log(allApplications);

  res.status(200).send(allApplications);
};

const getUserResume = async (req, res) => {
  console.log("inside getallresume ");
  const { resumeId } = req.params;
  console.log(resumeId);
  res.send(resumeId);
};

export default {
  applyToJob,
  getAllApplications,
  getUserResume,
};
