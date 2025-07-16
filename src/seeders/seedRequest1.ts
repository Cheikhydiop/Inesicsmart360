// // seedRequest1.ts
// import { PrismaClient, $Enums } from '../../src/generated/prisma';
// import { requestUsers, locations, sampleComments, sampleAttachments, requests } from './mockRequest1';

// const prisma = new PrismaClient();

// function mapUserRole(role: string): $Enums.UserRole {
//   switch (role) {
//     case 'ADMIN': return $Enums.UserRole.ADMIN;
//     case 'PROJECT_MANAGER': return $Enums.UserRole.PROJECT_MANAGER;
//     case 'SUPERVISOR': return $Enums.UserRole.SUPERVISOR;
//     case 'TECHNICIAN': return $Enums.UserRole.TECHNICIAN;
//     case 'CONTRACTOR': return $Enums.UserRole.CONTRACTOR;
//     case 'CLIENT': return $Enums.UserRole.CLIENT;
//     case 'GOVERNMENT': return $Enums.UserRole.GOVERNMENT;
//     case 'CALL_CENTER': return $Enums.UserRole.CALL_CENTER;
//     case 'AUDITOR': return $Enums.UserRole.AUDITOR;
//     case 'CITIZEN': return $Enums.UserRole.CITIZEN;
//     default:
//       throw new Error(`Invalid UserRole: ${role}`);
//   }
// }

// function mapUserStatus(status: string): $Enums.UserStatus {
//   switch (status) {
//     case 'ACTIVE': return $Enums.UserStatus.ACTIVE;
//     case 'INACTIVE': return $Enums.UserStatus.INACTIVE;
//     case 'SUSPENDED': return $Enums.UserStatus.SUSPENDED;
//     case 'PENDING': return $Enums.UserStatus.PENDING;
//     default:
//       throw new Error(`Invalid UserStatus: ${status}`);
//   }
// }

// function mapRequestType(type: string): $Enums.RequestType {
//   switch (type) {
//     case 'CONNECTION': return $Enums.RequestType.CONNECTION;
//     case 'INCIDENT': return $Enums.RequestType.INCIDENT;
//     case 'AUDIT': return $Enums.RequestType.AUDIT;
//     case 'INSPECTION': return $Enums.RequestType.INSPECTION;
//     case 'MAINTENANCE': return $Enums.RequestType.MAINTENANCE;
//     case 'OTHER': return $Enums.RequestType.OTHER;
//     default:
//       throw new Error(`Invalid RequestType: ${type}`);
//   }
// }

// function mapRequestStatus(status: string): $Enums.RequestStatus {
//   switch (status) {
//     case 'SUBMITTED': return $Enums.RequestStatus.SUBMITTED;
//     case 'ANALYZING': return $Enums.RequestStatus.ANALYZING;
//     case 'VALIDATED': return $Enums.RequestStatus.VALIDATED;
//     case 'ASSIGNED': return $Enums.RequestStatus.ASSIGNED;
//     case 'IN_PROGRESS': return $Enums.RequestStatus.IN_PROGRESS;
//     case 'COMPLETED': return $Enums.RequestStatus.COMPLETED;
//     case 'REJECTED': return $Enums.RequestStatus.REJECTED;
//     case 'CANCELLED': return $Enums.RequestStatus.CANCELLED;
//     default:
//       throw new Error(`Invalid RequestStatus: ${status}`);
//   }
// }

// function mapTaskStatus(status: string): $Enums.TaskStatus {
//   switch (status) {
//     case 'PENDING': return $Enums.TaskStatus.PENDING;
//     case 'ASSIGNED': return $Enums.TaskStatus.ASSIGNED;
//     case 'IN_PROGRESS': return $Enums.TaskStatus.IN_PROGRESS;
//     case 'COMPLETED': return $Enums.TaskStatus.COMPLETED;
//     case 'REJECTED': return $Enums.TaskStatus.REJECTED;
//     case 'CANCELLED': return $Enums.TaskStatus.CANCELLED;
//     // Map RequestStatus values to appropriate TaskStatus values
//     case 'SUBMITTED': return $Enums.TaskStatus.PENDING;
//     case 'ANALYZING': return $Enums.TaskStatus.IN_PROGRESS;
//     case 'VALIDATED': return $Enums.TaskStatus.ASSIGNED;
//     default:
//       throw new Error(`Invalid TaskStatus: ${status}`);
//   }
// }

// function mapRequestChannel(channel: string): $Enums.RequestChannel {
//   switch (channel) {
//     case 'APP': return $Enums.RequestChannel.APP;
//     case 'WEBSITE': return $Enums.RequestChannel.WEBSITE;
//     case 'API': return $Enums.RequestChannel.API;
//     case 'CALL_CENTER': return $Enums.RequestChannel.CALL_CENTER;
//     case 'FIELD_AGENT': return $Enums.RequestChannel.FIELD_AGENT;
//     default:
//       throw new Error(`Invalid RequestChannel: ${channel}`);
//   }
// }

