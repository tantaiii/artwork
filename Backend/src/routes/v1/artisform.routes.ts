import { Router } from 'express';
import artisFormRouter from "../../modules/artisform/artisform.routes"

const router = Router();
router.use("/artis-form", artisFormRouter);

export default router;