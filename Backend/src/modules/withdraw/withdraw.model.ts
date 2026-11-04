// MIGRATED TO SQL SERVER — see src/models/sql/domain2-monetization.models.ts
// (WithdrawalSql) and the "Withdrawals" table in arthub.sql. Original
// Mongoose model kept below, commented out, for reference/rollback.
//
// NOTE: the Mongoose field `user` is named `userId` on the SQL model — the
// service below maps `withdraw.user` (still set by withdraw.controller.ts)
// onto the `userId` column on create. The SQL table also adds two columns
// with no Mongoose equivalent, `dateProcessed` / `processedBy`, which are
// not populated by the migrated `updateStatus` (same as before, admin
// approval never recorded who/when) — flagging in case a human wants that
// wired up now that the columns exist.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
//
// export interface IWithdraw extends Document {
//   amount: number;
//   dateRequested: Date;
//   user: Types.ObjectId | IUser | string;
//   bankNumber: string;
//   bankName: string;
//   status: "pending" | "approved" | "rejected";
//   message: string | null;
// }
//
// export const WithdrawSchema = new mongoose.Schema<IWithdraw>({
//   amount: {
//     type: Number,
//     required: true,
//   },
//   dateRequested: {
//     type: Date,
//     required: false,
//     default: Date.now,
//   },
//   user: {
//     type: Types.ObjectId,
//     required: false,
//     ref: "users",
//   },
//   bankNumber: {
//     type: String,
//     required: true,
//   },
//   bankName: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: false,
//   },
// });
//
// export default mongoose.model<IWithdraw>("withdraws", WithdrawSchema);

import { WithdrawalSql } from "../../models/sql";

export type IWithdraw = WithdrawalSql;
export default WithdrawalSql;
