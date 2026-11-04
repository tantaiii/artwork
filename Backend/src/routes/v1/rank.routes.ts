import { Router } from "express";
import rankRoute from "../../modules/rank/rank.routes";
const route = Router();
route.use("/ranks", rankRoute);
export default route;
