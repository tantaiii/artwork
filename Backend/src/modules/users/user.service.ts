import { GenericService } from "../../core/services/base.service";
import userModel, { IUser } from "./user.model";
import { RoleSql } from "../../models/sql";
import bcrypt from "bcryptjs";
import { uploadImage } from "../../utils/imageUtils";
import { sequelize } from "../../config/sqldb";
import { QueryTypes } from "sequelize";

const ROLE_INCLUDE = [{ model: RoleSql, as: "role" as const }];

export class userService extends GenericService<IUser> {
  constructor() {
    super(userModel);
  }
  getAllPopulated = async () => {
    return userModel.findAll({ include: ROLE_INCLUDE });
  };

  create = async (data: Partial<IUser>) => {
    // arthub.sql seeds Roles as Admin/Artist/Customer (not "User", which the
    // pre-migration Mongo code looked for) — "Customer" is the regular signup
    // role here, with "User" kept as a fallback in case the seed data differs.
    const role =
      (await RoleSql.findOne({ where: { name: "Customer" } })) ??
      (await RoleSql.findOne({ where: { name: "User" } }));
    if (!role) {
      throw new Error("Role 'user' not found");
    }

    const created = await userModel.create({
      ...data,
      roleID: role._id,
      dateOfBirth: data.dateOfBirth || null,
      password: bcrypt.hashSync(String(data.password), 8),
    } as any);

    return (await userModel.findByPk(created._id, { include: ROLE_INCLUDE }))!;
  };

  getByEmail = async (email: string) => {
    return userModel.findOne({ where: { email }, include: ROLE_INCLUDE });
  };

  updateLastLogin = async (id: string) => {
    const user = await userModel.findByPk(id);
    if (!user) return null;
    return user.update({ lastLogin: new Date() });
  };

  changePassword = async (id: string, password: string) => {
    const user = await userModel.findByPk(id);
    if (!user) return null;
    return user.update({ password: bcrypt.hashSync(password, 8) });
  };

  changePasswordByEmail = async (email: string, password: string) => {
    const user = await userModel.findOne({ where: { email } });
    if (!user) return null;
    return user.update({ password: bcrypt.hashSync(password, 8) });
  };
  checkPassword = async (id: string, password: string) => {
    const user = await this.getById(id);
    if (!user) return false;
    return bcrypt.compareSync(password, user.password);
  };

  getTop10PopularUsers = async () => {
    // Reimplemented as a JOIN + GROUP BY aggregate (equivalent of the previous
    // Mongo $lookup/$addFields pipeline against the artworks collection).
    const users = await sequelize.query(
      `SELECT TOP 10 u.*,
              COALESCE(SUM(a.likes), 0) AS totalLikes,
              (u.follower_count * 0.5 + COALESCE(SUM(a.likes), 0) * 0.75) AS popularity
       FROM Users u
       LEFT JOIN Artworks a ON a.user_id = u.user_id
       GROUP BY u.user_id, u.role_id, u.email, u.password_hash, u.first_name, u.last_name,
                u.phone_number, u.address, u.biography, u.profile_picture, u.background_picture,
                u.date_of_birth, u.coins, u.allow_commission, u.follow_counts, u.follower_count,
                u.login_failed_counts, u.login_failed_time, u.is_active, u.last_login, u.created_at
       ORDER BY popularity DESC`,
      { type: QueryTypes.SELECT }
    );

    return users;
  };

  lockAccount = async (id: string) => {
    const user = await userModel.findByPk(id);
    if (!user) return null;
    return user.update({ isActive: false });
  };

  unlockAccount = async (id: string) => {
    const user = await userModel.findByPk(id);
    if (!user) return null;
    return user.update({ isActive: true });
  };

  updateProfile = async (id: string, data: Partial<IUser>) => {
    const { firstName, lastName, address, dateOfBirth, phoneNumber, biography } = data;

    const user = await userModel.findByPk(id);
    if (!user) return null;
    await user.update({
      firstName,
      lastName,
      address,
      dateOfBirth: dateOfBirth || null,
      phoneNumber,
      biography,
    });
    return userModel.findByPk(id, { include: ROLE_INCLUDE });
  };

  updateCoinByUserId = async (userID: any, amount: number) => {
    const user = await userModel.findByPk(userID);
    if (!user) return null;
    return user.update({ coins: amount });
  };
  getUserIsActive = async () => {
    try {
      const listArtwork = await userModel.findAll({ where: { isActive: true } });
      return listArtwork;
    } catch (error: any) {
      throw new Error(`fail to get List artwork by tag: ${error.message}`);
    }
  };
  updateCoinForPayment = async (userID: any, amount: number) => {
    const currentUser = await this.getById(userID);
    const currentCoins = Number(currentUser?.coins ?? 0);
    const coin = currentCoins + amount;
    if (!currentUser) return null;
    return currentUser.update({ coins: coin });
  };

  getNumberOfUsers = async (): Promise<number> => {
    try {
      const count = await userModel.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to get number of users: ${error.message}`);
    }
  };

  uploadAvatar = async (id: string, avatar: string) => {
    const avatarImagechange = await uploadImage(avatar, 1, false);
    const user = await userModel.findByPk(id);
    if (!user) return null;
    return user.update({ profilePicture: avatarImagechange.secure_url });
  };

  uploadBackground = async (id: string, cover: string) => {
    const coverImagechange = await uploadImage(cover, 2, false);
    console.log(coverImagechange);
    const user = await userModel.findByPk(id);
    if (!user) return null;
    return user.update({ backgroundPicture: coverImagechange.secure_url });
  };

  getAvatar = async (id: string) => {
    return userModel.findByPk(id, { attributes: ["_id", "profilePicture"] });
  };

  getBackground = async (id: string) => {
    return userModel.findByPk(id, { attributes: ["_id", "backgroundPicture"] });
  };
}
