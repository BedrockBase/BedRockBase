# BedRkBase Backend API

This is the dedicated backend service for the BedRkBase application. It provides a RESTful API for managing establishments and other data.

## Features

- Express.js REST API
- PostgreSQL database with Prisma ORM
- TypeScript for type safety
- CORS support
- Health check endpoints
- Mock data support for development

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env` (if not already done)
   - Update the database connection string and other variables as needed

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with hot-reloading enabled.

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Health Checks

- `GET /api/health` - Basic health check
- `GET /api/health/db` - Database connection check
- `GET /api/health/mock` - Mock database check (for development)

### Establishments

- `GET /api/establishments` - Get all establishments (limited to 100)
- `GET /api/establishments/:id` - Get establishment by ID
- `POST /api/establishments` - Create a new establishment
- `PUT /api/establishments/:id` - Update an establishment
- `DELETE /api/establishments/:id` - Delete an establishment
- `GET /api/establishments/mock/data` - Get mock establishment data (for development)

## Development

### Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation, etc.
│   └── index.ts           # Main entry point
├── .env                   # Environment variables
├── package.json
└── tsconfig.json
```

### Environment Variables

- `PORT` - Port to run the server on (default: 8000)
- `NODE_ENV` - Environment (development, production)
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - URL of the frontend application (for CORS)
- `SUPABASE_URL` - Supabase URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

## Integration with Frontend

The frontend application should be configured to make API requests to this backend service. Update the frontend's `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Then update the API client in the frontend to use this URL for all API requests.
