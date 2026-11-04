import { GenericController } from "../../core/controllers/base.controller";
import { typeoftopicService } from "./typeoftopic.service";
import { ITypeOfTopic } from "./typeoftopic.model";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class typeoftopicController extends GenericController<ITypeOfTopic> {
  private TypeOfTopicService: typeoftopicService;
  constructor(typeoftopicService: typeoftopicService) {
    super(typeoftopicService);
    this.TypeOfTopicService = typeoftopicService;
  }
  getAllTypeOfTopics = async (_req: any, res: any) => {
    try {
      const topics = await this.TypeOfTopicService.getAllTypeOfTopics();
      res.json(responseWrapper("success", "Fetched all type of topics successfully", topics));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to fetch type of topics"));
    }
  };

  createTypeOfTopic = async (req: any, res: any) => {
    try {
      const data: Partial<ITypeOfTopic> = req.body;
      const newTopic = await this.TypeOfTopicService.createTypeOfTopic(data);
      res.json(responseWrapper("success", "Created type of topic successfully", newTopic));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to create type of topic"));
    }
  };
}
