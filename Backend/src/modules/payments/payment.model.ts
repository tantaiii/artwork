// MIGRATED TO SQL SERVER — see src/models/sql/domain2-monetization.models.ts
// (PaymentSql) and the "Payments" table in arthub.sql. Original Mongoose
// model kept below, commented out, for reference/rollback.
//
// NOTE: `IQrInformation` was a plain DTO (not persisted) — it has no SQL
// equivalent and is re-declared below as-is since payment.controller.ts
// still imports it for typing the QR-code request body.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
//
// export interface IQrInformation extends Document {
//   qrCode: string;
//   amount: number;
//   description: string;
// }
// export interface IPayment extends Document {
//   userId: Types.ObjectId | IUser | string;
//   dateCreated: string | undefined;
//   amount: number;
//   status: boolean;
//   orderCode?: number;
// }
//
// export const PaymentSchema = new mongoose.Schema<IPayment>({
//   userId: { type: Types.ObjectId, ref: "users", required: true },
//   dateCreated: {
//     type: Date,
//     default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
//   },
//   amount: { type: Number, required: true },
//   status: { type: Boolean, required: true },
//   orderCode: { type: String, required: true },
// });
//
// export default mongoose.model<IPayment>("payments", PaymentSchema);

import { PaymentSql } from "../../models/sql";

export interface IQrInformation {
  qrCode: string;
  amount: number;
  description: string;
}

export type IPayment = PaymentSql;
export default PaymentSql;
