import { PrismaClient } from '@prisma/client';

import { ValidationError, DatabaseError } from '../errors/customErrors';
import { paginateOrFindAll } from '../utils/paginate.helpers';


const prisma = new PrismaClient();

class ProjetService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  
  static async getProjectDetails(projectId: string) {
    try {
      if (!projectId) {
        throw new ValidationError("L'identifiant du projet est requis.");
      }
  
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          projectManager: true,
          supervisors: true,
          contractors: true,
          parentProject: true,
          subProjects: true,
          tasks: true,
          documents: true,
          requests: true,
          kpis: true,
          timeline: true,
          budgetDistributions: true, // ✅ Nom correct ici          location: true,
          contracts: true,
          evaluations: true,
          location:true,
        },
      });
  
      if (!project) {
        throw new ValidationError("Projet introuvable.");
      }
  
      return {
        data: project,
        message: "Détails du projet récupérés avec succès",
      };
    } catch (error: any) {
      console.error('❌ Erreur dans getProjectDetails:', error);
      throw new DatabaseError(`Échec de la récupération du projet : ${error.message}`);
    }
  }
  static async getProjectsByUser(userId: string, filters: any = {}) {
    // Validation en premier
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new ValidationError("L'identifiant de l'utilisateur est requis et doit être une chaîne non vide.");
    }
  
    try {
      // Changement ici: pageSize = 20 au lieu de 10
      const { status, name, page = 1, pageSize = 20 } = filters;
  
      // Validation des filtres
      const validStatuses = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD'];
      if (status && !validStatuses.includes(status)) {
        throw new ValidationError(`Statut invalide. Statuts autorisés: ${validStatuses.join(', ')}`);
      }
  
      const where: any = {
        projectManagerId: userId.trim(),
      };
  
      if (status) where.status = status;
      if (name) {
        where.name = {
          contains: name.trim(),
          mode: 'insensitive' as const
        };
      }
  
      const currentPage = Math.max(1, page);
      const limit = Math.min(50, Math.max(1, pageSize));
      const offset = (currentPage - 1) * limit;
  
      // Compter le total des résultats
      const total = await prisma.project.count({ where });
  
      // Récupérer les projets
      const projects = await prisma.project.findMany({
        where,
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          objective: true,
          scope: true,
          geographicalArea: true,
          client: true,
          startDate: true,
          endDate: true,
          status: true,
          budget: true,
          progress: true,
          contract: true,
          funder: true,
          governmentEntity: true,
          riskLevel: true,
          createdAt: true,
          updatedAt: true,
          projectManagerId: true,
          parentProjectId: true,
          locationId: true,
          // Ajout des relations si nécessaire
          projectManager: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          tasks: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              priority: true,
              dueDate: true,
              completedAt: true,
              formTemplate: true,
              formData: true,
              dependencies: true,
              createdAt: true,
              assignedToId: true,
              projectId: true,
              locationId: true,
              requestId: true,
              assignedTo: {
                select: {
                  id: true,
                  name: true
                }
              },
              location: {
                select: {
                  id: true,
                  name: true
                }
              },
              checklist: true,
              attachments: true,
              comments: true,
              equipmentRequired: true
            }
          },
          kpis: {
            select: {
              id: true,
              name: true,
              description: true,
              value: true,
              target: true,
              unit: true,
              trend: true,
              category: true,
              period: true,
              date: true,
              relatedToType: true,
              relatedToId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc' // Tri par date de création décroissante
        }
      });
  
      const lastPage = Math.ceil(total / limit);
      const from = offset + 1;
      const to = offset + projects.length;
  
      return {
        data: projects,
        total,
        page: currentPage,
        perPage: limit,
        lastPage,
        from,
        to,
        hasNextPage: currentPage < lastPage,
        hasPreviousPage: currentPage > 1,
        paginated: true,
        message: `Projets de l'utilisateur récupérés avec succès`,
      };
  
    } catch (error: any) {
      console.error('❌ Erreur dans getProjectsByUser:', error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Échec de la récupération des projets de l'utilisateur: ${error.message}`);
    }
  }
  static async updateProject(projectId: string, updateData: any, userId?: string) {
    try {
      // Validation de l'ID du projet
      if (!projectId || typeof projectId !== 'string' || projectId.trim().length === 0) {
        throw new ValidationError("L'identifiant du projet est requis et doit être une chaîne non vide.");
      }

      // Vérifier que le projet existe
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId.trim() },
        select: {
          id: true,
          projectManagerId: true,
          status: true,
        }
      });

      if (!existingProject) {
        throw new ValidationError("Projet introuvable.");
      }

      // Vérification des permissions si userId est fourni
      if (userId && existingProject.projectManagerId !== userId.trim()) {
        throw new ValidationError("Vous n'avez pas l'autorisation de modifier ce projet.");
      }

      // Validation des données de mise à jour
      const allowedFields = [
        'name', 'description', 'objective', 'scope', 'geographicalArea',
        'client', 'startDate', 'endDate', 'status', 'budget', 'progress',
        'contract', 'funder', 'governmentEntity', 'riskLevel', 'locationId',
        'parentProjectId'
      ];

      const dataToUpdate: any = {};
      
      // Filtrer les champs autorisés
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined && updateData[key] !== null) {
          dataToUpdate[key] = updateData[key];
        }
      });

      // Validation des champs spécifiques
      if (dataToUpdate.name && (typeof dataToUpdate.name !== 'string' || dataToUpdate.name.trim().length === 0)) {
        throw new ValidationError("Le nom du projet doit être une chaîne non vide.");
      }

      if (dataToUpdate.status) {
        const validStatuses = ['PLANNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(dataToUpdate.status)) {
          throw new ValidationError(`Statut invalide. Statuts autorisés: ${validStatuses.join(', ')}`);
        }
      }
      

      if (dataToUpdate.budget && (isNaN(dataToUpdate.budget) || dataToUpdate.budget < 0)) {
        throw new ValidationError("Le budget doit être un nombre positif.");
      }

      if (dataToUpdate.progress && (isNaN(dataToUpdate.progress) || dataToUpdate.progress < 0 || dataToUpdate.progress > 100)) {
        throw new ValidationError("Le progrès doit être un nombre entre 0 et 100.");
      }

      if (dataToUpdate.riskLevel) {
        const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        if (!validRiskLevels.includes(dataToUpdate.riskLevel)) {
          throw new ValidationError(`Niveau de risque invalide. Niveaux autorisés: ${validRiskLevels.join(', ')}`);
        }
      }

      // Validation des dates
      if (dataToUpdate.startDate) {
        dataToUpdate.startDate = new Date(dataToUpdate.startDate);
        if (isNaN(dataToUpdate.startDate.getTime())) {
          throw new ValidationError("Date de début invalide.");
        }
      }

      if (dataToUpdate.endDate) {
        dataToUpdate.endDate = new Date(dataToUpdate.endDate);
        if (isNaN(dataToUpdate.endDate.getTime())) {
          throw new ValidationError("Date de fin invalide.");
        }
      }

      // Vérifier que la date de fin est après la date de début
      if (dataToUpdate.startDate && dataToUpdate.endDate && dataToUpdate.startDate >= dataToUpdate.endDate) {
        throw new ValidationError("La date de fin doit être postérieure à la date de début.");
      }

      // Vérifier si le projet parent existe (si fourni)
      if (dataToUpdate.parentProjectId) {
        const parentProject = await prisma.project.findUnique({
          where: { id: dataToUpdate.parentProjectId },
          select: { id: true }
        });
        
        if (!parentProject) {
          throw new ValidationError("Projet parent introuvable.");
        }

        // Éviter la référence circulaire
        if (dataToUpdate.parentProjectId === projectId) {
          throw new ValidationError("Un projet ne peut pas être son propre parent.");
        }
      }

      // Vérifier si la localisation existe (si fournie)
      if (dataToUpdate.locationId) {
        const location = await prisma.location.findUnique({
          where: { id: dataToUpdate.locationId },
          select: { id: true }
        });
        
        if (!location) {
          throw new ValidationError("Localisation introuvable.");
        }
      }

      // Si aucune donnée valide à mettre à jour
      if (Object.keys(dataToUpdate).length === 0) {
        throw new ValidationError("Aucune donnée valide fournie pour la mise à jour.");
      }

      // Ajouter la date de mise à jour
      dataToUpdate.updatedAt = new Date();

      // Effectuer la mise à jour
      const updatedProject = await prisma.project.update({
        where: { id: projectId.trim() },
        data: dataToUpdate,
        include: {
          projectManager: {
            select: {
              id: true,
              email: true,
            }
          },
          location: true,
          parentProject: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

      return {
        data: updatedProject,
        message: "Projet mis à jour avec succès",
      };

    } catch (error: any) {
      console.error('❌ Erreur dans updateProject:', error);

      if (error instanceof ValidationError) {
        throw error;
      }

      // Gestion des erreurs Prisma spécifiques
      if (error.code === 'P2002') {
        throw new ValidationError("Un projet avec ce nom existe déjà.");
      }

      if (error.code === 'P2025') {
        throw new ValidationError("Projet introuvable.");
      }

      throw new DatabaseError(`Échec de la mise à jour du projet: ${error.message}`);
    }
  }



  /**
 * Création d'un nouveau projet
 */
  static async createProject(data: any, projectManagerId: string) {
    if (!projectManagerId || typeof projectManagerId !== 'string' || projectManagerId.trim().length === 0) {
      throw new ValidationError("L'identifiant du gestionnaire de projet est requis et doit être une chaîne non vide.");
    }
  
    // Convertir les dates string en objets Date
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ValidationError("Les dates de début et de fin doivent être des dates valides.");
    }
  
    // Préparer les données pour Prisma
    const projectData = {
      ...data,
      startDate,
      endDate,
      projectManagerId: projectManagerId.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    try {
      const newProject = await prisma.project.create({
        data: projectData,
        include: {
          projectManager: {
            select: {
              id: true,
              email: true,
            }
          },
          location: true,
          parentProject: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });
  
      return {
        data: newProject,
        message: "Projet créé avec succès",
      };
  
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError("Un projet avec ce nom existe déjà.");
      }
  
      throw new DatabaseError("Échec de la création du projet : " + error.message);
    }
  }
  

}

export default ProjetService;


