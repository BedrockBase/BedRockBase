# Generate Database Operation

Your goal is to generate database operations following BedRkBase standards.

Requirements:
* Use Prisma as the ORM
* Implement proper error handling with custom types
* Include input validation using zod
* Add proper logging for operations
* Follow type-safe patterns
* Include proper transaction handling
* Implement retry logic for transient failures
* Add performance considerations

Reference files:
* Prisma Client: [../../lib/prisma.ts](../../lib/prisma.ts)
* Logger: [../../lib/logger.ts](../../lib/logger.ts)
* Error Types: [../../lib/api.ts](../../lib/api.ts)

Database Operation Patterns:
* Use Prisma transactions for multiple operations
* Implement proper connection handling
* Add error mapping to domain errors
* Include timeout handling
* Implement proper query optimization
* Add proper indexes where needed

Ask for:
1. Operation type (create/read/update/delete)
2. Data model involved
3. Required relationships
4. Validation requirements
5. Transaction requirements
6. Error handling needs