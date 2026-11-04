import { Router } from "express";
import replyRouter from "../../modules/replycomments/reply.routes";

const router = Router();
router.use("/replies", replyRouter);

export default router;