import { GenericService } from "../../core/services/base.service";
import { IFollow } from "../follow/follow.model";
import notificationModel, { INotification } from "./notification.model";
import { UserSql } from "../../models/sql";

export class notificationService extends GenericService<INotification> {
  constructor() {
    super(notificationModel);
  }

  getNotificationsByUserId = async (userId: string) => {
    try {
      const response = await notificationModel.findAll({
        where: { profileReceiveId: userId } as any,
        include: [{ model: UserSql, as: "notifier" }],
      });
      return response;
    } catch (err: any) {}
  };

  setReadNotificationByUserId = async (userId: string) => {
    try {
      await notificationModel.update(
        { isRead: true } as any,
        { where: { profileReceiveId: userId } as any }
      );
    } catch (err: any) {}
  };

  createNotificationFromFollow = async (data: IFollow) => {
    try {
      const created = await notificationModel.create({
        followId: data._id,
        message: `#3 You have new follower!`,
        createdAt: new Date(),
        profileNotifyId: data.followerId,
        profileReceiveId: data.followingId,
        isRead: false,
      } as any);

      return notificationModel.findByPk(created._id, {
        include: [{ model: UserSql, as: "notifier" }],
      });
    } catch (err: any) {}
  };
}
