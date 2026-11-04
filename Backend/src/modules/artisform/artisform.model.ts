// MIGRATED TO SQL SERVER — see src/models/sql/domain1-auth.models.ts (ArtistFormSql)
// and the "ArtistForms" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model"
//
// export interface IArtisForm extends Document {
//     description: string;
//     status: boolean | null;
//     dateCreation: Date;
//     userId: Types.ObjectId | IUser
// }
//
// export const ArtisFormSchema = new mongoose.Schema<IArtisForm>({
//     description: { type: String, required: true },
//     status: { type: Boolean, required: false },
//     dateCreation: {
//         type: Date,
//         default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
//     },
//     userId: { type: Types.ObjectId, ref: "users", required: true },
// })
//
// export default mongoose.model<IArtisForm>("artisform", ArtisFormSchema)

import { ArtistFormSql } from "../../models/sql";

export type IArtisForm = ArtistFormSql;
export default ArtistFormSql;
