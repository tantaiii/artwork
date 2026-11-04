import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { typeoftopicController } from "./typeoftopic.controller";
import { typeoftopicService } from "./typeoftopic.service";

const router = Router();
const TypeOfTopicController = new typeoftopicController(new typeoftopicService());
router
  .route("/")
  .get(authenticate, TypeOfTopicController.getAllTypeOfTopics)
  .post(authenticate, authorize(["Admin"]), TypeOfTopicController.createTypeOfTopic);
export default router;
