import express from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { UPLOAD_DIR, todayVN, db } from './db.js';
import { CURRICULUM, CURRICULUM_SOURCE } from './curriculum.js';
import * as T from './tutor.js';
import { aiEnabled } from './ai.js';
import { buildReport, reportHtml, reportText, sendDailyReport, startScheduler, channelsConfigured } from './report.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

// Bảo vệ đơn giản bằng mã truy cập (nên bật khi đưa lên Internet).
const ACCESS_CODE = process.env.ACCESS_CODE;
app.use('/api', (req, res, next) => {
  if (!ACCESS_CODE || req.path === '/status') return next();
  if (req.get('x-access-code') === ACCESS_CODE) return next();
  res.status(401).json({ error: 'Cần mã truy cập', needCode: true });
});
app.use('/uploads', (req, res, next) => {
  if (!ACCESS_CODE || req.query.code === ACCESS_CODE) return next();
  res.status(401).end();
});

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || '.jpg').toLowerCase().replace(/[^.a-z0-9]/g, '');
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const need = (x, msg = 'Không tìm thấy') => { if (!x) throw T.httpError(404, msg); return x; };

/** Địa chỉ trong mạng nội bộ (Wi‑Fi) để mở ứng dụng từ iPad / điện thoại. */
function lanUrls() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list || []) if (a.family === 'IPv4' && !a.internal && !a.address.startsWith('169.254.')) out.push(`http://${a.address}:${PORT}`);
  }
  return out;
}

app.get('/api/status', (req, res) => res.json({
  ai: aiEnabled(), channels: channelsConfigured(), today: todayVN(), curriculum: CURRICULUM_SOURCE, needCode: Boolean(ACCESS_CODE), lanUrls: lanUrls(),
}));

app.get('/api/curriculum', (req, res) => res.json(Object.fromEntries(Object.entries(CURRICULUM).map(([g, ts]) => [g, ts.map(({ id, week, name }) => ({ id, week, name }))]))));

// ---- học sinh ----
app.get('/api/students', (req, res) => res.json(T.listStudents()));
app.post('/api/students', (req, res) => res.status(201).json(T.createStudent(req.body)));
app.get('/api/students/:id', (req, res) => {
  const st = need(T.getStudent(req.params.id), 'Không tìm thấy học sinh');
  const today = db.prepare('SELECT id, status, score FROM assignments WHERE student_id = ? AND date = ?').get(st.id, todayVN());
  res.json({ ...st, progress: T.studentProgress(st), today: today || null });
});
app.put('/api/students/:id', (req, res) => res.json(T.updateStudent(req.params.id, req.body)));
app.delete('/api/students/:id', (req, res) => { T.deleteStudent(req.params.id); res.status(204).end(); });

// ---- bài tập ----
app.post('/api/students/:id/assignments', wrap(async (req, res) => {
  res.json(await T.createDailyAssignment(Number(req.params.id), { topicId: req.body?.topic_id || null }));
}));
app.get('/api/students/:id/assignments', (req, res) => res.json(T.listAssignments(req.params.id)));
app.get('/api/assignments/:id', (req, res) => res.json(need(T.getAssignment(req.params.id))));

app.post('/api/problems/:id/answer', wrap(async (req, res) => {
  res.json(await T.answerMcq(Number(req.params.id), req.body?.choice));
}));
app.post('/api/problems/:id/essay', upload.array('images', 4), wrap(async (req, res) => {
  res.json(await T.answerEssay(Number(req.params.id), req.files || [], (req.body?.final_answer || '').trim()));
}));

// ---- tiến độ & báo cáo ----
app.get('/api/students/:id/progress', (req, res) => {
  const st = need(T.getStudent(req.params.id), 'Không tìm thấy học sinh');
  const data = T.progressData(st.id);
  res.json({ ...data, comment: T.overallComment(st, data) });
});
app.get('/api/students/:id/report', (req, res) => {
  const r = buildReport(Number(req.params.id), req.query.date || todayVN());
  if (req.query.format === 'html') return res.type('html').send(reportHtml(r));
  res.json({ text: reportText(r), history: db.prepare('SELECT * FROM reports WHERE student_id = ? ORDER BY id DESC LIMIT 20').all(req.params.id) });
});
app.post('/api/students/:id/report/send', wrap(async (req, res) => {
  res.json(await sendDailyReport(Number(req.params.id), req.body?.date || todayVN()));
}));

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));
// thư viện giao diện phục vụ từ node_modules (không phụ thuộc CDN)
app.use('/vendor/katex', express.static(path.resolve('node_modules/katex/dist'), { maxAge: '30d' }));
app.get('/vendor/chart.umd.js', (req, res) => res.sendFile(path.resolve('node_modules/chart.js/dist/chart.umd.js')));
app.use(express.static(path.resolve('public')));

app.use((err, req, res, next) => {
  const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Lỗi máy chủ: ' + err.message : err.message });
});

const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, (err) => {
  if (err) return; // Express 5 gọi callback cả khi lỗi; xử lý ở server.on("error")
  console.log(`Gia sư Toán đang chạy: http://localhost:${PORT}`);
  const lan = lanUrls();
  if (lan.length) console.log(`Mở trên iPad / điện thoại (cùng mạng Wi‑Fi): ${lan.join('  hoặc  ')}`);
  console.log(`AI (Claude): ${aiEnabled() ? 'BẬT' : 'TẮT – dùng bộ sinh bài offline'} · Email: ${channelsConfigured().email ? 'có' : 'chưa'} · Zalo: ${channelsConfigured().zalo ? 'có' : 'chưa'}`);
  startScheduler();
});
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Gia sư Toán đã đang chạy sẵn. Mở trình duyệt tại http://localhost:${PORT}`);
    process.exit(0);
  }
  throw e;
});
