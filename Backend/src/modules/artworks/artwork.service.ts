import { GenericService } from "../../core/services/base.service";
import artworkModel, { IArtwork } from "./artwork.model";
import { uploadImage } from "../../utils/imageUtils";
import commentModel from "../comments/comment.model";
import replyCommentModel from "../replycomments/reply.model";
import { TagSql, UserSql, ArtworkSql } from "../../models/sql";
import { literal } from "sequelize";

const TAG_INCLUDE = { model: TagSql, as: "tagID" as const };
const ARTIST_INCLUDE = { model: UserSql, as: "artist" as const };

export class artworkService extends GenericService<IArtwork> {
  constructor() {
    super(artworkModel);
  }

  // Reconstructs the flattened SQL columns (imageFileFE/preview/image) back
  // into the nested `imageFile: { imageFileFE, preview, image }` object the
  // old Mongoose-embedded shape had, so the frontend (which still reads
  // artwork.imageFile.image etc.) keeps working unchanged. Also re-maps the
  // `artist` association (if it was included) back onto a `userID` key,
  // mirroring the old Mongoose in-place `.populate("userID")` behavior, since
  // Sequelize can't reuse the `userId` FK attribute name for both the raw id
  // and the populated object.
  private toClientShape = (row: ArtworkSql) => {
    const plain: any = row.toJSON();
    const { imageFileFE, preview, image, artist, ...rest } = plain;
    return {
      ...rest,
      imageFile: { imageFileFE, preview, image },
      userID: artist ?? plain.userId,
    };
  };

  // Overrides GenericService.getByStatus() (base implementation queries
  // `{ status: 1 }` as a number, and returns raw rows with no shape
  // reconstruction). Used by the plain listing routes ("GET /" and
  // "GET /search" in artwork.routes.ts). The original Mongoose base method
  // never populated userID/tagID for this listing either, so this keeps that
  // same (unpopulated) behavior and only reconstructs the nested `imageFile`
  // object, matching the embedded-doc shape artworks used to come back with.
  getByStatus = async () => {
    const artworks = await artworkModel.findAll({ where: { status: "1" } as any });
    return artworks.map((a) => {
      const plain: any = a.toJSON();
      const { imageFileFE, preview, image, ...rest } = plain;
      return { ...rest, imageFile: { imageFileFE, preview, image } };
    });
  };

  uploadArtwork = async (data: any) => {
    try {
      let image, preview;
      if (data.purchasable) {
        ({ image, preview } = await uploadImage(data.imageFile?.imageFileFE!, 3, true));
      } else {
        ({ image, preview } = await uploadImage(data.imageFile?.imageFileFE!, 3, false));
      }

      const { userID, tagID, imageFile, ...rest } = data;

      const artwork = await artworkModel.create({
        ...rest,
        userId: userID,
        imageFileFE: imageFile?.imageFileFE,
        image: image.secure_url,
        preview: preview?.secure_url || "",
      } as any);

      if (Array.isArray(tagID) && tagID.length) {
        await (artwork as any).setTagID(tagID);
      }

      const plain: any = artwork.toJSON();
      return {
        ...plain,
        userID,
        tagID: tagID || [],
        imageFile: {
          imageFileFE: plain.imageFileFE,
          preview: plain.preview,
          image: plain.image,
        },
      };
    } catch (error: any) {
      throw new Error(`Upload artwork failed: ${error.message}`);
    }
  };

