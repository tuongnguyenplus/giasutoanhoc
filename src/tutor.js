// Lõi gia sư: lập đề hằng ngày theo tiến độ SGK, chấm bài, giảng giải và vòng luyện lại.
import fs from 'node:fs';
import { db, json, todayVN } from './db.js';
import { getProgress, getTopics, findTopic, defaultSchoolYearStart } from './curriculum.js';
import { generateOffline } from './generators.js';
import { checkAnswer } from './answer.js';
import * as ai from './ai.js';

export const DAILY_COUNT = 10;
export const REMEDIATION_COUNT = 3;

// ---------------- học sinh ----------------

export function listStudents() {
  return db.prepare('SELECT * FROM students ORDER BY id').all().map(hydrateStudent);
}
export function getStudent(id) {
  const s = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  return s ? hydrateStudent(s) : null;
}
function hydrateStudent(s) {
  return { ...s, tet_break_weeks: json(s.tet_break_weeks, []) };
}

const STUDENT_FIELDS = ['name', 'grade', 'school_year_start', 'tet_break_weeks', 'focus_topic_id', 'parent_name', 'parent_email', 'parent_zalo_user_id', 'report_time'];

function cleanStudentInput(input, existing = {}) {
  const out = {};
  for (const k of STUDENT_FIELDS) if (k in input) out[k] = input[k];
  if ('grade' in out) {
    out.grade = Number(out.grade);
    if (!(out.grade >= 1 && out.grade <= 12)) throw httpError(400, 'Lớp phải từ 1 đến 12');
  }
  if ('name' in out && !String(out.name).trim()) throw httpError(400, 'Cần nhập tên học sinh');
  if ('school_year_start' in out && out.school_year_start && !/^\d{4}-\d{2}-\d{2}$/.test(out.school_year_start)) throw httpError(400, 'Ngày khai giảng không hợp lệ');
  if ('report_time' in out && out.report_time && !/^\d{2}:\d{2}$/.test(out.report_time)) throw httpError(400, 'Giờ gửi báo cáo không hợp lệ (HH:MM)');
  if ('tet_break_weeks' in out) out.tet_break_weeks = JSON.stringify((Array.isArray(out.tet_break_weeks) ? out.tet_break_weeks : String(out.tet_break_weeks || '').split(/[,; ]+/)).map(Number).filter((x) => x > 0));
  if ('focus_topic_id' in out) {
    const grade = out.grade ?? existing.grade;
    if (out.focus_topic_id && !getTopics(grade).some((t) => t.id === out.focus_topic_id)) out.focus_topic_id = null;
    out.focus_topic_id ||= null;
  }
  for (const k of ['parent_email', 'parent_zalo_user_id', 'parent_name']) if (k in out) out[k] = String(out[k] || '').trim() || null;
  return out;
}

export function createStudent(input) {
  const data = cleanStudentInput(input);
  if (!data.name || !data.grade) throw httpError(400, 'Cần nhập tên và lớp');
  data.school_year_start ||= defaultSchoolYearStart(new Date());
  data.report_time ||= '20:00';
  const keys = Object.keys(data);
  const r = db.prepare(`INSERT INTO students (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`).run(...keys.map((k) => data[k]));
  return getStudent(r.lastInsertRowid);
}

