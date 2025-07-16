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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const DashboardService_1 = __importDefault(require("../services/DashboardService"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const prisma = new prisma_1.PrismaClient();
class DashboardController {
    /**
     * Fonction utilitaire pour extraire les filtres de projet
     */
    static extractProjectFilters(query) {
        const { status, name, page = 1, pageSize = 10 } = query, otherFilters = __rest(query, ["status", "name", "page", "pageSize"]);
        return Object.assign({ status,
            name, page: parseInt(page) || 1, pageSize: parseInt(pageSize) || 10 }, otherFilters);
    }
}
_a = DashboardController;
/**
 * Récupère toutes les données du dashboard
 */
DashboardController.getDashboardData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.params.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "L'identifiant de l'utilisateur est requis",
            error: 'MISSING_USER_ID'
        });
    }
    const dashboardData = yield DashboardService_1.default.getDashboardData(userId);
    return res.status(200).json({
        success: true,
        data: dashboardData
    });
}));
/**
 * Récupère les projets d'un utilisateur avec filtres
 */
DashboardController.getProjectsByUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.params.userId;
    const filters = _a.extractProjectFilters(req.query);
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "L'identifiant de l'utilisateur est requis",
            error: 'MISSING_USER_ID'
        });
    }
    const result = yield DashboardService_1.default.getProjectsByUser(userId, filters);
    return res.status(200).json(Object.assign({ success: true }, result));
}));
/**
 * Récupère les utilisateurs de la même organisation
 */
DashboardController.getUsersBySameOrganization = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "L'identifiant de l'utilisateur est requis",
            error: 'MISSING_USER_ID'
        });
    }
    const options = { page, limit };
    const result = yield DashboardService_1.default.getUsersBySameOrganizationId(userId, options);
    return res.status(200).json({
        success: true,
        data: result
    });
}));
/**
 * Récupère les tâches d'un utilisateur
 */
DashboardController.getTasksByUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || req.params.userId;
    const organizationId = req.query.organizationId;
    const filters = {
        status: req.query.status,
        priority: req.query.priority
    };
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "L'identifiant de l'utilisateur est requis",
            error: 'MISSING_USER_ID'
        });
    }
    if (!organizationId) {
        return res.status(400).json({
            success: false,
            message: "L'identifiant de l'organisation est requis",
            error: 'MISSING_ORGANIZATION_ID'
        });
    }
    const tasks = yield DashboardService_1.default.getTasksByUser(userId, organizationId, filters);
    return res.status(200).json({
        success: true,
        data: tasks,
        message: 'Tâches récupérées avec succès'
    });
}));
/**
 * Récupère les demandes récentes
 */
DashboardController.getRecentRequests = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const organizationId = (_b = req.params.organizationId) === null || _b === void 0 ? void 0 : _b.trim();
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status;
    const last7Days = req.query.last7Days === 'true';
    if (!organizationId) {
        return res.status(400).json({
            success: false,
            message: "L'identifiant de l'organisation est requis",
            error: 'MISSING_ORGANIZATION_ID'
        });
    }
    const requests = yield DashboardService_1.default.getRecentRequests(organizationId, limit, status, last7Days);
    return res.status(200).json({
        success: true,
        data: requests,
        message: 'Demandes récentes récupérées avec succès'
    });
}));
exports.default = DashboardController;
