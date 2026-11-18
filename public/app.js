// Giao diện Gia sư Toán (SPA thuần, không cần build).
const $app = document.getElementById('app');
let STATUS = null;
let CURRICULUM = null;
const charts = [];

// ---------------- tiện ích ----------------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const code = () => { try { return localStorage.getItem('accessCode') || ''; } catch { return ''; } };
const withCode = (url) => (code() ? `${url}${url.includes('?') ? '&' : '?'}code=${encodeURIComponent(code())}` : url);
const fmtDate = (d) => (d ? d.split('-').reverse().join('/') : '');
const DIFF = ['', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng', 'Vận dụng cao', 'Nâng cao'];

async function api(path, opts = {}) {
  const headers = { ...(opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(code() ? { 'x-access-code': code() } : {}) };
  const res = await fetch('/api' + path, { ...opts, headers, body: opts.body && !(opts.body instanceof FormData) ? JSON.stringify(opts.body) : opts.body });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && data.needCode) { askCode(); throw new Error('Cần mã truy cập'); }
  if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
  return data;
}

function askCode() {
  const c = prompt('Nhập mã truy cập của gia đình:');
  if (c) { try { localStorage.setItem('accessCode', c.trim()); } catch {} location.reload(); }
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3500);
}

/** Văn bản có LaTeX ($...$), xuống dòng và *nghiêng*. */
function rich(text) {
  const parts = String(text ?? '').split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g);
  return parts.map((p, i) => (i % 2 ? esc(p) : esc(p).replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>'))).join('');
}
function renderMath(el = $app) {
  if (window.renderMathInElement) {
    window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
  }
}
function waitFor(name, timeout = 8000) {
  return new Promise((r) => {
    if (window[name]) return r(true);
    const t0 = Date.now();
    const t = setInterval(() => { if (window[name] || Date.now() - t0 > timeout) { clearInterval(t); r(Boolean(window[name])); } }, 50);
  });
}
function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

/** Nén ảnh trước khi tải lên (cạnh dài tối đa 1600px, JPEG). */
async function compress(file) {
  // Ảnh từ camera iPad/iPhone có thể rất lớn hoặc ở định dạng HEIC → luôn vẽ lại thành JPEG ≤ 1600px.
  const load = async () => {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch { /* Safari cũ */ }
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url; });
      return img; // Safari tự xoay ảnh theo EXIF khi vẽ <img>
    } finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
  };
  try {
    const src = await load();
    const w = src.naturalWidth || src.width, h = src.naturalHeight || src.height;
    const scale = Math.min(1, 1600 / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.round(w * scale); c.height = Math.round(h * scale);
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85));
    if (!blob) throw new Error('toBlob');
    return new File([blob], (file.name || 'anh').replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch { return file; }
}

// ---------------- router ----------------
async function route() {
  charts.splice(0).forEach((c) => c.destroy());
  const h = location.hash.slice(1) || '/';
  let m;
  try {
    if ((m = h.match(/^\/student\/(\d+)$/))) return await viewStudent(+m[1]);
    if ((m = h.match(/^\/student\/(\d+)\/settings$/))) return await viewSettings(+m[1]);
    if ((m = h.match(/^\/assignment\/(\d+)$/))) return await viewAssignment(+m[1]);
    return await viewHome();
  } catch (e) {
    $app.innerHTML = `<div class="banner warn">⚠️ ${esc(e.message)}</div><a class="btn" href="#/">← Về trang chủ</a>`;
  }
}
window.addEventListener('hashchange', route);

// ---------------- trang chủ ----------------
function studentForm(st = {}) {
  const grades = Array.from({ length: 12 }, (_, i) => i + 1).map((g) => `<option value="${g}" ${st.grade === g ? 'selected' : ''}>Lớp ${g}</option>`).join('');
  return `
  <div class="form-grid">
    <div><label>Tên học sinh *</label><input name="name" required value="${esc(st.name)}" placeholder="VD: Minh Anh"></div>
    <div><label>Chọn trình độ (lớp) để ôn *</label><select name="grade">${grades}</select></div>
    <div><label>Ngày khai giảng năm học</label><input type="date" name="school_year_start" value="${esc(st.school_year_start || '')}"><div class="muted small">Để trống: mặc định 05/09.</div></div>
    <div><label>Email phụ huynh</label><input type="email" name="parent_email" value="${esc(st.parent_email)}" placeholder="phuhuynh@gmail.com"></div>
    <div><label>Zalo user ID của phụ huynh (theo OA)</label><input name="parent_zalo_user_id" value="${esc(st.parent_zalo_user_id)}" placeholder="VD: 1234567890123456789"></div>
    <div><label>Giờ gửi báo cáo hằng ngày</label><input type="time" name="report_time" value="${esc(st.report_time || '20:00')}"></div>
  </div>`;
}
const formData = (form) => Object.fromEntries(new FormData(form).entries());

