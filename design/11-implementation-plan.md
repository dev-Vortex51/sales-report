# Implementation Plan & Execution Strategy

As the Technical Lead, I have translated the system architecture into a practical, step-by-step implementation workflow. This plan ensures a clean separation of concerns, modularity, and a clear path to production for the web-based sales management system.

---

## 1. Implementation Phases

### Phase 1: Foundation & Core Sales (Weeks 1-2)
**Goal:** Establish the base project, authentication, and the ability to record a sale and generate a receipt.
*   Project scaffolding (Frontend & Backend).
*   Database provisioning and initial migrations (Users, Branches, Settings, Sales).
*   Authentication module (JWT login).
*   Core Sales API (Create sale, calculate totals).
*   Basic Receipt Generation (HTML-to-PDF).
*   Frontend: Login, basic layout, and New Sale entry page.

### Phase 2: Dashboards & Reporting (Week 3)
**Goal:** Provide visibility into business performance.
*   Reporting APIs (Daily summary, Weekly aggregation).
*   Frontend: Dashboard page with charts and metric cards.
*   PDF/CSV export functionality for reports.

### Phase 3: Catalog, Settings & Polish (Week 4)
**Goal:** Make the system configurable and production-ready.
*   Items catalog management (optional reusable items).
*   Business settings management (Tax rates, receipt logo/footer).
*   Email integration (sending receipts to customers).
*   Frontend: Settings page, Sales History view.

### Phase 4: Deployment & Handover (Week 5)
**Goal:** Go live with monitoring and backups.
*   CI/CD pipeline setup.
*   Provision production cloud infrastructure (PaaS + Managed DB).
*   Final security audit and performance testing.

---

## 2. Page-Level Breakdown

| Page | Components | API Calls |
| :--- | :--- | :--- |
| **Login** | `LoginForm`, `ErrorMessage` | `POST /api/v1/auth/login` |
| **Dashboard (Home)** | `DailyMetricsCard`, `WeeklyTrendChart`, `TopItemsList`, `ExportButton` | `GET /api/v1/reports/daily-summary`<br>`GET /api/v1/reports/weekly-summary`<br>`GET /api/v1/reports/weekly-summary/export` |
| **New Sale** | `ItemSearchInput`, `CartTable`, `CheckoutPanel`, `ReceiptPreviewModal` | `GET /api/v1/items` (if catalog used)<br>`POST /api/v1/sales` |
| **Sales History** | `DateRangeFilter`, `SalesTable`, `ReceiptModal` | `GET /api/v1/sales`<br>`GET /api/v1/sales/{id}`<br>`GET /api/v1/sales/{id}/receipt` |
| **Settings** | `ProfileForm`, `BusinessSettingsForm`, `BranchManager` | `GET /api/v1/settings`<br>`PUT /api/v1/settings`<br>`GET /api/v1/branches` |

---

## 3. Backend Module Structure

Assuming a Node.js (Express or NestJS) environment, the monolith will be structured by feature modules to ensure clean separation of concerns and easy future extraction.

```text
src/
├── config/                 # Environment variables, DB connection, Logger setup
├── shared/                 # Cross-cutting concerns
│   ├── middlewares/        # auth.middleware, error.middleware, validate.middleware
│   ├── services/           # pdf.service, email.service
│   └── utils/              # formatting, math helpers
├── modules/                # Feature modules
│   ├── auth/
│   │   ├── auth.controller # Route handlers
│   │   ├── auth.service    # Business logic (hashing, JWT)
│   │   └── auth.routes     # Express router definitions
│   ├── sales/
│   │   ├── sales.controller
│   │   ├── sales.service   # Transaction logic, tax calculation
│   │   └── sales.routes
│   ├── reports/
│   │   ├── reports.controller
│   │   ├── reports.service # Aggregation queries
│   │   └── reports.routes
│   └── settings/
│       ├── settings.controller
│       ├── settings.service
│       └── settings.routes
└── app.js                  # App entry point, middleware registration
```

---

## 4. Database Migration Plan

We will use a migration tool (e.g., Prisma Migrate, Knex, or Flyway) to manage schema changes predictably.

