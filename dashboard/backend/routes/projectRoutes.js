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

router.post("/", (req, res) => {
    const {
        project_id,
        project_name,
        place,
        state,
        ministry,
        sector,
        project_type,
        budget,
        status,
        progress,
        expenditure,
        start_date,
        end_date,
        contractor_id,
        officer_id,
        implementing_agency,
        description
    } = req.body;

    if (!project_id || !project_name || !sector) {
        return res.status(400).json({ success: false, message: "Project ID, name and sector are required." });
    }

    const finalContractorId = contractor_id !== undefined && contractor_id !== null && contractor_id !== "" ? Number(contractor_id) : null;
    const finalOfficerId = officer_id !== undefined && officer_id !== null && officer_id !== "" ? Number(officer_id) : null;

    const sql = `
        INSERT INTO projects (
            project_code, name, place, state, ministry, sector, project_type,
            original_cost_crore, status, progress_pct, expenditure_crore,
            start_date, end_date, contractor_id, officer_id,
            implementing_agency, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING id, project_code, name
    `;

    const values = [
        String(project_id).trim(),
        String(project_name).trim(),
        place || null,
        state || null,
        ministry || null,
        String(sector).trim(),
        project_type || null,
        budget === "" || budget == null ? 0 : Number(budget),
        status || "Active",
        progress === "" || progress == null ? 0 : Number(progress),
        expenditure === "" || expenditure == null ? 0 : Number(expenditure),
        start_date || null,
        end_date || null,
        finalContractorId,
        finalOfficerId,
        implementing_agency || null,
        description || null
    ];

    db.query(sql, values, (err, rows) => {
        if (err) {
            console.error("CREATE PROJECT ERROR:", err);
            return res.status(500).json({ success: false, message: "Database error while creating project." });
        }

        const inserted = Array.isArray(rows) ? rows[0] : (rows && rows.rows ? rows.rows[0] : null);

        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            project: {
                id: inserted?.id,
                project_id: inserted?.project_code || project_id,
                name: inserted?.name || project_name,
                contractor_id: finalContractorId,
                officer_id: finalOfficerId
            }
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
