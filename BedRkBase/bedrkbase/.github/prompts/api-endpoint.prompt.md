# Generate API Endpoint

Your goal is to generate a new API endpoint following BedRkBase best practices.

Requirements:
* Use Next.js API routes with TypeScript
* Implement proper input validation using zod
* Include error handling with custom error types
* Add authentication checks using Supabase
* Follow RESTful principles
* Include proper TypeScript types for request/response
* Add comprehensive error responses
* Implement rate limiting where appropriate
* Add logging using the project logger

Reference files:
* Types: [../../lib/api.ts](../../lib/api.ts)
* Auth: [../../lib/supabaseClient.ts](../../lib/supabaseClient.ts)
* Logger: [../../lib/logger.ts](../../lib/logger.ts)

Ask for:
1. Endpoint path
2. HTTP method
3. Required data structure
4. Expected response structure
5. Authentication requirements