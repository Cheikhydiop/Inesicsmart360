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
const ProviderService_1 = __importDefault(require("../services/ProviderService"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const customErrors_1 = require("../errors/customErrors");
class ProviderController {
}
_a = ProviderController;
/**
 * Récupération paginée des providers
 * GET /api/providers
 */
ProviderController.getAllProviders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _b = req.query, { page, pageSize, name, email, phone, status, country, search } = _b, restQuery = __rest(_b, ["page", "pageSize", "name", "email", "phone", "status", "country", "search"]);
        console.log('Query params reçus:', { page, pageSize, name, email, phone, status, country, search });
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } },
            ];
        }
        else {
            if (name)
                whereClause.name = { contains: name, mode: 'insensitive' };
            if (email)
                whereClause.email = { contains: email, mode: 'insensitive' };
            if (phone)
                whereClause.phone = { contains: phone, mode: 'insensitive' };
            if (country)
                whereClause.country = { contains: country, mode: 'insensitive' };
        }
        if (status)
            whereClause.status = status;
        // Ajout dynamique des autres filtres éventuels
        Object.keys(restQuery).forEach(key => {
            if (restQuery[key] &&
                !['page', 'pageSize', 'name', 'email', 'phone', 'status', 'country', 'search'].includes(key)) {
                whereClause[key] = restQuery[key];
            }
        });
        const options = {
            page: page ? Math.max(1, parseInt(page, 10)) : 1,
            limit: pageSize ? Math.max(1, Math.min(100, parseInt(pageSize, 10))) : 10,
            findOptions: {
                where: whereClause,
                orderBy: {
                    createdAt: 'desc',
                },
            },
        };
        console.log('Options préparées pour ProviderService:', JSON.stringify(options, null, 2));
        const result = yield ProviderService_1.default.getAllProviders(options);
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error('Erreur dans getAllProviders:', error);
        if (error instanceof customErrors_1.ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'VALIDATION_ERROR',
            });
        }
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
* Récupération des détails d’un fournisseur
* GET /api/providers/:id
*/
ProviderController.getProviderDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const providerId = req.params.id;
        if (!providerId) {
            throw new customErrors_1.ValidationError("L'identifiant du fournisseur est requis.");
        }
        const result = yield ProviderService_1.default.getProviderDetails(providerId);
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error('Erreur dans getProviderDetails:', error);
        if (error instanceof customErrors_1.ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'VALIDATION_ERROR',
            });
        }
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
* Récupération des fournisseurs d'une organisation
* GET /api/organizations/:organizationId/providers
*/
ProviderController.getProvidersByUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log('✅ Appel à getProvidersByUser avec:', userId);
        if (!userId) {
            throw new customErrors_1.ValidationError("L'identifiant de l'utilisateur est requis.");
        }
        // Appel de la méthode du service avec le userId
        const result = yield ProviderService_1.default.getProvidersByUser(userId);
        res.status(200).json(Object.assign({}, result));
    }
    catch (error) {
        console.error('❌ Erreur dans getProvidersByUser:', error);
        if (error instanceof customErrors_1.ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'VALIDATION_ERROR',
            });
        }
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
exports.default = ProviderController;
