# MCC MNU API

NestJS API workspace for the MCC MNU community platform.

## Current status

**Foundation scaffold only — not production-ready.** This initial commit includes the NestJS bootstrap, global input validation, Helmet headers, CORS configuration, request throttling, a health endpoint, and the initial Prisma data model. Authentication, role guards, business endpoints, migrations, and integration tests still need to be implemented before real users can use the platform.

## Local setup

1. Install Node.js LTS and PostgreSQL.
2. Copy `.env.example` to `.env` and set a local PostgreSQL `DATABASE_URL`.
3. Install dependencies from this directory with `npm install`.
4. Generate Prisma Client with `npm run prisma:generate`.
5. Validate the schema with `npm run prisma:validate`.
6. Create a reviewed migration with `npm run prisma:migrate:dev -- --name initial`.
7. Start the API with `npm run start:dev`.
8. Check `GET http://localhost:4000/api/v1/health`.

Do not expose this API publicly until authentication and server-side authorization have been implemented and tested. Never create an admin role through public registration.
