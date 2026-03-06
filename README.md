# Planning Poker App

Aplicación web de Planning Poker en tiempo real. Sin registro — solo introduce tu nombre.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 + TailwindCSS + socket.io-client |
| Backend | NestJS + Socket.IO + Clean Architecture |
| Base de datos | PostgreSQL (Prisma 5) |
| Infra | Docker Compose |

## Inicio rápido

### Con Docker (recomendado)

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Desarrollo local

**Prerrequisitos:** Node 20+, PostgreSQL corriendo en localhost:5432

```bash
# 1. Copia variables de entorno
cp .env.example .env
# Edita .env con tu DATABASE_URL local

# 2. Backend
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev

# 3. Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

## Funcionalidades

- **Moderador:** crea sala, crea tickets, inicia votación, revela votos, establece estimación final
- **Invitado:** vota tickets activos, ve resultados en tiempo real
- **Escala Fibonacci:** 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ∞, ☕
- **Persistencia de sesión:** via localStorage + sessionToken en DB
- **Tiempo real:** WebSockets (Socket.IO) para todos los eventos

## Flujo de uso

1. El moderador crea una sala e introduce su nombre
2. Comparte el link o código de sala con el equipo
3. El equipo se une introduciendo su nombre
4. Moderador crea tickets (título + descripción opcional)
5. Moderador inicia la votación en un ticket → todos votan
6. Moderador revela los votos → se muestra gráfico de resultados
7. Moderador establece la estimación final → ticket completado
8. Repetir para el siguiente ticket

## Arquitectura del backend

```
src/
├── domain/          # Entidades + interfaces de repositorios
├── application/     # Casos de uso + DTOs
├── infrastructure/  # Prisma repos + WebSocket gateway
└── presentation/    # Controladores + guards + módulos
```
