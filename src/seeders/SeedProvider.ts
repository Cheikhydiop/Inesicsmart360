// import {
//   Provider,
//   ProviderType,
//   ProviderStatus,
//   Contract,
//   ContractStatus,
//   Certification,
//   Evaluation,
//   User,
//   UserRole
// } from '../models/types';

// // Mock providers
// export const providers: Provider[] = [
//   {
//     id: 'provider1',
//     name: 'TechElec SARL',
//     companyType: ProviderType.ENTERPRISE,
//     registrationNumber: 'SN-DKR-2015-B-12345',
//     taxId: 'SN9876543210',
//     foundedDate: '2015-05-20',
//     contactPerson: 'Abdou Kane',
//     email: 'a.kane@techelec.sn',
//     phoneNumber: '+221 77 654 32 10',
//     address: {
//       street: '45 Zone Industrielle',
//       city: 'Dakar',
//       postalCode: '11500',
//       country: 'Sénégal'
//     },
//     website: 'https://techelec.sn',
//     specializations: ['Installation électrique', 'Maintenance', 'Éclairage public'],
//     services: ['Installation', 'Réparation', 'Maintenance préventive', 'Audit énergétique'],
//     description: 'TechElec SARL est une entreprise spécialisée dans les installations électriques industrielles et l\'éclairage public avec plus de 10 ans d\'expérience.',
//     logo: '/img/providers/techelec.png',
//     rating: 4.7,
//     status: ProviderStatus.ACTIVE,
//     paymentTerms: 'Paiement à 30 jours',
//     bankInformation: {
//       bankName: 'Banque Atlantique',
//       accountNumber: '12345678901234',
//       accountName: 'TechElec SARL',
//       swiftCode: 'ATLASNDKXXX',
//       iban: 'SN12345678901234567890'
//     },
//     createdAt: '2022-01-15T14:30:00.000Z',
//     updatedAt: '2023-10-23T09:15:00.000Z',
//     certifications: [
//       {
//         id: 'cert1',
//         name: 'ISO 9001',
//         issuingAuthority: 'Bureau Veritas',
//         issuedDate: '2022-05-12',
//         expiryDate: '2025-05-11',
//         status: 'valid',
//         verificationUrl: 'https://verification.bureauveritas.com/cert/12345'
//       }
//     ]
//   },
//   {
//     id: 'provider2',
//     name: 'SolarPower Sénégal',
//     companyType: ProviderType.SMALL_BUSINESS,
//     registrationNumber: 'SN-DKR-2018-B-23456',
//     taxId: 'SN8765432109',
//     foundedDate: '2018-02-10',
//     contactPerson: 'Awa Ndiaye',
//     email: 'awa.ndiaye@solarpower.sn',
//     phoneNumber: '+221 77 765 43 21',
//     address: {
//       street: '27 Ouest Foire',
//       city: 'Dakar',
//       postalCode: '12000',
//       country: 'Sénégal'
//     },
//     website: 'https://solarpower.sn',
//     specializations: ['Énergie solaire', 'Panneaux photovoltaïques', 'Systèmes autonomes'],
//     services: ['Installation', 'Maintenance', 'Conseil', 'Études de faisabilité'],
//     description: 'SolarPower Sénégal est spécialisée dans les solutions d\'énergie solaire pour les zones rurales et urbaines, avec une expertise dans les systèmes autonomes.',
//     logo: '/img/providers/solarpower.png',
//     rating: 4.5,
//     status: ProviderStatus.ACTIVE,
//     paymentTerms: 'Paiement 40% à la commande, 60% à la livraison',
//     bankInformation: {
//       bankName: 'Ecobank',
//       accountNumber: '98765432109876',
//       accountName: 'SolarPower Sénégal',
//       swiftCode: 'ECOCSNDK',
//       iban: 'SN98765432109876543210'
//     },
//     createdAt: '2022-03-10T10:45:00.000Z',
//     updatedAt: '2023-11-05T16:20:00.000Z',
//     certifications: [
//       {
//         id: 'cert2',
//         name: 'Certification Installation Solaire',
//         issuingAuthority: 'Ministère de l\'Énergie',
//         issuedDate: '2021-07-25',
//         expiryDate: '2024-07-24',
//         status: 'valid'
//       }
//     ]
//   },
//   {
//     id: 'provider3',
//     name: 'Réseau Distribution Pro',
//     companyType: ProviderType.ENTERPRISE,
//     registrationNumber: 'SN-DKR-2012-A-34567',
//     taxId: 'SN7654321098',
//     foundedDate: '2012-11-15',
//     contactPerson: 'Mamadou Diallo',
//     email: 'm.diallo@resdispro.sn',
//     phoneNumber: '+221 77 987 65 43',
//     address: {
//       street: '15 Avenue Cheikh Anta Diop',
//       city: 'Dakar',
//       postalCode: '11000',
//       country: 'Sénégal'
//     },
//     website: 'https://resdispro.sn',
//     specializations: ['Infrastructure de distribution', 'Réseau électrique', 'Transformateurs'],
//     services: ['Installation', 'Maintenance', 'Réparation', 'Mise à niveau'],
//     description: 'Réseau Distribution Pro est une entreprise leader dans l\'installation et la maintenance des infrastructures de distribution électrique.',
//     logo: '/img/providers/resdispro.png',
//     rating: 4.2,
//     status: ProviderStatus.ACTIVE,
//     paymentTerms: 'Paiement 30% à la commande, 50% en cours, 20% à la livraison',
//     bankInformation: {
//       bankName: 'CBAO',
//       accountNumber: '56789012345678',
//       accountName: 'Réseau Distribution Pro SARL',
//       swiftCode: 'CBAOSNDX',
//       iban: 'SN56789012345678901234'
//     },
//     createdAt: '2022-02-20T09:00:00.000Z',
//     updatedAt: '2023-08-15T11:30:00.000Z',
//     certifications: [
//       {
//         id: 'cert3',
//         name: 'Certification Sécurité Électrique',
//         issuingAuthority: 'Bureau de Contrôle Technique',
//         issuedDate: '2022-12-05',
//         expiryDate: '2025-12-04',
//         status: 'valid'
//       }
//     ]
//   },
//   {
//     id: 'provider4',
//     name: 'Hydro Solutions Sénégal',
//     companyType: ProviderType.SMALL_BUSINESS,
//     registrationNumber: 'SN-DKR-2019-C-56789',
//     taxId: 'SN6543210987',
//     foundedDate: '2019-04-05',
//     contactPerson: 'Fatou Sow',
//     email: 'fatou.sow@hydrosolutions.sn',
//     phoneNumber: '+221 77 432 10 98',
//     address: {
//       street: '8 Rue de Thiès, Ngor',
//       city: 'Dakar',
//       postalCode: '12100',
//       country: 'Sénégal'
//     },
//     website: 'https://hydrosolutions.sn',
//     specializations: ['Hydraulique', 'Pompage', 'Traitement d\'eau'],
//     services: ['Installation', 'Maintenance', 'Forage', 'Traitement'],
//     description: 'Hydro Solutions Sénégal se spécialise dans les systèmes de pompage, de forage et de traitement d\'eau pour les communautés rurales et les projets agricoles.',
//     logo: '/img/providers/hydrosolutions.png',
//     rating: 4.3,
//     status: ProviderStatus.ACTIVE,
//     createdAt: '2022-05-12T13:45:00.000Z',
//     updatedAt: '2023-09-28T10:20:00.000Z'
//   },
//   {
//     id: 'provider5',
//     name: 'GeoTech Mapping',
//     companyType: ProviderType.FREELANCE,
//     registrationNumber: 'SN-DKR-2020-F-78901',
//     taxId: 'SN5432109876',
//     foundedDate: '2020-08-15',
//     contactPerson: 'Omar Ba',
//     email: 'omar.ba@geotech.sn',
//     phoneNumber: '+221 77 321 54 98',
//     address: {
//       street: '54 Cité Keur Gorgui',
//       city: 'Dakar',
//       postalCode: '12200',
//       country: 'Sénégal'
//     },
//     website: 'https://geotech-mapping.sn',
//     specializations: ['Cartographie', 'SIG', 'Levés topographiques'],
//     services: ['Cartographie', 'Analyses spatiales', 'Collecte de données'],
//     description: 'GeoTech Mapping offre des services de cartographie et d\'analyses spatiales pour les projets d\'infrastructure et d\'aménagement territorial.',
//     logo: '/img/providers/geotech.png',
//     rating: 4.1,
//     status: ProviderStatus.PENDING_VERIFICATION,
//     createdAt: '2022-08-30T09:15:00.000Z',
//     updatedAt: '2023-10-05T14:50:00.000Z'
//   }
// ];

