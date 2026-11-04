// MIGRATED TO SQL SERVER — see src/models/sql/domain3-content.models.ts
// (ArtworkReplySql) and the "ArtworkReplies" table in arthub.sql. Original
// Mongoose model kept below, commented out, for reference/rollback.
//
// NOTE: the original schema also carried a `commentThreadId` field pointing at
// the (separate, forum-domain) "thread-comments" collection. ArtworkReplySql /
// the ArtworkReplies table in arthub.sql has NO such column — that thread-reply
// concept lives entirely in the forum domain now (see
// src/modules/replycommentforum, ThreadReplySql / ThreadCommentSql in
// domain4-forum.models.ts). See reply.service.ts's
// `getRepliesByCommentThreadId` for how this is handled (it's effectively dead
// code here: reply.routes.ts's "/:commentId/thread" route already delegates to
// the replycommentforum module's controller, not this one).
//
// import mongoose, { Document, Types } from "mongoose";
// import { IComment } from "../comments/comment.model";
// import { IUser } from "../users/user.model";
//
// export interface IReplyComment extends Document {
//   replyDetail: string;
//   commentId: Types.ObjectId | IComment;
//   userId: Types.ObjectId | IUser;
//   dateCreated: string | undefined;
//   commentThreadId?: Types.ObjectId | string | "";
// }
//
// export const ReplyCommentSchema = new mongoose.Schema<IReplyComment>({
//   replyDetail: { type: String, required: true },
//   commentId: { type: Types.ObjectId, ref: "comments", required: false },
//   commentThreadId: { type: Types.ObjectId, ref: "thread-comments", required: false },
//   userId: { type: Types.ObjectId, ref: "users", required: true },
//   dateCreated: {
//     type: Date,
//     default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
//   },
// });
//
// export default mongoose.model<IReplyComment>("replycomments", ReplyCommentSchema);

import { ArtworkReplySql } from "../../models/sql";

export type IReplyComment = ArtworkReplySql;
export default ArtworkReplySql;
