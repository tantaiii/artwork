// SQL Server (Sequelize) models for DOMAIN 1: Authentication, Users & Roles.
// Schema source: arthub.sql (Roles, Users, Follows, ArtistForms).
// Primary keys are exposed as `_id` (mapped to the real SQL column) to stay
// source-compatible with the previous Mongoose `_id` convention used across
// controllers/services/frontend.
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "Roles", timestamps: false })
export class RoleSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "role_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "role_name", type: DataType.STRING(50), allowNull: false, unique: true })
  name!: string;

  @Column({ field: "description", type: DataType.STRING(255), allowNull: true })
  description!: string | null;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Users", timestamps: false })
export class UserSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "user_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "role_id", type: DataType.STRING(50), allowNull: false })
  roleID!: string;

  @Column({ field: "email", type: DataType.STRING(255), allowNull: false, unique: true })
  email!: string;

  @Column({ field: "password_hash", type: DataType.STRING(255), allowNull: false })
  password!: string;

  @Column({ field: "first_name", type: DataType.STRING(100), defaultValue: "" })
  firstName!: string;

  @Column({ field: "last_name", type: DataType.STRING(100), defaultValue: "" })
  lastName!: string;

  @Column({ field: "phone_number", type: DataType.STRING(20), defaultValue: "0" })
  phoneNumber!: string;

  @Column({ field: "address", type: DataType.STRING(500), defaultValue: "" })
  address!: string;

  @Column({ field: "biography", type: DataType.TEXT, defaultValue: "" })
  biography!: string;

  @Column({ field: "profile_picture", type: DataType.STRING(1000), defaultValue: "" })
  profilePicture!: string;

  @Column({ field: "background_picture", type: DataType.STRING(1000), defaultValue: "" })
  backgroundPicture!: string;

  @Column({ field: "date_of_birth", type: DataType.DATEONLY, allowNull: true })
  dateOfBirth!: string | null;

  @Column({ field: "coins", type: DataType.DECIMAL(18, 4), defaultValue: 0 })
  coins!: number;

  @Column({ field: "allow_commission", type: DataType.BOOLEAN, defaultValue: false })
  allowCommission!: boolean;

  @Column({ field: "follow_counts", type: DataType.INTEGER, defaultValue: 0 })
  followCounts!: number;

  @Column({ field: "follower_count", type: DataType.INTEGER, defaultValue: 0 })
  followerCount!: number;

  @Column({ field: "login_failed_counts", type: DataType.INTEGER, defaultValue: 0 })
  loginFailedCounts!: number;

  @Column({ field: "login_failed_time", type: DataType.DATE, allowNull: true })
  loginFailedTime!: Date | null;

  @Column({ field: "is_active", type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ field: "last_login", type: DataType.DATE, allowNull: true })
  lastLogin!: Date | null;

  @Column({ field: "created_at", type: DataType.DATE })
  CreateAt!: Date;

  // Populated via UserSql.belongsTo(RoleSql, { as: "role" }) in models/sql/index.ts.
  // Kept distinct from `roleID` because Sequelize (unlike Mongoose) cannot reuse
  // the raw foreign-key attribute name as the populated-association alias.
  declare role?: RoleSql;
}

@Table({ tableName: "Follows", timestamps: false })
export class FollowSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "follow_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "follower_id", type: DataType.STRING(50), allowNull: false })
  followerId!: string;

  @Column({ field: "following_id", type: DataType.STRING(50), allowNull: false })
  followingId!: string;

  @Column({ field: "date_follow", type: DataType.DATE })
  dateFollow!: Date;

  @Column({ field: "status", type: DataType.BOOLEAN, defaultValue: true })
  status!: boolean;
}

@Table({ tableName: "ArtistForms", timestamps: false })
export class ArtistFormSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "form_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "description", type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ field: "status", type: DataType.BOOLEAN, allowNull: true })
  status!: boolean | null;

  @Column({ field: "date_creation", type: DataType.DATE })
  dateCreation!: Date;

  @Column({ field: "reviewed_at", type: DataType.DATE, allowNull: true })
  reviewedAt!: Date | null;

  @Column({ field: "reviewed_by", type: DataType.STRING(50), allowNull: true })
  reviewedBy!: string | null;

  @Column({ field: "admin_note", type: DataType.TEXT, allowNull: true })
  adminNote!: string | null;
}
