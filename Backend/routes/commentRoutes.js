import { Router } from "express";
import commentController from "../controllers/comment.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(protect, wrapAsync(commentController.createComment))
  .get(protect, wrapAsync(commentController.getComments));

router
  .route("/:commentId")
  .patch(protect, wrapAsync(commentController.updateComment))
  .delete(protect, wrapAsync(commentController.deleteComment));

export default router;
