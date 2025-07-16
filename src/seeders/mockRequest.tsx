// import {
//     Provider,
//     ProviderType,
//     ProviderStatus,
//     Contract,
//     ContractStatus,
//     UserRole,
//     CertificationStatus
//   } from '../models/types';
  
//   // Mock providers corrigés selon les types
//   export const providers: Provider[] = [
//     {
//       id: 'provider1',
//       name: 'TechElec SARL',
//       companyType: ProviderType.ENTERPRISE,
//       registrationNumber: 'SN-DKR-2015-B-12345',
//       taxId: 'SN9876543210',
//       foundedDate: new Date('2015-05-20'),
//       contactPerson: 'Abdou Kane',
//       email: 'a.kane@techelec.sn',
//       phoneNumber: '+221 77 654 32 10',
//       website: 'https://techelec.sn',
//       specializations: ['Installation électrique', 'Maintenance', 'Éclairage public'],
//       services: ['Installation', 'Réparation', 'Maintenance préventive', 'Audit énergétique'],
//       description: 'TechElec SARL est une entreprise spécialisée dans les installations électriques industrielles et l\'éclairage public avec plus de 10 ans d\'expérience.',
//       logo: '/img/providers/techelec.png',
//       rating: 4.7,
//       status: ProviderStatus.ACTIVE,
//       paymentTerms: 'Paiement à 30 jours',
//       createdAt: new Date('2022-01-15T14:30:00.000Z'),
//       updatedAt: new Date('2023-10-23T09:15:00.000Z'),
      
//       // Embedded address (selon l'interface Provider)
//       street: '45 Zone Industrielle',
//       city: 'Dakar',
//       postalCode: '11500',
//       country: 'Sénégal',
      
//       // Embedded bank information (selon l'interface Provider)
//       bankName: 'Banque Atlantique',
//       accountNumber: '12345678901234',
//       accountName: 'TechElec SARL',
//       swiftCode: 'ATLASNDKXXX',
//       iban: 'SN12345678901234567890',
      
//       // Relations (à initialiser selon les besoins)
//       contracts: [], // sera rempli par référence
//       certifications: [], // sera rempli après la déclaration des providers
//       documents: [],
//       evaluations: [],
//       inventoryItems: []
//     },
//     {
//       id: 'provider2',
//       name: 'SolarPower Sénégal',
//       companyType: ProviderType.SMALL_BUSINESS,
//       registrationNumber: 'SN-DKR-2018-B-23456',
//       taxId: 'SN8765432109',
//       foundedDate: new Date('2018-02-10'),
//       contactPerson: 'Awa Ndiaye',
//       email: 'awa.ndiaye@solarpower.sn',
//       phoneNumber: '+221 77 765 43 21',
//       website: 'https://solarpower.sn',
//       specializations: ['Énergie solaire', 'Panneaux photovoltaïques', 'Systèmes autonomes'],
//       services: ['Installation', 'Maintenance', 'Conseil', 'Études de faisabilité'],
//       description: 'SolarPower Sénégal est spécialisée dans les solutions d\'énergie solaire pour les zones rurales et urbaines, avec une expertise dans les systèmes autonomes.',
//       logo: '/img/providers/solarpower.png',
//       rating: 4.5,
//       status: ProviderStatus.ACTIVE,
//       paymentTerms: 'Paiement 40% à la commande, 60% à la livraison',
//       createdAt: new Date('2022-03-10T10:45:00.000Z'),
//       updatedAt: new Date('2023-11-05T16:20:00.000Z'),
      
//       // Embedded address
//       street: '27 Ouest Foire',
//       city: 'Dakar',
//       postalCode: '12000',
//       country: 'Sénégal',
      
//       // Embedded bank information
//       bankName: 'Ecobank',
//       accountNumber: '98765432109876',
//       accountName: 'SolarPower Sénégal',
//       swiftCode: 'ECOCSNDK',
//       iban: 'SN98765432109876543210',
      
//       // Relations
//       contracts: [],
//       certifications: [], // sera rempli après la déclaration des providers
//       documents: [],
//       evaluations: [],
//       inventoryItems: []
//     },
//     {
//       id: 'provider3',
//       name: 'Réseau Distribution Pro',
//       companyType: ProviderType.ENTERPRISE,
//       registrationNumber: 'SN-DKR-2012-A-34567',
//       taxId: 'SN7654321098',
//       foundedDate: new Date('2012-11-15'),
//       contactPerson: 'Mamadou Diallo',
//       email: 'm.diallo@resdispro.sn',
//       phoneNumber: '+221 77 987 65 43',
//       website: 'https://resdispro.sn',
//       specializations: ['Infrastructure de distribution', 'Réseau électrique', 'Transformateurs'],
//       services: ['Installation', 'Maintenance', 'Réparation', 'Mise à niveau'],
//       description: 'Réseau Distribution Pro est une entreprise leader dans l\'installation et la maintenance des infrastructures de distribution électrique.',
//       logo: '/img/providers/resdispro.png',
//       rating: 4.2,
//       status: ProviderStatus.ACTIVE,
//       paymentTerms: 'Paiement 30% à la commande, 50% en cours, 20% à la livraison',
//       createdAt: new Date('2022-02-20T09:00:00.000Z'),
//       updatedAt: new Date('2023-08-15T11:30:00.000Z'),
      
