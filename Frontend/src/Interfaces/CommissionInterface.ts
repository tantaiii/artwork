import { User } from "./UserInterface";

export interface Commission{
    _id: string;
    requestor: User;
    reciever: User;
    phoneNumber: string;
    email: string;
    description: string;
    accept: boolean;
    creationDate: Date;
    acceptanceDate: Date;
    completionDate: Date;
    progress: number;
    message: string;
    artworkURL: string;
}