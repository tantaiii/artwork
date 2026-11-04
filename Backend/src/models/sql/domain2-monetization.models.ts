// SQL Server (Sequelize) models for DOMAIN 2: Subscription, Monetization & Transactions.
// Schema source: arthub.sql (Ranks, RankTransactions, Payments, Withdrawals).
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "Ranks", timestamps: false })
export class RankSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "rank_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  // Attribute kept as `name` (matching the pre-migration Mongoose field and the
  // Frontend's `Package.name`), mapped to the real `rank_name` SQL column.
  @Column({ field: "rank_name", type: DataType.STRING(100), allowNull: false, unique: true })
  name!: string;

  @Column({ field: "price", type: DataType.DECIMAL(18, 2), defaultValue: 0 })
  price!: number;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "RankTransactions", timestamps: false })
export class RankTransactionSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "rank_trans_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "rank_id", type: DataType.STRING(50), allowNull: false })
  rankId!: string;

  @Column({ field: "date_start_to_rent", type: DataType.DATE })
  dateStartToRent!: Date;

  @Column({ field: "date_end_to_rent", type: DataType.DATE, allowNull: true })
  dateEndToRent!: Date | null;

  @Column({ field: "limit_upload", type: DataType.INTEGER, defaultValue: 0 })
  limitUpload!: number;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Payments", timestamps: false })
export class PaymentSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "payment_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "amount", type: DataType.DECIMAL(18, 2), allowNull: false })
  amount!: number;

  @Column({ field: "status", type: DataType.BOOLEAN, defaultValue: false })
  status!: boolean;

  @Column({ field: "order_code", type: DataType.STRING(100), allowNull: false, unique: true })
  orderCode!: string;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;
}

@Table({ tableName: "Withdrawals", timestamps: false })
export class WithdrawalSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "withdraw_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "amount", type: DataType.DECIMAL(18, 2), allowNull: false })
  amount!: number;

  @Column({ field: "bank_number", type: DataType.STRING(50), allowNull: false })
  bankNumber!: string;

  @Column({ field: "bank_name", type: DataType.STRING(150), allowNull: false })
  bankName!: string;

  @Column({ field: "status", type: DataType.STRING(20), defaultValue: "pending" })
  status!: string;

  @Column({ field: "message", type: DataType.TEXT, allowNull: true })
  message!: string | null;

  @Column({ field: "date_requested", type: DataType.DATE })
  dateRequested!: Date;

  @Column({ field: "date_processed", type: DataType.DATE, allowNull: true })
  dateProcessed!: Date | null;

  @Column({ field: "processed_by", type: DataType.STRING(50), allowNull: true })
  processedBy!: string | null;
}
