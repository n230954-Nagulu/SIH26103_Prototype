const API_BASE_URL = "";


// =====================================================
// ELEMENTS
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const governmentRole =
    document.getElementById("governmentRole");

const contractorRole =
    document.getElementById("contractorRole");

const loginLabel =
    document.getElementById("loginLabel");

const loginInput =
    document.getElementById("login");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const errorMessage =
    document.getElementById("errorMessage");

const governmentRegister =
    document.getElementById("governmentRegister");

const contractorRegister =
    document.getElementById("contractorRegister");


// =====================================================
// ROLE
// =====================================================

let selectedRole = "government";


governmentRole.addEventListener(
    "click",
    () => {

        selectedRole = "government";

        governmentRole.classList.add(
            "active"
        );

        contractorRole.classList.remove(
            "active"
        );

        updateRoleUI();
    }
);


contractorRole.addEventListener(
    "click",
    () => {

        selectedRole = "contractor";

        contractorRole.classList.add(
            "active"
        );

        governmentRole.classList.remove(
            "active"
        );

        updateRoleUI();
    }
);


// =====================================================
// ROLE UI
// =====================================================

function updateRoleUI() {

    if (selectedRole === "government") {

        loginLabel.textContent =
            "Officer ID or Official Email";

        loginInput.placeholder =
            "Enter Officer ID or official email";

        governmentRegister.style.display =
            "block";

        contractorRegister.style.display =
            "none";

    } else {

        loginLabel.textContent =
            "Contractor ID or Email";

        loginInput.placeholder =
            "Enter Contractor ID or email";

        governmentRegister.style.display =
            "none";

        contractorRegister.style.display =
            "block";
    }
}


// =====================================================
// PASSWORD
// =====================================================

togglePassword.addEventListener(
    "click",
    () => {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            passwordInput.type =
                "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';
        }
    }
);


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        hideError();


        const login =
            loginInput.value.trim();


        const password =
            passwordInput.value;


        if (!login || !password) {

            showError(
                "Please enter your login details."
            );

            return;
        }


        const endpoint =
            selectedRole === "government"

                ? "/dashboard-api/auth/government-login"

                : "/dashboard-api/auth/contractor-login";


        const loginButton =
            loginForm.querySelector(
                ".login-button"
            );


        if (loginButton) {

            loginButton.disabled =
                true;

            loginButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}${endpoint}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            login,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Login failed."
                );
            }


            // Save login
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data)
            );


            // =================================================
            // REDIRECT
            // =================================================

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const redirect =
                params.get("redirect");


            if (redirect) {

                window.location.href =
                    redirect;

            } else {

                window.location.href =
                    "/dashboard/src/frontend/projects/projects.html";
            }


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showError(
                error.message ||
                "Unable to login."
            );


            if (loginButton) {

                loginButton.disabled =
                    false;

                loginButton.innerHTML =
                    '<i class="fa-solid fa-right-to-bracket"></i> Login';
            }
        }
    }
);


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.classList.add(
        "show"
    );
}


function hideError() {

    errorMessage.textContent =
        "";

    errorMessage.classList.remove(
        "show"
    );
}


// =====================================================
// START
// =====================================================

updateRoleUI();