import { Router } from "express";
import commissionRouter from "../../modules/commissions/commission.routes";

const router = Router();
router.use("/commissions", commissionRouter);

export default router;