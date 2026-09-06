const express = require("express");
const router = express.Router();

const db = require("../db");

// =====================================================
// GET PROJECTS ASSIGNED TO GOVERNMENT OFFICER
// GET /api/my-projects/officer/:officer_id
// =====================================================

router.get("/officer/:officer_id", (req, res) => {
    const officerId = String(req.params.officer_id).trim();

    const sql = `
        SELECT
            p.id AS id,
            p.name AS name,
            p.sector,
            p.original_cost_crore AS budget,
            p.status,
            p.progress_pct AS progress,
            p.ministry,
            p.state,
            p.expenditure_crore AS expenditure,
            p.start_date AS startDate,
            p.end_date AS endDate
        FROM projects p
        WHERE p.officer_id = $1
        ORDER BY p.id ASC
    `;

    db.query(sql, [Number(officerId) || officerId], (err, results) => {
        if (err) {
            console.error("Error fetching officer projects:", err);
            return res.status(500).json({ message: "Database error while loading officer projects" });
        }

        const rows = Array.isArray(results) ? results : (results && results.rows) || [];
        res.json(rows.map(project => ({
            id: project.id,
            name: project.name,
            sector: project.sector,
            budget: project.budget,
            status: project.status,
            progress: project.progress,
            ministry: project.ministry,
            state: project.state,
            expenditure: project.expenditure,
            startDate: project.startdate || project.start_date,
            endDate: project.enddate || project.end_date
        })));
    });
});


// =====================================================
// GET PROJECTS ASSIGNED TO CONTRACTOR
// GET /api/my-projects/contractor/:contractor_id
// =====================================================

router.get("/contractor/:contractor_id", (req, res) => {
    const contractorId = String(req.params.contractor_id).trim();

    const sql = `
        SELECT
            p.id AS id,
            p.name AS name,
            p.sector,
            p.original_cost_crore AS budget,
            p.status,
            p.progress_pct AS progress,
            p.ministry,
            p.state,
            p.expenditure_crore AS expenditure,
            p.start_date AS startDate,
            p.end_date AS endDate
        FROM projects p
        WHERE p.contractor_id = $1
        ORDER BY p.id ASC
    `;

    db.query(sql, [Number(contractorId) || contractorId], (err, results) => {
        if (err) {
            console.error("Error fetching contractor projects:", err);
            return res.status(500).json({ message: "Database error while loading contractor projects" });
        }

        const rows = Array.isArray(results) ? results : (results && results.rows) || [];

        res.json(rows.map(project => ({
            id: project.id,
            name: project.name,
            sector: project.sector,
            budget: project.budget,
            status: project.status,
            progress: project.progress,
            ministry: project.ministry,
            state: project.state,
            expenditure: project.expenditure,
            startDate: project.startdate || project.start_date,
            endDate: project.enddate || project.end_date
        })));
    });
});


// =====================================================
// GET ONE PROJECT
// GET /api/my-projects/project/:id
// =====================================================

router.get("/project/:id", (req, res) => {
    const projectId = String(req.params.id).trim();

    const sql = `
        SELECT
            p.id AS id,
            p.name AS name,
            p.sector,
            p.original_cost_crore AS budget,
            p.status,
            p.progress_pct AS progress,
            p.ministry,
            p.state,
            p.expenditure_crore AS expenditure,
            p.start_date AS startDate,
            p.end_date AS endDate
        FROM projects p
        WHERE p.id = $1
    `;

    db.query(sql, [Number(projectId) || projectId], (err, results) => {
        if (err) {
            console.error("Error fetching project:", err);
            return res.status(500).json({ message: "Database error" });
        }

        const rows = Array.isArray(results) ? results : (results && results.rows) || [];

        if (rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        const project = rows[0];

        res.json({
            id: project.id,
            name: project.name,
            sector: project.sector,
            budget: project.budget,
            status: project.status,
            progress: project.progress,
            ministry: project.ministry,
            state: project.state,
            expenditure: project.expenditure,
            startDate: project.startdate || project.start_date,
            endDate: project.enddate || project.end_date
        });
    });
});


module.exports = router;