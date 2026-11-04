import transactionRoutes from "../../modules/transactions/transaction.routes";
import { Router } from "express";

const router = Router();
router.use("/transactions", transactionRoutes);

export default router;
