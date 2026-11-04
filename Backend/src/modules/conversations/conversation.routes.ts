import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { conversationController } from "./conversation.controller";
import { conversationService } from "./conversation.service";

const router = Router();
const convService = new conversationService();
const convController = new conversationController(convService);

router
  .route("/")
  .get(authenticate, convController.getUserConversations)
  .post(authenticate, convController.generateImage);

export default router;
