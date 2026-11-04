import { TransactionController } from "./transaction.controller";
import Router from "express";
import { TransactionService } from "./transaction.service";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";

const router = Router();
const transactionController = new TransactionController(new TransactionService());

router
  .route("/")
  .post(authenticate, transactionController.creatTransaction)
  .get(authenticate, authorize(["Admin"]), transactionController.getAllTransactions);
router.route("/sellers").get(authenticate, transactionController.getTransactionsBySellerId);
router.route("/buyers").get(authenticate, transactionController.getTransactionsByBuyerId);
router
  .route("/this-month")
  .get(authenticate, authorize(["Admin"]), transactionController.getTransactionInthisMonth);

router.route("/:id").get(authenticate, transactionController.getTransactionsByArtworkId);

export default router;
