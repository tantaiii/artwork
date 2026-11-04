// Central registry for every Sequelize (SQL Server) model + association.
// Mirrors the FOREIGN KEY relationships defined in arthub.sql. Associations are
// wired here (rather than via decorators on each model) to keep cross-domain
// foreign keys easy to audit in one place and avoid circular-import ordering
// issues between domain model files.
import { Sequelize } from "sequelize-typescript";
import { RoleSql, UserSql, FollowSql, ArtistFormSql } from "./domain1-auth.models";
import { RankSql, RankTransactionSql, PaymentSql, WithdrawalSql } from "./domain2-monetization.models";
import {
  TagSql,
  ArtworkSql,
  ArtworkTagSql,
  TransactionSql,
  ArtworkCommentSql,
  ArtworkReplySql,
} from "./domain3-content.models";
import {
  TypeOfTopicSql,
  TopicSql,
  ThreadSql,
  ThreadCommentSql,
  ThreadReplySql,
} from "./domain4-forum.models";
import { InteractionSql, CommissionSql, ReportSql, NotificationSql } from "./domain5-social.models";
import { ChatSql, MessageSql, AIConversationSql } from "./domain6-messaging.models";

export {
  RoleSql,
  UserSql,
  FollowSql,
  ArtistFormSql,
  RankSql,
  RankTransactionSql,
  PaymentSql,
  WithdrawalSql,
  TagSql,
  ArtworkSql,
  ArtworkTagSql,
  TransactionSql,
  ArtworkCommentSql,
  ArtworkReplySql,
  TypeOfTopicSql,
  TopicSql,
  ThreadSql,
  ThreadCommentSql,
  ThreadReplySql,
  InteractionSql,
  CommissionSql,
  ReportSql,
  NotificationSql,
  ChatSql,
  MessageSql,
  AIConversationSql,
};

const ALL_SQL_MODELS = [
  RoleSql,
  UserSql,
  FollowSql,
  ArtistFormSql,
  RankSql,
  RankTransactionSql,
  PaymentSql,
  WithdrawalSql,
  TagSql,
  ArtworkSql,
  ArtworkTagSql,
  TransactionSql,
  ArtworkCommentSql,
  ArtworkReplySql,
  TypeOfTopicSql,
  TopicSql,
  ThreadSql,
  ThreadCommentSql,
  ThreadReplySql,
  InteractionSql,
  CommissionSql,
  ReportSql,
  NotificationSql,
  ChatSql,
  MessageSql,
  AIConversationSql,
];

let initialized = false;

