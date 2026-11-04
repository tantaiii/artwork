import { Request, Response } from "express";
import { FollowService } from "./follow.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
import jwt from "jsonwebtoken";
import { sendToUser } from "../../sockets/clientManager";
import { IFollow } from "./follow.model";
import { notificationService } from "../notifications/notification.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const FollowController = {
  async followUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { followingId } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await FollowService.followUser(id, followingId);
      const newNotification = await new notificationService().createNotificationFromFollow(
        result as IFollow
      );
      sendToUser(followingId, {
        type: "FOLLOW",
        notification: newNotification,
      });
      res.status(200).json(responseWrapper("success", "Followed successfully", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", err.message));
    }
  },

  async unfollowUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { followingId } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await FollowService.unfollowUser(id, followingId);
      res.status(200).json(responseWrapper("success", result.message));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", err.message));
    }
  },

  async checkFollowing(req: AuthenticatedRequest, res: Response) {
    try {
      const { followingId } = req.params;

      const { id } = jwt.decode(req.headers["authorization"]?.split(" ")[1] as string) as {
        id: string;
      };

      const result = await FollowService.isFollowing(id, followingId);
      res.status(200).json(responseWrapper("success", "", result));
    } catch (err: any) {
      res.status(500).json(responseWrapper("error", err.message));
    }
  },
};
