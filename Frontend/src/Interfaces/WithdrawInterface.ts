import { User } from "./UserInterface";

export interface WithdrawInterface {
    _id: string;
    amount: number;
    dateRequested: Date;
    user: User;
    bankNumber: string;
    bankName: string;
    status: "pending" | "approved" | "rejected";
    message: string | null;
}
