"use strict";
// controllers/projets.controller.ts
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
const ProjetService_1 = __importDefault(require("../services/ProjetService"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
class ProjetController {
    // static async getProjets(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    //     const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    //     const projets = await ProjetService.getProjets({ page, limit });
    //     res.status(200).json(projets);
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    static getProjetById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield ProjetService_1.default.getProjectDetails(id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
_a = ProjetController;
ProjetController.getProjetsByUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "L'identifiant de l'utilisateur est requis."
            });
        }
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const status = req.query.status;
        const name = req.query.name;
        // Validation des paramètres numériques
        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: "Le paramètre 'page' doit être un nombre entier positif."
            });
        }
        if (isNaN(limit) || limit < 1 || limit > 50) {
            return res.status(400).json({
                success: false,
                message: "Le paramètre 'limit' doit être un nombre entre 1 et 50."
            });
        }
        const filters = { page, pageSize: limit, status, name };
        const projets = yield ProjetService_1.default.getProjectsByUser(userId, filters);
        res.status(200).json(Object.assign({ success: true }, projets));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = ProjetController;
