// import { PrismaClient, $Enums } from '../../src/generated/prisma';
// import { providers, contracts } from './mockRequest';

// const prisma = new PrismaClient();

// function mapProviderType(type: string): $Enums.ProviderType {
//   switch (type) {
//     case 'ENTERPRISE':      return $Enums.ProviderType.ENTERPRISE;
//     case 'SMALL_BUSINESS':  return $Enums.ProviderType.SMALL_BUSINESS;
//     case 'FREELANCE':       return $Enums.ProviderType.FREELANCE;
//     case 'COOPERATIVE':     return $Enums.ProviderType.COOPERATIVE;
//     case 'NGO':             return $Enums.ProviderType.NGO;
//     case 'GOVERNMENT':      return $Enums.ProviderType.GOVERNMENT;
//     case 'OTHER':           return $Enums.ProviderType.OTHER;
//     default:
//       throw new Error(`Invalid ProviderType: ${type}`);
//   }
// }

// function mapProviderStatus(status: string): $Enums.ProviderStatus {
//   switch (status) {
//     case 'ACTIVE':               return $Enums.ProviderStatus.ACTIVE;
//     case 'INACTIVE':             return $Enums.ProviderStatus.INACTIVE;
//     case 'PENDING_VERIFICATION': return $Enums.ProviderStatus.PENDING_VERIFICATION;
//     case 'SUSPENDED':            return $Enums.ProviderStatus.SUSPENDED;
//     case 'BLACKLISTED':          return $Enums.ProviderStatus.BLACKLISTED;
//     default:
//       throw new Error(`Invalid ProviderStatus: ${status}`);
//   }
// }

// function mapCertificationStatus(status: string): $Enums.CertificationStatus {
//   switch (status) {
//     case 'VALID':   return $Enums.CertificationStatus.VALID;
//     case 'EXPIRED': return $Enums.CertificationStatus.EXPIRED;
//     case 'REVOKED': return $Enums.CertificationStatus.REVOKED;
//     default:
//       throw new Error(`Invalid CertificationStatus: ${status}`);
//   }
// }

// function mapContractStatus(status: string): $Enums.ContractStatus {
//   switch (status) {
//     case 'DRAFT':             return $Enums.ContractStatus.DRAFT;
//     case 'PENDING_SIGNATURE': return $Enums.ContractStatus.PENDING_SIGNATURE;
//     case 'SIGNED':            return $Enums.ContractStatus.SIGNED;
//     case 'ACTIVE':            return $Enums.ContractStatus.ACTIVE;
//     case 'COMPLETED':         return $Enums.ContractStatus.COMPLETED;
//     case 'TERMINATED':        return $Enums.ContractStatus.TERMINATED;
//     case 'EXPIRED':           return $Enums.ContractStatus.EXPIRED;
//     case 'CANCELLED':         return $Enums.ContractStatus.CANCELLED;
//     default:
//       throw new Error(`Invalid ContractStatus: ${status}`);
//   }
// }

// async function main() {
//   // Purge existing data
//   await prisma.contract.deleteMany();
//   await prisma.provider.deleteMany();

//   // Seed providers
//   for (const p of providers) {
//     await prisma.provider.create({
//       data: {
//         id: p.id,
//         name: p.name,
//         companyType: mapProviderType(p.companyType),
//         registrationNumber: p.registrationNumber,
//         taxId: p.taxId,
//         foundedDate: new Date(p.foundedDate!),
//         contactPerson: p.contactPerson,
//         email: p.email,
//         phoneNumber: p.phoneNumber,
//         street: p.street,
//         city: p.city,
//         postalCode: p.postalCode,
//         country: p.country,
//         website: p.website,
//         specializations: p.specializations,
//         services: p.services,
//         description: p.description,
//         logo: p.logo,
//         rating: p.rating,
//         status: mapProviderStatus(p.status),
//         paymentTerms: p.paymentTerms,
//         bankName: p.bankName,
//         accountNumber: p.accountNumber,
//         accountName: p.accountName,
//         swiftCode: p.swiftCode,
//         iban: p.iban,
//         certifications: p.certifications.length
//           ? { create: p.certifications.map(cert => ({
//                 id: cert.id,
//                 name: cert.name,
//                 issuingAuthority: cert.issuingAuthority,
//                 issuedDate: new Date(cert.issuedDate!),
//                 expiryDate: new Date(cert.expiryDate!),
//                 status: mapCertificationStatus(cert.status),
//                 verificationUrl: cert.verificationUrl!,
//             })) }
//           : undefined,
//         createdAt: new Date(p.createdAt!),
//         updatedAt: new Date(p.updatedAt!),
//       },
//     });
//   }

//   // Seed contracts
//   for (const c of contracts) {
//     await prisma.contract.create({
//       data: {
//         id: c.id,
//         title: c.title,
//         description: c.description,
//         providerId: c.providerId,
//         projectId: c.projectId ?? null,
//         startDate: new Date(c.startDate!),
//         endDate: new Date(c.endDate!),
//         value: c.value,
//         currency: c.currency,
//         paymentTerms: c.paymentTerms,
//         status: mapContractStatus(c.status),
//         signedAt: c.signedAt ? new Date(c.signedAt) : null,
//         createdAt: new Date(c.createdAt!),
//         updatedAt: new Date(c.updatedAt!),
//       },
//     });
//   }

//   console.log('✅ Seed terminé');
// }

// main()
//   .catch(e => {
//     console.error('❌ Erreur lors du seed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
