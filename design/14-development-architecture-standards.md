# Development Architecture & Engineering Standards

Scope: Internal development architecture, code organization, and non-negotiable engineering practices for the Sales Management System.
Audience: Solo developer now, future contributors later.

---

## 1. Development Architecture Overview

**Pattern:** Feature-based modular architecture within a layered modular monolith.

- **Feature-first**: Code is grouped by business feature (auth, sales, receipts, reports, settings/shared) rather than by technical layer alone.
- **Internal layering** within each feature:
  - **API layer**: HTTP controllers, request/response mapping.
  - **Service layer**: Business logic, orchestration, rules.
  - **Data access layer**: Repositories / Prisma access, raw SQL for reporting.
- **Shared/core** modules provide cross-cutting utilities (logging, config, PDF/email adapters, validation) and must not depend on feature modules.
- **Strict dependency direction**: UI → API controllers → services → data access → database.

Goals:

- Keep modules cohesive and independently understandable.
- Make it safe to refactor internals without breaking the rest of the system.
- Preserve a clear path to extracting a module as a microservice in the distant future without designing a distributed system now.

---

## 2. Architectural Rules (Non-Negotiable)

1. **Feature isolation**
   - Each feature (auth, sales, receipts, reports, settings) has its own module folder on backend and frontend.
   - No feature module may import code from another feature module’s internals; they communicate via clearly defined public interfaces (e.g., exported service functions).

2. **Dependency direction**
   - Controllers may depend on services and shared/core.
   - Services may depend on repositories and shared/core.
   - Repositories may depend only on Prisma client and shared/core.
   - Shared/core depends on nothing in feature modules.

3. **No business logic in controllers or React components**
   - Controllers are thin: validate input, call service, translate result/exception into HTTP response.
   - React components are thin: present data, handle interaction, call typed API client/hooks.
   - All business rules (tax calculation, totals, receipt numbers, access rules) live in services.

4. **Database access only through repositories**
   - No direct Prisma/raw SQL calls from services or controllers.
   - Each entity/feature defines a repository (or set of repos) encapsulating all DB operations.

5. **Single source of truth for validation schemas**
   - Request validation schemas (e.g., Zod) live in the backend module and are re-used to generate frontend types when needed (via shared type packages or codegen).
   - No copying/pasting of shapes between front and back.

6. **Error handling centralized**
   - All thrown domain/application errors pass through a global error middleware that maps them to consistent HTTP error responses.

7. **Logging is structured and contextual**
   - Every HTTP request gets a request ID.
   - Logs always include level, timestamp, request ID, and user/branch context where applicable.

8. **No external I/O in database transactions**
   - DB transaction scopes contain only database operations.
   - PDF generation and email sending always occur after the transaction commits.

9. **TypeScript strict mode enabled**
   - `strict: true` is mandatory for both frontend and backend.

10. **Linting and formatting mandatory**

- ESLint + Prettier must pass with no warnings in CI for merge to main.

---

## 3. Folder Structure Blueprint

### 3.1 Backend (Node.js + Express + TypeScript)

```text
backend/
  src/
    app.ts                 # Express app bootstrap
    server.ts              # HTTP server startup

    config/                # Configuration & environment
      env.ts
      prisma-client.ts

    core/                  # Cross-cutting, framework-agnostic helpers
      logging/
        logger.ts          # Pino setup
      errors/
        AppError.ts
        error-types.ts
      validation/
        schemas.ts         # Common primitives
      security/
        password-hash.ts   # bcrypt wrappers
        jwt.ts

    shared/                # Framework-bound utilities
      middlewares/
        auth.middleware.ts
        error.middleware.ts
        request-logger.middleware.ts
        validation.middleware.ts
      services/
        pdf.service.ts     # pdfkit integration
        email.service.ts   # email provider integration

    modules/
      auth/
        auth.controller.ts
        auth.service.ts
        auth.repository.ts
        auth.routes.ts
        auth.types.ts

      sales/
        sales.controller.ts
        sales.service.ts
        sales.repository.ts
        sales.types.ts
        sales.routes.ts

      receipts/
        receipts.controller.ts (optional; often folded into sales)
        receipts.service.ts

      reports/
        reports.controller.ts
        reports.service.ts  # Aggregation logic
        reports.repository.ts

      settings/
        settings.controller.ts
        settings.service.ts
        settings.repository.ts

    routes.ts              # Root router wiring all module routes

  prisma/
    schema.prisma          # DB schema
    migrations/            # Prisma migrations

  tests/
    unit/
    integration/
      api/                 # Supertest-based HTTP tests
```

### 3.2 Frontend (React + TypeScript)

