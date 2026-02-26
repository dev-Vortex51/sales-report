# System Component Breakdown

## 1. Frontend (Web UI)

- **Technology options**: React
- **Responsibilities**:
  - Owner login/logout.
  - Sales entry form (item, quantity, price, tax selection/auto-calculation).
  - Display of generated receipt preview.
  - Dashboards: daily sales summary and weekly reports with charts.
  - Export buttons (PDF/CSV) triggering backend endpoints.
  - Responsive layout for desktop, tablet, and mobile.

## 2. Backend (Application Server)

- **Technology options**: Node.js (Express/NestJS), Python (Django/FastAPI), or .NET (ASP.NET Core). Choose based on developer familiarity. Example here assumes Node.js + Express.
- **Modules**:
  1. **Auth Module**
     - Register initial owner user (one-time bootstrap or seeded admin account).
     - Login endpoint returning JWT.
     - Middleware to validate JWT and authorize access to resources.
  2. **Sales Module**
     - Create sales transaction API (single or multiple line items per sale).
     - Compute totals, tax, discounts if any.
     - Trigger receipt generation (PDF) and email dispatch.
  3. **Reporting Module**
     - Daily summary (total revenue, number of transactions, average sale value).
     - Weekly aggregated reports (revenue per day, trends, top items).
     - Export endpoints (PDF/CSV).
  4. **Receipt Module**
     - PDF template rendering using a library (e.g., pdfkit, wkhtmltopdf, Puppeteer-based HTML-to-PDF).
     - Optionally persist PDFs in object storage with a reference in DB.
  5. **Notification/Email Module**
     - Integrate with low-cost email provider (e.g., SendGrid, Amazon SES, Mailgun).
     - Send receipt to customer email if provided.

## 3. Database Layer

- **Managed SQL DB** (PostgreSQL recommended).
- **ORM/Query Layer**: Use an ORM such as Prisma (Node), SQLAlchemy (Python), or Entity Framework (C#) for maintainability.
- **Responsibilities**:
  - Persist users, branches, items, sales, sale line items, and receipts.
  - Support reporting queries with proper indexes.

## 4. Services & Integrations

### Email Service

- **Purpose**: Send sales receipts to customers, optionally weekly summary emails to owner.
- **Implementation**:
  - Thin wrapper around provider SDK.
  - Retry logic and graceful failure (receipt still generated and available even if email fails).

### PDF Generation Service

- **Purpose**: Generate standardized, printable receipts and weekly reports as PDF.
- **Implementation options**:
  - HTML template + headless browser (Puppeteer/Playwright) to render and export to PDF.
  - Or use a pure-PDF library (pdfkit, jsPDF) with template abstraction.

### Object Storage (Optional Phase 2)

- **Purpose**: Persist PDFs externally to reduce DB size and allow long-term access.
- **Implementation**:
  - Use cloud object storage (AWS S3, Azure Blob, or GCP Cloud Storage).
  - Store only the URL/key in the database.

## 5. Admin Console

- **Features**:
  - Manage branches (for future multi-branch support).
  - Configure tax rates and business details (logo, address, footer note on receipt).
  - Manage user accounts (owner and potentially staff users).

## 6. Cross-Cutting Concerns

- **Logging**: Structured logs for each request (correlation ID, user, endpoint, latency).
- **Monitoring**: Basic application metrics (requests, errors, latency) and DB health.
- **Configuration Management**: Use environment variables or a simple config service (no complex config servers needed initially).
- **Error Handling**: Centralized error middleware returning consistent JSON error responses.
