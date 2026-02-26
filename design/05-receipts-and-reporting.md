# Receipt Generation & Reporting Strategy

## Receipt Generation (PDF)

### Approach

- Use **HTML-to-PDF** conversion for fast development and high-fidelity layout.
- Stack example (Node.js):
  - Render an HTML receipt template (e.g., Handlebars/EJS) with sale data.
  - Use **Puppeteer** or **Playwright** to render HTML in a headless browser and export to PDF.
- Alternative: Use a pure PDF library (pdfkit) for environments where headless browser support is difficult.

### Receipt Template

- Contents:
  - Business name, logo, address, contact info.
  - Receipt number, date/time, branch.
  - Customer name/email (if provided).
  - Table of items (description, quantity, unit price, tax, line total).
  - Subtotal, tax, total, payment method (if tracked later).
  - Optional footer (thanks message, refund policy).

### Storage Strategy

- **Phase 1 (simple)**:
  - Generate PDF on demand when `/sales/{id}/receipt` is requested.
  - No persistent PDF storage; rely on DB data for regeneration.
- **Phase 2 (scaling/archival)**:
  - Generate and upload PDFs to object storage (e.g., S3/Blob Storage) when sale is created.
  - Save `pdf_url` in `receipts` table.
  - Serve PDF via temporary signed URLs for security.

### Emailing Receipts

- On sale creation, if `customer_email` is provided:
  - Generate PDF.
  - Attach or send as link via email provider (SendGrid/SES/Mailgun).
  - Log send status; failures do not block sale persistence.

## Reporting & Aggregation Strategy

### Daily Summary

- Query example (conceptual):
  - Filter `sales` by `sale_timestamp` between start and end of the given day (per branch timezone) and `status = COMPLETED`.
  - Aggregate:
    - `SUM(total_amount)` as total_revenue.
    - `SUM(tax_amount)` as total_tax.
    - `COUNT(*)` as number_of_sales.
    - `AVG(total_amount)` as average_sale_value.
- All operations performed in real time; data volume (< 10K tx/month) is small.

### Weekly Summary

- Compute over 7-day windows:
  - `SUM(total_amount)` by day for trend charts.
  - Top items using `sale_items` joined to `sales`:
    - `GROUP BY description` (or `item_id`) and aggregate `SUM(quantity)` and `SUM(line_total)`.

### Performance Considerations

- Ensure indexes on `sale_timestamp`, `branch_id`, and `status` to keep queries fast.
- Use database-level time zone conversion to respect branch timezone.
- For larger data volumes in future:
  - Introduce **materialized views** or nightly batch jobs that pre-aggregate data into summary tables.
  - Example summary tables:
    - `daily_branch_summary(branch_id, date, total_revenue, total_tax, number_of_sales, created_at)`.

### Exporting Reports (PDF & CSV)

- **CSV**:
  - Build server-side from current query results.
  - Stream rows to the client with appropriate `Content-Type` and `Content-Disposition` headers.
- **PDF**:
  - Similar approach as receipts: HTML template → HTML-to-PDF engine.
  - Include charts as static images (generated via chart library or frontend screenshot) or simple tabular summaries for simplicity.
