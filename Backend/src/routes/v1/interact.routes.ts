import { Router } from "express";
import interactRouter from "../../modules/interacts/interact.routes";

const router = Router();

router.use("/interacts", interactRouter);

export default router;
