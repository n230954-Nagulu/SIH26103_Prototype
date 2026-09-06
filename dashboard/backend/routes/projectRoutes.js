const express = require("express");
const router = express.Router();

const db = require("../db");

function normalizeRows(results) {
    if (Array.isArray(results)) return results;
    if (results && Array.isArray(results.rows)) return results.rows;
    return [];
}

router.get("/", (req, res) => {
    const sql = `
        SELECT
            p.id,
            p.name,
            p.project_code,
            p.place,
            p.state,
            p.ministry,
            p.sector,
            p.project_type,
            p.status,
            p.progress_pct AS progress,
            p.original_cost_crore AS budget,
            p.expenditure_crore AS expenditure,
            p.start_date,
            p.end_date,
            p.risk_level,
            p.risk_percentage,
            p.latitude,
            p.longitude,
            p.contractor_id,
            p.officer_id,
            p.implementing_agency
        FROM projects p
        ORDER BY p.id ASC
    `;

    db.query(sql, [], (err, results) => {
        if (err) {
            console.error("GET PROJECTS ERROR:", err);
            return res.status(500).json({ success: false, message: "Failed to retrieve projects" });
        }

        const rows = normalizeRows(results);

        res.json({
            success: true,
            projects: rows.map((project) => ({
                id: project.id,
                project_id: project.project_code || project.id,
                project_name: project.name,
                name: project.name,
                sector: project.sector,
                budget: project.budget,
                status: project.status,
                progress: project.progress,
                ministry: project.ministry,
                state: project.state,
                expenditure: project.expenditure,
                start_date: project.start_date,
                end_date: project.end_date,
                startDate: project.start_date,
                endDate: project.end_date,
                risk_level: project.risk_level,
                risk_percentage: project.risk_percentage,
                latitude: project.latitude,
                longitude: project.longitude,
                contractor_id: project.contractor_id,
                officer_id: project.officer_id,
                implementing_agency: project.implementing_agency
            }))
        });
    });
});

router.get("/:projectId", (req, res) => {
    const projectId = String(req.params.projectId).trim();
    const sql = `
        SELECT
            p.id,
            p.name,
            p.project_code,
            p.place,
            p.state,
            p.ministry,
            p.sector,
            p.project_type,
            p.status,
            p.progress_pct AS progress,
            p.original_cost_crore AS budget,
            p.expenditure_crore AS expenditure,
            p.start_date,
            p.end_date,
            p.risk_level,
            p.risk_percentage,
            p.latitude,
            p.longitude,
            p.contractor_id,
            p.officer_id,
            p.implementing_agency,
            p.description
        FROM projects p
        WHERE CAST(p.id AS text) = $1 OR LOWER(p.project_code) = LOWER($1)
        LIMIT 1
    `;

    db.query(sql, [projectId], (err, results) => {
        if (err) {
            console.error("GET SINGLE PROJECT ERROR:", err);
            return res.status(500).json({ success: false, message: "Failed to retrieve project" });
        }

        const rows = normalizeRows(results);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const project = rows[0];

        res.json({
            success: true,
            project: {
                id: project.id,
                project_id: project.project_code || project.id,
                name: project.name,
                project_name: project.name,
                sector: project.sector,
                budget: project.budget,
                status: project.status,
                progress: project.progress,
                ministry: project.ministry,
                state: project.state,
                place: project.place,
                expenditure: project.expenditure,
                start_date: project.start_date,
                end_date: project.end_date,
                startDate: project.start_date,
                endDate: project.end_date,
                risk_level: project.risk_level,
                risk_percentage: project.risk_percentage,
                latitude: project.latitude,
                longitude: project.longitude,
                contractor_id: project.contractor_id,
                officer_id: project.officer_id,
                implementing_agency: project.implementing_agency,
                description: project.description
            }
        });
    });
});

module.exports = router;
