// SQL Server (Sequelize) models for DOMAIN 4: Community Forum (Topics, Threads & Forum Comments).
// Schema source: arthub.sql (TypeOfTopics, Topics, Threads, ThreadComments, ThreadReplies).
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({ tableName: "TypeOfTopics", timestamps: false })
export class TypeOfTopicSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "type_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "type_name", type: DataType.STRING(150), allowNull: false, unique: true })
  typeName!: string;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Topics", timestamps: false })
export class TopicSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "topic_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "type_id", type: DataType.STRING(50), allowNull: false })
  typeId!: string;

  @Column({ field: "title", type: DataType.STRING(200), allowNull: false })
  title!: string;

  @Column({ field: "description", type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ field: "created_at", type: DataType.DATE })
  createdAt!: Date;
}

@Table({ tableName: "Threads", timestamps: false })
export class ThreadSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "thread_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "topic_id", type: DataType.STRING(50), allowNull: false })
  topicId!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "title_thread", type: DataType.STRING(255), allowNull: false })
  titleThread!: string;

  @Column({ field: "thread_description", type: DataType.TEXT, allowNull: false })
  threadDescription!: string;

  @Column({ field: "likes", type: DataType.INTEGER, defaultValue: 0 })
  likes!: number;

  @Column({ field: "comments", type: DataType.INTEGER, defaultValue: 0 })
  comments!: number;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;
}

@Table({ tableName: "ThreadComments", timestamps: false })
export class ThreadCommentSql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "thread_comment_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  // NOTE (see arthub.sql Section 0, risk #2): the original Mongoose schema
  // (forum-comment.model.ts) incorrectly referenced `artworks` for this FK even
  // though forum-comment.service.ts always queried/updated it against threads.
  // The SQL schema fixes this: thread_id strictly references Threads(thread_id).
  @Column({ field: "thread_id", type: DataType.STRING(50), allowNull: false })
  threadId!: string;

  @Column({ field: "user_id", type: DataType.STRING(50), allowNull: false })
  userId!: string;

  @Column({ field: "comment_detail", type: DataType.TEXT, allowNull: false })
  commentDetail!: string;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;
}

@Table({ tableName: "ThreadReplies", timestamps: false })
export class ThreadReplySql extends Model {
  @Default(DataType.UUIDV4)
  @Column({ field: "reply_thread_id", type: DataType.STRING(50), primaryKey: true })
  _id!: string;

  @Column({ field: "thread_comment_id", type: DataType.STRING(50), allowNull: false })
  threadCommentId!: string;

  @Column({ field: "replier_id", type: DataType.STRING(50), allowNull: false })
  replierId!: string;

  @Column({ field: "reply_detail", type: DataType.TEXT, allowNull: false })
  replyDetail!: string;

  @Column({ field: "date_created", type: DataType.DATE })
  dateCreated!: Date;
}
