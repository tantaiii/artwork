import { Router } from "express";
import artworkRouter from "../../modules/artworks/artwork.routes";

const router = Router();

router.use("/artworks", artworkRouter);

export default router;