async function viewHome() {
  const students = await api('/students');
  $app.innerHTML = `
    <h1>Xin chào! 👋</h1>
    <p class="muted">Mỗi ngày 10 câu Toán theo đúng tiến độ sách giáo khoa <b>${esc(STATUS?.curriculum?.name || '')}</b>, từ dễ đến khó, có câu tư duy. Làm sai sẽ được giảng lại và luyện thêm cho tới khi đúng hết.</p>
    ${STATUS && !STATUS.ai ? `<div class="banner warn small">Chế độ <b>offline</b>: đề được sinh tự động, bài tự luận chấm theo đáp số cuối. Cấu hình <code>ANTHROPIC_API_KEY</code> để AI ra đề phong phú và chấm bài qua ảnh chụp.</div>` : ''}
    ${STATUS?.lanUrls?.length && /^(localhost|127\.)/.test(location.hostname) ? `<div class="banner small">📱 <b>Dùng trên iPad / điện thoại:</b> kết nối cùng mạng Wi‑Fi với máy tính này, mở Safari và gõ địa chỉ <b>${STATUS.lanUrls.map(esc).join('</b> hoặc <b>')}</b>. Sau đó bấm nút Chia sẻ → <i>Thêm vào MH chính</i> để dùng như một ứng dụng.</div>` : ''}
    <h2>Chọn học sinh</h2>
    <div class="grid">
      ${students.map((s) => `<a class="card student-card" href="#/student/${s.id}"><div class="row"><div class="avatar">${esc(s.name.trim()[0] || '?').toUpperCase()}</div><div><b>${esc(s.name)}</b><div class="muted small">Lớp ${s.grade}</div></div></div></a>`).join('') || '<p class="muted">Chưa có học sinh nào.</p>'}
    </div>
    <details class="card" ${students.length ? '' : 'open'}>
      <summary>➕ Thêm học sinh</summary>
      <form id="new-student">${studentForm()}<div class="row" style="margin-top:14px"><button class="btn primary">Tạo hồ sơ</button></div></form>
    </details>`;
  document.getElementById('new-student').onsubmit = async (e) => {
    e.preventDefault();
    try { const s = await api('/students', { method: 'POST', body: formData(e.target) }); location.hash = `#/student/${s.id}`; } catch (err) { toast(err.message); }
  };
}

