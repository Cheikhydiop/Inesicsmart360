import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcrypt';
import UserValidator from '../utils/validators/userValidator';
import { generateToken } from '../utils/tokenUtils';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { User, Register, Login } from '../interfaces/UserInterface';
import { paginateOrFindAll } from '../utils/paginate.helpers';


const prisma = new PrismaClient();

class UserService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(userData: Register) {
    try {
      // Validation des données d'inscription
      const validatedData = UserValidator.validateRegister(userData);
      
      // Vérifier si l'email est déjà utilisé
      const existingUser = await prisma.user.findUnique({ 
        where: { email: validatedData.email } 
      });
      
      if (existingUser) {
        throw new ValidationError('Cet email est déjà utilisé');
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Création de l'utilisateur dans la base de données
      const newUser = await prisma.user.create({
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
          organizationId: true,  // Ajout de organizationId
          organization: true,    // récupération OK ici
          phoneNumber: true,
          jobTitle: true,
          department: true,
          createdAt: true,
        }
      });

      // Génération du token d'authentification avec organizationId
      const token = generateToken({ 
        userId: newUser.id, 
        role: newUser.role,
        organizationId: newUser.organizationId  // Ajout de organizationId dans le token
      });

      return { 
        user: newUser, 
        token,
        message: 'Utilisateur créé avec succès'
      };

    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Échec de l'inscription: ${error.message}`);
    }
  }

  /**
   * Connexion d'un utilisateur existant
   */
  static async login(loginData: Login) {
    try {
      // Validation des données de connexion
      const validatedData = UserValidator.validateLogin(loginData);

      // Recherche de l'utilisateur par email
      const user = await prisma.user.findUnique({ 
        where: { email: validatedData.email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          status: true,
          organizationId: true,  // Ajout de organizationId
          organization: true,
          phoneNumber: true,
          jobTitle: true,
          department: true,
          avatar: true,
          lastLogin: true,
        }
      });

      if (!user) {
        throw new ValidationError('Utilisateur non trouvé');
      }

      // Vérification du statut de l'utilisateur
      if (user.status === 'SUSPENDED') {
        throw new ValidationError('Compte suspendu. Contactez l\'administrateur');
      }

      if (user.status === 'INACTIVE') {
        throw new ValidationError('Compte inactif. Contactez l\'administrateur');
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        throw new ValidationError('Identifiants invalides');
      }

      // Mise à jour de la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      });

      // Génération du token avec organizationId
      const token = generateToken({ 
        userId: user.id, 
        role: user.role,
        organizationId: user.organizationId  // Ajout de organizationId dans le token
      });

      // Suppression du mot de passe des données retournées
      const { password, ...userWithoutPassword } = user;

      return { 
        user: userWithoutPassword, 
        token,
        message: 'Connexion réussie'
      };

    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(`Échec de la connexion: ${error.message}`);
    }
  }

  static async getAllUsers(options?: {
    page?: number;
    limit?: number;
    cursor?: any;
    findOptions?: any;
  }) {
    try {
      // Log pour débugger
      console.log('🚀 getAllUsers appelé avec options:', JSON.stringify(options, null, 2));
      
      // Validation et valeurs par défaut
      const page = options?.page ?? 1; // Utilise 1 si undefined/null
      const limit = options?.limit ?? 10;
      
      console.log(`📄 Pagination: page=${page}, limit=${limit}`);
  
      const result = await paginateOrFindAll(prisma, 'user', {
        page,
        limit,
        cursor: options?.cursor,
        findOptions: {
          select: {
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
          },
          ...(options?.findOptions || {})
        },
      });
  
      console.log(`✅ Résultat: ${result.data.length} utilisateurs récupérés`);
  
      return {
        ...result,
        message: result.paginated
          ? 'Utilisateurs paginés récupérés avec succès'
          : 'Liste complète des utilisateurs récupérée avec succès',
      };
    } catch (error: any) {
      console.error('❌ Erreur dans getAllUsers:', error);
      throw new DatabaseError(`Échec de la récupération des utilisateurs: ${error.message}`);
    }
  }
  
  /**
   * Récupérer les infos de l'utilisateur connecté
   */
  static async getUsersBySameOrganizationId(userId: string, options?: {
    page?: number;
    limit?: number;
    cursor?: any;
  }) {
    try {
      // 1. Récupérer l'utilisateur pour connaître son organisation
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });
  
      if (!user?.organizationId) {
        throw new Error("Organisation introuvable pour cet utilisateur.");
      }
  
      const page = options?.page ?? 1;
      const limit = options?.limit ?? 10;
  
      // 2. Récupérer tous les utilisateurs de la même organisation
      const result = await paginateOrFindAll(prisma, 'user', {
        page,
        limit,
        cursor: options?.cursor,
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
      const users = result.data.map((u: any) => {
        const { organization, ...userWithoutOrg } = u;
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
  
    } catch (error: any) {
      console.error('❌ Erreur dans getUsersBySameOrganizationId:', error);
      throw new DatabaseError(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
  }
}

export default UserService;