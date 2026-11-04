import { User } from "./UserInterface";

export interface ArtisForm {
  _id?: string;
  description: string;
  userId: User;
  status: boolean | null;
  dateCreation: Date;
}