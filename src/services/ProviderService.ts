import { PrismaClient } from '@prisma/client';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { paginateOrFindAll } from '../utils/paginate.helpers';

const prisma = new PrismaClient();

class ProviderService {
  /**
   * Récupère tous les fournisseurs avec pagination et filtres optionnels
   */
  static async getAllProviders(options?: {
    page?: number;
    limit?: number;
    cursor?: { id: string };
    findOptions?: {
      where?: any;
      orderBy?: any;
    };
  }) {
    try {
      console.log('🚀 getAllProviders appelé avec options:', JSON.stringify(options, null, 2));
      
      const page = options?.page ?? 1;
      const limit = options?.limit ?? 10;
      const cursor = options?.cursor;
      const findOptions = options?.findOptions ?? {};

      // Construction dynamique de la requête
      const result = await paginateOrFindAll(prisma, 'provider', {
        page,
        limit,
        cursor,
        findOptions: {
          select: {
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
            
          },
          ...findOptions,
        },
      });

      console.log(`✅ ${result.data.length} providers récupérés`);
      
      return {
        ...result,
        message: result.paginated
          ? 'Providers paginés récupérés avec succès'
          : 'Liste complète des providers récupérée avec succès',
      };
    } catch (error: any) {
      console.error('❌ Erreur dans getAllProviders:', error);
      throw new DatabaseError(`Échec de la récupération des fournisseurs: ${error.message}`);
    }
  }


  static async getProviderDetails(providerId: string) {
    try {
      if (!providerId) {
        throw new ValidationError("L'identifiant du fournisseur est requis.");
      }
  
      const provider = await prisma.provider.findUnique({
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
        throw new ValidationError("Fournisseur introuvable.");
      }
  
      return {
        data: provider,
        message: "Détails du fournisseur récupérés avec succès",
      };
    } catch (error: any) {
      console.error('❌ Erreur dans getProviderDetails:', error);
      throw new DatabaseError(`Échec de la récupération du fournisseur: ${error.message}`);
    }
  }

  static async getProvidersByUser(userId: string) {
    try {
      if (!userId) {
        throw new ValidationError("L'identifiant de l'utilisateur est requis.");
      }
  
      // 1. Récupérer l'utilisateur pour connaître son organisation
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });
  
      if (!user?.organizationId) {
        throw new Error("Organisation introuvable pour cet utilisateur.");
      }
  
      // 2. Récupérer tous les fournisseurs de l'organisation de l'utilisateur
      const providers = await prisma.provider.findMany({
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
    } catch (error: any) {
      console.error('❌ Erreur dans getProvidersByUser:', error);
      throw new DatabaseError(`Échec de la récupération des fournisseurs: ${error.message}`);
    }
  }
  
}

export default ProviderService;