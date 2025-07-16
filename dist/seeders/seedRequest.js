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
const prisma_1 = require("../../src/generated/prisma");
const mockRequest_1 = require("./mockRequest");
const prisma = new prisma_1.PrismaClient();
function mapProviderType(type) {
    switch (type) {
        case 'ENTERPRISE': return prisma_1.$Enums.ProviderType.ENTERPRISE;
        case 'SMALL_BUSINESS': return prisma_1.$Enums.ProviderType.SMALL_BUSINESS;
        case 'FREELANCE': return prisma_1.$Enums.ProviderType.FREELANCE;
        case 'COOPERATIVE': return prisma_1.$Enums.ProviderType.COOPERATIVE;
        case 'NGO': return prisma_1.$Enums.ProviderType.NGO;
        case 'GOVERNMENT': return prisma_1.$Enums.ProviderType.GOVERNMENT;
        case 'OTHER': return prisma_1.$Enums.ProviderType.OTHER;
        default:
            throw new Error(`Invalid ProviderType: ${type}`);
    }
}
function mapProviderStatus(status) {
    switch (status) {
        case 'ACTIVE': return prisma_1.$Enums.ProviderStatus.ACTIVE;
        case 'INACTIVE': return prisma_1.$Enums.ProviderStatus.INACTIVE;
        case 'PENDING_VERIFICATION': return prisma_1.$Enums.ProviderStatus.PENDING_VERIFICATION;
        case 'SUSPENDED': return prisma_1.$Enums.ProviderStatus.SUSPENDED;
        case 'BLACKLISTED': return prisma_1.$Enums.ProviderStatus.BLACKLISTED;
        default:
            throw new Error(`Invalid ProviderStatus: ${status}`);
    }
}
function mapCertificationStatus(status) {
    switch (status) {
        case 'VALID': return prisma_1.$Enums.CertificationStatus.VALID;
        case 'EXPIRED': return prisma_1.$Enums.CertificationStatus.EXPIRED;
        case 'REVOKED': return prisma_1.$Enums.CertificationStatus.REVOKED;
        default:
            throw new Error(`Invalid CertificationStatus: ${status}`);
    }
}
function mapContractStatus(status) {
    switch (status) {
        case 'DRAFT': return prisma_1.$Enums.ContractStatus.DRAFT;
        case 'PENDING_SIGNATURE': return prisma_1.$Enums.ContractStatus.PENDING_SIGNATURE;
        case 'SIGNED': return prisma_1.$Enums.ContractStatus.SIGNED;
        case 'ACTIVE': return prisma_1.$Enums.ContractStatus.ACTIVE;
        case 'COMPLETED': return prisma_1.$Enums.ContractStatus.COMPLETED;
        case 'TERMINATED': return prisma_1.$Enums.ContractStatus.TERMINATED;
        case 'EXPIRED': return prisma_1.$Enums.ContractStatus.EXPIRED;
        case 'CANCELLED': return prisma_1.$Enums.ContractStatus.CANCELLED;
        default:
            throw new Error(`Invalid ContractStatus: ${status}`);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Purge existing data
        yield prisma.contract.deleteMany();
        yield prisma.provider.deleteMany();
        // Seed providers
        for (const p of mockRequest_1.providers) {
            yield prisma.provider.create({
                data: {
                    id: p.id,
                    name: p.name,
                    companyType: mapProviderType(p.companyType),
                    registrationNumber: p.registrationNumber,
                    taxId: p.taxId,
                    foundedDate: new Date(p.foundedDate),
                    contactPerson: p.contactPerson,
                    email: p.email,
                    phoneNumber: p.phoneNumber,
                    street: p.street,
                    city: p.city,
                    postalCode: p.postalCode,
                    country: p.country,
                    website: p.website,
                    specializations: p.specializations,
                    services: p.services,
                    description: p.description,
                    logo: p.logo,
                    rating: p.rating,
                    status: mapProviderStatus(p.status),
                    paymentTerms: p.paymentTerms,
                    bankName: p.bankName,
                    accountNumber: p.accountNumber,
                    accountName: p.accountName,
                    swiftCode: p.swiftCode,
                    iban: p.iban,
                    certifications: p.certifications.length
                        ? { create: p.certifications.map(cert => ({
                                id: cert.id,
                                name: cert.name,
                                issuingAuthority: cert.issuingAuthority,
                                issuedDate: new Date(cert.issuedDate),
                                expiryDate: new Date(cert.expiryDate),
                                status: mapCertificationStatus(cert.status),
                                verificationUrl: cert.verificationUrl,
                            })) }
                        : undefined,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt),
                },
            });
        }
        // Seed contracts
        for (const c of mockRequest_1.contracts) {
            yield prisma.contract.create({
                data: {
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    providerId: c.providerId,
                    projectId: (_a = c.projectId) !== null && _a !== void 0 ? _a : null,
                    startDate: new Date(c.startDate),
                    endDate: new Date(c.endDate),
                    value: c.value,
                    currency: c.currency,
                    paymentTerms: c.paymentTerms,
                    status: mapContractStatus(c.status),
                    signedAt: c.signedAt ? new Date(c.signedAt) : null,
                    createdAt: new Date(c.createdAt),
                    updatedAt: new Date(c.updatedAt),
                },
            });
        }
        console.log('✅ Seed terminé');
    });
}
main()
    .catch(e => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
