/**
 * Prisma Transaction Wrapper Utility
 * 
 * Provides a safe, reusable way to run multiple DB operations in a single transaction.
 * Usage:
 *   await transactionWrapper(async (prisma) => {
 *     // ...multiple operations using the provided prisma instance
 *   });
 * 
 * @see [Checklist 3] and snippets.md
 */

import prisma from './prisma';
import { PrismaClient } from '@prisma/client';

import { Prisma } from '@prisma/client';

export async function transactionWrapper<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await callback(tx as Prisma.TransactionClient);
  });
}
