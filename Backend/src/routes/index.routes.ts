import { Router } from "express";
import v1UserRoutes from "./v1/user.routes";
import v1RoleRoutes from "./v1/roles.routes";
import v1RankRoutes from "./v1/rank.routes";
import authRouter from "../modules/auth/auth.route";
import v1TagRouter from "./v1/tags.routes";
import v1ArtworkRouter from "./v1/artwork.routes";
import v1CommentRouter from "./v1/comment.routes";
import v1ReplyRouter from "./v1/reply.routes";
import v1MailRoutes from "./v1/mail.routes";
import v1NotificationRoutes from "./v1/notification.routes";
import v1ArtisFormRoutes from "./v1/artisform.routes";
import v1Chat from "./v1/chat.routes";
import v1Message from "./v1/message.routes";
import v1RankTransaction from "./v1/ranktransaction.routes";
import V1Payment from "./v1/payment.routes";
import v1Commission from "./v1/commission.routes";
import v1ReportRoutes from "./v1/report.routes";
import v1Transaction from "./v1/transaction.routes";
import v1TopicRoutes from "./v1/topic.routes";
import v1ThreadRoutes from "./v1/thread.routes";
import v1TypeOfTopicRoutes from "./v1/typeoftopic.routes";
import v1ForumComment from "./v1/comment-thread.routes";
import v1WithdrawRoutes from "./v1/withdraw.routes";
import v1InteractRouter from "./v1/interact.routes";
import v1ConversationRoutes from "./v1/conversation.routes";

const router = Router();

router.use(authRouter);
router.use(
  "/v1",
  v1UserRoutes,
  v1RoleRoutes,
  v1RankRoutes,
  v1TagRouter,
  v1ArtworkRouter,
  v1CommentRouter,
  v1ReplyRouter,
  v1MailRoutes,
  v1NotificationRoutes,
  v1ArtisFormRoutes,
  v1Chat,
  v1Message,
  v1RankTransaction,
  V1Payment,
  v1Commission,
  v1ReportRoutes,
  v1Transaction,
  v1ReportRoutes,
  v1TopicRoutes,
  v1ThreadRoutes,
  v1TypeOfTopicRoutes,
  v1ForumComment,
  v1WithdrawRoutes,
  v1InteractRouter,
  v1ConversationRoutes
);
export default router;