//       // Embedded address
//       street: '15 Avenue Cheikh Anta Diop',
//       city: 'Dakar',
//       postalCode: '11000',
//       country: 'Sénégal',
      
//       // Embedded bank information
//       bankName: 'CBAO',
//       accountNumber: '56789012345678',
//       accountName: 'Réseau Distribution Pro SARL',
//       swiftCode: 'CBAOSNDX',
//       iban: 'SN56789012345678901234',
      
//       // Relations
//       contracts: [],
//       certifications: [], // sera rempli après la déclaration des providers
//       documents: [],
//       evaluations: [],
//       inventoryItems: []
//     },
//     {
//       id: 'provider4',
//       name: 'Hydro Solutions Sénégal',
//       companyType: ProviderType.SMALL_BUSINESS,
//       registrationNumber: 'SN-DKR-2019-C-56789',
//       taxId: 'SN6543210987',
//       foundedDate: new Date('2019-04-05'),
//       contactPerson: 'Fatou Sow',
//       email: 'fatou.sow@hydrosolutions.sn',
//       phoneNumber: '+221 77 432 10 98',
//       website: 'https://hydrosolutions.sn',
//       specializations: ['Hydraulique', 'Pompage', 'Traitement d\'eau'],
//       services: ['Installation', 'Maintenance', 'Forage', 'Traitement'],
//       description: 'Hydro Solutions Sénégal se spécialise dans les systèmes de pompage, de forage et de traitement d\'eau pour les communautés rurales et les projets agricoles.',
//       logo: '/img/providers/hydrosolutions.png',
//       rating: 4.3,
//       status: ProviderStatus.ACTIVE,
//       createdAt: new Date('2022-05-12T13:45:00.000Z'),
//       updatedAt: new Date('2023-09-28T10:20:00.000Z'),
      
//       // Embedded address
//       street: '8 Rue de Thiès, Ngor',
//       city: 'Dakar',
//       postalCode: '12100',
//       country: 'Sénégal',
      
//       // Relations
//       contracts: [],
//       certifications: [],
//       documents: [],
//       evaluations: [],
//       inventoryItems: []
//     },
//     {
//       id: 'provider5',
//       name: 'GeoTech Mapping',
//       companyType: ProviderType.FREELANCE,
//       registrationNumber: 'SN-DKR-2020-F-78901',
//       taxId: 'SN5432109876',
//       foundedDate: new Date('2020-08-15'),
//       contactPerson: 'Omar Ba',
//       email: 'omar.ba@geotech.sn',
//       phoneNumber: '+221 77 321 54 98',
//       website: 'https://geotech-mapping.sn',
//       specializations: ['Cartographie', 'SIG', 'Levés topographiques'],
//       services: ['Cartographie', 'Analyses spatiales', 'Collecte de données'],
//       description: 'GeoTech Mapping offre des services de cartographie et d\'analyses spatiales pour les projets d\'infrastructure et d\'aménagement territorial.',
//       logo: '/img/providers/geotech.png',
//       rating: 4.1,
//       status: ProviderStatus.PENDING_VERIFICATION,
//       createdAt: new Date('2022-08-30T09:15:00.000Z'),
//       updatedAt: new Date('2023-10-05T14:50:00.000Z'),
      
//       // Embedded address
//       street: '54 Cité Keur Gorgui',
//       city: 'Dakar',
//       postalCode: '12200',
//       country: 'Sénégal',
      
//       // Relations
//       contracts: [],
//       certifications: [],
//       documents: [],
//       evaluations: [],
//       inventoryItems: []
//     }
//   ];
  
//   // Mock contracts corrigés selon les types
//   export const contracts: Contract[] = [
//     {
//       id: 'contract1',
//       title: 'Contrat maintenance TechElec',
//       description: 'Contrat d\'installation et maintenance électrique avec TechElec SARL.',
//       startDate: new Date('2023-01-01'),
//       endDate: new Date('2023-12-31'),
//       value: 50000,
//       currency: 'XOF',
//       paymentTerms: 'Paiement à 30 jours après facturation',
//       status: ContractStatus.ACTIVE,
//       signedAt: new Date('2022-12-28T14:00:00.000Z'),
//       createdAt: new Date('2022-12-10T10:00:00.000Z'),
//       updatedAt: new Date('2023-04-15T15:30:00.000Z'),
      
