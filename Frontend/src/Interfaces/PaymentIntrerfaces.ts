import { User } from "./UserInterface";

export interface Payment {
  userId: User;
  dateCreated: string;
  amount: string;
  status: boolean;
  orderCode: number;
}

export interface GetPaymentJava {
  paymentId: number;
  amount: number;
  transCode: string;
  userId: number;
  createdAt: string;
  status: string;
}

export interface MoneyTransfer {
  transferId: number;
  senderUserId: number;
  receiverUserId: number;
  amount: number;
  transferDate: string;
}

export interface QrInfor {
  amount: number;
  description: string;
  qrCode: string;
}
