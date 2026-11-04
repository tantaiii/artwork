import { User } from "./UserInterface";

export interface Comment {
  _id: string;
  commentDetail: string;
  artworkId: string;
  userId: string | User;
  dateCreated: Date;
} 