//       // Relations
//       providerId: 'provider1',
//       provider: providers[0], // Référence au provider TechElec
//       projectId: undefined, // Peut être défini selon les besoins
//       project: undefined,
//       signedById: 'admin1',
//       signedBy: undefined, // À définir avec un objet User complet
//       documents: [],
//       amendments: []
//     },
//     {
//       id: 'contract2',
//       title: 'Contrat installation solaire',
//       description: 'Contrat d\'installation de panneaux solaires avec SolarPower Sénégal.',
//       startDate: new Date('2023-03-01'),
//       endDate: new Date('2024-02-29'),
//       value: 125000,
//       currency: 'XOF',
//       paymentTerms: 'Paiement 40% à la commande, 60% à la livraison',
//       status: ContractStatus.ACTIVE,
//       signedAt: new Date('2023-02-25T10:30:00.000Z'),
//       createdAt: new Date('2023-02-15T09:00:00.000Z'),
//       updatedAt: new Date('2023-02-25T10:30:00.000Z'),
      
//       // Relations
//       providerId: 'provider2',
//       provider: providers[1], // Référence au provider SolarPower
//       documents: [],
//       amendments: []
//     },
//     {
//       id: 'contract3',
//       title: 'Contrat infrastructure distribution',
//       description: 'Contrat d\'installation et maintenance des infrastructures de distribution électrique.',
//       startDate: new Date('2023-06-01'),
//       endDate: new Date('2025-05-31'),
//       value: 300000,
//       currency: 'XOF',
//       paymentTerms: 'Paiement 30% à la commande, 50% en cours, 20% à la livraison',
//       status: ContractStatus.SIGNED,
//       signedAt: new Date('2023-05-28T16:15:00.000Z'),
//       createdAt: new Date('2023-05-10T11:00:00.000Z'),
//       updatedAt: new Date('2023-05-28T16:15:00.000Z'),
      
//       // Relations
//       providerId: 'provider3',
//       provider: providers[2], // Référence au provider Réseau Distribution Pro
//       documents: [],
//       amendments: []
//     }
//   ];
  
//   // Mise à jour des références croisées
//   providers[0].contracts = [contracts[0]];
//   providers[1].contracts = [contracts[1]];
//   providers[2].contracts = [contracts[2]];
  
//   // Création des certifications avec les références aux providers
//   const certifications = [
//     {
//       id: 'cert1',
//       name: 'ISO 9001',
//       issuingAuthority: 'Bureau Veritas',
//       issuedDate: new Date('2022-05-12'),
//       expiryDate: new Date('2025-05-11'),
//       status: CertificationStatus.VALID,
//       verificationUrl: 'https://verification.bureauveritas.com/cert/12345',
//       providerId: 'provider1',
//       provider: providers[0]
//     },
//     {
//       id: 'cert2',
//       name: 'Certification Installation Solaire',
//       issuingAuthority: 'Ministère de l\'Énergie',
//       issuedDate: new Date('2021-07-25'),
//       expiryDate: new Date('2024-07-24'),
//       status: CertificationStatus.VALID,
//       providerId: 'provider2',
//       provider: providers[1]
//     },
//     {
//       id: 'cert3',
//       name: 'Certification Sécurité Électrique',
//       issuingAuthority: 'Bureau de Contrôle Technique',
//       issuedDate: new Date('2022-12-05'),
//       expiryDate: new Date('2025-12-04'),
//       status: CertificationStatus.VALID,
//       providerId: 'provider3',
//       provider: providers[2]
//     }
//   ];
  
//   // Assignation des certifications aux providers
//   providers[0].certifications = [certifications[0]];
//   providers[1].certifications = [certifications[1]];
//   providers[2].certifications = [certifications[2]];
  
//   // Export pour faciliter l'utilisation
//   export const getProviderById = (id: string): Provider | undefined => {
//     return providers.find(provider => provider.id === id);
//   };
  
//   export const getContractById = (id: string): Contract | undefined => {
//     return contracts.find(contract => contract.id === id);
//   };
  
//   export const getContractsByProviderId = (providerId: string): Contract[] => {
//     return contracts.filter(contract => contract.providerId === providerId);
//   };
  
//   export const getActiveProviders = (): Provider[] => {
//     return providers.filter(provider => provider.status === ProviderStatus.ACTIVE);
//   };
  
//   export const getActiveContracts = (): Contract[] => {
//     return contracts.filter(contract => contract.status === ContractStatus.ACTIVE);
//   };