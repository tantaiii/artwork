import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";
import { topicController } from "./topic.controller";
import { topicService } from "./topic.service";

const router = Router();
const TopicController = new topicController(new topicService());

router.route("/").post(authenticate, authorize(["Admin"]), TopicController.create);

router.route("/:topicId").get(authenticate, TopicController.getTopicByTopicId);
router.route("/type/:typeOfTopicId").get(authenticate, TopicController.getAllTopicByTypeOfTopicId);
router
  .route("/type/:typeOfTopicId/with-threads-info")
  .get(authenticate, TopicController.getAllTopicsByTypeIdWithThreadCountAndLatestThread);

export default router;
