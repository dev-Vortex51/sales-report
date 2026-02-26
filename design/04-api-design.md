# API Endpoint Definitions (REST Contracts)

Base URL: `/api/v1`
Authentication: JWT in `Authorization: Bearer <token>` header.

## Auth

### POST `/auth/login`

- **Description**: Authenticate owner and issue JWT.
- **Request (JSON)**:
  - `email`: string
  - `password`: string
- **Response 200 (JSON)**:
  - `token`: string (JWT)
  - `user`: { `id`, `email`, `name`, `role` }
- **Errors**: 400 (validation), 401 (invalid credentials).

## Sales

### POST `/sales`

- **Description**: Create a new sale and generate a receipt.
- **Auth**: Required.
- **Request (JSON)**:
  - `branch_id`: string (optional now, required when multi-branch is used; default branch if omitted)
  - `items`: Array of:
    - `item_id`: string (optional; for catalog item)
    - `description`: string (required if no `item_id`)
    - `quantity`: integer
    - `unit_price`: number
    - `tax_rate`: number (percentage, e.g., 20.0)
  - `customer_name`: string (optional)
  - `customer_email`: string (optional)
  - `currency`: string (e.g., `GBP`)
- **Server behavior**:
  - Validate and compute per-line totals, sale totals, and tax.
  - Persist `sales` and `sale_items` records in a transaction.
  - Generate receipt (PDF) and store reference.
  - Optionally send email with receipt to `customer_email` if provided.
- **Response 201 (JSON)**:
  - `sale_id`: string
  - `receipt_number`: string
  - `total_amount`: number
  - `tax_amount`: number
  - `created_at`: timestamp
  - `receipt_pdf_url`: string (direct or signed URL, optional)

### GET `/sales/{id}`

- **Description**: Fetch detailed sale with line items.
- **Auth**: Required.
- **Response 200 (JSON)**:
  - `id`, `receipt_number`, `branch_id`, `user_id`, `sale_timestamp`, `customer_name`, `customer_email`, `total_before_tax`, `tax_amount`, `total_amount`, `status`
  - `items`: line item array.

### GET `/sales/{id}/receipt`

- **Description**: Get receipt PDF (inline or download).
- **Auth**: Required.
- **Response 200**:
  - `Content-Type: application/pdf`
  - PDF binary stream.

## Dashboards & Reporting

### GET `/reports/daily-summary`

- **Description**: Daily sales dashboard metrics.
- **Auth**: Required.
- **Query params**:
  - `date`: ISO date (e.g., `2026-02-25`); default = today (branch timezone).
  - `branch_id`: optional.
- **Response 200 (JSON)**:
  - `date`: string
  - `branch_id`: string
  - `total_revenue`: number
  - `total_tax`: number
  - `number_of_sales`: integer
  - `average_sale_value`: number

### GET `/reports/weekly-summary`

- **Description**: Weekly aggregated sales reports.
- **Auth**: Required.
- **Query params**:
  - `week_start`: ISO date representing start of week.
  - `branch_id`: optional.
- **Response 200 (JSON)**:
  - `week_start`: string
  - `week_end`: string
  - `branch_id`: string
  - `total_revenue`: number
  - `total_tax`: number
  - `number_of_sales`: integer
  - `daily_breakdown`: Array of { `date`, `total_revenue`, `number_of_sales` }
  - `top_items`: Array of { `item_description`, `quantity_sold`, `revenue` }

### GET `/reports/weekly-summary/export`

- **Description**: Export weekly summary as PDF or CSV.
- **Auth**: Required.
- **Query params**:
  - `week_start`: ISO date
  - `branch_id`: optional
  - `format`: `pdf` or `csv`
- **Response 200**:
  - For `pdf`: `Content-Type: application/pdf`
  - For `csv`: `Content-Type: text/csv`

## Settings & Admin

### GET `/settings`

- **Description**: Get business settings.
- **Auth**: Required (owner-only).

### PUT `/settings`

- **Description**: Update business settings (name, address, default tax rate, logo, etc.).
- **Auth**: Required (owner-only).

### POST `/branches`

- **Description**: Create a new branch (for expansion phase).
- **Auth**: Required (owner-only).

### GET `/branches`

- **Description**: List branches.
- **Auth**: Required.
