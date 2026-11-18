// Báo cáo hằng ngày cho phụ huynh qua email (SMTP) và Zalo Official Account.
import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { db, todayVN, nowTimeVN, DATA_DIR } from './db.js';
import { getStudent, listStudents, assignmentStats, progressData, overallComment, studentProgress } from './tutor.js';
import { CURRICULUM_SOURCE } from './curriculum.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (d) => d.split('-').reverse().join('/');

export function channelsConfigured() {
  return {
    email: Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM),
    zalo: Boolean(process.env.ZALO_OA_ACCESS_TOKEN || (process.env.ZALO_APP_ID && process.env.ZALO_APP_SECRET && (process.env.ZALO_REFRESH_TOKEN || fs.existsSync(tokenFile())))),
  };
}

/** Dữ liệu báo cáo của một ngày. */
export function buildReport(studentId, date = todayVN()) {
  const st = getStudent(studentId);
  if (!st) throw new Error('Không tìm thấy học sinh');
  const a = db.prepare('SELECT * FROM assignments WHERE student_id = ? AND date = ?').get(studentId, date);
  const prog = studentProgress(st, date);
  const data = progressData(studentId);
  const last7 = data.days.filter((d) => d.date <= date).slice(-7);
  const s = a ? assignmentStats(a.id) : null;
  const pending = a ? db.prepare("SELECT COUNT(*) AS n FROM problems WHERE assignment_id = ? AND status IN ('pending','grading')").get(a.id).n : 0;
  const weak = data.topics.filter((t) => t.total >= 3 && t.rate < 0.6).map((t) => `${t.topic_name} (${Math.round(t.rate * 100)}%)`);
  return { student: st, date, assignment: a, stats: s, pending, progress: prog, last7, weak, overall: overallComment(st, data), streak: data.streak };
}

export function reportText(r) {
  const { student: st, assignment: a, stats: s } = r;
  const lines = [`📘 BÁO CÁO HỌC TOÁN ${fmtDate(r.date)}`, `Học sinh: ${st.name} – Lớp ${st.grade}`, `Tiến độ: Tuần ${r.progress.week} (${r.progress.semester}) – ${r.progress.current.name}`];
  if (!a) lines.push('', '⚠️ Hôm nay em chưa làm bài tập.');
  else {
    lines.push('', `Kết quả: đúng ${s.firstTryCorrect}/${s.total} câu ngay lần đầu${a.status === 'completed' ? '' : ` (còn ${r.pending} câu chưa làm)`}`);
    if (s.thinkingTotal) lines.push(`Câu tư duy: ${s.thinkingCorrect}/${s.thinkingTotal}`);
    if (s.remediationProblems) lines.push(`Bài luyện lại sau khi sai: ${s.remediationCorrect}/${s.remediationProblems} đúng`);
    if (s.wrongTopics.length) lines.push(`Chủ đề còn sai: ${s.wrongTopics.join('; ')}`);
    if (a.comment) lines.push('', `Nhận xét: ${a.comment}`);
  }
  if (r.last7.length) lines.push('', `7 ngày gần nhất: ${r.last7.map((d) => `${d.date.slice(8)}/${d.date.slice(5, 7)}: ${d.status === 'completed' ? d.score + '/10' : '—'}`).join(' · ')}`);
  if (r.weak.length) lines.push(`Cần ôn thêm: ${r.weak.join('; ')}`);
  if (r.streak >= 2) lines.push(`🔥 Chuỗi ${r.streak} ngày học liên tục`);
  if (process.env.APP_URL) lines.push('', `Xem chi tiết: ${process.env.APP_URL}/#/student/${st.id}`);
  return lines.join('\n');
}

