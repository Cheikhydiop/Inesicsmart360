"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/providerRoutes.ts
const express_1 = __importDefault(require("express"));
const ProviderController_1 = __importDefault(require("../controllers/ProviderController"));
const router = express_1.default.Router();
router.get('/providers', ProviderController_1.default.getAllProviders);
router.get('/providers/:id', ProviderController_1.default.getProviderDetails);
router.get('/providers/:userId/organizations', ProviderController_1.default.getProvidersByUser);
exports.default = router;
