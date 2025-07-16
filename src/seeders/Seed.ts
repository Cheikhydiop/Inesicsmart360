// import { PrismaClient, $Enums } from '@prisma/client';
// import { equipments, inventoryItems, inventoryTransactions, maintenanceRecords } from './mockInventor';

// const prisma = new PrismaClient();

// function mapEquipmentStatus(status: string): $Enums.EquipmentStatus {
//   switch (status) {
//     case 'AVAILABLE': return $Enums.EquipmentStatus.AVAILABLE;
//     case 'IN_USE': return $Enums.EquipmentStatus.IN_USE;
//     case 'MAINTENANCE': return $Enums.EquipmentStatus.MAINTENANCE;
//     case 'REPAIR': return $Enums.EquipmentStatus.REPAIR;
//     default:
//       throw new Error(`Invalid EquipmentStatus: ${status}`);
//   }
// }

// function mapEquipmentCondition(condition: string): $Enums.EquipmentCondition {
//   switch (condition) {
//     case 'NEW': return $Enums.EquipmentCondition.NEW;
//     case 'GOOD': return $Enums.EquipmentCondition.GOOD;
//     case 'FAIR': return $Enums.EquipmentCondition.FAIR;
//     case 'POOR': return $Enums.EquipmentCondition.POOR;
//     default:
//       throw new Error(`Invalid EquipmentCondition: ${condition}`);
//   }
// }

// function mapEquipmentCategory(category: string): $Enums.EquipmentCategory {
//   switch (category) {
//     case 'ELECTRICAL': return $Enums.EquipmentCategory.ELECTRICAL;
//     case 'CONSTRUCTION': return $Enums.EquipmentCategory.CONSTRUCTION;
//     case 'MEASUREMENT': return $Enums.EquipmentCategory.MEASUREMENT;
//     case 'POWER': return $Enums.EquipmentCategory.POWER;
//     case 'ELECTRONIC': return $Enums.EquipmentCategory.ELECTRONIC;
//     case 'MECHANICAL': return $Enums.EquipmentCategory.MECHANICAL;
//     case 'IT': return $Enums.EquipmentCategory.IT;
//     case 'SAFETY': return $Enums.EquipmentCategory.SAFETY;
//     default:
//       throw new Error(`Invalid EquipmentCategory: ${category}`);
//   }
// }

// function mapInventoryItemStatus(status: string): $Enums.InventoryItemStatus {
//   switch (status) {
//     case 'IN_STOCK': return $Enums.InventoryItemStatus.IN_STOCK;
//     case 'LOW_STOCK': return $Enums.InventoryItemStatus.LOW_STOCK;
//     case 'OUT_OF_STOCK': return $Enums.InventoryItemStatus.OUT_OF_STOCK;
//     default:
//       throw new Error(`Invalid InventoryItemStatus: ${status}`);
//   }
// }

// function mapInventoryTransactionType(type: string): $Enums.InventoryTransactionType {
//   switch (type) {
//     case 'RECEIPT': return $Enums.InventoryTransactionType.RECEIPT;
//     case 'ISSUE': return $Enums.InventoryTransactionType.ISSUE;
//     case 'TRANSFER': return $Enums.InventoryTransactionType.TRANSFER;
//     case 'COUNT': return $Enums.InventoryTransactionType.COUNT;
//     default:
//       throw new Error(`Invalid InventoryTransactionType: ${type}`);
//   }
// }

// function mapMaintenanceType(type: string): $Enums.MaintenanceType {
//   switch (type) {
//     case 'PREVENTIVE': return $Enums.MaintenanceType.PREVENTIVE;
//     case 'CORRECTIVE': return $Enums.MaintenanceType.CORRECTIVE;
//     case 'CALIBRATION': return $Enums.MaintenanceType.CALIBRATION;
//     default:
//       throw new Error(`Invalid MaintenanceType: ${type}`);
//   }
// }

// function mapMaintenanceStatus(status: string): $Enums.MaintenanceStatus {
//   switch (status) {
//     case 'SCHEDULED': return $Enums.MaintenanceStatus.SCHEDULED;
//     case 'IN_PROGRESS': return $Enums.MaintenanceStatus.IN_PROGRESS;
//     case 'COMPLETED': return $Enums.MaintenanceStatus.COMPLETED;
//     case 'CANCELLED': return $Enums.MaintenanceStatus.CANCELLED;
//     default:
//       throw new Error(`Invalid MaintenanceStatus: ${status}`);
//   }
// }

