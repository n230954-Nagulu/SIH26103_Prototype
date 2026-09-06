const express = require("express");
const router = express.Router();
const db = require("../db");

// =====================================================
// GET ALL CONTRACTORS
// =====================================================
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id AS contractor_id,
            name AS full_name,
            name AS company_name,
            contact_email AS email,
            phone
        FROM contractors
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching contractors:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});


// =====================================================
// GET CONTRACTOR BY ID
// =====================================================
router.get("/:id", (req, res) => {
    const contractorId = req.params.id;

    const sql = `
        SELECT
            id AS contractor_id,
            name AS full_name,
            name AS company_name,
            contact_email AS email,
            phone
        FROM contractors
        WHERE id = $1
    `;

    db.query(sql, [contractorId], (err, results) => {
        if (err) {
            console.error("Error fetching contractor:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Contractor not found"
            });
        }

        res.json(results[0]);
    });
});


// =====================================================
// CONTRACTOR REGISTRATION
// =====================================================
router.post("/register", (req, res) => {

    const { contractor_id, full_name, company_name, email, phone } = req.body;
    const name = company_name || full_name;


    // Check required fields
    if (
        !name ||
        !email
    ) {
        return res.status(400).json({
            message: "Please provide all required details"
        });
    }


    // Insert contractor into database
    const contractorId = contractor_id ? Number(contractor_id) : null;
    const sql = contractorId
        ? `INSERT INTO contractors (id, name, contact_email, phone) VALUES ($1, $2, $3, $4) RETURNING id`
        : `INSERT INTO contractors (name, contact_email, phone) VALUES ($1, $2, $3) RETURNING id`;


    db.query(
        sql,
        contractorId
            ? [contractorId, name, email, phone || null]
            : [name, email, phone || null],
        (err, result) => {

            if (err) {

                console.error(
                    "Contractor registration error:",
                    err
                );


                // Contractor ID or email already exists
                return res.status(500).json({
                    message: "Contractor ID or email already exists"
                });
            }


            // Registration successful
            res.status(201).json({
                message:
                    "Contractor registered successfully",
                contractor_id: result.rows ? result.rows[0].id : result[0].id
            });
        }
    );
});


module.exports = router;