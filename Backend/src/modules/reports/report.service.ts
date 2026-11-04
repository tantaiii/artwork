import { GenericService } from "../../core/services/base.service";
import reportModel, { IReport } from "./report.model";
import { ArtworkSql, UserSql } from "../../models/sql";
import { Op } from "sequelize";

const reportIncludes = [
  { model: UserSql, as: "reporter" },
  { model: UserSql, as: "reported" },
  { model: ArtworkSql, as: "reportedArtwork" },
];

export class reportService extends GenericService<IReport> {
  constructor() {
    super(reportModel);
  }

  create = async (data: Partial<IReport>) => {
    const { reporterId, reportedId, reportedArtworkId } = data as any;

    if (reportedArtworkId) {
      const artwork = await ArtworkSql.findByPk(reportedArtworkId);
      if (!artwork) {
        throw new Error("Reported artwork not found");
      }
      if (String((artwork as any).userId) !== String(reportedId)) {
        throw new Error("Reported artwork does not belong to reported user");
      }
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await reportModel.findOne({
      where: {
        reporterId,
        reportedId,
        createdDate: { [Op.gte]: oneDayAgo },
      } as any,
    });

    if (existing) {
      throw new Error("You can only report the same user once per 24 hours");
    }

    return reportModel.create({
      ...data,
      createdDate: new Date(),
      status: "Pending",
    } as any);
  };

  getAllReportPending = async () => {
    return reportModel.findAll({
      where: { status: "Pending" } as any,
      include: reportIncludes,
    });
  };

  getAllReportReviewed = async () => {
    return reportModel.findAll({
      where: { status: "Reviewed" } as any,
      include: reportIncludes,
    });
  };

  changeStatusReportToReviewed = async (reportID: string) => {
    const report = await reportModel.findByPk(reportID);
    if (!report) return null;
    return report.update({ status: "Reviewed" });
  };
}