// // Contracts mock data
// export const contracts: Contract[] = [
//   {
//     id: 'contract1',
//     title: 'Installation et maintenance réseau électrique Zone A',
//     description: 'Contrat pour l\'installation et la maintenance du réseau électrique de la Zone A du projet d\'électrification rurale.',
//     provider: 'provider1',
//     project: 'project1',
//     startDate: '2023-03-15',
//     endDate: '2024-03-14',
//     value: 75000000,
//     currency: 'XOF',
//     paymentTerms: 'Paiement par tranches (30% initial, 50% à mi-parcours, 20% à la fin)',
//     status: ContractStatus.ACTIVE,
//     signedAt: '2023-03-10',
//     signedBy: {
//       id: 'user1',
//       name: 'Ahmed Diop',
//       email: 'ahmed.diop@senelec.sn',
//       role: UserRole.ADMIN,
//       avatar: '/avatars/ahmed.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 123 45 67',
//     },
//     createdAt: '2023-02-20T10:30:00.000Z',
//     updatedAt: '2023-03-10T14:45:00.000Z'
//   },
//   {
//     id: 'contract2',
//     title: 'Fourniture et installation de panneaux solaires',
//     description: 'Fourniture et installation de systèmes solaires pour les centres communautaires du projet.',
//     provider: 'provider2',
//     project: 'project2',
//     startDate: '2023-05-01',
//     endDate: '2023-12-31',
//     value: 45000000,
//     currency: 'XOF',
//     paymentTerms: 'Paiement 40% à la commande, 60% à la livraison',
//     status: ContractStatus.ACTIVE,
//     signedAt: '2023-04-25',
//     signedBy: {
//       id: 'user1',
//       name: 'Ahmed Diop',
//       email: 'ahmed.diop@senelec.sn',
//       role: UserRole.ADMIN,
//       avatar: '/avatars/ahmed.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 123 45 67',
//     },
//     createdAt: '2023-04-01T09:15:00.000Z',
//     updatedAt: '2023-04-25T11:30:00.000Z'
//   },
//   {
//     id: 'contract3',
//     title: 'Installation transformateurs électriques',
//     description: 'Installation et mise en service de transformateurs électriques pour le réseau de distribution.',
//     providerid: 'provider3',
//     project: 'project1',
//     startDate: '2023-02-01',
//     endDate: '2023-08-31',
//     value: 32000000,
//     currency: 'XOF',
//     paymentTerms: 'Paiement 30% à la commande, 50% en cours, 20% à la livraison',
//     status: ContractStatus.COMPLETED,
//     signedAt: '2023-01-25',
//     signedBy: {
//       id: 'user1',
//       name: 'Ahmed Diop',
//       email: 'ahmed.diop@senelec.sn',
//       role: UserRole.ADMIN,
//       avatar: '/avatars/ahmed.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 123 45 67',
//     },
//     createdAt: '2023-01-10T14:00:00.000Z',
//     updatedAt: '2023-09-05T10:20:00.000Z'
//   },
//   {
//     id: 'contract4',
//     title: 'Système de pompage eau village Ndioum',
//     description: 'Installation système de pompage d\'eau et traitement pour le village de Ndioum.',
//     provider: 'provider4',
//     project: 'project3',
//     startDate: '2023-06-15',
//     endDate: '2023-12-15',
//     value: 28000000,
//     currency: 'XOF',
//     paymentTerms: 'Paiement par tranches (25% initial, 50% à mi-parcours, 25% à la fin)',
//     status: ContractStatus.ACTIVE,
//     signedAt: '2023-06-10',
//     signedBy: {
//       id: 'user2',
//       name: 'Fatou Ndiaye',
//       email: 'fatou.ndiaye@senelec.sn',
//       role: UserRole.PROJECT_MANAGER,
//       avatar: '/avatars/fatou.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 234 56 78',
//     },
//     createdAt: '2023-05-20T11:00:00.000Z',
//     updatedAt: '2023-06-10T09:45:00.000Z'
//   },
//   {
//     id: 'contract5',
//     title: 'Cartographie zone d\'intervention',
//     description: 'Services de cartographie et d\'analyses spatiales pour la zone d\'intervention du projet.',
//     provider: 'provider5',
//     project: 'project2',
//     startDate: '2023-07-01',
//     endDate: '2023-09-30',
//     value: 12000000,
//     currency: 'XOF',
//     paymentTerms: 'Paiement 50% initial, 50% à la livraison',
//     status: ContractStatus.PENDING_SIGNATURE,
//     createdAt: '2023-06-15T13:30:00.000Z',
//     updatedAt: '2023-06-25T10:15:00.000Z'
//   }
// ];

