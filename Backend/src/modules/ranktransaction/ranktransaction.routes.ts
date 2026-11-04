import { Router } from "express";
import { RankTransactionController } from "./ranktransaction.controller";
import { RankTransactionService } from "./ranktransaction.service";
import { authenticate } from "../../middlewares/authMiddleware";

const rankTransactionController = new RankTransactionController(new RankTransactionService());

const router = Router();

router
  .route("/")
  .post(authenticate, rankTransactionController.upgradeRankForUser)
  .get(authenticate, rankTransactionController.getTransactionByUserID)

router
  .route("/upgrade-to-artist")
  .post(rankTransactionController.create)

export default router;
