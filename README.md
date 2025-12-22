# VentureMond Client Dashboard

A comprehensive full-stack solution for client management, built with a modern React frontend and a robust Node.js/Express backend. This platform enables clients to browse services, manage orders, view project progress, and interact with the VentureMond team.

## 🏗 Architecture

This project follows a **Monorepo** structure:

*   **Frontend (`/clarity-hub-main`)**: A modern Single Page Application (SPA) built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Shadcn UI](https://ui.shadcn.com/).
*   **Backend (`/backend`)**: A RESTful API built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/).

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   **Node.js** (v18 or higher)
*   **MongoDB** (running locally or via MongoDB Atlas)
*   **Git**

### 1. Setup Backend

The backend handles authentication, database interactions, and business logic.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    *   Create a `.env` file (copy from `.env.example`).
    *   Add your MongoDB Connection String (`MONGODB_URI`).
    *   Set a secure `JWT_SECRET`.
    *   Set `CLIENT_URL=http://localhost:5173` (for local CORS).
4.  **Seed the Database** (Optional but recommended):
    ```bash
    npm run seed
    ```
    *This creates a default Admin user (`admin@venturemond.com` / `Admin@123`) and sample services.*
5.  Start the Server:
    ```bash
    npm run dev
    ```
    *Server runs on `http://localhost:5000` by default.*

### 2. Setup Frontend

The frontend provides the user interface for clients and admins.

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd clarity-hub-main
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    *   Create a `.env` file.
    *   Set the backend API URL:
        ```bash
        VITE_API_URL=http://localhost:5000/api
        ```
4.  Start the Development Server:
    ```bash
    npm run dev
    ```
    *App runs on `http://localhost:5173`.*

---

## 🌐 Deployment (Vercel)

This project is configured for seamless deployment on Vercel.

### Backend Deployment
1.  Create a new project on Vercel and import this repository.
2.  Set the **Root Directory** to `backend`.
3.  **Environment Variables**:
    *   `MONGODB_URI`: Your production MongoDB Atlas connection string.
    *   `JWT_SECRET`: A strong, random secret key.
    *   `CLIENT_URL`: Your production Frontend URL (e.g., `https://your-frontend.vercel.app`). **NO trailing slash.**
4.  Deploy!

### Frontend Deployment
1.  Create a separate new project on Vercel and import this repository.
2.  Set the **Root Directory** to `clarity-hub-main`.
3.  **Environment Variables**:
    *   `VITE_API_URL`: Your production Backend URL + `/api` (e.g., `https://your-backend.vercel.app/api`).
4.  Deploy!

> **Note**: For file uploads to persist in production, you must update the backend to use a cloud storage service like AWS S3 or Cloudinary, as Vercel's file system is ephemeral.

---

## ✨ Key Features

*   **Authentication**: Secure JWT-based login and registration.
*   **Service Catalog**: Browse and compare different service tiers (MVP, Pro, Enterprise).
*   **Dynamic Pricing**: View pricing in USD ($) or INR (₹).
*   **Cart & Checkout**: Add services to cart and simulate checkout.
*   **Project Management**: View active projects and status updates.
*   **File Management**: Upload and manage project files.
*   **Ticketing System**: Raise support tickets and track resolution.
*   **Responsive Design**: Fully optimized for mobile and desktop using Tailwind CSS.
