let projects = [];

const $ = id => document.getElementById(id);

function requireOfficerAccess() {
    try {
        const session = JSON.parse(localStorage.getItem('loggedInUser') || 'null');

        if (session && session.role === 'government') {
            return true;
        }
    } catch (error) {
        localStorage.removeItem('loggedInUser');
    }

    const redirect = encodeURIComponent('/analysis.html');
    window.location.replace(`/dashboard/src/frontend/login/login.html?redirect=${redirect}`);
    return false;
}

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function riskClass(level) {
    return level === 'High' ? 'high' : level === 'Medium' ? 'medium' : 'low';
}

function render() {
    const query = $('analysisSearch').value.trim().toLowerCase();
    const visible = projects.filter(project =>
        `${project.project_code} ${project.name}`.toLowerCase().includes(query)
    );

    $('analysisCount').textContent = `${visible.length} project${visible.length === 1 ? '' : 's'} available for analysis`;
    $('analysisList').innerHTML = visible.map(project => `
        <article class="analysis-row">
            <div class="analysis-project">
                <span class="eyebrow">${esc(project.project_code)}</span>
                <h3>${esc(project.name)}</h3>
                <p>${esc(project.place)}, ${esc(project.state)} · ${esc(project.sector)}</p>
            </div>
            <div class="analysis-meta"><span class="pill ${riskClass(project.risk_level)}">${esc(project.risk_level || 'Low')} risk</span><span>${Number(project.progress_pct || 0).toFixed(0)}% complete</span></div>
            <a class="btn primary" href="/pages/project.html?id=${encodeURIComponent(project.id)}">Open analysis</a>
        </article>
    `).join('') || '<div class="empty">No projects match your search.</div>';
}

async function init() {
    if (!requireOfficerAccess()) {
        return;
    }

    try {
        const response = await fetch('/api/projects?limit=1900');
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'Unable to load projects');
        }

        projects = payload.data || [];
        render();
    } catch (error) {
        $('analysisCount').textContent = 'Unable to load projects';
        $('analysisList').innerHTML = `<div class="empty">${esc(error.message)}</div>`;
    }
}

$('analysisSearch').addEventListener('input', render);
init();
