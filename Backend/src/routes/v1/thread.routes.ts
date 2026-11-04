import { Router } from "express";
import threadRoutes from "../../modules/threads/thread.routes";

const router = Router();
router.use("/threads", threadRoutes);

export default router;
