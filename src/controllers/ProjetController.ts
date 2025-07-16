// controllers/projets.controller.ts

import { Request, Response, NextFunction } from 'express';
import ProjetService from '../services/ProjetService';
import { asyncHandler } from '../middlewares/asyncHandler';

class ProjetController {
  // static async getProjets(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  //     const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

  //     const projets = await ProjetService.getProjets({ page, limit });

  //     res.status(200).json(projets);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

   static async getProjetById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await ProjetService.getProjectDetails(id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
   }


   static getProjetsByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "L'identifiant de l'utilisateur est requis."
        });
      }
  
      // Récupération des paramètres de requête avec valeurs par défaut
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as string | undefined;
      const name = req.query.name as string | undefined;
  
      // Validation des paramètres numériques
      if (isNaN(page) || page < 1) {
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'page' doit être un nombre entier positif."
        });
      }
  
      if (isNaN(limit) || limit < 1 || limit > 50) {
        return res.status(400).json({
          success: false,
          message: "Le paramètre 'limit' doit être un nombre entre 1 et 50."
        });
      }
  
      // Préparation des filtres
      const filters = { 
        page, 
        pageSize: limit, 
        status, 
        name 
      };
  
      // Appel du service
      const projets = await ProjetService.getProjectsByUser(userId, filters);
  
      // Réponse avec succès
      res.status(200).json({
        success: true,
        ...projets
      });
  
    } catch (error) {
      next(error);
    }
  });

      /**
   * Mise à jour d'un projet
   */
  static updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validation de base
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "L'identifiant du projet est requis."
        });
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Aucune donnée fournie pour la mise à jour."
        });
      }

      // Récupérer l'ID de l'utilisateur depuis le token/session (si disponible)
      // Vous pouvez adapter cette partie selon votre système d'authentification
      const userId = (req as any).user?.id || req.headers['user-id'] as string;

      const result = await ProjetService.updateProject(id, updateData, userId);

      res.status(200).json({
        success: true,
        ...result
      });

    } catch (error) {
      next(error);
    }
  })


  /**
 * Création d'un nouveau projet
 */
  static createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData = req.body;
  
      // Vérification de base
      if (!projectData || Object.keys(projectData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Aucune donnée fournie pour la création du projet."
        });
      }
  
      // Champs obligatoires
      const requiredFields = [
        'name', 'description', 'objective', 'scope',
        'geographicalArea', 'client', 'startDate',
        'endDate', 'projectManagerId' // ✅ Ajout ici
      ];
  
      const missingFields = requiredFields.filter(
        field =>
          !projectData[field] ||
          (typeof projectData[field] === 'string' && projectData[field].trim().length === 0)
      );
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Les champs suivants sont requis: ${missingFields.join(', ')}`
        });
      }
  
      // Appel du service avec projectManagerId depuis le body
      const result = await ProjetService.createProject(projectData, projectData.projectManagerId);
  
      res.status(201).json({
        success: true,
        ...result
      });
  
    } catch (error) {
      next(error);
    }
  });
  
    
}

export default ProjetController;
