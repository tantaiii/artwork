import { Router } from "express";
import { WithdrawController } from "./withdraw.controller";
import { withdrawService } from "./withdraw.service";

const router = Router();
const withdrawController = new WithdrawController(new withdrawService());

router
    .route("/")
    .get(withdrawController.getAllWithdraws)
    .post(withdrawController.createWithdraw);

router
    .route("/:id/status")
    .put(withdrawController.updateStatus);
export default router;