import { IArtwork } from "./artwork.model";
import { GenericController } from "../../core/controllers/base.controller";
import { artworkService } from "../../modules/artworks/artwork.service";
import { Request, Response, NextFunction } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";

export class ArtworkController extends GenericController<IArtwork> {
  private ArtworkService: artworkService;
  constructor(artworkService: artworkService) {
    super(artworkService);
    this.ArtworkService = artworkService;
  }

  getTop10LikedArtworks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const artworks = await this.ArtworkService.getTop10LikedArtworks();
      res.json(responseWrapper("success", "Fetched top 10 artworks successfully", artworks));
    } catch (error) {
      next(error);
    }
  };

  uploadArtwork = async (req: Request, res: Response) => {
    try {
      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };
      req.body.userID = id;
      const artwork = await this.ArtworkService.uploadArtwork(req.body);
      res.json(responseWrapper("success", "Upload successfully", artwork));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Upload failed", error));
    }
  };

  getArtworkPopulated = async (req: Request, res: Response) => {
    try {
      const artwork = await this.ArtworkService.getArtworkPopulated(req.params.id);
      res.json(responseWrapper("success", "Fetch successfully", artwork));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Fetch failed", error));
    }
  };

  updateArtwork = async (req: Request, res: Response) => {
    const { artworkName, description, purchasable, price, tagID } = req.body;
    const { id } = req.params;

    try {
      const updatedArtwork = await this.ArtworkService.updateArtwork(
        {
          artworkName,
          description,
          purchasable,
          price,
          tagID,
        },
        id
      );
      if (updatedArtwork) {
        res.json(responseWrapper("success", "Update successfully", updatedArtwork));
      } else {
        res.json(responseWrapper("error", "Update failed"));
      }
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Update failed", error));
    }
  };

  deleteArtwork = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deleteArtwork = await this.ArtworkService.deleteArtwork(id);
      if (deleteArtwork) {
        res.json(responseWrapper(true, "Update successfully"));
      } else {
        res.json(responseWrapper(false, "Update successfully"));
      }
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Delete failed", error));
    }
  };

  countTotalComments = async (req: Request, res: Response) => {
    try {
      const total = await this.ArtworkService.countTotalComments(req.params.id);
      res.json(responseWrapper("success", "Total comments fetched successfully", { total }));
    } catch (error) {
      res.status(500).json(responseWrapper("error", "Count comments failed", error));
    }
  };

  getListArtworkByTagID = async (req: Request, res: Response) => {
    try {
      const listArtwork = await this.ArtworkService.getArtworkByTagId(req.params.tagId);
      if (listArtwork) {
        res.json(responseWrapper("success", "Get list artwork by tagId successfully", listArtwork));
      } else {
        res.json(responseWrapper("success", "Don't have a Artwork use this tag", listArtwork));
      }
    } catch (error: any) {
      res.json(responseWrapper("error", "Get artwork fail", error));
    }
  };

  updateStatusArtwork = async (req: Request, res: Response) => {
    const id = req.params.id || req.body?.id;
    let status = req.body?.status;
    try {
      if (!id) {
        return res.status(400).json(responseWrapper("error", "Missing id"));
      }

      if (typeof status === "undefined") {
        const artwork = await this.ArtworkService.getArtworkPopulated(id);
        if (!artwork) {
          return res.status(404).json(responseWrapper("error", "Artwork not found"));
        }
        status = artwork.status === "1" ? "0" : "1";
      }

      const updatedArtwork = await this.ArtworkService.updateStatusArtwork(id, String(status));
      if (updatedArtwork) {
        res.json(responseWrapper("success", "Update status successfully", updatedArtwork));
      } else {
        res.json(responseWrapper("error", "Update status failed"));
      }
    } catch (error: any) {
      res.json(responseWrapper("error", "Update status failed", error));
    }
  };

  getNumberOfArtworks = async (_req: Request, res: Response) => {
    try {
      const count = await this.ArtworkService.getNumberOfArtworks();
      res.json(responseWrapper("success", "Fetched number of artworks successfully", { count }));
    } catch (error: any) {
      res.json(responseWrapper("error", "Failed to get number of artworks", error));
    }
  };

  getArtworksByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const artworks = await this.ArtworkService.getArtworksByUserId(userId);
      res.json(responseWrapper("success", "Fetched artworks by user successfully", artworks));
    } catch (error) {
      next(error);
    }
  };
}
