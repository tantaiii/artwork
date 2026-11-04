import { FollowModel } from "./follow.model";
import UserModel from "../users/user.model";

export const FollowService = {
  async followUser(followerId: string, followingId: string) {
    if (!followerId || !followingId) {
      throw new Error("Invalid user id format");
    }

    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const existing = await FollowModel.findOne({ where: { followerId, followingId } });
    let newFollow;
    if (existing) {
      if (!existing.status) {
        existing.status = true;
        existing.dateFollow = new Date();
        await existing.save();
      } else {
        throw new Error("Already following");
      }
    } else {
      newFollow = await FollowModel.create({
        followerId,
        followingId,
        dateFollow: new Date(),
      } as any);
    }

    await UserModel.increment("followCounts", { by: 1, where: { _id: followerId } as any });
    await UserModel.increment("followerCount", { by: 1, where: { _id: followingId } as any });

    return newFollow;
  },

  async unfollowUser(followerId: string, followingId: string) {
    if (!followerId || !followingId) {
      throw new Error("Invalid user id format");
    }

    const follow = await FollowModel.findOne({ where: { followerId, followingId, status: true } });
    if (!follow) throw new Error("Not following");

    follow.status = false;
    await follow.save();

    await UserModel.increment("followCounts", { by: -1, where: { _id: followerId } as any });
    await UserModel.increment("followerCount", { by: -1, where: { _id: followingId } as any });

    return { message: "Unfollowed successfully" };
  },

  async isFollowing(followerId: string, followingId: string) {
    if (!followerId || !followingId) {
      throw new Error("Invalid user id format");
    }

    const exists = await FollowModel.findOne({ where: { followerId, followingId, status: true } });
    return { isFollowing: !!exists };
  },
};
