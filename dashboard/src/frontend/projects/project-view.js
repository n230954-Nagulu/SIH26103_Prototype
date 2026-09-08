const API_BASE_URL = "";


// =====================================================
// LOGIN CHECK
// =====================================================

function getLoggedInUser() {

    try {

        const data =
            localStorage.getItem("loggedInUser");

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        localStorage.removeItem(
            "loggedInUser"
        );

        return null;
    }
}


const loggedInUser =
    getLoggedInUser();


if (!loggedInUser) {

    alert(
        "Please login to view project details."
    );

    window.location.href =
        "../login/login.html";

} else {

    loadProject();
}


// =====================================================
// PROJECT ID
// =====================================================

function getProjectId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


// =====================================================
// LOAD PROJECT
// =====================================================

async function loadProject() {

    const projectId =
        getProjectId();


    if (!projectId) {

        alert(
            "Project ID is missing."
        );

        window.location.href =
            "projects.html";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/dashboard-api/projects/${encodeURIComponent(projectId)}`
            );


        if (!response.ok) {

            throw new Error(
                "Project could not be found."
            );
        }


        const payload =
            await response.json();

        const project =
            payload.project || payload;


        displayProject(project);


    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );


        const loading =
            document.getElementById("loading");

        const errorBox =
            document.getElementById("error");

        const errorMessage =
            document.getElementById("errorMessage");


        if (loading) {
            loading.style.display = "none";
        }


        if (errorBox) {

            errorBox.style.display =
                "block";
        }


        if (errorMessage) {

            errorMessage.textContent =
                error.message;
        }
    }
}


// =====================================================
// DISPLAY PROJECT
// =====================================================

function displayProject(project) {

    loadSubmittedReports(project);

    setText(
        "projectName",
        project.name
    );


    setText(
        "projectId",
        project.id
    );


    setText(
        "sector",
        project.sector
    );


    setText(
        "ministry",
        project.ministry
    );


    setText(
        "state",
        project.state
    );


    setText(
        "budget",
        project.budget == null ? "-" : `₹${project.budget} Cr`
    );


    setText(
        "expenditure",
        project.expenditure == null ? "-" : `₹${project.expenditure} Cr`
    );


    setText(
        "startDate",
        formatDate(project.startDate)
    );


    setText(
        "endDate",
        formatDate(project.endDate)
    );


    const progress =
        Math.min(
            Math.max(
                Number(project.progress) || 0,
                0
            ),
            100
        );


    setText(
        "progressText",
        `${progress}%`
    );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;
    }


    setText(
        "projectStatus",
        project.status
    );


    const loading =
        document.getElementById(
            "loading"
        );


    const content =
        document.getElementById(
            "projectContent"
        );


    if (loading) {

        loading.style.display =
            "none";
    }


    if (content) {

        content.style.display =
            "block";
    }
}


// =====================================================
// BACK BUTTON
// =====================================================

const backButton =
    document.getElementById(
        "backBtn"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "projects.html";

        }
    );
}


// =====================================================
// HELPERS
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ??
            "-";
    }
}


function formatNumber(value) {

    const number =
        Number(value) || 0;


    return number.toLocaleString(
        "en-IN"
    );
}


// =====================================================
// DATE
// =====================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return value;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

const riskAnalysisButton =
    document.getElementById(
        "riskAnalysisBtn"
    );

const addReportButton =
    document.getElementById(
        "addReportBtn"
    );

const previousReportsButton =
    document.getElementById(
        "previousReportsBtn"
    );

if (riskAnalysisButton) {
    riskAnalysisButton.addEventListener(
        "click",
        () => {
            const projectId = getProjectId();

            if (!projectId) {
                return;
            }

            window.location.href =
                `/pages/project-analysis.html?id=${encodeURIComponent(projectId)}`;
        }
    );
}

if (addReportButton) {
    addReportButton.addEventListener(
        "click",
        () => {
            const projectId = getProjectId();

            if (!projectId) {
                alert("Project ID is missing.");
                return;
            }

            const projectViewUrl = window.location.href;
            const reportUrl = `project-report.html?id=${encodeURIComponent(projectId)}&returnUrl=${encodeURIComponent(projectViewUrl)}`;

            window.location.href = reportUrl;
        }
    );
}

if (previousReportsButton) {
    previousReportsButton.addEventListener(
        "click",
        () => {
            const section = document.getElementById("submittedReportsSection");

            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    );
}

async function loadSubmittedReports(project) {
    const listEl = document.getElementById("submittedReportsList");

    if (!listEl) {
        return;
    }

    try {
        const projectId = project?.id ?? project?.project_id ?? getProjectId();

        if (!projectId) {
            listEl.innerHTML = '<div class="detail" style="padding: 18px; color: #64748b;">No project selected.</div>';
            return;
        }

        const reportsResponse = await fetch(`/dashboard-api/project-reports?projectId=${encodeURIComponent(projectId)}`);

        if (!reportsResponse.ok) {
            throw new Error("Reports could not be loaded.");
        }

        const data = await reportsResponse.json();
        const reports = Array.isArray(data?.reports) ? data.reports : [];

        if (reports.length === 0) {
            listEl.innerHTML = '<div class="detail" style="padding: 18px; color: #64748b;">No reports submitted yet.</div>';
            return;
        }

        listEl.innerHTML = reports.map((report) => `
            <div class="detail" style="padding: 18px;">
                <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:10px; flex-wrap:wrap;">
                    <strong>${escapeHtml(report.reportingMonth || "Month")}</strong>
                    <span class="status ${getStatusClass(report.overallStatus || "On Track")}">${escapeHtml(report.overallStatus || "On Track")}</span>
                </div>
                <p style="margin-bottom:8px; color:#475569;">Completion: <strong>${report.completionPercentage ?? 0}%</strong></p>
                <p style="margin-bottom:8px; color:#475569;">Planned: ${escapeHtml(report.plannedSummary || "-")}</p>
                <p style="color:#475569;">Completed: ${escapeHtml(report.completedSummary || "-")}</p>
            </div>
        `).join("");

    } catch (error) {
        console.error("Failed to load submitted reports:", error);
        listEl.innerHTML = '<div class="detail" style="padding: 18px; color: #64748b;">No reports submitted yet.</div>';
    }
}

function getStatusClass(status) {
    const value = (status || "").toLowerCase();

    if (value.includes("delay") || value.includes("hold")) {
        return "delayed";
    }

    if (value.includes("complete") || value.includes("done")) {
        return "completed";
    }

    return "ongoing";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}