let p;
let analysis = null;
let scenario = null;
let pm;
let scenarioTimer;

const $ = id => document.getElementById(id);

const id = new URLSearchParams(
    location.search
).get('id');

const isAnalysisPage =
    location.pathname.endsWith('/project-analysis.html');

function requireOfficerAccess() {
    try {
        const session = JSON.parse(localStorage.getItem('loggedInUser') || 'null');

        if (session && session.role === 'government') {
            return true;
        }
    } catch (error) {
        localStorage.removeItem('loggedInUser');
    }

    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(`/dashboard/src/frontend/login/login.html?redirect=${redirect}`);
    return false;
}


async function api(url, opt) {
    const r = await fetch(
        url,
        opt
    );

    const j = await r.json();

    if (!r.ok) {
        throw Error(
            j.message ||
            j.detail ||
            'Request failed'
        );
    }

    return j;
}


function esc(s) {
    return String(
        s ?? ''
    ).replace(
        /[&<>"']/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c])
    );
}


function rc(x) {
    return x === 'High'
        ? 'high'
        : x === 'Medium'
            ? 'medium'
            : 'low';
}


function render() {
    $('loading').hidden = true;
    $('content').hidden = false;

    $('code').textContent =
        p.project_code;

    $('name').textContent =
        p.name;

    $('meta').textContent =
        `${p.place}, ${p.state} • ${p.sector} • ${p.ministry}`;

    $('riskBadge').className =
        `risk-badge ${rc(p.risk_level)}`;

    $('riskBadge').textContent =
        `${Number(
            p.risk_percentage || 0
        ).toFixed(0)}% registry risk`;

    $('details').innerHTML = [
        [
            'Project ID',
            p.project_code
        ],

        [
            'Type',
            p.project_type
        ],

        [
            'Implementing agency',
            p.implementing_agency
        ],

        [
            'Original cost',
            `₹${Number(
                p.original_cost_crore
            ).toLocaleString(
                'en-IN'
            )} crore`
        ],

        [
            'Planned duration',
            `${p.planned_duration_months} months`
        ],

        [
            'Current progress',
            `${p.progress_pct}%`
        ],

        [
            'Manpower',
            Number(
                p.manpower
            ).toLocaleString(
                'en-IN'
            )
        ],

        [
            'Contractor',
            p.contractor_name
        ],

        [
            'Officer',
            `${p.officer_name} • ${p.officer_designation}`
        ],

        [
            'Coordinates',
            `${p.latitude}, ${p.longitude}`
        ]
    ]
        .map(x => `
            <div>
                <span>${esc(x[0])}</span>
                <strong>${esc(x[1])}</strong>
            </div>
        `)
        .join('');

    $('photos').innerHTML =
        (p.photos || [])
            .map(x => `
                <figure>
                    <img
                        src="${esc(x.url)}"
                        onerror="this.style.display='none'"
                    >

                    <figcaption>
                        ${esc(
                            x.caption ||
                            'Site evidence'
                        )}

                        <small>
                            ${esc(
                                x.captured_at ||
                                ''
                            )}
                        </small>
                    </figcaption>
                </figure>
            `)
            .join('') ||
        '<div class="empty">No site photos registered.</div>';

    pm = L
        .map('projectMap', {
            zoomControl: false,
            zoomSnap: 0.5,
            zoomDelta: 0.5
        })
        .setView(
            [
                Number(p.latitude),
                Number(p.longitude)
            ],
            10
        );

    L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
            attribution:
                'Tiles &copy; Esri, HERE, Garmin, USGS, Intermap, increment P Corp. and the GIS user community',
            maxZoom: 19
        }
    ).addTo(pm);

    L.control.zoom({ position: 'topright' }).addTo(pm);
    L.control.scale({ imperial: false }).addTo(pm);

    L.marker([
        Number(p.latitude),
        Number(p.longitude)
    ])
        .addTo(pm)
        .bindPopup(`
            <b>${esc(p.name)}</b>
            <br>
            ${esc(p.place)}, ${esc(p.state)}
        `)
        .openPopup();

    fillScenario();
    bindScenario();
}


