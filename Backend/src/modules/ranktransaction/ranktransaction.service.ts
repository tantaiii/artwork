import { Op } from "sequelize";
import { GenericService } from "../../core/services/base.service";
import rankTransactionModel, { IRankTransaction } from "./ranktransaction.model";
import { userService } from "../users/user.service";

export class RankTransactionService extends GenericService<IRankTransaction> {
  constructor() {
    super(rankTransactionModel);
  }
  userServices = new userService();

  // Mapped to the fixed rank ids seeded by arthub.sql (Section 8: SEED DATA),
  // replacing the old Mongo ObjectId-keyed map (which pointed at ids from a
  // ranks collection that no longer exists post-migration).
  separateRankID = (typeID: string): number => {
    const map: Record<string, number> = {
      rank_free: 10,
      rank_vip: 15,
      rank_premium: 20,
    };

    return map[typeID] ?? -1;
  };

  upgradeRankForUser = async (data: any, coin: number) => {
    // Accept either the legacy `userID`/`rankID` keys (still sent by the
    // controller/frontend) or the SQL attribute names directly.
    const userID: string = data.userID ?? data.userId;
    const rankID: string = data.rankID ?? data.rankId;

    const isExist = await this.getTransactionByUserID(userID);
    const limitUpload = this.separateRankID(rankID);
    const dateNow = new Date();

    if (
      isExist &&
      dateNow >= isExist.dateStartToRent &&
      isExist.dateEndToRent &&
      dateNow <= isExist.dateEndToRent
    ) {
      return { success: false, message: "Your current rank is still active" };
    }

    const dateStart = dateNow;
    if (isNaN(dateStart.getTime())) {
      throw new Error("Invalid start date");
    }

    const dateEndToRent = new Date(dateStart);
    dateEndToRent.setDate(dateEndToRent.getDate() + 30);

    const transaction = await rankTransactionModel.create({
      userId: userID,
      rankId: rankID,
      dateEndToRent: dateEndToRent,
      dateStartToRent: dateStart,
      limitUpload: limitUpload,
    } as any);

    const payUpgradeFee = await this.userServices.updateCoinByUserId(userID, coin);

    if (!payUpgradeFee) {
      throw new Error("Failed to update user's coin balance");
    }

    return transaction;
  };

  getTransactionByUserID = async (userID: any) => {
    const date = new Date();

    const transaction = await rankTransactionModel.findOne({
      where: {
        userId: userID,
        dateStartToRent: { [Op.lte]: date },
        dateEndToRent: { [Op.gte]: date },
      },
      order: [["_id", "DESC"]],
    });
    return transaction;
  };

  upgradeToArtist = async () => {
    // Original Mongoose code created an empty document here (`new Model()`
    // then `.create()` on it) — userId/rankId are NOT NULL in SQL so an
    // empty create would fail. This method is not actually wired to any
    // route (ranktransaction.routes.ts's "/upgrade-to-artist" uses the
    // generic controller `.create`, not this method), so it's effectively
    // dead code; left as a no-op-safe stub rather than guessing real data.
    return await rankTransactionModel.create({} as any);
  };
}
