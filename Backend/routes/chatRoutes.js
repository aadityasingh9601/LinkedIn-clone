import { Router } from "express";
import chatController from "../controllers/chat.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/createchat/:userId",
  protect,
  wrapAsync(chatController.createChat)
);

router
  .get("/getallchats/:userId", protect, wrapAsync(chatController.getAllChats))
  .get("/getchat/:chatId", protect, wrapAsync(chatController.getSingleChat));

router
  .route("/:chatId")
  .get(protect, wrapAsync(chatController.getAllMsg))
  .post(
    protect,
    upload.single("data[mediaFile]"),
    wrapAsync(chatController.createMsg)
  )
  .delete(protect, wrapAsync(chatController.deleteChat));

router
  .route("/message/:msgId")
  .patch(protect, wrapAsync(chatController.editMsg))
  .delete(protect, wrapAsync(chatController.deleteMsg));

export default router;
