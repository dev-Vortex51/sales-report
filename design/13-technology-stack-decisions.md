# Final Technology Stack Decisions

## Summary

- **Frontend Framework**: React
- **Backend Framework**: Node.js + Express
- **Programming Language**: TypeScript (frontend and backend)
- **Database**: PostgreSQL
- **ORM / Data Access**: Prisma
- **Authentication**: bcrypt + JWT
- **PDF / Receipt Generation**: pdfkit (with Puppeteer as future upgrade path)
- **Reporting & Aggregation**: Direct SQL aggregation via Prisma raw queries
- **Caching Strategy**: None initially
- **Deployment Platform**: Render (web service + managed Postgres)
- **CI/CD**: GitHub Actions
- **Logging**: Pino (structured logging)
- **Monitoring**: Render built-in metrics + Better Stack (or similar free tier)
- **Testing**: Vitest (unit/integration) + Supertest (API tests)
- **Folder Structure Philosophy**: Feature-based modules

## Rationale (Concise)

- **React + TypeScript**: Mature ecosystem, strong typing, and familiar SPA model for a responsive, mobile-friendly UI.
- **Node.js + Express + TypeScript**: Matches the existing architectural assumptions, keeps backend simple and fast to iterate for a solo dev, and shares language types with the frontend.
- **PostgreSQL + Prisma**: Reliable relational engine with strong aggregation support; Prisma provides type-safe queries and migrations, improving maintainability.

-**Docker**: Local development with Docker Compose for consistent environment setup, especially for the database. Production deployment can be done directly to Render without containers to reduce complexity, but Dockerfiles will be maintained for local dev and potential future containerization needs.

-**Rate limiting**: Implement basic rate limiting middleware (e.g., express-rate-limit) to protect against abuse, especially on auth endpoints.

-**System Security Mechanisms**:

- **Input Validation**: Use a validation library (e.g., Joi, Zod) to validate incoming request data for all endpoints, preventing malformed data and potential injection attacks.
- **Password Hashing**: Use bcrypt or argon2 for secure password hashing with per-user salts to protect against rainbow table attacks.
- **JWT Authentication**: Implement JWT-based authentication for stateless API access, with short-lived access tokens and optional refresh tokens stored securely.
- **HTTPS Enforcement**: Ensure all communication is encrypted in transit by enforcing HTTPS and using HSTS headers to prevent protocol downgrade attacks.
- **CORS Policy**: Configure CORS to restrict API access to the frontend domain, preventing unauthorized cross-origin requests.
- **Error Handling**: Centralize error handling to avoid leaking sensitive information and ensure consistent error responses.
- **Access Control**: Implement role-based access control (RBAC) to restrict access to sensitive endpoints and resources based on user roles (e.g., owner vs staff).
- **Logging & Monitoring**: Use structured logging (Pino) and monitoring tools (Render metrics, Better Stack) to track security-related events such as login attempts, sales creation, and export operations for auditing and anomaly detection.

- **bcrypt + JWT**: Well-understood, widely used primitives for secure password storage and stateless auth.
- **pdfkit**: Lightweight, programmatic PDF creation that fits HTML-like receipt layouts without the heavier runtime/memory profile of headless browsers; Puppeteer remains an option later if more complex visuals are needed.

- **Raw SQL via Prisma for reporting**: Keeps reporting logic close to the database and avoids premature analytics tooling.
- **No cache initially**: Current scale does not justify extra infra; simplifies operations and avoids cache invalidation issues.
- **Render + GitHub Actions**: Minimal DevOps overhead, easy deployments, and managed Postgres in a budget-friendly setup.
- **Pino, Better Stack**: Fast JSON logging with simple downstream aggregation and alerting.
- **Vitest + Supertest**: Fast feedback loop for TypeScript services and HTTP endpoints.
- **Feature-based folders**: Aligns with the modular monolith design (auth, sales, reports, settings) and keeps the codebase understandable and extensible.

- **Data Fetching**: Tanstack Query (React Query) for frontend data management, caching, and synchronization with the backend API.

- **State Management**: Redux Toolkit for predictable state management, especially as the app grows in complexity with multiple pages and shared state (e.g., user session, business settings).

- **Form Handling**: React Hook Form for efficient form state management and validation in the sales entry form and settings pages.

- **Styling**: Tailwind CSS for utility-first styling, enabling rapid UI development with a consistent design system without the overhead of a full component library.

- **Chart Library**: Recharts for simple, responsive charts in the reporting dashboard, providing a visual representation of sales trends and summaries.

- **Icon Library**: Lucide React for a modern, open-source icon set that can be easily integrated into the React components for UI elements like buttons, navigation, and status indicators.
