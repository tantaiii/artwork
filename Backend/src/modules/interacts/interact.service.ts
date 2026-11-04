import { GenericService } from "../../core/services/base.service";
import interactModel, { IInteract } from "./interact.model";
import { ArtworkSql, ThreadSql, UserSql } from "../../models/sql";
import { Op } from "sequelize";

export class InteractService extends GenericService<IInteract> {
    constructor() {
        super(interactModel);
    }

    // ======================= LIKE - ARTWORK =======================

    async toggleLike(userID: string, artworkID: string): Promise<boolean> {
        const existing = await interactModel.findOne({
            where: { userId: userID, artworkId: artworkID, activityType: "LIKE" },
        });

        if (existing) {
            existing.status = !existing.status;
            await existing.save();

            const delta = existing.status ? 1 : -1;
            await this.updateLikeCount(artworkID, delta);
            return existing.status;
        }

        await interactModel.create({
            userId: userID,
            artworkId: artworkID,
            activityType: "LIKE",
            status: true,
        } as any);

        await this.updateLikeCount(artworkID, 1);
        return true;
    }

    async isLike(userID: string, artworkID: string): Promise<boolean> {
        const found = await interactModel.findOne({
            where: { userId: userID, artworkId: artworkID, activityType: "LIKE", status: true },
        });
        return !!found;
    }

    async getLikeArtworks(userID: string) {
        const likes = await interactModel.findAll({
            where: { userId: userID, activityType: "LIKE", status: true },
            include: [{ model: ArtworkSql, as: "artwork" }],
        });

        return likes.map((l: any) => l.artwork);
    }

    async getLikeCount(artworkID: string): Promise<number> {
        try {
            const artwork = await ArtworkSql.findByPk(artworkID, { attributes: ["likes"] });
            return artwork ? (artwork as any).likes || 0 : 0;
        } catch {
            return 0;
        }
    }

    private async updateLikeCount(artworkID: string, delta: number) {
        await ArtworkSql.increment({ likes: delta } as any, { where: { _id: artworkID } as any });

        await ArtworkSql.update(
            { likes: 0 } as any,
            { where: { _id: artworkID, likes: { [Op.lt]: 0 } } as any }
        );
    }

    // ======================= FAVOURITE =======================

    async toggleFavourite(userID: string, artworkID: string): Promise<boolean> {
        const existing = await interactModel.findOne({
            where: { userId: userID, artworkId: artworkID, activityType: "FAVOURITE" },
        });

        if (existing) {
            existing.status = !existing.status;
            await existing.save();

            const delta = existing.status ? 1 : -1;
            await this.updateFavouriteCount(artworkID, delta);
            return existing.status;
        }

        await interactModel.create({
            userId: userID,
            artworkId: artworkID,
            activityType: "FAVOURITE",
            status: true,
        } as any);

        await this.updateFavouriteCount(artworkID, 1);
        return true;
    }

    async isFavourite(userID: string, artworkID: string): Promise<boolean> {
        const found = await interactModel.findOne({
            where: { userId: userID, artworkId: artworkID, activityType: "FAVOURITE", status: true },
        });
        return !!found;
    }

    async getFavouriteArtworks(userID: string) {
        const favourites = await interactModel.findAll({
            where: { userId: userID, activityType: "FAVOURITE", status: true },
            include: [{ model: ArtworkSql, as: "artwork" }],
        });

        return favourites.map((f: any) => f.artwork);
    }

    async getFavouriteCount(artworkID: string): Promise<number> {
        try {
            const artwork = await ArtworkSql.findByPk(artworkID, { attributes: ["favorites"] });
            return artwork ? (artwork as any).favorites || 0 : 0;
        } catch {
            return 0;
        }
    }

    private async updateFavouriteCount(artworkID: string, delta: number) {
        await ArtworkSql.increment({ favorites: delta } as any, { where: { _id: artworkID } as any });

        await ArtworkSql.update(
            { favorites: 0 } as any,
            { where: { _id: artworkID, favorites: { [Op.lt]: 0 } } as any }
        );
    }

    // ======================= LIKE - THREAD =======================
    async toggleLikeForThread(userID: string, threadID: string): Promise<boolean> {
        const existing = await interactModel.findOne({
            where: { userId: userID, threadId: threadID, activityType: "LIKE" },
        });

        if (existing) {
            existing.status = !existing.status;
            await existing.save();

            const delta = existing.status ? 1 : -1;
            await this.updateLikeCountForThread(threadID, delta);
            return existing.status;
        }

        await interactModel.create({
            userId: userID,
            threadId: threadID,
            activityType: "LIKE",
            status: true,
        } as any);

        await this.updateLikeCountForThread(threadID, 1);
        return true;
    }

    async isLikeForThread(userID: string, threadID: string): Promise<boolean> {
        const found = await interactModel.findOne({
            where: { userId: userID, threadId: threadID, activityType: "LIKE", status: true },
        });
        return !!found;
    }

    async getLikeCountForThread(threadID: string): Promise<number> {
        try {
            const thread = await ThreadSql.findByPk(threadID, { attributes: ["likes"] });
            return thread ? (thread as any).likes || 0 : 0;
        } catch {
            return 0;
        }
    }

    private async updateLikeCountForThread(threadID: string, delta: number) {
        await ThreadSql.increment({ likes: delta } as any, { where: { _id: threadID } as any });

        await ThreadSql.update(
            { likes: 0 } as any,
            { where: { _id: threadID, likes: { [Op.lt]: 0 } } as any }
        );
    }

    async getAllActivities(page: number, limit: number) {
        const offset = (page - 1) * limit;

        const { rows, count } = await interactModel.findAndCountAll({
            where: { activityType: { [Op.in]: ["LIKE", "FAVOURITE"] } },
            include: [
                {
                    model: ArtworkSql,
                    as: "artwork",
                    attributes: ["_id", "userId"],
                    include: [{ model: UserSql, as: "artist", attributes: ["firstName", "lastName"] }],
                },
                {
                    model: ThreadSql,
                    as: "thread",
                    attributes: ["_id", "userId"],
                    include: [{ model: UserSql, as: "user", attributes: ["firstName", "lastName"] }],
                },
                { model: UserSql, as: "user", attributes: ["firstName", "lastName"] },
            ],
            order: [["createdAt", "DESC"]],
            offset,
            limit,
        });

        return { activities: rows, totalItems: count };
    }

}
