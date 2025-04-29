# BedRkBase Project Copilot Instructions

## Code Style & Architecture
- Use TypeScript for all new code
- Use React functional components with hooks
- Follow a clean architecture pattern separating concerns
- Prefix private class fields with underscore
- Use async/await for asynchronous operations
- Use proper TypeScript types, avoid 'any'

## Database & API
- Use Prisma for database operations
- Include proper error handling for database operations
- Follow RESTful principles for API endpoints
- Include input validation for all API endpoints
- Use Supabase client for authentication operations

## Testing
- Write tests using Jest for backend code
- Use React Testing Library for component tests
- Include error cases in test coverage
- Mock external services in tests

## Documentation
- Add JSDoc comments for functions and classes
- Include example usage in complex utility functions
- Document API endpoints with expected request/response formats
- Add inline comments for complex logic

## Security
- Validate all user inputs
- Use proper authentication checks
- Sanitize database queries
- Handle sensitive data appropriately
- Implement proper error handling without exposing internals