/* ============================================================================
 * MIGRATED FROM MONGODB (MONGOOSE) TO SQL SERVER (SEQUELIZE).
 * Original Mongoose-based implementation kept below for reference / rollback.
 * ============================================================================
 *
 * import { Model, Document } from "mongoose";
 *
 * export class GenericService<T extends Document> {
 *   private model: Model<T>;
 *
 *   constructor(model: Model<T>) {
 *     this.model = model;
 *   }
 *
 *   create(data: Partial<T>) {
 *     return this.model.create(data);
 *   }
 *
 *   createMany(data: Partial<T>[]) {
 *     return this.model.insertMany(data);
 *   }
 *
 *   getAll() {
 *     return this.model.find();
 *   }
 *
 *   getById(id: string) {
 *     return this.model.findById(id);
 *   }
 *
 *   update(id: string, data: Partial<T>) {
 *     return this.model.findByIdAndUpdate(id, data, { new: true });
 *   }
 *
 *   delete(id: string) {
 *     return this.model.findByIdAndDelete(id);
 *   }
 *
 *   getByStatus() {
 *     return this.model.find({ status: 1 });
 *   }
 * }
 * ========================================================================= */

import { Model, ModelStatic } from "sequelize";

export class GenericService<M extends Model> {
  protected model: ModelStatic<M>;

  constructor(model: ModelStatic<M>) {
    this.model = model;
  }

  create(data: object) {
    return this.model.create(data as any);
  }

  createMany(data: object[]) {
    return this.model.bulkCreate(data as any[]);
  }

  getAll() {
    return this.model.findAll();
  }

  getById(id: string) {
    return this.model.findByPk(id);
  }

  async update(id: string, data: object) {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    return instance.update(data as any);
  }

  async delete(id: string) {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    await instance.destroy();
    return instance;
  }

  getByStatus() {
    return this.model.findAll({ where: { status: 1 } as any });
  }
}
