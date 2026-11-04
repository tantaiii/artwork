import { Router } from "express";
import commentThreadRouter from "../../modules/forum-comment/forum-comment.routes";

const router = Router();

router.use("/comment-threads", commentThreadRouter);
export default router;
