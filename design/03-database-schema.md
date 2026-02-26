# Database Schema Design

Relational schema using PostgreSQL (or MySQL). Designed for single business owner now, with multi-branch support later.

## Tables

### 1. `users`

- **Columns**:
  - `id` (PK, UUID)
  - `email` (VARCHAR, unique, indexed)
  - `password_hash` (VARCHAR)
  - `name` (VARCHAR)
  - `role` (ENUM: `OWNER`, `STAFF`, `ADMIN` – initially mainly `OWNER`)
  - `created_at` (TIMESTAMP, default now)
  - `updated_at` (TIMESTAMP)

### 2. `branches`

- **Purpose**: Support future multi-branch; for now a single default branch.
- **Columns**:
  - `id` (PK, UUID)
  - `name` (VARCHAR)
  - `address` (VARCHAR, nullable)
  - `timezone` (VARCHAR, e.g., `Europe/London`)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### 3. `items` (optional, if items are reusable/catalog-based)

- **Columns**:
  - `id` (PK, UUID)
  - `branch_id` (FK -> `branches.id`)
  - `name` (VARCHAR)
  - `sku` (VARCHAR, nullable, unique per branch)
  - `default_price` (DECIMAL(10,2))
  - `tax_rate` (DECIMAL(5,2), e.g., 20.00 for 20%)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### 4. `sales`

- **Purpose**: One record per sale/receipt.
- **Columns**:
  - `id` (PK, UUID)
  - `branch_id` (FK -> `branches.id`)
  - `user_id` (FK -> `users.id`, who recorded the sale)
  - `total_before_tax` (DECIMAL(10,2))
  - `tax_amount` (DECIMAL(10,2))
  - `total_amount` (DECIMAL(10,2))
  - `currency` (VARCHAR(3), e.g., `USD`, `GBP`)
  - `sale_timestamp` (TIMESTAMP with timezone)
  - `customer_name` (VARCHAR, nullable)
  - `customer_email` (VARCHAR, nullable, indexed for lookup)
  - `receipt_number` (VARCHAR, unique, indexed)
  - `status` (ENUM: `COMPLETED`, `REFUNDED`, `VOID`)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### 5. `sale_items`

- **Purpose**: Line items for each sale.
- **Columns**:
  - `id` (PK, UUID)
  - `sale_id` (FK -> `sales.id`, indexed)
  - `item_id` (FK -> `items.id`, nullable if ad-hoc item)
  - `description` (VARCHAR) – snapshot of item name at time of sale.
  - `quantity` (INT)
  - `unit_price` (DECIMAL(10,2))
  - `tax_rate` (DECIMAL(5,2))
  - `line_total_before_tax` (DECIMAL(10,2))
  - `tax_amount` (DECIMAL(10,2))
  - `line_total` (DECIMAL(10,2))

### 6. `receipts`

- **Purpose**: Track receipts and their storage.
- **Columns**:
  - `id` (PK, UUID)
  - `sale_id` (FK -> `sales.id`, unique)
  - `pdf_url` (VARCHAR) – URL or storage key; nullable if generated on-demand only.
  - `created_at` (TIMESTAMP)

### 7. `settings`

- **Purpose**: Store business-level settings.
- **Columns**:
  - `id` (PK, UUID)
  - `owner_user_id` (FK -> `users.id`)
  - `business_name` (VARCHAR)
  - `business_address` (TEXT)
  - `default_tax_rate` (DECIMAL(5,2))
  - `logo_url` (VARCHAR, nullable)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

## Relationships

- `users` 1—\* `sales` (one user can record many sales).
- `branches` 1—_ `sales` and 1—_ `items`.
- `sales` 1—\* `sale_items`.
- `sales` 1—1 `receipts`.

## Indexing Strategy

- Index `sales.sale_timestamp` and `sales.branch_id` for fast daily/weekly queries.
- Index `sale_items.item_id` for item-level reporting.
- Index `sales.customer_email` for customer lookup.

## Durability & Consistency

- Use ACID transactions when creating a sale: insert `sales`, `sale_items`, and `receipts` (if persisting) in a single transaction.
- Enable automated backups and point-in-time recovery at the DB level.
