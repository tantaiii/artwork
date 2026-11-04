// SQL Server (Sequelize) models for DOMAIN 5: Social Interactions, Commissions, Reports & Notifications.
// Schema source: arthub.sql (Interactions, Commissions, Reports, Notifications).
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "Interactions", timestamps: false })
export class InteractionSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "interact_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  // Exclusive arc: exactly one of artworkId / threadId is set (enforced by a CHECK
  // constraint in SQL Server; Mongoose had no equivalent referential guarantee).
  @Column({ field: "artwork_id", type: DataType.STRING(50), allowNull: true })
  artworkId!: string | null;

  @Column({ field: "thread_id", type: DataType.STRING(50), allowNull: true })
  threadId!: string | null;

  @Column({ field: "activity_type", type: DataType.STRING(20), allowNull: false })
  activityType!: "LIKE" | "FAVOURITE";

  @Column({ field: "status", type: DataType.BOOLEAN, defaultValue: true })
  status!: boolean;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Commissions", timestamps: false })
export class CommissionSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "commission_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "requestor_id", type: DataType.STRING(50), allowNull: false })
  requestorId!: string;

  @Column({ field: "receiver_id", type: DataType.STRING(50), allowNull: false })
  receiverId!: string;

  @Column({ field: "phone_number", type: DataType.STRING(20), allowNull: false })
  phoneNumber!: string;

  @Column({ field: "email", type: DataType.STRING(255), allowNull: false })
  email!: string;

  @Column({ field: "description", type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ field: "accept", type: DataType.BOOLEAN, allowNull: true })
  accept!: boolean | null;

  @Column({ field: "progress", type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  progress!: number | null;

  @Column({ field: "message", type: DataType.TEXT, allowNull: true })
  message!: string | null;

  @Column({ field: "artwork_url", type: DataType.STRING(1000), allowNull: true })
  artworkUrl!: string | null;

  @Column({ field: "creation_date", type: DataType.DATE })
  creationDate!: Date;

  @Column({ field: "acceptance_date", type: DataType.DATE, allowNull: true })
  acceptanceDate!: Date | null;

  @Column({ field: "completion_date", type: DataType.DATE, allowNull: true })
  completionDate!: Date | null;
}

@Table({ tableName: "Reports", timestamps: false })
export class ReportSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "report_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "reporter_id", type: DataType.STRING(50), allowNull: false })
  reporterId!: string;

  @Column({ field: "reported_id", type: DataType.STRING(50), allowNull: false })
  reportedId!: string;

  @Column({ field: "reported_artwork_id", type: DataType.STRING(50), allowNull: true })
  reportedArtworkId!: string | null;

  @Column({ field: "description", type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ field: "status", type: DataType.STRING(20), defaultValue: "Pending" })
  status!: string;

  @Column({ field: "created_date", type: DataType.DATE })
  createdDate!: Date;

  @Column({ field: "reviewed_at", type: DataType.DATE, allowNull: true })
  reviewedAt!: Date | null;

  @Column({ field: "reviewed_by", type: DataType.STRING(50), allowNull: true })
  reviewedBy!: string | null;
}

@Table({ tableName: "Notifications", timestamps: false })
export class NotificationSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "notification_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "profile_receive_id", type: DataType.STRING(50), allowNull: false })
  profileReceiveId!: string;

  @Column({ field: "profile_notify_id", type: DataType.STRING(50), allowNull: true })
  profileNotifyId!: string | null;

  @Column({ field: "artwork_id", type: DataType.STRING(50), allowNull: true })
  artworkId!: string | null;

  @Column({ field: "interact_id", type: DataType.STRING(50), allowNull: true })
  interactId!: string | null;

  @Column({ field: "follow_id", type: DataType.STRING(50), allowNull: true })
  followId!: string | null;

  @Column({ field: "message", type: DataType.TEXT, allowNull: false })
  message!: string;

  @Column({ field: "amount", type: DataType.DECIMAL(18, 2), allowNull: true })
  amount!: number | null;

  @Column({ field: "is_read", type: DataType.BOOLEAN, defaultValue: false })
  isRead!: boolean;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}
