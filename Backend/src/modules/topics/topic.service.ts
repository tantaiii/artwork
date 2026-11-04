import { GenericService } from "../../core/services/base.service";
import topicModel, { ITopic } from "./topic.model";
import { ITypeOfTopic } from "../typeoftopics/typeoftopic.model";
import threadModel from "../threads/thread.model";
import { UserSql } from "../../models/sql";

export class topicService extends GenericService<ITopic> {
  constructor() {
    super(topicModel);
  }
  getAllTopicByTypeOfTopicId = async (typeOfTopicId: ITypeOfTopic["_id"]) => {
    return topicModel.findAll({ where: { typeId: typeOfTopicId } });
  };

  getTopicByTopicId = async (topicId: ITopic["_id"]) => {
    return topicModel.findByPk(topicId);
  };

  getAllTopicsByTypeIdWithThreadCountAndLatestThread = async (
    typeOfTopicId: ITypeOfTopic["_id"]
  ) => {
    const topics = await topicModel.findAll({ where: { typeId: typeOfTopicId } });

    const topicsWithDetails = await Promise.all(
      topics.map(async (topic) => {
        const threadCount = await threadModel.count({ where: { topicId: topic._id } });
        const latestThread = await threadModel.findOne({
          where: { topicId: topic._id },
          order: [["dateCreated", "DESC"]],
          include: [{ model: UserSql, as: "user" }],
        });
        return {
          ...topic.toJSON(),
          threadCount,
          latestThread,
        };
      })
    );

    return topicsWithDetails;
  };
}
