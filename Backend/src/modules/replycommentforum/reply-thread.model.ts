// MIGRATED TO SQL SERVER — see src/models/sql/domain4-forum.models.ts (ThreadReplySql)
// and the "ThreadReplies" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
// NOTE: the SQL model's FK attribute is named `threadCommentId` (mirroring the
// `thread_comment_id` column), not `commentThreadId` as in the original Mongoose
// schema below — reply.service.ts maps both spellings on input for compatibility
// with any existing client payloads that still send `commentThreadId`.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
//
// export interface IReplyThreadComment extends Document {
//   replyDetail: string;
//   replierId: Types.ObjectId | IUser;
//   dateCreated: string | undefined;
//   commentThreadId?: Types.ObjectId | string | "";
// }
//
// export const ReplyThreadCommentSchema = new mongoose.Schema<IReplyThreadComment>({
//   replyDetail: { type: String, required: true },
//   commentThreadId: { type: Types.ObjectId, ref: "thread-comments", required: false },
//   replierId: { type: Types.ObjectId, ref: "users", required: true },
//   dateCreated: {
//     type: Date,
//     default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
//   },
// });
//
// export default mongoose.model<IReplyThreadComment>("replythreadcomments", ReplyThreadCommentSchema);

import { ThreadReplySql } from "../../models/sql";

export type IReplyThreadComment = ThreadReplySql;
export default ThreadReplySql;
