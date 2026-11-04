// MIGRATED TO SQL SERVER — see src/models/sql/domain4-forum.models.ts (TypeOfTopicSql)
// and the "TypeOfTopics" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
// NOTE: the SQL attribute is `typeName` (camelCase), not `TypeName` as below —
// any client payload using the old `TypeName` casing must be updated to `typeName`.
//
// import mongoose from "mongoose";
//
// export interface ITypeOfTopic extends mongoose.Document {
//   TypeName: string;
// }
// export const TypeOfTopicSchema = new mongoose.Schema<ITypeOfTopic>({
//   TypeName: { type: String, required: true },
// });
// export default mongoose.model<ITypeOfTopic>("typeoftopics", TypeOfTopicSchema);

import { TypeOfTopicSql } from "../../models/sql";

export type ITypeOfTopic = TypeOfTopicSql;
export default TypeOfTopicSql;
