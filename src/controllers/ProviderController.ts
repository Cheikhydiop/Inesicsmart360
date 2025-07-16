import { Request, Response } from 'express';
import ProviderService from '../services/ProviderService';
import { asyncHandler } from '../middlewares/asyncHandler';
import { DatabaseError, ValidationError } from '../errors/customErrors';

class ProviderController {
  /**
   * Récupération paginée des providers
   * GET /api/providers
   */
  static getAllProviders = asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        page,
        pageSize,
        name,
        email,
        phone,
        status,
        country,
        search,
        ...restQuery
      } = req.query;

      console.log('Query params reçus:', { page, pageSize, name, email, phone, status, country, search });

      const whereClause: any = {};

      if (search) {
        whereClause.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } },
          { country: { contains: search as string, mode: 'insensitive' } },
        ];
      } else {
        if (name) whereClause.name = { contains: name as string, mode: 'insensitive' };
        if (email) whereClause.email = { contains: email as string, mode: 'insensitive' };
        if (phone) whereClause.phone = { contains: phone as string, mode: 'insensitive' };
        if (country) whereClause.country = { contains: country as string, mode: 'insensitive' };
      }

      if (status) whereClause.status = status;

      // Ajout dynamique des autres filtres éventuels
      Object.keys(restQuery).forEach(key => {
        if (
          restQuery[key] &&
          !['page', 'pageSize', 'name', 'email', 'phone', 'status', 'country', 'search'].includes(key)
        ) {
          whereClause[key] = restQuery[key];
        }
      });

      const options = {
        page: page ? Math.max(1, parseInt(page as string, 10)) : 1,
        limit: pageSize ? Math.max(1, Math.min(100, parseInt(pageSize as string, 10))) : 10,
        findOptions: {
          where: whereClause,
          orderBy: {
            createdAt: 'desc' as const,
          },
        },
      };

      console.log('Options préparées pour ProviderService:', JSON.stringify(options, null, 2));

      const result = await ProviderService.getAllProviders(options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Erreur dans getAllProviders:', error);

      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: 'VALIDATION_ERROR',
        });
      }

      if (error instanceof DatabaseError) {
        return res.status(500).json({
          success: false,
          message: error.message,
          error: 'DATABASE_ERROR',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: 'INTERNAL_SERVER_ERROR',
      });
    }
  });


    /**
   * Récupération des détails d’un fournisseur
   * GET /api/providers/:id
   */
    static getProviderDetails = asyncHandler(async (req: Request, res: Response) => {
      try {
        const providerId = req.params.id;
  
        if (!providerId) {
          throw new ValidationError("L'identifiant du fournisseur est requis.");
        }
  
        const result = await ProviderService.getProviderDetails(providerId);
  
        res.status(200).json({
          success: true,
          ...result,
        });
      } catch (error: any) {
        console.error('Erreur dans getProviderDetails:', error);
  
        if (error instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: error.message,
            error: 'VALIDATION_ERROR',
          });
        }
  
        if (error instanceof DatabaseError) {
          return res.status(500).json({
            success: false,
            message: error.message,
            error: 'DATABASE_ERROR',
          });
        }
  
        res.status(500).json({
          success: false,
          message: 'Erreur interne du serveur',
          error: 'INTERNAL_SERVER_ERROR',
        });
      }
    });


    /**
 * Récupération des fournisseurs d'une organisation
 * GET /api/organizations/:organizationId/providers
 */
    static getProvidersByUser = asyncHandler(async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        console.log('✅ Appel à getProvidersByUser avec:', userId);
        
        if (!userId) {
          throw new ValidationError("L'identifiant de l'utilisateur est requis.");
        }
    
        // Appel de la méthode du service avec le userId
        const result = await ProviderService.getProvidersByUser(userId);
        
        res.status(200).json({
          ...result,
        });
      } catch (error: any) {
        console.error('❌ Erreur dans getProvidersByUser:', error);
        
        if (error instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: error.message,
            error: 'VALIDATION_ERROR',
          });
        }
        
        if (error instanceof DatabaseError) {
          return res.status(500).json({
            success: false,
            message: error.message,
            error: 'DATABASE_ERROR',
          });
        }
        
        res.status(500).json({
          success: false,
          message: 'Erreur interne du serveur',
          error: 'INTERNAL_SERVER_ERROR',
        });
      }
    });

  
}

export default ProviderController;
