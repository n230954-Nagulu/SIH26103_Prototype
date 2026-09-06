const express = require("express");
const router = express.Router();

const db = require("../db");


// =====================================================
// GOVERNMENT OFFICER LOGIN
// =====================================================

router.post("/government-login", (req, res) => {

    const {
        login,
        password
    } = req.body;


    // Check input

    if (!login || !password) {

        return res.status(400).json({
            message: "Please enter login details"
        });
    }


    const sql = `
        SELECT id, name, email, department, designation
        FROM officers
        WHERE CAST(id AS text) = $1 OR LOWER(email) = LOWER($1)
        LIMIT 1
    `;


    db.query(
        sql,
        [login],
        (err, results) => {

            if (err) {

                console.error(
                    "Government login error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }


            // Invalid login

            if (results.length === 0) {

                return res.status(401).json({
                    message: "Invalid Officer ID / Email or password"
                });
            }


            // Successful login

            const officer = results[0];

            res.json({

                message: "Government officer login successful",

                role: "government",

                user: {
                    officer_id: officer.id,
                    full_name: officer.name,
                    email: officer.email,
                    department: officer.department,
                    designation: officer.designation
                }

            });

        }
    );

});


// =====================================================
// CONTRACTOR LOGIN
// =====================================================

router.post("/contractor-login", (req, res) => {

    const {
        login,
        password
    } = req.body;

    if (!login) {
        return res.status(400).json({
            message: "Please enter login details"
        });
    }

    const loginValue = String(login).trim();

    const sql = `
        SELECT
            c.id,
            c.name,
            c.contact_email,
            c.phone,
            c.address,
            c.id AS contractor_id
        FROM contractors c
        WHERE
            CAST(c.id AS text) = $1
            OR LOWER(c.contact_email) = LOWER($1)
            OR LOWER(c.name) = LOWER($1)
        LIMIT 1
    `;

    db.query(sql, [loginValue], (err, results) => {
        if (err) {
            console.error("Contractor login error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        const rows = Array.isArray(results) ? results : (results && results.rows) || [];

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Invalid Contractor ID / Email or password"
            });
        }

        const contractor = rows[0];

        if (contractor.password && String(contractor.password) !== String(password || "")) {
            return res.status(401).json({
                message: "Invalid Contractor ID / Email or password"
            });
        }

        res.json({
            message: "Contractor login successful",
            role: "contractor",
            user: {
                contractor_id: String(contractor.contractor_id ?? contractor.id),
                full_name: contractor.name,
                company_name: contractor.name || "Registered Contractor",
                email: contractor.contact_email,
                phone: contractor.phone
            }
        });
    });
});


module.exports = router;