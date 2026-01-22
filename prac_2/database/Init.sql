-- Coffee Shop Database Initialization Script
-- This script creates the necessary tables for the coffee shop system

-- Table: Coffees
-- Stores information about available coffee products
CREATE TABLE IF NOT EXISTS Coffees (
    coffee_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Members
-- Stores information about loyalty program members
CREATE TABLE IF NOT EXISTS Members (
    member_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: LoyaltyTransactions
-- Stores loyalty point transactions (earned/spent)
CREATE TABLE IF NOT EXISTS LoyaltyTransactions (
    transaction_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    coffee_id INTEGER,
    points_change INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'earned' or 'spent'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (coffee_id) REFERENCES Coffees(coffee_id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_member_email ON Members(email);
CREATE INDEX IF NOT EXISTS idx_transaction_member ON LoyaltyTransactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transaction_coffee ON LoyaltyTransactions(coffee_id);
CREATE INDEX IF NOT EXISTS idx_transaction_date ON LoyaltyTransactions(created_at);
