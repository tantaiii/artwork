import { Router } from "express";
import conversationRoute from "../../modules/conversations/conversation.routes";
const route = Router();

route.use("/conversations", conversationRoute);

export default route;
