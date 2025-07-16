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
const UserService_1 = __importDefault(require("../services/UserService"));
const customErrors_1 = require("../errors/customErrors");
const asyncHandler_1 = require("../middlewares/asyncHandler");
class UserController {
}
_a = UserController;
/**
 * Inscription d'un nouvel utilisateur
 * POST /api/users/register
 */
UserController.register = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const result = yield UserService_1.default.register(userData);
    res.status(201).json({
        success: true,
        message: result.message,
        data: {
            user: result.user,
            token: result.token,
        }
    });
}));
/**
 * Connexion d'un utilisateur
 * POST /api/users/login
 */
UserController.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginData = req.body;
        const result = yield UserService_1.default.login(loginData);
        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                user: result.user,
                token: result.token
            }
        });
    }
    catch (error) {
        if (error instanceof customErrors_1.ValidationError) {
            return res.status(401).json({
                success: false,
                message: error.message,
                error: 'AUTHENTICATION_ERROR'
            });
        }
        if (error instanceof customErrors_1.DatabaseError) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: 'DATABASE_ERROR'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
}));
UserController.getAllUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _b = req.query, { page, pageSize, name, email, role, status, search } = _b, restQuery = __rest(_b, ["page", "pageSize", "name", "email", "role", "status", "search"]);
        console.log('Paramètres extraits:', { page, pageSize, name, email, role, status, search, restQuery });
        let whereClause = {};
        // Recherche globale (search dans name OU email)
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        else {
            // Recherche spécifique par champ
            if (name) {
                whereClause.name = { contains: name, mode: 'insensitive' };
            }
            if (email) {
                whereClause.email = { contains: email, mode: 'insensitive' };
            }
        }
        // Filtres exacts
        if (role) {
            whereClause.role = role;
        }
        if (status) {
            whereClause.status = status;
        }
        // Ajout des autres filtres du restQuery si nécessaire
        Object.keys(restQuery).forEach(key => {
            if (restQuery[key] && !['page', 'pageSize', 'name', 'email', 'role', 'status', 'search'].includes(key)) {
                whereClause[key] = restQuery[key];
            }
        });
        // Options normalisées
        const options = {
            page: page ? Math.max(1, parseInt(page, 10)) : 1,
            limit: pageSize ? Math.max(1, Math.min(100, parseInt(pageSize, 10))) : 10, // Limite max de 100
            findOptions: {
                where: whereClause,
                orderBy: {
                    createdAt: 'desc',
                }
            },
        };
        console.log('Options de requête:', JSON.stringify(options, null, 2));
        const result = yield UserService_1.default.getAllUsers(options);
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error('Erreur dans getAllUsers:', error);
        if (error instanceof customErrors_1.DatabaseError) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: 'DATABASE_ERROR',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: 'INTERNAL_SERVER_ERROR',
        });
    }
}));
/**
 * Récupère tous les utilisateurs appartenant à la même organisation (même name) que l'utilisateur donné
 * GET /api/users/same-organization/:id
 */
/**
 * Récupère tous les utilisateurs ayant le même organizationId qu'un utilisateur donné
 * GET /api/users/same-organization/:id
 */
UserController.getUsersBySameOrganisation = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupère l'ID utilisateur depuis les paramètres, sinon utilise un ID par défaut
        const userId = req.params.id;
        const result = yield UserService_1.default.getUsersBySameOrganizationId(userId);
        res.status(200).json(Object.assign({}, result));
    }
    catch (error) {
        console.error('Erreur dans getUsersBySameOrganisation:', error);
        if (error instanceof customErrors_1.DatabaseError) {
            return res.status(500).json({
                success: false,
                message: error.message,
                error: 'DATABASE_ERROR',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            error: 'INTERNAL_SERVER_ERROR',
        });
    }
}));
exports.default = UserController;
