"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestController = void 0;
const prisma_1 = require("../generated/prisma");
const RequestService_1 = require("../services/RequestService");
const customErrors_1 = require("../errors/customErrors");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const prisma = new prisma_1.PrismaClient();
const serviceRequest = new RequestService_1.RequestService(prisma);
class RequestController {
}
exports.RequestController = RequestController;
_a = RequestController;
/**
 * Récupère toutes les requêtes avec filtres
 */
RequestController.getAllRequests = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        status: req.query.status,
        type: req.query.type,
        priority: req.query.priority,
        channel: req.query.channel,
        createdById: req.query.createdById,
        assignedToId: req.query.assignedToId,
        projectId: req.query.projectId,
        search: req.query.search,
        page: req.query.page ? parseInt(req.query.page, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    };
    const result = yield serviceRequest.getAllRequests(filters);
    return res.status(200).json({
        success: true,
        data: result.requests,
        meta: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        },
    });
}));
/**
 * Récupère une requête par son ID
 */
RequestController.getRequestById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const request = yield serviceRequest.getRequestById(id);
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
}));
/**
 * Récupère les requêtes liées à l'organisation de l'utilisateur
 */
RequestController.getRequestsByUserOrganization = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId || typeof userId !== 'string') {
        throw new customErrors_1.ValidationError("L'ID de l'utilisateur est requis.");
    }
    const filters = {
        status: req.query.status,
        type: req.query.type,
        priority: req.query.priority,
        channel: req.query.channel,
        search: req.query.search,
        page: req.query.page ? parseInt(req.query.page, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
    };
    const result = yield serviceRequest.getRequestsByUserOrganization(userId, filters);
    return res.status(200).json({
        success: true,
        data: result.requests,
        meta: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        },
    });
}));
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
