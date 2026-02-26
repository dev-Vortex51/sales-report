# Trade-offs & Architectural Justifications

## Monolith vs Microservices

- **Chosen**: Modular monolith.
- **Why**:
  - Simple to develop, deploy, and operate for a single-owner business.
  - Lower hosting costs (one app, one DB).
  - Fewer moving parts → less to monitor and secure.
- **Microservices Rejected (for now)**:
  - Adds network hops, deployment and monitoring overhead, and complexity that is not justified by the current scale.
  - Only consider if the system evolves into a multi-tenant SaaS with high scale and independent teams.

## SQL vs NoSQL

- **Chosen**: SQL (PostgreSQL/MySQL).
- **Why**:
  - Strong consistency guarantees and ACID transactions needed for financial data.
  - Natural fit for structured, relational data (sales, items, branches, users).
  - Powerful ad-hoc querying and aggregation (GROUP BY, joins) for reports.
- **NoSQL Rejected (for core data)**:
  - Would complicate aggregations and reporting.
  - Benefits (schema-less, horizontal partitioning) not necessary at current scale.

## HTML-to-PDF vs Native PDF Libraries

- **Chosen**: HTML-to-PDF (Puppeteer/Playwright).
- **Why**:
  - Faster to design and iterate on receipt templates using HTML/CSS.
  - Easier to match printed receipt formatting expectations.
- **Native PDF Libraries**:
  - More lightweight and sometimes faster at runtime.
  - But templates are more complex to maintain; reserved as a fallback if headless browser is problematic.

## Managed Cloud Services vs Self-Managed

- **Chosen**: Managed services (PaaS, managed DB).
- **Why**:
  - Reduced ops burden (patching, backups, failover handled by provider).
  - Better reliability and durability guarantees (SLA-backed).
  - Worth the small extra cost relative to a self-managed VM.

## Cost vs Reliability

- **Cost control**:
  - Single small instance and DB are sufficient for expected load.
  - Auto-scaling disabled initially; can be enabled as usage grows.
- **Reliability**:
  - Even low-tier managed DB and app hosting typically offer 99%+ uptime.
  - Backups ensure data survivability even if infrastructure fails.

## Why This Is Appropriate for a Small Business Migrating from Excel

- **Low barrier to entry**:
  - Simple login-based web UI that can be accessed from any device with a browser.
- **Minimal operational overhead**:
  - Owner does not need an IT team; cloud provider covers infra reliability and backups.
- **Structured, durable data**:
  - Every sale is recorded with full history; reports can be generated for any period.
- **Room to grow**:
  - Schema and architecture already anticipate multiple branches and users without forcing complexity now.
- **Security improvement over Excel**:
  - Proper authentication, encrypted storage, and automated backups significantly reduce the risk of data loss or unauthorized access compared to local Excel files.
