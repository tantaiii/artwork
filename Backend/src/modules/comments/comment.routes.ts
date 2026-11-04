import { commentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Router } from "express";
import { authenticate } from '../../middlewares/authMiddleware';
import { ReplyController } from "../replycomments/reply.controller";
import { replyCommentService } from "../replycomments/reply.service";

const router = Router();

const commentController = new CommentController(new commentService());
const replyController = new ReplyController(new replyCommentService());

router
    .route("/")
    .get(commentController.getAll)
    .post(authenticate, commentController.saveComment);

router
    .route("/:artworkId")
    .get(commentController.getCommentByArtworkId);

router
    .route("/:commentId/replyComments")
    .post(authenticate, replyController.saveReplyComment);
export default router;
