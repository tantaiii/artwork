import { GenericService } from "../../core/services/base.service";
import commentModel, { IComment } from "./comment.model";
import { UserSql } from "../../models/sql";

export class commentService extends GenericService<IComment> {
    constructor() {
        super(commentModel);
    }

    //Functions here

    saveArtworkComment = async (data: Partial<IComment>) => {
        try {
            return await commentModel.create({ ...data } as any);
        } catch (error: any) {
            throw new Error(`Save comment failed: ${error.message}`);
        }
    };
    countTotalComment = async (artworkId: string) => {
        try {
            const total = await commentModel.count({ where: { artworkId } });
            return total;
        } catch (error: any) {
            throw new Error(`Count comments failed: ${error.message}`);
        }
    };

    getCommentsByArtworkId = async (artworkId: string) => {
        if (!artworkId) return [];
        const comments = await commentModel.findAll({
            where: { artworkId },
            include: [{ model: UserSql, as: "user" }],
        });
        // Mongoose's .populate("userId") replaced the userId field in place with
        // the populated user document; Sequelize exposes it under the separate
        // "user" association alias instead, so re-map it back onto `userId` to
        // keep the shape the frontend (e.g. Comments.jsx -> comment.userId) expects.
        return comments.map((c) => {
            const plain: any = c.toJSON();
            return { ...plain, userId: plain.user ?? plain.userId };
        });
    }
}