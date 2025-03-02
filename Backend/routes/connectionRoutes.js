import { Router } from "express";
import connectionController from "../controllers/connection.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

router.post(
  "/checkConn/:userId",
  protect,
  wrapAsync(connectionController.checkConnection)
);

router.post(
  "/respond/:userId",
  protect,
  wrapAsync(connectionController.respondToConnRequest)
);

router.post(
  "/:userId",
  protect,
  wrapAsync(connectionController.sendConnRequest)
);

router.get(
  "/:userId",
  protect,
  wrapAsync(connectionController.getAllConnections)
);

router.delete(
  "/:connectionId",
  protect,
  wrapAsync(connectionController.removeConnection)
);

export default router;
