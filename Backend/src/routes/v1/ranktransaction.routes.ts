import { Router } from "express";
import rankTransactionRoute from "../../modules/ranktransaction/ranktransaction.routes";

const router = Router();

router.use("/rank-transaction", rankTransactionRoute);

export default router;