export function reportHtml(r) {
  const { student: st, assignment: a, stats: s } = r;
  const bar = (v, max = 10) => `<div style="background:#e8eef7;border-radius:4px;height:10px;width:120px;display:inline-block;vertical-align:middle"><div style="background:${v >= 8 ? '#2e9e6b' : v >= 5 ? '#e0a526' : '#d9534f'};height:10px;border-radius:4px;width:${Math.round((v / max) * 120)}px"></div></div>`;
  const rows = r.last7.map((d) => `<tr><td style="padding:4px 8px">${fmtDate(d.date)}</td><td style="padding:4px 8px">${esc(d.topic_name)}</td><td style="padding:4px 8px">${d.status === 'completed' ? `${bar(d.score)} <b>${d.score}/10</b>` : '<i>chưa xong</i>'}</td></tr>`).join('');
  return `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1d2a3a;max-width:640px;margin:auto">
<h2 style="color:#1f5fbf;margin-bottom:4px">Báo cáo học Toán ngày ${fmtDate(r.date)}</h2>
<p style="margin-top:0;color:#5a6b80">${esc(st.name)} – Lớp ${st.grade} · Tuần ${r.progress.week} (${r.progress.semester}) · ${esc(r.progress.current.name)}</p>
${a ? `<table style="border-collapse:collapse;margin:12px 0"><tr><td style="padding:4px 12px 4px 0">Đúng ngay lần đầu</td><td><b style="font-size:20px">${s.firstTryCorrect}/${s.total}</b> ${bar(s.firstTryCorrect, s.total)}</td></tr>
${s.thinkingTotal ? `<tr><td style="padding:4px 12px 4px 0">Câu tư duy</td><td><b>${s.thinkingCorrect}/${s.thinkingTotal}</b></td></tr>` : ''}
<tr><td style="padding:4px 12px 4px 0">Bài luyện lại</td><td>${s.remediationProblems ? `${s.remediationCorrect}/${s.remediationProblems} đúng` : 'không cần'}</td></tr>
<tr><td style="padding:4px 12px 4px 0">Trạng thái</td><td>${a.status === 'completed' ? '✅ Đã hoàn thành' : `⏳ Còn ${r.pending} câu chưa làm`}</td></tr>
${s.wrongTopics.length ? `<tr><td style="padding:4px 12px 4px 0">Chủ đề còn sai</td><td>${esc(s.wrongTopics.join('; '))}</td></tr>` : ''}</table>
${a.comment ? `<div style="background:#f3f7fd;border-left:4px solid #1f5fbf;padding:10px 14px;margin:12px 0"><b>Nhận xét:</b> ${esc(a.comment)}</div>` : ''}`
    : '<p style="background:#fff4e5;padding:10px 14px;border-radius:6px">⚠️ Hôm nay em chưa làm bài tập.</p>'}
<h3 style="margin-bottom:4px">7 ngày gần nhất</h3>
<table style="border-collapse:collapse;font-size:14px">${rows || '<tr><td>Chưa có dữ liệu</td></tr>'}</table>
<p><b>Nhận xét chung:</b> ${esc(r.overall)}</p>
${r.weak.length ? `<p><b>Cần ôn thêm:</b> ${esc(r.weak.join('; '))}</p>` : ''}
${process.env.APP_URL ? `<p><a href="${esc(process.env.APP_URL)}/#/student/${st.id}" style="color:#1f5fbf">Xem chi tiết và biểu đồ tiến bộ</a></p>` : ''}
<p style="color:#8a99ab;font-size:12px">Giáo trình: ${esc(CURRICULUM_SOURCE.name)}. Email tự động từ ứng dụng Gia sư Toán.</p>
</body></html>`;
}

// ---------------- email ----------------

let transporter;
function getTransporter() {
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

async function sendEmail(r) {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: r.student.parent_email,
    subject: `[Gia sư Toán] Báo cáo ngày ${fmtDate(r.date)} – ${r.student.name}`,
    text: reportText(r),
    html: reportHtml(r),
  });
}

// ---------------- Zalo OA ----------------
// Gửi tin nhắn tư vấn qua Zalo Official Account API v3. Phụ huynh cần quan tâm (follow) OA;
// user_id là ID người dùng theo OA (lấy từ webhook hoặc trang quản lý OA).

function tokenFile() { return path.join(DATA_DIR, 'zalo_token.json'); }

