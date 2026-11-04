// src/controllers/conversation.controller.ts
import { GenericController } from "../../core/controllers/base.controller";
import { IConversation } from "./conversation.model";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import { conversationService } from "./conversation.service";

export class conversationController extends GenericController<IConversation> {
  private ConversationService: conversationService;

  constructor(conversationService: conversationService) {
    super(conversationService);
    this.ConversationService = conversationService;
  }

  generateImage = async (req: any, res: any) => {
    try {
      const { prompt } = req.body;
      const userId = req.user?.id || req.user?._id;

      if (!prompt) {
        return res.status(400).json(responseWrapper("error", "Prompt is required"));
      }
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const conversation = await this.ConversationService.generateAndSave(prompt, userId);

      // Ép kiểu để truy cập ._id và các field
      const conv = conversation as any as IConversation & { _id: any };

      return res.json(
        responseWrapper("success", "Image generated successfully", {
          conversationId: conv._id.toString(),
          UserId: conv.userId.toString(), // ← Trả về UserId
          ImageUrl: conv.imageUrl, // ← Trả về URL ảnh
          CreatedAt: conv.createdAt, // ← Trả về thời gian tạo
        })
      );
    } catch (error: any) {
      return res
        .status(500)
        .json(responseWrapper("error", error.message || "Internal server error"));
    }
  };

  getUserConversations = async (req: any, res: any) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      const conversations = await this.ConversationService.getAllConversationsByUserId(userId);
      // Keep the same PascalCase shape `generateImage` returns (Frontend's
      // ArtHubAI.tsx reads c.Prompt/c.ImageUrl/c.CreatedAt for both endpoints).
      const formatted = conversations.map((c: any) => ({
        conversationId: c._id,
        _id: c._id,
        UserId: c.userId,
        Prompt: c.prompt,
        ImageUrl: c.imageUrl,
        CreatedAt: c.createdAt,
      }));
      return res.json(
        responseWrapper("success", "Conversations retrieved successfully", formatted)
      );
    } catch (error: any) {
      return res
        .status(500)
        .json(responseWrapper("error", error.message || "Internal server error"));
    }
  };
}
