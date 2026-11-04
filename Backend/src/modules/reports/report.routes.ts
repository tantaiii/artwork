import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { reportController } from "./report.controller";
import { reportService } from "./report.service";
const router = Router();
const ReportController = new reportController(new reportService());

router
  .route("/")
  .post(authenticate, ReportController.createReport)
  .get(authenticate, ReportController.getAll);

router
  .route("/pending")
  .get(authenticate, authorize(["Admin"]), ReportController.getAllReportPending);

router
  .route("/reviewed")
  .get(authenticate, authorize(["Admin"]), ReportController.getAllReportReviewed);

router
  .route("/:id/reviewed")
  .put(authenticate, authorize(["Admin"]), ReportController.changeStatusReportToReviewed);

export default router;
