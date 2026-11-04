import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { chatController } from "./chat.controller";
import { chatService } from "./chat.service";
const router = Router();
const ChatController = new chatController(new chatService());

router.route("/").post(ChatController.create).get(ChatController.getAll);
router
  .route("/me")
  .get(authenticate, ChatController.getChatSelf)
  .post(authenticate, ChatController.createChatSelf)
  .put(authenticate, ChatController.markAsReadByUserId);
router.route("/me/other/:id").get(authenticate, ChatController.getChatByMeAndOther);
router
  .route("/:id")
  .get(ChatController.getById)
  .put(authenticate, ChatController.update)
  .delete(authenticate, ChatController.delete);

export default router;
