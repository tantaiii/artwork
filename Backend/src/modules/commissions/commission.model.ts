// MIGRATED TO SQL SERVER — see src/models/sql/domain5-social.models.ts (CommissionSql)
// and the "Commissions" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
//
// export interface ICommission extends Document {
//     requestor: Types.ObjectId | IUser;
//     reciever: Types.ObjectId | IUser;
//     phoneNumber: string;
//     email: string;
//     description: string;
//     accept: boolean | null;
//     creationDate: Date;
//     acceptanceDate: Date;
//     completionDate: Date;
//     progress: number;
//     message: string | null;
//     artworkURL: string;
// }
//
// export const CommissionSchema = new mongoose.Schema<ICommission>({
//     requestor: {
//         type: Types.ObjectId,
//         required: true,
//         ref: "users",
//     },
//     reciever: {
//         type: Types.ObjectId,
//         required: true,
//         ref: "users",
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     accept: {
//         type: Boolean,
//         default: null,
//     },
//     creationDate: {
//         type: Date,
//         required: true,
//     },
//     acceptanceDate: {
//         type: Date,
//     },
//     completionDate: {
//         type: Date,
//     },
//     progress: {
//         type: Number,
//     },
//     message: {
//         type: String,
//     },
//     artworkURL: {
//         type: String,
//     },
// });
//
// export default mongoose.model<ICommission>("commissions", CommissionSchema);

import { CommissionSql } from "../../models/sql";

// NOTE: field names changed to match CommissionSql / arthub.sql "Commissions" table:
//   requestor -> requestorId, reciever -> receiverId, artworkURL -> artworkUrl
export type ICommission = CommissionSql;
export default CommissionSql;