// async function main() {
//   // Purge existing data
//   await prisma.maintenanceRecord.deleteMany();
//   await prisma.inventoryTransaction.deleteMany();
//   await prisma.inventoryItem.deleteMany();
//   await prisma.equipment.deleteMany();

//   for (const eq of equipments) {
//     await prisma.equipment.create({
//       data: {
//         id: eq.id,
//         name: eq.name,
//         type: eq.type,
//         model: eq.model,
//         serialNumber: eq.serialNumber,
//         manufacturer: eq.manufacturer,
//         purchaseDate: eq.purchaseDate ? new Date(eq.purchaseDate) : new Date(),
//         purchasePrice: eq.purchasePrice,
//         currency: eq.currency,
//         warrantyExpirationDate: eq.warrantyExpirationDate ? new Date(eq.warrantyExpirationDate) : undefined,
//         status: mapEquipmentStatus(eq.status),
//         condition: mapEquipmentCondition(eq.condition),
//         location: eq.location
//           ? {
//               create: {
//                 latitude: eq.location.latitude,
//                 longitude: eq.location.longitude,
//                 address: eq.location.address,
//                 city: eq.location.city,
//                 region: eq.location.region,
//                 country: eq.location.country,
//                 description: eq.location.description,
//               },
//             }
//           : undefined,
//         description: eq.description,
//         specifications: eq.specifications,
//         category: mapEquipmentCategory(eq.category),
//         tags: eq.tags,
//         lastMaintenance: eq.lastMaintenance ? new Date(eq.lastMaintenance) : undefined,
//         nextMaintenance: eq.nextMaintenance ? new Date(eq.nextMaintenance) : undefined,
//         createdAt: eq.createdAt ? new Date(eq.createdAt) : new Date(),
//         updatedAt: eq.updatedAt ? new Date(eq.updatedAt) : new Date(),
//         barcode: eq.barcode,
//         qrCode: eq.qrCode,
//       },
//     });
//   }
  
//   // Seed inventory items
//   for (const item of inventoryItems) {
//     await prisma.inventoryItem.create({
//       data: {
//         id: item.id,
//         name: item.name,
//         SKU: item.SKU,
//         category: item.category,
//         description: item.description,
//         quantity: item.quantity,
//         unit: item.unit,
//         minimumStock: item.minimumStock,
//         location: {
//           connect: { id: item.location.id },
//         },
//         supplier: item.supplier,
//         purchasePrice: item.purchasePrice,
//         currency: item.currency,
//         purchaseDate: new Date(item.purchaseDate),
//         specifications: item.specifications,
//         tags: item.tags,
//         status: mapInventoryItemStatus(item.status),
//         imageUrl: item.imageUrl,
//         barcode: item.barcode,
//         createdAt: new Date(item.createdAt),
//         updatedAt: new Date(item.updatedAt),
//       },
//     });
//   }

//   // Seed inventory transactions
//   for (const trans of inventoryTransactions) {
//     await prisma.inventoryTransaction.create({
//       data: {
//         id: trans.id,
//         itemId: trans.itemId,
//         transactionType: mapInventoryTransactionType(trans.transactionType),
//         quantity: trans.quantity,
//         toLocation: trans.toLocation ? { connect: { id: trans.toLocation.id } } : undefined,
//         fromLocation: trans.fromLocation ? { connect: { id: trans.fromLocation.id } } : undefined,
//         date: new Date(trans.date),
//         user: trans.user,
//         reason: trans.reason,
//         notes: trans.notes,
//         createdAt: new Date(trans.createdAt),
//       },
//     });
//   }

//   // Seed maintenance records
//   for (const maint of maintenanceRecords) {
//     await prisma.maintenanceRecord.create({
//       data: {
//         id: maint.id,
//         equipmentId: maint.equipmentId,
//         maintenanceType: mapMaintenanceType(maint.maintenanceType),
//         date: new Date(maint.date),
//         description: maint.description,
//         technician: maint.technician,
//         cost: maint.cost,
//         currency: maint.currency,
//         status: mapMaintenanceStatus(maint.status),
//         notes: maint.notes,
//         scheduledDate: new Date(maint.scheduledDate),
//         completedDate: maint.completedDate ? new Date(maint.completedDate) : null,
//         createdBy: maint.createdBy,
//         createdAt: new Date(maint.createdAt),
//         updatedAt: new Date(maint.updatedAt),
//       },
//     });
//   }

//   console.log('✅ Seed terminé');
// }

// main()
//   .catch(e => {
//     console.error('❌ Erreur lors du seed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
