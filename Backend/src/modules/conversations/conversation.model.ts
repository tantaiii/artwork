// MIGRATED TO SQL SERVER — see src/models/sql/domain6-messaging.models.ts (AIConversationSql)
// and the "AIConversations" table in arthub.sql. Original Mongoose model kept below,
// commented out, for reference/rollback.
//
// NOTE: the Mongoose schema used PascalCase field names (UserId, Prompt, ImageUrl,
// CreatedAt) while the Sequelize model (matching arthub.sql) uses camelCase
// (userId, prompt, imageUrl, createdAt). conversation.service.ts and
// conversation.controller.ts have been updated to use the new camelCase names.
//
// import mongoose, { Document, Types } from "mongoose";
// import { IUser } from "../users/user.model";
//
// export interface IConversation extends Document {
//   UserId: Types.ObjectId | IUser;
//   Prompt: string;
//   ImageUrl: string;
//   CreatedAt: Date;
// }
// export const ConversationSchema = new mongoose.Schema<IConversation>({
//   UserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
//   Prompt: { type: String, required: true },
//   ImageUrl: { type: String, required: true },
//   CreatedAt: { type: Date, default: Date.now },
// });
// export default mongoose.model<IConversation>("conversations", ConversationSchema);

import { AIConversationSql } from "../../models/sql";

export type IConversation = AIConversationSql;
export default AIConversationSql;