// ---------------- trang học sinh ----------------
async function viewStudent(id) {
  const [st, prog] = await Promise.all([api(`/students/${id}`), api(`/students/${id}/progress`)]);
  const p = st.progress;
  const topics = CURRICULUM[st.grade] || [];
  const s = prog.summary;
  const trend = s.avgPrev7 != null && s.avg7 != null ? s.avg7 - s.avgPrev7 : null;
  const todayBtn = !st.today
    ? `<button class="btn primary big" id="start">✏️ Làm bài tập hôm nay</button>`
    : st.today.status === 'completed'
      ? `<a class="btn big" href="#/assignment/${st.today.id}">✅ Đã xong hôm nay (${st.today.score}/10) – xem lại</a>`
      : `<a class="btn primary big" href="#/assignment/${st.today.id}">▶️ Tiếp tục bài hôm nay</a>`;

  $app.innerHTML = `
    <div class="row spread"><a href="#/" class="btn link">← Danh sách</a><a href="#/student/${id}/settings" class="btn link">⚙️ Cài đặt</a></div>
    <h1>${esc(st.name)} · Lớp ${st.grade}</h1>
    <p class="muted" style="margin-top:0">${esc(p.semester)} · Tuần ${p.week}${p.phase === 'summer' ? ' (ôn tập hè)' : ''} · ${p.focused ? '🎯 Đang ôn chủ đề tự chọn' : '📖 Theo tiến độ SGK'}</p>
    <div class="card">
      <div class="muted small">Chủ đề đang học</div>
      <div style="font-size:18px;font-weight:700;margin:2px 0 12px">${esc(p.current.name)}</div>
      <label for="focus">Chọn chủ đề ôn tập</label>
      <select id="focus">
        <option value="">Tự động theo tiến độ sách giáo khoa (khuyên dùng)</option>
        ${topics.map((t) => `<option value="${t.id}" ${st.focus_topic_id === t.id ? 'selected' : ''}>Tuần ${t.week}: ${esc(t.name)}</option>`).join('')}
      </select>
      <div class="row" style="margin-top:14px">${todayBtn}</div>
      ${!st.today ? '<p class="muted small" style="margin-bottom:0">Đề gồm 10 câu từ dễ đến khó: trắc nghiệm làm trực tiếp, tự luận làm ra vở rồi chụp ảnh nộp.</p>' : ''}
    </div>

    <h2>Tiến bộ</h2>
    <div class="kpis">
      <div class="kpi"><div class="v">${s.completedDays}</div><div class="l">ngày đã hoàn thành</div></div>
      <div class="kpi"><div class="v">${s.avg7 != null ? s.avg7.toFixed(1) : '–'}<span class="muted small">/10</span></div><div class="l">điểm TB 7 ngày gần nhất${trend != null ? ` · ${trend >= 0 ? '▲' : '▼'} ${Math.abs(trend).toFixed(1)}` : ''}</div></div>
      <div class="kpi"><div class="v">${prog.streak} 🔥</div><div class="l">ngày học liên tục</div></div>
      <div class="kpi" title="${esc(prog.level.note)}"><div class="v">Bậc ${prog.level.level}<span class="muted small">/4</span></div><div class="l">tư duy: ${esc(prog.level.name)}${prog.level.count < 15 ? ' (cần thêm dữ liệu)' : prog.level.target > prog.level.level ? ' · ▲ đang lên' : prog.level.target < prog.level.level ? ' · ▼ đang xuống' : ''}</div></div>
    </div>
    <p class="muted small">🧗 ${esc(prog.level.note)} Đề tự nâng bậc khi em làm đúng nhiều (nhất là câu khó) và hạ bậc khi em gặp khó khăn.</p>
    <div class="card"><b>Nhận xét:</b> ${esc(prog.comment)}</div>
    ${prog.days.length ? `
    <div class="card"><h3 style="margin-top:0">Điểm mỗi ngày (đúng ngay lần đầu)</h3><div class="chart-box"><canvas id="c-days" aria-label="Biểu đồ điểm theo ngày"></canvas></div></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
      <div class="card"><h3 style="margin-top:0">Tỉ lệ đúng theo chủ đề</h3><div class="chart-box tall"><canvas id="c-topics" aria-label="Tỉ lệ đúng theo chủ đề"></canvas></div></div>
      <div class="card"><h3 style="margin-top:0">Tỉ lệ đúng theo mức độ</h3><div class="chart-box tall"><canvas id="c-diff" aria-label="Tỉ lệ đúng theo mức độ"></canvas></div></div>
    </div>
    <details class="card"><summary>Bảng số liệu</summary>
      <table class="simple"><thead><tr><th>Ngày</th><th>Chủ đề</th><th>Điểm</th><th>Luyện lại</th></tr></thead><tbody>
      ${[...prog.days].reverse().map((d) => `<tr><td><a href="#/assignment/${d.id}">${fmtDate(d.date)}</a></td><td>${esc(d.topic_name)}</td><td>${d.status === 'completed' ? `${d.score}/10` : `<span class="muted">${d.first_correct}/${d.answered} (đang làm)</span>`}</td><td>${d.remediation}</td></tr>`).join('')}
      </tbody></table></details>` : '<p class="muted">Biểu đồ tiến bộ sẽ xuất hiện sau ngày học đầu tiên.</p>'}

    <h2>Báo cáo cho phụ huynh</h2>
    <div class="card">
      <p class="small muted" style="margin-top:0">Tự động gửi lúc <b>${esc(st.report_time)}</b> mỗi ngày tới ${[st.parent_email && `email ${esc(st.parent_email)}`, st.parent_zalo_user_id && 'Zalo'].filter(Boolean).join(' và ') || '<i>chưa có email/Zalo — thêm trong Cài đặt</i>'}.
      ${!STATUS.channels.email && st.parent_email ? '<br>⚠️ Máy chủ chưa cấu hình SMTP nên chưa gửi được email.' : ''}${!STATUS.channels.zalo && st.parent_zalo_user_id ? '<br>⚠️ Máy chủ chưa cấu hình Zalo OA.' : ''}</p>
      <div class="row"><button class="btn" id="preview">👁️ Xem trước báo cáo hôm nay</button><button class="btn" id="send">📨 Gửi ngay</button><a class="btn link" target="_blank" href="${withCode(`/api/students/${id}/report?format=html`)}">Bản email (HTML)</a></div>
      <div id="report-box"></div>
    </div>`;

  document.getElementById('focus').onchange = async (e) => {
    try { await api(`/students/${id}`, { method: 'PUT', body: { focus_topic_id: e.target.value || null } }); toast(e.target.value ? 'Đã chọn chủ đề ôn tập. Áp dụng từ đề tiếp theo.' : 'Quay lại theo tiến độ SGK.'); route(); } catch (err) { toast(err.message); }
  };
  const start = document.getElementById('start');
  if (start) start.onclick = async () => {
    start.disabled = true;
    start.innerHTML = `<span class="spinner"></span> Đang soạn đề${STATUS.ai ? ' (khoảng 30–60 giây)' : ''}…`;
    try { const a = await api(`/students/${id}/assignments`, { method: 'POST', body: {} }); location.hash = `#/assignment/${a.id}`; } catch (err) { toast(err.message); start.disabled = false; start.textContent = '✏️ Làm bài tập hôm nay'; }
  };
  document.getElementById('preview').onclick = async () => {
    const r = await api(`/students/${id}/report`);
    document.getElementById('report-box').innerHTML = `<div class="banner pre small">${esc(r.text)}</div>${r.history.length ? `<details><summary class="small">Lịch sử gửi</summary><table class="simple"><tbody>${r.history.map((h) => `<tr><td>${fmtDate(h.date)}</td><td>${h.channel}</td><td>${h.status === 'sent' ? '✅ đã gửi' : h.status === 'failed' ? '❌ lỗi' : '⏭️ bỏ qua'}</td><td class="muted">${esc(h.detail || '')}</td></tr>`).join('')}</tbody></table></details>` : ''}`;
  };
  document.getElementById('send').onclick = async (e) => {
    e.target.disabled = true;
    try { const r = await api(`/students/${id}/report/send`, { method: 'POST', body: {} }); toast(r.map((x) => `${x.channel}: ${x.status === 'sent' ? 'đã gửi' : x.status === 'failed' ? 'lỗi – ' + x.detail : x.detail}`).join(' · ')); } catch (err) { toast(err.message); }
    e.target.disabled = false;
  };
  if (prog.days.length) drawCharts(prog);
}

