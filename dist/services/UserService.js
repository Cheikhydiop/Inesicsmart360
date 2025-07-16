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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidator_1 = __importDefault(require("../utils/validators/userValidator"));
const tokenUtils_1 = require("../utils/tokenUtils");
const customErrors_1 = require("../errors/customErrors");
const paginate_helpers_1 = require("../utils/paginate.helpers");
const prisma = new prisma_1.PrismaClient();
class UserService {
    /**
     * Inscription d'un nouvel utilisateur
     */
    static register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des données d'inscription
                const validatedData = userValidator_1.default.validateRegister(userData);
                // Vérifier si l'email est déjà utilisé
                const existingUser = yield prisma.user.findUnique({
                    where: { email: validatedData.email }
                });
                if (existingUser) {
                    throw new customErrors_1.ValidationError('Cet email est déjà utilisé');
                }
                // Hachage du mot de passe
                const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, 12);
                // Création de l'utilisateur dans la base de données
                const newUser = yield prisma.user.create({
                    data: {
                        name: validatedData.name,
                        email: validatedData.email,
                        password: hashedPassword,
                        role: validatedData.role,
                        organizationId: validatedData.organization || null, // ici organizationId, pas organization
                        phoneNumber: validatedData.phoneNumber || null,
                        jobTitle: validatedData.jobTitle || null,
                        department: validatedData.department || null,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                        organizationId: true, // Ajout de organizationId
                        organization: true, // récupération OK ici
                        phoneNumber: true,
                        jobTitle: true,
                        department: true,
                        createdAt: true,
                    }
                });
                // Génération du token d'authentification avec organizationId
                const token = (0, tokenUtils_1.generateToken)({
                    userId: newUser.id,
                    role: newUser.role,
                    organizationId: newUser.organizationId // Ajout de organizationId dans le token
                });
                return {
                    user: newUser,
                    token,
                    message: 'Utilisateur créé avec succès'
                };
            }
            catch (error) {
                if (error instanceof customErrors_1.ValidationError) {
                    throw error;
                }
                throw new customErrors_1.DatabaseError(`Échec de l'inscription: ${error.message}`);
            }
        });
    }
    /**
     * Connexion d'un utilisateur existant
     */
    static login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des données de connexion
                const validatedData = userValidator_1.default.validateLogin(loginData);
                // Recherche de l'utilisateur par email
                const user = yield prisma.user.findUnique({
                    where: { email: validatedData.email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: true,
                        role: true,
                        status: true,
                        organizationId: true, // Ajout de organizationId
                        organization: true,
                        phoneNumber: true,
                        jobTitle: true,
                        department: true,
                        avatar: true,
                        lastLogin: true,
                    }
                });
                if (!user) {
                    throw new customErrors_1.ValidationError('Utilisateur non trouvé');
                }
                // Vérification du statut de l'utilisateur
                if (user.status === 'SUSPENDED') {
                    throw new customErrors_1.ValidationError('Compte suspendu. Contactez l\'administrateur');
                }
                if (user.status === 'INACTIVE') {
                    throw new customErrors_1.ValidationError('Compte inactif. Contactez l\'administrateur');
                }
                // Vérification du mot de passe
                const isPasswordValid = yield bcrypt_1.default.compare(validatedData.password, user.password);
                if (!isPasswordValid) {
                    throw new customErrors_1.ValidationError('Identifiants invalides');
                }
                // Mise à jour de la dernière connexion
                yield prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastLogin: new Date(),
                    },
                });
                // Génération du token avec organizationId
                const token = (0, tokenUtils_1.generateToken)({
                    userId: user.id,
                    role: user.role,
                    organizationId: user.organizationId // Ajout de organizationId dans le token
                });
                // Suppression du mot de passe des données retournées
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                return {
                    user: userWithoutPassword,
                    token,
                    message: 'Connexion réussie'
                };
            }
            catch (error) {
                if (error instanceof customErrors_1.ValidationError) {
                    throw error;
                }
                throw new customErrors_1.DatabaseError(`Échec de la connexion: ${error.message}`);
            }
        });
    }
    static getAllUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Log pour débugger
                console.log('🚀 getAllUsers appelé avec options:', JSON.stringify(options, null, 2));
                // Validation et valeurs par défaut
                const page = (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1; // Utilise 1 si undefined/null
                const limit = (_b = options === null || options === void 0 ? void 0 : options.limit) !== null && _b !== void 0 ? _b : 10;
                console.log(`📄 Pagination: page=${page}, limit=${limit}`);
                const result = yield (0, paginate_helpers_1.paginateOrFindAll)(prisma, 'user', {
                    page,
                    limit,
                    cursor: options === null || options === void 0 ? void 0 : options.cursor,
                    findOptions: Object.assign({ select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            status: true,
                            avatar: true,
                            organization: true,
                            phoneNumber: true,
                            jobTitle: true,
                            department: true,
                            createdAt: true,
                            lastLogin: true,
                        } }, ((options === null || options === void 0 ? void 0 : options.findOptions) || {})),
                });
                console.log(`✅ Résultat: ${result.data.length} utilisateurs récupérés`);
                return Object.assign(Object.assign({}, result), { message: result.paginated
                        ? 'Utilisateurs paginés récupérés avec succès'
                        : 'Liste complète des utilisateurs récupérée avec succès' });
            }
            catch (error) {
                console.error('❌ Erreur dans getAllUsers:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération des utilisateurs: ${error.message}`);
            }
        });
    }
    /**
     * Récupérer les infos de l'utilisateur connecté
     */
    static getUsersBySameOrganizationId(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // 1. Récupérer l'utilisateur pour connaître son organisation
                const user = yield prisma.user.findUnique({
                    where: { id: userId },
                    select: { organizationId: true },
                });
                if (!(user === null || user === void 0 ? void 0 : user.organizationId)) {
                    throw new Error("Organisation introuvable pour cet utilisateur.");
                }
                const page = (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = options === null || options === void 0 ? void 0 : options.limit) !== null && _b !== void 0 ? _b : 10;
                // 2. Récupérer tous les utilisateurs de la même organisation
                const result = yield (0, paginate_helpers_1.paginateOrFindAll)(prisma, 'user', {
                    page,
                    limit,
                    cursor: options === null || options === void 0 ? void 0 : options.cursor,
                    findOptions: {
                        where: {
                            organizationId: user.organizationId,
                        },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            status: true,
                            avatar: true,
                            phoneNumber: true,
                            jobTitle: true,
                            department: true,
                            createdAt: true,
                            lastLogin: true,
                            organization: {
                                select: {
                                    id: true,
                                    name: true,
                                    type: true,
                                    status: true,
                                    billing_status: true,
                                    last_payment_date: true,
                                    subscription_end_date: true,
                                    parent_organization_id: true,
                                    timezone: true,
                                    default_language: true,
                                    created_at: true,
                                    updated_at: true,
                                    settings: true,
                                    country_id: true,
                                    address: true,
                                    legal_name: true,
                                    tax_number: true,
                                    industry_code: true,
                                }
                            }
                        },
                    },
                });
                // 3. Extraire l'organisation une seule fois (depuis le premier utilisateur)
                const users = result.data.map((u) => {
                    const { organization } = u, userWithoutOrg = __rest(u, ["organization"]);
                    return userWithoutOrg;
                });
                const organization = result.data.length > 0 ? result.data[0].organization : null;
                return {
                    success: true,
                    organization,
                    data: users,
                    total: result.total,
                    page: result.page,
                    perPage: result.perPage,
                    lastPage: result.lastPage,
                    from: result.from,
                    to: result.to,
                    hasNextPage: result.hasNextPage,
                    hasPreviousPage: result.hasPreviousPage,
                    paginated: true,
                    message: 'Utilisateurs de la même organisation récupérés avec succès'
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getUsersBySameOrganizationId:', error);
                throw new customErrors_1.DatabaseError(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
            }
        });
    }
}
exports.default = UserService;
