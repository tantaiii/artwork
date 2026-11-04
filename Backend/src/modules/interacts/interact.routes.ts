import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { InteractController } from "./interact.controller";
import { InteractService } from "./interact.service";

const router = Router();
const interactService = new InteractService();
const interactController = new InteractController(interactService);

router
  .route("/")
  .get(authenticate, authorize(["Admin"]), interactController.getAllActivities);

export default router;