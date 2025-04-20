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
    currUser.myJobs.applied.push(job._id);
    await job.save();
    await currUser.save();

    res.status(200).send("Applied successfully");
  }
};

const unapplyFromJob = async (req, res) => {
  const { jobId } = req.params;
  const currUserId = req.user._id;
  const job = await Job.findById(jobId).populate("applications");
  const jobApplications = job.applications;

  const existingApplication = jobApplications?.find(
    (a) => a.applicant.toString() === currUserId.toString()
  );

  const resumePdfId = existingApplication.resume.id;

  if (!existingApplication) {
    return res.status(400).send("U havent' applied yet!");
  }

  //Pull the jobId from applied jobs from user profile also.
  await Profile.findByIdAndUpdate(currUserId, {
    $pull: { "myJobs.applied": jobId },
  });

  //Delete the resume pdf from the database.
  await bucket.delete(resumePdfId);

  //Delete the application also.
  await Application.findByIdAndDelete(existingApplication);

  //Remove the application from job.
  await Job.findByIdAndUpdate(jobId, {
    $pull: { applications: existingApplication },
  });

  res.status(200).send("Unapplied!");
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
  const { jobId, id } = req.params;
  const currUserId = req.user._id.toString();

  const job = await Job.findById(jobId);
  const application = await Application.findById(id);
  const applicantId = application.applicant.toString();
  console.log("Applicant Id is" + applicantId);
  const resumePdfId = application.resume.id;

  if (!job.applications.includes(id)) {
    return res
      .status(400)
      .send("You can't reject a user who hasn't applied to the job!");
  }

  if (currUserId === job.postedBy.toString()) {
    //Use GridFsStorage bucket api to delete the resume pdf from the database,as application gets deleted.
    await bucket.delete(resumePdfId);

    await Job.findByIdAndUpdate(jobId, {
      $pull: { applications: id },
    });

    //Update the status.
    await Profile.findByIdAndUpdate(currUserId, {
      $pull: { "myJobs.applied.status": "Rejected" },
    });

    //Deleted the application
    await Application.findByIdAndDelete(id);

    //Remove the application from job.
    await Job.findByIdAndUpdate(jobId, {
      $pull: { applications: existingApplication },
    });
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

const jobFitStats = async (req, res) => {
  console.log("jobfitrstats");
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await Job.findById(jobId);
  const userProfile = await Profile.findOne({ userId: userId });

  const jobSkills = job.skills;
  const userSkills = userProfile.skills;

  console.log(jobSkills);
  console.log(userSkills);

  let matchedSkills = [];
  let missingSkills = [];

  jobSkills.forEach((s) => {
    if (userSkills.includes(s.trim())) {
      matchedSkills.push(s.trim());
    } else {
      missingSkills.push(s.trim());
    }
  });

  console.log("These are our matched skills", matchedSkills);
  console.log("These are our missing skills", missingSkills);

  const matchedScore = Math.ceil(
    (matchedSkills.length / jobSkills.length) * 100
  );
  console.log(matchedScore);

  res.status(200).send({ matchedScore, missingSkills, matchedSkills });
};

export default {
  applyToJob,
  unapplyFromJob,
  getAllApplications,
  getUserResume,
  markReviewed,
  rejectUserApplication,
  jobFitStats,
};