function fillScenario() {
    const manpower = Math.max(
        20,
        Math.min(
            1500,
            Number(p.manpower) || 100
        )
    );

    const budget = Math.max(
        150,
        Math.min(
            50000,
            Number(
                p.original_cost_crore
            ) || 500
        )
    );

    const duration = Math.max(
        6,
        Math.min(
            120,
            Number(
                p.planned_duration_months
            ) || 24
        )
    );

    $('sManpower').value =
        manpower;

    $('sBudget').value =
        budget;

    $('sDuration').value =
        duration;

    updateSliderLabels();
}


function updateSliderLabels() {
    $('manpowerValue').textContent =
        `${Number(
            $('sManpower').value
        ).toLocaleString(
            'en-IN'
        )} personnel`;

    $('budgetValue').textContent =
        `₹${Number(
            $('sBudget').value
        ).toLocaleString(
            'en-IN'
        )} Cr`;

    $('durationValue').textContent =
        `${$('sDuration').value} months`;
}


function featureValues() {
    return {
        sector:
            p.sector,

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

        /*
         * What-If controls
         */

        original_cost_crore:
            Number(
                $('sBudget').value
            ),

        planned_duration_months:
            Number(
                $('sDuration').value
            ),

        manpower:
            Number(
                $('sManpower').value
            ),

        /*
         * Fixed project characteristics
         */

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
                p.progress_pct
            )
    };
}


async function runAnalysis(
    features = {},
    scenario = false
) {
    const result = await api(
        `/api/projects/${id}/analysis`,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({
                ...features,
                scenario
            })
        }
    );

    return result.data;
}


function renderMetrics(a) {
    $('riskScore').textContent =
        `${Number(
            a.risk_score
        ).toFixed(1)}%`;

    $('riskLevel').textContent =
        a.risk_level;

    $('costOverrun').textContent =
        `${Number(
            a.cost_overrun_pct
        ).toFixed(1)}%`;

    $('extraExpenditure').textContent =
        `₹${Number(
            a.extra_expenditure_crore
        ).toLocaleString(
            'en-IN'
        )}`;

    $('timeOverrun').textContent =
        `${Number(
            a.time_overrun_pct
        ).toFixed(1)}%`;

    $('delayTime').textContent =
        `${Number(
            a.delay_time_months
        ).toFixed(1)} mo`;

    $('riskMeterFill').style.width =
        `${Math.min(
            100,
            Number(a.risk_score) || 0
        )}%`;

    $('riskSummary').textContent =
        `${a.risk_level} exposure: ` +
        `${Number(
            a.risk_score
        ).toFixed(1)}% total risk, ` +
        `driven by predicted schedule ` +
        `and financial impact.`;

    $('costBar').style.width =
        `${Math.min(
            100,
            Number(a.cost_overrun_pct) || 0
        )}%`;

    $('timeBar').style.width =
        `${Math.min(
            100,
            Number(a.time_overrun_pct) || 0
        )}%`;

    $('delayBar').style.width =
        `${Math.min(
            100,
            (
                Number(
                    a.delay_time_months
                ) /
                Math.max(
                    1,
                    Number(
                        p.planned_duration_months
                    )
                )
            ) * 100
        )}%`;

    $('costBarValue').textContent =
        `${Number(
            a.cost_overrun_pct
        ).toFixed(1)}%`;

    $('timeBarValue').textContent =
        `${Number(
            a.time_overrun_pct
        ).toFixed(1)}%`;

    $('delayBarValue').textContent =
        `${Number(
            a.delay_time_months
        ).toFixed(1)} mo`;

    $('drivers').innerHTML =
        (a.drivers || [])
            .slice(0, 5)
            .map(d => `
                <div class="driver">
                    <div>
                        <b>${esc(d.label)}</b>
                        <span>${esc(d.value)}</span>
                    </div>

                    <strong class="pill ${rc(
                        d.impact
                    )}">
                        ${esc(d.impact)}
                    </strong>
                </div>
            `)
            .join('');

    $('recommendations').innerHTML =
        (a.recommendations || [])
            .map(x => `
                <li>${esc(x)}</li>
            `)
            .join('');
}