*   **Migration 001_init:** Create `users`, `branches`, and `settings` tables. Insert default owner user and default branch.
*   **Migration 002_sales_core:** Create `items`, `sales`, `sale_items`, and `receipts` tables. Add foreign keys and indexes (`sale_timestamp`, `branch_id`).
*   **Workflow:**
    1. Developer modifies schema definition locally.
    2. Tool generates a SQL migration file.
    3. Migration is reviewed in PR.
    4. CI/CD pipeline automatically applies pending migrations to Staging/Prod before starting the new application version.

---

## 5. API Development Order

To unblock the frontend team (or frontend tasks) as quickly as possible, APIs will be built in this sequence:

1.  **`POST /auth/login`**: Required for all subsequent API calls.
2.  **`GET /settings` & `PUT /settings`**: Needed to fetch default tax rates and branch info for the UI.
3.  **`POST /sales`**: The core transaction endpoint. Includes DB transaction logic.
4.  **`GET /sales/{id}/receipt`**: PDF generation service integration.
5.  **`GET /reports/daily-summary` & `GET /reports/weekly-summary`**: Read-only aggregation queries for the dashboard.
6.  **`GET /reports/weekly-summary/export`**: Reusing PDF service for reports.

---

## 6. DevOps & Deployment Workflow

*   **Local Development:** `docker-compose.yml` to spin up local PostgreSQL. Node.js runs locally with hot-reloading.
*   **Version Control:** GitHub/GitLab. Main branch is protected. Feature branches require PRs.
*   **CI Pipeline (GitHub Actions):**
    *   Trigger: Push to PR.
    *   Steps: Linting (ESLint/Prettier) -> Unit Tests -> Build check.
*   **CD Pipeline:**
    *   Trigger: Merge to `main`.
    *   Steps: Run DB Migrations -> Deploy to PaaS (e.g., Render, Heroku, or Azure App Service).
*   **Infrastructure:** Managed PostgreSQL database. App runs as a stateless container/process.

---

## 7. Risk Analysis & Mitigation

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **PDF Generation blocking Event Loop** | High (Node.js is single-threaded; heavy PDF rendering could stall other requests). | Use a lightweight library, or offload Puppeteer/Playwright tasks to a worker thread/queue if traffic increases. Set strict timeouts. |
| **Timezone Mismatches in Reports** | Medium (Sales recorded on wrong days). | Store all timestamps in `UTC`. Pass the `branch_id` timezone to the DB query (e.g., `AT TIME ZONE`) when grouping by day. |
| **Data Loss during Sale Creation** | High (Financial discrepancy). | Wrap `sales`, `sale_items`, and `receipts` inserts in a strict ACID database transaction. |
| **Floating Point Math Errors** | High (Incorrect totals/taxes). | Store monetary values as integers (cents/pence) OR use a precise decimal library (e.g., `decimal.js` or `NUMERIC` in Postgres). Never use standard JS floats for money. |

---

## 8. Estimated Build Sequence (Step-by-Step Execution)

1.  **Step 1: Repository Setup:** Initialize Git, Node.js backend, React/Vue frontend, and Linter/Prettier configs.
2.  **Step 2: Database Provisioning:** Setup local Postgres via Docker. Configure ORM/Query builder.
3.  **Step 3: Auth Implementation:** Build User model, JWT generation, and Auth middleware.
4.  **Step 4: Frontend Scaffolding:** Setup routing (React Router), state management, and Login page.
5.  **Step 5: Core Sales Backend:** Implement `POST /sales` with transaction logic and math validation.
6.  **Step 6: PDF Service:** Integrate HTML-to-PDF library and create the receipt template.
7.  **Step 7: Sales UI:** Build the New Sale page, cart state, and checkout flow.
8.  **Step 8: Reporting Backend:** Write SQL aggregation queries for daily/weekly summaries.
9.  **Step 9: Dashboard UI:** Implement charts and metric cards on the frontend.
10. **Step 10: Settings & Polish:** Add settings management, email integration, and error boundaries.
11. **Step 11: CI/CD & Go Live:** Configure GitHub Actions, provision production DB and PaaS, and deploy.
