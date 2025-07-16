import { PrismaClient, Request } from '@prisma/client';
import { ValidationError, DatabaseError } from '../errors/customErrors';
import { IRequestRepository } from '../repositories/interfaces/IRequestRepository';
import { ImplRequestRepository } from '../repositories/implementations/ImplRequestRepository';
import { RequestFilters } from '../utils/RequestFilters';

export class RequestService {
  private requestRepository: IRequestRepository;
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient, requestRepository?: IRequestRepository) {
    this.prisma = prisma || new PrismaClient();
    this.requestRepository = requestRepository || new ImplRequestRepository(this.prisma);
  }

  async getAllRequests(filters: RequestFilters = {}): Promise<{
    requests: Request[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      return await this.requestRepository.getAllRequests(filters);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de la récupération des demandes');
    }
  }

  async getRequestById(id: string): Promise<Request | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new ValidationError('ID de la requête requis et doit être une chaîne de caractères');
      }

      return await this.requestRepository.getRequestDetails(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de la récupération des détails de la requête');
    }
  }

  async getRequestsByUserOrganization(userId: string, filters: RequestFilters = {}) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { organizationId: true },
      });

      if (!user?.organizationId) {
        throw new ValidationError("L'utilisateur n'est rattaché à aucune organisation.");
      }

      return await this.requestRepository.getRequestsByOrganizationId(user.organizationId, filters);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError("Erreur lors de la récupération des requêtes par organisation.");
    }
  }
}
