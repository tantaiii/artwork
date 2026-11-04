import { GenericController } from "../../core/controllers/base.controller";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { threadService } from "./thread.service";
import { IThread } from "./thread.model";

export class threadController extends GenericController<IThread> {
  private ThreadService: threadService;
  constructor(threadService: threadService) {
    super(threadService);
    this.ThreadService = threadService;
  }
  GetThreadsByTopicId = async (req: any, res: any) => {
    try {
      const topicId: string = req.params.topicId;
      const threads = await this.ThreadService.GetThreadsByTopicId(topicId);
      res.status(200).json(responseWrapper("success", "Fetched threads successfully", threads));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to fetch threads", error));
    }
  };

  InsertThread = async (req: any, res: any) => {
    try {
      const data: Partial<IThread> = req.body;
      const newThread = await this.ThreadService.InsertThread(data);
      res.status(201).json(responseWrapper("success", "Thread created successfully", newThread));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to create thread", error));
    }
  };
  GetThreadById = async (req: any, res: any) => {
    try {
      const threadId: string = req.params.threadId;
      const thread = await this.ThreadService.GetThreadById(threadId);
      res.status(200).json(responseWrapper("success", "Fetched thread successfully", thread));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to fetch thread", error));
    }
  };
}
