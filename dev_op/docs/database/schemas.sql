-- FrostByte Logistics Database Schema SQL
-- This file contains the SQL schema definitions

-- Table: Locations (Warehouses)
CREATE TABLE IF NOT EXISTS Locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location_type VARCHAR(50) NOT NULL,
    cold_storage_capacity INTEGER DEFAULT 0,
    current_storage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Products
CREATE TABLE IF NOT EXISTS Products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    temperature_requirement VARCHAR(50) NOT NULL,
    min_temperature DECIMAL(5, 2),
    max_temperature DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Routes
CREATE TABLE IF NOT EXISTS Routes (
    route_id SERIAL PRIMARY KEY,
    from_location_id INTEGER NOT NULL,
    to_location_id INTEGER NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_capacity INTEGER DEFAULT 0,
    temperature_capability VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_location_id) REFERENCES Locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY (to_location_id) REFERENCES Locations(location_id) ON DELETE CASCADE
);

-- Table: Commitments (Delivery Plans)
CREATE TABLE IF NOT EXISTS Commitments (
    commitment_id SERIAL PRIMARY KEY,
    from_location_id INTEGER NOT NULL,
    to_location_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_location_id) REFERENCES Locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY (to_location_id) REFERENCES Locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_location_type ON Locations(location_type);
CREATE INDEX IF NOT EXISTS idx_route_from ON Routes(from_location_id);
CREATE INDEX IF NOT EXISTS idx_route_to ON Routes(to_location_id);
CREATE INDEX IF NOT EXISTS idx_commitment_status ON Commitments(status);
CREATE INDEX IF NOT EXISTS idx_commitment_from ON Commitments(from_location_id);
CREATE INDEX IF NOT EXISTS idx_commitment_to ON Commitments(to_location_id);
