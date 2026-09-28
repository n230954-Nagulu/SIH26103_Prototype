# Vercel-safe deployment architecture

This project should be split into deployable services instead of running everything from one local Node server and one local Python process.

## Recommended production structure

```text
project-root/
├── public/                  # portfolio pages and assets
├── dashboard/               # preserved dashboard pages and assets
├── api/                     # Vercel serverless API routes
│   ├── health.js
│   ├── dashboard-api/        # adapter for the existing dashboard routers
│   ├── projects/
│   │   └── index.js
│   ├── ml/
│   │   └── predict.js
│   └── lib/
│       ├── env.js
│       └── db.js
├── ml_service/              # Python ML service (deployed separately)
│   ├── main.py
│   ├── requirements.txt
│   └── models/
├── database/                # SQL schema and seed scripts
├── .env.example
├── vercel.json
├── package.json
└── README.md
```

## Separation of concerns

### 1) Frontend on Vercel

- Serves the portfolio from `public/` and the preserved dashboard from `dashboard/`.
- Dashboard routes and assets are explicitly included in `vercel.json`.
- Same-origin API paths are used in production; local paths remain available in development.

### 2) Serverless API on Vercel

- Handles `/api/*` routes and adapts the existing Express dashboard routers under `/dashboard-api/*`.
- Uses the configured hosted PostgreSQL database and external ML service.
- Does not depend on a long-lived local server.

### 3) ML service on a separate Python host

- Runs FastAPI + Uvicorn.
- Use a dedicated deployment such as Azure Container Apps, Render, Railway, Fly.io, or another Python-compatible platform.
- Expose a public HTTPS URL and set ML_SERVICE_URL accordingly.

### 4) Database on a hosted PostgreSQL service

- Use Neon, Supabase, Azure Database for PostgreSQL, or another managed PostgreSQL host.
- Never depend on localhost:5432 in production.

## Environment variable strategy

Use environment variables instead of hard-coded localhost values:

- DATABASE_URL
- ML_SERVICE_URL
- NEXT_PUBLIC_API_BASE_URL
- NODE_ENV

Do not keep production values in local .env files when deploying to Vercel.

## Why this is safer

- No localhost-only backend assumptions
- No port binding issues on Vercel
- Works with Vercel’s stateless deployment model
- Keeps frontend and backend loosely coupled
- Allows the ML model to scale independently

## Deployment flow

1. Deploy the static frontend + /api routes to Vercel.
2. Deploy the Python ML service to a separate platform.
3. Configure DATABASE_URL and ML_SERVICE_URL in Vercel project settings.
4. Configure `DATABASE_URL` and `ML_SERVICE_URL` in Vercel; keep them out of committed files.
5. Keep the map assets under a public static path, not direct filesystem references.

## Deployment limitations to resolve

- The monthly report API accepts evidence files in memory. Vercel function request limits and ephemeral storage make this unsuitable for durable uploads; use object storage before relying on evidence uploads in production.
- The Python ML service must be deployed separately and reachable over HTTPS.
- Verify database credentials, schema, and seed data against the production PostgreSQL instance before enabling logins.

## Important rule

The project should never assume all services live in the same machine process.
