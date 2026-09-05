const db = require('../config/db');

const { predict } = require('../services/mlService');

const { makeReport } = require('../services/reportService');


async function list(req, res, next) {
    try {
        const {
            sector,
            state,
            ministry,
            risk_level,
            project_type,
            search
        } = req.query;

        let w = [];
        let p = [];
        let i = 1;

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
            w.push(
                `(p.name ILIKE $${i} OR p.project_code ILIKE $${i})`
            );

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
            LEFT JOIN contractors c
                ON c.id = p.contractor_id
            LEFT JOIN officers o
                ON o.id = p.officer_id
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
                    ) FILTER (
                        WHERE sp.id IS NOT NULL
                    ),
                    '[]'
                ) photos,

                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'date', ph.month_date,
                            'progress', ph.progress_pct,
                            'expenditure', ph.expenditure_crore
                        )
                    ) FILTER (
                        WHERE ph.id IS NOT NULL
                    ),
                    '[]'
                ) progress_history

            FROM projects p

            LEFT JOIN contractors c
                ON c.id = p.contractor_id

            LEFT JOIN officers o
                ON o.id = p.officer_id

            LEFT JOIN site_photos sp
                ON sp.project_id = p.id

            LEFT JOIN progress_history ph
                ON ph.project_id = p.id

            WHERE p.id = $1

            GROUP BY
                p.id,
                c.id,
                o.id
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


function featurePayload(
    p,
    overrides = {}
) {
    const x = {
        sector: p.sector,

        implementing_agency:
            p.implementing_agency,

        original_commissioning_month:
            Number(
                p.original_commissioning_month
            ),

        original_commissioning_year:
            Number(
                p.original_commissioning_year
            ),

        original_cost_crore:
            Number(
                p.original_cost_crore
            ),

        planned_duration_months:
            Number(
                p.planned_duration_months
            ),

        manpower:
            Number(
                p.manpower
            ),

        project_scale:
            p.project_scale,

        project_complexity:
            Number(
                p.project_complexity
            ),

        land_acquisition_risk:
            p.land_acquisition_risk,

        clearance_complexity:
            p.clearance_complexity,

        procurement_complexity:
            p.procurement_complexity,

        progress_pct:
            Number(
                p.progress_pct || 0
            ),

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

        const project = r.rows[0];

        const body = req.body || {};

        const scenario =
            body.scenario === true;

        const overrides = {
            ...body
        };

        delete overrides.scenario;

        delete overrides.baseline_manpower;
        delete overrides.baseline_original_cost;
        delete overrides.baseline_duration;

        const features = featurePayload(
            project,
            overrides
        );

        const result = await predict(
            features,
            {
                scenario,

                baseline_manpower:
                    Number(project.manpower),

                baseline_original_cost:
                    Number(
                        project.original_cost_crore
                    ),

                baseline_duration:
                    Number(
                        project.planned_duration_months
                    )
            }
        );

        res.json({
            success: true,
            data: result
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

            LEFT JOIN contractors c
                ON c.id = p.contractor_id

            LEFT JOIN officers o
                ON o.id = p.officer_id

            WHERE p.id = $1
        `, [req.params.id]);

        if (!r.rowCount) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const project = r.rows[0];

        const reportFeatures =
            req.body?.features || {};

        const analysis = await predict(
            featurePayload(
                project,
                reportFeatures
            ),
            {
                scenario: false
            }
        );

        let scenario =
            req.body?.scenario || null;

        if (scenario) {
            const scenarioFeatures =
                featurePayload(
                    project,
                    scenario.features || {}
                );

            const scenarioResult =
                await predict(
                    scenarioFeatures,
                    {
                        scenario: true,

                        baseline_manpower:
                            Number(
                                project.manpower
                            ),

                        baseline_original_cost:
                            Number(
                                project.original_cost_crore
                            ),

                        baseline_duration:
                            Number(
                                project.planned_duration_months
                            )
                    }
                );

            scenario = {
                ...scenario,

                risk_score:
                    scenarioResult.risk_score,

                risk_level:
                    scenarioResult.risk_level,

                cost_overrun_pct:
                    scenarioResult.cost_overrun_pct,

                extra_expenditure_crore:
                    scenarioResult.extra_expenditure_crore,

                time_overrun_pct:
                    scenarioResult.time_overrun_pct,

                delay_time_months:
                    scenarioResult.delay_time_months
            };
        }

        makeReport(
            project,
            analysis,
            scenario,
            res
        );

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

        for (const field of fields) {
            const r = await db.query(
                `SELECT DISTINCT ${field} value
                 FROM projects
                 WHERE ${field} IS NOT NULL
                 ORDER BY ${field}`
            );

            data[field] = r.rows.map(
                x => x.value
            );
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