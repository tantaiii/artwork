// SQL Server (Sequelize) models for DOMAIN 6: Real-time Messaging, Chats & AI Assistant.
// Schema source: arthub.sql (Chats, Messages, AIConversations).
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "Chats", timestamps: false })
export class ChatSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "chat_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user1_id", type: DataType.STRING(50), allowNull: false })
  user1Id!: string;

  @Column({ field: "user2_id", type: DataType.STRING(50), allowNull: false })
  user2Id!: string;

  @Column({ field: "status", type: DataType.INTEGER, defaultValue: 1 })
  status!: number;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Messages", timestamps: false })
export class MessageSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "message_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "chat_id", type: DataType.STRING(50), allowNull: true })
  chatId!: string | null;

  @Column({ field: "sender_id", type: DataType.STRING(50), allowNull: false })
  senderId!: string;

  @Column({ field: "receiver_id", type: DataType.STRING(50), allowNull: false })
  receiverId!: string;

  @Column({ field: "message", type: DataType.TEXT, allowNull: false })
  message!: string;

  @Column({ field: "is_read", type: DataType.BOOLEAN, defaultValue: false })
  isRead!: boolean;

  @Column({ field: "date_sent", type: DataType.DATE })
  dateSent!: Date;
}

@Table({ tableName: "AIConversations", timestamps: false })
export class AIConversationSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "conversation_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "prompt", type: DataType.TEXT, allowNull: false })
  prompt!: string;

  @Column({ field: "image_url", type: DataType.STRING(1000), allowNull: false })
  imageUrl!: string;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}