async function drawCharts(prog) {
  if (!(await waitFor('Chart'))) return;
  const s1 = cssVar('--series-1'), s2 = cssVar('--series-2'), grid = cssVar('--grid'), ink = cssVar('--text-2');
  Chart.defaults.color = ink;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  const done = prog.days.filter((d) => d.status === 'completed');
  const labels = done.map((d) => fmtDate(d.date).slice(0, 5));
  const ma = done.map((_, i) => { const w = done.slice(Math.max(0, i - 6), i + 1); return +(w.reduce((a, d) => a + d.score, 0) / w.length).toFixed(2); });
  const axis = { grid: { color: grid }, border: { display: false } };
  charts.push(new Chart(document.getElementById('c-days'), {
    type: 'line',
    data: { labels, datasets: [
      { label: 'Điểm trong ngày', data: done.map((d) => d.score), borderColor: s1, backgroundColor: s1, borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, tension: 0.25 },
      { label: 'Trung bình 7 ngày', data: ma, borderColor: s2, backgroundColor: s2, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, borderDash: [6, 4], tension: 0.25 },
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      scales: { y: { ...axis, min: 0, max: 10, ticks: { stepSize: 2 } }, x: { ...axis, grid: { display: false } } },
      plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, usePointStyle: true } }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}/10` } } } },
  }));
  const tp = prog.topics.filter((t) => t.total > 0);
  const short = (s) => (s.length > 28 ? s.slice(0, 27) + '…' : s);
  charts.push(new Chart(document.getElementById('c-topics'), {
    type: 'bar',
    data: { labels: tp.map((t) => short(t.topic_name)), datasets: [{ label: 'Tỉ lệ đúng', data: tp.map((t) => Math.round(t.rate * 100)), backgroundColor: s1, borderRadius: 4, maxBarThickness: 18 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { ...axis, min: 0, max: 100, ticks: { callback: (v) => v + '%' } }, y: { ...axis, grid: { display: false } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: (c) => tp[c[0].dataIndex].topic_name, label: (c) => `Đúng ${tp[c.dataIndex].correct}/${tp[c.dataIndex].total} câu (${c.parsed.x}%)` } } } },
  }));
  const bd = prog.byDifficulty;
  charts.push(new Chart(document.getElementById('c-diff'), {
    type: 'bar',
    data: { labels: bd.map((d) => `Mức ${d.d}`), datasets: [{ label: 'Tỉ lệ đúng', data: bd.map((d) => Math.round((d.correct / d.total) * 100)), backgroundColor: s1, borderRadius: 4, maxBarThickness: 36 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { ...axis, min: 0, max: 100, ticks: { callback: (v) => v + '%' } }, x: { ...axis, grid: { display: false } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: (c) => `Mức ${bd[c[0].dataIndex].d} – ${DIFF[bd[c[0].dataIndex].d]}`, label: (c) => `Đúng ${bd[c.dataIndex].correct}/${bd[c.dataIndex].total} câu (${c.parsed.y}%)` } } } },
  }));
}

// ---------------- cài đặt ----------------
async function viewSettings(id) {
  const st = await api(`/students/${id}`);
  $app.innerHTML = `
    <a href="#/student/${id}" class="btn link">← ${esc(st.name)}</a>
    <h1>Cài đặt hồ sơ</h1>
    <form id="f" class="card">${studentForm(st)}
      <div class="form-grid"><div><label>Các tuần nghỉ Tết (không tính vào tiến độ)</label><input name="tet_break_weeks" value="${esc((st.tet_break_weeks || []).join(', '))}" placeholder="VD: 21, 22"></div></div>
      <p class="muted small">Đổi lớp sẽ chuyển sang giáo trình của lớp đó, theo đúng tuần học hiện tại.</p>
      <div class="row"><button class="btn primary">Lưu</button></div>
    </form>
    <details class="card"><summary>Hướng dẫn lấy Zalo user ID</summary>
      <p class="small">Báo cáo Zalo được gửi qua <b>Zalo Official Account</b> (OA) của gia đình/trung tâm. Phụ huynh cần nhấn <i>Quan tâm</i> OA và nhắn một tin bất kì; ID người dùng (user_id theo OA) hiển thị trong trang quản lý OA hoặc trong webhook. Lưu ý: Zalo chỉ cho OA gửi tin tư vấn trong một khoảng thời gian sau lần tương tác gần nhất của phụ huynh.</p>
    </details>
    <div class="card"><button class="btn" id="del" style="color:var(--bad)">Xoá hồ sơ học sinh</button></div>`;
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault();
    try { await api(`/students/${id}`, { method: 'PUT', body: formData(e.target) }); toast('Đã lưu'); location.hash = `#/student/${id}`; } catch (err) { toast(err.message); }
  };
  document.getElementById('del').onclick = async () => {
    if (!confirm(`Xoá toàn bộ hồ sơ và kết quả học của ${st.name}? Không thể hoàn tác.`)) return;
    await api(`/students/${id}`, { method: 'DELETE' }); location.hash = '#/';
  };
}

// ---------------- làm bài ----------------
let CURRENT = null;

async function viewAssignment(id) {
  CURRENT = await api(`/assignments/${id}`);
  renderAssignment();
}

function renderAssignment() {
  const a = CURRENT;
  const c = a.counts;
  const pct = c.total ? Math.round((c.answered / c.total) * 100) : 0;
  $app.innerHTML = `
    <a href="#/student/${a.student_id}" class="btn link">← Trang học sinh</a>
    <h1>Bài tập ngày ${fmtDate(a.date)}</h1>
    <p class="muted" style="margin-top:0">Tuần ${a.week} · ${esc(a.topic_name)} · ${a.source === 'ai' ? 'Đề do AI soạn' : 'Đề tự động'}</p>
    <div class="row spread small"><span>Đã làm ${c.answered}/${c.total} câu${c.remediation ? ` (gồm ${c.remediation} bài luyện lại)` : ''}</span><span>Đúng ngay lần đầu: <b>${c.firstTryCorrect}/10</b></span></div>
    <div class="progress" style="margin:6px 0 4px"><div style="width:${pct}%"></div></div>
    <div id="done-box">${a.status === 'completed' ? doneBanner(a) : ''}</div>
    <div id="problems">${a.problems.map((p, i) => problemHtml(p, `Câu ${i + 1}`)).join('')}</div>`;
  bindProblems();
  renderMath();
  if (a.status === 'completed' && !a.comment) pollComment(a.id);
}

function doneBanner(a) {
  return `<div class="banner good"><div style="font-size:20px;font-weight:700">🎉 Hoàn thành! ${a.score}/10 câu đúng ngay lần đầu</div>
    <p style="margin:6px 0 0">${a.comment ? esc(a.comment) : '<span class="spinner"></span> Thầy cô đang viết nhận xét…'}</p></div>`;
}
async function pollComment(id) {
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    if (!CURRENT || CURRENT.id !== id || location.hash !== `#/assignment/${id}`) return;
    const a = await api(`/assignments/${id}`);
    if (a.comment) { CURRENT.comment = a.comment; document.getElementById('done-box').innerHTML = doneBanner(CURRENT); return; }
  }
}

