import { GenericController } from "../../core/controllers/base.controller";
import { GenericService } from "../../core/services/base.service";
import tagModel, { ITag } from "./tag.model";

const tagService = new GenericService<ITag>(tagModel);
export const tagController = new GenericController<ITag>(tagService);
