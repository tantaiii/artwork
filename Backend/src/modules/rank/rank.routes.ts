import { Router } from "express";
import { rankController } from "./rank.controller";
import { authenticate } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/roleMiddleware";

const route = Router();

route
  .route("/")
  .get(rankController.getAll)
  .post(authenticate, authorize(["Admin"]), rankController.create);

route
  .route("/:id")
  .get(rankController.getById)
  .put(authenticate, authorize(["Admin"]), rankController.update)
  .delete(authenticate, authorize(["Admin"]), rankController.delete);

export default route;
