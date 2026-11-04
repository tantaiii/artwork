import { Op } from "sequelize";
import { GenericService } from "../../core/services/base.service";
import chatModel, { IChat } from "./chat.model";
import { UserSql } from "../../models/sql";

const USER_INCLUDE = [
  { model: UserSql, as: "user1" as const },
  { model: UserSql, as: "user2" as const },
];

export class chatService extends GenericService<IChat> {
  constructor() {
    super(chatModel);
  }
  getChatSelf = async (id: string) =>
    chatModel.findAll({
      where: { [Op.or]: [{ user1Id: id }, { user2Id: id }] },
      include: USER_INCLUDE,
    });

  createChatSelf = async (data: Partial<IChat>) => chatModel.create(data as any);

  getChatByIdPopulate = async (id: string) =>
    chatModel.findByPk(id, { include: USER_INCLUDE });

  checkExistChatUser1AndUser2 = async (user1Id: string, user2Id: string) =>
    chatModel.findOne({
      where: {
        [Op.or]: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
      include: USER_INCLUDE,
    });

  markAsReadByUserId = async (id: string) =>
    chatModel.update(
      { status: 1 },
      { where: { [Op.or]: [{ user1Id: id }, { user2Id: id }] } }
    );
}
