import { Router } from "express";
import { tagController } from "./tag.controller";
import { ArtworkController } from "../artworks/artwork.controller";
import { artworkService } from "../artworks/artwork.service";
const router = Router();

const artworkController = new ArtworkController(new artworkService());
router.route("/").get(tagController.getAll).post(tagController.create);

router.route("/:id").get(tagController.getById);

router.route("/:tagId/artworks").get(artworkController.getListArtworkByTagID);

export default router;
