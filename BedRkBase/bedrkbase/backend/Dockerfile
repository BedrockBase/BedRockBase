# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package configuration and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and application source code
COPY prisma/ ./prisma/
COPY src/ ./src/
COPY tsconfig.json ./

# Generate Prisma client and build the application
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .

EXPOSE 8000
CMD ["npm", "start"]
