const API_BASE_URL = "";


// =====================================================
// GET LOGGED-IN USER
// =====================================================

function getLoggedInUser() {

    try {

        const data = localStorage.getItem("loggedInUser");

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("Invalid login data:", error);

        localStorage.removeItem("loggedInUser");

        return null;
    }
}


// =====================================================
// ELEMENTS
// =====================================================

const tableBody = document.getElementById("projectsTableBody");

const searchInput = document.getElementById("searchInput");

const sectorFilter = document.getElementById("sectorFilter");

const searchBtn = document.getElementById("searchBtn");

const resetBtn = document.getElementById("resetBtn");

const retryBtn = document.getElementById("retryBtn");

const homeBtn = document.getElementById("homeBtn");

const loginBtn = document.getElementById("loginBtn");

const addProjectBtn = document.getElementById("addProjectBtn");

const logoutBtn = document.getElementById("logoutBtn");

const loadingState = document.getElementById("loadingState");

const errorState = document.getElementById("errorState");

const emptyState = document.getElementById("emptyState");

const errorMessage = document.getElementById("errorMessage");

const tableContainer = document.getElementById("tableContainer");

const projectCount = document.getElementById("projectCount");

const userInfo = document.getElementById("userInfo");

const userName = document.getElementById("userName");

const userRole = document.getElementById("userRole");

const pageTitle = document.getElementById("pageTitle");

const pageSubtitle = document.getElementById("pageSubtitle");


// Statistics

const totalProjects = document.getElementById("totalProjects");

const ongoingProjects = document.getElementById("ongoingProjects");

const delayedProjects = document.getElementById("delayedProjects");

const totalBudget = document.getElementById("totalBudget");


let allProjects = [];


// =====================================================
// SETUP USER INTERFACE
// =====================================================

function setupUserInterface() {

    const loggedInUser = getLoggedInUser();


    // -------------------------------------------------
    // PUBLIC USER
    // -------------------------------------------------

    if (!loggedInUser) {

        userInfo.style.display = "none";

        addProjectBtn.style.display = "none";

        logoutBtn.style.display = "none";

        loginBtn.style.display = "";

        pageTitle.textContent = "Government Projects";

        pageSubtitle.textContent =
            "Explore infrastructure and development projects monitored through Project Intelligence.";

        return;
    }


    // -------------------------------------------------
    // LOGGED-IN USER
    // -------------------------------------------------

    loginBtn.style.display = "none";

    logoutBtn.style.display = "";

    userInfo.style.display = "flex";


    const role = loggedInUser.role;

    const user = loggedInUser.user || {};

    const name = user.full_name || "User";


    userName.textContent = name;


    if (role === "government") {

        userRole.textContent = "Government Officer";

        addProjectBtn.style.display = "";

        pageTitle.textContent = "Your Government Projects";

        pageSubtitle.textContent =
            `Welcome back, ${name}. Monitor projects assigned to your account.`;

    }

    else if (role === "contractor") {

        userRole.textContent = "Contractor";

        addProjectBtn.style.display = "none";

        pageTitle.textContent = "Your Assigned Projects";

        pageSubtitle.textContent =
            `Welcome back, ${name}. Track projects assigned to your company.`;

    }

    else {

        userRole.textContent = "User";

        addProjectBtn.style.display = "none";

        pageTitle.textContent = "Projects";

        pageSubtitle.textContent =
            "View available infrastructure projects.";
    }
}


// =====================================================
// API ENDPOINT
// =====================================================

function getProjectsEndpoint() {

    const loggedInUser = getLoggedInUser();


    // PUBLIC USER
    if (!loggedInUser) {

        return `${API_BASE_URL}/dashboard-api/projects`;

    }


    const role = loggedInUser.role;

    const user = loggedInUser.user || {};


    // GOVERNMENT
    if (
        role === "government" &&
        user.officer_id
    ) {

        return `${API_BASE_URL}/dashboard-api/my-projects/officer/${encodeURIComponent(user.officer_id)}`;

    }


    // CONTRACTOR
    if (
        role === "contractor" &&
        user.contractor_id
    ) {

        return `${API_BASE_URL}/dashboard-api/my-projects/contractor/${encodeURIComponent(user.contractor_id)}`;

    }


    return null;
}


