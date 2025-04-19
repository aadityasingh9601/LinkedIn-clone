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
    for (let each of job.applicants) {
      const profiles = await Profile.findByIdAndUpdate(each, {
        $pull: { myJobs: id },
      });
      await profiles.save();
    }
    await job.deleteOne();
    res.status(200).send({ message: "Job deleted successfully!" });
  } else {
    res
      .status(401)
      .send({ message: "You are not the owner of this job listing!" });
  }
};

const getMyJobs = async (req, res) => {
  console.log("inside getmyjobs on the backend!");

  const myJobs = await Job.find({ applicants: req.user._id });

  console.log(myJobs);

  res.status(200).send(myJobs);
};

const getAllJobs = async (req, res) => {
  console.log("inside getalljobs");
  const jobs = await Job.find().populate("applications");
  //console.log(jobs);

  res.status(200).send(jobs);
};

export default {
  createJob,
  editJob,
  deleteJob,
  getAllJobs,
  getMyJobs,
};
