const express = require("express");
const cors = require("cors");

const app = express();


// Middleware

app.use(cors());
app.use(express.json());


// Routes

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const contractorRoutes = require("./routes/contractorRoutes");
const officerRoutes = require("./routes/officerRoutes");
const userProjectRoutes = require("./routes/userProjectRoutes");


// API paths

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/contractors", contractorRoutes);

app.use("/api/officer", officerRoutes);

app.use("/api/my-projects", userProjectRoutes);


// Home

app.get("/", (req, res) => {

    res.send("SIH Backend is running");

});


// Start server

app.listen(3000, () => {

    console.log(
        "Server running on http://localhost:3000"
    );

});