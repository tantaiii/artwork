import { GenericController } from "../../core/controllers/base.controller";
import { GenericService } from "../../core/services/base.service";
import rankModel, { IRank } from "./rank.model";

const rankService = new GenericService<IRank>(rankModel);
export const rankController = new GenericController<IRank>(rankService);
