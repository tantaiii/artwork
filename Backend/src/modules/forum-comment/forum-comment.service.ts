import { GenericService } from "../../core/services/base.service";
import ThreadCommentModel, { IThreadComment } from "./forum-comment.model";
import { threadService } from "../threads/thread.service";
import { UserSql } from "../../models/sql";

export class threadCommentService extends GenericService<IThreadComment> {
  constructor() {
    super(ThreadCommentModel);
  }
  threadService = new threadService();
  //Functions here

  saveThreadComment = async (data: Partial<IThreadComment>) => {
    try {
      const comment = new ThreadCommentModel({
        ...data,
      } as any);
      await this.threadService.updateAmountCommnet(data.threadId as string);
      return await comment.save();
    } catch (error: any) {
      throw new Error(`Save comment failed: ${error.message}`);
    }
  };
  countTotalComment = async (threadId: string) => {
    try {
      const total = await ThreadCommentModel.count({ where: { threadId } });
      return total;
    } catch (error: any) {
      throw new Error(`Count comments failed: ${error.message}`);
    }
  };

  getCommentsByThreadId = async (threadId: string) => {
    if (!threadId) return [];
    return await ThreadCommentModel.findAll({
      where: { threadId },
      include: [{ model: UserSql, as: "user" }],
    });
  };
}
