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
class InventaireService {
    /**
     * Récupère tous les items d'inventaire avec leurs champs complets
     */
    /**
     * Récupère tous les items d'inventaire associés à une organisation spécifique
     * AVEC les maintenance records
     */
    static getInventoryByOrganization(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log(`🏢 getInventoryByOrganization appelé pour l'organisation ${organizationId}`);
                const findOptions = (_a = options === null || options === void 0 ? void 0 : options.findOptions) !== null && _a !== void 0 ? _a : {};
                const whereConditions = Object.assign({ organizationSupplierId: organizationId }, (findOptions.where || {}));
                const inventoryItems = yield prisma.inventoryItem.findMany({
                    where: whereConditions,
                    select: {
                        id: true,
                        name: true,
                        SKU: true,
                        category: true,
                        description: true,
                        quantity: true,
                        unit: true,
                        minimumStock: true,
                        location: {
                            select: {
                                id: true,
                                name: true,
                                latitude: true,
                                longitude: true,
                                address: true,
                                city: true,
                                region: true,
                                country: true,
                                description: true
                            }
                        },
                        supplier: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                city: true,
                                country: true,
                                contactPerson: true,
                                website: true,
                                status: true,
                                createdAt: true
                            }
                        },
                        organizationSupplier: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                sector: true,
                                zone_territoriale: true,
                                contacts: true,
                                logo: true,
                                status: true,
                                address: true,
                                legal_name: true,
                                country_id: true
                            }
                        },
                        purchasePrice: true,
                        currency: true,
                        purchaseDate: true,
                        expiryDate: true,
                        specifications: true,
                        tags: true,
                        status: true,
                        attachedTo: true,
                        imageUrl: true,
                        barcode: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    orderBy: findOptions.orderBy || { createdAt: 'desc' }
                });
                const equipments = yield prisma.equipment.findMany({
                    where: Object.assign({ supplierOrganizationId: organizationId }, (findOptions.where || {})),
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        model: true,
                        serialNumber: true,
                        manufacturer: true,
                        purchaseDate: true,
                        purchasePrice: true,
                        currency: true,
                        warrantyExpirationDate: true,
                        status: true,
                        condition: true,
                        description: true,
                        specifications: true,
                        category: true,
                        tags: true,
                        lastMaintenance: true,
                        nextMaintenance: true,
                        code: true,
                        imageUrl: true,
                        notes: true,
                        barcode: true,
                        qrCode: true,
                        createdAt: true,
                        updatedAt: true,
                        location: {
                            select: {
                                id: true,
                                name: true,
                                latitude: true,
                                longitude: true,
                                address: true,
                                city: true,
                                region: true,
                                country: true,
                                description: true
                            }
                        },
                        supplierOrganization: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                sector: true,
                                zone_territoriale: true,
                                contacts: true,
                                logo: true,
                                status: true,
                                address: true,
                                legal_name: true,
                                country_id: true
                            }
                        },
                        // TOUJOURS inclure l'historique de maintenance
                        maintenanceHistory: {
                            select: {
                                id: true,
                                maintenanceType: true,
                                date: true,
                                description: true,
                                cost: true,
                                currency: true,
                                status: true,
                                notes: true,
                                scheduledDate: true,
                                completedDate: true,
                                createdAt: true,
                                updatedAt: true,
                                technician: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                },
                                createdBy: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                },
                                parts: {
                                    select: {
                                        id: true,
                                        name: true,
                                        SKU: true,
                                        category: true,
                                        quantity: true,
                                        unit: true
                                    }
                                },
                                documents: {
                                    select: {
                                        id: true,
                                        fileType: true,
                                        fileSize: true,
                                    }
                                }
                            },
                            orderBy: { date: 'desc' }
                        }
                    },
                    orderBy: findOptions.orderBy || { createdAt: 'desc' }
                });
                const totalMaintenanceRecords = equipments.reduce((total, equipment) => {
                    var _a;
                    return total + (((_a = equipment.maintenanceHistory) === null || _a === void 0 ? void 0 : _a.length) || 0);
                }, 0);
                console.log(`✅ ${inventoryItems.length} items d'inventaire et ${equipments.length} équipements récupérés`);
                console.log(`📋 ${totalMaintenanceRecords} enregistrements de maintenance inclus`);
                return {
                    data: {
                        inventoryItems,
                        equipments
                    },
                    message: `Liste des items d'inventaire et équipements pour l'organisation récupérée avec succès`,
                    count: {
                        inventoryItems: inventoryItems.length,
                        equipments: equipments.length,
                        maintenanceRecords: totalMaintenanceRecords
                    }
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getInventoryByOrganization:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération des données pour l'organisation: ${error.message}`);
            }
        });
    }
    static getItemDetails(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!itemId) {
                    throw new customErrors_1.ValidationError("L'identifiant de l'item est requis.");
                }
                const item = yield prisma.inventoryItem.findUnique({
                    where: { id: itemId },
                    select: {
                        id: true,
                        name: true,
                        SKU: true,
                        category: true,
                        description: true,
                        quantity: true,
                        unit: true,
                        minimumStock: true,
                        purchasePrice: true,
                        currency: true,
                        purchaseDate: true,
                        expiryDate: true,
                        specifications: true,
                        tags: true,
                        status: true,
                        attachedTo: true,
                        imageUrl: true,
                        barcode: true,
                        createdAt: true,
                        updatedAt: true,
                        location: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        supplier: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        organizationSupplier: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        transactions: {
                            select: {
                                id: true,
                                transactionType: true,
                                quantity: true,
                                date: true,
                                reason: true,
                                project: true,
                                task: true,
                                notes: true,
                                fromLocation: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                toLocation: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                documents: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!item) {
                    throw new customErrors_1.ValidationError("Item d'inventaire introuvable.");
                }
                return {
                    data: item,
                    message: "Détails de l'item récupérés avec succès",
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getItemDetails:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération de l'item: ${error.message}`);
            }
        });
    }
    /**
     * Récupère les maintenance records pour tous les équipements d'une organisation
     */
    static getMaintenanceRecordsByOrganization(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log(`🔧 getMaintenanceRecordsByOrganization appelé pour l'organisation ${organizationId}`);
                const findOptions = (_a = options === null || options === void 0 ? void 0 : options.findOptions) !== null && _a !== void 0 ? _a : {};
                const maintenanceRecords = yield prisma.maintenanceRecord.findMany({
                    where: Object.assign({ equipment: {
                            supplierOrganizationId: organizationId
                        } }, (findOptions.where || {})),
                    select: {
                        id: true,
                        maintenanceType: true,
                        date: true,
                        description: true,
                        cost: true,
                        currency: true,
                        status: true,
                        notes: true,
                        scheduledDate: true,
                        completedDate: true,
                        createdAt: true,
                        updatedAt: true,
                        equipment: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                model: true,
                                serialNumber: true,
                                manufacturer: true,
                                status: true,
                                condition: true,
                                location: {
                                    select: {
                                        id: true,
                                        name: true,
                                        address: true,
                                        city: true,
                                        country: true
                                    }
                                }
                            }
                        },
                        technician: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        parts: {
                            select: {
                                id: true,
                                name: true,
                                SKU: true,
                                category: true,
                                quantity: true,
                                unit: true,
                                status: true,
                                organizationSupplier: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        },
                        documents: {
                            select: {
                                id: true,
                                fileSize: true,
                            }
                        }
                    },
                    orderBy: findOptions.orderBy || { date: 'desc' }
                });
                console.log(`✅ ${maintenanceRecords.length} maintenance records récupérés pour l'organisation ${organizationId}`);
                return {
                    data: maintenanceRecords,
                    message: 'Maintenance records pour l\'organisation récupérés avec succès',
                    count: maintenanceRecords.length
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getMaintenanceRecordsByOrganization:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération des maintenance records: ${error.message}`);
            }
        });
    }
    /**
     * Récupère les statistiques de maintenance pour une organisation
     */
    static getMaintenanceStatsByOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`📊 getMaintenanceStatsByOrganization appelé pour l'organisation ${organizationId}`);
                const [totalMaintenanceRecords, completedMaintenance, pendingMaintenance, scheduledMaintenance, totalMaintenanceCost] = yield Promise.all([
                    // Total des maintenance records
                    prisma.maintenanceRecord.count({
                        where: {
                            equipment: {
                                supplierOrganizationId: organizationId
                            }
                        }
                    }),
                    // Maintenance terminée
                    prisma.maintenanceRecord.count({
                        where: {
                            equipment: {
                                supplierOrganizationId: organizationId
                            },
                            status: 'COMPLETED'
                        }
                    }),
                    // Maintenance en attente
                    prisma.maintenanceRecord.count({
                        where: {
                            equipment: {
                                supplierOrganizationId: organizationId
                            },
                            status: 'COMPLETED'
                        }
                    }),
                    // Maintenance programmée
                    prisma.maintenanceRecord.count({
                        where: {
                            equipment: {
                                supplierOrganizationId: organizationId
                            },
                            status: 'SCHEDULED'
                        }
                    }),
                    // Coût total de maintenance
                    prisma.maintenanceRecord.aggregate({
                        where: {
                            equipment: {
                                supplierOrganizationId: organizationId
                            }
                        },
                        _sum: {
                            cost: true
                        }
                    })
                ]);
                const stats = {
                    totalMaintenanceRecords,
                    completedMaintenance,
                    pendingMaintenance,
                    scheduledMaintenance,
                    inProgressMaintenance: totalMaintenanceRecords - completedMaintenance - pendingMaintenance - scheduledMaintenance,
                    totalMaintenanceCost: totalMaintenanceCost._sum.cost || 0
                };
                console.log(`✅ Statistiques de maintenance calculées pour l'organisation ${organizationId}:`, stats);
                return {
                    data: stats,
                    message: 'Statistiques de maintenance récupérées avec succès'
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getMaintenanceStatsByOrganization:', error);
                throw new customErrors_1.DatabaseError(`Échec du calcul des statistiques de maintenance: ${error.message}`);
            }
        });
    }
    /**
     * Récupère les statistiques d'inventaire pour une organisation
     */
    static getInventoryStatsByOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`📊 getInventoryStatsByOrganization appelé pour l'organisation ${organizationId}`);
                const [totalItems, activeItems, lowStockItems, outOfStockItems, totalValue] = yield Promise.all([
                    // Total des items
                    prisma.inventoryItem.count({
                        where: { organizationSupplierId: organizationId }
                    }),
                    // Items actifs
                    prisma.inventoryItem.count({
                        where: {
                            organizationSupplierId: organizationId,
                            status: 'IN_STOCK'
                        }
                    }),
                    // Items en stock faible (approximation - à ajuster selon ta logique)
                    prisma.inventoryItem.count({
                        where: {
                            organizationSupplierId: organizationId,
                            quantity: {
                                lte: 10 // Tu peux ajuster cette valeur ou utiliser minimumStock
                            }
                        }
                    }),
                    // Items en rupture de stock
                    prisma.inventoryItem.count({
                        where: {
                            organizationSupplierId: organizationId,
                            quantity: 0
                        }
                    }),
                    // Valeur totale de l'inventaire
                    prisma.inventoryItem.aggregate({
                        where: { organizationSupplierId: organizationId },
                        _sum: {
                            purchasePrice: true
                        }
                    })
                ]);
                const stats = {
                    totalItems,
                    activeItems,
                    inactiveItems: totalItems - activeItems,
                    lowStockItems,
                    outOfStockItems,
                    totalValue: totalValue._sum.purchasePrice || 0
                };
                console.log(`✅ Statistiques calculées pour l'organisation ${organizationId}:`, stats);
                return {
                    data: stats,
                    message: 'Statistiques d\'inventaire récupérées avec succès'
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getInventoryStatsByOrganization:', error);
                throw new customErrors_1.DatabaseError(`Échec du calcul des statistiques d'inventaire: ${error.message}`);
            }
        });
    }
    /**
     * Récupère les transactions d'inventaire pour une organisation
     */
    static getInventoryTransactionsByOrganization(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log(`🔄 getInventoryTransactionsByOrganization appelé pour l'organisation ${organizationId}`);
                const findOptions = (_a = options === null || options === void 0 ? void 0 : options.findOptions) !== null && _a !== void 0 ? _a : {};
                const transactions = yield prisma.inventoryTransaction.findMany({
                    where: Object.assign({ item: {
                            organizationSupplierId: organizationId
                        } }, (findOptions.where || {})),
                    select: {
                        id: true,
                        transactionType: true,
                        quantity: true,
                        date: true,
                        reason: true,
                        notes: true,
                        item: {
                            select: {
                                id: true,
                                name: true,
                                SKU: true,
                                category: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        fromLocation: {
                            select: {
                                id: true,
                                latitude: true,
                                longitude: true,
                                name: true,
                                address: true,
                                city: true,
                                region: true,
                                country: true,
                                description: true
                            }
                        },
                        toLocation: {
                            select: {
                                id: true,
                                latitude: true,
                                longitude: true,
                                name: true,
                                address: true,
                                city: true,
                                region: true,
                                country: true,
                                description: true
                            }
                        },
                        createdAt: true,
                    },
                    orderBy: findOptions.orderBy || { createdAt: 'desc' }
                });
                console.log(`✅ ${transactions.length} transactions récupérées pour l'organisation ${organizationId}`);
                return {
                    data: transactions,
                    message: 'Transactions d\'inventaire pour l\'organisation récupérées avec succès',
                    count: transactions.length
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getInventoryTransactionsByOrganization:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération des transactions d'inventaire: ${error.message}`);
            }
        });
    }
    static getEquipmentWithDetails(equipmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield prisma.equipment.findUnique({
                    where: { id: equipmentId },
                    include: {
                        location: true,
                        assignedTo: true,
                        supplierOrganization: true,
                        documents: true,
                        maintenanceHistory: {
                            include: {
                                technician: true,
                                createdBy: true,
                                documents: true,
                                parts: true,
                            },
                        },
                    },
                });
                if (!item) {
                    throw new Error('Équipement non trouvé');
                }
                return item;
            }
            catch (error) {
                console.error('Erreur lors de la récupération de l’équipement :', error);
                throw error;
            }
        });
    }
}
exports.default = InventaireService;
