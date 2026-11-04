import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { threadController } from "./thread.controller";
import { threadService } from "./thread.service";
import { threadCommentService } from "../forum-comment/forum-comment.service";
import { CommentController } from "../forum-comment/forum-comment.controller";
import { InteractController } from "../interacts/interact.controller";
import { InteractService } from "../interacts/interact.service";

const router = Router();
const ThreadController = new threadController(new threadService());
const threadCommentController = new CommentController(new threadCommentService());
const interactController = new InteractController(new InteractService());

router.route("/").post(authenticate, ThreadController.InsertThread);

router.route("/topic/:topicId").get(authenticate, ThreadController.GetThreadsByTopicId);

router.route("/:threadId/comments").get(threadCommentController.getCommentByThreadId);

router.route("/:threadId").get(authenticate, ThreadController.GetThreadById);

router.post("/:threadID/like/toggle", authenticate, interactController.toggleLikeForThread);
router.get("/:threadID/like/status", authenticate, interactController.isLikeForThread);
router.get("/:threadID/like/count", interactController.getLikeCountForThread);

export default router;
