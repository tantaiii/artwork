import { GenericService } from "../../core/services/base.service";
import { IWithdraw } from "./withdraw.model";
import withdrawModel from "./withdraw.model";
import { userService } from "../users/user.service";
import { UserSql } from "../../models/sql";

export class withdrawService extends GenericService<IWithdraw> {
  constructor() {
    super(withdrawModel);
  }
  UserService = new userService();

  getAllWithdraws = async () => {
    return withdrawModel.findAll({ include: [{ model: UserSql, as: "user" }] });
  };

  createWithdraw = async (withdraw: any) => {
    // Controller sets `withdraw.user` (legacy Mongoose field name) to the
    // requesting user's id; the SQL column/attribute is `userId`.
    const userId: string = withdraw.user ?? withdraw.userId;
    const user = await this.UserService.getById(userId);
    if (!user) throw new Error("User not found");
    var coin = Number(user.coins) - withdraw.amount;
    await this.UserService.updateCoinByUserId(userId, coin);
    return withdrawModel.create({
      userId,
      amount: withdraw.amount,
      bankNumber: withdraw.bankNumber,
      bankName: withdraw.bankName,
      status: withdraw.status ?? "pending",
      message: withdraw.message ?? null,
      dateRequested: new Date(),
    } as any);
  };

  updateStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected",
    message?: string
  ) => {
    const withdraw = await withdrawModel.findByPk(id);
    if (!withdraw) return null;
    return withdraw.update({ status, message });
  };
}