  async getTop10LikedArtworks(): Promise<any[]> {
    try {
      // Original Mongo pipeline: $addFields score -> $sort -> $limit 10 ->
      // $lookup tags/users -> $project a specific subset (tags/creator as
      // arrays, matching Mongo's $lookup output shape). Reimplemented with a
      // Sequelize computed `score` literal + order/limit (Sequelize
      // automatically wraps this in a subquery because of the M:N `include`,
      // so the limit applies to artworks, not to the joined rows) and then
      // reshaped in JS to match the old $project output exactly.
      const scoreExpr =
        "(ISNULL(likes, 0) * 1 + ISNULL(views, 0) * 0.5 + ISNULL(comments, 0) * 1.25 + ISNULL(favorites, 0) * 1.5)";

      const artworks = await artworkModel.findAll({
        attributes: {
          include: [[literal(scoreExpr), "score"]],
        },
        include: [TAG_INCLUDE, ARTIST_INCLUDE],
        order: [[literal(scoreExpr), "DESC"]],
        limit: 10,
      });

      return artworks.map((a) => {
        const plain: any = a.toJSON();
        return {
          _id: plain._id,
          artworkName: plain.artworkName,
          description: plain.description,
          dateCreated: plain.dateCreated,
          likes: plain.likes,
          views: plain.views,
          comments: plain.comments,
          favorites: plain.favorites,
          purchasable: plain.purchasable,
          price: plain.price,
          imageFile: {
            imageFileFE: plain.imageFileFE,
            preview: plain.preview,
            image: plain.image,
          },
          tags: (plain.tagID || []).map((t: any) => ({ _id: t._id, tagName: t.tagName })),
          creator: plain.artist
            ? [{ _id: plain.artist._id, firstName: plain.artist.firstName, lastName: plain.artist.lastName }]
            : [],
          score: plain.score,
        };
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch top 10 artworks: ${error.message}`);
    }
  }

  getArtworkPopulated = async (id: string) => {
    const artwork = await artworkModel.findByPk(id, {
      include: [ARTIST_INCLUDE, TAG_INCLUDE],
    });
    if (!artwork) return null;
    return this.toClientShape(artwork);
  };

  updateArtwork = async (data: Partial<IArtwork>, _id: string) => {
    try {
      const { tagID, ...rest } = data as any;
      const artwork = await artworkModel.findByPk(_id);
      if (!artwork) return null;

      await artwork.update(rest);
      if (Array.isArray(tagID)) {
        await (artwork as any).setTagID(tagID);
      }

      const updated = await artworkModel.findByPk(_id, { include: [ARTIST_INCLUDE, TAG_INCLUDE] });
      return updated ? this.toClientShape(updated) : null;
    } catch (error: any) {
      throw new Error(`Update artwork failed: ${error.message}`);
    }
  };

  deleteArtwork = async (_id: string) => {
    try {
      const artwork = await artworkModel.findByPk(_id);
      if (!artwork) return null;
      const updated = await artwork.update({ status: "0" } as any);
      return this.toClientShape(updated);
    } catch (error: any) {
      throw new Error(`Delete artwork failed: ${error.message} `);
    }
  };

  countTotalComments = async (artworkId: string) => {
    try {
      const comments = await commentModel.findAll({
        where: { artworkId } as any,
        attributes: ["_id"],
      });

      const commentIds = comments.map((c) => c._id);

      const replyCount = commentIds.length
        ? await replyCommentModel.count({ where: { commentId: commentIds } as any })
        : 0;

      const commentCount = comments.length;

      return commentCount + replyCount;
    } catch (error: any) {
      throw new Error(`Count total comments failed: ${error.message}`);
    }
  };

  getArtworkByTagId = async (id: string) => {
    try {
      const listArtwork = await artworkModel.findAll({
        where: { status: "1" } as any,
        include: [{ ...TAG_INCLUDE, where: { _id: id }, required: true }],
      });
      return listArtwork.map(this.toClientShape);
    } catch (error: any) {
      throw new Error(`fail to get List artwork by tag: ${error.message}`);
    }
  };

  updateStatusArtwork = async (id: string, status: string) => {
    try {
      const artwork = await artworkModel.findByPk(id);
      if (!artwork) return null;
      const updated = await artwork.update({ status } as any);
      return this.toClientShape(updated);
    } catch (error: any) {
      throw new Error(`Update status artwork failed: ${error.message}`);
    }
  };

  getNumberOfArtworks = async (): Promise<number> => {
    try {
      const count = await artworkModel.count({ where: { status: "1" } as any });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to get number of artworks: ${error.message}`);
    }
  };

  getArtworksByUserId = async (userId: string): Promise<any[]> => {
    try {
      const artworks = await artworkModel.findAll({
        where: { userId, status: "1" } as any,
        include: [
          { model: UserSql, as: "artist", attributes: ["_id", "firstName", "lastName", "profilePicture"] },
          { model: TagSql, as: "tagID", attributes: ["_id", "tagName"] },
        ],
        order: [["dateCreated", "DESC"]],
      });

      return artworks.map(this.toClientShape);
    } catch (error: any) {
      throw new Error(`Failed to fetch artworks by user: ${error.message}`);
    }
  };
}
