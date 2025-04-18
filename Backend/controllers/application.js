import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import Profile from "../models/Profile.js";
import { io, userSocketMap } from "../server.js";

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
  });
})();

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
    (j) => j.applicant.toString() === userId.toString()
  );

  if (existingApplication.length > 0) {
    return res.status(400).send("You have already applied to this job");
  } else {
    const newApplication = new Application({
      jobId: jobId,
      applicant: req.user._id,
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
  const allApplications = await Application.find({ jobId: jobId }).populate({
    path: "applicant",
    select: "profile", // Include only the `profile` field in `createdBy`
    populate: {
      path: "profile", // Populate the `profile` field
      select: "headline name profileImage", // Include only `headline` and `name` fields in the `profile`
    },
  });

  console.log(allApplications);

  res.status(200).send(allApplications);
};

const getUserResume = async (req, res) => {
  const { resumeId } = req.params;
  //console.log(resumeId);
  const properResumeId = new mongoose.Types.ObjectId(String(resumeId));
  console.log(properResumeId);

  const file = await bucket.find({ _id: properResumeId }).toArray();
  console.log(file);

  if (!file || file.length === 0) {
    return res.status(404).json({ message: "File not found" });
  }

  res.set("Content-Type", file[0].contentType || "application/pdf");
  res.set("Content-Disposition", `attachment; filename="${file[0].filename}"`);

  // create a stream to read from the bucket
  const downloadStream = bucket.openDownloadStream(properResumeId);

  downloadStream.pipe(res);
  // console.log(downloadStream);

  //res.status(200).send(downloadStream);
};

const markReviewed = async (req, res) => {
  console.log("inside markreviewed");
  const { jobId, id } = req.params;

  const application = await Application.findById(id);
  application.status = "Reviewed";
  await application.save();

  res.send("inside markReviewed");
};

const rejectUserApplication = async (req, res) => {
  console.log("inside rejectUserApplication");
  const { jobId, id } = req.params;
  const currUserId = req.user._id.toString();

  const job = await Job.findById(jobId);
  const application = await Application.findById(id);
  const applicantId = application.applicant.toString();
  console.log("Applicant Id is" + applicantId);

  if (!job.applications.includes(id)) {
    return res
      .status(400)
      .send("You can't reject a user who hasn't applied to the job!");
  }

  if (currUserId === job.postedBy.toString()) {
    await Job.findByIdAndUpdate(jobId, {
      $pull: { applications: id },
    });

    await Application.findByIdAndDelete(id);
  }

  //Add a middleware in application schema so that wheneer a application gets deleted it's corresponding
  //resume also gets deleted from the database from db.uploads.files and db.uploads.chunks like you have done
  //in postSchema.

  //Emit socket event to notify the user that their appication has been rejected.
  const newNoti = new Notification({
    recipient: applicantId,
    sender: job.postedBy.toString(),
    message: "Your application has been rejected!",
    notiType: "job",
  });
  await newNoti.save();

  const socketId = userSocketMap[applicantId];

  io.to(socketId).emit("application-rejected", newNoti);

  res.status(200).send("Application rejected!");
};

export default {
  applyToJob,
  getAllApplications,
  getUserResume,
  markReviewed,
  rejectUserApplication,
};