```text
frontend/
  src/
    main.tsx               # App entry
    app-router.tsx         # React Router config

    core/
      api-client.ts        # Axios/fetch wrapper
      config.ts            # API base URL, env
      hooks/               # shared hooks (useAuth, useApi)
      components/          # cross-feature components (Layout, Button, Modal)

    modules/
      auth/
        pages/LoginPage.tsx
        components/LoginForm.tsx
        state/auth.store.ts (if using Zustand/Redux)
        api/auth.api.ts     # typed client wrappers

      sales/
        pages/NewSalePage.tsx
        pages/SalesHistoryPage.tsx
        components/CartTable.tsx
        components/CheckoutPanel.tsx
        components/ReceiptPreviewModal.tsx
        api/sales.api.ts

      reports/
        pages/DashboardPage.tsx
        components/DailyMetricsCard.tsx
        components/WeeklyTrendChart.tsx
        components/TopItemsList.tsx
        api/reports.api.ts

      settings/
        pages/SettingsPage.tsx
        components/BusinessSettingsForm.tsx
        components/BranchManager.tsx
        api/settings.api.ts

    styles/
    tests/
      unit/
      integration/
```

Rules:

- `modules/*/api/*.api.ts` are the only files that know HTTP paths; components import typed functions from there.
- No direct `fetch`/Axios calls inside components.

---

## 4. Module Boundaries

### 4.1 Sales Module

- Responsibilities:
  - Creating and listing sales.
  - Computing totals and taxes.
  - Owning sale lifecycle status (COMPLETED, REFUNDED, VOID).
- Exposes:
  - Service functions: `createSale`, `getSaleById`, `listSales`.
  - No direct knowledge of PDF layout or email formatting.

### 4.2 Receipt Module

- Responsibilities:
  - Turning a completed sale into a receipt document.
  - Coordinating with `pdf.service` to produce PDFs.
- Exposes:
  - `generateReceiptPdf(saleId)` returning a stream/buffer.
- Must not:
  - Modify sale records; it is read-only.

### 4.3 Reporting Module

- Responsibilities:
  - Daily and weekly aggregates, top items, trends.
  - Raw SQL/read-optimized queries via Prisma.
- Exposes:
  - `getDailySummary`, `getWeeklySummary`, `exportWeeklySummary`.
- Must not:
  - Perform writes to transactional tables.

### 4.4 Auth Module

- Responsibilities:
  - Login, token issuing, user retrieval.
  - Password hashing, JWT issuance/verification.
- Exposes:
  - `login`, `getCurrentUser`.
- Must not:
  - Contain business rules about sales or reporting.

### 4.5 Shared/Core Module

- Responsibilities:
  - Logging, config, generic error types, common validation utilities, security primitives, and integration adapters.
- Must not:
  - Contain domain-specific logic (no tax rules, no sale lifecycle rules).

---

## 5. Code Standards

1. **Naming conventions**
   - Files: `kebab-case` for non-components (e.g., `sales.service.ts`), `PascalCase` for React components.
   - Types/interfaces: `PascalCase` (`Sale`, `DailySummaryDto`).
   - Functions: `camelCase` with verbs (`createSale`, `hashPassword`).
   - Constants: `UPPER_SNAKE_CASE` for environment-derived values.

2. **Function size limits**
   - Max ~30–40 lines per function.
   - If a function grows beyond that, extract helpers.

3. **File size limits**
   - Aim for < 300 lines per file.
   - If a controller or component exceeds this, split into smaller components/route handlers.

4. **Error handling strategy**
   - Use typed error classes (e.g., `DomainError`, `ValidationError`, `AuthError`).
   - Services throw domain-specific errors; controllers never throw raw errors.
   - Global error middleware maps known errors to HTTP status codes and JSON bodies.

5. **Logging rules**
   - Log levels: `debug` (dev only), `info` (business events), `warn`, `error`.
   - Log on:
     - Auth events (login success/failure).
     - Sale creation (with anonymized customer info).
     - Report exports.
     - Unexpected errors.
   - Never log passwords, full JWT tokens, or full customer emails; only partial masking.

---

## 6. API Design Best Practices

1. **Versioning**
   - All endpoints under `/api/v1`.
   - Backward-compatible changes only within v1 (additive fields, optional params).
   - Breaking changes require `/api/v2`.

2. **Response format standards**
   - Successful responses:
     - `{ "data": <payload>, "meta": { ...optional } }`
   - Error responses:
     - `{ "error": { "code": string, "message": string, "details"?: any } }`

3. **Validation approach**
   - Use schema-based validation (e.g., Zod) for all request bodies and query params.
   - Validation occurs in middleware before controllers execute.
   - Reject unknown fields in production to avoid silent contract drift.

---

## 7. Database Best Practices

1. **Indexing strategy**
   - Required indexes:
     - `sales(branch_id, sale_timestamp DESC)`
     - `sales(status, sale_timestamp DESC)` (or combined with branch if needed)
     - `sales(customer_email)`
     - `sale_items(sale_id)`
     - `sale_items(item_id)`
   - Review query plans (`EXPLAIN ANALYZE`) for reporting queries before production.

2. **Transaction handling**
   - Always wrap sale creation (`sales`, `sale_items`, optional `receipts` row) in a single transaction.
   - Never span transactions across HTTP requests.
   - Rollback on any failure; partial writes are not allowed.

