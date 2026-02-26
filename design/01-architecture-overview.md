# Sales Management System – Architecture Overview

## Goals & Context

- Migrate from Excel to a simple, reliable web-based sales management system.
- Support a single store initially, with a clear path to multi-branch support.
- Keep hosting and operational costs low while maintaining security and durability.

## High-Level Architecture (Monolith on Cloud PaaS)

- A single, modular monolithic web application exposing REST APIs and serving a SPA / responsive web UI.
- Cloud-managed SQL database for durability and easy reporting.
- Stateless backend scaled horizontally behind a managed load balancer.
- Object storage for generated receipts (PDF) if long-term storage is desired; otherwise generated on-demand.

### Architecture Diagram (Mermaid)

```mermaid
flowchart LR
    subgraph Client
        OwnerBrowser["Owner Browser / Mobile
(Responsive Web UI)"]
    end

    subgraph Cloud[Cloud Environment]
        LB[Managed Load Balancer]
        subgraph AppTier[Web App (Monolith)]
            FE[Frontend (SPA/SSR)]
            BE[Backend API
(Node.js)]
        end
        DB[(Managed SQL DB
(PostgreSQL ))]
        Storage[(Object Storage
(PDF receipts))]
        Auth[Auth Module
(Password, JWT)]
        Metrics[Monitoring & Logs]
        Backup[Automated DB Backups]
    end

    OwnerBrowser -->|HTTPS| LB --> FE
    FE -->|HTTPS REST| BE
    BE -->|SQL| DB
    BE -->|Generate / Read| Storage
    BE --> Auth
    BE --> Metrics
    DB --> Backup
```

## Rationale

- **Monolith vs microservices**: Start with a monolith to minimize complexity and cost. Clear internal modular boundaries (sales, reporting, auth) allow future extraction if needed.
- **SQL database**: Sales and reporting data is naturally relational and requires strong consistency, indexing, and aggregation; SQL (PostgreSQL/MySQL) is ideal.
- **Cloud-managed services**: Use a managed DB (e.g., Azure Database for PostgreSQL, AWS RDS, or GCP Cloud SQL) and a simple web app host (Azure App Service, AWS Elastic Beanstalk, or Heroku) to avoid ops overhead.
- **Stateless backend**: Store session/auth state in signed tokens (JWT) and database; no sticky sessions needed, which simplifies horizontal scaling.

## Key Quality Attributes

- **Performance**: Simple API calls with indexed queries; response time target < 300ms for sales input under expected load (< 10k tx/month).
- **Availability**: Use cloud platform SLA (typically 99%+), health checks, and rolling updates.
- **Security**: HTTPS-only, hashed passwords, JWT-based auth, role-based checks, and least-privilege DB access.
- **Cost-efficiency**: Single small app instance plus small managed DB tier is sufficient initially; scale up/out only as transaction volume or branches grow.
