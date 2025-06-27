import { Router } from "express";
import jobController from "../controllers/job.js";
import applicationController from "../controllers/application.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const pdfStorage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${file.originalname}`;
      const fileInfo = {
        filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage: pdfStorage });

const router = Router();

router.post("/create", protect, wrapAsync(jobController.createJob));

router
  .route("/:id")
  .patch(protect, wrapAsync(jobController.editJob))
  .delete(protect, wrapAsync(jobController.deleteJob));

router

  .get("/alljobs", protect, wrapAsync(jobController.getAllJobs))
  .get("/myjobs", protect, wrapAsync(jobController.getMyJobs))
  .get(
    "/:jobId/applicants",
    protect,
    wrapAsync(applicationController.getAllApplications)
  )
  .get(
    "/resume/:resumeId",
    protect,
    wrapAsync(applicationController.getUserResume)
  )
  .get(
    "/:jobId/jobfitstats",
    protect,
    wrapAsync(applicationController.jobFitStats)
  );

router
  .post(
    "/:jobId/apply",
    upload.single("data[resume]"),
    protect,
    wrapAsync(applicationController.applyToJob)
  )
  .post("/:jobId/save", protect, wrapAsync(jobController.saveJob))
  .post(
    "/:jobId/markReviewed/:id",
    protect,
    wrapAsync(applicationController.markReviewed)
  )
  .delete(
    "/:jobId/unapply",
    protect,
    wrapAsync(applicationController.unapplyFromJob)
  )
  .delete(
    "/:jobId/reject/:id",
    protect,
    wrapAsync(applicationController.rejectUserApplication)
  );

//Respond to a applicant(attach your dm feature to this, they will interact with dm.)
//Add a view full profile & dm button by clicking on the applicant & the applicant can view the full profile
//and dm them if they want to.

export default router;
