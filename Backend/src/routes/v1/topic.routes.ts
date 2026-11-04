import { Router } from "express";
import topicRoutes from "../../modules/topics/topic.routes";
const router = Router();
router.use("/topics", topicRoutes);

export default router;
