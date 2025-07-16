"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InventaireController_1 = __importDefault(require("../controllers/InventaireController"));
const router = express_1.default.Router();
router.get('/organization/:organizationId/inventory', InventaireController_1.default.getInventoryByOrganization);
router.get('/organization/:organizationId/inventory/stats', InventaireController_1.default.getInventoryStatsByOrganization);
router.get('/organization/:organizationId/inventory/transactions', InventaireController_1.default.getInventoryTransactionsByOrganization);
router.get('/:itemId/details', InventaireController_1.default.getItemDetails);
router.get('/:equipmentId/details/equipement', InventaireController_1.default.getEquipmentWithDetails);
exports.default = router;
