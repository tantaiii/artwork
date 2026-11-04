import { Request, Response } from "express";
import { GenericController } from "../../core/controllers/base.controller";
import { InteractService } from "./interact.service";
import { IInteract } from "./interact.model";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export class InteractController extends GenericController<IInteract> {
  private InteractService: InteractService;

  constructor(interactService: InteractService) {
    super(interactService);
    this.InteractService = interactService;
  }

  // ======================= LIKE - ARTWORK =======================

  toggleLike = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { artworkID } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const isLike = await this.InteractService.toggleLike(id, artworkID);
      const likeCount = await this.InteractService.getLikeCount(artworkID);

      return res.json(
        responseWrapper("success", "Toggled like successfully", {
          isLike,
          likeCount,
        })
      );
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  getLikeArtworks = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await this.InteractService.getLikeArtworks(id);
      res.json(responseWrapper("success", "Fetched liked artworks", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  isLike = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { artworkID } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await this.InteractService.isLike(id, artworkID);
      res.json(responseWrapper("success", "Fetched like status", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  getLikeCount = async (req: Request, res: Response) => {
    try {
      const { artworkID } = req.params;
      const result = await this.InteractService.getLikeCount(artworkID);
      res.json(responseWrapper("success", "Fetched like count", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  // ======================= FAVOURITE =======================

  toggleFavourite = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { artworkID } = req.params;
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const isFavourite = await this.InteractService.toggleFavourite(id, artworkID);
      const favouriteCount = await this.InteractService.getFavouriteCount(artworkID);

      return res.json(
        responseWrapper("success", "Toggled favourite successfully", {
          isFavourite,
          favouriteCount,
        })
      );
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  getFavouriteArtworks = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.params.userID;

      const result = await this.InteractService.getFavouriteArtworks(userId);
      return res.json(responseWrapper("success", "Fetched favourite artworks", result));
    } catch {
      return res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  isFavourite = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { artworkID } = req.params;
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await this.InteractService.isFavourite(id, artworkID);
      res.json(responseWrapper("success", "Fetched favourite status", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  getFavouriteCount = async (req: Request, res: Response) => {
    try {
      const { artworkID } = req.params;
      const result = await this.InteractService.getFavouriteCount(artworkID);
      res.json(responseWrapper("success", "Fetched favourite count", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  getAllActivities = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const response = await this.InteractService.getAllActivities(page, limit);

      res.status(200).json(
        responseWrapper("success", "All activities retrieved successfully", response)
      );
    } catch (error: any) {
      res.status(500).json(responseWrapper("error", "Failed to retrieve activities", error.message));
    }
  };

  // ======================= LIKE - THREAD =======================

  toggleLikeForThread = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { threadID } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const isLike = await this.InteractService.toggleLikeForThread(id, threadID);
      const likeCount = await this.InteractService.getLikeCountForThread(threadID);

      return res.json(
        responseWrapper("success", "Toggled like successfully", {
          isLike,
          likeCount,
        })
      );
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  isLikeForThread = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { threadID } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await this.InteractService.isLikeForThread(id, threadID);
      res.json(responseWrapper("success", "Fetched like status", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

  getLikeCountForThread = async (req: Request, res: Response) => {
    try {
      const { threadID } = req.params;
      const result = await this.InteractService.getLikeCountForThread(threadID);
      res.json(responseWrapper("success", "Fetched like count", result));
    } catch {
      res.status(500).json(responseWrapper("error", "Server error"));
    }
  };

}