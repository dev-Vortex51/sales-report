# Sales Management Backend

Express + TypeScript backend built from the system design docs.

## Stack

- Node.js + Express
- Prisma + PostgreSQL
- JWT auth (`bcrypt` + `jsonwebtoken`)
- Zod request validation
- Helmet, CORS, rate limiting

## Quick Start

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and create schema:

```bash
npm run prisma:generate
npx prisma db push
```

4. Seed default owner + branch + settings:

```bash
npm run prisma:seed
```

5. Run dev server:

```bash
npm run dev
```

Default API base URL: `http://localhost:4000/api/v1`

## Quality Gates

Run before merge/release:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run test
```

## Docker (Backend + Postgres)

From workspace root:

```bash
docker compose up --build
```

This starts:

- `postgres` on `localhost:5432`
- `backend` on `localhost:4000`

To stop:

```bash
docker compose down
```

To remove DB volume too:

```bash
docker compose down -v
```

## Implemented Endpoints

- `POST /api/v1/auth/login`
- `POST /api/v1/sales`
- `GET /api/v1/sales`
- `GET /api/v1/sales/:id`
- `GET /api/v1/sales/:id/receipt`
- `GET /api/v1/reports/dashboard`
- `GET /api/v1/reports/weekly`
- `GET /api/v1/reports/weekly/pdf`
- `GET /api/v1/reports/weekly/csv`
- `GET /api/v1/reports/daily/pdf`
- `GET /api/v1/reports/daily-summary`
- `GET /api/v1/reports/weekly-summary`
- `GET /api/v1/reports/weekly-summary/export?format=pdf|csv`
- `GET /api/v1/settings`
- `PATCH /api/v1/settings`
- `PUT /api/v1/settings`
- `GET /api/v1/branches`
- `POST /api/v1/branches`
- `PATCH /api/v1/branches/:id`

## Notes

- Receipt and report PDF endpoints are rendered with `pdfkit` templates.
