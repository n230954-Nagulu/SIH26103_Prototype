const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/register', (req, res) => {
    const { officer_id, full_name, official_email, department, designation } = req.body;

    if (!full_name || !official_email || !department || !designation) {
        return res.status(400).json({ message: 'Please provide all government officer details' });
    }

    const id = officer_id ? Number(officer_id) : null;
    const sql = id
        ? `INSERT INTO officers (id, name, designation, email, department) VALUES ($1, $2, $3, $4, $5) RETURNING id`
        : `INSERT INTO officers (name, designation, email, department) VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = id
        ? [id, full_name, designation, official_email, department]
        : [full_name, designation, official_email, department];

    db.query(sql, values, (err, rows) => {
        if (err) {
            console.error('Government officer registration error:', err);
            return res.status(409).json({ message: 'Officer ID or official email already exists' });
        }

        res.status(201).json({
            message: 'Government officer account created successfully',
            officer_id: rows[0].id
        });
    });
});

router.post('/projects', (req, res) => {
    const {
        project_id,
        project_name,
        sector,
        budget,
        status,
        progress,
        ministry,
        state,
        expenditure,
        start_date,
        end_date,
        contractor_id,
        officer_id
    } = req.body;

    if (!project_id || !project_name || !sector || !officer_id) {
        return res.status(400).json({ message: 'Project ID, name, sector and officer are required' });
    }

    const sql = `
        INSERT INTO projects (
            project_code, name, sector, original_cost_crore, status,
            progress_pct, ministry, state, expenditure_crore,
            start_date, end_date, contractor_id, officer_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, project_code
    `;
    const values = [
        project_id,
        project_name,
        sector,
        budget || 0,
        status || 'Active',
        progress || 0,
        ministry || null,
        state || null,
        expenditure || 0,
        start_date || null,
        end_date || null,
        contractor_id || null,
        officer_id
    ];

    db.query(sql, values, (err, rows) => {
        if (err) {
            console.error('Project creation error:', err);
            return res.status(500).json({ message: 'Database error while creating project' });
        }

        res.status(201).json({
            message: 'Project created successfully',
            project_id: rows[0].project_code,
            id: rows[0].id
        });
    });
});

module.exports = router;