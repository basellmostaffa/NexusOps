# NexusOps

NexusOps is a portfolio-quality full-stack SaaS admin dashboard for managing customers, products, orders, analytics, and business operations.

## Features

- JWT login, protected routes, logout, and current-user API
- Dashboard with revenue, customers, orders, products, charts, recent orders, and activity
- Customer management API and responsive table UI
- Product catalog with search, loading/error/empty states, and delete mutation
- Orders API with customer/product relationships and status changes
- Analytics overview endpoint
- Team, notifications, settings, and profile views
- Dark/light theme persisted in localStorage
- Responsive desktop sidebar and mobile navigation
- Prisma seed data: 2 users, 15 customers, 10 products, and 30 orders
- Centralized validation and error handling
- Helmet, CORS, rate limiting, bcrypt password hashing, and environment configuration

## Tech stack

### Frontend

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Recharts
- Lucide React
- Responsive CSS with Tailwind configuration

### Backend

- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT + bcryptjs
- Zod
- Helmet, CORS, and express-rate-limit

## Architecture

The repository is organized as a small monorepo:

```text
NexusOps/
├── src/                  # Vite React frontend
├── backend/
│   ├── src/
│   │   ├── config/       # Environment and Prisma client
│   │   ├── middleware/   # Auth, validation, errors
│   │   └── routes/       # Auth, CRUD, analytics APIs
│   └── prisma/           # Schema and seed
├── docker-compose.yml    # PostgreSQL development service
└── README.md
```

## Database schema

The Prisma schema includes:

- `User`
- `Customer`
- `Product`
- `Order`
- `OrderItem`

Orders connect customers to products through order items, with stock-aware order creation and transactional updates.

## API endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

### Customers

- `GET /api/customers`
- `GET /api/customers/:id`
- `POST /api/customers`
- `PATCH /api/customers/:id`
- `DELETE /api/customers/:id`

### Products

- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

### Orders

- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`

### Analytics

- `GET /api/analytics/overview`

## Installation

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Start PostgreSQL

Docker is required for the local database:

```bash
docker compose up -d
```

### 3. Configure and initialize the backend

```bash
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:4000`.

### 5. Start the frontend

From the repository root:

```bash
npm run dev
```

The frontend runs at the Vite URL, normally `http://localhost:5173`.

## Environment variables

Backend variables are documented in [`backend/.env.example`](./backend/.env.example):

```env
DATABASE_URL="postgresql://nexusops:nexusops@localhost:5432/nexusops?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

The frontend can override the API URL with:

```env
VITE_API_URL=http://localhost:4000/api
```

## Demo credentials

```text
Email: demo@nexusops.com
Password: Demo123!
```

## Screenshots

Add portfolio captures here after deployment:

```text
![NexusOps dashboard](./screenshots/dashboard.png)
![NexusOps analytics](./screenshots/analytics.png)
![NexusOps customers](./screenshots/customers.png)
```

## Validation

Frontend:

```bash
npm run build
```

Backend:

```bash
cd backend
npm run build
```

The Prisma seed requires PostgreSQL to be running, so use `docker compose up -d` before migrating or seeding.

## Live demo

_Coming soon — add your deployed URL here._

## GitHub repository description

> NexusOps — a production-quality full-stack SaaS dashboard for customers, products, orders, analytics, and business operations.
