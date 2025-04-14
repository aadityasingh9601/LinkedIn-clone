import Job from "../models/Job.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

const createJob = async (req, res) => {
  const { jobData } = req.body;

  const newJob = new Job({
    ...jobData,
    postedBy: req.user._id,
  });
  await newJob.save();
  console.log(newJob);
  res.status(200).send(newJob);
};

const editJob = async (req, res) => {
  console.log("inside editjob on the backend.");
  const { id } = req.params;
  console.log(id);
  const job = await Job.findById(id);
  console.log(req.user._id, job.postedBy);
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
  console.log("inside getalljobs on the backend!");

  const jobs = await Job.find().populate("applications");
  console.log(jobs);

  res.status(200).send(jobs);
  // const { jobTitle } = req.body;
  // console.log(jobTitle);
  // const jobs = await Job.find({ title: jobTitle }, { title: 1, location: 1 });
  // if (jobs.length === 0) {
  //   res.status(404).send({ message: "No job listings found!" });
  //   return;
  // } else {
  //   res.status(200).send(jobs);
  // }
};

const isApplied = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  //console.log(job);

  if (job.applicants.includes(req.user._id)) {
    res.status(200).send("yes");
  } else {
    res.status(200).send("no");
  }
};

const unapplyFromJob = async (req, res) => {
  console.log("inside unapplyfrom job on the frontend");
  const { id } = req.params;
  console.log(id);
  const job = await Job.findById(id);
  const currUser = await Profile.findOne({ userId: req.user._id });
  console.log(job.applicants.includes(currUser.userId));

  if (!job.applicants.includes(currUser.userId)) {
    return res.status(404).send("You haven't applied to this");
  } else {
    let idx1 = job.applicants.indexOf(currUser.userId);
    job.applicants.splice(idx1, 1);
    let idx2 = job.applicants.indexOf(job._id);
    currUser.myJobs.splice(idx2, 1);
    await job.save();
    await currUser.save();
    res.status(200).send(job.applicants);
  }
};

export default {
  createJob,
  editJob,
  deleteJob,
  getAllJobs,
  getMyJobs,

  isApplied,
  unapplyFromJob,
};