function renderAnalysis() {
    $('analysisEmpty').hidden =
        true;

    $('analysisView').hidden =
        false;

    renderMetrics(
        analysis
    );

    renderShapAnalysis(
        analysis.shap
    );
}


function renderShapRows(items) {
    return (items || []).map(item => {
        const value = Number(item.contribution);
        const width = Math.min(100, Math.max(4, Math.abs(value) * 5));
        const direction = value >= 0 ? 'positive' : 'negative';

        return `<div class="shap-row"><div class="shap-row-head"><b>${esc(item.label)}</b><span>${esc(item.value)}</span><strong class="${direction}">${value >= 0 ? '+' : ''}${value.toFixed(2)}</strong></div><div class="shap-track"><i class="${direction}" style="width:${width}%"></i></div><small>${value >= 0 ? 'Increases' : 'Reduces'} prediction</small></div>`;
    }).join('');
}


function renderShapInteractions(items) {
    return (items || []).map(item => {
        const value = Number(item.contribution);
        return `<div class="shap-interaction"><span>${esc(item.label)}</span><b class="${value >= 0 ? 'positive' : 'negative'}">${value >= 0 ? '+' : ''}${value.toFixed(2)}</b></div>`;
    }).join('') || '<p class="muted">No strong interaction found.</p>';
}


function renderShapAnalysis(shap) {
    if (!shap) return;

    $('shapCost').innerHTML = renderShapRows(shap.cost_overrun?.features);
    $('shapTime').innerHTML = renderShapRows(shap.time_overrun?.features);
    $('shapRisk').innerHTML = renderShapRows(shap.risk?.features);
    $('shapCostInteractions').innerHTML = renderShapInteractions(shap.cost_overrun?.interactions);
    $('shapTimeInteractions').innerHTML = renderShapInteractions(shap.time_overrun?.interactions);
}


async function updateScenario() {
    updateSliderLabels();

    try {
        /*
         * Generate the baseline analysis first
         * if it has not already been generated.
         */

        if (!analysis) {
            analysis =
                await runAnalysis(
                    {},
                    false
                );
        }

        /*
         * Read the three What-If controls.
         *
         * This creates a new feature object.
         * It does NOT modify the database.
         */

        const features =
            featureValues();

        /*
         * IMPORTANT:
         *
         * scenario MUST be true here.
         *
         * This tells the ML service to apply
         * the What-If adjustment logic.
         */

        scenario =
            await runAnalysis(
                features,
                true
            );

        $('scenarioResult').hidden =
            false;

        /*
         * Baseline risk
         */

        $('baseRisk').textContent =
            `${Number(
                analysis.risk_score
            ).toFixed(1)}%`;

        /*
         * Scenario risk
         */

        $('scenarioRisk').textContent =
            `${Number(
                scenario.risk_score
            ).toFixed(1)}%`;

        /*
         * Risk difference
         */

        const d = Number(
            (
                Number(
                    scenario.risk_score
                ) -
                Number(
                    analysis.risk_score
                )
            ).toFixed(1)
        );

        $('riskChange').textContent =
            `${d > 0 ? '+' : ''}${d} pts`;

        $('riskChange').className =
            d > 0
                ? 'bad'
                : d < 0
                    ? 'good'
                    : '';

        /*
         * Scenario cost impact
         */

        $('scCost').textContent =
            `${Number(
                scenario.cost_overrun_pct
            ).toFixed(1)}%`;

        $('scExtra').textContent =
            `₹${Number(
                scenario.extra_expenditure_crore
            ).toLocaleString(
                'en-IN'
            )} Cr`;

        /*
         * Scenario time impact
         */

        $('scTime').textContent =
            `${Number(
                scenario.time_overrun_pct
            ).toFixed(1)}%`;

        $('scDelay').textContent =
            `${Number(
                scenario.delay_time_months
            ).toFixed(1)} mo`;

    } catch (e) {
        console.error(
            'Scenario calculation failed:',
            e
        );

        $('scenarioResult').hidden =
            false;

        $('riskChange').textContent =
            'Calculation failed';

        $('riskChange').className =
            'bad';
    }
}


