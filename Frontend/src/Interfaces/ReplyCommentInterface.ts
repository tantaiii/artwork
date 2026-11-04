import { User } from "./UserInterface";
import { Comment } from "./CommentInterface";

export interface ReplyComment {
    _id: string;
    replyDetail: string;
    commentId: string | Comment;
    userId: string | User;
    dateCreated: Date;
}