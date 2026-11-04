export interface Chat {
  _id: string | null;
  user1Id: number | null;
  user2Id: number | null;
  status: number | undefined;
}

export interface Message {
  messageId: number | undefined;
  senderId: number | undefined;
  receiverId: number | undefined;
  messageContent: string | null;
  dateSent: string | null;
  isRead: number | undefined;
}
