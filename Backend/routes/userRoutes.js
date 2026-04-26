import { Router } from "express";
import userController from "../controllers/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router.get(
  "/checkauthstatus/:userId",
  wrapAsync(userController.checkAuthStatus),
);

router.get("/newaccesstoken", wrapAsync(userController.generateNewAccessToken));

router.get("/allLikedPosts", protect, wrapAsync(userController.allLikedPosts));

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", wrapAsync(userController.login));

router.post("/setup/:userId", protect, wrapAsync(userController.setupAccount));

router.delete("/logout/:userId", protect, wrapAsync(userController.logout));

export default router;
