let projects = [];
let map;
let markers = [];
let selectedMarker = null;

const $ = id => document.getElementById(id);

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

function riskClass(x) {
    return x === 'High' ? 'high' :
        x === 'Medium' ? 'medium' :
        'low';
}

function riskColor(level) {
    return level === 'High' ? '#d92d20' :
        level === 'Medium' ? '#dc6803' :
        '#039855';
}

function formatNumber(value, decimals = 0) {
    const n = Number(value);

    if (!Number.isFinite(n)) {
        return '0';
    }

    return n.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

async function loadFilters() {
    const j = await api('/api/projects/filters');

    for (const [id, vals] of Object.entries(j.data)) {
        const el = $(id);

        if (!el) {
            continue;
        }

        vals.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v;
            el.appendChild(o);
        });
    }
}

async function load() {
    const q = new URLSearchParams();

    [
        'sector',
        'state',
        'ministry',
        'risk_level',
        'project_type',
        'search'
    ].forEach(id => {
        const el = $(id);

        if (el && el.value) {
            q.set(id, el.value);
        }
    });

    try {
        const j = await api('/api/projects?' + q);

        projects = j.data || [];

        $('totalCount').textContent = j.count || 0;

        $('tableCount').textContent =
            `${j.count || 0} result${j.count === 1 ? '' : 's'}`;

        renderTable();
        renderMap();
        closeDrawer();
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

function renderTable() {
    $('tbody').innerHTML = projects.map(p => {
        const progress = Number(p.progress_pct);

        const safeProgress = Number.isFinite(progress)
            ? Math.min(100, Math.max(0, progress))
            : 0;

        return `
            <tr class="clickable" data-id="${esc(p.id)}">
                <td>
                    <strong>${esc(p.project_code)}</strong>
                    <br>
                    <span>${esc(p.name)}</span>
                </td>

                <td>
                    ${esc(p.place)}, ${esc(p.state)}
                </td>

                <td>
                    ${esc(p.sector)}
                </td>

                <td>
                    ${esc(p.implementing_agency)}
                </td>

                <td>
                    <div class="progress">
                        <i style="width:${safeProgress}%"></i>
                    </div>
                    ${safeProgress.toFixed(0)}%
                </td>

                <td>
                    <span class="pill ${riskClass(p.risk_level)}">
                        ${esc(p.risk_level)}
                    </span>
                </td>

                <td>
                    →
                </td>
            </tr>
        `;
    }).join('') || `
        <tr>
            <td colspan="7" class="empty">
                No projects match these filters.
            </td>
        </tr>
    `;

    document
        .querySelectorAll('.clickable[data-id]')
        .forEach(row => {
            row.addEventListener('click', () => {
                location.href =
                    `/pages/project.html?id=${encodeURIComponent(row.dataset.id)}`;
            });
        });
}

function renderMap() {
    markers.forEach(marker => marker.remove());

    markers = [];
    selectedMarker = null;

    const group = [];

    projects.forEach(p => {
        if (p.latitude == null || p.longitude == null) {
            return;
        }

        const lat = Number(p.latitude);
        const lng = Number(p.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return;
        }

        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            color: '#fff',
            weight: 2,
            fillColor: riskColor(p.risk_level),
            fillOpacity: 0.95
        }).addTo(map);

        marker.on('click', () => {
            if (selectedMarker) {
                selectedMarker.setStyle({
                    radius: 8,
                    weight: 2
                });
            }

            marker.setStyle({
                radius: 12,
                weight: 4
            });

            selectedMarker = marker;

            map.flyTo([lat, lng], 15, {
                animate: true,
                duration: 1.2
            });

            openDrawer(p);
        });

        markers.push(marker);
        group.push([lat, lng]);
    });

    if (group.length) {
        map.fitBounds(group, {
            padding: [35, 35],
            maxZoom: 6
        });
    }

    $('mapHint').textContent =
        `Showing ${projects.length} filtered project${projects.length === 1 ? '' : 's'}; click a point to zoom in and inspect project details.`;
}

function openDrawer(p) {
    const d = $('mapDetails');

    const risk = p.risk_level || 'Low';

    const progress = Number(p.progress_pct);

    const safeProgress = Number.isFinite(progress)
        ? Math.min(100, Math.max(0, progress))
        : 0;

    $('mapDetailsContent').innerHTML = `
        <div class="drawer-eyebrow">
            ${esc(p.project_code)}
        </div>

        <h3 class="drawer-project-title">
            ${esc(p.name)}
        </h3>

        <div class="drawer-risk">
            <span class="pill ${riskClass(risk)}">
                ${esc(risk)} Risk
            </span>

            <strong>
                ${formatNumber(p.risk_percentage, 0)}%
            </strong>
        </div>

        <div class="drawer-location">
            <span class="drawer-label">
                Project Location
            </span>

            <strong>
                📍 ${esc(p.place)}, ${esc(p.state)}
            </strong>
        </div>

        <div class="drawer-section-title">
            Project Information
        </div>

        <div class="drawer-grid">
            <div class="drawer-info-card">
                <span>Sector</span>
                <b>${esc(p.sector || '—')}</b>
            </div>

            <div class="drawer-info-card">
                <span>Implementing Agency</span>
                <b>${esc(p.implementing_agency || '—')}</b>
            </div>

            <div class="drawer-info-card">
                <span>Current Progress</span>
                <b>${safeProgress.toFixed(0)}%</b>

                <div class="drawer-progress">
                    <i style="width:${safeProgress}%"></i>
                </div>
            </div>

            <div class="drawer-info-card">
                <span>Original Cost</span>
                <b>
                    ₹${formatNumber(p.original_cost_crore)} Cr
                </b>
            </div>

            <div class="drawer-info-card">
                <span>Planned Duration</span>
                <b>
                    ${esc(p.planned_duration_months || '—')} months
                </b>
            </div>

            <div class="drawer-info-card">
                <span>Project Type</span>
                <b>
                    ${esc(p.project_type || '—')}
                </b>
            </div>
        </div>

        <div class="drawer-action">
            <button
                class="drawer-analysis-btn"
                onclick="window.location.href='/pages/project.html?id=${encodeURIComponent(p.id)}'"
            >
                <span>View Full Project Details</span>
                <span>→</span>
            </button>
        </div>

        <div class="drawer-note">
            <strong>Map View</strong>
            <span>
                This panel shows a quick overview of the selected
                project. Open the full project page for AI analysis,
                What-If simulation, evidence and detailed information.
            </span>
        </div>
    `;

    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
    const drawer = $('mapDetails');

    if (!drawer) {
        return;
    }

    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');

    if (selectedMarker) {
        selectedMarker.setStyle({
            radius: 8,
            weight: 2
        });

        selectedMarker = null;
    }
}

function init() {
    map = L
        .map('portfolioMap')
        .setView([22.5, 79], 3);

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap contributors'
        }
    ).addTo(map);

    $('closeMapDetails').onclick = closeDrawer;

    loadFilters()
        .then(load)
        .catch(error => {
            console.error(
                'Initialization failed:',
                error
            );
        });

    $('filterBtn').onclick = load;

    $('resetBtn').onclick = () => {
        document
            .querySelectorAll('.filters select')
            .forEach(x => {
                x.value = '';
            });

        $('search').value = '';

        load();
    };
}

init();