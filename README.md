# Coffee Shop Hackathon Project

A full-stack coffee shop management system built for a hackathon, featuring a Node.js Express backend with PostgreSQL database, fully containerized with Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Docker Setup](#docker-setup)
- [Development](#development)

## 🎯 Overview

This project is a coffee shop bonus point and discount system built for a hackathon. The system includes:
- **Backend**: Node.js Express server running on port 8000
- **Database**: PostgreSQL with automatic table initialization
- **Containerization**: Docker Compose for easy deployment
- **Features**: 
  - Coffee product management
  - Member loyalty program
  - Bonus point calculation (1 point per 50 taka spent)
  - Discount calculation (1 point = 1 taka off)
  - Transaction tracking

## 📁 Project Structure

```
prac_2/
├── database/
│   └── Init.sql              # Database initialization script
├── docs/
│   └── database/
│       └── schemas.md        # Database schema documentation
├── server/
│   ├── Dockerfile            # Node.js container configuration
│   ├── package.json          # Node.js dependencies
│   └── server.js             # Express server application
├── docker-compose.yaml       # Docker Compose configuration
└── README.md                 # This file
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

To verify your installation:
```bash
docker --version
docker-compose --version
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prac_2
```

### 2. Build and Start Services

Build and start both the database and server containers:

```bash
docker compose up --build -d
```

**Note**: The evaluation will test your submission using exactly these two commands:
- `git clone <repository-url>`
- `docker compose up --build -d`

This command will:
- Build the PostgreSQL database container
- Build the Node.js server container
- Initialize the database with tables from `Init.sql`
- Start both services

### 3. Verify the Setup

Once the containers are running, you should see:
- Database connection confirmation: `✅ Connected to PostgreSQL database`
- Server startup message: `🚀 Coffee Shop Server is running on http://0.0.0.0:8000`

### 4. Test the Health Endpoint

Open a new terminal and test the server:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Coffee Shop Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 📡 API Endpoints

### Health Check

**GET** `/health`

Returns the server health status.

**Response:**
```json
{
  "status": "ok",
  "message": "Coffee Shop Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Coffee Management

#### GET `/coffees`

Get all coffee products.

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "coffee_id": 1,
      "name": "Espresso",
      "description": "Strong Italian coffee",
      "price": "3.50",
      "category": "Hot",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### GET `/coffees/:id`

Get a specific coffee by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "coffee_id": 1,
    "name": "Espresso",
    "price": "3.50",
    "category": "Hot"
  }
}
```

#### POST `/coffees`

Create a new coffee product.

**Request Body:**
```json
{
  "name": "Espresso",
  "description": "Strong Italian coffee",
  "price": 3.50,
  "category": "Hot"
}
```

**Required Fields:**
- `name` (string): Name of the coffee product
- `price` (number): Price of the coffee (must be non-negative)

**Optional Fields:**
- `description` (string): Description of the coffee
- `category` (string): Category of the coffee

**Response (201):**
```json
{
  "success": true,
  "message": "Coffee created successfully",
  "data": {
    "coffee_id": 1,
    "name": "Espresso",
    "price": "3.50",
    "category": "Hot"
  }
}
```

#### PUT `/coffees/:id`

Update a coffee product. All fields are optional - only provided fields will be updated.

**Request Body:**
```json
{
  "name": "Updated Espresso",
  "price": 4.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Coffee updated successfully",
  "data": {
    "coffee_id": 1,
    "name": "Updated Espresso",
    "price": "4.00"
  }
}
```

#### DELETE `/coffees/:id`

Delete a coffee product.

**Response (200):**
```json
{
  "success": true,
  "message": "Coffee deleted successfully",
  "data": { ... }
}
```

---

### Member Management

#### GET `/members`

Get all registered members.

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "member_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "loyalty_points": 5,
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### GET `/members/:id`

Get a specific member by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "member_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "loyalty_points": 5
  }
}
```

#### POST `/members`

Register a new member.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

**Required Fields:**
- `name` (string): Full name of the member
- `email` (string): Email address (must be unique)

**Optional Fields:**
- `phone` (string): Phone number

**Response (201):**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "member_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "loyalty_points": 0
  }
}
```

---

### Purchase & Bonus Points

#### POST `/purchases`

Process a purchase and calculate bonus points. **Business Rule: 1 point per 50 taka spent**

**Request Body:**
```json
{
  "member_id": 1,
  "coffee_id": 1,
  "quantity": 2
}
```

**Required Fields:**
- `member_id` (integer): ID of the member making the purchase
- `coffee_id` (integer): ID of the coffee being purchased
- `quantity` (integer, default: 1): Quantity of coffee items

**Response (201):**
```json
{
  "success": true,
  "message": "Purchase processed successfully",
  "data": {
    "purchase": {
      "member_id": 1,
      "coffee_id": 1,
      "coffee_name": "Espresso",
      "quantity": 2,
      "unit_price": 3.50,
      "total_amount": 7.00
    },
    "bonus_points": {
      "earned": 0,
      "previous_balance": 5,
      "new_balance": 5
    },
    "transaction": {
      "transaction_id": 1,
      "points_change": 0,
      "transaction_type": "earned"
    }
  }
}
```

**Note:** Points are calculated as `Math.floor(total_amount / 50)`. For example:
- 50 taka = 1 point
- 100 taka = 2 points
- 149 taka = 2 points (floor division)

