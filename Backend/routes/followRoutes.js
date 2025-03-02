import { Router } from "express";
import followController from "../controllers/follow.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router({ mergeParams: true });

//We must pass {mergeParams: true} , else our parameters like userId etc, will not reach our routes.

//Followers & Following route.

//Follow a user route.
router
  .route("/:userId")
  .post(protect, wrapAsync(followController.follow))
  .delete(protect, wrapAsync(followController.unfollow));

router.delete(
  "/:followerId/remove",
  protect,
  wrapAsync(followController.removeFollower)
);

router.get(
  "/checkfollow/:userId",
  protect,
  wrapAsync(followController.checkFollow)
);

//We removed the :id part from both of the below routes because followers and following are private to the user
//only, so we can just see who is sending the request from our req.user._id.
router.get("/followers", protect, wrapAsync(followController.allFollowers));

router.get("/following", protect, wrapAsync(followController.allFollowing));

export default router;
