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
// seedRequest1.ts
const prisma_1 = require("../../src/generated/prisma");
const mockRequest1_1 = require("./mockRequest1");
const prisma = new prisma_1.PrismaClient();
function mapUserRole(role) {
    switch (role) {
        case 'ADMIN': return prisma_1.$Enums.UserRole.ADMIN;
        case 'PROJECT_MANAGER': return prisma_1.$Enums.UserRole.PROJECT_MANAGER;
        case 'SUPERVISOR': return prisma_1.$Enums.UserRole.SUPERVISOR;
        case 'TECHNICIAN': return prisma_1.$Enums.UserRole.TECHNICIAN;
        case 'CONTRACTOR': return prisma_1.$Enums.UserRole.CONTRACTOR;
        case 'CLIENT': return prisma_1.$Enums.UserRole.CLIENT;
        case 'GOVERNMENT': return prisma_1.$Enums.UserRole.GOVERNMENT;
        case 'CALL_CENTER': return prisma_1.$Enums.UserRole.CALL_CENTER;
        case 'AUDITOR': return prisma_1.$Enums.UserRole.AUDITOR;
        case 'CITIZEN': return prisma_1.$Enums.UserRole.CITIZEN;
        default:
            throw new Error(`Invalid UserRole: ${role}`);
    }
}
function mapUserStatus(status) {
    switch (status) {
        case 'ACTIVE': return prisma_1.$Enums.UserStatus.ACTIVE;
        case 'INACTIVE': return prisma_1.$Enums.UserStatus.INACTIVE;
        case 'SUSPENDED': return prisma_1.$Enums.UserStatus.SUSPENDED;
        case 'PENDING': return prisma_1.$Enums.UserStatus.PENDING;
        default:
            throw new Error(`Invalid UserStatus: ${status}`);
    }
}
function mapRequestType(type) {
    switch (type) {
        case 'CONNECTION': return prisma_1.$Enums.RequestType.CONNECTION;
        case 'INCIDENT': return prisma_1.$Enums.RequestType.INCIDENT;
        case 'AUDIT': return prisma_1.$Enums.RequestType.AUDIT;
        case 'INSPECTION': return prisma_1.$Enums.RequestType.INSPECTION;
        case 'MAINTENANCE': return prisma_1.$Enums.RequestType.MAINTENANCE;
        case 'OTHER': return prisma_1.$Enums.RequestType.OTHER;
        default:
            throw new Error(`Invalid RequestType: ${type}`);
    }
}
function mapRequestStatus(status) {
    switch (status) {
        case 'SUBMITTED': return prisma_1.$Enums.RequestStatus.SUBMITTED;
        case 'ANALYZING': return prisma_1.$Enums.RequestStatus.ANALYZING;
        case 'VALIDATED': return prisma_1.$Enums.RequestStatus.VALIDATED;
        case 'ASSIGNED': return prisma_1.$Enums.RequestStatus.ASSIGNED;
        case 'IN_PROGRESS': return prisma_1.$Enums.RequestStatus.IN_PROGRESS;
        case 'COMPLETED': return prisma_1.$Enums.RequestStatus.COMPLETED;
        case 'REJECTED': return prisma_1.$Enums.RequestStatus.REJECTED;
        case 'CANCELLED': return prisma_1.$Enums.RequestStatus.CANCELLED;
        default:
            throw new Error(`Invalid RequestStatus: ${status}`);
    }
}
function mapTaskStatus(status) {
    switch (status) {
        case 'PENDING': return prisma_1.$Enums.TaskStatus.PENDING;
        case 'ASSIGNED': return prisma_1.$Enums.TaskStatus.ASSIGNED;
        case 'IN_PROGRESS': return prisma_1.$Enums.TaskStatus.IN_PROGRESS;
        case 'COMPLETED': return prisma_1.$Enums.TaskStatus.COMPLETED;
        case 'REJECTED': return prisma_1.$Enums.TaskStatus.REJECTED;
        case 'CANCELLED': return prisma_1.$Enums.TaskStatus.CANCELLED;
        // Map RequestStatus values to appropriate TaskStatus values
        case 'SUBMITTED': return prisma_1.$Enums.TaskStatus.PENDING;
        case 'ANALYZING': return prisma_1.$Enums.TaskStatus.IN_PROGRESS;
        case 'VALIDATED': return prisma_1.$Enums.TaskStatus.ASSIGNED;
        default:
            throw new Error(`Invalid TaskStatus: ${status}`);
    }
}
function mapRequestChannel(channel) {
    switch (channel) {
        case 'APP': return prisma_1.$Enums.RequestChannel.APP;
        case 'WEBSITE': return prisma_1.$Enums.RequestChannel.WEBSITE;
        case 'API': return prisma_1.$Enums.RequestChannel.API;
        case 'CALL_CENTER': return prisma_1.$Enums.RequestChannel.CALL_CENTER;
        case 'FIELD_AGENT': return prisma_1.$Enums.RequestChannel.FIELD_AGENT;
        default:
            throw new Error(`Invalid RequestChannel: ${channel}`);
    }
}
function mapPriority(priority) {
    switch (priority) {
        case 'LOW': return prisma_1.$Enums.Priority.LOW;
        case 'MEDIUM': return prisma_1.$Enums.Priority.MEDIUM;
        case 'HIGH': return prisma_1.$Enums.Priority.HIGH;
        case 'CRITICAL': return prisma_1.$Enums.Priority.CRITICAL;
        default:
            throw new Error(`Invalid Priority: ${priority}`);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        // Purge existing data dans l'ordre correct (tables dépendantes en premier)
        console.log('🗑️ Suppression des données existantes...');
        try {
            // Supprimer toutes les tables qui pourraient référencer des utilisateurs
            yield prisma.inventoryTransaction.deleteMany();
            yield prisma.maintenanceRecord.deleteMany();
            yield prisma.task.deleteMany();
            yield prisma.comment.deleteMany();
            yield prisma.attachment.deleteMany();
            yield prisma.request.deleteMany();
            // Autres tables potentielles (ajustez selon votre schéma)
            // await prisma.project.deleteMany();
            // await prisma.equipment.deleteMany();
            // await prisma.notification.deleteMany();
            // Ensuite supprimer les tables principales
            yield prisma.user.deleteMany();
            yield prisma.location.deleteMany();
            console.log('✅ Données existantes supprimées');
        }
        catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            throw error;
        }
        // Seed users
        for (const user of mockRequest1_1.requestUsers) {
            yield prisma.user.create({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: mapUserRole(user.role),
                    phoneNumber: user.phoneNumber,
                    status: mapUserStatus(user.status),
                    password: user.password,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        }
        // Seed locations
        for (const location of Object.values(mockRequest1_1.locations)) {
            yield prisma.location.create({
                data: {
                    id: location.id,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                    city: location.city,
                    region: location.region,
                    country: location.country,
                    description: location.description,
                },
            });
        }
        // Seed comments
        for (const comment of mockRequest1_1.sampleComments) {
            yield prisma.comment.create({
                data: {
                    id: comment.id,
                    content: comment.content,
                    createdById: comment.createdById,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                },
            });
        }
        // Seed attachments
        for (const attachment of mockRequest1_1.sampleAttachments) {
            yield prisma.attachment.create({
                data: {
                    id: attachment.id,
                    fileName: attachment.fileName,
                    fileType: attachment.fileType,
                    fileSize: attachment.fileSize,
                    fileUrl: attachment.fileUrl,
                    uploadedById: attachment.uploadedById,
                    uploadedAt: attachment.uploadedAt,
                    description: attachment.description,
                },
            });
        }
        for (const request of mockRequest1_1.requests) {
            try {
                yield prisma.request.upsert({
                    where: { id: request.id },
                    update: {}, // pas de modification si la requête existe déjà
                    create: {
                        id: request.id,
                        title: request.title,
                        description: request.description,
                        type: mapRequestType(request.type),
                        priority: mapPriority(request.priority),
                        status: mapRequestStatus(request.status),
                        locationId: ((_a = request.location) === null || _a === void 0 ? void 0 : _a.id) || null,
                        createdById: request.createdById,
                        createdAt: request.createdAt,
                        assignedToId: request.assignedToId || null,
                        projectId: ((_b = request.project) === null || _b === void 0 ? void 0 : _b.id) || null,
                        dueDate: request.dueDate || null,
                        channel: mapRequestChannel(request.channel),
                        comments: {
                            create: ((_c = request.comments) === null || _c === void 0 ? void 0 : _c.map(comment => ({
                                id: comment.id,
                                content: comment.content,
                                createdById: comment.createdById,
                                createdAt: comment.createdAt,
                                updatedAt: comment.updatedAt,
                            }))) || [],
                        },
                        attachments: {
                            create: ((_d = request.attachments) === null || _d === void 0 ? void 0 : _d.map(attachment => ({
                                id: attachment.id,
                                fileName: attachment.fileName,
                                fileType: attachment.fileType,
                                fileSize: attachment.fileSize,
                                fileUrl: attachment.fileUrl,
                                uploadedById: attachment.uploadedById,
                                uploadedAt: attachment.uploadedAt,
                                description: attachment.description,
                            }))) || [],
                        },
                        tasks: {
                            create: ((_e = request.tasks) === null || _e === void 0 ? void 0 : _e.map(task => ({
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                status: mapTaskStatus(task.status),
                                priority: mapPriority(task.priority),
                                dueDate: task.dueDate,
                                createdAt: task.createdAt,
                            }))) || [],
                        },
                    },
                });
                console.log(`✅ Request ${request.id} insérée ou déjà existante.`);
            }
            catch (error) {
                console.error(`❌ Erreur lors de l'insertion de la requête ${request.id} :`, error);
            }
        }
        console.log('✅ Seed terminé');
    });
}
main()
    .catch(e => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
