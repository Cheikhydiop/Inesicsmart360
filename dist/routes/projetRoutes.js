"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/projets.routes.ts
const express_1 = __importDefault(require("express"));
const ProjetController_1 = __importDefault(require("../controllers/ProjetController"));
const router = express_1.default.Router();
// router.get('/', ProjetController.getProjets);
router.get('/:id', ProjetController_1.default.getProjetById);
router.get('/user/:userId', ProjetController_1.default.getProjetsByUser); // Projets d'un utilisateur
exports.default = router;
