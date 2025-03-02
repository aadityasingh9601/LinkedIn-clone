import { Router } from "express";
import groupController from "../controllers/group.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../Middleware.js";

const router = Router();

//Create a group route.
router
  .route("/")
  .post(protect, wrapAsync(groupController.createGroup))
  .get(protect, wrapAsync(groupController.searchGroups));

//Updata a group route.
router
  .route("/:id")
  .patch(protect, wrapAsync(groupController.updateGroup))
  .get(protect, wrapAsync(groupController.getAllMembers));

//Search for groups routes.

//Join a group route.
router.post("/:id/join", protect, wrapAsync(groupController.joinGroup));

//Accept request to join group route.
router.post(
  "/:id/requests/:userId/respond",
  protect,
  wrapAsync(groupController.acceptGroupJoinReq)
);

//Admin can remove a user from the group & accept a new user in the group.
//Make someone admin route.
router.patch(
  "/:id/admin:userId",
  protect,
  wrapAsync(groupController.makeAdmin)
);

//Remove someone admin route.
router.patch(
  "/:id/noadmin:userId",
  protect,
  wrapAsync(groupController.removeAdmin)
);

//Leave group route.
router.post("/:id/leave", protect, wrapAsync(groupController.leaveGroup));

//Transfer ownership of a group route.
router.patch(
  "/:id/owner:userId",
  protect,
  wrapAsync(groupController.transferOwnership)
);

//Remove a group member route.
router.patch(
  "/:id/remove:userId",
  protect,
  wrapAsync(groupController.removeMember)
);

//Delete a group route. Handle deletion also, what else gets deleted. Soft delete & Hard delete.
//Remove the association of the group posts from the group route.

router.delete("/:id", protect, wrapAsync(groupController.deleteGroup));

export default router;
