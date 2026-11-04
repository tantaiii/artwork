// MIGRATED TO SQL SERVER — see src/models/sql/domain4-forum.models.ts (ThreadSql)
// and the "Threads" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose from "mongoose";
// import { ITopic } from "../topics/topic.model";
// import { IUser } from "../users/user.model";
//
// export interface IThread extends mongoose.Document {
//   titleThread: string;
//   threadDescription: string;
//   likes: number;
//   comments: number;
//   dateCreated: Date | undefined;
//   topicId: mongoose.Types.ObjectId | ITopic;
//   userId: mongoose.Types.ObjectId | IUser;
// }
// export const ThreadSchema = new mongoose.Schema<IThread>({
//   titleThread: { type: String, required: true },
//   threadDescription: { type: String, required: true },
//   likes: { type: Number, required: true, default: 0 },
//   comments: { type: Number, required: true, default: 0 },
//   dateCreated: { type: Date, required: true, default: Date.now },
//   topicId: { type: mongoose.Types.ObjectId, ref: "topics", required: true },
//   userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
// });
// export default mongoose.model<IThread>("threads", ThreadSchema);

import { ThreadSql } from "../../models/sql";

export type IThread = ThreadSql;
export default ThreadSql;
