# Digital Mental Health and Psychological Support System

This project is a student-focused wellness app with authentication, a 3D dashboard, AI-style support chat, mood tracking, self-assessment, resources, and emergency support.

## Features
- Signup and login with JWT
- Dashboard with Three.js visual experience
- Mood tracker with charting
- Self-assessment with result interpretation
- AI support chat with simulated empathetic replies
- Resource library with search
- Emergency support and profile page

## Installation

### 1. Install root dependencies
npm install

### 2. Install client and server dependencies
npm run install:client
npm run install:server

### 3. Configure environment
Copy the sample file and update it:
cp server/.env.example server/.env

### 4. Run the app
npm run dev

The frontend will be available at http://localhost:5173 and the backend at http://localhost:5000.

## Sample data
- Create an account through the signup page to start using the app.
- The app stores moods, assessments, and profile details in MongoDB.
