const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { PORT } = require('./config/env');
const routes = require('./routes/projectRoutes');
const err = require('./middleware/errorHandler');
const dashboardAuthRoutes = require('../dashboard/backend/routes/authRoutes');
const dashboardProjectRoutes = require('../dashboard/backend/routes/projectRoutes');
const dashboardContractorRoutes = require('../dashboard/backend/routes/contractorRoutes');
const dashboardOfficerRoutes = require('../dashboard/backend/routes/officerRoutes');
const dashboardUserProjectRoutes = require('../dashboard/backend/routes/userProjectRoutes');
const dashboardReportRoutes = require('../dashboard/backend/routes/reportRoutes');

const app = express();
const publicRoot = path.join(__dirname, '../public');
const dashboardRoot = path.join(__dirname, '../dashboard');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/projects', routes);

app.use('/dashboard-api/auth', dashboardAuthRoutes);
app.use('/dashboard-api/projects', dashboardProjectRoutes);
app.use('/dashboard-api/contractors', dashboardContractorRoutes);
app.use('/dashboard-api/officer', dashboardOfficerRoutes);
app.use('/dashboard-api/my-projects', dashboardUserProjectRoutes);
app.use('/dashboard-api/project-reports', dashboardReportRoutes);

app.get('/', (req, res) => {
	res.sendFile(path.join(dashboardRoot, 'index.html'));
});

app.get('/geospatial', (req, res) => {
	res.sendFile(path.join(publicRoot, 'index.html'));
});

app.get('/pages/project-analysis.html', (req, res) => {
	res.sendFile(path.join(publicRoot, 'pages/project.html'));
});

app.get('/dashboard', (req, res) => {
	res.sendFile(path.join(dashboardRoot, 'index.html'));
});

app.use(express.static(publicRoot));
app.use('/dashboard', express.static(dashboardRoot));

app.use((req, res) => res.sendFile(path.join(dashboardRoot, 'index.html')));
app.use(err);

app.listen(PORT, () => console.log(`SIH26103 server running on http://localhost:${PORT}`));