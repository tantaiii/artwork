import { Router } from "express";
import typeoftopicRoutes from "../../modules/typeoftopics/typeoftopic.routes";

const router = Router();
router.use("/typeoftopics", typeoftopicRoutes);

export default router;