export function initSqlModels(sequelize: Sequelize): void {
  if (initialized) return;

  sequelize.addModels(ALL_SQL_MODELS);

  // ===== Domain 1: Auth, Users & Roles =====
  UserSql.belongsTo(RoleSql, { foreignKey: "roleID", as: "role" });
  RoleSql.hasMany(UserSql, { foreignKey: "roleID", as: "users" });

  FollowSql.belongsTo(UserSql, { foreignKey: "followerId", as: "follower" });
  FollowSql.belongsTo(UserSql, { foreignKey: "followingId", as: "following" });

  ArtistFormSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  ArtistFormSql.belongsTo(UserSql, { foreignKey: "reviewedBy", as: "reviewer" });

  // ===== Domain 2: Monetization =====
  RankTransactionSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  RankTransactionSql.belongsTo(RankSql, { foreignKey: "rankId", as: "rank" });
  PaymentSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  WithdrawalSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  WithdrawalSql.belongsTo(UserSql, { foreignKey: "processedBy", as: "processor" });

  // ===== Domain 3: Content & Artworks =====
  ArtworkSql.belongsTo(UserSql, { foreignKey: "userId", as: "artist" });
  UserSql.hasMany(ArtworkSql, { foreignKey: "userId", as: "artworks" });
  ArtworkTagSql.belongsTo(ArtworkSql, { foreignKey: "artworkId", as: "artwork" });
  ArtworkTagSql.belongsTo(TagSql, { foreignKey: "tagId", as: "tag" });
  ArtworkSql.hasMany(ArtworkTagSql, { foreignKey: "artworkId", as: "artworkTags" });
  ArtworkSql.belongsToMany(TagSql, {
    through: ArtworkTagSql,
    foreignKey: "artworkId",
    otherKey: "tagId",
    as: "tagID",
  });
  TagSql.belongsToMany(ArtworkSql, {
    through: ArtworkTagSql,
    foreignKey: "tagId",
    otherKey: "artworkId",
    as: "artworks",
  });
  TransactionSql.belongsTo(UserSql, { foreignKey: "buyerId", as: "buyer" });
  TransactionSql.belongsTo(UserSql, { foreignKey: "sellerId", as: "seller" });
  TransactionSql.belongsTo(ArtworkSql, { foreignKey: "artworkId", as: "artwork" });
  ArtworkCommentSql.belongsTo(ArtworkSql, { foreignKey: "artworkId", as: "artwork" });
  ArtworkCommentSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  ArtworkSql.hasMany(ArtworkCommentSql, { foreignKey: "artworkId", as: "artworkComments" });
  ArtworkReplySql.belongsTo(ArtworkCommentSql, { foreignKey: "commentId", as: "comment" });
  ArtworkReplySql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  ArtworkCommentSql.hasMany(ArtworkReplySql, { foreignKey: "commentId", as: "replies" });

  // ===== Domain 4: Forum =====
  TopicSql.belongsTo(TypeOfTopicSql, { foreignKey: "typeId", as: "type" });
  TypeOfTopicSql.hasMany(TopicSql, { foreignKey: "typeId", as: "topics" });
  ThreadSql.belongsTo(TopicSql, { foreignKey: "topicId", as: "topic" });
  ThreadSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  TopicSql.hasMany(ThreadSql, { foreignKey: "topicId", as: "threads" });
  ThreadCommentSql.belongsTo(ThreadSql, { foreignKey: "threadId", as: "thread" });
  ThreadCommentSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  ThreadSql.hasMany(ThreadCommentSql, { foreignKey: "threadId", as: "threadComments" });
  ThreadReplySql.belongsTo(ThreadCommentSql, { foreignKey: "threadCommentId", as: "threadComment" });
  ThreadReplySql.belongsTo(UserSql, { foreignKey: "replierId", as: "replier" });
  ThreadCommentSql.hasMany(ThreadReplySql, { foreignKey: "threadCommentId", as: "replies" });

  // ===== Domain 5: Social, Commissions, Reports & Notifications =====
  InteractionSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });
  InteractionSql.belongsTo(ArtworkSql, { foreignKey: "artworkId", as: "artwork" });
  InteractionSql.belongsTo(ThreadSql, { foreignKey: "threadId", as: "thread" });
  CommissionSql.belongsTo(UserSql, { foreignKey: "requestorId", as: "requestor" });
  CommissionSql.belongsTo(UserSql, { foreignKey: "receiverId", as: "receiver" });
  ReportSql.belongsTo(UserSql, { foreignKey: "reporterId", as: "reporter" });
  ReportSql.belongsTo(UserSql, { foreignKey: "reportedId", as: "reported" });
  ReportSql.belongsTo(ArtworkSql, { foreignKey: "reportedArtworkId", as: "reportedArtwork" });
  ReportSql.belongsTo(UserSql, { foreignKey: "reviewedBy", as: "reviewer" });
  NotificationSql.belongsTo(UserSql, { foreignKey: "profileReceiveId", as: "receiver" });
  NotificationSql.belongsTo(UserSql, { foreignKey: "profileNotifyId", as: "notifier" });
  NotificationSql.belongsTo(ArtworkSql, { foreignKey: "artworkId", as: "artwork" });
  NotificationSql.belongsTo(InteractionSql, { foreignKey: "interactId", as: "interaction" });
  NotificationSql.belongsTo(FollowSql, { foreignKey: "followId", as: "follow" });

  // ===== Domain 6: Messaging =====
  ChatSql.belongsTo(UserSql, { foreignKey: "user1Id", as: "user1" });
  ChatSql.belongsTo(UserSql, { foreignKey: "user2Id", as: "user2" });
  ChatSql.hasMany(MessageSql, { foreignKey: "chatId", as: "messages" });
  MessageSql.belongsTo(ChatSql, { foreignKey: "chatId", as: "chat" });
  MessageSql.belongsTo(UserSql, { foreignKey: "senderId", as: "sender" });
  MessageSql.belongsTo(UserSql, { foreignKey: "receiverId", as: "receiver" });
  AIConversationSql.belongsTo(UserSql, { foreignKey: "userId", as: "user" });

  initialized = true;
}