function bindScenario() {
    [
        'sManpower',
        'sBudget',
        'sDuration'
    ].forEach(controlId => {
        $(controlId).addEventListener(
            'input',
            () => {
                clearTimeout(
                    scenarioTimer
                );

                scenarioTimer =
                    setTimeout(
                        updateScenario,
                        250
                    );
            }
        );
    });

    $('resetScenario').onclick =
        () => {
            fillScenario();

            updateScenario();
        };
}


async function main() {
    if (!requireOfficerAccess()) {
        return;
    }

    try {
        /*
         * Load project details
         */

        p = (
            await api(
                '/api/projects/' +
                id
            )
        ).data;

        /*
         * Render project page
         */

        render();

        /*
         * Get Analysis button
         */

        $('analysisBtn').onclick =
            async () => {
                if (!isAnalysisPage) {
                    window.location.href =
                        `/pages/project-analysis.html?id=${encodeURIComponent(id)}`;

                    return;
                }

                try {
                    $('analysisBtn').disabled =
                        true;

                    $('analysisBtn').textContent =
                        'Running model…';

                    /*
                     * Baseline prediction.
                     *
                     * No slider values are sent.
                     * Backend gets the real project
                     * values from the database.
                     */

                    analysis =
                        await runAnalysis(
                            {},
                            false
                        );

                    renderAnalysis();

                    /*
                     * Automatically calculate the
                     * current What-If scenario.
                     */

                    await updateScenario();

                } catch (e) {
                    console.error(
                        'Analysis failed:',
                        e
                    );

                    alert(
                        e.message
                    );

                } finally {
                    $('analysisBtn').disabled =
                        false;

                    $('analysisBtn').textContent =
                        'Get Analysis';
                }
            };

        /*
         * Download PDF
         */

        $('downloadBtn').onclick =
            async () => {
                try {
                    $('downloadBtn').disabled =
                        true;

                    /*
                     * Get the current slider values.
                     */

                    const currentFeatures =
                        featureValues();

                    /*
                     * Build report request.
                     */

                    const body = {
                        features:
                            currentFeatures,

                        scenario:
                            scenario
                                ? {
                                    ...scenario,

                                    features:
                                        currentFeatures,

                                    manpower:
                                        Number(
                                            $('sManpower')
                                                .value
                                        ),

                                    original_cost_crore:
                                        Number(
                                            $('sBudget')
                                                .value
                                        ),

                                    planned_duration_months:
                                        Number(
                                            $('sDuration')
                                                .value
                                        )
                                }
                                : null
                    };

                    const r =
                        await fetch(
                            `/api/projects/${id}/report`,
                            {
                                method:
                                    'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body:
                                    JSON.stringify(
                                        body
                                    )
                            }
                        );

                    if (!r.ok) {
                        let message =
                            'Could not generate PDF';

                        try {
                            const error =
                                await r.json();

                            message =
                                error.message ||
                                error.detail ||
                                message;

                        } catch {
                            /*
                             * Keep default message
                             * if response is not JSON.
                             */
                        }

                        throw Error(
                            message
                        );
                    }

                    /*
                     * Convert response into
                     * downloadable PDF blob.
                     */

                    const blob =
                        await r.blob();

                    const a =
                        document.createElement(
                            'a'
                        );

                    a.href =
                        URL.createObjectURL(
                            blob
                        );

                    a.download =
                        `${p.project_code}_analysis.pdf`;

                    document.body.appendChild(
                        a
                    );

                    a.click();

                    a.remove();

                    URL.revokeObjectURL(
                        a.href
                    );

                } catch (e) {
                    console.error(
                        'PDF generation failed:',
                        e
                    );

                    alert(
                        e.message
                    );

                } finally {
                    $('downloadBtn').disabled =
                        false;
                }
            };

    } catch (e) {
        console.error(
            'Project loading failed:',
            e
        );

        $('loading').textContent =
            e.message;
    }
}


main();