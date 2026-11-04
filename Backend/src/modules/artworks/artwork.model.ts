// MIGRATED TO SQL SERVER — see src/models/sql/domain3-content.models.ts (ArtworkSql)
// and the "Artworks"/"ArtworkTags" tables in arthub.sql. Original Mongoose model
// kept below, commented out, for reference/rollback.
//
// NOTE ON SHAPE CHANGES (see artwork.service.ts for the reconstruction logic):
// - The embedded `imageFile: { imageFileFE, preview, image }` object is now
//   FLATTENED into plain columns `imageFileFE`, `preview`, `image` directly on
//   the Artworks row (ArtworkSql). The service layer re-nests these into an
//   `imageFile` object on the way out to keep the API/frontend shape stable.
// - The embedded `tagID: [ObjectId]` array is now a normalized M:N relation via
//   the ArtworkTags junction table (ArtworkTagSql), exposed through the
//   Sequelize association alias `as: "tagID"` (see models/sql/index.ts), so
//   `artwork.tagID` still comes back as an array when the association is
//   `include`d, closely mirroring the old populated-array shape.
// - `userID` (the Mongoose ref-populated field) is now the FK column `userId`
//   plus the Sequelize association alias `artist` (UserSql can't reuse one
//   attribute name for both the raw FK and the populated object, same issue as
//   users/user.model.ts roleID vs role). The service re-maps the populated
//   `artist` association back onto a `userID` key on the returned object so
//   existing frontend code (`artwork.userID.firstName` etc.) keeps working.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
//
// export interface IImageFile {
//   imageFileFE: string;
//   preview: string;
//   image: string;
// }
//
// export interface IArtwork extends Document {
//   artworkName: string;
//   description?: string;
//   likes?: number;
//   purchasable?: boolean;
//   price?: number;
//   imageFile?: IImageFile;
//   userID: Types.ObjectId | IUser;
//   status?: string;
//   views?: number;
//   comments?: number;
//   favorites?: number;
//   dateCreated: Date;
//   tagID?: Types.ObjectId[];
// }
//
// export const ArtworkSchema = new mongoose.Schema<IArtwork>({
//   artworkName: { type: String, required: true },
//   description: { type: String, default: "" },
//   likes: { type: Number, default: 0 },
//   purchasable: { type: Boolean, default: false },
//   price: { type: Number, default: 0 },
//   imageFile: { type: Object, required: true },
//   userID: {
//     type: Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   status: { type: String, default: 1 },
//   views: { type: Number, default: 0 },
//   comments: { type: Number, default: 0 },
//   favorites: { type: Number, default: 0 },
//   dateCreated: { type: Date, default: Date.now },
//   tagID: [
//     {
//       type: Types.ObjectId,
//       ref: "tags",
//       required: true,
//     },
//   ],
// });
//
// export default mongoose.model<IArtwork>("artworks", ArtworkSchema);

import { ArtworkSql } from "../../models/sql";

export interface IImageFile {
  imageFileFE: string;
  preview: string;
  image: string;
}

export type IArtwork = ArtworkSql;
export default ArtworkSql;