// function mapPriority(priority: string): $Enums.Priority {
//   switch (priority) {
//     case 'LOW': return $Enums.Priority.LOW;
//     case 'MEDIUM': return $Enums.Priority.MEDIUM;
//     case 'HIGH': return $Enums.Priority.HIGH;
//     case 'CRITICAL': return $Enums.Priority.CRITICAL;
//     default:
//       throw new Error(`Invalid Priority: ${priority}`);
//   }
// }

// async function main() {
//   // Purge existing data dans l'ordre correct (tables dépendantes en premier)
//   console.log('🗑️ Suppression des données existantes...');
  
//   try {
//     // Supprimer toutes les tables qui pourraient référencer des utilisateurs
//     await prisma.inventoryTransaction.deleteMany();
//     await prisma.maintenanceRecord.deleteMany();
//     await prisma.task.deleteMany();
//     await prisma.comment.deleteMany();
//     await prisma.attachment.deleteMany();
//     await prisma.request.deleteMany();
    
//     // Autres tables potentielles (ajustez selon votre schéma)
//     // await prisma.project.deleteMany();
//     // await prisma.equipment.deleteMany();
//     // await prisma.notification.deleteMany();
    
//     // Ensuite supprimer les tables principales
//     await prisma.user.deleteMany();
//     await prisma.location.deleteMany();
    
//     console.log('✅ Données existantes supprimées');
//   } catch (error) {
//     console.error('❌ Erreur lors de la suppression:', error);
//     throw error;
//   }

//   // Seed users
//   for (const user of requestUsers) {
//     await prisma.user.create({
//       data: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: mapUserRole(user.role),
//         phoneNumber: user.phoneNumber,
//         status: mapUserStatus(user.status),
//         password: user.password,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       },
//     });
//   }

//   // Seed locations
//   for (const location of Object.values(locations)) {
//     await prisma.location.create({
//       data: {
//         id: location.id,
//         latitude: location.latitude,
//         longitude: location.longitude,
//         address: location.address,
//         city: location.city,
//         region: location.region,
//         country: location.country,
//         description: location.description,
//       },
//     });
//   }

//   // Seed comments
//   for (const comment of sampleComments) {
//     await prisma.comment.create({
//       data: {
//         id: comment.id,
//         content: comment.content,
//         createdById: comment.createdById,
//         createdAt: comment.createdAt,
//         updatedAt: comment.updatedAt,
//       },
//     });
//   }

//   // Seed attachments
//   for (const attachment of sampleAttachments) {
//     await prisma.attachment.create({
//       data: {
//         id: attachment.id,
//         fileName: attachment.fileName,
//         fileType: attachment.fileType,
//         fileSize: attachment.fileSize,
//         fileUrl: attachment.fileUrl,
//         uploadedById: attachment.uploadedById,
//         uploadedAt: attachment.uploadedAt,
//         description: attachment.description,
//       },
//     });
//   }

//   for (const request of requests) {
//     try {
//       await prisma.request.upsert({
//         where: { id: request.id },
//         update: {}, // pas de modification si la requête existe déjà
//         create: {
//           id: request.id,
//           title: request.title,
//           description: request.description,
//           type: mapRequestType(request.type),
//           priority: mapPriority(request.priority),
//           status: mapRequestStatus(request.status),
//           locationId: request.location?.id || null,
//           createdById: request.createdById,
//           createdAt: request.createdAt,
//           assignedToId: request.assignedToId || null,
//           projectId: request.project?.id || null,
//           dueDate: request.dueDate || null,
//           channel: mapRequestChannel(request.channel),
//           comments: {
//             create: request.comments?.map(comment => ({
//               id: comment.id,
//               content: comment.content,
//               createdById: comment.createdById,
//               createdAt: comment.createdAt,
//               updatedAt: comment.updatedAt,
//             })) || [],
//           },
//           attachments: {
//             create: request.attachments?.map(attachment => ({
//               id: attachment.id,
//               fileName: attachment.fileName,
//               fileType: attachment.fileType,
//               fileSize: attachment.fileSize,
//               fileUrl: attachment.fileUrl,
//               uploadedById: attachment.uploadedById,
//               uploadedAt: attachment.uploadedAt,
//               description: attachment.description,
//             })) || [],
//           },
//           tasks: {
//             create: request.tasks?.map(task => ({
//               id: task.id,
//               title: task.title,
//               description: task.description,
//               status: mapTaskStatus(task.status),
//               priority: mapPriority(task.priority),
//               dueDate: task.dueDate,
//               createdAt: task.createdAt,
//             })) || [],
//           },
//         },
//       });
//       console.log(`✅ Request ${request.id} insérée ou déjà existante.`);
//     } catch (error) {
//       console.error(`❌ Erreur lors de l'insertion de la requête ${request.id} :`, error);
//     }
//   }
  
//     console.log('✅ Seed terminé');
// }

// main()
//   .catch(e => {
//     console.error('❌ Erreur lors du seed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });