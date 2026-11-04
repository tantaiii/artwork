import { Router } from "express";
import { ArtworkController } from "./artwork.controller";
import { artworkService } from "./artwork.service";
import { CommentController } from "../comments/comment.controller";
import { commentService } from "../comments/comment.service";
import { authenticate } from "../../middlewares/authMiddleware";
import { InteractController } from "../interacts/interact.controller";
import { InteractService } from "../interacts/interact.service";
import { authorize } from "../../middlewares/roleMiddleware";

const router = Router();
const artworkController = new ArtworkController(new artworkService());
const commentController = new CommentController(new commentService());

router.get("/top-liked", artworkController.getTop10LikedArtworks);
router.post("/me", authenticate, artworkController.uploadArtwork);

router.route("/").get(artworkController.getByStatus).post(artworkController.create);
router.get("/search", artworkController.getByStatus);

router.route("/:id/totalComments").get(artworkController.countTotalComments);
router.route("/:artworkId/comments").post(authenticate, commentController.saveComment);

// ---------- INTERACT  ----------
const interactController = new InteractController(new InteractService());

router.post("/:artworkID/like/toggle", authenticate, interactController.toggleLike);
router.get("/like", authenticate, interactController.getLikeArtworks);
router.get("/:artworkID/like/status", authenticate, interactController.isLike);
router.get("/:artworkID/like/count", interactController.getLikeCount);

router.post("/:artworkID/favourite/toggle", authenticate, interactController.toggleFavourite);
router.get("/favourite/:userID", authenticate, interactController.getFavouriteArtworks);
router.get("/:artworkID/favourite/status", authenticate, interactController.isFavourite);
router.get("/:artworkID/favourite/count", interactController.getFavouriteCount);

// ---------- ADMIN ----------
router
  .route("/count")
  .get(authenticate, authorize(["Admin"]), artworkController.getNumberOfArtworks);

router
  .route("/:id/status")
  .put(authenticate, authorize(["Admin"]), artworkController.updateStatusArtwork);

// ---------- ID -----------
router
  .route("/:id")
  .get(artworkController.getArtworkPopulated)
  .put(authenticate, artworkController.updateArtwork)
  .delete(authenticate, artworkController.deleteArtwork);

export default router;
