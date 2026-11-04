import { GenericService } from "../../core/services/base.service";
import threadModel, { IThread } from "./thread.model";
import { UserSql } from "../../models/sql";

export class threadService extends GenericService<IThread> {
  constructor() {
    super(threadModel);
  }
  GetThreadsByTopicId = async (topicId: string) => {
    const threads = await threadModel.findAll({
      where: { topicId },
      include: [{ model: UserSql, as: "user" }],
    });
    return threads;
  };

  InsertThread = async (data: Partial<IThread>) => {
    const newThread = new threadModel(data as any);
    return newThread.save();
  };

  GetThreadById = async (threadId: string) => {
    const thread = await threadModel.findByPk(threadId, {
      include: [{ model: UserSql, as: "user" }],
    });
    return thread;
  };

  updateAmountCommnet = async (threadId: string) => {
    const thread = await threadModel.findByPk(threadId);
    if (!thread) return null;
    await thread.increment("comments", { by: 1 });
    return thread.reload();
  };
}
