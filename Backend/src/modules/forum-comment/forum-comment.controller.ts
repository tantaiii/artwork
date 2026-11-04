import { threadCommentService } from "./forum-comment.service";
import { IThreadComment } from "./forum-comment.model";
import { GenericController } from "../../core/controllers/base.controller";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class CommentController extends GenericController<IThreadComment> {
  private CommentService: threadCommentService;
  constructor(commentService: threadCommentService) {
    super(commentService);
    this.CommentService = commentService;
  }

  //functions here
  saveComment = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      req.body.userId = id;
      const comment = await this.CommentService.saveThreadComment(req.body);
      res.json(responseWrapper("success", "Comment saved successfully", comment));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Save comment failed", error));
    }
  };

  countCommentByThreadId = async (req: Request, res: Response) => {
    try {
      const threadId = req.params.id;
      const total = await this.CommentService.countTotalComment(threadId);
      res.json(responseWrapper("success", "Total comments fetched successfully", { total }));
    } catch (err) {
      res.status(500).json(responseWrapper("error", "Count comment failed", err));
    }
  };

  getCommentByThreadId = async (req: Request, res: Response) => {
    try {
      const threadId = req.params.threadId;
      const comments = await this.CommentService.getCommentsByThreadId(threadId);
      res.json(responseWrapper("success", "Comments fetched successfully", comments.reverse()));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Fetch comments failed", error));
    }
  };
}
