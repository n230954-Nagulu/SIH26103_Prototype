# SIH26103 — Government Project Geo-Spatial Intelligence (PostgreSQL)

Updated prototype for the Government Project Tracker / Geo-Spatial Intelligence workflow.

## User flow

1. Officer applies filters.
2. Filtered project table is shown.
3. The portfolio map remains **below the table** and maps the filtered projects.
4. **Table row click only** opens the separate project-details page.
5. **Map point click** opens a project details drawer on the right side of the map without leaving the portfolio page.
6. The project-details page contains the dedicated project map, project profile, evidence, AI risk analysis and What-If simulator.

## AI model

The previous supplied serialized models have been removed from the active pipeline.

The new Python service uses two newly trained regression models:

- `time_overrun_model.pkl` — Random Forest regression for predicted delay in months.
- `cost_overrun_model.pkl` — Gradient Boosting regression for predicted cost overrun percentage.

Training data:

- `ml_service/data/project_risk_training_900.csv` — 900 rows.
- The dataset is **public-data-calibrated and augmented**, not 900 independently verified government records. Calibration anchors use published Indian central-sector project observations from MoSPI/PAIMANA and parliamentary statements; controlled augmentation was used to create enough training rows for a stable SIH prototype model.
- `ml_service/data/TRAINING_PROVENANCE.md` documents the sources and limitation.
- Validation metrics are stored in `ml_service/data/metrics.txt`.

The model accepts project context plus manpower, budget, planned duration and current progress. The service returns:

- Total risk (0–100)
- Risk level
- Cost overrun %
- Extra expenditure (₹ crore)
- Time overrun %
- Delay time (months)
- Explainable drivers
- Recommendations

## What-If simulator

Only three controls are exposed:

- Manpower slider
- Budget slider
- Planned time slider

Changing a slider dynamically reruns the model after a short debounce. Scenario values never update the PostgreSQL project record.

## Run

### PostgreSQL

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sih_gspi -f ".\database\schema.sql"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sih_gspi -f ".\database\seed.sql"
```

### Node backend

```powershell
npm install
npm start
```

### Python ML service

Use Python 3.12 for this project.

```powershell
cd ml_service
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install --only-binary=:all: -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```

Open `http://localhost:3000` when using the supplied `.env.example` defaults.

### Unified application

The root Node server is the single application entry point. It serves:

- `/` — the main portfolio dashboard.
- `/analysis.html` — project selection for AI risk analysis.
- `/pages/project.html?id=<project-id>` — project intelligence and What-If analysis.
- `/dashboard/` — the preserved sector explorer dashboard.
- `/dashboard/src/frontend/...` — the preserved login, registration and assigned-project pages.

Dashboard-only APIs use the `/dashboard-api` namespace so they can coexist with the canonical `/api/projects` and ML analysis routes. Start only the root Node server with `npm start`; the old `dashboard/backend/server.js` is no longer needed for the integrated app.
