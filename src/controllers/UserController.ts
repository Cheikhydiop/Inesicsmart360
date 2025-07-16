import { Request, Response } from 'express';
import UserService from '../services/UserService';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { asyncHandler } from '../middlewares/asyncHandler';

class UserController {
  /**
   * Inscription d'un nouvel utilisateur
   * POST /api/users/register
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    const result = await UserService.register(userData);
  
    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token,
      }
    });
  });
  

  /**
   * Connexion d'un utilisateur
   * POST /api/users/login
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    try {
      const loginData = req.body;
      const result = await UserService.login(loginData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error: any) {
      if (error instanceof ValidationError) {
        return res.status(401).json({
          success: false,
          message: error.message,
          error: 'AUTHENTICATION_ERROR'
        });
      }

      if (error instanceof DatabaseError) {
        return res.status(500).json({
          success: false,
          message: error.message,
          error: 'DATABASE_ERROR'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  });

static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
  
    const { 
      page, 
      pageSize,  
      name, 
      email, 
      role,
      status,
      search, 
      ...restQuery 
    } = req.query;

    console.log('Paramètres extraits:', { page, pageSize, name, email, role, status, search, restQuery });

   
    let whereClause: any = {};

    // Recherche globale (search dans name OU email)
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    } else {
      // Recherche spécifique par champ
      if (name) {
        whereClause.name = { contains: name as string, mode: 'insensitive' };
      }
      if (email) {
        whereClause.email = { contains: email as string, mode: 'insensitive' };
      }
    }

    // Filtres exacts
    if (role) {
      whereClause.role = role;
    }
    if (status) {
      whereClause.status = status;
    }

    // Ajout des autres filtres du restQuery si nécessaire
    Object.keys(restQuery).forEach(key => {
      if (restQuery[key] && !['page', 'pageSize', 'name', 'email', 'role', 'status', 'search'].includes(key)) {
        whereClause[key] = restQuery[key];
      }
    });

    // Options normalisées
    const options = {
      page: page ? Math.max(1, parseInt(page as string, 10)) : 1,
      limit: pageSize ? Math.max(1, Math.min(100, parseInt(pageSize as string, 10))) : 10, // Limite max de 100
      findOptions: {
        where: whereClause,
        orderBy: {
          createdAt: 'desc' as const,
        }
      },
    };

    console.log('Options de requête:', JSON.stringify(options, null, 2));
    
    const result = await UserService.getAllUsers(options);
    
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Erreur dans getAllUsers:', error);
    
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
 * Récupère tous les utilisateurs appartenant à la même organisation (même name) que l'utilisateur donné
 * GET /api/users/same-organization/:id
 */
/**
 * Récupère tous les utilisateurs ayant le même organizationId qu'un utilisateur donné
 * GET /api/users/same-organization/:id
 */
static getUsersBySameOrganisation = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Récupère l'ID utilisateur depuis les paramètres, sinon utilise un ID par défaut
    const userId = req.params.id ;

    const result = await UserService.getUsersBySameOrganizationId(userId)

    res.status(200).json({
      // success: true,
      ...result,
    });

  } catch (error: any) {
    console.error('Erreur dans getUsersBySameOrganisation:', error);

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

export default UserController;