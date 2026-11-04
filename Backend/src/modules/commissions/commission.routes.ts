import { Router } from "express";
import { CommissionController } from "./commission.controller";
import { commissionService } from "./commission.service";

const router = Router();
const commissionController = new CommissionController(new commissionService());

router
    .route("/")
    .get(commissionController.getAll)
    .post(commissionController.saveCommission);

router
    .route("/requestor")
    .get(commissionController.getCommissionByRequestorId);


router
    .route("/receiver/:userId")
    .get(commissionController.getCommissionByRecieverId);

router
    .route("/:commissionId")
    .get(commissionController.getCommissionById);

router
    .route("/:commissionId/reject")
    .put(commissionController.rejectCommissionById);


router
    .route("/:commissionId/accept")
    .put(commissionController.acceptCommissionById);
    
router
    .route("/:commissionId/progress")
    .put(commissionController.updateProgressById);
export default router;