function problemHtml(p, title) {
  const answered = p.status === 'correct' || p.status === 'wrong';
  const tags = [
    `<span class="tag"><b>${title}</b></span>`,
    `<span class="tag">${p.kind === 'mcq' ? 'Trắc nghiệm' : 'Tự luận'}</span>`,
    `<span class="tag ${p.difficulty >= 6 ? 'lv6' : ''}">${p.difficulty >= 6 ? '⭐ ' : ''}Mức ${p.difficulty} · ${DIFF[p.difficulty]}</span>`,
    p.is_thinking ? '<span class="tag think">🧠 Tư duy</span>' : '',
    `<span class="tag">${esc(p.topic_name)}</span>`,
  ].join('');
  let body = '';
  if (p.kind === 'mcq') {
    body = `<div class="choices">${p.choices.map((ch, i) => {
      let cls = '';
      if (answered) { if (i === p.correct_index) cls = 'is-correct'; else if (ch === p.student_answer) cls = 'is-wrong'; }
      return `<button class="choice ${cls}" data-pid="${p.id}" data-choice="${i}" ${answered ? 'disabled' : ''}><span class="letter">${'ABCD'[i]}.</span><span>${rich(ch)}</span></button>`;
    }).join('')}</div>`;
  } else if (!answered) {
    body = `
      <form class="essay" data-pid="${p.id}">
        <div class="upload">
          <div>📷 Làm bài ra vở, rồi chụp ảnh bài làm (tối đa 4 ảnh)</div>
          <input type="file" name="images" accept="image/*" capture="environment" multiple style="margin-top:8px">
          <div class="thumbs"></div>
        </div>
        <label>Đáp số cuối cùng ${STATUS.ai ? '(không bắt buộc – giúp chấm chính xác hơn)' : '(bắt buộc ở chế độ offline)'}</label>
        <input name="final_answer" placeholder="VD: x = 3; 12,5 cm²; 3/4" autocomplete="off">
        <div class="row" style="margin-top:10px"><button class="btn primary">Nộp bài</button></div>
        ${p.feedback && !p.feedback.correct && p.feedback.summary ? `<div class="banner warn small">${esc(p.feedback.summary)}</div>` : ''}
      </form>`;
  } else {
    body = `${p.image_paths.length ? `<div class="thumbs">${p.image_paths.map((src) => `<a href="${withCode(src)}" target="_blank"><img src="${withCode(src)}" alt="Ảnh bài làm"></a>`).join('')}</div>` : ''}${p.student_answer ? `<div class="small">Đáp số của em: <b>${esc(p.student_answer)}</b></div>` : ''}`;
  }
  const kids = p.children?.length
    ? `<div class="children"><div class="small muted" style="margin-top:4px">🔁 Luyện lại ${p.children.length} bài cùng dạng — làm đúng hết để hoàn thành:</div>${p.children.map((k, i) => problemHtml(k, `Luyện ${i + 1}`)).join('')}</div>` : '';
  return `<article class="card problem ${answered ? p.status : ''}" id="p-${p.id}">
    <div class="tags">${tags}</div>
    <div class="question">${rich(p.question)}</div>
    ${body}
    ${answered && p.feedback ? feedbackHtml(p) : ''}
    ${kids}
  </article>`;
}

