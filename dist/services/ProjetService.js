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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const customErrors_1 = require("../errors/customErrors");
const prisma = new prisma_1.PrismaClient();
class ProjetService {
    /**
     * Inscription d'un nouvel utilisateur
     */
    // static async getProjets(options?: {
    //   page?: number;
    //   limit?: number;
    //   cursor?: any;
    //   findOptions?: any;
    // }) {
    //   try {
    //     console.log('🚀 getProjets appelé avec options:', JSON.stringify(options, null, 2));
    //     const page = options?.page ?? 1; 
    //     const limit = options?.limit ?? 10;
    //     console.log(`📄 Pagination: page=${page}, limit=${limit}`);
    //     const result = await paginateOrFindAll(prisma, 'project', {
    //       page,
    //       limit,
    //       cursor: options?.cursor,
    //       findOptions: {
    //         select: {
    //           id: true,
    //           name: true,
    //           description: true,
    //           objective: true,
    //           scope: true,
    //           geographicalArea: true,
    //           client: true,
    //           startDate: true,
    //           endDate: true,
    //           status: true,
    //           budget: true,
    //           progress: true,
    //           contract: true,
    //           funder: true,
    //           governmentEntity: true,
    //           riskLevel: true,
    //           createdAt: true,
    //           updatedAt: true,
    //           projectManagerId: true,
    //           parentProjectId: true,
    //           locationId: true,
    //         },
    //         ...(options?.findOptions || {})
    //       },
    //     });
    //     console.log(`✅ Résultat: ${result.data.length} projets récupérés`);
    //     return {
    //       ...result,
    //       message: result.paginated
    //         ? 'Projets paginés récupérés avec succès'
    //         : 'Liste complète des projets récupérée avec succès',
    //     };
    //   } catch (error: any) {
    //     console.error('❌ Erreur dans getProjets:', error);
    //     throw new DatabaseError(`Échec de la récupération des projets: ${error.message}`);
    //   }
    // }
    static getProjectDetails(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!projectId) {
                    throw new customErrors_1.ValidationError("L'identifiant du projet est requis.");
                }
                const project = yield prisma.project.findUnique({
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
                        location: true,
                    },
                });
                if (!project) {
                    throw new customErrors_1.ValidationError("Projet introuvable.");
                }
                return {
                    data: project,
                    message: "Détails du projet récupérés avec succès",
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getProjectDetails:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération du projet : ${error.message}`);
            }
        });
    }
    static getProjectsByUser(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, filters = {}) {
            // Validation en premier
            if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
                throw new customErrors_1.ValidationError("L'identifiant de l'utilisateur est requis et doit être une chaîne non vide.");
            }
            try {
                const { status, name, page = 1, pageSize = 10 } = filters;
                // Validation des filtres
                const validStatuses = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD'];
                if (status && !validStatuses.includes(status)) {
                    throw new customErrors_1.ValidationError(`Statut invalide. Statuts autorisés: ${validStatuses.join(', ')}`);
                }
                const where = {
                    projectManagerId: userId.trim(),
                };
                if (status)
                    where.status = status;
                if (name) {
                    where.name = {
                        contains: name.trim(),
                        mode: 'insensitive'
                    };
                }
                const currentPage = Math.max(1, page);
                const limit = Math.min(50, Math.max(1, pageSize));
                const offset = (currentPage - 1) * limit;
                // Compter le total des résultats
                const total = yield prisma.project.count({ where });
                // Récupérer les projets
                const projects = yield prisma.project.findMany({
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
            }
            catch (error) {
                console.error('❌ Erreur dans getProjectsByUser:', error);
                if (error instanceof customErrors_1.ValidationError) {
                    throw error;
                }
                throw new customErrors_1.DatabaseError(`Échec de la récupération des projets de l'utilisateur: ${error.message}`);
            }
        });
    }
}
exports.default = ProjetService;