3. **Migration discipline**
   - Use Prisma Migrate.
   - No manual schema changes outside migrations.
   - Apply expand-and-contract strategy for breaking changes:
     - Add new columns/tables while keeping old ones.
     - Migrate data with scripts.
     - Switch application to new schema.
     - Remove old columns/tables in a later migration.

---

## 8. Performance Guidelines

1. **Avoiding N+1 queries**
   - For listing sales with line items, use:
     - Joins or `include` statements in Prisma instead of per-row queries.
   - Any loop performing DB calls must be inspected and refactored into set-based queries.

2. **Query optimization rules**
   - Filter early by `branch_id`, `status`, and date range.
   - Select only needed columns for reporting queries.
   - Use covering indexes for the most common filters/sorts.

3. **Frontend rendering discipline**
   - Use pagination or infinite scroll for sales history; never render unbounded lists.
   - Use memoization (`React.memo`, `useMemo`, `useCallback`) only for proven hotspots.
   - Avoid heavy computation in render paths; move to selectors/hooks.

---

## 9. Testing Strategy

1. **Unit tests (Vitest)**
   - Mandatory for:
     - Business logic functions (totals, tax, reporting aggregations).
     - Auth helpers (password hashing/verification, JWT helpers).
     - Validation schemas.

2. **Integration/API tests (Vitest + Supertest)**
   - Mandatory for:
     - Auth endpoints (`POST /auth/login`).
     - `POST /sales` including transaction behavior.
     - Reporting endpoints (`/reports/daily-summary`, `/reports/weekly-summary`).
   - Use a test database and migrations; tests must not hit production.

3. **What must always be tested before release**
   - Sale creation end-to-end (request → DB rows → receipt generation endpoint).
   - Daily/weekly summary correctness for known fixtures.
   - Authentication and authorization rules (unauthenticated/unauthorized access blocked).

---

## 10. Security Best Practices

1. **Input validation**
   - All external inputs are validated and sanitized.
   - Monetary inputs validated to max 2 decimal places; totals recomputed on server.

2. **Authentication enforcement**
   - All non-auth endpoints require a valid JWT.
   - Auth middleware must run before any controller logic; no bypasses.

3. **Data protection**
   - Store passwords only as bcrypt hashes.
   - Use HTTPS in production only.
   - Do not expose internal IDs in logs or URLs beyond what the API contract defines.

---

## 11. Refactoring & Maintenance Guidelines

1. **Refactoring triggers**
   - Any module with:
     - File > 300 lines, or
     - Function > 40 lines, or
     - Duplicate logic in more than 2 places
   - must be considered for refactoring in the next iteration.

2. **Definition of Done includes**
   - Tests written/updated and passing.
   - Lint/format clean.
   - Docs updated (API contracts or design, if changed).
   - No new TODOs without a linked task.

3. **Technical debt recording**
   - Any deliberate shortcut must be captured as a ticket with:
     - Clear description.
     - Impact.
     - Proposed fix.
   - `// TODO` comments must reference that ticket ID.

4. **Regular cleanup**
   - At least once per minor feature, perform a small refactor (rename, extract, delete dead code) instead of bolting on new logic.

---

## 12. Best Practices Checklist

- [ ] All new code follows feature-based module structure.
- [ ] No controller or React component contains business logic.
- [ ] All external inputs validated via shared schemas.
- [ ] Sales creation uses a single DB transaction, no external I/O inside it.
- [ ] Indexes exist for primary reporting/listing queries.
- [ ] New endpoints conform to `/api/v1` and response envelope.
- [ ] Unit and integration tests added/updated.
- [ ] Logs are structured and do not leak sensitive data.

---

## 13. Anti-Patterns to Avoid

- Business logic inside controllers, repositories, or React components.
- Direct ORM/DB access from UI or from controllers.
- Copy-pasted request/response shapes between frontend and backend.
- Ad-hoc stringly-typed error handling; throwing `Error` without types.
- One-off scripts changing production schema outside migrations.
- In-memory global state that outlives a request on the backend (except caches introduced deliberately later).
- Adding new features by piling `if/else` into existing large functions instead of extracting.

---

## 14. Technical Debt Prevention Plan

- Enforce architectural rules via code review and CI checks.
- Keep changes small and focused; avoid "big bang" branches.
- Prefer adding a small, well-named module over extending a God-Object.
- Revisit design docs when behavior changes meaningfully; design and code must stay in sync.

These standards are mandatory from day one and are intended to keep the system modular, maintainable, and production-ready while remaining achievable for a solo developer.

---

## 15. Frontend Patterns

- **Container/Presentational pattern**: Separate components into "containers" that handle data fetching and state management, and "presentational" components that focus on UI rendering. This keeps components focused and reusable.
- **Hooks for logic reuse**: Use custom React hooks to encapsulate reusable logic (e.g., `useSales`, `useAuth`) that can be shared across multiple components without duplication.
- **DRY principles**: Avoid repeating code by creating shared components (e.g., `Button`, `Modal`) and utility functions (e.g., date formatting, API client wrappers) that can be reused across the app.
- **Advance React Patterns**: Like Render Props or Compound Components if needed for complex UI interactions, but only when they provide clear benefits over simpler patterns.
