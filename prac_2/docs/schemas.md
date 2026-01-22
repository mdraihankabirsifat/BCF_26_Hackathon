# Database Schema Documentation

This document describes the database schema for the Coffee Shop Hackathon system.

## Overview

The database consists of three main tables: `Coffees`, `Members`, and `LoyaltyTransactions`. These tables work together to manage coffee products, customer memberships, and loyalty point transactions.

---

## Table: Coffees

Stores information about available coffee products in the shop.

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `coffee_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each coffee product |
| `name` | VARCHAR(255) | NOT NULL | Name of the coffee product |
| `description` | TEXT | NULL | Detailed description of the coffee |
| `price` | DECIMAL(10, 2) | NOT NULL | Price of the coffee in decimal format |
| `category` | VARCHAR(100) | NULL | Category of coffee (e.g., "Espresso", "Latte", "Cold Brew") |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the record was created |

### Primary Key
- `coffee_id` (SERIAL)

### Foreign Keys
- None (this is a standalone table)

---

## Table: Members

Stores information about loyalty program members (customers).

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `member_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each member |
| `name` | VARCHAR(255) | NOT NULL | Full name of the member |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email address of the member (must be unique) |
| `phone` | VARCHAR(20) | NULL | Phone number of the member |
| `loyalty_points` | INTEGER | DEFAULT 0 | Current balance of loyalty points |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the member was registered |

### Primary Key
- `member_id` (SERIAL)

### Foreign Keys
- None (this is a standalone table)

### Indexes
- `idx_member_email` on `email` (for faster email lookups)

---

## Table: LoyaltyTransactions

Stores all loyalty point transactions (points earned or spent by members).

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `transaction_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each transaction |
| `member_id` | INTEGER | NOT NULL, FOREIGN KEY | Reference to the member who made the transaction |
| `coffee_id` | INTEGER | NULL, FOREIGN KEY | Reference to the coffee product (if transaction is related to a purchase) |
| `points_change` | INTEGER | NOT NULL | Amount of points added (positive) or deducted (negative) |
| `transaction_type` | VARCHAR(50) | NOT NULL | Type of transaction: 'earned' or 'spent' |
| `description` | TEXT | NULL | Additional description or notes about the transaction |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the transaction occurred |

### Primary Key
- `transaction_id` (SERIAL)

### Foreign Keys
- `member_id` → `Members(member_id)` (ON DELETE CASCADE)
  - When a member is deleted, all their transactions are also deleted
- `coffee_id` → `Coffees(coffee_id)` (ON DELETE SET NULL)
  - When a coffee is deleted, the transaction reference is set to NULL (transaction history is preserved)

### Indexes
- `idx_transaction_member` on `member_id` (for faster member transaction queries)
- `idx_transaction_coffee` on `coffee_id` (for faster coffee-related transaction queries)
- `idx_transaction_date` on `created_at` (for faster date-based queries)

---

## Relationships

1. **Members ↔ LoyaltyTransactions**: One-to-Many
   - One member can have many loyalty transactions
   - Each transaction belongs to exactly one member

2. **Coffees ↔ LoyaltyTransactions**: One-to-Many (optional)
   - One coffee can be associated with many transactions
   - Each transaction can optionally reference one coffee (or none)

---

## Notes

- All tables use `SERIAL` type for auto-incrementing primary keys (PostgreSQL)
- Timestamps are automatically set using `CURRENT_TIMESTAMP`
- The `loyalty_points` field in `Members` table represents the current balance, which should be kept in sync with the sum of `points_change` in `LoyaltyTransactions`
- Email addresses must be unique across all members
- Foreign key constraints ensure referential integrity
