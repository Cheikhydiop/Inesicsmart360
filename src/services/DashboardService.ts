import { PrismaClient } from '@prisma/client' ;
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { RequestFilters } from '../utils/RequestFilters';

const prisma = new PrismaClient();

class DashboardService {
  
  /**
   * Récupère toutes les données nécessaires pour le dashboard
   */
  static async getDashboardData(userId: string) {
    
    try {
      
      if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        throw new ValidationError("L'identifiant de l'utilisateur est requis.");
      }

      // Récupérer l'organisation de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user?.organizationId) {
        throw new ValidationError("L'utilisateur n'est rattaché à aucune organisation.");
      }

      const organizationId = user.organizationId;

      // Exécuter toutes les requêtes en parallèle
      const [
        projectsData,
        tasksData,
        requestsData,
        recentTasks,
        recentRequests // Fixed: Added missing recentRequests
      ] = await Promise.all([
        this.getProjectsStats(organizationId),
        this.getTasksStats(organizationId),
        this.getRequestsStats(organizationId),
        // this.getKPIsData(),
        this.getRecentTasks(organizationId, 5),
        this.getRecentRequests(organizationId, 5)
      ]);

      return {
        success: true,
        data: {
          projectsCount: projectsData.counts,
          tasksCount: tasksData.counts,
          requestsCount: requestsData.counts,
          projectsByStatus: projectsData.byStatus,
          tasksByPriority: tasksData.byPriority,
          tasksByStatus: tasksData.byStatus,
          // kpis: kpisData,
          recentTasks: recentTasks,
          recentRequests: recentRequests
        },
        message: 'Données du dashboard récupérées avec succès'
      };

    } catch (error: any) {
      console.error('❌ Erreur dans getDashboardData:', error);
      
      if (error instanceof ValidationError) {
        throw error;
      }
      
      throw new DatabaseError(`Échec de la récupération des données du dashboard: ${error.message}`);
    }
  }

  /**
   * Statistiques des projets
   */
  static async getProjectsStats(organizationId: string) {
    try {
      // Correction: utiliser organizationId directement car Project a organizationId
      const [total, inProgress, completed, planned, delayed] = await Promise.all([
        prisma.project.count({
          where: { organizationId }
        }),
        prisma.project.count({
          where: { 
            organizationId,
            status: 'PLANNED'
          }
        }),
        prisma.project.count({
          where: { 
            organizationId,
            status: 'COMPLETED'
          }
        }),
        prisma.project.count({
          where: { 
            organizationId,
            status: 'ON_HOLD'
          }
        }),
        prisma.project.count({
          where: { 
            organizationId,
            status: 'ON_HOLD'
          }
        })
      ]);

      return {
        counts: {
          total,
          inProgress,
          completed,
          planned,
          delayed
        },
        byStatus: [
          { name: 'En cours', value: inProgress, color: '#FFAD0D' },
          { name: 'Terminés', value: completed, color: '#10B981' },
          { name: 'Planifiés', value: planned, color: '#3B82F6' },
          { name: 'En attente', value: delayed, color: '#F59E0B' }
        ]
      };

    } catch (error: any) {
      console.error('❌ Erreur dans getProjectsStats:', error);
      throw new DatabaseError(`Erreur lors de la récupération des stats projets: ${error.message}`);
    }
  }

  /**
   * Statistiques des tâches
   */
  static async getTasksStats(organizationId: string) {
    try {
      // Correction: utiliser project.organizationId car Task -> Project -> organizationId
      const [
        total,
        pending,
        assigned,
        inProgress,
        completed,
        rejected,
        cancelled,
        highPriority,
        mediumPriority,
        lowPriority,
        checklistItems,
        completedChecklistItems,
        tasksWithAllRequiredCompleted
      ] = await Promise.all([
        prisma.task.count({
          where: {
            project: { organizationId }
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            status: 'PENDING'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            status: 'ASSIGNED'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            status: 'IN_PROGRESS'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            status: 'COMPLETED'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            status: 'REJECTED'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            status: 'CANCELLED'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            priority: 'HIGH'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            priority: 'MEDIUM'
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            priority: 'LOW'
          }
        }),
        prisma.checklistItem.count({
          where: {
            task: { 
              project: { organizationId }
            }
          }
        }),
        prisma.checklistItem.count({
          where: {
            task: { 
              project: { organizationId }
            },
            completed: true
          }
        }),
        prisma.task.count({
          where: {
            project: { organizationId },
            checklist: {
              every: {
                OR: [
                  { required: false },
                  { required: true, completed: true }
                ]
              }
            }
          }
        })
      ]);
  
      return {
        counts: {
          total,
          pending,
          assigned,
          inProgress,
          completed,
          rejected,
          cancelled
        },
        byStatus: [
          { name: 'En attente', value: pending },
          { name: 'Assignées', value: assigned },
          { name: 'En cours', value: inProgress },
          { name: 'Terminées', value: completed },
          { name: 'Rejetées', value: rejected },
          { name: 'Annulées', value: cancelled }
        ],
        byPriority: [
          { name: 'Haute', value: highPriority, color: '#EF4444' },
          { name: 'Moyenne', value: mediumPriority, color: '#F59E0B' },
          { name: 'Basse', value: lowPriority, color: '#10B981' }
        ],
        checklist: {
          totalItems: checklistItems,
          completedItems: completedChecklistItems,
          fullyCompletedTasks: tasksWithAllRequiredCompleted
        }
      };
    } catch (error: any) {
      console.error('❌ Erreur dans getTasksStats:', error);
      throw new DatabaseError(`Erreur lors de la récupération des stats tâches: ${error.message}`);
    }
  }

  /**
   * Statistiques des demandes
   */
  static async getRequestsStats(organizationId: string) {
    try {
      const [total, newRequests, inProgress, completed] = await Promise.all([
        prisma.request.count({
          where: { organisationOrgId: organizationId }
        }),
        prisma.request.count({
          where: { 
            organisationOrgId: organizationId,
            status: 'IN_PROGRESS'
          }
        }),
        prisma.request.count({
          where: { 
            organisationOrgId: organizationId,
            status: 'IN_PROGRESS'
          }
        }),
        prisma.request.count({
          where: { 
            organisationOrgId: organizationId,
            status: 'COMPLETED'
          }
        })
      ]);
  
      return {
        counts: {
          total,
          new: newRequests,
          inProgress,
          completed
        }
      };
  
    } catch (error: any) {
      console.error('❌ Erreur dans getRequestsStats:', error);
      throw new DatabaseError(`Erreur lors de la récupération des stats demandes: ${error.message}`);
    }
  }
  
 

  /**
   * Récupère les tâches récentes
   */
  static async getRecentTasks(organizationId: string, limit: number = 5) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          project: { organizationId }
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
          completedAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      return tasks;

    } catch (error: any) {
      console.error('❌ Erreur dans getRecentTasks:', error);
      throw new DatabaseError(`Erreur lors de la récupération des tâches récentes: ${error.message}`);
    }
  }

  /**
   * Récupère les demandes récentes
//    */
 

  /**
   * Récupère les projets d'un utilisateur
   */
  static async getProjectsByUser(userId: string, filters: any = {}) {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new ValidationError("L'identifiant de l'utilisateur est requis et doit être une chaîne non vide.");
    }
  
    try {
      const { status, name, paginated = true } = filters;
  
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
  
      const total = await prisma.project.count({ where });
  
      // Configuration pour la pagination ou récupération complète
      let queryOptions: any = {
        where,
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
          organizationId: true,
          
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
              checklist: {
                select: {
                  id: true,
                  description: true,               
                  completed: true,
                  required: true,
                  taskId: true
                }
              },
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
          updatedAt: 'desc'
        }
      };
  
      // Si la pagination est désactivée, ne pas ajouter skip et take
      if (paginated) {
        const { page = 1, pageSize = 25 } = filters;
        const currentPage = Math.max(1, page);
        const limit = Math.min(100, Math.max(1, pageSize));
        const offset = (currentPage - 1) * limit;
  
        queryOptions.skip = offset;
        queryOptions.take = limit;
  
        const projects = await prisma.project.findMany(queryOptions);
        
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
      } else {
        // Récupération de tous les projets sans pagination
        const projects = await prisma.project.findMany(queryOptions);
  
        return {
          data: projects,
          total,
          paginated: false,
          message: `Tous les projets de l'utilisateur récupérés avec succès`,
        };
      }
  
    } catch (error: any) {
      console.error('❌ Erreur dans getProjectsByUser:', error);
  
      if (error instanceof ValidationError) {
        throw error;
      }
  
      throw new DatabaseError(`Échec de la récupération des projets de l'utilisateur: ${error.message}`);
    }
  }

  /**
   * Récupère les utilisateurs de la même organisation
   */
  static async getUsersBySameOrganizationId(userId: string, options?: {
    page?: number;
    limit?: number;
    cursor?: any;
  }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user?.organizationId) {
        throw new Error("Organisation introuvable pour cet utilisateur.");
      }

      const page = options?.page ?? 1;
      const limit = options?.limit ?? 10;
      const offset = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            organizationId: user.organizationId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            avatar: true,
            phoneNumber: true,
            jobTitle: true,
            department: true,
            createdAt: true,
            lastLogin: true,
          },
          skip: offset,
          take: limit,
          orderBy: {
            name: 'asc'
          }
        }),
        prisma.user.count({
          where: {
            organizationId: user.organizationId,
          }
        })
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        success: true,
        data: users,
        total,
        page,
        perPage: limit,
        lastPage,
        from: offset + 1,
        to: offset + users.length,
        hasNextPage: page < lastPage,
        hasPreviousPage: page > 1,
        paginated: true,
        message: 'Utilisateurs de la même organisation récupérés avec succès'
      };

    } catch (error: any) {
      console.error('❌ Erreur dans getUsersBySameOrganizationId:', error);
      throw new DatabaseError(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }

  /**
   * Méthode utilitaire pour récupérer les tâches par utilisateur
   */

  static async getRecentRequests(
    organizationId: string,
    limit: number = 5,
    status?: string,
    last7Days: boolean = false
  ) {
    try {
      if (!organizationId || typeof organizationId !== 'string' || organizationId.trim() === '') {
        throw new ValidationError("L'identifiant de l'organisation est requis.");
      }
  
      const where: any = {
        organisationOrgId: organizationId.trim()
      };
  
      // Filtre par statut si fourni
      if (status) {
        where.status = status;
      }
  
      // Filtre par date si last7Days est activé
      if (last7Days) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        where.createdAt = {
          gte: sevenDaysAgo
        };
      }
  
      const requests = await prisma.request.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          createdAt: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          location: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              country: true,
              latitude: true,
              longitude: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });
  
      return requests;
    } catch (error: any) {
      console.error('❌ Erreur dans getRecentRequests (service):', error);
      throw new DatabaseError(`Erreur lors de la récupération des demandes récentes: ${error.message}`);
    }
  }
    static async getTasksByUser(userId: string, organizationId: string, filters: any = {}) {
    try {
      const where: any = {
        project: { organizationId },
        assignedToId: userId // Si vous voulez filtrer par utilisateur assigné
      };

      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;

      const tasks = await prisma.task.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              name: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return tasks;

    } catch (error: any) {
      console.error('❌ Erreur dans getTasksByUser:', error);
      throw new DatabaseError(`Erreur lors de la récupération des tâches par utilisateur: ${error.message}`);
    }
  }




}

export default DashboardService;