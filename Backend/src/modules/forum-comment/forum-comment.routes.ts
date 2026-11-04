import { threadCommentService } from "./forum-comment.service";
import { CommentController } from "./forum-comment.controller";
import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { ReplyController } from "../replycomments/reply.controller";
import { replyCommentService } from "../replycomments/reply.service";

const router = Router();

const commentController = new CommentController(new threadCommentService());
const replyController = new ReplyController(new replyCommentService());

router.route("/").post(authenticate, commentController.saveComment);

router.route("/:commentId/replyComments").post(authenticate, replyController.saveReplyComment);
export default router;
