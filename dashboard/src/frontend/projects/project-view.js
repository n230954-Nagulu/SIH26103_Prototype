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