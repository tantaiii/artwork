import { Op } from "sequelize";
import { GenericService } from "../../core/services/base.service";
import paymentModel, { IPayment } from "./payment.model";
import { UserSql } from "../../models/sql";

export class paymentService extends GenericService<IPayment> {
  constructor() {
    super(paymentModel);
  }

  purchaseCoins = async (data: Partial<IPayment>) => {
    return await paymentModel.create(data as any);
  };

  acceptPayment = async (orderCode: number | string) => {
    const payment = await paymentModel.findOne({ where: { orderCode: String(orderCode) } });
    if (!payment) return null;
    return payment.update({ status: true });
  };

  getPaymentbyUserID = async (userID: string, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      paymentModel.findAll({
        where: { userId: userID },
        include: [{ model: UserSql, as: "user", attributes: ["firstName", "lastName"] }],
        order: [["_id", "DESC"]],
        offset,
        limit,
      }),
      paymentModel.count({ where: { userId: userID } }),
    ]);
    return { payments, total };
  };

  getAllPayment = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const getAllPayment = await paymentModel.findAll({
      include: [
        { model: UserSql, as: "user", attributes: ["firstName", "lastName", "profilePicture"] },
      ],
      order: [["_id", "DESC"]],
      offset,
      limit,
    });

    const total = await paymentModel.count();

    return { payments: getAllPayment, total: total };
  };

  async getPaymentSuccessIn30days() {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    const status = true;

    start.setUTCHours(0, 0, 0, 0);

    return paymentModel.findAll({
      where: {
        dateCreated: { [Op.gte]: start, [Op.lt]: end },
        status: status,
      },
      attributes: ["_id", "userId", "amount", "dateCreated"],
      order: [["dateCreated", "DESC"]],
      raw: true,
    });
  }
}
