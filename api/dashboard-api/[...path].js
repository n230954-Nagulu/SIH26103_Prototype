const express = require('express');
const authRoutes = require('../../dashboard/backend/routes/authRoutes');
const contractorRoutes = require('../../dashboard/backend/routes/contractorRoutes');
const officerRoutes = require('../../dashboard/backend/routes/officerRoutes');
const projectRoutes = require('../../dashboard/backend/routes/projectRoutes');
const reportRoutes = require('../../dashboard/backend/routes/reportRoutes');
const userProjectRoutes = require('../../dashboard/backend/routes/userProjectRoutes');

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/contractors', contractorRoutes);
app.use('/officer', officerRoutes);
app.use('/my-projects', userProjectRoutes);
app.use('/project-reports', reportRoutes);

module.exports = function handler(req, res) {
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    const path = requestUrl.pathname.replace(
        /^\/(?:api\/)?dashboard-api(?=\/|$)/,
        ''
    ) || '/';

    req.url = `${path}${requestUrl.search}`;
    return app(req, res);
};