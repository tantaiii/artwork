import { GenericService } from "../../core/services/base.service";
import typeoftopicModel, { ITypeOfTopic } from "./typeoftopic.model";

export class typeoftopicService extends GenericService<ITypeOfTopic> {
  constructor() {
    super(typeoftopicModel);
  }

  getAllTypeOfTopics = async () => {
    return typeoftopicModel.findAll();
  };

  createTypeOfTopic = async (data: Partial<ITypeOfTopic>) => {
    const newTypeOfTopic = new typeoftopicModel(data as any);
    return newTypeOfTopic.save();
  };
}
