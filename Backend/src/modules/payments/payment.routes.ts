import { paymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";

const router = Router();
const paymentController = new PaymentController(new paymentService());

router.route("/qr").post(authenticate, paymentController.getQrCode);
router.route("/accept").put(authenticate, paymentController.acceptPayment);
router.route("/userid").get(authenticate, paymentController.getPaymentbyUserID);
router.route("/").get(authenticate, authorize(["Admin"]), paymentController.getAllPayment);
router
  .route("/this-month")
  .get(authenticate, authorize(["Admin"]), paymentController.getPaymentSuccessIn30days);
export default router;
