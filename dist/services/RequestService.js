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
exports.RequestService = void 0;
const prisma_1 = require("../generated/prisma");
const customErrors_1 = require("../errors/customErrors");
const ImplRequestRepository_1 = require("../repositories/implementations/ImplRequestRepository");
class RequestService {
    constructor(prisma, requestRepository) {
        this.prisma = prisma || new prisma_1.PrismaClient();
        this.requestRepository = requestRepository || new ImplRequestRepository_1.ImplRequestRepository(this.prisma);
    }
    getAllRequests() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                return yield this.requestRepository.getAllRequests(filters);
            }
            catch (error) {
                if (error instanceof customErrors_1.ValidationError) {
                    throw error;
                }
                throw new customErrors_1.DatabaseError('Erreur lors de la récupération des demandes');
            }
        });
    }
    getRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || typeof id !== 'string') {
                    throw new customErrors_1.ValidationError('ID de la requête requis et doit être une chaîne de caractères');
                }
                return yield this.requestRepository.getRequestDetails(id);
            }
            catch (error) {
                if (error instanceof customErrors_1.ValidationError) {
                    throw error;
                }
                throw new customErrors_1.DatabaseError('Erreur lors de la récupération des détails de la requête');
            }
        });
    }
    getRequestsByUserOrganization(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, filters = {}) {
            try {
                const user = yield this.prisma.user.findUnique({
                    where: { id: userId },
                    select: { organizationId: true },
                });
                if (!(user === null || user === void 0 ? void 0 : user.organizationId)) {
                    throw new customErrors_1.ValidationError("L'utilisateur n'est rattaché à aucune organisation.");
                }
                return yield this.requestRepository.getRequestsByOrganizationId(user.organizationId, filters);
            }
            catch (error) {
                if (error instanceof customErrors_1.ValidationError)
                    throw error;
                throw new customErrors_1.DatabaseError("Erreur lors de la récupération des requêtes par organisation.");
            }
        });
    }
}
exports.RequestService = RequestService;
