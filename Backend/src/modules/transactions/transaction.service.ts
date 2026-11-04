import { Op } from "sequelize";
import { GenericService } from "../../core/services/base.service";
import transactionModel, { ITransaction } from "./transaction.model";
import { artworkService } from "../artworks/artwork.service";
import { userService } from "../users/user.service";
import { IArtwork } from "../artworks/artwork.model";
import { UserSql, ArtworkSql } from "../../models/sql";

export class TransactionService extends GenericService<ITransaction> {
  constructor() {
    super(transactionModel);
  }
  artworkService = new artworkService();
  userService = new userService();

  createTransaction = async (transaction: any) => {
    // Accept either legacy `buyerID`/`sellerID`/`artworkID` (capital ID,
    // still sent by transaction.controller.ts) or the SQL attribute names.
    const artworkID: string = transaction.artworkID ?? transaction.artworkId;
    const buyerID: string = transaction.buyerID ?? transaction.buyerId;
    const sellerID: string | undefined = transaction.sellerID ?? transaction.sellerId;

    const isArtworkPurchased = (await this.artworkService.getById(artworkID)) as IArtwork;
    if (isArtworkPurchased.purchasable === false) {
      throw new Error("Artwork is not available for purchase");
    }
    // NOTE: `artworks` module hasn't been migrated to SQL yet as of this
    // change, so IArtwork is still the Mongoose shape and its owner field
    // is `userID` (capital ID). Once artworks/artwork.model.ts is migrated
    // to ArtworkSql this becomes `userID` -> `userId` and this comparison
    // (and the `sellerId` fallback below) must be updated to match.
    const sellerId = sellerID ?? (isArtworkPurchased as any).userID ?? (isArtworkPurchased as any).userId;
    if ((isArtworkPurchased as any).userID === buyerID || (isArtworkPurchased as any).userId === buyerID) {
      throw new Error("Buyer cannot be the same as the seller");
    }

    await this.userService.updateCoinByUserId(buyerID, transaction.price as number);
    const price = isArtworkPurchased.price as number;

    const newTransaction = await transactionModel.create({
      buyerId: buyerID,
      sellerId,
      artworkId: artworkID,
      price,
      dateToBuy: new Date(),
    } as any);

    return newTransaction;
  };

  getTransactionsByArtworkId = async (artworkID: string, buyerID: string) => {
    if (!artworkID || !buyerID) {
      throw new Error("Artwork ID and Buyer ID are required");
    }
    const response = await transactionModel.findOne({
      where: { artworkId: artworkID, buyerId: buyerID } as any,
      include: [
        { model: ArtworkSql, as: "artwork" },
        { model: UserSql, as: "buyer" },
        { model: UserSql, as: "seller" },
      ],
    });
    return response;
  };

  getTransactionsByBuyerId = async (buyerID: string, page: number, limit: number) => {
    if (!buyerID) {
      throw new Error("Buyer ID is required");
    }
    if (limit < 1 || limit > 100) limit = 10;
    const offset = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      transactionModel.findAll({
        where: { buyerId: buyerID } as any,
        include: [
          { model: ArtworkSql, as: "artwork", attributes: ["price"] },
          { model: UserSql, as: "buyer", attributes: ["firstName", "lastName"] },
          { model: UserSql, as: "seller", attributes: ["firstName", "lastName"] },
        ],
        order: [["_id", "DESC"]],
        offset,
        limit,
      }),
      transactionModel.count({ where: { buyerId: buyerID } as any }),
    ]);

    return {
      transactions: transactions,
      totalItems: total,
    };
  };

  getTransactionsBySellerId = async (sellerID: string, page: number, limit: number) => {
    if (!sellerID) {
      throw new Error("Seller ID is required");
    }
    if (limit < 1 || limit > 100) limit = 10;
    const offset = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      transactionModel.findAll({
        where: { sellerId: sellerID } as any,
        include: [
          { model: ArtworkSql, as: "artwork", attributes: ["price"] },
          { model: UserSql, as: "buyer", attributes: ["firstName", "lastName"] },
          { model: UserSql, as: "seller", attributes: ["firstName", "lastName"] },
        ],
        order: [["_id", "DESC"]],
        offset,
        limit,
      }),
      transactionModel.count({ where: { sellerId: sellerID } as any }),
    ]);

    return {
      transactions: transactions,
      totalItems: total,
    };
  };

  getAllTransactions = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const response = await transactionModel.findAll({
      include: [
        { model: ArtworkSql, as: "artwork", attributes: ["artworkName"] },
        { model: UserSql, as: "buyer", attributes: ["firstName", "lastName", "profilePicture"] },
        { model: UserSql, as: "seller", attributes: ["firstName", "lastName", "profilePicture"] },
      ],
      order: [["_id", "DESC"]],
      offset,
      limit,
    });

    const total = await transactionModel.count();

    return { transactions: response, totalItems: total };
  };

  getTransactionInthisMonth = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const transactions = await transactionModel.findAll({
      where: {
        dateToBuy: {
          [Op.gte]: startOfMonth,
          [Op.lt]: endOfMonth,
        },
      } as any,
      attributes: ["_id", "sellerId", "buyerId", "artworkId", "price", "dateToBuy"],
      include: [
        { model: UserSql, as: "seller", attributes: ["firstName", "lastName", "profilePicture"] },
        { model: UserSql, as: "buyer", attributes: ["firstName", "lastName", "profilePicture"] },
        { model: ArtworkSql, as: "artwork", attributes: ["artworkName", "price"] },
      ],
    });

    return transactions;
  };

  async getTransactionsLast30Days() {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    start.setUTCHours(0, 0, 0, 0);

    return transactionModel.findAll({
      where: {
        dateToBuy: { [Op.gte]: start, [Op.lt]: end },
      } as any,
      attributes: ["_id", "sellerId", "buyerId", "artworkId", "price", "dateToBuy"],
      order: [["dateToBuy", "DESC"]],
      raw: true,
    });
  }
}
