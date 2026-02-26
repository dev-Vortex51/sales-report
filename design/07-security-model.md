# Security Model (Authentication & Data Protection)

## Authentication

- **User Identity**:
  - Single owner account initially, with potential additional staff accounts.
- **Mechanism**:
  - Email + password login.
  - Passwords hashed using a strong algorithm (bcrypt/argon2) with per-user salt.
  - JWT-based auth for stateless API access.
- **Session Management**:
  - Access tokens (JWT) with short TTL (e.g., 1 hour).
  - Optional refresh tokens stored securely (HTTP-only cookie or encrypted in DB).

## Authorization

- Simple role-based access control (RBAC):
  - `OWNER`: Full access to all resources, branches, and settings.
  - `STAFF` (future): Limited to recording sales and viewing basic dashboards.
- Enforce authorization at the API layer using middleware.

## Data Protection

- **In Transit**:
  - Enforce HTTPS/TLS for all external communication.
  - HSTS headers to prevent protocol downgrade.
- **At Rest**:
  - Enable disk-level encryption and DB encryption (cloud provider feature).
  - Encrypt secrets and sensitive config via managed secrets store (Azure Key Vault, AWS Secrets Manager, etc.).

## Input Validation & Sanitization

- Validate all incoming JSON using a schema validator (e.g., Joi/Zod/FluentValidation).
- Reject malformed or unexpected fields.
- Sanitize any user-provided strings that may appear in HTML templates (e.g., receipts) to avoid XSS.

## Secure Coding Practices

- Use parameterized queries (handled by ORM) to avoid SQL injection.
- Centralized error handling that avoids leaking stack traces to the client.
- Implement rate limiting and brute-force protection on `/auth/login`.
- Configure CORS policies (restrict origins to the app domain).

## Access Control to PDFs & Reports

- **Receipts**:
  - Protected by auth; only logged-in owner (or authorized staff) can access.
  - If stored in object storage, use private buckets with signed URLs that expire.
- **Reports**:
  - Available only to authenticated users; more sensitive exports (like full CSV) restricted to owner.

## Auditing & Logs

- Log: login attempts, successful logins, sales creation, and export operations.
- Retain logs per compliance and operational needs; consider central log storage.

## Backup & Recovery Security

- Ensure DB backups are encrypted.
- Restrict access to backup storage to admin/service accounts only.

## Compliance Considerations

- For customer emails and receipt data, follow local data protection laws (e.g., GDPR if applicable):
  - Provide ability to delete customer data on request.
  - Avoid storing unnecessary personal data.
