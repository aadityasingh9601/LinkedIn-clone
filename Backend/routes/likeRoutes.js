import { Router } from "express";
import likeController from "../controllers/like.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router({ mergeParams: true });
//Make sure to write mergeParams:true, else your parameters will not get sent to the controllers.

router
  .route("/")
  .get(protect, wrapAsync(likeController.getAllLikes))
  .post(protect, wrapAsync(likeController.likePost))
  .delete(protect, wrapAsync(likeController.unlikePost));

router.get("/checklike", protect, wrapAsync(likeController.checkLike));

export default router;
