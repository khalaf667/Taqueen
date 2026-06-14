# Taqueen - SaaS Restaurant Management System

This is a comprehensive guide to get Taqueen up and running locally.

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 12+ (for local development)
- Redis (optional, for local development)

## 🚀 Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/khalaf667/Taqueen.git
cd Taqueen

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

### Option 2: Manual Setup (Local Development)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=taqueen_db
# DB_USER=taqueen_user
# DB_PASSWORD=your_password

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:5000/api/v1
# VITE_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

## 🔐 Default Credentials

```
Email: admin@taqueen.local
Password: Taqueen@123
Role: SUPER_ADMIN
```

## 📚 Application URLs

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🏗️ Project Structure

```
Taqueen/
├── backend/
│   ├── src/
│   │   ├── modules/          # Business logic modules
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # API routes
│   │   ├── config/            # Configuration files
│   │   ├── utils/             # Utility functions
│   │   ├── sockets/           # WebSocket handlers
│   │   └── server.js          # Entry point
│   ├── database/
│   │   ├── schema.sql         # Database schema
│   │   └── seed.sql           # Sample data
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API & Socket services
│   │   ├── stores/            # Zustand state management
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml         # Development stack
├── docker-compose.prod.yml    # Production stack
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id` - Update order
- `PUT /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id` - Delete order

### Menu
- `POST /api/v1/menu/categories` - Create category
- `GET /api/v1/menu/categories` - List categories
- `POST /api/v1/menu/items` - Create menu item
- `GET /api/v1/menu/items` - List menu items

### Tables
- `POST /api/v1/tables` - Create table
- `GET /api/v1/tables` - List tables
- `PUT /api/v1/tables/:id/status` - Update table status

### Inventory
- `POST /api/v1/inventory/ingredients` - Add ingredient
- `GET /api/v1/inventory/ingredients` - List ingredients
- `POST /api/v1/inventory/movements` - Record stock movement

### Dashboard
- `GET /api/v1/dashboard/overview` - Dashboard overview
- `GET /api/v1/dashboard/sales` - Sales data
- `GET /api/v1/dashboard/top-items` - Top selling items
- `GET /api/v1/dashboard/inventory-report` - Inventory report

## 🎨 Frontend Pages

1. **Login Page** - User authentication
2. **POS System** - Point of Sale interface
3. **Kitchen Display System (KDS)** - Kitchen order management
4. **Dashboard** - Analytics and overview
5. **Menu Management** - Manage menu items and categories
6. **Table Management** - Manage floor plan
7. **Inventory** - Stock management
8. **Staff Management** - Employee management

## 🔄 WebSocket Events

### Client → Server
- `join_branch` - Join branch room
- `order:created` - Notify order creation
- `order:status_changed` - Notify order status change
- `table:status_changed` - Notify table status change

### Server → Client
- `order:new` - New order notification
- `order:updated` - Order updated notification
- `table:updated` - Table updated notification
- `inventory:alert` - Low stock alert
- `dashboard:update` - Dashboard metrics updated

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Reset database
docker-compose down -v
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Using Production Docker Compose

```bash
# Create .env file with production values
cp .env.example .env

# Edit .env with production credentials
vim .env

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

```
NODE_ENV=production
DB_HOST=postgres
DB_NAME=taqueen_db
DB_USER=prod_user
DB_PASSWORD=strong_password
JWT_SECRET=your_production_secret
REDIS_PASSWORD=redis_password
BACKEND_URL=https://api.taqueen.io
FRONTEND_URL=https://taqueen.io
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/khalaf667/Taqueen/issues
- Email: support@taqueen.io

---

**Made with ❤️ for restaurants worldwide**
