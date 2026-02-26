# Formal Technical Review (Principal Software Architect)

Scope reviewed:
- Approved architecture and trade-offs.
- Implementation workflow and module breakdown.
- Security, monitoring, deployment, and scalability guidance.

Assumptions applied for final decisions:
- Single developer, limited budget, high importance of data integrity.
- No architecture redesign; decisions remain within approved modular monolith + managed SQL model.

## Confirmed Decisions

### 1) Decision: Modular monolith on managed PaaS + managed PostgreSQL
**Justification**
- Best fit for solo-developer maintainability and budget.
- Preserves strong module boundaries (`auth`, `sales`, `reports`, `settings`) without distributed-system overhead.
- Aligns with expected load (<10k transactions/month).

**Long-term impact**
- Fast delivery and low ops burden now.
- Clean extraction path later if one module becomes a scale hotspot.

### 2) Decision: PostgreSQL as system of record with ACID writes
**Justification**
- Financial transactions require consistency and atomicity.
- Reporting needs relational joins and aggregations.

**Long-term impact**
- Reliable auditability and straightforward compliance posture.
- Predictable query performance with proper indexing.

### 3) Decision: Keep REST API versioning as `/api/v1`
**Justification**
- Explicit, stable version boundary for future non-breaking evolution.
- Simple for clients and documentation.

**Long-term impact**
- Easier controlled changes when introducing branch/staff capabilities.

### 4) Decision: UTC storage + branch-timezone reporting conversion
**Justification**
- Prevents cross-timezone reporting errors and daylight-saving edge cases.

**Long-term impact**
- Correct daily/weekly aggregates as branches are added.

### 5) Decision: JWT auth with RBAC and strict input validation
**Justification**
- Stateless and cost-effective for small deployment.
- Strong baseline security with bcrypt/argon2 + validation + rate limits.

**Long-term impact**
- Minimal auth complexity now, safe extension to staff roles later.

### 6) Decision: Start with no cache layer
**Justification**
- Data volume and concurrency do not justify Redis/extra infra initially.
- Avoids stale-data and invalidation complexity.

**Long-term impact**
- Lower operational risk and cost; add cache only after measured bottlenecks.

### 7) Decision: Real-time reporting queries first, pre-aggregations later only if needed
**Justification**
- Query volume is low; indexed SQL is sufficient.
- Avoid premature ETL/materialized-view complexity.

**Long-term impact**
- Maintains simplicity while preserving an upgrade path to summary tables.

### 8) Decision: Structured JSON logging + provider monitoring/alerts + PITR backups
**Justification**
- Meets 99% uptime and durability targets with minimal operational overhead.

**Long-term impact**
- Strong incident visibility and recoverability without dedicated SRE team.

## Revised Decisions (Necessary Corrections)

### A) Problem identified: API/docs mismatch for sales listing
- Implementation plan references `GET /sales` (history page), but API design omits it.

**Recommended correction**
- Add `GET /sales` to v1 with pagination and filters:
  - `from`, `to`, `branch_id`, `status`, `page`, `page_size`.
  - Default sort: `sale_timestamp DESC`.

**Technical reasoning**
- Required by `Sales History` UI.
- Prevents anti-pattern of loading reports endpoint for transactional listing.

### B) Problem identified: Receipt generation timing ambiguity in `POST /sales`
- API currently states sale creation “generates receipt” while receipt strategy says on-demand generation is Phase 1.

**Recommended correction**
- Finalize behavior:
  - `POST /sales` persists sale atomically and returns `sale_id` + `receipt_number` immediately.
  - Receipt PDF in Phase 1 is generated on `GET /sales/{id}/receipt` (sync request/response).
  - Optional email send is non-blocking best-effort after commit.

**Technical reasoning**
- Protects write latency target (<300ms) by removing heavy PDF work from critical path.
- Keeps financial commit independent from external services.

### C) Problem identified: Money precision risk not fully enforced at API boundary
- Schema uses DECIMAL, but request contracts use generic `number` without precision rules.

**Recommended correction**
- Define monetary contract precisely:
  - Input prices limited to max 2 decimal places.
  - Server canonicalizes and stores in DECIMAL(10,2).
  - All totals computed server-side only.

**Technical reasoning**
- Eliminates float drift and client-side tampering.

### D) Problem identified: Missing composite index plan for reporting/listing access paths
- Current index guidance is partial.

**Recommended correction**
- Add targeted indexes:
  - `sales(branch_id, sale_timestamp DESC)`
  - `sales(status, sale_timestamp DESC)`
  - `sale_items(sale_id)` (if not already)
  - Optional partial index: `sales(sale_timestamp DESC) WHERE status = 'COMPLETED'`

**Technical reasoning**
- Matches dominant predicates for daily/weekly reports and sales history.

### E) Problem identified: Module boundary for PDF/email not explicit in backend tree
- Shared service location exists, but ownership of orchestration is ambiguous.

**Recommended correction**
- Keep orchestration in `sales.service` and expose pure adapters in shared services:
  - `shared/services/pdf.service`
  - `shared/services/email.service`
- Business rules remain in domain modules; shared services remain infrastructure-only.

**Technical reasoning**
- Improves testability and separation of concerns.

### F) Problem identified: Migration execution strategy can risk startup race on deploy
- “Apply migrations before startup” is right direction but lacks deployment guardrails.

**Recommended correction**
- Use explicit release phase/job for migrations with rollback rule:
  - Expand-and-contract migration style.
  - Backward-compatible schema first, deploy app second, cleanup migration last.

**Technical reasoning**
- Prevents downtime and schema/app version mismatch.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Sale commit coupled to PDF/email causes >300ms latency | High | Keep commit path DB-only; move PDF/email post-commit and/or on-demand endpoint. |
| Monetary precision errors from client numeric payloads | High | Enforce decimal validation, server-side calculations only, DECIMAL storage. |
| Timezone/date boundary errors in reports | High | UTC storage + explicit branch timezone conversion in SQL queries/tests. |
| Missing listing/report indexes leading to slow queries | Medium | Add composite indexes aligned to filters/sort; verify via `EXPLAIN ANALYZE`. |
| JWT misuse (long TTL, weak secret handling) | Medium | Short access token TTL, strong secret management, rotation policy. |
| Migration-induced deployment failure | Medium | Release-phase migrations, backward-compatible changes, restore-tested backups. |
| Vendor outage/email provider failure | Low | Non-blocking email, retry with capped attempts, fail-safe sale persistence. |

## Architecture Integrity Score (1–10)

**Score: 8.7 / 10**

**Explanation**
- Strong foundation: correct macro-architecture, data model direction, security baseline, and growth path.
- Deductions are due to implementation ambiguities (receipt timing, missing `GET /sales`, index specificity, migration guardrails), all straightforward to correct without redesign.

## Final Technical Recommendations Before Coding Begins

1. Freeze v1 contracts with one API addendum:
   - Add `GET /sales` and finalize receipt lifecycle semantics.
2. Define strict “transaction boundary policy”:
   - Only DB writes inside sale transaction; no external I/O inside DB transaction.
3. Add index addendum to schema doc with exact composite indexes listed above.
4. Add monetary validation policy to API doc (2-decimal precision, server-side total authority).
5. Lock backend module contracts:
   - Domain modules own orchestration; shared services are adapter-only.
6. Establish migration operating standard:
   - Expand-contract pattern + mandatory restore drill before production launch.
7. Set production SLO checks before go-live:
   - `/sales` p95 latency, error budget alerts, and backup restore verification.

These corrections preserve the approved architecture while materially improving modularity, performance predictability, and operational safety for a solo-developer production launch.
