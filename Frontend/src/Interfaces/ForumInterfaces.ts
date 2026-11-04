import { User } from "./UserInterface.ts";
export interface TypeOfTopic {
  _id?: string;
  TypeName: string;
}

export interface Topic {
  _id: string;
  title: string;
  typeId: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Thread {
  _id: string;
  titleThread: string;
  threadDescription: string;
  likes: number;
  comments: number;
  dateCreated: string;
  topicId: string;
  userId: User;
  __v?: number;
}
