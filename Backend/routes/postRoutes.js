import { Router } from "express";
import postController from "../controllers/post.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
import post from "../controllers/post.js";
const upload = multer({ storage: storage });

const router = Router();

//Create post route.
router.post(
  "/",
  protect,
  upload.single("postData[media]"),
  wrapAsync(postController.createPost)
);

//Get all posts route.
router.get("/:userId", wrapAsync(postController.allPosts));

router.get("/scheduled/:userId", wrapAsync(postController.allScheduledPosts));

//Get a single post route.
router.get("/:postId", protect, wrapAsync(postController.singlePost));

//Update post route.
router
  .route("/:postId")
  .patch(
    protect,
    upload.single("postData[media]"),
    wrapAsync(postController.updatePost)
  )
  .delete(protect, wrapAsync(postController.deletePost));

export default router;
