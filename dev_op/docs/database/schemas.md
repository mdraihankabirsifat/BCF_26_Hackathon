# Database Schema Documentation

This document describes the database schema for the FrostByte Logistics Route Validation System.

## Overview

The database consists of four main tables: `Locations`, `Products`, `Routes`, and `Commitments`. These tables work together to manage logistics data and validate delivery feasibility.

---

## Table: Locations

Stores information about warehouses, hospitals, retailers, and other locations in the logistics network.

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `location_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each location |
| `name` | VARCHAR(255) | NOT NULL | Name of the location |
| `location_type` | VARCHAR(50) | NOT NULL | Type of location: 'warehouse', 'hospital', 'retailer', 'distributor' |
| `cold_storage_capacity` | INTEGER | DEFAULT 0 | Maximum cold storage capacity |
| `current_storage` | INTEGER | DEFAULT 0 | Current storage usage |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the record was created |

### Primary Key
- `location_id` (SERIAL)

### Foreign Keys
- None (this is a standalone table)

### Indexes
- `idx_location_type` on `location_type` (for faster type-based queries)

---

## Table: Products

Stores information about temperature-sensitive products that need to be transported.

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `product_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each product |
| `name` | VARCHAR(255) | NOT NULL | Name of the product |
| `temperature_requirement` | VARCHAR(50) | NOT NULL | Temperature category: 'frozen', 'refrigerated', 'cold', 'ambient' |
| `min_temperature` | DECIMAL(5, 2) | NULL | Minimum temperature in Celsius |
| `max_temperature` | DECIMAL(5, 2) | NULL | Maximum temperature in Celsius |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the record was created |

### Primary Key
- `product_id` (SERIAL)

### Foreign Keys
- None (this is a standalone table)

---

## Table: Routes

Stores information about transportation routes between locations with capacity and temperature constraints.

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `route_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each route |
| `from_location_id` | INTEGER | NOT NULL, FOREIGN KEY | Source location |
| `to_location_id` | INTEGER | NOT NULL, FOREIGN KEY | Destination location |
| `max_capacity` | INTEGER | NOT NULL | Maximum capacity of the route |
| `current_capacity` | INTEGER | DEFAULT 0 | Current capacity usage |
| `temperature_capability` | VARCHAR(50) | NOT NULL | Temperature capability: 'frozen', 'refrigerated', 'cold', 'ambient' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the record was created |

### Primary Key
- `route_id` (SERIAL)

### Foreign Keys
- `from_location_id` → `Locations(location_id)` (ON DELETE CASCADE)
- `to_location_id` → `Locations(location_id)` (ON DELETE CASCADE)

### Indexes
- `idx_route_from` on `from_location_id` (for faster source location queries)
- `idx_route_to` on `to_location_id` (for faster destination location queries)

---

## Table: Commitments

Stores delivery commitments/plans that need to be validated before execution.

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `commitment_id` | SERIAL (INTEGER) | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each commitment |
| `from_location_id` | INTEGER | NOT NULL, FOREIGN KEY | Source location for delivery |
| `to_location_id` | INTEGER | NOT NULL, FOREIGN KEY | Destination location for delivery |
| `product_id` | INTEGER | NOT NULL, FOREIGN KEY | Product to be delivered |
| `quantity` | INTEGER | NOT NULL | Quantity of products to deliver |
| `priority` | VARCHAR(20) | DEFAULT 'normal' | Priority level: 'high', 'normal', 'low' |
| `status` | VARCHAR(20) | DEFAULT 'pending' | Status: 'pending', 'validated', 'rejected', 'fulfilled' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the commitment was created |

### Primary Key
- `commitment_id` (SERIAL)

### Foreign Keys
- `from_location_id` → `Locations(location_id)` (ON DELETE CASCADE)
- `to_location_id` → `Locations(location_id)` (ON DELETE CASCADE)
- `product_id` → `Products(product_id)` (ON DELETE CASCADE)

### Indexes
- `idx_commitment_status` on `status` (for faster status-based queries)
- `idx_commitment_from` on `from_location_id` (for faster source queries)
- `idx_commitment_to` on `to_location_id` (for faster destination queries)

---

## Relationships

1. **Locations ↔ Routes**: One-to-Many
   - One location can be the source of many routes
   - One location can be the destination of many routes

2. **Locations ↔ Commitments**: One-to-Many
   - One location can be the source of many commitments
   - One location can be the destination of many commitments

3. **Products ↔ Commitments**: One-to-Many
   - One product can be part of many commitments

4. **Routes ↔ Commitments**: Indirect relationship
   - Routes connect locations, commitments specify deliveries between locations

---

## Notes

- All tables use `SERIAL` type for auto-incrementing primary keys (PostgreSQL)
- Timestamps are automatically set using `CURRENT_TIMESTAMP`
- Temperature compatibility is validated by comparing `Products.temperature_requirement` with `Routes.temperature_capability`
- Capacity constraints are validated by checking `Routes.current_capacity + quantity <= Routes.max_capacity`
- Storage constraints are validated by checking `Locations.current_storage + quantity <= Locations.cold_storage_capacity`