// =====================================================
// LOAD PROJECTS
// =====================================================

async function loadProjects() {

    showLoading();


    const endpoint = getProjectsEndpoint();


    if (!endpoint) {

        showError(
            "Login information is incomplete. Please login again."
        );

        return;
    }


    try {

        const response = await fetch(endpoint);


        if (!response.ok) {

            let message = "Unable to load projects.";

            try {

                const data = await response.json();

                if (data.message) {
                    message = data.message;
                }

            } catch (error) {
                // Ignore
            }

            throw new Error(message);
        }


        const data = await response.json();


        /*
         * Your current projectRoutes returns:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * But this also supports:
         *
         * {
         *   projects: [...]
         * }
         */

        if (Array.isArray(data)) {

            allProjects = data;

        }

        else if (Array.isArray(data.projects)) {

            allProjects = data.projects;

        }

        else {

            allProjects = [];

        }


        populateSectorFilter(allProjects);

        displayProjects(allProjects);

        updateStatistics(allProjects);

        hideLoading();

        hideError();


    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );

        hideLoading();

        showError(
            error.message ||
            "Unable to connect to the server."
        );
    }
}


// =====================================================
// DISPLAY PROJECTS
// =====================================================

function displayProjects(projects) {

    tableBody.innerHTML = "";


    if (!projects || projects.length === 0) {

        tableContainer.style.display = "none";

        emptyState.style.display = "block";

        projectCount.textContent = "0 projects";

        return;
    }


    emptyState.style.display = "none";

    tableContainer.style.display = "block";


    projectCount.textContent =
        `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;


    projects.forEach((project, index) => {

        const row = document.createElement("tr");


        const progress = Math.min(
            Math.max(
                Number(project.progress) || 0,
                0
            ),
            100
        );


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>
                <span class="project-id">
                    ${escapeHTML(project.id)}
                </span>
            </td>


            <td>
                <span class="project-name">
                    ${escapeHTML(project.name)}
                </span>
            </td>


            <td>
                ${escapeHTML(project.sector)}
            </td>


            <td>
                <span class="budget">
                    ${formatCrores(project.budget)}
                </span>
            </td>


            <td>

                <div class="progress-wrapper">

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${progress}%"
                        ></div>

                    </div>

                    <span class="progress-text">
                        ${progress}%
                    </span>

                </div>

            </td>


            <td>

                <span class="status ${getStatusClass(project.status)}">

                    <i class="${getStatusIcon(project.status)}"></i>

                    ${escapeHTML(project.status || "Unknown")}

                </span>

            </td>


            <td>

                <button
                    class="view-btn"
                    onclick="viewProject('${encodeURIComponent(project.id)}')"
                    title="View project"
                >

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// =====================================================
// VIEW PROJECT
// =====================================================

function viewProject(projectId) {

    const loggedInUser = getLoggedInUser();


    // PUBLIC USER
    if (!loggedInUser) {

        alert(
            "Please login to view project details."
        );


        window.location.href =
            `../login/login.html?redirect=${encodeURIComponent(
                "../projects/project-view.html?id=" + projectId
            )}`;


        return;
    }


    // LOGGED-IN USER

    window.location.href =
        `project-view.html?id=${projectId}`;
}


// =====================================================
// SEARCH
// =====================================================

function filterProjects() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedSector =
        sectorFilter.value
            .toLowerCase();


    const filteredProjects =
        allProjects.filter(project => {

            const searchText = `

                ${project.id || ""}

                ${project.name || ""}

                ${project.sector || ""}

                ${project.ministry || ""}

                ${project.state || ""}

            `.toLowerCase();


            const matchesSearch =
                searchText.includes(searchValue);


            const matchesSector =
                !selectedSector ||
                String(project.sector || "")
                    .toLowerCase() === selectedSector;


            return (
                matchesSearch &&
                matchesSector
            );

        });


    displayProjects(filteredProjects);

    updateStatistics(filteredProjects);
}


// =====================================================
// SECTOR FILTER
// =====================================================

function populateSectorFilter(projects) {

    const currentValue =
        sectorFilter.value;


    const sectors = [
        ...new Set(
            projects
                .map(project => project.sector)
                .filter(Boolean)
        )
    ].sort();


    sectorFilter.innerHTML =
        `<option value="">All Sectors</option>`;


    sectors.forEach(sector => {

        const option =
            document.createElement("option");


        option.value =
            String(sector).toLowerCase();


        option.textContent =
            sector;


        sectorFilter.appendChild(option);

    });


    sectorFilter.value =
        currentValue;
}


// =====================================================
// STATISTICS
// =====================================================

function updateStatistics(projects) {

    const total =
        projects.length;


    const ongoing =
        projects.filter(project => {

            const status =
                String(project.status || "")
                    .toLowerCase();


            return (
                status.includes("ongoing") ||
                status.includes("progress") ||
                status.includes("active")
            );

        }).length;


    const delayed =
        projects.filter(project => {

            const status =
                String(project.status || "")
                    .toLowerCase();


            return status.includes("delay");

        }).length;


    const budget =
        projects.reduce(
            (sum, project) =>
                sum +
                (Number(project.budget) || 0),
            0
        );


    totalProjects.textContent =
        total;


    ongoingProjects.textContent =
        ongoing;


    delayedProjects.textContent =
        delayed;


    totalBudget.textContent =
        formatCrores(budget);
}


// =====================================================
// BUDGET → CRORES
// =====================================================

function formatCrores(value) {

    const number =
        Number(value) || 0;

    return `₹${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} Cr`;
}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(status) {

    const value =
        String(status || "")
            .toLowerCase();


    if (value.includes("complete")) {
        return "completed";
    }


    if (value.includes("delay")) {
        return "delayed";
    }


    if (
        value.includes("ongoing") ||
        value.includes("progress") ||
        value.includes("active")
    ) {

        return "ongoing";
    }


    return "default";
}


// =====================================================
// STATUS ICON
// =====================================================

function getStatusIcon(status) {

    const value =
        String(status || "")
            .toLowerCase();


    if (value.includes("complete")) {
        return "fa-solid fa-circle-check";
    }


    if (value.includes("delay")) {
        return "fa-solid fa-triangle-exclamation";
    }


    return "fa-solid fa-spinner";
}


// =====================================================
// HOME
// =====================================================

homeBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "../../../index.html";

    }
);


// =====================================================
// LOGIN
// =====================================================

loginBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "../login/login.html";

    }
);


// =====================================================
// ADD PROJECT
// =====================================================

addProjectBtn.addEventListener(
    "click",
    () => {

        const user =
            getLoggedInUser();


        if (
            !user ||
            user.role !== "government"
        ) {

            alert(
                "Only government officers can add projects."
            );

            return;
        }


        window.location.href =
            "../project-details/project-details.html";

    }
);


// =====================================================
// LOGOUT
// =====================================================

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "loggedInUser"
        );


        window.location.href =
            "../../../index.html";

    }
);


// =====================================================
// SEARCH BUTTON
// =====================================================

searchBtn.addEventListener(
    "click",
    filterProjects
);


// =====================================================
// SEARCH INPUT
// =====================================================

searchInput.addEventListener(
    "input",
    filterProjects
);


// =====================================================
// SECTOR
// =====================================================

sectorFilter.addEventListener(
    "change",
    filterProjects
);


// =====================================================
// RESET
// =====================================================

resetBtn.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        sectorFilter.value = "";

        displayProjects(allProjects);

        updateStatistics(allProjects);

    }
);


// =====================================================
// RETRY
// =====================================================

retryBtn.addEventListener(
    "click",
    loadProjects
);


// =====================================================
// LOADING
// =====================================================

function showLoading() {

    loadingState.style.display = "block";

    errorState.style.display = "none";

    emptyState.style.display = "none";

    tableContainer.style.display = "none";
}


function hideLoading() {

    loadingState.style.display = "none";
}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    errorState.style.display = "block";

    errorMessage.textContent =
        message;

    tableContainer.style.display =
        "none";
}


function hideError() {

    errorState.style.display =
        "none";
}


// =====================================================
// SECURITY
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// =====================================================
// START
// =====================================================

setupUserInterface();

loadProjects();