async function zaloAccessToken(forceRefresh = false) {
  const { ZALO_APP_ID, ZALO_APP_SECRET } = process.env;
  let saved = {};
  try { saved = JSON.parse(fs.readFileSync(tokenFile(), 'utf8')); } catch { /* chưa có */ }
  if (!forceRefresh && saved.access_token && saved.expires_at > Date.now() + 60_000) return saved.access_token;
  const refresh = saved.refresh_token || process.env.ZALO_REFRESH_TOKEN;
  if (ZALO_APP_ID && ZALO_APP_SECRET && refresh) {
    const res = await fetch('https://oauth.zaloapp.com/v4/oa/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', secret_key: ZALO_APP_SECRET },
      body: new URLSearchParams({ app_id: ZALO_APP_ID, refresh_token: refresh, grant_type: 'refresh_token' }),
    });
    const j = await res.json();
    if (!j.access_token) throw new Error('Làm mới Zalo token thất bại: ' + JSON.stringify(j));
    // refresh token chỉ dùng được một lần → lưu lại token mới
    fs.writeFileSync(tokenFile(), JSON.stringify({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + Number(j.expires_in || 3600) * 1000 }));
    return j.access_token;
  }
  if (process.env.ZALO_OA_ACCESS_TOKEN) return process.env.ZALO_OA_ACCESS_TOKEN;
  throw new Error('Chưa cấu hình Zalo OA');
}

async function sendZalo(r) {
  const text = reportText(r).slice(0, 2000); // giới hạn độ dài tin nhắn văn bản
  const post = async (token) => {
    const res = await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: token },
      body: JSON.stringify({ recipient: { user_id: r.student.parent_zalo_user_id }, message: { text } }),
    });
    return res.json();
  };
  let j = await post(await zaloAccessToken());
  if (j.error === -216 || j.error === -124) j = await post(await zaloAccessToken(true)); // token hết hạn
  if (j.error && j.error !== 0) throw new Error(`Zalo lỗi ${j.error}: ${j.message}`);
}

// ---------------- gửi ----------------

export async function sendDailyReport(studentId, date = todayVN(), trigger = 'manual') {
  const r = buildReport(studentId, date);
  const cfg = channelsConfigured();
  const results = [];
  const log = (channel, status, detail) => {
    db.prepare('INSERT INTO reports (student_id, date, channel, status, detail, trigger) VALUES (?, ?, ?, ?, ?, ?)').run(studentId, date, channel, status, detail || null, trigger);
    results.push({ channel, status, detail });
  };
  if (r.student.parent_email) {
    if (!cfg.email) log('email', 'skipped', 'Chưa cấu hình SMTP trên máy chủ');
    else try { await sendEmail(r); log('email', 'sent', r.student.parent_email); } catch (e) { log('email', 'failed', e.message); }
  }
  if (r.student.parent_zalo_user_id) {
    if (!cfg.zalo) log('zalo', 'skipped', 'Chưa cấu hình Zalo OA trên máy chủ');
    else try { await sendZalo(r); log('zalo', 'sent', r.student.parent_zalo_user_id); } catch (e) { log('zalo', 'failed', e.message); }
  }
  if (!results.length) log('none', 'skipped', 'Chưa có email hoặc Zalo của phụ huynh');
  return results;
}

/** Mỗi phút kiểm tra: học sinh nào đến giờ gửi báo cáo mà hôm nay chưa gửi thì gửi. */
export function startScheduler() {
  const tick = async () => {
    const date = todayVN();
    const now = nowTimeVN();
    for (const st of listStudents()) {
      if (!st.parent_email && !st.parent_zalo_user_id) continue;
      if ((st.report_time || '20:00') > now) continue;
      const sent = db.prepare("SELECT 1 FROM reports WHERE student_id = ? AND date = ? AND trigger = 'auto' LIMIT 1").get(st.id, date);
      if (sent) continue;
      try {
        const res = await sendDailyReport(st.id, date, 'auto');
        console.log(`[Báo cáo] ${st.name}:`, res.map((x) => `${x.channel}=${x.status}`).join(', '));
      } catch (e) { console.error('[Báo cáo] lỗi', e.message); }
    }
  };
  const timer = setInterval(() => tick().catch(console.error), 60_000);
  timer.unref();
  return timer;
}
