import { Router } from "express";
import postController from "../controllers/post.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../utils/Middlewares/Middleware.js";
import { singleUpload } from "../cloud/cloudConfig.js";

const router = Router();

//Create post route.
router.post(
  "/",
  protect,
  singleUpload("postData[media]"),
  wrapAsync(postController.createPost),
);

//Get all posts route.
router.get("/:userId", wrapAsync(postController.getPosts));

router.get("/scheduled/:userId", wrapAsync(postController.allScheduledPosts));

router.get("/:postId", protect, wrapAsync(postController.singlePost));

router
  .route("/:postId")
  .patch(
    protect,
    singleUpload("postData[media]"),
    wrapAsync(postController.updatePost),
  )
  .delete(protect, wrapAsync(postController.deletePost));

export default router;
