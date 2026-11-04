import { GenericService } from "../../core/services/base.service";
import artisformModel, { IArtisForm } from "./artisform.model";
import { UserSql } from "../../models/sql";

export class artisFormService extends GenericService<IArtisForm> {
    constructor() {
        super(artisformModel);
    }

    //Function here
    async getAllArtisForm() {
        try {
            const allForms = await artisformModel.findAll({
                include: [{ model: UserSql, as: "user" }],
                order: [["dateCreation", "DESC"]],
            });
            return allForms;
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách ArtisForm: " + (error as Error).message);
        }
    }

    async createArtisForm(data: Partial<IArtisForm>): Promise<IArtisForm> {
        try {
            const savedForm = await artisformModel.create(data as any);
            return savedForm;
        } catch (error: any) {
            throw new Error("Failed to create artist form: " + error.message);
        }
    }

    async updateStatus(_id: string, status: boolean) {
        try {
            const form = await artisformModel.findByPk(_id);
            if (!form) {
                throw new Error("ArtisForm not found");
            }

            const updatedForm = await form.update({ status });
            return updatedForm;
        } catch (error: any) {
            throw new Error("Failed to update status: " + error.message);
        }
    }

}
