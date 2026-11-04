// MIGRATED TO SQL SERVER — see src/models/sql/domain6-messaging.models.ts (MessageSql)
// and the "Messages" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// import mongoose, { Document } from "mongoose";
//
// export interface IMessage extends Document {
//   senderId: string;
//   receiverId: string;
//   message: string;
//   dateSent: Date;
//   isRead: number;
// }
//
// export const MessageSchema = new mongoose.Schema<IMessage>({
//   senderId: { type: String, ref: "users", required: true },
//   receiverId: { type: String, ref: "users", required: true },
//   message: { type: String, required: true },
//   dateSent: { type: Date, required: true, default: Date.now },
//   isRead: { type: Number, required: true, default: 0 },
// });
//
// export default mongoose.model<IMessage>("messages", MessageSchema);

import { MessageSql } from "../../models/sql";

export type IMessage = MessageSql;
export default MessageSql;
