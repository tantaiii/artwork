import { GenericService } from "../../core/services/base.service";
import replyCommentModel, { IReplyComment } from "./reply.model";
import { UserSql } from "../../models/sql";

export class replyCommentService extends GenericService<IReplyComment> {
  constructor() {
    super(replyCommentModel);
  }

  getRepliesByCommentId = async (commentId: string) => {
    if (!commentId) return [];
    const replies = await replyCommentModel.findAll({
      where: { commentId },
      include: [{ model: UserSql, as: "user" }],
    });
    // Same in-place-populate shape trick as comment.service.ts: put the
    // populated user object back onto `userId` so reply.userId keeps working
    // for the frontend (e.g. Comments.jsx -> reply.userId).
    return replies.map((r) => {
      const plain: any = r.toJSON();
      return { ...plain, userId: plain.user ?? plain.userId };
    });
  };

  saveReplyComment = async (data: Partial<IReplyComment>) => {
    try {
      return await replyCommentModel.create({ ...data } as any);
    } catch (error: any) {
      throw new Error(`Save reply comment failed: ${error.message}`);
    }
  };

  // NOTE: the original Mongoose schema had a `commentThreadId` field linking a
  // reply to a forum "thread-comments" doc, but ArtworkReplySql / the
  // ArtworkReplies table (arthub.sql) has no such column — that concept now
  // lives entirely in the forum domain (domain4-forum.models.ts /
  // replycommentforum module). This method is also effectively dead code:
  // reply.routes.ts's "/:commentId/thread" route is wired to the
  // replycommentforum module's controller, not this one. Kept for signature
  // compatibility; returns an empty array rather than querying a
  // non-existent column.
  getRepliesByCommentThreadId = async (_commentId: string) => {
    return [];
  };
}
