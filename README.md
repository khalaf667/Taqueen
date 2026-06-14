# Taqueen - SaaS Restaurant Management System

## Overview

**Taqueen** is a complete production-ready, multi-tenant SaaS platform designed for restaurants and cafes to manage their operations efficiently. It combines a modern Point of Sale (POS) system, Kitchen Display System (KDS), inventory management, and real-time analytics.

## 🎯 Key Features

### Core Modules
1. **POS System** - Fast, touch-friendly ordering interface
2. **Kitchen Display System (KDS)** - Real-time kitchen order management
3. **Table & Floor Management** - Visual floor plans and table management
4. **Inventory Management** - Stock tracking and automatic deduction
5. **Menu Management** - Dynamic menu with categories and modifiers
6. **Staff & Roles Management** - RBAC with JWT authentication
7. **Orders & Billing System** - Complete order lifecycle management
8. **Analytics Dashboard** - Real-time business insights

## 🏗️ Architecture

- **Multi-tenant**: Each company can manage multiple branches
- **Real-time Sync**: WebSocket-based instant updates
- **Modular Backend**: Service-oriented architecture
- **Scalable**: Docker-ready with microservice support
- **Security**: JWT, role-based access control, data encryption

## 🔧 Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React + Next.js (or Vite)
- **Database**: PostgreSQL
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Deployment**: Docker + Docker Compose

## 📁 Project Structure

```
Taqueen/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── sockets/         # WebSocket handlers
│   │   ├── services/        # Business logic
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # Database models
│   │   ├── config/          # Configuration
│   │   ├── utils/           # Utilities
│   │   └── server.js        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/                # React application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   ├── sockets/         # WebSocket client
│   │   ├── stores/          # State management
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilities
│   │   ├── styles/          # Global styles
│   │   └── App.jsx          # Main app
│   ├── package.json
│   └── Dockerfile
├── database/                # Database setup
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docker-compose.yml       # Docker orchestration
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Docker & Docker Compose

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/khalaf667/Taqueen.git
cd Taqueen

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start the entire stack
docker-compose up -d
```

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure .env with backend URL
npm run dev
```

## 📊 Default Credentials

**Demo Account:**
- Email: `admin@taqueen.local`
- Password: `Taqueen@123`
- Role: Super Admin

**Test Company:**
- Name: Taqueen Demo
- Branches: 2 (Main Branch, Downtown)

## 🔐 User Roles

1. **Super Admin** - System-wide access
2. **Company Admin** - Company and branch management
3. **Branch Manager** - Branch operations
4. **Cashier** - POS operations
5. **Chef** - Kitchen Display System
6. **Waiter** - Floor management and order taking
7. **Inventory Manager** - Stock management

## 📡 Real-time Events

All WebSocket events are emitted in real-time:

- `order:created` - New order created
- `order:updated` - Order status changed
- `order:completed` - Order ready
- `table:status_changed` - Table status update
- `inventory:stock_low` - Low stock alert
- `analytics:updated` - Dashboard metrics updated

## 📚 API Documentation

Visit `/api/docs` for Swagger API documentation (when running).

## 🗄️ Database Schema

See `database/schema.sql` for complete database structure.

## 🐳 Docker Support

```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📝 Environment Variables

See `.env.example` for all configuration options.

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

### Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please follow our coding standards and submit PRs to the `develop` branch.

## 📄 License

MIT License - See LICENSE file for details.

## 👥 Support

For issues and questions, please create an issue on GitHub.

## 📞 Contact

- Website: https://taqueen.io
- Email: support@taqueen.io

---

**Made with ❤️ for restaurants worldwide**
