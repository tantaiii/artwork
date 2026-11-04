// MIGRATED TO SQL SERVER — see src/models/sql/domain5-social.models.ts (NotificationSql)
// and the "Notifications" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document } from "mongoose";
//
// export interface INotification extends Document {
//   message: string;
//   createAt: Date;
//   interactId: string | null;
//   artworkId: string | null;
//   profileNotifyId: string | null;
//   followId: string | null;
//   isRead: number;
//   amount: number;
//   profileReceiveId: string | null;
// }
//
// export const NotificationSchema = new mongoose.Schema<INotification>({
//   message: { type: String, required: true },
//   createAt: { type: Date, required: true },
//   interactId: { type: String, required: false },
//   artworkId: { type: String, ref: "artworks", required: false },
//   profileNotifyId: { type: String, ref: "users", required: false },
//   followId: { type: String, required: false },
//   isRead: { type: Number, required: true, default: 0 },
//   amount: { type: Number, required: false },
//   profileReceiveId: { type: String, ref: "users", required: true },
// });
//
// export default mongoose.model<INotification>("notifications", NotificationSchema);

import { NotificationSql } from "../../models/sql";

// NOTE: `createAt` (typo in the old Mongoose schema) is now `createdAt` on
// NotificationSql / arthub.sql "Notifications" table, and `isRead` is a real
// boolean column instead of a 0/1 number.
export type INotification = NotificationSql;
export default NotificationSql;
