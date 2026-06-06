import Job from "../models/Job.js";
import Profile from "../models/Profile.js";
import { JobDataSchema } from "../zodSchema/index.js";

const createJob = async (req, res) => {
  const { jobData } = req.body;
  const result = JobDataSchema.safeParse(jobData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  const newJob = new Job({
    ...jobData,
    postedBy: req.user._id,
  });
  await newJob.save();
  res.status(200).send(newJob);
};

const editJob = async (req, res) => {
  const { id } = req.params;
  const { jobData } = req.body;
  const result = JobDataSchema.safeParse(jobData);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.message,
    });
  }
  const job = await Job.findById(id);
  if (req.user._id.toString() === job.postedBy.toString()) {
    return res.status(403).json({
      message: "Forbidden!",
    });
  }
  const updatedJob = await Job.findByIdAndUpdate(id, { ...jobData });
  res.status(200).json({
    updatedJob: updatedJob,
  });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (req.user._id.toString() === job.postedBy.toString()) {
    return res.status(403).json({
      message: "Forbidden!",
    });
  }
  await job.deleteOne();
  res.status(200).json({ message: "Job deleted successfully!" });
};

const getMyJobs = async (req, res) => {
  const { q } = req.query;
  let fullJobs;
  const currUserProfile = await Profile.findOne({ userId: req.user._id });

  if (q === "saved") {
    const savedJobs = currUserProfile.myJobs.saved;
    fullJobs = await Job.find({ _id: { $in: savedJobs } });
    res.status(200).send(fullJobs);
  }
  if (q === "applied") {
    const appliedJobs = currUserProfile.myJobs.applied;
    fullJobs = await Job.find({ _id: { $in: appliedJobs } });
    res.status(200).send(fullJobs);
  }
  if (q === "myjobpostings") {
    const myJobPostings = await Job.find({ postedBy: req.user._id });
    res.status(200).send(myJobPostings);
  }
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("applications");
  res.status(200).json({
    jobs: jobs,
  });
};

const saveJob = async (req, res) => {
  const { jobId } = req.params;
  const currUserProfile = await Profile.findOne({ userId: req.user._id });
  const savedJobs = currUserProfile.myJobs.saved;
  if (savedJobs.includes(jobId)) {
    //unsave the job from myJobs.
    let idxOfJob = savedJobs.indexOf(jobId);
    currUserProfile.myJobs.saved.splice(idxOfJob, 1);
    await currUserProfile.save();
    res.status(200).send("Unsaved!");
  } else {
    savedJobs.push(jobId);
    await currUserProfile.save();
    res.status(200).send("Job saved successfully!");
  }
};

export default {
  createJob,
  editJob,
  deleteJob,
  getAllJobs,
  getMyJobs,
  saveJob,
};
