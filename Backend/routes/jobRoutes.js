import { Router } from "express";
import jobController from "../controllers/job.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router.post("/create", protect, wrapAsync(jobController.createJob));

router
  .route("/:id")
  .patch(protect, wrapAsync(jobController.editJob))
  .delete(protect, wrapAsync(jobController.deleteJob));

router
  .get("/:id/checkapplied", protect, wrapAsync(jobController.isApplied))
  .get("/alljobs", protect, wrapAsync(jobController.getAllJobs))
  .get("/myjobs", protect, wrapAsync(jobController.getMyJobs))
  .get("/:id/applicants", protect, jobController.getAllApplicants);

router
  .post("/:id/apply", protect, wrapAsync(jobController.applyToJob))
  .delete("/:id/unapply", protect, wrapAsync(jobController.unapplyFromJob));

//Respond to a applicant(attach your dm feature to this, they will interact with dm.)
//Add a view full profile & dm button by clicking on the applicant & the applicant can view the full profile
//and dm them if they want to.

export default router;
