// MIGRATED TO SQL SERVER — see src/models/sql/domain3-content.models.ts (TagSql)
// and the "Tags" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document } from "mongoose";
//
// export interface ITag extends Document {
//   tagName: string;
// }
//
// export const TagSchema = new mongoose.Schema<ITag>({
//   tagName: { type: String, required: true },
// });
//
// export default mongoose.model<ITag>("tags", TagSchema);

import { TagSql } from "../../models/sql";

export type ITag = TagSql;
export default TagSql;
