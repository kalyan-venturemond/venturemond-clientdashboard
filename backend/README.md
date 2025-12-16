# VentureMond Client Dashboard Backend

This is the backend for the VentureMond Client Dashboard, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

## Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update `.env` with your actual MongoDB URI and other secrets.
    - **Note:** If your DB password contains special characters like `@`, you must URL encode them (e.g., `@` becomes `%40`).

## Running Locally

### Development Mode

Run with nodemon for hot-reloading:

```bash
npm run dev
```

The server will start on port 5000 (or whatever is in your `.env`).

### Production Mode

```bash
npm start
```

## Seeding Data

To populate the database with initial data (Services and Admin User):

```bash
npm run seed
```

This will create:
- 3 Sample Services
- 1 Admin User (`admin@venturemond.com` / `Admin@123`)

## API Endpoints & Testing

You can test the API using curl or Postman.

### 1. Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@venturemond.com","password":"Admin@123"}'
```

### 2. List Services
```bash
curl http://localhost:5000/api/services
```

### 3. Create Order (Protected)
Replace `<token>` with the token from login, and `<service_id>` with a valid ID from the services list.

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "items":[{"service":"<service_id>","qty":1}], "total":4999 }'
```

## Frontend Integration

To connect the frontend to this backend, set the following environment variable in your frontend project (e.g., in `.env` or `.env.local`):

```bash
VITE_API_URL=http://localhost:5000/api
```
