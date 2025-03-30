import { Router } from "express";
import pollController from "../controllers/poll.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router
  .get("/:id", protect, wrapAsync(pollController.getPoll))
  .post("/create", protect, wrapAsync(pollController.createPoll));

export default router;
