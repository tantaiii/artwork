/* ============================================================================
 * MIGRATED FROM MONGODB (MONGOOSE) TO SQL SERVER (SEQUELIZE).
 * Original Mongoose-based implementation kept below for reference / rollback.
 * ============================================================================
 *
 * import { Request, Response, NextFunction } from "express";
 * import { GenericService } from "../services/base.service";
 * import { Document } from "mongoose";
 * import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";
 *
 * export class GenericController<T extends Document> {
 *   private service: GenericService<T>;
 *
 *   constructor(service: GenericService<T>) {
 *     this.service = service;
 *   }
 *
 *   create = async (req: Request, res: Response, next: NextFunction) => {
 *     try {
 *       const result = await this.service.create(req.body);
 *       res.status(201).json(responseWrapper("success", "Created successfully", result));
 *     } catch (error) {
 *       next(error);
 *     }
 *   };
 *
 *   ... (createMany / getAll / getById / update / delete / getByStatus, unchanged shape)
 * }
 * ========================================================================= */

import { Request, Response, NextFunction } from "express";
import { GenericService } from "../services/base.service";
import { Model } from "sequelize";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class GenericController<M extends Model> {
  private service: GenericService<M>;

  constructor(service: GenericService<M>) {
    this.service = service;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(responseWrapper("success", "Created successfully", result));
    } catch (error) {
      next(error);
    }
  };

  createMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createMany(req.body);
      res.status(201).json(responseWrapper("success", "Created successfully", result));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll();
      res.json(responseWrapper("success", "Fetched successfully", result));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getById(req.params.id);
      if (!result) {
        return res.status(404).json(responseWrapper("error", "Not found"));
      }
      res.json(responseWrapper("success", "Fetched successfully", result));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id, req.body);
      if (!result) {
        return res.status(404).json(responseWrapper("error", "Not found"));
      }
      res.json(responseWrapper("success", "Updated successfully", result));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(req.params.id);
      if (!result) {
        return res.status(404).json(responseWrapper("error", "Not found"));
      }
      res.json(responseWrapper("success", "Deleted successfully", result));
    } catch (error) {
      next(error);
    }
  };

  getByStatus = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getByStatus();
      res.json(responseWrapper("success", "Fetched successfully", result));
    } catch (error) {
      next(error);
    }
  };
}
