import { GenericController } from "../../core/controllers/base.controller";
import { ICommission } from "./commission.model";
import { commissionService } from "./commission.service";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class CommissionController extends GenericController<ICommission> {
    private CommissionService: commissionService;

    constructor(commissionService: commissionService) {
        super(commissionService);
        this.CommissionService = commissionService;
    }

    getCommissionByRequestorId = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as { id: string };
            const commissions = await this.CommissionService.getCommissionByRequestorId(id);

            res.json(responseWrapper("success", "Commissions fetched successfully", commissions));
        } catch (error: any) {
            if (error.message === "Invalid userId format") {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Fetch commissions failed", error.message));
        }
    };


    getCommissionByRecieverId = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const commissions = await this.CommissionService.getCommissionByRecieverId(userId);
            res.json(responseWrapper("success", "Commissions fetched successfully", commissions.reverse()));
        } catch (error: any) {
            if (error.message === "Invalid userId format") {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Fetch commissions failed", error.message));
        }
    }

    getCommissionById = async (req: Request, res: Response) => {
        try {
            const { commissionId } = req.params;
            const commission = await this.CommissionService.getCommissionById(commissionId);
            res.json(responseWrapper("success", "Commission fetched successfully", commission));
        } catch (error: any) {
            if (error.message === "Invalid commissionId format") {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Fetch commission failed", error.message));
        }
    }

    saveCommission = async (req: Request, res: Response) => {
        try {
            const commission = req.body;
            const savedCommission = await this.CommissionService.saveCommission(commission);
            res.json(responseWrapper("success", "Commission created successfully", savedCommission));
        } catch (error: any) {
            if (
                error.message === "Invalid requestor ID format" ||
                error.message === "Invalid reciever ID format"
            ) {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Save commission failed", error.message));
        }
    }

    rejectCommissionById = async (req: Request, res: Response) => {
        try {
            const { commissionId } = req.params;
            const { message } = req.body;
            const updatedCommission = await this.CommissionService.rejectCommissionById(commissionId, message);
            res.json(responseWrapper("success", "Commission rejected successfully", updatedCommission));
        } catch (error: any) {
            if (error.message === "Invalid commissionId format" || error.message === "Commission not found") {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Reject commission failed", error.message));
        }
    }


    acceptCommissionById = async (req: Request, res: Response) => {
        try {
            const { commissionId } = req.params;
            const updatedCommission = await this.CommissionService.acceptCommissionById(commissionId);
            res.json(responseWrapper("success", "Commission accepted successfully", updatedCommission));
        } catch (error: any) {
            if (error.message === "Invalid commissionId format" || error.message === "Commission not found") {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Accept commission failed", error.message));
        }
    }

    updateProgressById = async (req: Request, res: Response) => {
        try {
            const { commissionId } = req.params;
            const { progress, artworkURL } = req.body;
            if (progress === undefined || (progress === 4 && !artworkURL)) {
                return res.status(400).json(responseWrapper("error", "Progress and artworkURL are required for progress 4", null));
            }
            const updatedCommission = await this.CommissionService.updateProgressById(commissionId, progress, artworkURL);
            res.json(responseWrapper("success", "Progress updated successfully", updatedCommission));
        } catch (error: any) {
            if (error.message === "Invalid commissionId format" || error.message === "Commission not found") {
                return res.status(400).json(responseWrapper("error", error.message, null));
            }
            res.status(500).json(responseWrapper("error", "Update progress failed", error.message));
        }
    }
    sendCommission = async (req: Request, res: Response) => {
        try {
            const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
                id: string;
            };
            const { receiverId } = req.params;

            const commissionData = {
                requestorId: id,
                receiverId: receiverId,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                description: req.body.description,
                creationDate: new Date(),
                accept: null,
                progress: 0,
                message: req.body.message || null,
                artworkUrl: req.body.artworkURL || null,
            };

            const saved = await this.CommissionService.saveCommission(commissionData as any);
            res.json(responseWrapper("success", "Commission created successfully", saved));
        } catch (error: any) {
            res
                .status(500)
                .json(responseWrapper("error", "Send commission failed", error.message));
        }
    };

}