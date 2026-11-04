import { IReport } from "./report.model";
import { GenericController } from "../../core/controllers/base.controller";
import { reportService } from "./report.service";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class reportController extends GenericController<IReport> {
  private ReportService: reportService;
  constructor(reportService: reportService) {
    super(reportService);
    this.ReportService = reportService;
  }

  createReport = async (req: Request, res: Response) => {
    try {
      // Frontend (ReportForm.tsx) still sends the pre-migration Mongo-style
      // field names (reporterID/reportedID/reportedArtworkID); ReportSql uses
      // reporterId/reportedId/reportedArtworkId. Accept either.
      const body: any = req.body || {};
      const data: Partial<IReport> = {
        reporterId: body.reporterId ?? body.reporterID,
        reportedId: body.reportedId ?? body.reportedID,
        reportedArtworkId: body.reportedArtworkId ?? body.reportedArtworkID ?? null,
        description: body.description,
      } as any;
      const newReport = await this.ReportService.create(data);
      res.status(201).json(responseWrapper("success", "Report created successfully", newReport));
    } catch (error: any) {
      res.status(400).json(responseWrapper("error", error.message || "Failed to create report"));
    }
  };

  getAllReportPending = async (_req: Request, res: Response) => {
    try {
      const reports = await this.ReportService.getAllReportPending();
      res.json(responseWrapper("success", "Fetched pending reports successfully", reports));
    } catch (error: any) {
      res.status(500).json(responseWrapper("error", error.message || "Failed to fetch pending reports"));
    }
  };

  getAllReportReviewed = async (_req: Request, res: Response) => {
    try {
      const reports = await this.ReportService.getAllReportReviewed();
      res.json(responseWrapper("success", "Fetched reviewed reports successfully", reports));
    } catch (error: any) {
      res.status(500).json(responseWrapper("error", error.message || "Failed to fetch reviewed reports"));
    }
  };

  changeStatusReportToReviewed = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedReport = await this.ReportService.changeStatusReportToReviewed(id);
      if (!updatedReport) {
        return res.status(404).json(responseWrapper("error", "Report not found", null));
      }
      res.json(
        responseWrapper("success", "Report status updated to Reviewed successfully", updatedReport)
      );
    } catch (error: any) {
      res.status(500).json(responseWrapper("error", error.message || "Failed to update report status"));
    }
  };
}
