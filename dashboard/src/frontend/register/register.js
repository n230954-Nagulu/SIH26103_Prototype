const API_BASE = "";


// =====================================================
// GET ROLE
// =====================================================

const params = new URLSearchParams(window.location.search);

const role = params.get("role") || "government";


// =====================================================
// ELEMENTS
// =====================================================

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const governmentFields =
    document.getElementById("governmentFields");

const contractorFields =
    document.getElementById("contractorFields");

const emailLabel =
    document.getElementById("emailLabel");

const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");

const registerBtn =
    document.getElementById("registerBtn");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


// =====================================================
// ROLE UI
// =====================================================

if (role === "contractor") {

    pageTitle.textContent =
        "Create Contractor Account";

    pageSubtitle.textContent =
        "Register your contractor account";

    contractorFields.style.display = "block";

    governmentFields.style.display = "none";

    emailLabel.innerHTML =
        'Email <span>*</span>';

} else {

    pageTitle.textContent =
        "Create Government Officer Account";

    pageSubtitle.textContent =
        "Register your government officer account";

    governmentFields.style.display = "block";

    contractorFields.style.display = "none";

    emailLabel.innerHTML =
        'Official Email <span>*</span>';
}


// =====================================================
// PASSWORD TOGGLE
// =====================================================

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            passwordInput.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';
        }

    });

}


if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener("click", () => {

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";

            toggleConfirmPassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            confirmPasswordInput.type = "password";

            toggleConfirmPassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';
        }

    });

}


// =====================================================
// PHONE NUMBER
// ONLY ALLOW NUMBERS
// =====================================================

const phoneInput =
    document.getElementById("phone");

if (phoneInput) {

    phoneInput.addEventListener("input", () => {

        phoneInput.value =
            phoneInput.value.replace(/\D/g, "").slice(0, 10);

    });

}


// =====================================================
// FORM SUBMIT
// =====================================================

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        clearMessage();


        // -------------------------------------------------
        // COMMON FIELDS
        // -------------------------------------------------

        const full_name =
            document.getElementById("full_name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        // -------------------------------------------------
        // COMMON VALIDATION
        // -------------------------------------------------

        if (
            !full_name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Please fill all required fields.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        // -------------------------------------------------
        // GOVERNMENT REGISTRATION
        // -------------------------------------------------

        let endpoint;
        let body;


        if (role === "government") {

            const officer_id =
                document.getElementById("officer_id")
                    .value
                    .trim();

            const designation =
                document.getElementById("designation")
                    .value
                    .trim();

            const department =
                document.getElementById("department")
                    .value
                    .trim();

            const phone =
                document.getElementById("phone")
                    .value
                    .trim();


            // ---------------------------------------------
            // GOVERNMENT VALIDATION
            // ---------------------------------------------

            if (
                !officer_id ||
                !designation ||
                !department ||
                !phone
            ) {

                showMessage(
                    "Please fill all government officer details.",
                    "error"
                );

                return;
            }


            if (!/^\d{10}$/.test(phone)) {

                showMessage(
                    "Please enter a valid 10-digit phone number.",
                    "error"
                );

                return;
            }


            endpoint =
                "/dashboard-api/officer/register";


            body = {

                officer_id,

                full_name,

                official_email: email,

                password,

                department,

                designation,

                phone

            };

        }


        // -------------------------------------------------
        // CONTRACTOR REGISTRATION
        // -------------------------------------------------

        else {

            const contractor_id =
                document.getElementById("contractor_id")
                    .value
                    .trim();

            const company_name =
                document.getElementById("company_name")
                    .value
                    .trim();


            if (
                !contractor_id ||
                !company_name
            ) {

                showMessage(
                    "Please provide Contractor ID and Company Name.",
                    "error"
                );

                return;
            }


            endpoint =
                "/dashboard-api/contractors/register";


            body = {

                contractor_id,

                full_name,

                company_name,

                email,

                phone: null,

                password

            };

        }


        // =================================================
        // SEND REQUEST
        // =================================================

        try {

            registerBtn.disabled = true;

            registerBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';


            const response = await fetch(
                API_BASE + endpoint,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(body)
                }
            );


            const data =
                await response.json();


            // ------------------------------------------------
            // ERROR
            // ------------------------------------------------

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Registration failed.",
                    "error"
                );

                return;
            }


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            showMessage(
                data.message ||
                "Account created successfully.",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {

                window.location.href =
                    "../login/login.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                "Unable to connect to server. Please make sure the backend is running.",
                "error"
            );

        } finally {

            registerBtn.disabled = false;

            registerBtn.innerHTML =
                '<i class="fa-solid fa-user-plus"></i> <span>Create Account</span>';

        }

    }
);


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `message ${type}`;

    message.style.display =
        "block";

}


// =====================================================
// CLEAR MESSAGE
// =====================================================

function clearMessage() {

    message.textContent = "";

    message.className =
        "message";

    message.style.display =
        "none";

}