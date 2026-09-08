import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '-');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { files: 10, fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
    }
    cb(null, true);
  }
});

const asNumber = (v) => v === '' || v == null ? null : Number(v);
const asBool = (v) => v === true || v === 'true' || v === '1';
const parseJson = (v, fallback = []) => {
  try { return v ? JSON.parse(v) : fallback; } catch { throw new Error('Invalid JSON field in form submission.'); }
};

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'sih26103-report-api' }));

app.get('/api/projects', async (_req, res, next) => {
  try { res.json(await prisma.project.findMany({ orderBy: { psId: 'asc' } })); } catch (e) { next(e); }
});

app.post('/api/projects', async (req, res, next) => {
  try {
    const { psId, title, teamName, institute, department, teamLeader, contactEmail, contactPhone, facultyMentor, budget, expectedEndDate } = req.body;
    if (!psId || !title || !teamName || !institute || !teamLeader) return res.status(400).json({ error: 'psId, title, teamName, institute and teamLeader are required.' });
    const project = await prisma.project.create({ data: {
      psId, title, teamName, institute, department, teamLeader, contactEmail, contactPhone, facultyMentor,
      budget: asNumber(budget), expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : null
    }});
    res.status(201).json(project);
  } catch (e) { next(e); }
});

app.get('/api/projects/:id', async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id }, include: { reports: { orderBy: { reportingMonth: 'desc' } } } });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (e) { next(e); }
});

app.post('/api/reports', upload.array('evidenceFiles', 10), async (req, res, next) => {
  try {
    const body = req.body;
    const required = ['projectId','reportingMonth','overallStatus','completionPercentage','plannedSummary','completedSummary'];
    for (const key of required) if (!body[key]) return res.status(400).json({ error: `${key} is required.` });
    const completion = Number(body.completionPercentage);
    if (!Number.isInteger(completion) || completion < 0 || completion > 100) return res.status(400).json({ error: 'completionPercentage must be 0-100.' });

    const milestones = parseJson(body.milestones, []);
    const expenses = parseJson(body.expenses, []);
    const captions = parseJson(body.evidenceCaptions, []);

    const files = req.files || [];
    const report = await prisma.monthlyReport.create({
      data: {
        projectId: body.projectId,
        reportingMonth: body.reportingMonth,
        overallStatus: body.overallStatus,
        completionPercentage: completion,
        previousCompletion: asNumber(body.previousCompletion),
        plannedSummary: body.plannedSummary,
        completedSummary: body.completedSummary,
        pendingSummary: body.pendingSummary || null,
        technicalProgress: body.technicalProgress || null,
        technologiesUsed: body.technologiesUsed || null,
        prototypeStatus: body.prototypeStatus || null,
        testingSummary: body.testingSummary || null,
        achievements: body.achievements || null,
        challenges: body.challenges || null,
        supportRequired: body.supportRequired || null,
        nextMonthPlan: body.nextMonthPlan || null,
        nextMonthTarget: asNumber(body.nextMonthTarget),
        amountSpentThisMonth: asNumber(body.amountSpentThisMonth),
        totalSpentToDate: asNumber(body.totalSpentToDate),
        remainingBudget: asNumber(body.remainingBudget),
        fundingRequired: asBool(body.fundingRequired),
        milestones: { create: milestones.map(m => ({ taskName: m.taskName, plannedPercent: Number(m.plannedPercent || 0), actualPercent: Number(m.actualPercent || 0), status: m.status || 'Pending', notes: m.notes || null })) },
        expenses: { create: expenses.map(x => ({ description: x.description, category: x.category, amount: Number(x.amount || 0), proofUrl: x.proofUrl || null })) },
        evidences: { create: files.map((f, i) => ({ fileName: f.originalname, fileUrl: `/uploads/${f.filename}`, mimeType: f.mimetype, caption: captions[i] || null })) }
      },
      include: { milestones: true, expenses: true, evidences: true }
    });
    res.status(201).json(report);
  } catch (e) { next(e); }
});

app.get('/api/reports', async (req, res, next) => {
  try {
    const where = req.query.projectId ? { projectId: req.query.projectId } : {};
    res.json(await prisma.monthlyReport.findMany({ where, include: { milestones: true, expenses: true, evidences: true, project: true }, orderBy: { reportingMonth: 'desc' } }));
  } catch (e) { next(e); }
});

app.get('/api/reports/:id', async (req, res, next) => {
  try {
    const report = await prisma.monthlyReport.findUnique({ where: { id: req.params.id }, include: { project: true, milestones: true, expenses: true, evidences: true } });
    if (!report) return res.status(404).json({ error: 'Report not found.' });
    res.json(report);
  } catch (e) { next(e); }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Unexpected server error.' });
});

app.listen(PORT, () => console.log(`SIH26103 API running on http://localhost:${PORT}`));
