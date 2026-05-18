import { Router } from "express";
import profileController from "../controllers/profile.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../utils/Middlewares/Middleware.js";
import multer from "multer";
import { storage } from "../cloud/cloudConfig.js";
const upload = multer({ storage: storage });

const router = Router();

router.get(
  "/allUsers",
  protect,
  wrapAsync(profileController.getAllUserProfiles),
);

//Profileheader routes.
router.patch("/header",protect, upload.fields([
      { name: "profileHeaderData[profileImage]" },
      { name: "profileHeaderData[bannerImage]" },
    ]), wrapAsync(profileController.updateProfileHeader))

//Skills routes.
router.post("/skills",protect,wrapAsync(profileController.addNewSkill))
router.delete("/skills",protect,wrapAsync(profileController.deleteSkill))

//About routes.
router.patch("/about",protect,wrapAsync(profileController.updateAboutSection))

//Education routes.
router.post("/education",protect,wrapAsync(profileController.addEducation))
router.patch("/education/:id",protect,wrapAsync(profileController.updateEducation))
router.delete("/education/:id",protect,wrapAsync(profileController.deleteEducation))

//Experience routes.
router.post("/experience",protect,wrapAsync(profileController.addExperience))
router.patch("/experience/:id",protect,wrapAsync(profileController.updateExperience))
router.delete("/experience/:id",protect,wrapAsync(profileController.deleteExperience))

router
  .route("/:userId")
  .post(
    protect,
    upload.fields([
      { name: "data[profileImage]" },
      { name: "data[bannerImage]" },
    ]),
    wrapAsync(profileController.createProfile),
  )
  .get(protect, wrapAsync(profileController.getUserProfile))
  .patch(protect, wrapAsync(profileController.updateProfile));

//Get all groups a user has joined route.
router.get(
  "/allgroups",
  protect,
  wrapAsync(profileController.getAllUserGroups),
);

//Delete profile routes.
router.delete("/:userId", protect, wrapAsync(profileController.deleteProfile));

export default router;
