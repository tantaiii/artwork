// MIGRATED TO SQL SERVER — see src/models/sql/domain2-monetization.models.ts (RankSql)
// and the "Ranks" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document } from "mongoose";
//
// export interface IRank extends Document {
//   name: string;
//   price: number;
// }
//
// export const RankSchema = new mongoose.Schema<IRank>({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
// });
//
// export default mongoose.model<IRank>("ranks", RankSchema);

import { RankSql } from "../../models/sql";

export type IRank = RankSql;
export default RankSql;
