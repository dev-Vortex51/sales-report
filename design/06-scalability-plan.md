# Scalability Plan (Future Multi-Branch Support)

## Current Scale Assumptions
- < 10,000 transactions per month.
- Single owner, single branch initially.
- Low concurrency (few simultaneous users).

## Application Scalability

### Horizontal Scaling of App Tier
- Backend is stateless; any instance can serve any request.
- Use cloud auto-scaling rules based on CPU, memory, or request latency.
- For higher traffic:
  - Scale from 1 → N instances behind the load balancer.

### Database Scaling
- Initial phase: Single managed SQL instance with read/write.
- As read volume grows:
  - Add read replicas for reporting-heavy workloads.
  - Offload long-running analytical queries to a read replica.
- If data volume becomes very large (millions of rows):
  - Partition `sales` by date and/or branch_id.
  - Consider moving historical data to a data warehouse (e.g., BigQuery/Redshift/Snowflake), while keeping recent data in OLTP DB.

### Multi-Branch Support
- The schema already includes `branches` and `branch_id` on `sales`, `items`.
- UI changes:
  - Branch selector for owner at login or in header.
  - Filter dashboard and reports by branch.
- API changes:
  - Enforce `branch_id` on creation and reporting queries.
  - Owner can manage multiple branches; later, branch managers could be scoped to one branch.

### Multi-Tenancy (If Expanded to Many Businesses)
- Current model: Single tenant (one business) per deployment.
- Future options:
  1. **Single-tenant per deployment** (simplest, but more ops overhead).
  2. **Single database with tenant_id** per business and per branch (logically isolated rows).
  3. **Database-per-tenant** for stronger isolation if system grows into a SaaS.
- For a sole business owner now, option 1 is sufficient and cheapest.

## Performance Optimization Path
- Start with indexes and normalized schema.
- Add caching (e.g., in-memory cache or Redis) only if profiling shows hotspots, such as frequently repeated read-only summaries.
- Use pagination for sales history views.

## High Availability
- Use cloud provider’s availability zone redundancy for DB and app instances where available.
- Health checks on app endpoints; auto-restart unhealthy instances.
