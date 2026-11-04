// MIGRATED TO SQL SERVER — see src/models/sql/domain1-auth.models.ts (RoleSql)
// and the "Roles" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document } from "mongoose";
//
// export interface IRole extends Document {
//   name: string;
// }
//
// export const RoleSchema = new mongoose.Schema<IRole>({
//   name: { type: String, required: true },
// });
//
// export default mongoose.model<IRole>("roles", RoleSchema);

import { RoleSql } from "../../models/sql";

export type IRole = RoleSql;
export default RoleSql;
