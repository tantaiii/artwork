import { Op } from "sequelize";
import { GenericService } from "../../core/services/base.service";
import messageModel, { IMessage } from "./message.model";

export class messageService extends GenericService<IMessage> {
  constructor() {
    super(messageModel);
  }

  getMessagesSelf = async (id: string) => {
    return messageModel.findAll({ where: { [Op.or]: [{ senderId: id }, { receiverId: id }] } });
  };
}
