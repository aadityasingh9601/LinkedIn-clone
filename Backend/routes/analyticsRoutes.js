import { Router } from "express";
import analyticController from "../controllers/analytic.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

//Log a analytic event, save it in database to use it later.
router.post("/", protect, wrapAsync(analyticController.logEvent));

router.get("/", protect, wrapAsync(analyticController.getAnalyticsData));

//Get analytics data, make sure to create separate routes for these, so as to not consume so much memory at
//once, and keep the concerns separate.

export default router;