export function updateStudent(id, input) {
  const existing = getStudent(id);
  if (!existing) throw httpError(404, 'Không tìm thấy học sinh');
  if ('grade' in input && Number(input.grade) !== existing.grade && !('focus_topic_id' in input)) input.focus_topic_id = null;
  const data = cleanStudentInput(input, existing);
  const keys = Object.keys(data);
  if (keys.length) db.prepare(`UPDATE students SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).run(...keys.map((k) => data[k]), id);
  return getStudent(id);
}

export function deleteStudent(id) {
  db.prepare('DELETE FROM students WHERE id = ?').run(id);
}

/** Tiến độ giáo trình hiện tại của học sinh (có tính chủ đề ôn tập do người dùng chọn). */
export function studentProgress(student, date = todayVN(), overrideTopicId = null) {
  const prog = getProgress(student.grade, student.school_year_start, date, { tetBreakWeeks: student.tet_break_weeks });
  const focusId = overrideTopicId || student.focus_topic_id;
  const focus = focusId ? findTopic(focusId) : null;
  if (focus && focus.id.startsWith(student.grade + '-')) {
    const topics = getTopics(student.grade);
    const idx = topics.findIndex((t) => t.id === focus.id);
    return { ...prog, current: focus, previous: topics.slice(0, idx), learned: topics.slice(0, idx + 1), focused: true };
  }
  return { ...prog, focused: false };
}

// ---------------- thống kê ----------------

export function topicStats(studentId) {
  return db.prepare(`
    SELECT p.topic_id, p.topic_name, COUNT(*) AS total, SUM(p.status = 'correct') AS correct
    FROM problems p JOIN assignments a ON a.id = p.assignment_id
    WHERE a.student_id = ? AND p.status IN ('correct', 'wrong')
    GROUP BY p.topic_id ORDER BY MIN(p.id)`).all(studentId)
    .map((r) => ({ ...r, rate: r.total ? r.correct / r.total : 0 }));
}

// ---------------- lập đề ----------------

/** Lập 10 "ô" đề: độ khó tăng dần, trộn chủ đề hiện tại + ôn tập (ưu tiên chủ đề yếu), có câu tư duy. */
export function planSlots(student, prog, stats) {
  const diffs = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  const essayFrom = student.grade <= 2 ? 8 : student.grade <= 5 ? 7 : 6;
  const prev = prog.previous;
  const weak = stats.filter((s) => s.total >= 3 && s.rate < 0.7 && prev.some((t) => t.id === s.topic_id))
    .sort((a, b) => a.rate - b.rate).map((s) => prev.find((t) => t.id === s.topic_id));
  const recent = prev.slice(-3);
  const pickReview = (i) => (weak[i] || recent[recent.length - 1 - i] || recent[0] || prog.current);
  return diffs.map((difficulty, i) => {
    let topic = prog.current;
    if (prev.length && (i === 2 || i === 6)) topic = pickReview(i === 2 ? 1 : 0); // 2 câu ôn tập
    if (prog.phase === 'summer' && i % 2 === 1) topic = prog.learned[Math.floor(Math.random() * prog.learned.length)];
    return { topic, topic_id: topic.id, topic_name: topic.name, difficulty, kind: i >= essayFrom ? 'essay' : 'mcq', is_thinking: i >= 8 };
  });
}

const insertProblem = db.prepare(`INSERT INTO problems
  (assignment_id, parent_id, depth, position, topic_id, topic_name, kind, difficulty, is_thinking, question, choices, correct_index, choice_explanations, final_answer, answer_key, solution, method, gen)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

function saveProblem(assignmentId, slot, p, { parentId = null, depth = 0, position }) {
  const r = insertProblem.run(assignmentId, parentId, depth, position, slot.topic_id, slot.topic_name, p.kind, slot.difficulty, slot.is_thinking ? 1 : 0,
    p.question, JSON.stringify(p.choices || []), p.correct_index ?? -1, JSON.stringify(p.choice_explanations || []), p.final_answer, p.answer_key, p.solution, p.method,
    JSON.stringify(p.gen || { key: slot.topic?.gen, p: slot.topic?.p || {} }));
  return r.lastInsertRowid;
}

export async function createDailyAssignment(studentId, { topicId = null, date = todayVN() } = {}) {
  const student = getStudent(studentId);
  if (!student) throw httpError(404, 'Không tìm thấy học sinh');
  const existing = db.prepare('SELECT id FROM assignments WHERE student_id = ? AND date = ?').get(studentId, date);
  if (existing) return getAssignment(existing.id);

  const prog = studentProgress(student, date, topicId);
  const stats = topicStats(studentId);
  const slots = planSlots(student, prog, stats);

  let problems = null;
  let source = 'offline';
  if (ai.aiEnabled()) {
    try {
      const weakNotes = stats.filter((s) => s.total >= 3 && s.rate < 0.7).map((s) => `${s.topic_name}: đúng ${Math.round(s.rate * 100)}%`).join('; ');
      problems = await ai.generateProblems({ grade: student.grade, slots, weakNotes: weakNotes ? `Em còn yếu ở: ${weakNotes}` : '' });
      problems = problems.map((p, i) => ({ ...p, gen: { key: slots[i].topic.gen, p: slots[i].topic.p } }));
      source = 'ai';
    } catch (e) {
      console.error('[AI] Ra đề thất bại, dùng bộ sinh offline:', e.message);
    }
  }
  if (!problems) {
    const seen = new Set();
    const usedW = new Set();
    problems = slots.map((s) => {
      let p;
      for (let i = 0; i < 8; i++) { // tránh câu trùng nhau / trùng mẫu trong cùng một đề
        p = generateOffline(s.topic, s.difficulty, s.kind, { thinking: s.is_thinking, avoid: usedW });
        if (!seen.has(p.question) && !(p.wid && usedW.has(p.wid))) break;
        if (i === 7 && p.wid && usedW.has(p.wid)) p = { ...p, wid: null }; // đánh dấu để tìm chủ đề khác
      }
      // chủ đề hiện tại đã hết mẫu lời văn → lấy bài lời văn của một chủ đề đã học (ôn tập xen kẽ)
      if (s.kind === 'essay' && s.difficulty >= 3 && (!p.wid || seen.has(p.question)) && prog.previous.length) {
        const cands = [...prog.previous].sort(() => Math.random() - 0.5);
        for (const t of cands) {
          const q = generateOffline(t, s.difficulty, 'essay', { thinking: s.is_thinking, avoid: usedW });
          if (q.wid && !usedW.has(q.wid)) { p = q; Object.assign(s, { topic: t, topic_id: t.id, topic_name: t.name }); break; }
        }
      }
      seen.add(p.question);
      if (p.wid) usedW.add(p.wid);
      return p;
    });
  }

  // tạo đề trong một transaction (tránh trùng khi bấm 2 lần)
  db.exec('BEGIN');
  try {
    const again = db.prepare('SELECT id FROM assignments WHERE student_id = ? AND date = ?').get(studentId, date);
    if (again) { db.exec('ROLLBACK'); return getAssignment(again.id); }
    const r = db.prepare('INSERT INTO assignments (student_id, date, week, topic_id, topic_name, source) VALUES (?, ?, ?, ?, ?, ?)')
      .run(studentId, date, prog.week, prog.current.id, prog.current.name, source);
    const aid = r.lastInsertRowid;
    problems.forEach((p, i) => saveProblem(aid, slots[i], p, { position: i + 1 }));
    db.exec('COMMIT');
    return getAssignment(aid);
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

// ---------------- đọc đề ----------------

function hydrateProblem(p, { reveal }) {
  const out = {
    id: p.id, parent_id: p.parent_id, depth: p.depth, position: p.position, topic_id: p.topic_id, topic_name: p.topic_name,
    kind: p.kind, difficulty: p.difficulty, is_thinking: !!p.is_thinking, question: p.question, choices: json(p.choices, []),
    status: p.status, student_answer: p.student_answer, image_paths: json(p.image_paths, []).map((f) => `/uploads/${f}`),
    feedback: json(p.feedback), answered_at: p.answered_at,
  };
  if (reveal) Object.assign(out, { final_answer: p.final_answer, correct_index: p.correct_index, solution: p.solution, method: p.method });
  return out;
}

export function getAssignment(id) {
  const a = db.prepare('SELECT * FROM assignments WHERE id = ?').get(id);
  if (!a) return null;
  const rows = db.prepare('SELECT * FROM problems WHERE assignment_id = ? ORDER BY depth, position, id').all(id);
  const byId = new Map();
  const roots = [];
  for (const r of rows) {
    const p = hydrateProblem(r, { reveal: r.status === 'correct' || r.status === 'wrong' });
    p.children = [];
    byId.set(r.id, p);
    if (r.parent_id && byId.has(r.parent_id)) byId.get(r.parent_id).children.push(p); else roots.push(p);
  }
  const counts = {
    total: rows.length,
    answered: rows.filter((r) => r.status === 'correct' || r.status === 'wrong').length,
    pending: rows.filter((r) => r.status === 'pending' || r.status === 'grading').length,
    firstTryCorrect: rows.filter((r) => r.depth === 0 && r.status === 'correct').length,
    remediation: rows.filter((r) => r.depth > 0).length,
  };
  return { ...a, problems: roots, counts };
}

export function listAssignments(studentId, limit = 60) {
  return db.prepare('SELECT * FROM assignments WHERE student_id = ? ORDER BY date DESC LIMIT ?').all(studentId, limit);
}

// ---------------- chấm bài ----------------

function loadProblem(problemId) {
  const p = db.prepare(`SELECT p.*, a.student_id, a.status AS a_status FROM problems p JOIN assignments a ON a.id = p.assignment_id WHERE p.id = ?`).get(problemId);
  if (!p) throw httpError(404, 'Không tìm thấy câu hỏi');
  if (p.status === 'correct' || p.status === 'wrong') throw httpError(409, 'Câu này đã được chấm');
  if (p.status === 'grading') throw httpError(409, 'Câu này đang được chấm, em chờ một chút nhé');
  return p;
}

export async function answerMcq(problemId, choiceIndex) {
  const p = loadProblem(problemId);
  if (p.kind !== 'mcq') throw httpError(400, 'Câu này là tự luận');
  const choices = json(p.choices, []);
  const idx = Number(choiceIndex);
  if (!(idx >= 0 && idx < choices.length)) throw httpError(400, 'Phương án không hợp lệ');
  const expl = json(p.choice_explanations, []);
  const correct = idx === p.correct_index;
  const letter = 'ABCD'[idx];
  const feedback = correct
    ? { correct: true, mode: 'auto', summary: `Chính xác! Đáp án ${letter} đúng.`, why_correct: expl[idx] && expl[idx] !== 'Đây là đáp án đúng.' ? expl[idx] : 'Kết quả của em khớp với lời giải dưới đây.', method: p.method, solution: p.solution }
    : { correct: false, mode: 'auto', summary: `Chưa đúng. Em chọn ${letter}, đáp án đúng là ${'ABCD'[p.correct_index]}.`, mistakes: expl[idx] || 'Phương án này chưa đúng.', method: p.method, solution: p.solution };
  return finishAnswer(p, correct, feedback, { student_answer: choices[idx] });
}

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

/**
 * Nộp bài tự luận: ảnh chụp vở (+ đáp số cuối, không bắt buộc khi có AI).
 * @param {Array<{filename:string, path:string, mimetype:string}>} files
 */
export async function answerEssay(problemId, files, finalAnswer) {
  const p = loadProblem(problemId);
  if (p.kind !== 'essay') throw httpError(400, 'Câu này là trắc nghiệm');
  if (!files.length && !finalAnswer) throw httpError(400, 'Em hãy chụp ảnh bài làm (và/hoặc ghi đáp số cuối cùng)');
  const student = getStudent(p.student_id);
  const imageNames = files.map((f) => f.filename);
  db.prepare("UPDATE problems SET status = 'grading', image_paths = ?, student_answer = ? WHERE id = ?").run(JSON.stringify(imageNames), finalAnswer || null, p.id);

  let correct; let feedback;
  try {
    if (ai.aiEnabled() && files.length) {
      try {
        const images = files.map((f) => ({ media_type: MIME[(f.filename.match(/\.\w+$/) || [''])[0].toLowerCase()] || f.mimetype || 'image/jpeg', data: fs.readFileSync(f.path).toString('base64') }));
        const g = await ai.gradeEssay({ grade: student.grade, problem: p, images, finalAnswer });
        if (!g.readable && finalAnswer) throw new Error('Ảnh không đọc được');
        correct = g.is_correct && g.readable;
        feedback = {
          correct, mode: 'ai', score: g.score,
          summary: !g.readable ? 'Thầy/cô chưa đọc được bài làm trong ảnh. Em chụp lại rõ hơn (đủ sáng, không nghiêng) nhé.' : correct ? 'Bài làm đúng!' : 'Bài làm chưa đúng.',
          transcription: g.transcription, final_answer_seen: g.final_answer_seen,
          why_correct: g.why_correct, mistakes: g.mistakes, method: g.correct_method || p.method, solution: p.solution, encouragement: g.encouragement,
        };
        if (!g.readable) {
          // cho nộp lại thay vì tính sai
          db.prepare("UPDATE problems SET status = 'pending' WHERE id = ?").run(p.id);
          return { problem: hydrateProblem({ ...p, status: 'pending', feedback: JSON.stringify(feedback) }, { reveal: false }), retry: true, feedback };
        }
      } catch (e) {
        console.error('[AI] Chấm tự luận thất bại:', e.message);
        if (!finalAnswer) {
          db.prepare("UPDATE problems SET status = 'pending' WHERE id = ?").run(p.id);
          throw httpError(503, 'Hệ thống chấm ảnh đang bận. Em ghi thêm "đáp số cuối cùng" rồi nộp lại nhé.');
        }
      }
    }
    if (!feedback) {
      if (!finalAnswer) {
        db.prepare("UPDATE problems SET status = 'pending' WHERE id = ?").run(p.id);
        throw httpError(400, 'Chế độ chấm tự động cần em ghi "đáp số cuối cùng" bên cạnh ảnh bài làm.');
      }
      correct = checkAnswer(p.answer_key, finalAnswer);
      feedback = correct
        ? { correct, mode: 'auto', summary: 'Đáp số đúng!', why_correct: 'Đáp số của em khớp với kết quả của lời giải mẫu. Em đối chiếu từng bước trình bày của mình với lời giải dưới đây để chắc chắn lập luận cũng chặt chẽ.', method: p.method, solution: p.solution }
        : { correct, mode: 'auto', summary: 'Đáp số chưa đúng.', mistakes: `Em ghi đáp số "${finalAnswer}", nhưng đáp số đúng là $${p.final_answer}$. Em so sánh bài làm của mình với lời giải mẫu để tìm ra bước bị sai.`, method: p.method, solution: p.solution };
    }
  } catch (e) {
    if (db.prepare('SELECT status FROM problems WHERE id = ?').get(p.id)?.status === 'grading') db.prepare("UPDATE problems SET status = 'pending' WHERE id = ?").run(p.id);
    throw e;
  }
  return finishAnswer(p, correct, feedback, { student_answer: finalAnswer || null });
}

async function finishAnswer(p, correct, feedback, { student_answer }) {
  db.prepare("UPDATE problems SET status = ?, student_answer = COALESCE(?, student_answer), feedback = ?, answered_at = datetime('now') WHERE id = ?")
    .run(correct ? 'correct' : 'wrong', student_answer, JSON.stringify(feedback), p.id);
  let children = [];
  if (!correct) children = await remediate(p, student_answer);
  const assignment = finalizeIfDone(p.assignment_id);
  const row = db.prepare('SELECT * FROM problems WHERE id = ?').get(p.id);
  return { problem: hydrateProblem(row, { reveal: true }), feedback, new_problems: children, assignment_completed: assignment?.status === 'completed' };
}

/** Bài sai → ra thêm 3 bài cùng dạng (càng sai nhiều lần thì càng dễ hơn một chút). */
async function remediate(p, studentAnswer) {
  const student = getStudent(p.student_id);
  const depth = p.depth + 1;
  const base = p.difficulty - (depth >= 2 ? 1 : 0);
  const diffs = [Math.max(1, base - 1), Math.max(1, base), Math.max(1, base)];
  const gen = json(p.gen, {}) || {};
  const topic = { ...(findTopic(p.topic_id) || {}), gen: gen.key || findTopic(p.topic_id)?.gen, p: gen.p || findTopic(p.topic_id)?.p || {} };
  const slot = (d) => ({ topic, topic_id: p.topic_id, topic_name: p.topic_name, difficulty: d, is_thinking: false });
  let made = null;
  if (ai.aiEnabled()) {
    try {
      made = await ai.generateSimilar({ grade: student.grade, problem: p, n: REMEDIATION_COUNT, difficulty: Math.max(1, base), studentAnswer });
      made = made.map((x) => ({ ...x, gen }));
    } catch (e) {
      console.error('[AI] Sinh bài tương tự thất bại, dùng offline:', e.message);
    }
  }
  // cùng dạng: nếu bài gốc lấy từ mẫu lời văn thì sinh lại đúng mẫu đó với số liệu mới
  made ||= diffs.map((d) => generateOffline(topic, Math.max(d, gen.wid ? 3 : 1), p.kind, { wid: gen.wid || null }));
  const ids = made.map((x, i) => saveProblem(p.assignment_id, slot(diffs[i]), x, { parentId: p.id, depth, position: i + 1 }));
  return ids.map((id) => hydrateProblem(db.prepare('SELECT * FROM problems WHERE id = ?').get(id), { reveal: false }));
}

function finalizeIfDone(assignmentId) {
  const a = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
  if (a.status === 'completed') return a;
  const left = db.prepare("SELECT COUNT(*) AS n FROM problems WHERE assignment_id = ? AND status IN ('pending', 'grading')").get(assignmentId).n;
  if (left > 0) return a;
  const first = db.prepare("SELECT COUNT(*) AS n FROM problems WHERE assignment_id = ? AND depth = 0 AND status = 'correct'").get(assignmentId).n;
  db.prepare("UPDATE assignments SET status = 'completed', score = ?, completed_at = datetime('now') WHERE id = ?").run(first, assignmentId);
  // nhận xét được viết ngầm, không bắt học sinh chờ
  writeAssignmentComment(assignmentId).catch((e) => console.error('Nhận xét thất bại:', e.message));
  return { ...a, status: 'completed', score: first };
}

export function assignmentStats(assignmentId) {
  const rows = db.prepare('SELECT depth, topic_name, difficulty, kind, status, is_thinking FROM problems WHERE assignment_id = ?').all(assignmentId);
  const root = rows.filter((r) => r.depth === 0);
  const wrongTopics = [...new Set(root.filter((r) => r.status === 'wrong').map((r) => r.topic_name))];
  return {
    firstTryCorrect: root.filter((r) => r.status === 'correct').length,
    total: root.length,
    thinkingCorrect: root.filter((r) => r.is_thinking && r.status === 'correct').length,
    thinkingTotal: root.filter((r) => r.is_thinking).length,
    remediationProblems: rows.filter((r) => r.depth > 0).length,
    remediationCorrect: rows.filter((r) => r.depth > 0 && r.status === 'correct').length,
    wrongTopics,
    hardestCorrect: Math.max(0, ...root.filter((r) => r.status === 'correct').map((r) => r.difficulty)),
  };
}

export function ruleComment(name, s) {
  const pct = s.total ? s.firstTryCorrect / s.total : 0;
  const parts = [];
  if (pct >= 0.9) parts.push(`${name} làm rất tốt hôm nay: đúng ${s.firstTryCorrect}/${s.total} câu ngay lần đầu.`);
  else if (pct >= 0.7) parts.push(`${name} làm khá tốt: đúng ${s.firstTryCorrect}/${s.total} câu ngay lần đầu.`);
  else if (pct >= 0.5) parts.push(`${name} đạt mức trung bình: đúng ${s.firstTryCorrect}/${s.total} câu ngay lần đầu, cần cố gắng thêm.`);
  else parts.push(`Hôm nay ${name} gặp khá nhiều khó khăn: đúng ${s.firstTryCorrect}/${s.total} câu ngay lần đầu.`);
  if (s.thinkingTotal) parts.push(s.thinkingCorrect === s.thinkingTotal ? 'Em đã chinh phục được tất cả câu hỏi tư duy — rất đáng khen!' : `Câu hỏi tư duy: đúng ${s.thinkingCorrect}/${s.thinkingTotal}.`);
  if (s.wrongTopics.length) parts.push(`Cần ôn thêm: ${s.wrongTopics.join('; ')}.`);
  if (s.remediationProblems) parts.push(`Em đã làm thêm ${s.remediationProblems} bài luyện lại (đúng ${s.remediationCorrect}) và hoàn thành đầy đủ — tinh thần kiên trì rất tốt.`);
  return parts.join(' ');
}

async function writeAssignmentComment(assignmentId) {
  const a = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
  const st = getStudent(a.student_id);
  const s = assignmentStats(assignmentId);
  let comment = ruleComment(st.name, s);
  if (ai.aiEnabled()) {
    try { comment = await ai.writeComment({ name: st.name, grade: st.grade, stats: { ngay: a.date, chu_de: a.topic_name, ...s } }); } catch (e) { console.error('[AI] nhận xét:', e.message); }
  }
  db.prepare('UPDATE assignments SET comment = ? WHERE id = ?').run(comment, assignmentId);
}

// ---------------- tiến độ / biểu đồ ----------------

export function progressData(studentId) {
  const days = db.prepare(`
    SELECT a.id, a.date, a.week, a.topic_name, a.status, a.score, a.comment,
      (SELECT COUNT(*) FROM problems p WHERE p.assignment_id = a.id AND p.depth > 0) AS remediation,
      (SELECT COUNT(*) FROM problems p WHERE p.assignment_id = a.id AND p.depth = 0 AND p.status = 'correct') AS first_correct,
      (SELECT COUNT(*) FROM problems p WHERE p.assignment_id = a.id AND p.depth = 0 AND p.status IN ('correct','wrong')) AS answered
    FROM assignments a WHERE a.student_id = ? ORDER BY a.date`).all(studentId);
  const byDifficulty = db.prepare(`
    SELECT p.difficulty AS d, COUNT(*) AS total, SUM(p.status = 'correct') AS correct
    FROM problems p JOIN assignments a ON a.id = p.assignment_id
    WHERE a.student_id = ? AND p.depth = 0 AND p.status IN ('correct','wrong') GROUP BY p.difficulty ORDER BY p.difficulty`).all(studentId);
  const byKind = db.prepare(`
    SELECT p.kind, COUNT(*) AS total, SUM(p.status = 'correct') AS correct
    FROM problems p JOIN assignments a ON a.id = p.assignment_id
    WHERE a.student_id = ? AND p.status IN ('correct','wrong') GROUP BY p.kind`).all(studentId);
  // chuỗi ngày hoàn thành liên tiếp
  const done = new Set(days.filter((d) => d.status === 'completed').map((d) => d.date));
  let streak = 0;
  const cur = new Date(todayVN() + 'T00:00:00Z');
  if (!done.has(todayVN())) cur.setUTCDate(cur.getUTCDate() - 1);
  while (done.has(cur.toISOString().slice(0, 10))) { streak++; cur.setUTCDate(cur.getUTCDate() - 1); }
  const completed = days.filter((d) => d.status === 'completed');
  const last7 = completed.slice(-7);
  const prev7 = completed.slice(-14, -7);
  const avg = (arr) => (arr.length ? arr.reduce((s, d) => s + d.score, 0) / arr.length : null);
  return {
    days, topics: topicStats(studentId), byDifficulty, byKind, streak,
    summary: { completedDays: completed.length, avg7: avg(last7), avgPrev7: avg(prev7), avgAll: avg(completed) },
  };
}

export function overallComment(student, data) {
  const { summary, topics, streak, byDifficulty } = data;
  if (!summary.completedDays) return `${student.name} chưa hoàn thành bài nào. Hãy bắt đầu với bài tập hôm nay nhé!`;
  const parts = [];
  parts.push(`${student.name} đã hoàn thành ${summary.completedDays} ngày luyện tập, điểm trung bình ${summary.avgAll.toFixed(1)}/10.`);
  if (summary.avgPrev7 != null) {
    const delta = summary.avg7 - summary.avgPrev7;
    parts.push(delta > 0.3 ? `Điểm trung bình 7 ngày gần nhất tăng ${delta.toFixed(1)} điểm so với tuần trước — tiến bộ rõ rệt!` : delta < -0.3 ? `Điểm 7 ngày gần nhất giảm ${(-delta).toFixed(1)} điểm so với tuần trước, cần chú ý hơn.` : 'Kết quả ổn định so với tuần trước.');
  }
  const strong = topics.filter((t) => t.total >= 4 && t.rate >= 0.85).map((t) => t.topic_name);
  const weak = topics.filter((t) => t.total >= 3 && t.rate < 0.6).map((t) => t.topic_name);
  if (strong.length) parts.push(`Nắm vững: ${strong.slice(0, 3).join('; ')}.`);
  if (weak.length) parts.push(`Cần ôn thêm: ${weak.slice(0, 3).join('; ')}.`);
  const hard = byDifficulty.find((d) => d.d === 5);
  if (hard && hard.total >= 3) parts.push(`Câu vận dụng cao: đúng ${Math.round((hard.correct / hard.total) * 100)}%.`);
  if (streak >= 3) parts.push(`Chuỗi ${streak} ngày học liên tục — giữ vững nhé!`);
  return parts.join(' ');
}

// ---------------- tiện ích ----------------

export function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}
