import { Router } from "express";
import reportRoutes from "../../modules/reports/report.routes";

const router = Router();
router.use("/reports", reportRoutes);

export default router;
