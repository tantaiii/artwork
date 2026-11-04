// MIGRATED TO SQL SERVER — see src/models/sql/domain4-forum.models.ts (ThreadCommentSql)
// and the "ThreadComments" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// IMPORTANT bug fix baked into the SQL schema (see arthub.sql Section 0, risk note #2):
// the original Mongoose schema below has `threadId: { ref: "artworks" }` — this was
// WRONG, even though forum-comment.service.ts always treated it as a reference to a
// thread (it queries/updates it via threadService, never artworkService). The SQL
// schema fixes this: ThreadCommentSql.threadId correctly references ThreadSql/Threads
// only. Do NOT "fix" this back to Artworks when reading the commented-out code below.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
// import { IArtwork } from "../artworks/artwork.model";
//
// export interface IThreadComment extends Document {
//   commentDetail: string;
//   threadId: Types.ObjectId | IArtwork | string;
//   userId: Types.ObjectId | IUser;
//   dateCreated: string | undefined;
// }
//
// export const threadCommentSchema = new mongoose.Schema<IThreadComment>({
//   commentDetail: { type: String, required: true },
//   threadId: { type: Types.ObjectId, ref: "artworks", required: true },
//   userId: { type: Types.ObjectId, ref: "users", required: true },
//   dateCreated: {
//     type: Date,
//     default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
//   },
// });
//
// export default mongoose.model<IThreadComment>("thread-comments", threadCommentSchema);

import { ThreadCommentSql } from "../../models/sql";

export type IThreadComment = ThreadCommentSql;
export default ThreadCommentSql;
