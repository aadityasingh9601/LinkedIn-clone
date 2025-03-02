import { Router } from "express";
import userController from "../controllers/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router.get("/checkaccesstoken", wrapAsync(userController.checkTokenCookie));

router.get(
  "/newaccesstoken",

  wrapAsync(userController.generateNewAccessToken)
);

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", wrapAsync(userController.login));

router.delete("/logout", protect, wrapAsync(userController.logout));

export default router;
