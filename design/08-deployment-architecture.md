# Deployment Architecture (Low-Cost Cloud Setup)

## Target Stack Example (Node.js + PostgreSQL)

### Core Components

- **Web App**: Node.js + Express (monolith) deployed as a container or directly to PaaS.
- **Database**: Managed PostgreSQL instance.
- **Object Storage** (optional for receipts): Cloud storage bucket.
- **Email Provider**: Third-party email service.

### Low-Cost Cloud Options

- **Option A: Azure**
  - Azure App Service (Basic tier) for web app.
  - Azure Database for PostgreSQL (Basic tier).
  - Azure Blob Storage for PDFs.
  - Azure Monitor for logs and metrics.
- **Option B: AWS**
  - Elastic Beanstalk or Lightsail for app hosting.
  - Amazon RDS (PostgreSQL) with small instance.
  - S3 for PDF storage.
  - CloudWatch for monitoring.
- **Option C: Heroku / Render / Railway** (simpler dev experience)
  - Single dyno/service for app.
  - Managed PostgreSQL add-on.
  - Storage via S3 or built-in provider.

### Deployment Pipeline

- Use simple CI (GitHub Actions):
  - On push to `main`, run tests and lint.
  - Build and deploy to the chosen platform.
- Environment variables for configuration (DB URL, email API key, JWT secret, etc.).

### Environments

- **Dev**: Local DB or small shared dev DB.
- **Prod**: Single production environment with backups enabled.

### Network & Security

- Terminate TLS at load balancer or app gateway.
- Restrict DB access to app network / security group.
- Use firewall rules or VNet/Subnet isolation where available.
