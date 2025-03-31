import { Router } from "express";
import pollController from "../controllers/poll.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router
  .get("/all", protect, wrapAsync(pollController.getAllPolls))
  .get("/:id", protect, wrapAsync(pollController.getPoll))

  .post("/create", protect, wrapAsync(pollController.createPoll))
  .post("/:id/vote/:optionId", protect, wrapAsync(pollController.voteInPoll));

export default router;
