// MIGRATED TO SQL SERVER — see src/models/sql/domain2-monetization.models.ts
// (RankTransactionSql) and the "RankTransactions" table in arthub.sql.
// Original Mongoose model kept below, commented out, for reference/rollback.
//
// NOTE: the Mongoose fields `userID` / `rankID` (capital ID) are named
// `userId` / `rankId` (lowercase d) on the SQL model — service code below
// has been updated accordingly.
//
// import mongoose, { Document, Schema, Types } from "mongoose";
// import { IUser } from "../users/user.model";
// import { IRank } from "../rank/rank.model";
//
// export interface IRankTransaction extends Document {
//   userID: Types.ObjectId | IUser | string;
//   rankID: Types.ObjectId | IRank | string;
//   dateStartToRent: Date;
//   dateEndToRent: Date;
//   limitUpload: number;
// }
//
// const RankTransactionSchema = new Schema<IRankTransaction>({
//   userID: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   rankID: {
//     type: Schema.Types.ObjectId,
//     ref: "ranks",
//     required: true,
//   },
//   dateStartToRent: { type: Date, default: Date.now },
//   dateEndToRent: { type: Date, required: false },
//   limitUpload: { type: Number, required: true },
// });
//
// export default mongoose.model<IRankTransaction>("ranktransactions", RankTransactionSchema);

import { RankTransactionSql } from "../../models/sql";

export type IRankTransaction = RankTransactionSql;
export default RankTransactionSql;