function feedbackHtml(p) {
  const f = p.feedback;
  const ok = p.status === 'correct';
  const sec = (title, txt) => (txt ? `<h4>${title}</h4><div>${rich(txt)}</div>` : '');
  return `<div class="feedback ${ok ? 'good' : 'bad'}">
    <div class="head ${ok ? 'good-ink' : 'bad-ink'}">${ok ? '✔' : '✘'} ${esc(f.summary || (ok ? 'Đúng' : 'Chưa đúng'))}${f.mode === 'ai' && f.score != null ? ` · ${f.score}/10 điểm` : ''}</div>
    ${f.transcription ? sec('Thầy cô đọc được trong bài em', f.transcription) : ''}
    ${ok ? sec('Vì sao đúng', f.why_correct) : sec('Vì sao sai', f.mistakes)}
    ${ok && f.mistakes ? sec('Góp ý trình bày', f.mistakes) : ''}
    ${sec('Phương pháp làm', f.method || p.method)}
    ${p.final_answer ? `<h4>Đáp số</h4><div>$${esc(p.final_answer)}$</div>` : ''}
    ${(f.solution || p.solution) ? `<details style="margin-top:8px"><summary>Xem lời giải chi tiết</summary><div style="margin-top:6px">${rich(f.solution || p.solution)}</div></details>` : ''}
    ${f.encouragement ? `<p style="margin-bottom:0"><i>${esc(f.encouragement)}</i></p>` : ''}
  </div>`;
}

