let p, analysis = null, scenario = null, pm, scenarioTimer;
const $ = id => document.getElementById(id);
const id = new URLSearchParams(location.search).get('id');

async function api(url, opt) {
    const r = await fetch(url, opt);
    const j = await r.json();

    if (!r.ok) {
        throw Error(j.message || j.detail || 'Request failed');
    }

    return j;
}

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
}

function rc(x) {
    return x === 'High' ? 'high' :
        x === 'Medium' ? 'medium' :
        'low';
}

function render() {
    $('loading').hidden = true;
    $('content').hidden = false;

    $('code').textContent = p.project_code;
    $('name').textContent = p.name;

    $('meta').textContent =
        `${p.place}, ${p.state} • ${p.sector} • ${p.ministry}`;

    $('riskBadge').className =
        `risk-badge ${rc(p.risk_level)}`;

    $('riskBadge').textContent =
        `${Number(p.risk_percentage || 0).toFixed(0)}% registry risk`;

    $('details').innerHTML = [
        ['Project ID', p.project_code],
        ['Type', p.project_type],
        ['Implementing agency', p.implementing_agency],
        [
            'Original cost',
            `₹${Number(p.original_cost_crore).toLocaleString('en-IN')} crore`
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
            Number(p.manpower).toLocaleString('en-IN')
        ],
        ['Contractor', p.contractor_name],
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
                        ${esc(x.caption || 'Site evidence')}
                        <small>
                            ${esc(x.captured_at || '')}
                        </small>
                    </figcaption>
                </figure>
            `)
            .join('') ||
        '<div class="empty">No site photos registered.</div>';

    pm = L
        .map('projectMap')
        .setView(
            [Number(p.latitude), Number(p.longitude)],
            8
        );

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap contributors'
        }
    ).addTo(pm);

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
            Number(p.original_cost_crore) || 500
        )
    );

    const duration = Math.max(
        6,
        Math.min(
            120,
            Number(p.planned_duration_months) || 24
        )
    );

    $('sManpower').value = manpower;
    $('sBudget').value = budget;
    $('sDuration').value = duration;

    updateSliderLabels();
}

function updateSliderLabels() {
    $('manpowerValue').textContent =
        `${Number($('sManpower').value).toLocaleString('en-IN')} personnel`;

    $('budgetValue').textContent =
        `₹${Number($('sBudget').value).toLocaleString('en-IN')} Cr`;

    $('durationValue').textContent =
        `${$('sDuration').value} months`;
}

function featureValues() {
    return {
        sector: p.sector,

        implementing_agency:
            p.implementing_agency,

        original_commissioning_month:
            Number(p.original_commissioning_month),

        original_commissioning_year:
            Number(p.original_commissioning_year),

        original_cost_crore:
            Number($('sBudget').value),

        planned_duration_months:
            Number($('sDuration').value),

        manpower:
            Number($('sManpower').value),

        project_scale:
            p.project_scale,

        project_complexity:
            Number(p.project_complexity),

        land_acquisition_risk:
            p.land_acquisition_risk,

        clearance_complexity:
            p.clearance_complexity,

        procurement_complexity:
            p.procurement_complexity,

        progress_pct:
            Number(p.progress_pct)
    };
}

async function runAnalysis(features, scenario = false) {
    return (
        await api(
            `/api/projects/${id}/analysis`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...features,
                    scenario
                })
            }
        )
    ).data;
}

function renderMetrics(a) {
    $('riskScore').textContent =
        `${a.risk_score}%`;

    $('riskLevel').textContent =
        a.risk_level;

    $('costOverrun').textContent =
        `${a.cost_overrun_pct}%`;

    $('extraExpenditure').textContent =
        `₹${Number(a.extra_expenditure_crore).toLocaleString('en-IN')}`;

    $('timeOverrun').textContent =
        `${a.time_overrun_pct}%`;

    $('delayTime').textContent =
        `${a.delay_time_months} mo`;

    $('riskMeterFill').style.width =
        `${Math.min(100, a.risk_score)}%`;

    $('riskSummary').textContent =
        `${a.risk_level} exposure: ${a.risk_score}% total risk, driven by predicted schedule and financial impact.`;

    $('costBar').style.width =
        `${Math.min(100, a.cost_overrun_pct)}%`;

    $('timeBar').style.width =
        `${Math.min(100, a.time_overrun_pct)}%`;

    $('delayBar').style.width =
        `${Math.min(
            100,
            a.delay_time_months /
            Math.max(
                1,
                Number(p.planned_duration_months)
            ) *
            100
        )}%`;

    $('costBarValue').textContent =
        `${a.cost_overrun_pct}%`;

    $('timeBarValue').textContent =
        `${a.time_overrun_pct}%`;

    $('delayBarValue').textContent =
        `${a.delay_time_months} mo`;

    $('drivers').innerHTML =
        a.drivers
            .slice(0, 5)
            .map(d => `
                <div class="driver">
                    <div>
                        <b>${esc(d.label)}</b>
                        <span>${esc(d.value)}</span>
                    </div>

                    <strong class="pill ${rc(d.impact)}">
                        ${esc(d.impact)}
                    </strong>
                </div>
            `)
            .join('');

    $('recommendations').innerHTML =
        a.recommendations
            .map(x => `
                <li>${esc(x)}</li>
            `)
            .join('');
}

function renderAnalysis() {
    $('analysisEmpty').hidden = true;
    $('analysisView').hidden = false;

    renderMetrics(analysis);
}

async function updateScenario() {
    updateSliderLabels();

    try {
        /*
         * If baseline analysis has not been generated yet,
         * calculate it first.
         */

        if (!analysis) {
            analysis = await runAnalysis({});
        }

        /*
         * Create a NEW feature set from the slider values.
         * This does not modify the actual project in the database.
         */

        const features = featureValues();

        scenario = await runAnalysis(features);

        $('scenarioResult').hidden = false;

        /*
         * Baseline risk
         */

        $('baseRisk').textContent =
            `${analysis.risk_score}%`;

        /*
         * Scenario risk
         */

        $('scenarioRisk').textContent =
            `${scenario.risk_score}%`;

        /*
         * Difference between scenario and baseline.
         */

        const d = Number(
            (
                scenario.risk_score -
                analysis.risk_score
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
            `${scenario.cost_overrun_pct}%`;

        $('scExtra').textContent =
            `₹${Number(
                scenario.extra_expenditure_crore
            ).toLocaleString('en-IN')} Cr`;

        /*
         * Scenario time impact
         */

        $('scTime').textContent =
            `${scenario.time_overrun_pct}%`;

        $('scDelay').textContent =
            `${scenario.delay_time_months} mo`;

    } catch (e) {
        console.error(
            'Scenario calculation failed:',
            e
        );
    }
}

function bindScenario() {
    [
        'sManpower',
        'sBudget',
        'sDuration'
    ].forEach(id => {
        $(id).addEventListener(
            'input',
            () => {
                clearTimeout(scenarioTimer);

                scenarioTimer = setTimeout(
                    updateScenario,
                    250
                );
            }
        );
    });

    $('resetScenario').onclick = () => {
        fillScenario();
        updateScenario();
    };
}

async function main() {
    try {
        p = (
            await api(
                '/api/projects/' + id
            )
        ).data;

        render();

        $('analysisBtn').onclick = async () => {
            try {
                $('analysisBtn').disabled = true;
                $('analysisBtn').textContent =
                    'Running model…';

                /*
                 * Run baseline using the actual
                 * project values.
                 */

                analysis = await runAnalysis();

                renderAnalysis();

                /*
                 * Then calculate the current
                 * What-If scenario.
                 */

                await updateScenario();

            } catch (e) {
                alert(e.message);
            } finally {
                $('analysisBtn').disabled = false;
                $('analysisBtn').textContent =
                    'Get Analysis';
            }
        };

        $('downloadBtn').onclick = async () => {
            try {
                $('downloadBtn').disabled = true;

                const currentFeatures =
                    featureValues();

                const body = {
                    features: currentFeatures,

                    scenario: scenario
                        ? {
                            ...scenario,

                            features:
                                currentFeatures,

                            manpower:
                                Number(
                                    $('sManpower').value
                                ),

                            original_cost_crore:
                                Number(
                                    $('sBudget').value
                                ),

                            planned_duration_months:
                                Number(
                                    $('sDuration').value
                                )
                        }
                        : null
                };

                const r = await fetch(
                    `/api/projects/${id}/report`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(body)
                    }
                );

                if (!r.ok) {
                    throw Error(
                        'Could not generate PDF'
                    );
                }

                const blob = await r.blob();

                const a =
                    document.createElement('a');

                a.href =
                    URL.createObjectURL(blob);

                a.download =
                    `${p.project_code}_analysis.pdf`;

                a.click();

                URL.revokeObjectURL(a.href);

            } catch (e) {
                alert(e.message);

            } finally {
                $('downloadBtn').disabled = false;
            }
        };

    } catch (e) {
        $('loading').textContent = e.message;
    }
}

main();