import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = process.env.DATA_DIR || path.resolve('data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const db = new DatabaseSync(process.env.DB_PATH || path.join(DATA_DIR, 'giasu.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 12),
  school_year_start TEXT NOT NULL,          -- YYYY-MM-DD, ngày khai giảng
  tet_break_weeks TEXT NOT NULL DEFAULT '[]',-- JSON: các tuần nghỉ Tết (không tính tiến độ)
  focus_topic_id TEXT,                      -- chủ đề ôn tập do người dùng chọn (ghi đè tiến độ)
  parent_name TEXT,
  parent_email TEXT,
  parent_zalo_user_id TEXT,
  report_time TEXT NOT NULL DEFAULT '20:00',-- giờ gửi báo cáo hằng ngày (giờ Việt Nam)
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date TEXT NOT NULL,                       -- YYYY-MM-DD (giờ Việt Nam)
  week INTEGER,
  topic_id TEXT,
  topic_name TEXT,
  source TEXT NOT NULL DEFAULT 'offline',   -- 'ai' | 'offline'
  status TEXT NOT NULL DEFAULT 'in_progress',
  score REAL,                               -- số câu đúng ngay lần đầu / 10
  comment TEXT,                             -- nhận xét sau khi hoàn thành
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  UNIQUE (student_id, date)
);

CREATE TABLE IF NOT EXISTS problems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES problems(id) ON DELETE CASCADE, -- bài gốc bị sai (với bài luyện lại)
  depth INTEGER NOT NULL DEFAULT 0,         -- 0 = bài trong đề hằng ngày, 1+ = bài luyện lại
  position INTEGER NOT NULL,
  topic_id TEXT,
  topic_name TEXT,
  kind TEXT NOT NULL,                       -- 'mcq' | 'essay'
  difficulty INTEGER NOT NULL,
  is_thinking INTEGER NOT NULL DEFAULT 0,
  question TEXT NOT NULL,
  choices TEXT NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL DEFAULT -1,
  choice_explanations TEXT NOT NULL DEFAULT '[]',
  final_answer TEXT,
  answer_key TEXT,
  solution TEXT,
  method TEXT,
  gen TEXT,                                 -- JSON: generator offline để sinh bài tương tự
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | grading | correct | wrong
  student_answer TEXT,
  image_paths TEXT NOT NULL DEFAULT '[]',
  feedback TEXT,                            -- JSON: nhận xét, giải thích
  answered_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_problems_assignment ON problems(assignment_id);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  channel TEXT NOT NULL,                    -- email | zalo
  status TEXT NOT NULL,                     -- sent | failed | skipped
  trigger TEXT NOT NULL DEFAULT 'manual',   -- auto (theo lịch) | manual
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export const json = (s, fallback = null) => { try { return s == null ? fallback : JSON.parse(s); } catch { return fallback; } };

/** Ngày hôm nay theo giờ Việt Nam (YYYY-MM-DD). */
export function todayVN(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
export function nowTimeVN(d = new Date()) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
}
