# 🪞 Darpan — CP Performance Tracker Platform

> **Darpan** (दर्पण = Mirror) — Track. Compete. Improve.

A full-stack Competitive Programming Performance Tracker for managing students across camps (Summer, Winter, Custom), tracking contest performance on **Codeforces**, **LeetCode**, and **CodeChef**, with Admin, Mentor, and Student dashboards.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache & Jobs | Redis 7 + BullMQ |
| Auth | JWT (access + refresh tokens) + bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Charts | Recharts |
| Reports | Puppeteer (PDF) + ExcelJS (Excel) |

---

## 📋 Prerequisites

Before you begin, make sure you have these installed on your machine:

1. **Node.js** (v18 or later) — [Download](https://nodejs.org/)
   ```bash
   node --version  # Should show v18.x.x or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version  # Should show 9.x.x or higher
   ```

3. **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/)
   ```bash
   docker --version         # Should show Docker version 24.x or higher
   docker compose version   # Should show v2.x.x
   ```
   > Docker is used to run PostgreSQL and Redis locally. No need to install them separately!

4. **Git** — [Download](https://git-scm.com/)
   ```bash
   git --version
   ```

---

## 🚀 Step-by-Step Local Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd Darpan
```

### Step 2: Start PostgreSQL & Redis with Docker

```bash
# Start the database and cache servers in the background
docker compose up -d

# Verify they're running
docker compose ps
```

You should see:
- `darpan-postgres` — Running on port **5432**
- `darpan-redis` — Running on port **6379**

> **Note:** Data persists across restarts thanks to Docker volumes. To stop: `docker compose down`. To stop AND delete data: `docker compose down -v`.

### Step 3: Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Now edit the `.env` file. The defaults work for local development with Docker, but you need to set these:

```bash
# Generate secure JWT secrets (run these in terminal, copy the output)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy the output and paste as JWT_ACCESS_SECRET
# Run again and paste as JWT_REFRESH_SECRET
```

**For email (SMTP) setup**, see the [Email Setup Guide](#-email-setup-guide-gmail) section below.

```bash
# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Start the backend server
npm run dev
```

The backend should now be running at **http://localhost:5000** 🎉

### Step 4: Set Up the Frontend

```bash
# Open a new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local

# Start the frontend dev server
npm run dev
```

The frontend should now be running at **http://localhost:3000** 🎉

### Step 5: Verify Everything Works

1. Open **http://localhost:3000** in your browser
2. You should see the Darpan landing page
3. Click "Register" and create an account
4. You should be redirected to the appropriate dashboard

---

## 📧 Email Setup Guide (Gmail)

Darpan uses Gmail SMTP to send emails (password reset, notifications). Here's how to set it up:

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the steps to enable it

### Step 2: Generate an App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other** → Type "Darpan"
4. Click **Generate**
5. Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)
6. **Copy this password** (remove spaces)

### Step 3: Update .env
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcdefghijklmnop    # The 16-char app password (no spaces)
SMTP_FROM=Darpan CP Tracker <your-actual-email@gmail.com>
```

> **Important:** This is NOT your Gmail password. It's a separate "App Password" that Google generates specifically for apps.

---

## 📁 Project Structure

```
Darpan/
├── docker-compose.yml          # PostgreSQL + Redis containers
├── README.md                   # You are here!
│
├── backend/                    # Express API Server
│   ├── src/
│   │   ├── config/             # DB, Redis, env config
│   │   ├── controllers/        # Route handler logic
│   │   ├── services/           # Business logic layer
│   │   ├── repositories/       # Database query abstraction
│   │   ├── middleware/         # Auth, RBAC, validation, errors
│   │   ├── routes/             # Express route definitions
│   │   ├── validators/         # Zod validation schemas
│   │   ├── jobs/               # BullMQ background jobs
│   │   ├── prisma/             # Prisma schema + migrations
│   │   ├── utils/              # Helper functions
│   │   └── types/              # TypeScript type definitions
│   ├── tests/                  # Jest tests
│   └── package.json
│
├── frontend/                   # Next.js 14 App
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Login, Register, Password Reset
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── mentor/         # Mentor dashboard
│   │   │   └── student/        # Student dashboard
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── charts/         # Chart components
│   │   │   ├── dashboard/      # Dashboard widgets
│   │   │   └── camp/           # Camp-specific components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API client, auth helpers
│   │   ├── store/              # Zustand state management
│   │   └── types/              # TypeScript interfaces
│   └── package.json
```

---

## 🧑‍💻 Available Commands

### Backend
```bash
cd backend

npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio (visual DB editor)
npm test                 # Run Jest tests
```

### Frontend
```bash
cd frontend

npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

### Docker
```bash
docker compose up -d     # Start PostgreSQL + Redis
docker compose down      # Stop containers
docker compose down -v   # Stop + delete all data
docker compose ps        # Check container status
docker compose logs      # View container logs
```

---

## 👥 Default User Roles

| Role | Access Level |
|------|-------------|
| **Admin** | Full access — manage camps, students, mentors, reports |
| **Mentor** | Scoped to assigned camps — attendance, notes, batch reports |
| **Student** | Read-only — view own dashboard, camp data, add friends |

---

## 🔮 Future Enhancements (Planned)

- [ ] Problem recommendation engine (based on weak tags)
- [ ] ML-based plagiarism detection (AST comparison)
- [ ] React Native mobile app
- [ ] Real-time WebSocket notifications
- [ ] Integration with more platforms (AtCoder, SPOJ)

---

## 📝 License

MIT License — Built with ❤️ for competitive programmers.
