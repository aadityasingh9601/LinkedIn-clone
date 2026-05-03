import { Router } from "express";
import userController from "../controllers/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../utils/Middlewares/Middleware.js";

const router = Router();

router.get(
  "/checkauthstatus",
  protect,
  wrapAsync(userController.checkAuthStatus),
);

router.get("/newaccesstoken", wrapAsync(userController.refreshAccessToken));

router.get("/allLikedPosts", protect, wrapAsync(userController.allLikedPosts));

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", wrapAsync(userController.login));

router.delete("/logout/:userId", protect, wrapAsync(userController.logout));

export default router;
