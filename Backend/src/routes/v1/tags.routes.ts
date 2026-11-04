import { Router } from "express";
import tagsRouter from "../../modules/tags/tag.routes";

const router = Router();
router.use("/tags", tagsRouter);

export default router;
