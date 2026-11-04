import { Router } from "express";
import { ArtisFormController } from "./artisform.controller";
import { artisFormService } from "./artisform.service";

const router = Router();
const artisFormController = new ArtisFormController(new artisFormService())

router
    .route("/")
    .get(artisFormController.getAllArtisForm)

router
    .route("/:id")
    .put(artisFormController.updateStatus)
export default router