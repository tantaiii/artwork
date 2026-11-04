import { artisFormService } from './artisform.service';
import { GenericController } from "../../core/controllers/base.controller";
import { IArtisForm } from "./artisform.model";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export class ArtisFormController extends GenericController<IArtisForm> {
    private ArtisFormService: artisFormService;
    constructor(artisFormService: artisFormService) {
        super(artisFormService);
        this.ArtisFormService = artisFormService
    }

    //Function here
    createArtisForm = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            req.body.userId = id;

            const newForm = await this.ArtisFormService.createArtisForm(req.body);

            res.status(201).json({
                message: "Artis form created successfully.",
                data: newForm,
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    getAllArtisForm = async (_req: Request, res: Response) => {
        try {
            const data = await this.ArtisFormService.getAllArtisForm();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error });
        }
    };

    updateStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedForm = await this.ArtisFormService.updateStatus(id, status);
            res.status(200).json({ success: true, data: updatedForm });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error });
        }
    };

}