import { Router } from "express";
import notiController from "../controllers/notification.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router.get("/", protect, wrapAsync(notiController.getNotifications));

router.patch("/markasread", protect, wrapAsync(notiController.markAsRead));

router.delete("/:id", protect, wrapAsync(notiController.deleteNotifications));

router.delete(
  "/group/:id",
  protect,
  wrapAsync(notiController.deleteGroupNotifications)
);
export default router;