function bindProblems() {
  $app.querySelectorAll('.choice:not([disabled])').forEach((b) => {
    b.onclick = async () => {
      const pid = +b.dataset.pid;
      const card = document.getElementById('p-' + pid);
      card.querySelectorAll('.choice').forEach((x) => (x.disabled = true));
      b.innerHTML += ' <span class="spinner"></span>';
      try { await api(`/problems/${pid}/answer`, { method: 'POST', body: { choice: +b.dataset.choice } }); await refresh(pid); } catch (err) { toast(err.message); await refresh(pid); }
    };
  });
  $app.querySelectorAll('form.essay').forEach((form) => {
    const input = form.querySelector('input[type=file]');
    const thumbs = form.querySelector('.thumbs');
    let files = [];
    input.onchange = async () => {
      files = await Promise.all([...input.files].slice(0, 4).map(compress));
      thumbs.innerHTML = files.map((f) => `<img src="${URL.createObjectURL(f)}" alt="Ảnh xem trước">`).join('');
    };
    form.onsubmit = async (e) => {
      e.preventDefault();
      const pid = +form.dataset.pid;
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f, f.name));
      fd.append('final_answer', form.final_answer.value);
      if (!files.length && !form.final_answer.value.trim()) return toast('Em hãy chụp ảnh bài làm hoặc ghi đáp số nhé.');
      const btn = form.querySelector('button');
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> ${STATUS.ai && files.length ? 'Thầy cô đang chấm bài…' : 'Đang chấm…'}`;
      try {
        const r = await api(`/problems/${pid}/essay`, { method: 'POST', body: fd });
        if (r.retry) toast(r.feedback.summary);
        await refresh(pid);
      } catch (err) { toast(err.message); btn.disabled = false; btn.textContent = 'Nộp bài'; }
    };
  });
}

async function refresh(focusId) {
  CURRENT = await api(`/assignments/${CURRENT.id}`);
  const y = window.scrollY;
  renderAssignment();
  window.scrollTo(0, y);
  const el = document.getElementById('p-' + focusId);
  if (el) el.querySelector('.feedback')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------------- khởi động ----------------
(async function init() {
  try {
    STATUS = await api('/status');
    if (STATUS.needCode && !code()) askCode();
    CURRICULUM = await api('/curriculum');
    document.getElementById('status-pill').textContent = `${STATUS.ai ? '🤖 AI bật' : '⚙️ Offline'} · SGK ${STATUS.curriculum.name.split(' (')[0]}`;
    document.getElementById('status-pill').title = STATUS.curriculum.note;
  } catch (e) {
    $app.innerHTML = `<div class="banner warn">Không kết nối được máy chủ: ${esc(e.message)}</div>`;
    return;
  }
  await waitFor('renderMathInElement');
  route();
})();
