import { replyCommentService } from "./reply.service";
import { IReplyComment } from "./reply.model";
import { GenericController } from "../../core/controllers/base.controller";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class ReplyController extends GenericController<IReplyComment> {
  private ReplyCommentService: replyCommentService;
  constructor(replyCommentService: replyCommentService) {
    super(replyCommentService);
    this.ReplyCommentService = replyCommentService;
  }

  saveReplyComment = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      req.body.userId = id;
      const replyComment = await this.ReplyCommentService.saveReplyComment(req.body);
      res.json(responseWrapper("success", "Reply comment saved successfully", replyComment));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Save reply comment failed", error));
    }
  };

  getRepliesByCommentId = async (req: Request, res: Response) => {
    try {
      const commentId = req.params.commentId;
      const replies = await this.ReplyCommentService.getRepliesByCommentId(commentId);
      res.json(responseWrapper("success", "Replies fetched successfully", replies.reverse()));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Fetch replies failed", error));
    }
  };

  getReplyByThreadId = async (req: Request, res: Response) => {
    try {
      const commentId = req.params.commentId;
      const reply = await this.ReplyCommentService.getRepliesByCommentThreadId(commentId);
      res.json(responseWrapper("success", "Reply fetched successfully", reply));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Fetch reply failed", error));
    }
  };
}
