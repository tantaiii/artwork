import { GenericService } from "../../core/services/base.service";
import { ICommission } from "./commission.model";
import commissionModel from "./commission.model";
import { UserSql } from "../../models/sql";

const commissionIncludes = [
    { model: UserSql, as: "requestor" },
    { model: UserSql, as: "receiver" },
];

export class commissionService extends GenericService<ICommission> {
    constructor() {
        super(commissionModel);
    }

    getCommissionByRequestorId = async (userId: string) => {
        if (!userId) {
            throw new Error("Invalid userId format");
        }
        return commissionModel.findAll({
            where: { requestorId: userId } as any,
            include: commissionIncludes,
        });
    }

    getCommissionByRecieverId = async (userId: string) => {
        if (!userId) {
            throw new Error("Invalid userId format");
        }
        return commissionModel.findAll({
            where: { receiverId: userId } as any,
            include: commissionIncludes,
        });
    }

    getCommissionById = async (commissionId: string) => {
        if (!commissionId) {
            throw new Error("Invalid commissionId format");
        }
        return commissionModel.findByPk(commissionId, { include: commissionIncludes });
    }

    saveCommission = async (commission: Partial<ICommission>) => {
        return commissionModel.create(commission as any);
    }

    rejectCommissionById = async (commissionId: string, message: string) => {
        if (!commissionId) {
            throw new Error("Invalid commissionId format");
        }
        const commission = await commissionModel.findByPk(commissionId);
        if (!commission) {
            throw new Error("Commission not found");
        }
        await commission.update({ accept: false, message });
        return commissionModel.findByPk(commissionId, { include: commissionIncludes });
    }

    acceptCommissionById = async (commissionId: string) => {
        if (!commissionId) {
            throw new Error("Invalid commissionId format");
        }
        const commission = await commissionModel.findByPk(commissionId);
        if (!commission) {
            throw new Error("Commission not found");
        }
        await commission.update({ accept: true, acceptanceDate: new Date(), progress: 1 });
        return commissionModel.findByPk(commissionId, { include: commissionIncludes });
    }

    updateProgressById = async (commissionId: string, progress: number, artworkUrl?: string) => {
        if (!commissionId) {
            throw new Error("Invalid commissionId format");
        }

        const commission = await commissionModel.findByPk(commissionId);
        if (!commission) {
            throw new Error("Commission not found");
        }

        let updateObj: Partial<ICommission> = { progress } as any;

        if (progress === 4) {
            updateObj = {
                ...updateObj,
                completionDate: new Date(),
                artworkUrl: artworkUrl,
            } as any;
        }

        await commission.update(updateObj as any);
        return commissionModel.findByPk(commissionId, { include: commissionIncludes });
    }
}
