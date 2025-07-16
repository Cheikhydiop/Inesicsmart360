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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const InventaireService_1 = __importDefault(require("../services/InventaireService"));
const customErrors_1 = require("../errors/customErrors");
const asyncHandler_1 = require("../middlewares/asyncHandler");
class InventaireController {
}
_a = InventaireController;
// static async getInventoryItems(req: Request, res: Response) {
//   try {
//     const { where, orderBy } = req.query;
//     const parsedWhere = where ? JSON.parse(where as string) : undefined;
//     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
//     const result = await InventaireService.getInventoryItems({
//       findOptions: {
//         where: parsedWhere,
//         orderBy: parsedOrderBy,
//       },
//     });
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error('❌ Error in getInventoryItems:', error);
//     res.status(500).json({ error: error.message });
//   }
// }
// static async getInventoryTransactions(req: Request, res: Response) {
//   try {
//     const { where, orderBy } = req.query;
//     const parsedWhere = where ? JSON.parse(where as string) : undefined;
//     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
//     const result = await InventaireService.getInventoryTransactions({
//       findOptions: {
//         where: parsedWhere,
//         orderBy: parsedOrderBy,
//       },
//     });
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error('❌ Error in getInventoryTransactions:', error);
//     res.status(500).json({ error: error.message });
//   }
// }
// static async getMaintenanceRecords(req: Request, res: Response) {
//   try {
//     const { where, orderBy } = req.query;
//     const parsedWhere = where ? JSON.parse(where as string) : undefined;
//     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
//     const result = await InventaireService.getMaintenanceRecords({
//       findOptions: {
//         where: parsedWhere,
//         orderBy: parsedOrderBy,
//       },
//     });
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error('❌ Error in getMaintenanceRecords:', error);
//     res.status(500).json({ error: error.message });
//   }
// }
// static async getLocations(req: Request, res: Response) {
//   try {
//     const { where, orderBy } = req.query;
//     const parsedWhere = where ? JSON.parse(where as string) : undefined;
//     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
//     const result = await InventaireService.getLocations({
//       findOptions: {
//         where: parsedWhere,
//         orderBy: parsedOrderBy,
//       },
//     });
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error('❌ Error in getLocations:', error);
//     res.status(500).json({ error: error.message });
//   }
// }
// static async getEquipements(req: Request, res: Response) {
//   try {
//     const { where, orderBy } = req.query;
//     const parsedWhere = where ? JSON.parse(where as string) : undefined;
//     const parsedOrderBy = orderBy ? JSON.parse(orderBy as string) : undefined;
//     const result = await InventaireService.getEquipements({
//       findOptions: {
//         where: parsedWhere,
//         orderBy: parsedOrderBy,
//       },
//     });
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error('❌ Error in getEquipements:', error); // Corrigé : était "getLocations"
//     res.status(500).json({ error: error.message });
//   }
// }
// Nouvelles méthodes pour les inventaires par organisation
InventaireController.getInventoryByOrganization = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.params;
        const { where, orderBy } = req.query;
        if (!organizationId) {
            return res.status(400).json({
                error: 'L\'ID de l\'organisation est requis'
            });
        }
        const parsedWhere = where ? JSON.parse(where) : undefined;
        const parsedOrderBy = orderBy ? JSON.parse(orderBy) : undefined;
        const result = yield InventaireService_1.default.getInventoryByOrganization(organizationId, {
            findOptions: {
                where: parsedWhere,
                orderBy: parsedOrderBy,
            },
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error('❌ Error in getInventoryByOrganization:', error);
        res.status(500).json({ error: error.message });
    }
}));
InventaireController.getInventoryStatsByOrganization = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.params;
        if (!organizationId) {
            return res.status(400).json({
                error: 'L\'ID de l\'organisation est requis'
            });
        }
        const result = yield InventaireService_1.default.getInventoryStatsByOrganization(organizationId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('❌ Error in getInventoryStatsByOrganization:', error);
        res.status(500).json({ error: error.message });
    }
}));
InventaireController.getInventoryTransactionsByOrganization = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId } = req.params;
        const { where, orderBy } = req.query;
        if (!organizationId) {
            return res.status(400).json({
                error: 'L\'ID de l\'organisation est requis'
            });
        }
        const parsedWhere = where ? JSON.parse(where) : undefined;
        const parsedOrderBy = orderBy ? JSON.parse(orderBy) : undefined;
        const result = yield InventaireService_1.default.getInventoryTransactionsByOrganization(organizationId, {
            findOptions: {
                where: parsedWhere,
                orderBy: parsedOrderBy,
            },
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error('❌ Error in getInventoryTransactionsByOrganization:', error);
        res.status(500).json({ error: error.message });
    }
}));
InventaireController.getItemDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.itemId;
    try {
        const result = yield InventaireService_1.default.getItemDetails(itemId);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    }
    catch (error) {
        console.error('❌ Erreur dans InventoryController.getItemDetails:', error);
        if (error instanceof customErrors_1.ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        if (error instanceof customErrors_1.DatabaseError) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        // Catch-all fallback
        return res.status(500).json({
            success: false,
            message: "Une erreur inattendue est survenue.",
        });
    }
}));
InventaireController.getEquipmentWithDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const equipmentId = req.params.equipmentId;
    try {
        const equipment = yield InventaireService_1.default.getEquipmentWithDetails(equipmentId);
        return res.status(200).json({
            success: true,
            message: 'Équipement récupéré avec succès',
            data: equipment,
        });
    }
    catch (error) {
        console.error('❌ Erreur dans InventoryController.getEquipmentWithDetails:', error);
        if (error instanceof customErrors_1.ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        if (error instanceof customErrors_1.DatabaseError) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Une erreur inattendue est survenue.",
        });
    }
}));
exports.default = InventaireController;
