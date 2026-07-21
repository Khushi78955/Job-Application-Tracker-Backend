# Job Application Tracker Backend

A backend API for managing job applications with authentication, application tracking, email verification, password reset, Google OAuth, and two-factor authentication.

Built using **Node.js, Express.js, PostgreSQL, JWT, Docker, and Zod validation**.

---

## 🚀 Features

### Authentication
- User registration
- Secure password hashing using bcrypt
- JWT access token authentication
- Refresh token based authentication
- Logout functionality
- Email verification flow
- Forgot password & reset password flow
- Google OAuth authentication
- Two-factor authentication (TOTP + QR Code)

### Job Application Management
- Create job applications
- View all applications
- View application by ID
- Update applications
- Delete applications
- Search applications
- Filter by status
- Pagination
- Sorting

### Dashboard
- Application statistics
- Total applications count
- Applied count
- Interview count
- Offer count
- Rejected count
- Wishlist count

### Security
- Helmet security headers
- CORS configuration
- Password hashing
- JWT authentication middleware
- Zod request validation
- Centralized error handling
- SQL parameterized queries

---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL
- pg (node-postgres)

## Authentication
- JWT
- bcrypt
- Passport.js
- Google OAuth 2.0

## Validation
- Zod

## Email
- Nodemailer
- Gmail SMTP

## Two Factor Authentication
- Speakeasy
- QRCode

## DevOps
- Docker
- Docker Compose

---

# 📂 Project Structure

```
Job-Application-Tracker-Backend
│
├── src
│   │
│   ├── config
│   │   ├── db.js
│   │   └── passport.js
│   │
│   ├── controllers
│   │
│   ├── services
│   │
│   ├── routes
│   │
│   ├── middleware
│   │
│   ├── validators
│   │
│   ├── utils
│   │
│   ├── errors
│   │
│   ├── app.js
│   └── server.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Khushi78955/Job-Application-Tracker-Backend.git

cd Job-Application-Tracker-Backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file:

```env
PORT=2000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=job_tracker

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

DATABASE_URL=postgres://postgres:postgres@localhost:5432/job_tracker
```

---

# 🐘 Running PostgreSQL with Docker

Start PostgreSQL container:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Stop database:

```bash
docker compose down
```

---

# ▶️ Running Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```
http://localhost:2000
```

---

# 🔗 API Routes

Base URL:

```
/api/v1
```

---

# Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Logout |
| GET | /auth/google | Google OAuth |
| GET | /auth/verify-email | Verify email |
| POST | /auth/forgot-password | Request password reset |
| POST | /auth/reset-password | Reset password |
| POST | /auth/enable-2fa | Enable 2FA |
| POST | /auth/verify-2fa | Verify 2FA |
| POST | /auth/disable-2fa | Disable 2FA |

---

# Application Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /applications | Create application |
| GET | /applications | Get applications |
| GET | /applications/:id | Get application |
| PATCH | /applications/:id | Update application |
| DELETE | /applications/:id | Delete application |

---

# Dashboard Route

| Method | Endpoint | Description |
|---|---|---|
| GET | /dashboard | Application statistics |

---

# Authentication Header

Protected routes require:

```
Authorization: Bearer <access_token>
```

---

# Database Schema

Main tables:

### Users

Stores:
- user information
- password hash
- refresh tokens
- OAuth details
- verification tokens
- 2FA secrets


### Applications

Stores:
- company
- role
- status
- applied date
- follow-up date
- notes
- user relationship

---

# Docker Setup

Build containers:

```bash
docker compose up --build
```

PostgreSQL runs on:

```
localhost:5432
```

---

# Error Handling

The API provides consistent error responses:

Example:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

Validation errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Security Notes

- Passwords are never stored directly
- JWT secrets are stored using environment variables
- SQL injection prevention using parameterized queries
- Input validation using Zod
- Sensitive files excluded using `.gitignore`

---

# Future Improvements

- Automated tests using Jest + Supertest
- API documentation using Swagger
- Rate limiting
- Redis caching
- Deployment with CI/CD
- Role-based access control

---

# Author

**Khushi**

GitHub:
https://github.com/Khushi78955
