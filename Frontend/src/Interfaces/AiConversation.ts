import { User } from "./UserInterface";

export interface AiConversation {
  _id?: string;
  UserId: string | User;
  Prompt: string;
  ImageUrl: string;
  CreatedAt: Date;
}
