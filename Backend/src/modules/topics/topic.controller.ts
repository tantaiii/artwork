import { GenericController } from "../../core/controllers/base.controller";
import { topicService } from "./topic.service";
import { ITopic } from "./topic.model";
import { ITypeOfTopic } from "../typeoftopics/typeoftopic.model";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class topicController extends GenericController<ITopic> {
  private TopicService: topicService;
  constructor(topicService: topicService) {
    super(topicService);
    this.TopicService = topicService;
  }
  getAllTopicByTypeOfTopicId = async (req: any, res: any) => {
    try {
      const typeOfTopicId: ITypeOfTopic["_id"] = req.params.typeOfTopicId;
      const topics = await this.TopicService.getAllTopicByTypeOfTopicId(typeOfTopicId);
      res.status(200).json(responseWrapper("success", "Fetched topics successfully", topics));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to fetch topics", error));
    }
  };
  getTopicByTopicId = async (req: any, res: any) => {
    try {
      const topicId: ITopic["_id"] = req.params.topicId;
      const topic = await this.TopicService.getTopicByTopicId(topicId);
      res.status(200).json(responseWrapper("success", "Fetched topic successfully", topic));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to fetch topic", error));
    }
  };

  getAllTopicsByTypeIdWithThreadCountAndLatestThread = async (req: any, res: any) => {
    try {
      const typeOfTopicId: ITypeOfTopic["_id"] = req.params.typeOfTopicId;
      const topics =
        await this.TopicService.getAllTopicsByTypeIdWithThreadCountAndLatestThread(typeOfTopicId);
      res
        .status(200)
        .json(responseWrapper("success", "Fetched topics with details successfully", topics));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to fetch topics with details", error));
    }
  };
}
