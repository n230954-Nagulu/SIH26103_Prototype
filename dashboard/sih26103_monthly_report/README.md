# SIH26103 Monthly Project Report System

A complete starter application for collecting monthly project reports through a web form and storing structured data in PostgreSQL via a REST API.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Uploads: Multer (local storage)
- REST API: Express JSON endpoints

## Features
- Monthly report form
- Project identification and status
- Planned vs achieved milestones
- Technical progress
- Expenditure entries
- Testing/results
- Challenges and support requests
- Next-month plan
- Multiple image/evidence uploads
- REST API with validation
- PostgreSQL schema with related tables

## Setup

### 1. Requirements
Node.js 20+, npm 10+, PostgreSQL 15+.

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173.

The frontend expects the API at http://localhost:5000/api. Set `VITE_API_URL` if needed.

### 4. PostgreSQL
Create a database, for example:
```sql
CREATE DATABASE sih26103_reports;
```
Then put the connection string in `backend/.env`.

## API
- `GET /api/health`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `POST /api/reports` (multipart/form-data)
- `GET /api/reports?projectId=...`
- `GET /api/reports/:id`

## Uploads
Images are stored under `backend/uploads/` and their relative URLs are saved in PostgreSQL. For production, replace local storage with S3/Cloudinary/object storage.

## Production notes
Add authentication/authorization, HTTPS, rate limiting, audit logging, malware scanning for uploads, object storage, and proper secrets management before deployment.
