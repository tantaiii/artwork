// MIGRATED TO SQL SERVER — see src/models/sql/domain3-content.models.ts
// (TransactionSql — arthub.sql groups this table under Domain 3: Content,
// even though the module folder lives under Domain 2) and the
// "Transactions" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// NOTE: the Mongoose fields `buyerID` / `sellerID` / `artworkID` (capital
// ID) are named `buyerId` / `sellerId` / `artworkId` (lowercase d) on the
// SQL model — service code below has been updated accordingly.
//
// import mongoose, { Document, Schema, Types } from "mongoose";
// import { IUser } from "../users/user.model";
// import { IArtwork } from "../artworks/artwork.model";
//
// export interface ITransaction extends Document {
//   buyerID: Types.ObjectId | IUser | string;
//   sellerID: Types.ObjectId | IUser | string;
//   artworkID: Types.ObjectId | IArtwork | string;
//   price: number;
//   dateToBuy: Date;
// }
//
// const ArtworkSchema = new Schema<ITransaction>({
//   buyerID: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   sellerID: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },
//   artworkID: {
//     type: Schema.Types.ObjectId,
//     ref: "artworks",
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   dateToBuy: {
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
// });
//
// export default mongoose.model<ITransaction>("transactions", ArtworkSchema);

import { TransactionSql } from "../../models/sql";

export type ITransaction = TransactionSql;
export default TransactionSql;
