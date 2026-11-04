// SQL Server (Sequelize) models for DOMAIN 3: Content, Tags & Artworks.
// Schema source: arthub.sql (Tags, Artworks, ArtworkTags, Transactions, ArtworkComments, ArtworkReplies).
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "Tags", timestamps: false })
export class TagSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "tag_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "tag_name", type: DataType.STRING(100), allowNull: false, unique: true })
  tagName!: string;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Artworks", timestamps: false })
export class ArtworkSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "artwork_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "artwork_name", type: DataType.STRING(255), allowNull: false })
  artworkName!: string;

  @Column({ field: "description", type: DataType.TEXT, defaultValue: "" })
  description!: string;

  // Flattened from the original embedded Artwork.imageFile { imageFileFE, preview, image }.
  @Column({ field: "image_file_fe", type: DataType.STRING(1000), allowNull: false })
  imageFileFE!: string;

  @Column({ field: "preview_url", type: DataType.STRING(1000), allowNull: false })
  preview!: string;

  @Column({ field: "image_url", type: DataType.STRING(1000), allowNull: false })
  image!: string;

  @Column({ field: "purchasable", type: DataType.BOOLEAN, defaultValue: false })
  purchasable!: boolean;

  @Column({ field: "price", type: DataType.DECIMAL(18, 2), defaultValue: 0 })
  price!: number;

  @Column({ field: "status", type: DataType.STRING(50), defaultValue: "1" })
  status!: string;

  @Column({ field: "likes", type: DataType.INTEGER, defaultValue: 0 })
  likes!: number;

  @Column({ field: "views", type: DataType.BIGINT, defaultValue: 0 })
  views!: number;

  @Column({ field: "comments", type: DataType.INTEGER, defaultValue: 0 })
  comments!: number;

  @Column({ field: "favorites", type: DataType.INTEGER, defaultValue: 0 })
  favorites!: number;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;

  // Populated via ArtworkSql.belongsToMany(TagSql, { as: "tagID" }) in models/sql/index.ts.
  declare tagID?: TagSql[];
}

// Normalized M:N relationship replacing the embedded Artwork.tagID ObjectId array.
@Table({ tableName: "ArtworkTags", timestamps: false })
export class ArtworkTagSql extends Model {
  @Column({ field: "artwork_id", type: DataType.STRING(50), primaryKey: true })
  artworkId!: string;

  @Column({ field: "tag_id", type: DataType.STRING(50), primaryKey: true })
  tagId!: string;

  @Column({ field: "assigned_at", type: DataType.DATE })
  assignedAt!: Date;
}

@Table({ tableName: "Transactions", timestamps: false })
export class TransactionSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "transaction_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "buyer_id", type: DataType.STRING(50), allowNull: false })
  buyerId!: string;

  @Column({ field: "seller_id", type: DataType.STRING(50), allowNull: false })
  sellerId!: string;

  @Column({ field: "artwork_id", type: DataType.STRING(50), allowNull: false })
  artworkId!: string;

  @Column({ field: "price", type: DataType.DECIMAL(18, 2), allowNull: false })
  price!: number;

  @Column({ field: "date_to_buy", type: DataType.DATE })
  dateToBuy!: Date;
}

@Table({ tableName: "ArtworkComments", timestamps: false })
export class ArtworkCommentSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "comment_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "artwork_id", type: DataType.STRING(50), allowNull: false })
  artworkId!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "comment_detail", type: DataType.TEXT, allowNull: false })
  commentDetail!: string;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;
}

@Table({ tableName: "ArtworkReplies", timestamps: false })
export class ArtworkReplySql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "reply_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "comment_id", type: DataType.STRING(50), allowNull: false })
  commentId!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "reply_detail", type: DataType.TEXT, allowNull: false })
  replyDetail!: string;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;
}
