import { replyCommentService } from "./reply.service";
import { replyThreadCommentService } from "../replycommentforum/reply.service";
import { ReplyController } from "./reply.controller";
import { Router } from "express";
// import { authenticate } from '../../middlewares/authMiddleware';
import { ReplyThreadController } from "../replycommentforum/reply-thread.controller";

const router = Router();
const replyController = new ReplyController(new replyCommentService());
const replyThreadController = new ReplyThreadController(new replyThreadCommentService());

router.route("/").get(replyController.getAll).post(replyController.saveReplyComment);

router.route("/:commentId").get(replyController.getRepliesByCommentId);

router.route("/:commentId/thread").get(replyThreadController.getReplyByThreadId);

router.route("/reply-thread").post(replyThreadController.saveReplyThreadComment);

export default router;
