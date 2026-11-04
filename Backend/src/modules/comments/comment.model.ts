// MIGRATED TO SQL SERVER — see src/models/sql/domain3-content.models.ts
// (ArtworkCommentSql) and the "ArtworkComments" table in arthub.sql. Original
// Mongoose model kept below, commented out, for reference/rollback.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
// import { IArtwork } from "../artworks/artwork.model";
//
// export interface IComment extends Document {
//     commentDetail: string;
//     artworkId: Types.ObjectId | IArtwork;
//     userId: Types.ObjectId | IUser;
//     dateCreated: string | undefined;
// }
//
// export const CommentSchema = new mongoose.Schema<IComment>({
//     commentDetail: { type: String, required: true },
//     artworkId: { type: Types.ObjectId, ref: "artworks", required: true },
//     userId: { type: Types.ObjectId, ref: "users", required: true },
//     dateCreated: {
//         type: Date,
//         default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
//     },
// });
//
// export default mongoose.model<IComment>("comments", CommentSchema);

import { ArtworkCommentSql } from "../../models/sql";

export type IComment = ArtworkCommentSql;
export default ArtworkCommentSql;