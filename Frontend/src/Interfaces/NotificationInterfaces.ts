import { User } from "./UserInterface";

export interface INotification {
  _id: string;
  message: string;
  createAt: Date;
  interactId: string;
  artworkId: string;
  profileNotifyId: string | User;
  followId: string;
  isRead: number;
  amount: number;
  profileReceiveId: string | User;
}
