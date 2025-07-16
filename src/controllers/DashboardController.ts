import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import DashboardService from '../services/DashboardService';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { asyncHandler } from '../middlewares/asyncHandler';

const prisma = new PrismaClient();

// Interface pour étendre Request avec user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    organizationId?: string;
  };
}

export default class DashboardController {

  /**
   * Fonction utilitaire pour extraire les filtres de projet
   */
  private static extractProjectFilters(query: any) {
    const {
      status,
      name,
      page = 1,
      pageSize = 20,
      ...otherFilters
    } = query;

    return {
      status,
      name,
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 10,
      ...otherFilters
    };
  }

  /**
   * Récupère toutes les données du dashboard
   */
  static getDashboardData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'utilisateur est requis",
        error: 'MISSING_USER_ID'
      });
    }

    const dashboardData = await DashboardService.getDashboardData(userId);

    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  });

  /**
   * Récupère les projets d'un utilisateur avec filtres
   */

  static getProjectsByUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.params.userId;
    const filters = DashboardController.extractProjectFilters(req.query);
  
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'utilisateur est requis",
        error: 'MISSING_USER_ID'
      });
    }
  
    const result = await DashboardService.getProjectsByUser(userId, filters);
  
    return res.status(200).json({
      success: true,
      ...result
    });
  });
  /**
   * Récupère les utilisateurs de la même organisation
   */
  static getUsersBySameOrganization = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'utilisateur est requis",
        error: 'MISSING_USER_ID'
      });
    }

    const options = { page, limit };
    const result = await DashboardService.getUsersBySameOrganizationId(userId, options);

    return res.status(200).json({
      ... result
    });
  });

  /**
   * Récupère les tâches d'un utilisateur
   */
  static getTasksByUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.params.userId;
    const organizationId = req.query.organizationId as string;
    const filters = {
      status: req.query.status as string,
      priority: req.query.priority as string
    };

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'utilisateur est requis",
        error: 'MISSING_USER_ID'
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'organisation est requis",
        error: 'MISSING_ORGANIZATION_ID'
      });
    }

    const tasks = await DashboardService.getTasksByUser(userId, organizationId, filters);

    return res.status(200).json({
      success: true,
      data: tasks,
      message: 'Tâches récupérées avec succès'
    });
  });

  /**
   * Récupère les demandes récentes
   */
  static getRecentRequests = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const organizationId = req.params.organizationId?.trim();
    const limit = parseInt(req.query.limit as string) || 5;
    const status = req.query.status as string | undefined;
    const last7Days = req.query.last7Days === 'true';

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de l'organisation est requis",
        error: 'MISSING_ORGANIZATION_ID'
      });
    }

    const requests = await DashboardService.getRecentRequests(
      organizationId,
      limit,
      status,
      last7Days
    );

    return res.status(200).json({
      success: true,
      data: requests,
      message: 'Demandes récentes récupérées avec succès'
    });
  });
}