---

### Discount Redemption

#### POST `/redeem`

Redeem loyalty points for discount. **Business Rule: 1 point = 1 taka discount**

**Request Body:**
```json
{
  "member_id": 1,
  "points_to_redeem": 5,
  "purchase_amount": 20.00
}
```

**Required Fields:**
- `member_id` (integer): ID of the member redeeming points
- `points_to_redeem` (integer): Number of points to redeem
- `purchase_amount` (number): Original purchase amount before discount

**Response (200):**
```json
{
  "success": true,
  "message": "Points redeemed successfully",
  "data": {
    "redemption": {
      "points_redeemed": 5,
      "discount_amount": 5,
      "original_amount": 20.00,
      "final_amount": 15.00
    },
    "points": {
      "previous_balance": 10,
      "redeemed": 5,
      "new_balance": 5
    },
    "transaction": {
      "transaction_id": 2,
      "points_change": -5,
      "transaction_type": "spent"
    }
  }
}
```

**Error Response (400) - Insufficient Points:**
```json
{
  "error": "Insufficient points",
  "message": "Member has 3 points, but trying to redeem 5 points"
}
```

---

### Transaction History

#### GET `/members/:id/transactions`

Get transaction history for a specific member.

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "transaction_id": 1,
      "member_id": 1,
      "coffee_id": 1,
      "coffee_name": "Espresso",
      "points_change": 2,
      "transaction_type": "earned",
      "description": "Purchase: 2x Espresso (100.00 taka)",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## 🗄️ Database Schema

The database consists of three main tables:

1. **Coffees**: Stores coffee product information
2. **Members**: Stores loyalty program member data
3. **LoyaltyTransactions**: Tracks loyalty point transactions

For detailed schema documentation, see [`docs/database/schemas.md`](docs/database/schemas.md).

### Quick Schema Overview

**Coffees Table:**
- `coffee_id` (Primary Key)
- `name`, `description`, `price`, `category`
- `created_at`

**Members Table:**
- `member_id` (Primary Key)
- `name`, `email` (Unique), `phone`
- `loyalty_points`
- `created_at`

**LoyaltyTransactions Table:**
- `transaction_id` (Primary Key)
- `member_id` (Foreign Key → Members)
- `coffee_id` (Foreign Key → Coffees, nullable)
- `points_change`, `transaction_type`, `description`
- `created_at`

## 🐳 Docker Setup

### Services

The `docker-compose.yaml` file defines two services:

1. **db** (PostgreSQL)
   - Image: `postgres:15-alpine`
   - Port: `5432`
   - Database: `coffeeshop`
   - Auto-initializes tables from `database/Init.sql`

2. **server** (Node.js Express)
   - Port: `8000`
   - Depends on `db` service
   - Automatically connects to the database

### Environment Variables

Default database credentials (configured in `docker-compose.yaml`):
- **Host**: `db`
- **Port**: `5432`
- **Database**: `coffeeshop`
- **User**: `postgres`
- **Password**: `postgres`

### Useful Docker Commands

**Stop services:**
```bash
docker compose down
```

**Stop and remove volumes (clean database):**
```bash
docker compose down -v
```

**View logs:**
```bash
docker compose logs -f
```

**View server logs only:**
```bash
docker compose logs -f server
```

**View database logs only:**
```bash
docker compose logs -f db
```

**Rebuild after code changes:**
```bash
docker compose up --build -d
```

## 💻 Development

### Running Locally (Without Docker)

If you prefer to run the server locally:

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up PostgreSQL locally:**
   - Create a database named `coffeeshop`
   - Run `database/Init.sql` to create tables

3. **Update connection settings in `server.js`** if needed

4. **Run the server:**
   ```bash
   npm start
   ```

### Making Changes

1. Edit files in the `server/` directory
2. Rebuild the container:
   ```bash
   docker compose up --build -d
   ```

## 📝 Notes

- The server runs on **port 8000** as required for functional testing
- Database tables are automatically initialized when the database container starts (empty tables only, no seed data)
- The server waits for the database to be healthy before starting
- All database credentials are configured in `docker-compose.yaml` (no `.env` files as per requirements)
- No authentication or authorization is implemented (as per test requirements)
- The system supports:
  - **Bonus Points**: Members earn 1 point for every 50 taka spent
  - **Discounts**: 1 point can be redeemed for 1 taka discount

## 🐛 Troubleshooting

**Port already in use:**
- Ensure port 8000 and 5432 are not in use by other applications
- Change ports in `docker-compose.yaml` if needed

**Database connection errors:**
- Wait for the database to fully initialize (check logs)
- Verify the database container is running: `docker compose ps`

**Container build failures:**
- Ensure Docker is running
- Try: `docker compose down` then `docker compose up --build -d`

## 🎯 Hackathon Requirements

This project is built for the **"Can't Spill the Beans"** hackathon challenge, which requires:

- ✅ Reliable bonus point accumulation system
- ✅ Accurate discount calculation
- ✅ Database design with proper normalization
- ✅ Full API implementation
- ✅ Docker containerization
- ✅ Automatic database initialization
- ✅ Server running on port 8000
- ✅ No authentication (for testing simplicity)

## 📄 License

This project is created for hackathon purposes.

---

**Built by BUET CSE Student** 🎓
