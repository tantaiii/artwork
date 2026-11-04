// MIGRATED TO SQL SERVER — see src/models/sql/domain4-forum.models.ts (TopicSql)
// and the "Topics" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose from "mongoose";
// import { ITypeOfTopic } from "../typeoftopics/typeoftopic.model";
//
// export interface ITopic extends mongoose.Document {
//   _id: mongoose.Types.ObjectId;
//   title: string;
//   typeId: mongoose.Types.ObjectId | ITypeOfTopic;
//   description: string;
// }
// export const TopicSchema = new mongoose.Schema<ITopic>({
//   title: { type: String, required: true },
//   typeId: { type: mongoose.Types.ObjectId, ref: "typeoftopics", required: true },
//   description: { type: String, required: true },
// });
// export default mongoose.model<ITopic>("topics", TopicSchema);

import { TopicSql } from "../../models/sql";

export type ITopic = TopicSql;
export default TopicSql;
