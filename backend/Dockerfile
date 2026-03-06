FROM node:20-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

# Copy workspace manifests (all needed for pnpm lockfile resolution)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install only backend dependencies
RUN pnpm install --frozen-lockfile --filter=backend

# Generate Prisma client
COPY backend/prisma ./backend/prisma/
RUN pnpm --filter backend run prisma:generate

# Copy source and build
COPY backend/src ./backend/src/
COPY backend/tsconfig*.json ./backend/
COPY backend/nest-cli.json ./backend/
RUN pnpm --filter backend run build

# ---- Production image ----
FROM node:20-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile --filter=backend --prod

COPY --from=builder /app/backend/dist ./backend/dist/
COPY --from=builder /app/backend/prisma ./backend/prisma/
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma/

EXPOSE 3001

CMD ["sh", "-c", "pnpm --filter backend run prisma:deploy && node backend/dist/main"]
