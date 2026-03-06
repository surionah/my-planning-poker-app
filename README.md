# Planning Poker App

Real-time Planning Poker web application. No registration required — just enter your name.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + TailwindCSS + socket.io-client |
| Backend | NestJS + Socket.IO + Clean Architecture |
| Database | PostgreSQL (Prisma 5) |
| Infrastructure | Docker Compose |

## Quick start

### With Docker (recommended)

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Local development

**Prerequisites:** Node 20+, pnpm, PostgreSQL running on localhost:5432

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env with your local DATABASE_URL

# 2. Install dependencies (from root)
pnpm install

# 3. Run database migrations
pnpm migrate

# 4. Start both services (from root)
pnpm dev
```

Or run each service separately:

```bash
# Backend
cd backend && pnpm start:dev

# Frontend (separate terminal)
cd frontend && pnpm dev
```

## Features

- **Moderator:** create room, create tickets, start voting, reveal votes, set final estimate
- **Guest:** vote on active tickets, see results in real time
- **Fibonacci scale:** 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ∞, ☕
- **Session persistence:** via localStorage + sessionToken in DB
- **Real time:** WebSockets (Socket.IO) for all events

## Usage flow

1. Moderator creates a room and enters their name
2. Share the link or room code with the team
3. Team members join by entering their name
4. Moderator creates tickets (title + optional description)
5. Moderator starts voting on a ticket → everyone votes
6. Moderator reveals votes → results chart is displayed
7. Moderator sets the final estimate → ticket completed
8. Repeat for the next ticket

## Backend architecture

```
src/
├── domain/          # Entities + repository interfaces
├── application/     # Use cases + DTOs
├── infrastructure/  # Prisma repos + WebSocket gateway
└── presentation/    # Controllers + guards + modules
```
