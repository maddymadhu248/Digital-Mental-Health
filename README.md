# Digital Mental Health and Psychological Support System

This project is a student-focused wellness app built with React (Vite), Three.js, Node.js, Express, and MongoDB (with local in-memory fallback store).

## Features
- **3D Dashboard**: Atmospheric visual experience powered by Three.js
- **Authentication**: JWT-based signup/login with fallback memory store
- **Mood Tracker**: Log daily emotions and track trends via Chart.js
- **Self-Assessment**: Mental wellness questionnaires with score interpretations
- **AI Support Chat**: Simulated empathetic assistant for student support
- **Resource Library**: Searchable articles and wellness guidelines
- **Emergency Contacts**: Campus and crisis helpline directory

---

## Local Development

### 1. Install Dependencies
```bash
npm install
npm run install:client
npm run install:server
```

### 2. Environment Setup
```bash
cp server/.env.example server/.env
```

### 3. Run Application
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## Deployment Guide

### 1. Backend Deployment (Render)
1. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`Digital-Mental-Health`).
3. Set the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (or omit to use in-memory store)
   - `JWT_SECRET`: A strong secret key
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://digital-mental-health.vercel.app`)
5. Deploy and copy your backend service URL (e.g., `https://mental-health-app-api.onrender.com`).

---

### 2. Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository (`Digital-Mental-Health`).
3. Configure Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-url>/api` (e.g., `https://mental-health-app-api.onrender.com/api`)
5. Click **Deploy**.
