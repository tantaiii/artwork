import { IRankTransaction } from "./ranktransaction.model";
import { GenericController } from "../../core/controllers/base.controller";
import { RankTransactionService } from "./ranktransaction.service";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class RankTransactionController extends GenericController<IRankTransaction> {
  private rankTransactionService: RankTransactionService;

  constructor(rankTransactionService: RankTransactionService) {
    super(rankTransactionService);
    this.rankTransactionService = rankTransactionService;
  }

  upgradeRankForUser = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      req.body.userID = id;
      const coin = req.body.coin;
      const response = await this.rankTransactionService.upgradeRankForUser(req.body, coin);
      res.status(200).json(responseWrapper("success", "Upgrade success", response));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Upgrade failed"));
    }
  };

  getTransactionByUserID = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      const response = await this.rankTransactionService.getTransactionByUserID(id);
      if (!response) {
        return res
          .status(500)
          .json(responseWrapper(false, "User is using another package", response));
      }

      return res.status(200).json(responseWrapper(true, "Upgrade successful!", response));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Upgrade failed"));
    }
  };
}
