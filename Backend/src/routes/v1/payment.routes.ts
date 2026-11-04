import { Router } from "express";
import paymentRouter from "../../modules/payments/payment.routes";

const router = Router();
router.use("/payments", paymentRouter);

export default router;
