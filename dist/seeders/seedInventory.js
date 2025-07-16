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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../src/generated/prisma");
const mockInventor_1 = require("./mockInventor");
const prisma = new prisma_1.PrismaClient();
function seedInventory() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Purge existing data
            yield prisma.maintenanceRecord.deleteMany();
            yield prisma.inventoryTransaction.deleteMany();
            yield prisma.inventoryItem.deleteMany();
            yield prisma.equipment.deleteMany();
            yield prisma.location.deleteMany();
            yield prisma.user.deleteMany();
            // Seed users
            for (const user of mockInventor_1.users) {
                yield prisma.user.create({
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password || "defaultPassword123", // <-- obligatoire
                        role: user.role,
                        status: user.status,
                        avatar: user.avatar,
                        // organization: user.organization,
                        phoneNumber: user.phoneNumber,
                        jobTitle: user.jobTitle,
                        department: user.department,
                        createdAt: user.createdAt,
                        lastLogin: user.lastLogin,
                        updatedAt: user.updatedAt
                    }
                });
            }
            // Seed locations
            for (const location of Object.values(mockInventor_1.inventoryLocations)) {
                yield prisma.location.create({
                    data: {
                        id: location.id,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        address: location.address,
                        city: location.city,
                        region: location.region,
                        country: location.country,
                        description: location.description
                    }
                });
            }
            // Seed equipments
            for (const equipment of mockInventor_1.equipments) {
                if (!equipment.location) {
                    throw new Error(`Location is undefined for equipment with id: ${equipment.id}`);
                }
                yield prisma.equipment.create({
                    data: {
                        id: equipment.id,
                        name: equipment.name,
                        type: equipment.type,
                        model: equipment.model,
                        serialNumber: equipment.serialNumber,
                        manufacturer: equipment.manufacturer,
                        purchaseDate: equipment.purchaseDate,
                        purchasePrice: equipment.purchasePrice,
                        currency: equipment.currency,
                        warrantyExpirationDate: equipment.warrantyExpirationDate,
                        status: equipment.status,
                        condition: equipment.condition,
                        description: equipment.description,
                        specifications: equipment.specifications,
                        category: equipment.category,
                        tags: equipment.tags,
                        lastMaintenance: equipment.lastMaintenance,
                        nextMaintenance: equipment.nextMaintenance,
                        barcode: equipment.barcode,
                        qrCode: equipment.qrCode,
                        createdAt: equipment.createdAt,
                        updatedAt: equipment.updatedAt,
                        locationId: equipment.location.id,
                        assignedToId: (_a = equipment.assignedTo) === null || _a === void 0 ? void 0 : _a.id,
                        maintenanceHistory: {
                            create: equipment.maintenanceHistory.map(mh => ({
                                id: mh.id,
                                maintenanceType: mh.maintenanceType,
                                date: mh.date,
                                description: mh.description,
                                cost: mh.cost,
                                currency: mh.currency,
                                status: mh.status,
                                notes: mh.notes,
                                scheduledDate: mh.scheduledDate,
                                completedDate: mh.completedDate,
                                createdAt: mh.createdAt,
                                updatedAt: mh.updatedAt,
                                technicianId: mh.technician.id,
                                createdById: mh.createdBy.id,
                                parts: {
                                    create: mh.parts.map(part => {
                                        if (!part.location) {
                                            throw new Error(`Location is undefined for part with id: ${part.id}`);
                                        }
                                        return {
                                            id: part.id,
                                            name: part.name,
                                            SKU: part.SKU,
                                            category: part.category,
                                            quantity: part.quantity,
                                            unit: part.unit,
                                            status: part.status,
                                            locationId: part.location.id,
                                            createdAt: part.createdAt
                                        };
                                    })
                                }
                            }))
                        },
                        documents: {
                            create: equipment.documents.map(doc => ({
                                id: doc.id,
                                title: doc.title,
                                description: doc.description,
                                fileUrl: doc.fileUrl,
                                fileType: doc.fileType,
                                fileSize: doc.fileSize,
                                category: doc.category,
                                tags: doc.tags,
                                version: doc.version,
                                status: doc.status,
                                uploadedAt: doc.uploadedAt,
                                updatedAt: doc.updatedAt,
                                uploadedById: doc.uploadedBy.id
                            }))
                        }
                    }
                });
            }
            // Seed inventory items
            for (const item of mockInventor_1.inventoryItems) {
                yield prisma.inventoryItem.create({
                    data: {
                        id: item.id,
                        name: item.name,
                        SKU: item.SKU,
                        category: item.category,
                        description: item.description,
                        quantity: item.quantity,
                        unit: item.unit,
                        minimumStock: item.minimumStock,
                        purchasePrice: item.purchasePrice,
                        currency: item.currency,
                        purchaseDate: item.purchaseDate,
                        specifications: item.specifications,
                        tags: item.tags,
                        status: item.status,
                        imageUrl: item.imageUrl,
                        barcode: item.barcode,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        locationId: item.locationId,
                        supplierId: item.supplierId,
                        transactions: {
                            create: item.transactions.map(trans => ({
                                id: trans.id,
                                transactionType: trans.transactionType,
                                quantity: trans.quantity,
                                date: trans.date,
                                reason: trans.reason,
                                project: trans.project,
                                task: trans.task,
                                notes: trans.notes,
                                createdAt: trans.createdAt,
                                userId: trans.userId,
                                fromLocationId: trans.fromLocationId,
                                toLocationId: trans.toLocationId
                            }))
                        },
                        maintenanceRecords: {
                            create: item.maintenanceRecords.map(mr => ({
                                id: mr.id,
                                maintenanceType: mr.maintenanceType,
                                date: mr.date,
                                description: mr.description,
                                cost: mr.cost,
                                currency: mr.currency,
                                status: mr.status,
                                notes: mr.notes,
                                scheduledDate: mr.scheduledDate,
                                completedDate: mr.completedDate,
                                createdAt: mr.createdAt,
                                updatedAt: mr.updatedAt,
                                equipmentId: mr.equipmentId,
                                technicianId: mr.technicianId,
                                createdById: mr.createdById,
                                parts: {
                                    create: mr.parts.map(part => {
                                        if (!part.locationId) {
                                            throw new Error(`locationId is undefined for part with id: ${part.id}`);
                                        }
                                        return {
                                            id: part.id,
                                            name: part.name,
                                            SKU: part.SKU,
                                            category: part.category,
                                            quantity: part.quantity,
                                            unit: part.unit,
                                            status: part.status,
                                            locationId: part.locationId,
                                            createdAt: part.createdAt
                                        };
                                    })
                                }
                            }))
                        }
                    }
                });
            }
            // Seed inventory transactions
            for (const trans of mockInventor_1.inventoryTransactions) {
                yield prisma.inventoryTransaction.create({
                    data: {
                        id: trans.id,
                        transactionType: trans.transactionType,
                        quantity: trans.quantity,
                        date: trans.date,
                        reason: trans.reason,
                        project: trans.project,
                        task: trans.task,
                        notes: trans.notes,
                        createdAt: trans.createdAt,
                        itemId: trans.itemId,
                        userId: trans.userId,
                        fromLocationId: trans.fromLocationId,
                        toLocationId: trans.toLocationId,
                        documents: {
                            create: trans.documents.map(doc => ({
                                id: doc.id,
                                title: doc.title,
                                description: doc.description,
                                fileUrl: doc.fileUrl,
                                fileType: doc.fileType,
                                fileSize: doc.fileSize,
                                category: doc.category,
                                tags: doc.tags,
                                version: doc.version,
                                status: doc.status,
                                uploadedAt: doc.uploadedAt,
                                updatedAt: doc.updatedAt,
                                uploadedById: doc.uploadedById
                            }))
                        }
                    }
                });
            }
            // Seed maintenance records
            for (const maint of mockInventor_1.maintenanceRecords) {
                // Retirer id pour que la DB gère l'autoincrement
                const { id } = maint, dataWithoutId = __rest(maint, ["id"]);
                yield prisma.maintenanceRecord.create({
                    data: {
                        // Champs principaux sans id
                        maintenanceType: dataWithoutId.maintenanceType,
                        date: dataWithoutId.date,
                        description: dataWithoutId.description,
                        cost: dataWithoutId.cost,
                        currency: dataWithoutId.currency,
                        status: dataWithoutId.status,
                        notes: dataWithoutId.notes,
                        scheduledDate: dataWithoutId.scheduledDate,
                        completedDate: dataWithoutId.completedDate,
                        createdAt: dataWithoutId.createdAt,
                        updatedAt: dataWithoutId.updatedAt,
                        equipmentId: dataWithoutId.equipmentId,
                        technicianId: dataWithoutId.technicianId,
                        createdById: dataWithoutId.createdById,
                        // Relations - SANS les id auto-générés
                        parts: {
                            create: dataWithoutId.parts.map(part => {
                                if (!part.locationId) {
                                    throw new Error(`locationId is undefined for part with id: ${part.id}`);
                                }
                                // Retirer l'id de part aussi !
                                const { id: partId } = part, partWithoutId = __rest(part, ["id"]);
                                return {
                                    name: partWithoutId.name,
                                    SKU: partWithoutId.SKU,
                                    category: partWithoutId.category,
                                    quantity: partWithoutId.quantity,
                                    unit: partWithoutId.unit,
                                    status: partWithoutId.status,
                                    locationId: partWithoutId.locationId,
                                    createdAt: partWithoutId.createdAt,
                                };
                            }),
                        },
                        documents: {
                            create: dataWithoutId.documents.map(doc => {
                                // Retirer l'id de document aussi !
                                const { id: docId } = doc, docWithoutId = __rest(doc, ["id"]);
                                return {
                                    title: docWithoutId.title,
                                    description: docWithoutId.description,
                                    fileUrl: docWithoutId.fileUrl,
                                    fileType: docWithoutId.fileType,
                                    fileSize: docWithoutId.fileSize,
                                    category: docWithoutId.category,
                                    tags: docWithoutId.tags,
                                    version: docWithoutId.version,
                                    status: docWithoutId.status,
                                    uploadedAt: docWithoutId.uploadedAt,
                                    updatedAt: docWithoutId.updatedAt,
                                    uploadedById: docWithoutId.uploadedById,
                                };
                            }),
                        },
                    },
                });
            }
            console.log('✅ Seed terminé');
        }
        catch (e) {
            console.error('❌ Erreur lors du seed:', e);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
seedInventory();
