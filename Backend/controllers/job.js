import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Profile from "../models/Profile.js";

const createJob = async (req, res) => {
  const { jobData } = req.body;

  const newJob = new Job({
    ...jobData,
    postedBy: req.user._id,
  });
  await newJob.save();
  //console.log(newJob);
  res.status(200).send(newJob);
};

const editJob = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const job = await Job.findById(id);
  //console.log(req.user._id, job.postedBy);
  const { jobData } = req.body;

  if (req.user._id.toString() === job.postedBy.toString()) {
    const updatedJob = await Job.findByIdAndUpdate(id, { ...jobData });

    res.status(200).send(updatedJob);
  } else {
    res
      .status(401)
      .send({ message: "You are not the owner of this job listing!" });
    return;
  }
};

const deleteJob = async (req, res) => {
  console.log("Inside deleteJob on the backend!");
  const { id } = req.params;
  const job = await Job.findById(id);
  if (req.user._id.toString() === job.postedBy.toString()) {
    // Add a middleware to delete all the applicants related to this job or decide what to do with the
    //applicantions later after searching on the internet.

    await job.deleteOne();
    res.status(200).send({ message: "Job deleted successfully!" });
  } else {
    res
      .status(401)
      .send({ message: "You are not the owner of this job listing!" });
  }
};

const getMyJobs = async (req, res) => {
  const { q } = req.query;
  console.log(q);
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
    console.log(myJobPostings);

    res.status(200).send(myJobPostings);
  }
};

const getAllJobs = async (req, res) => {
  console.log("inside getalljobs");
  const jobs = await Job.find().populate("applications");
  //console.log(jobs);

  res.status(200).send(jobs);
};

const saveJob = async (req, res) => {
  const { jobId } = req.params;

  const currUserProfile = await Profile.findOne({ userId: req.user._id });

  console.log(currUserProfile.myJobs);

  const savedJobs = currUserProfile.myJobs.saved;

  //If user has already saved the job then--
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
