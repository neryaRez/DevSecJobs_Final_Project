# DevSecJobs

A fullstack job management platform built with **Flask** (backend) and **React + TailwindCSS** (frontend).  
The project demonstrates clean architecture, secure authentication, and a modular design that separates business logic across models, routes, and services.

---

## 📑 Table of Contents
- [Overview](#overview)  
- [Architecture](#architecture)  
- [Technologies](#technologies)  
- [Backend (Flask)](#backend-flask)  
- [Frontend (React + Tailwind)](#frontend-react--tailwind)  
- [Functionality and Roles](#functionality-and-roles)  
- [Installation](#installation)  
- [API Endpoints](#api-endpoints)  
- [Future Improvements](#future-improvements)  
- [License](#license)  

---

## 📝 Overview
DevSecJobs is a platform for publishing jobs, managing applicants, and tracking applications.  
It supports different user roles (admin, recruiter, applicant) and provides secure JWT-based authentication.  

The system is divided into two parts:  
- **Flask backend** exposing REST APIs.  
- **React frontend** consuming the APIs with protected routes.  

---

## 🏗️ Architecture
```
React (Vite + Tailwind)
       ⬇️ REST API calls
Flask (Blueprints + SQLAlchemy + JWT)
       ⬇️ ORM
Database (SQLite / MySQL)
```

- **Users** – system accounts (applicants, recruiters, admins).  
- **Applicants** – candidate profiles linked to users.  
- **Jobs** – job postings created by recruiters/admins.  
- **Applications** – relation between applicants and jobs, including status and score.  

---

## ⚙️ Technologies
### Backend
- **Flask** – REST API server.  
- **SQLAlchemy** – ORM for data modeling.  
- **Flask-JWT-Extended** – authentication and token management.  
- **Flask-CORS** – cross-origin support.  
- **Werkzeug.security** – password hashing.  
- **dotenv** – environment variable management.  

### Frontend
- **React (Vite)** – SPA client.  
- **React Router** – routing and protected routes.  
- **TailwindCSS** – utility-based styling.  
- **Context API** – global authentication state.  

---

## 🔐 Functionality and Roles

### 👤 User (Applicant)
- **Register/Login** – create an account and authenticate with JWT tokens.  
- **Profile Management** – complete and update a personal profile (skills, experience, education, resume path).  
- **Job Search** – view available jobs through the **Jobs Feed**.  
- **Apply to Jobs** – submit an application to open jobs.  
- **Track Applications** – monitor the status of submitted applications (`pending`, `accepted`, `rejected`) and see assigned scores.  

This ensures applicants can manage their career information, apply efficiently, and stay updated about their progress.  

---

### 🛠️ Admin (or Recruiter)
- **Job Management** – create, update, and close job postings.  
- **Application Review** – view applicants for specific jobs, including their skills, resume path, and computed scores.  
- **Decision Making** – update application statuses (approve/reject) and assign scores to reflect applicant suitability.  
- **User Management** – manage system accounts (promote users to admin, deactivate users, etc.).  
- **Dashboard Access** – admins access special dashboards (`/dashboard`, `/dashboard/jobs`, `/dashboard/applications`) not visible to normal users.  

This separation enforces a clear distinction between candidate-facing features and employer/recruiter tools, aligning with industry practices for role-based access.  

---

## 🖥️ Backend (Flask)
The backend is organized with Blueprints and Models for maintainability:  

- **Models/**  
  - `User` – system users with password hashing and admin flag.  
  - `Applicant` – candidate profile linked to a user.  
  - `Job` – job posting with required skills and publisher.  
  - `Application` – application record connecting applicant and job.  

- **Routers/**  
  - `auth_router` – registration, login, refresh.  
  - `users_router` – manage users.  
  - `jobs_router` – CRUD operations for jobs.  
  - `applicant_router` – manage applicants.  
  - `application_router` – apply to jobs and manage applications.  

- **main.py** – app factory, DB initialization, CORS and JWT configuration.  

---

## 🎨 Frontend (React + Tailwind)
- **App.jsx** – routes setup, including public, user-protected, and admin-protected paths.  
- **AuthContext** – provides authentication state and token handling.  
- **Pages**:
  - `Login`, `Register` – authentication forms.  
  - `UserHome` – user dashboard.  
  - `Dashboard` – admin panel for jobs and applications.  
  - `JobsFeed` – public list of jobs.  
  - `MyApplications` – applications submitted by the current user.  
  - `CompleteProfile` – user profile completion.  

---

## ⚡ Installation
### Backend
```bash
# Python environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```
Default: `http://localhost:5001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Default: `http://localhost:5173`

---

## 📡 API Endpoints
### Auth
- `POST /auth/register` – register new user.  
- `POST /auth/login` – login and get tokens.  
- `POST /auth/refresh` – refresh access token.  

### Jobs
- `GET /jobs` – list jobs.  
- `POST /jobs` – create job (admin).  

### Applicants
- `GET /applicants` – list applicants.  
- `POST /applicants` – create applicant profile.  

### Applications
- `POST /apply/<job_id>` – apply to a job.  
- `GET /apply/user/<user_id>` – get user’s applications.  

---

## 🚀 Future Improvements
- Role-based access control (RBAC).  
- Integration with PostgreSQL for production.  
- Unit and integration testing with pytest.  
- Improved admin dashboard UI with analytics.  
- Resume parsing and AI-based application scoring.  

---

## 📄 License
MIT License.  
