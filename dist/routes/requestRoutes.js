"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/requestRoutes.ts
const express_1 = __importDefault(require("express"));
const RequestController_1 = require("../controllers/RequestController");
const router = express_1.default.Router();
// Routes principales
router.get('/', RequestController_1.RequestController.getAllRequests);
router.get('/:id', RequestController_1.RequestController.getRequestById);
router.get('/organization/:id', RequestController_1.RequestController.getRequestsByUserOrganization);
exports.default = router;
