FROM node:20-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

# Copy workspace manifests (all needed for pnpm lockfile resolution)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install only frontend dependencies
RUN pnpm install --frozen-lockfile --filter=frontend

# Copy source and build
COPY frontend ./frontend/
RUN pnpm --filter frontend run build

# ---- Production image ----
FROM node:20-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile --filter=frontend --prod

COPY --from=builder /app/frontend/.next ./frontend/.next/
COPY --from=builder /app/frontend/public ./frontend/public/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "--filter", "frontend", "run", "start"]
