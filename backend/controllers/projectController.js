const db = require('../config/db');

const { predict } = require('../services/mlService');

const { riskFromScores, clamp } = require('../utils/risk');

const { makeReport } = require('../services/reportService');


async function list(req, res, next) {
    try {
        const { sector, state, ministry, risk_level, project_type, search } = req.query;

        let w = [], p = [], i = 1;

        if (sector) {
            w.push(`p.sector=$${i++}`);
            p.push(sector);
        }

        if (state) {
            w.push(`p.state=$${i++}`);
            p.push(state);
        }

        if (ministry) {
            w.push(`p.ministry=$${i++}`);
            p.push(ministry);
        }

        if (risk_level) {
            w.push(`p.risk_level=$${i++}`);
            p.push(risk_level);
        }

        if (project_type) {
            w.push(`p.project_type=$${i++}`);
            p.push(project_type);
        }

        if (search) {
            w.push(`(p.name ILIKE $${i} OR p.project_code ILIKE $${i})`);
            p.push(`%${search}%`);
            i++;
        }

        const q = `
            SELECT
                p.*,
                c.name contractor_name,
                c.contact_email contractor_email,
                o.name officer_name,
                o.designation officer_designation
            FROM projects p
            LEFT JOIN contractors c ON c.id=p.contractor_id
            LEFT JOIN officers o ON o.id=p.officer_id
            ${w.length ? 'WHERE ' + w.join(' AND ') : ''}
            ORDER BY p.project_code
        `;

        const r = await db.query(q, p);

        res.json({
            success: true,
            data: r.rows,
            count: r.rowCount
        });
    } catch (e) {
        next(e);
    }
}


async function get(req, res, next) {
    try {
        const r = await db.query(`
            SELECT
                p.*,
                c.name contractor_name,
                c.contact_email contractor_email,
                c.phone contractor_phone,
                o.name officer_name,
                o.designation officer_designation,
                o.email officer_email,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', sp.id,
                            'url', sp.photo_url,
                            'caption', sp.caption,
                            'captured_at', sp.captured_at
                        )
                    ) FILTER (WHERE sp.id IS NOT NULL),
                    '[]'
                ) photos,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'date', ph.month_date,
                            'progress', ph.progress_pct,
                            'expenditure', ph.expenditure_crore
                        )
                    ) FILTER (WHERE ph.id IS NOT NULL),
                    '[]'
                ) progress_history
            FROM projects p
            LEFT JOIN contractors c ON c.id=p.contractor_id
            LEFT JOIN officers o ON o.id=p.officer_id
            LEFT JOIN site_photos sp ON sp.project_id=p.id
            LEFT JOIN progress_history ph ON ph.project_id=p.id
            WHERE p.id=$1
            GROUP BY p.id,c.id,o.id
        `, [req.params.id]);

        if (!r.rowCount) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: r.rows[0]
        });
    } catch (e) {
        next(e);
    }
}


function featurePayload(p, overrides = {}) {
    const x = {
        sector: p.sector,
        implementing_agency: p.implementing_agency,
        original_commissioning_month: p.original_commissioning_month,
        original_commissioning_year: p.original_commissioning_year,
        original_cost_crore: p.original_cost_crore,
        planned_duration_months: p.planned_duration_months,
        manpower: p.manpower,
        project_scale: p.project_scale,
        project_complexity: p.project_complexity,
        land_acquisition_risk: p.land_acquisition_risk,
        clearance_complexity: p.clearance_complexity,
        procurement_complexity: p.procurement_complexity,
        progress_pct: Number(p.progress_pct || 0),
        ...overrides
    };

    return x;
}


async function analysis(req, res, next) {
    try {
        const r = await db.query(
            'SELECT * FROM projects WHERE id=$1',
            [req.params.id]
        );

        if (!r.rowCount) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const p = r.rows[0];

        const out = await predict(
            featurePayload(p, req.body || {}),
            {
                scenario: false
            }
        );

        res.json({
            success: true,
            data: out
        });
    } catch (e) {
        next(e);
    }
}


async function report(req, res, next) {
    try {
        const r = await db.query(`
            SELECT
                p.*,
                c.name contractor_name,
                o.name officer_name
            FROM projects p
            LEFT JOIN contractors c ON c.id=p.contractor_id
            LEFT JOIN officers o ON o.id=p.officer_id
            WHERE p.id=$1
        `, [req.params.id]);

        if (!r.rowCount) {
            return res.status(404).end();
        }

        const p = r.rows[0];

        const out = await predict(
            featurePayload(
                p,
                req.body?.features || {}
            ),
            {
                scenario: false
            }
        );

        let scenario = req.body?.scenario || null;

        if (scenario) {
            const so = await predict(
                featurePayload(
                    p,
                    scenario.features || {}
                ),
                {
                    scenario: true
                }
            );

            scenario = {
                ...scenario,
                risk_score: so.risk_score,
                risk_level: so.risk_level,
                cost_overrun_pct: so.cost_overrun_pct,
                extra_expenditure_crore: so.extra_expenditure_crore,
                time_overrun_pct: so.time_overrun_pct,
                delay_time_months: so.delay_time_months
            };
        }

        makeReport(p, out, scenario, res);
    } catch (e) {
        next(e);
    }
}


async function filters(req, res, next) {
    try {
        const fields = [
            'sector',
            'state',
            'ministry',
            'project_type',
            'risk_level'
        ];

        const data = {};

        for (const f of fields) {
            const r = await db.query(
                `SELECT DISTINCT ${f} value FROM projects WHERE ${f} IS NOT NULL ORDER BY ${f}`
            );

            data[f] = r.rows.map(x => x.value);
        }

        res.json({
            success: true,
            data
        });
    } catch (e) {
        next(e);
    }
}


module.exports = {
    list,
    get,
    analysis,
    report,
    filters
};