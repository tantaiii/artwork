// MIGRATED TO SQL SERVER — see src/models/sql/domain5-social.models.ts (ReportSql)
// and the "Reports" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
// import { IArtwork } from "../artworks/artwork.model";
//
// export interface IReport extends Document {
//   reporterID: Types.ObjectId | IUser;
//   reportedID: Types.ObjectId | IUser;
//   reportedArtworkID: Types.ObjectId | IArtwork;
//   description: string;
//   createdDate: Date;
//   status: "Pending" | "Reviewed";
// }
//
// export const ReportSchema = new mongoose.Schema<IReport>({
//   reporterID: { type: Types.ObjectId, required: true, ref: "users" },
//   reportedID: { type: Types.ObjectId, required: true, ref: "users" },
//   reportedArtworkID: { type: Types.ObjectId, required: false, ref: "artworks", default: null },
//   description: { type: String, required: true },
//   createdDate: { type: Date, required: true, default: Date.now },
//   status: { type: String, required: true, enum: ["Pending", "Reviewed"], default: "Pending" },
// });
//
// export default mongoose.model<IReport>("reports", ReportSchema);

import { ReportSql } from "../../models/sql";

// NOTE: field names changed to match ReportSql / arthub.sql "Reports" table:
//   reporterID -> reporterId, reportedID -> reportedId, reportedArtworkID -> reportedArtworkId
//   (plus new reviewedAt/reviewedBy columns not present on the old Mongoose schema)
export type IReport = ReportSql;
export default ReportSql;
