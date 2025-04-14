import Application from "../models/Application.js";
import Job from "../models/Job.js";

const applyToJob = async (req, res) => {
  console.log("inside applyToJob");
  const { jobId } = req.params;
  const { data } = req.body;
  const { filename, id } = req.file;
  const userId = req.user._id;

  const job = await Job.findById(jobId).populate("applications");

  if (job.postedBy.toString() === userId.toString()) {
    return res.status(400).send("You can't apply to a job posted by you!");
  }

  const existingApplication = job.applications.filter(
    (j) => j.applicantId.toString() === userId.toString()
  );
  console.log(existingApplication);

  //   const newApplication = new Application({
  //     jobId: jobId,
  //     applicantId: req.user._id,
  //     answers: data.answers,
  //     resume: {
  //       filename: filename,
  //       resumeId: id,
  //     },
  //   });

  res.status(200).send("Applied successfully");
};

const getAllApplicants = async (req, res) => {
  const { jobId } = req.params;
  console.log(id);
  const allApplicants = await Application.find({ jobId: jobId });
  console.log(allApplicants);
  res.send("inside getallaplicants on backedn");
};

export default {
  applyToJob,
  getAllApplicants,
};
