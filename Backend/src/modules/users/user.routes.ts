import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { notificationController } from "../notifications/notification.controller";
import { notificationService } from "../notifications/notification.service";
import { ArtisFormController } from "../artisform/artisform.controller";
import { artisFormService } from "../artisform/artisform.service";
import { FollowController } from "../follow/follow.controller";
import { CommissionController } from "../commissions/commission.controller";
import { commissionService } from "../commissions/commission.service";
import { ArtworkController } from "../artworks/artwork.controller";
import { artworkService } from "../artworks/artwork.service";

const router = Router();
const UserController = new userController(new userService());
const NotificationController = new notificationController(new notificationService());
const artisFormController = new ArtisFormController(new artisFormService());
const CommissionControllerInstance = new CommissionController(new commissionService());
const artworkController = new ArtworkController(new artworkService());

router.route("/").post(UserController.create).get(UserController.getAll);
router.route("/populated").get(UserController.getAllPopulated);
router.route("/top10").get(UserController.getTop10PopularUsers);
router.route("/search").get(authenticate, UserController.getUserIsActive);

router.route("/me/password").put(authenticate, UserController.changePassword);
router
  .route("/me/notifications")
  .get(authenticate, NotificationController.getNotificationByUserId)
  .put(authenticate, NotificationController.updateReadNotifications);

router
  .route("/me/avatar")
  .put(authenticate, UserController.uploadAvatar)
  .get(UserController.getAvatar);
router
  .route("/me/background")
  .put(authenticate, UserController.uploadBackground)
  .get(UserController.getBackground);

router.route("/me/password/reset").post(UserController.resetPassword);

// ---------- ADMIN ----------
router.route("/count").get(authenticate, authorize(["Admin"]), UserController.getNumberOfUsers);

router.route("/me/profile").put(UserController.updateProfile);

router
  .route("/:id")
  .get(UserController.getById)
  .put(authenticate, UserController.update)
  .delete(authenticate, authorize(["Admin"]), UserController.delete);

router.route("/exist/:email").get(UserController.checkExistEmail);
router.route("/:id/lock").put(authenticate, authorize(["Admin"]), UserController.lockAccount);
router.route("/:id/unlock").put(authenticate, authorize(["Admin"]), UserController.unlockAccount);

router.route("/artis-form").post(artisFormController.createArtisForm);

router.route("/follow/:followingId").post(authenticate, FollowController.followUser);

router.route("/unfollow/:followingId").delete(authenticate, FollowController.unfollowUser);

router.route("/is-following/:followingId").get(authenticate, FollowController.checkFollowing);

router
  .route("/commission/:receiverId")
  .post(authenticate, CommissionControllerInstance.sendCommission);

router.route("/:userId/artworks").get(artworkController.getArtworksByUserId);

export default router;
