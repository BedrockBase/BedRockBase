/**
 * EstablishmentService - Service Layer Example
 * 
 * Encapsulates business logic for establishments.
 * Controllers/routes should call service methods instead of accessing the DB directly.
 * 
 * @see [Checklist 8] and snippets.md
 */

import prisma from '../utils/prisma';

export class EstablishmentService {
  static async listEstablishments(skip = 0, take = 10) {
    return prisma.establishment.findMany({ skip, take });
  }

  static async getEstablishmentById(id: string) {
    return prisma.establishment.findUnique({ where: { id } });
  }

  static async createEstablishment(data: { name: string }) {
    // Add business rules/validation here if needed
    return prisma.establishment.create({ data });
  }
}
