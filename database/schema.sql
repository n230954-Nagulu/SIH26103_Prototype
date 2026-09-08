CREATE DATABASE sih_gspi;
\c sih_gspi;
CREATE TABLE IF NOT EXISTS contractors(id SERIAL PRIMARY KEY,name VARCHAR(160) NOT NULL,contact_email VARCHAR(160),phone VARCHAR(40),address TEXT);
CREATE TABLE IF NOT EXISTS officers(id SERIAL PRIMARY KEY,name VARCHAR(160) NOT NULL,designation VARCHAR(120),email VARCHAR(160),department VARCHAR(160));
CREATE TABLE IF NOT EXISTS projects(id SERIAL PRIMARY KEY,project_code VARCHAR(40) UNIQUE NOT NULL,name VARCHAR(220) NOT NULL,place VARCHAR(140),state VARCHAR(100),ministry VARCHAR(180),sector VARCHAR(100),project_type VARCHAR(120),latitude DOUBLE PRECISION,longitude DOUBLE PRECISION,contractor_id INT REFERENCES contractors(id),officer_id INT REFERENCES officers(id),implementing_agency VARCHAR(120),original_commissioning_month INT,original_commissioning_year INT,original_cost_crore NUMERIC(12,2),planned_duration_months INT,project_scale VARCHAR(20),project_complexity INT,land_acquisition_risk VARCHAR(20),clearance_complexity VARCHAR(20),procurement_complexity VARCHAR(20),manpower INT DEFAULT 100,progress_pct NUMERIC(5,2) DEFAULT 0,expenditure_crore NUMERIC(12,2) DEFAULT 0,risk_percentage NUMERIC(5,2) DEFAULT 0,risk_level VARCHAR(20) DEFAULT 'Low',status VARCHAR(30) DEFAULT 'Active',start_date DATE,end_date DATE,description TEXT,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS site_photos(id SERIAL PRIMARY KEY,project_id INT REFERENCES projects(id) ON DELETE CASCADE,photo_url TEXT NOT NULL,caption TEXT,captured_at DATE);
CREATE TABLE IF NOT EXISTS progress_history(id SERIAL PRIMARY KEY,project_id INT REFERENCES projects(id) ON DELETE CASCADE,month_date DATE,progress_pct NUMERIC(5,2),expenditure_crore NUMERIC(12,2));
CREATE TABLE IF NOT EXISTS project_reports(
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reporting_month VARCHAR(20) NOT NULL,
    overall_status VARCHAR(50) NOT NULL,
    completion_percentage INT NOT NULL DEFAULT 0,
    previous_completion INT,
    planned_summary TEXT,
    completed_summary TEXT,
    pending_summary TEXT,
    technical_progress TEXT,
    technologies_used TEXT,
    prototype_status TEXT,
    testing_summary TEXT,
    achievements TEXT,
    challenges TEXT,
    support_required TEXT,
    next_month_plan TEXT,
    next_month_target INT,
    amount_spent_this_month NUMERIC(12,2),
    total_spent_to_date NUMERIC(12,2),
    remaining_budget NUMERIC(12,2),
    funding_required BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state);CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);CREATE INDEX IF NOT EXISTS idx_projects_risk ON projects(risk_level);CREATE INDEX IF NOT EXISTS idx_project_reports_project_id ON project_reports(project_id);CREATE INDEX IF NOT EXISTS idx_project_reports_month ON project_reports(reporting_month);