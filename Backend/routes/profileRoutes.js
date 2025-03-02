import { Router } from "express";
import profileController from "../controllers/profile.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload = multer({ storage: storage });

const router = Router();

//We r not using GET requuest here because GET request doesn't support a request body.
router.post(
  "/allUsers",
  protect,
  wrapAsync(profileController.getAllUserProfiles)
);

router
  .route("/:userId")
  .post(
    protect,
    upload.fields([
      { name: "data[profileImage]" },
      { name: "data[bannerImage]" },
    ]),
    wrapAsync(profileController.createProfile)
  )
  .get(protect, wrapAsync(profileController.getUserProfile))
  .patch(protect, wrapAsync(profileController.updateProfile));

//Get all groups a user has joined route.
router.get(
  "/allgroups",
  protect,
  wrapAsync(profileController.getAllUserGroups)
);

//Delete profile routes.
router.delete("/:userId", protect, wrapAsync(profileController.deleteProfile));

export default router;
