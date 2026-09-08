const express = require('express');
const multer = require('multer');
const db = require('../db');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 10, fileSize: 5 * 1024 * 1024 }
});

function normalizeRows(results) {
    if (Array.isArray(results)) return results;
    if (results && Array.isArray(results.rows)) return results.rows;
    return [];
}

router.get('/', (req, res) => {
    const projectId = String(req.query.projectId || '').trim();

    if (!projectId) {
        return res.status(400).json({ success: false, message: 'Project ID is required.' });
    }

    const sql = `
        SELECT
            id,
            project_id,
            reporting_month AS "reportingMonth",
            overall_status AS "overallStatus",
            completion_percentage AS "completionPercentage",
            previous_completion AS "previousCompletion",
            planned_summary AS "plannedSummary",
            completed_summary AS "completedSummary",
            pending_summary AS "pendingSummary",
            technical_progress AS "technicalProgress",
            technologies_used AS "technologiesUsed",
            prototype_status AS "prototypeStatus",
            testing_summary AS "testingSummary",
            achievements,
            challenges,
            support_required AS "supportRequired",
            next_month_plan AS "nextMonthPlan",
            next_month_target AS "nextMonthTarget",
            amount_spent_this_month AS "amountSpentThisMonth",
            total_spent_to_date AS "totalSpentToDate",
            remaining_budget AS "remainingBudget",
            funding_required AS "fundingRequired",
            submitted_at AS "submittedAt"
        FROM project_reports
        WHERE project_id = $1
        ORDER BY submitted_at DESC
    `;

    db.query(sql, [projectId], (err, rows) => {
        if (err) {
            console.error('GET PROJECT REPORTS ERROR:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch project reports.' });
        }

        res.json({
            success: true,
            reports: normalizeRows(rows).map((row) => ({
                ...row,
                projectId: row.project_id,
                id: row.id,
                reportingMonth: row.reportingMonth,
                overallStatus: row.overallStatus,
                completionPercentage: row.completionPercentage,
                previousCompletion: row.previousCompletion,
                plannedSummary: row.plannedSummary,
                completedSummary: row.completedSummary,
                pendingSummary: row.pendingSummary,
                technicalProgress: row.technicalProgress,
                technologiesUsed: row.technologiesUsed,
                prototypeStatus: row.prototypeStatus,
                testingSummary: row.testingSummary,
                supportRequired: row.supportRequired,
                nextMonthPlan: row.nextMonthPlan,
                nextMonthTarget: row.nextMonthTarget,
                amountSpentThisMonth: row.amountSpentThisMonth,
                totalSpentToDate: row.totalSpentToDate,
                remainingBudget: row.remainingBudget,
                fundingRequired: row.fundingRequired,
                submittedAt: row.submittedAt
            }))
        });
    });
});

router.post('/', upload.array('evidenceFiles', 10), (req, res) => {
    const body = req.body || {};
    const projectId = String(body.projectId || '').trim();
    const reportingMonth = String(body.reportingMonth || '').trim();
    const overallStatus = String(body.overallStatus || '').trim();
    const completionPercentage = Number(body.completionPercentage || 0);
    const plannedSummary = String(body.plannedSummary || '').trim();
    const completedSummary = String(body.completedSummary || '').trim();

    if (!projectId || !reportingMonth || !overallStatus || !plannedSummary || !completedSummary) {
        return res.status(400).json({ success: false, message: 'Project, month, status and summaries are required.' });
    }

    let milestones = [];
    let expenses = [];

    try {
        milestones = body.milestones ? JSON.parse(body.milestones) : [];
        expenses = body.expenses ? JSON.parse(body.expenses) : [];
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid report payload.' });
    }

    const sql = `
        INSERT INTO project_reports (
            project_id,
            reporting_month,
            overall_status,
            completion_percentage,
            previous_completion,
            planned_summary,
            completed_summary,
            pending_summary,
            technical_progress,
            technologies_used,
            prototype_status,
            testing_summary,
            achievements,
            challenges,
            support_required,
            next_month_plan,
            next_month_target,
            amount_spent_this_month,
            total_spent_to_date,
            remaining_budget,
            funding_required
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        ) RETURNING *;
    `;

    const params = [
        Number(projectId),
        reportingMonth,
        overallStatus,
        Number.isFinite(completionPercentage) ? completionPercentage : 0,
        body.previousCompletion === '' || body.previousCompletion == null ? null : Number(body.previousCompletion),
        plannedSummary,
        completedSummary,
        body.pendingSummary || null,
        body.technicalProgress || null,
        body.technologiesUsed || null,
        body.prototypeStatus || null,
        body.testingSummary || null,
        body.achievements || null,
        body.challenges || null,
        body.supportRequired || null,
        body.nextMonthPlan || null,
        body.nextMonthTarget === '' || body.nextMonthTarget == null ? null : Number(body.nextMonthTarget),
        body.amountSpentThisMonth === '' || body.amountSpentThisMonth == null ? null : Number(body.amountSpentThisMonth),
        body.totalSpentToDate === '' || body.totalSpentToDate == null ? null : Number(body.totalSpentToDate),
        body.remainingBudget === '' || body.remainingBudget == null ? null : Number(body.remainingBudget),
        body.fundingRequired === 'true' || body.fundingRequired === true
    ];

    db.query(sql, params, (err, rows) => {
        if (err) {
            console.error('POST PROJECT REPORT ERROR:', err);
            return res.status(500).json({ success: false, message: 'Failed to save the monthly report.' });
        }

        const saved = normalizeRows(rows)[0];

        res.status(201).json({
            success: true,
            report: {
                id: saved.id,
                projectId: saved.project_id,
                reportingMonth: saved.reporting_month,
                overallStatus: saved.overall_status,
                completionPercentage: saved.completion_percentage,
                milestones,
                expenses
            },
            message: 'Report submitted successfully.'
        });
    });
});

module.exports = router;
