// MIGRATED TO SQL SERVER — see src/models/sql/domain5-social.models.ts (InteractionSql)
// and the "Interactions" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
// import { IArtwork } from "../artworks/artwork.model";
// import { IThread } from "../threads/thread.model";
//
// export interface IInteract extends Document {
//   userID: Types.ObjectId | IUser;
//   artworkID: Types.ObjectId | IArtwork;
//   threadID: Types.ObjectId | IThread;
//   activityType: string; // 'LIKE' | 'FAVOURITE'
//   status: boolean;
//   createdAt: Date;
// }
//
// const InteractSchema = new mongoose.Schema<IInteract>({
//   userID: { type: Types.ObjectId, ref: "users", required: true },
//   artworkID: { type: Types.ObjectId, ref: "artworks" },
//   threadID: { type: Types.ObjectId, ref: "threads" },
//   activityType: {
//     type: String,
//     enum: ['LIKE', 'FAVOURITE'],
//     required: true
//   },
//   status: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
// });
//
// InteractSchema.pre('save', function (next) {
//   const hasArtwork = !!this.artworkID;
//   const hasThread = !!this.threadID;
//
//   if (!hasArtwork && !hasThread) {
//     return next(new Error('Either artworkID or threadID must be provided'));
//   }
//   if (hasArtwork && hasThread) {
//     return next(new Error('Cannot interact with both artwork and thread'));
//   }
//   next();
// });
//
// export default mongoose.model<IInteract>("interacts", InteractSchema);

import { InteractionSql } from "../../models/sql";

// NOTE: field names changed from the old Mongoose `userID`/`artworkID`/`threadID`
// (capital ID) to the Sequelize attribute names `userId`/`artworkId`/`threadId`
// (matching InteractionSql / arthub.sql "Interactions" table). The exclusive-arc
// rule (exactly one of artworkId/threadId set) is now enforced by a CHECK
// constraint in SQL Server instead of the old pre('save') hook.
export type IInteract = InteractionSql;
export default InteractionSql;
