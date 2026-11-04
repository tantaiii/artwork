// MIGRATED TO SQL SERVER — see src/models/sql/domain1-auth.models.ts (FollowSql)
// and the "Follows" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Schema, Document } from "mongoose";
//
// export interface IFollow extends Document {
//   followerId: mongoose.Types.ObjectId;
//   followingId: mongoose.Types.ObjectId;
//   dateFollow: Date;
//   status: boolean;
// }
//
// const FollowSchema = new Schema<IFollow>({
//   followerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   followingId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   dateFollow: { type: Date, default: Date.now },
//   status: { type: Boolean, default: true },
// });
//
// export const FollowModel = mongoose.model<IFollow>("Follow", FollowSchema);

import { FollowSql } from "../../models/sql";

export type IFollow = FollowSql;
export const FollowModel = FollowSql;
