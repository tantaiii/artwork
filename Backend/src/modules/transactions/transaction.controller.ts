import { TransactionService } from "./transaction.service";
import { ITransaction } from "./transaction.model";
import { GenericController } from "../../core/controllers/base.controller";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class TransactionController extends GenericController<ITransaction> {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    super(transactionService);
    this.transactionService = transactionService;
  }

  getTransactionsByArtworkId = async (req: Request, res: Response) => {
    try {
      const artworkID = req.params.id;
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const response = await this.transactionService.getTransactionsByArtworkId(artworkID, id);
      if (response === null) {
        res.status(200).json(responseWrapper(false, "Transaction not found", response));
      } else {
        res.status(200).json(responseWrapper(true, "Transaction retrieved successfully", response));
      }
    } catch (error) {
      res.status(500).json(responseWrapper(false, "Transaction retrieval failed", error));
    }
  };

  creatTransaction = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      req.body.buyerID = id;
      const response = await this.transactionService.createTransaction(req.body);
      res
        .status(200)
        .json(responseWrapper("success", "Transaction created successfully", response));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Transaction creation failed", error));
    }
  };

  getTransactionsByBuyerId = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      const { page = 1, limit = 10 } = req.query;

      const response = await this.transactionService.getTransactionsByBuyerId(
        id,
        page as number,
        limit as number
      );
      res
        .status(200)
        .json(responseWrapper("success", "Transactions retrieved successfully", response));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Transactions retrieval failed", error));
    }
  };

  getTransactionsBySellerId = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const response = await this.transactionService.getTransactionsBySellerId(
        id,
        page as number,
        limit as number
      );
      res
        .status(200)
        .json(responseWrapper("success", "Transactions retrieved successfully", response));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Transactions retrieval failed", error));
    }
  };

  getAllTransactions = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const response = await this.transactionService.getAllTransactions(
        page as number,
        limit as number
      );
      res
        .status(200)
        .json(responseWrapper("success", "All transactions retrieved successfully", response));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Failed to retrieve all transactions", error));
    }
  };

  getTransactionInthisMonth = async (_req: Request, res: Response) => {
    try {
      const response = await this.transactionService.getTransactionsLast30Days();
      res
        .status(200)
        .json(
          responseWrapper("success", "Transactions of this month retrieved successfully", response)
        );
    } catch (error) {
      res
        .status(500)
        .json(responseWrapper("error", "Failed to retrieve transactions of this month", error));
    }
  };
}
