// src/services/conversation.service.ts
import { GenericService } from "../../core/services/base.service";
import conversationModel, { IConversation } from "./conversation.model";
import UserModel from "../users/user.model";
import { AIService } from "./ai.service";

export class conversationService extends GenericService<IConversation> {
  constructor() {
    super(conversationModel);
  }

  deductCoins = async (userId: string) => {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new Error("User not found");

    const current = typeof user.coins === "string" ? parseFloat(user.coins) : Number(user.coins);
    if (isNaN(current) || current < 0.5) throw new Error("Not enough coins");

    user.coins = Number((current - 0.5).toFixed(2));
    await user.save();
  };

  generateAndSave = async (prompt: string, userId: string) => {
    const apiKey = process.env.LIGHTX_API_KEY;
    if (!apiKey) throw new Error("LIGHTX_API_KEY not set");

    await this.deductCoins(userId);
    const imageUrl = await AIService.generateImage(prompt, apiKey);

    return conversationModel.create({
      userId,
      prompt,
      imageUrl,
    } as any);
  };

  getAllConversationsByUserId = async (userId: string) => {
    const conversations = await conversationModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return conversations;
  };
}
