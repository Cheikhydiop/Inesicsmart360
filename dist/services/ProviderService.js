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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const customErrors_1 = require("../errors/customErrors");
const paginate_helpers_1 = require("../utils/paginate.helpers");
const prisma = new prisma_1.PrismaClient();
class ProviderService {
    /**
     * Récupère tous les fournisseurs avec pagination et filtres optionnels
     */
    static getAllProviders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                console.log('🚀 getAllProviders appelé avec options:', JSON.stringify(options, null, 2));
                const page = (_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1;
                const limit = (_b = options === null || options === void 0 ? void 0 : options.limit) !== null && _b !== void 0 ? _b : 10;
                const cursor = options === null || options === void 0 ? void 0 : options.cursor;
                const findOptions = (_c = options === null || options === void 0 ? void 0 : options.findOptions) !== null && _c !== void 0 ? _c : {};
                // Construction dynamique de la requête
                const result = yield (0, paginate_helpers_1.paginateOrFindAll)(prisma, 'provider', {
                    page,
                    limit,
                    cursor,
                    findOptions: Object.assign({ select: {
                            // Champs de base
                            id: true,
                            name: true,
                            companyType: true,
                            registrationNumber: true,
                            taxId: true,
                            foundedDate: true,
                            contactPerson: true,
                            email: true,
                            phoneNumber: true,
                            website: true,
                            specializations: true,
                            services: true,
                            description: true,
                            logo: true,
                            rating: true,
                            status: true,
                            paymentTerms: true,
                            createdAt: true,
                            updatedAt: true,
                            // Adresse intégrée
                            street: true,
                            city: true,
                            postalCode: true,
                            country: true,
                            // Informations bancaires intégrées
                            bankName: true,
                            accountNumber: true,
                            accountName: true,
                            swiftCode: true,
                            iban: true,
                        } }, findOptions),
                });
                console.log(`✅ ${result.data.length} providers récupérés`);
                return Object.assign(Object.assign({}, result), { message: result.paginated
                        ? 'Providers paginés récupérés avec succès'
                        : 'Liste complète des providers récupérée avec succès' });
            }
            catch (error) {
                console.error('❌ Erreur dans getAllProviders:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération des fournisseurs: ${error.message}`);
            }
        });
    }
    static getProviderDetails(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!providerId) {
                    throw new customErrors_1.ValidationError("L'identifiant du fournisseur est requis.");
                }
                const provider = yield prisma.provider.findUnique({
                    where: { id: providerId },
                    select: {
                        id: true,
                        name: true,
                        companyType: true,
                        registrationNumber: true,
                        taxId: true,
                        foundedDate: true,
                        contactPerson: true,
                        email: true,
                        phoneNumber: true,
                        website: true,
                        specializations: true,
                        services: true,
                        description: true,
                        logo: true,
                        rating: true,
                        status: true,
                        paymentTerms: true,
                        createdAt: true,
                        updatedAt: true,
                        street: true,
                        city: true,
                        postalCode: true,
                        country: true,
                        bankName: true,
                        accountNumber: true,
                        accountName: true,
                        swiftCode: true,
                        iban: true,
                        documents: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                fileUrl: true,
                                fileType: true,
                                fileSize: true,
                                category: true,
                                tags: true,
                                version: true,
                                status: true,
                                uploadedAt: true,
                                updatedAt: true,
                                uploadedBy: {
                                    select: { id: true, email: true },
                                },
                            },
                        },
                        evaluations: {
                            select: {
                                id: true,
                                date: true,
                                overallRating: true,
                                comments: true,
                                recommendations: true,
                                evaluator: {
                                    select: { id: true, email: true },
                                },
                                project: {
                                    select: { id: true, name: true },
                                },
                                criteria: {
                                    select: {
                                        id: true,
                                        name: true,
                                        description: true,
                                        rating: true,
                                        weight: true,
                                        comments: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!provider) {
                    throw new customErrors_1.ValidationError("Fournisseur introuvable.");
                }
                return {
                    data: provider,
                    message: "Détails du fournisseur récupérés avec succès",
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getProviderDetails:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération du fournisseur: ${error.message}`);
            }
        });
    }
    static getProvidersByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new customErrors_1.ValidationError("L'identifiant de l'utilisateur est requis.");
                }
                // 1. Récupérer l'utilisateur pour connaître son organisation
                const user = yield prisma.user.findUnique({
                    where: { id: userId },
                    select: { organizationId: true },
                });
                if (!(user === null || user === void 0 ? void 0 : user.organizationId)) {
                    throw new Error("Organisation introuvable pour cet utilisateur.");
                }
                // 2. Récupérer tous les fournisseurs de l'organisation de l'utilisateur
                const providers = yield prisma.provider.findMany({
                    where: {
                        organizationId: user.organizationId,
                    },
                    select: {
                        id: true,
                        name: true,
                        companyType: true,
                        registrationNumber: true,
                        taxId: true,
                        foundedDate: true,
                        contactPerson: true,
                        email: true,
                        phoneNumber: true,
                        website: true,
                        specializations: true,
                        services: true,
                        description: true,
                        logo: true,
                        rating: true,
                        status: true,
                        paymentTerms: true,
                        createdAt: true,
                        updatedAt: true,
                        // Adresse intégrée
                        street: true,
                        city: true,
                        postalCode: true,
                        country: true,
                        // Informations bancaires intégrées
                        bankName: true,
                        accountNumber: true,
                        accountName: true,
                        swiftCode: true,
                        iban: true,
                    },
                });
                return {
                    success: true,
                    data: providers,
                    message: `Fournisseurs de l'organisation de l'utilisateur ${userId} récupérés avec succès.`,
                };
            }
            catch (error) {
                console.error('❌ Erreur dans getProvidersByUser:', error);
                throw new customErrors_1.DatabaseError(`Échec de la récupération des fournisseurs: ${error.message}`);
            }
        });
    }
}
exports.default = ProviderService;
