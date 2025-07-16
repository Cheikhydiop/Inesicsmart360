import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestService } from '../services/RequestService';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { asyncHandler } from '../middlewares/asyncHandler';

const prisma = new PrismaClient();
const serviceRequest = new RequestService(prisma);

export class RequestController {
  /**
   * Récupère toutes les requêtes avec filtres
   */
  static getAllRequests = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as any,
      type: req.query.type as any,
      priority: req.query.priority as any,
      channel: req.query.channel as any,
      createdById: req.query.createdById as string,
      assignedToId: req.query.assignedToId as string,
      projectId: req.query.projectId as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    };

    const result = await serviceRequest.getAllRequests(filters);

    return res.status(200).json({
      success: true,
      data: result.requests,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  });

  /**
   * Récupère une requête par son ID
   */
  static getRequestById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const request = await serviceRequest.getRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Requête non trouvée',
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  });

  /**
   * Récupère les requêtes liées à l'organisation de l'utilisateur
   */
  static getRequestsByUserOrganization = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;

    if (!userId || typeof userId !== 'string') {
      throw new ValidationError("L'ID de l'utilisateur est requis.");
    }

    const filters = {
      status: req.query.status as any,
      type: req.query.type as any,
      priority: req.query.priority as any,
      channel: req.query.channel as any,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };

    const result = await serviceRequest.getRequestsByUserOrganization(userId, filters);

    return res.status(200).json({
      success: true,
      data: result.requests,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  });
}

















  // static async createRequest(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const requestData = req.body;
  //     const newRequest = await serviceRequest.createRequest(requestData);

  //     return res.status(201).json({
  //       success: true,
  //       data: newRequest,
  //       message: 'Requête créée avec succès',
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async updateRequest(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { id } = req.params;
  //     const updateData = req.body;
      
  //     const updatedRequest = await serviceRequest.updateRequest(id, updateData);

  //     return res.status(200).json({
  //       success: true,
  //       data: updatedRequest,
  //       message: 'Requête mise à jour avec succès',
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async deleteRequest(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { id } = req.params;
  //     const deleted = await serviceRequest.deleteRequest(id);

  //     if (!deleted) {
  //       return res.status(404).json({
  //         success: false,
  //         error: 'NotFound',
  //         message: 'Requête non trouvée',
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: 'Requête supprimée avec succès',
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async assignRequest(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { id } = req.params;
  //     const { assignedToId } = req.body;

  //     const assignedRequest = await serviceRequest.assignRequest(id, assignedToId);

  //     return res.status(200).json({
  //       success: true,
  //       data: assignedRequest,
  //       message: 'Requête assignée avec succès',
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async updateRequestStatus(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { id } = req.params;
  //     const { status } = req.body;

  //     const updatedRequest = await serviceRequest.updateRequestStatus(id, status);

  //     return res.status(200).json({
  //       success: true,
  //       data: updatedRequest,
  //       message: 'Statut de la requête mis à jour avec succès',
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async getRequestsByUser(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { userId } = req.params;
  //     const filters = {
  //       status: req.query.status as any,
  //       type: req.query.type as any,
  //       priority: req.query.priority as any,
  //       channel: req.query.channel as any,
  //       projectId: req.query.projectId as string,
  //       search: req.query.search as string,
  //       page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
  //       limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  //     };

  //     const result = await serviceRequest.getRequestsByUser(userId, filters);

  //     return res.status(200).json({
  //       success: true,
  //       data: result.requests,
  //       meta: {
  //         total: result.total,
  //         page: result.page,
  //         totalPages: result.totalPages,
  //       },
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async getAssignedRequests(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { userId } = req.params;
  //     const filters = {
  //       status: req.query.status as any,
  //       type: req.query.type as any,
  //       priority: req.query.priority as any,
  //       channel: req.query.channel as any,
  //       projectId: req.query.projectId as string,
  //       search: req.query.search as string,
  //       page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
  //       limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  //     };

  //     const result = await serviceRequest.getAssignedRequests(userId, filters);

  //     return res.status(200).json({
  //       success: true,
  //       data: result.requests,
  //       meta: {
  //         total: result.total,
  //         page: result.page,
  //         totalPages: result.totalPages,
  //       },
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async getRequestsByProject(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { projectId } = req.params;
  //     const filters = {
  //       status: req.query.status as any,
  //       type: req.query.type as any,
  //       priority: req.query.priority as any,
  //       channel: req.query.channel as any,
  //       createdById: req.query.createdById as string,
  //       assignedToId: req.query.assignedToId as string,
  //       search: req.query.search as string,
  //       page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
  //       limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  //     };

  //     const result = await serviceRequest.getRequestsByProject(projectId, filters);

  //     return res.status(200).json({
  //       success: true,
  //       data: result.requests,
  //       meta: {
  //         total: result.total,
  //         page: result.page,
  //         totalPages: result.totalPages,
  //       },
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }

  // static async searchRequests(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { searchTerm } = req.query;
  //     const filters = {
  //       status: req.query.status as any,
  //       type: req.query.type as any,
  //       priority: req.query.priority as any,
  //       channel: req.query.channel as any,
  //       createdById: req.query.createdById as string,
  //       assignedToId: req.query.assignedToId as string,
  //       projectId: req.query.projectId as string,
  //       page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
  //       limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  //     };

  //     const result = await serviceRequest.searchRequests(searchTerm as string, filters);

  //     return res.status(200).json({
  //       success: true,
  //       data: result.requests,
  //       meta: {
  //         total: result.total,
  //         page: result.page,
  //         totalPages: result.totalPages,
  //       },
  //     });
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       return res.status(400).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //         details: error.details,
  //       });
  //     }
  //     if (error instanceof DatabaseError) {
  //       return res.status(500).json({
  //         success: false,
  //         error: error.name,
  //         message: error.message,
  //       });
  //     }
  //     return next(error);
  //   }
  // }
