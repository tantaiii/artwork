import { GenericService } from "../../core/services/base.service";
import replyThreadCommentModel, { IReplyThreadComment } from "./reply-thread.model";
import { threadService } from "../threads/thread.service";
import { threadCommentService } from "../forum-comment/forum-comment.service";
import { IThreadComment } from "../forum-comment/forum-comment.model";
import { UserSql } from "../../models/sql";

export class replyThreadCommentService extends GenericService<IReplyThreadComment> {
  constructor() {
    super(replyThreadCommentModel);
  }

  threadService = new threadService();
  threadCommentService = new threadCommentService();

  saveReplyComment = async (data: Partial<IReplyThreadComment> & { commentThreadId?: string }) => {
    try {
      // The Mongoose-era field was named `commentThreadId`; the SQL attribute is
      // `threadCommentId`. Accept either so existing client payloads keep working.
      const threadCommentId = (data.threadCommentId ?? data.commentThreadId) as string;

      const replyComment = new replyThreadCommentModel({
        replyDetail: data.replyDetail,
        replierId: data.replierId,
        threadCommentId,
      } as any);

      const comment = (await this.threadCommentService.getById(
        threadCommentId
      )) as IThreadComment | null;

      if (comment) {
        await this.threadService.updateAmountCommnet(comment.threadId as string);
      }
      return await replyComment.save();
    } catch (error: any) {
      throw new Error(`Save reply comment failed: ${error.message}`);
    }
  };

  getRepliesByCommentThreadId = async (commentId: string) => {
    try {
      if (!commentId) {
        return [];
      }

      const replies = await replyThreadCommentModel.findAll({
        where: { threadCommentId: commentId },
        include: [{ model: UserSql, as: "replier" }],
      });
      return replies || [];
    } catch (err) {
      return [];
    }
  };
}