// // Evaluations mock data
// export const evaluations: Evaluation[] = [
//   {
//     id: 'eval1',
//     providerId: 'provider1',
//     evaluator: {
//       id: 'user1',
//       name: 'Ahmed Diop',
//       email: 'ahmed.diop@senelec.sn',
//       role: UserRole.ADMIN,
//       avatar: '/avatars/ahmed.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 123 45 67',
//     },
//     project: 'project1',
//     date: '2023-09-15',
//     criteria: [
//       {
//         name: 'Qualité de service',
//         description: 'Qualité des prestations fournies',
//         rating: 4.5,
//         weight: 0.3,
//         comments: 'Très bonne qualité d\'exécution, attention au détail'
//       },
//       {
//         name: 'Respect des délais',
//         description: 'Capacité à respecter les délais',
//         rating: 4.2,
//         weight: 0.3,
//         comments: 'Délais généralement respectés avec quelques retards mineurs'
//       },
//       {
//         name: 'Communication',
//         description: 'Qualité de la communication',
//         rating: 4.8,
//         weight: 0.2,
//         comments: 'Excellente communication, réactivité aux demandes'
//       },
//       {
//         name: 'Rapport qualité-prix',
//         description: 'Rapport entre la qualité et le prix',
//         rating: 4.0,
//         weight: 0.2,
//         comments: 'Prix légèrement élevés mais justifiés par la qualité'
//       }
//     ],
//     overallRating: 4.4,
//     comments: 'Prestataire fiable et professionnel, recommandé pour les projets futurs',
//     recommendations: 'Continuer la collaboration pour les prochains projets d\'envergure'
//   },
//   {
//     id: 'eval2',
//     providerId: 'provider2',
//     evaluator: {
//       id: 'user2',
//       name: 'Fatou Ndiaye',
//       email: 'fatou.ndiaye@senelec.sn',
//       role: UserRole.PROJECT_MANAGER,
//       avatar: '/avatars/fatou.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 234 56 78',
//     },
//     project: 'project2',
//     date: '2023-11-20',
//     criteria: [
//       {
//         name: 'Qualité de service',
//         description: 'Qualité des prestations fournies',
//         rating: 4.7,
//         weight: 0.3,
//         comments: 'Excellente qualité des installations solaires'
//       },
//       {
//         name: 'Respect des délais',
//         description: 'Capacité à respecter les délais',
//         rating: 4.3,
//         weight: 0.3,
//         comments: 'Bonne planification et respect des échéances'
//       },
//       {
//         name: 'Communication',
//         description: 'Qualité de la communication',
//         rating: 4.5,
//         weight: 0.2,
//         comments: 'Communication claire et régulière'
//       },
//       {
//         name: 'Rapport qualité-prix',
//         description: 'Rapport entre la qualité et le prix',
//         rating: 4.2,
//         weight: 0.2,
//         comments: 'Bon rapport qualité-prix pour des équipements de qualité'
//       }
//     ],
//     overallRating: 4.5,
//     comments: 'SolarPower a démontré un excellent savoir-faire technique et une grande fiabilité',
//     recommendations: 'À considérer en priorité pour les projets d\'énergie solaire futurs'
//   },
//   {
//     id: 'eval3',
//     providerId: 'provider3',
//     evaluator: {
//       id: 'user2',
//       name: 'Fatou Ndiaye',
//       email: 'fatou.ndiaye@senelec.sn',
//       role: UserRole.PROJECT_MANAGER,
//       avatar: '/avatars/fatou.jpg',
//       organization: 'Senelec',
//       phoneNumber: '+221 77 234 56 78',
//     },
//     project: 'project1',
//     date: '2023-09-10',
//     criteria: [
//       {
//         name: 'Qualité de service',
//         description: 'Qualité des prestations fournies',
//         rating: 4.0,
//         weight: 0.3,
//         comments: 'Bonne qualité d\'exécution mais quelques détails à améliorer'
//       },
//       {
//         name: 'Respect des délais',
//         description: 'Capacité à respecter les délais',
//         rating: 4.2,
//         weight: 0.3,
//         comments: 'Délais respectés dans l\'ensemble'
//       },
//       {
//         name: 'Communication',
//         description: 'Qualité de la communication',
//         rating: 4.1,
//         weight: 0.2,
//         comments: 'Communication correcte mais pourrait être plus proactive'
//       },
//       {
//         name: 'Rapport qualité-prix',
//         description: 'Rapport entre la qualité et le prix',
//         rating: 4.5,
//         weight: 0.2,
//         comments: 'Très bon rapport qualité-prix'
//       }
//     ],
//     overallRating: 4.2,
//     comments: 'Prestataire compétent avec une bonne maîtrise technique',
//     recommendations: 'Continuer la collaboration en insistant sur la qualité des finitions'
//   }
// ];
