// So khớp đáp số cuối cùng của học sinh với đáp án chuẩn (dùng khi chấm offline).
// Chấp nhận: dấu phẩy hoặc chấm thập phân, phân số a/b, nhóm nghìn bằng dấu chấm/cách,
// thứ tự nghiệm bất kỳ (x = 2; y = 3 ≡ 3; 2 nếu đề không yêu cầu thứ tự).

function stripTex(s) {
  return String(s)
    .replace(/\$/g, '')
    .replace(/\\(?:d|t)?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\text\{[^}]*\}/g, ' ')
    .replace(/\\(cdot|times)/g, '*')
    .replace(/\{,\}/g, ',')
    .replace(/\\,/g, '')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/−/g, '-');
}

/** Mỗi token số trả về danh sách các cách hiểu có thể (do dấu chấm/phẩy mơ hồ). */
function numberTokens(raw) {
  let s = stripTex(raw).toLowerCase();
  s = s.replace(/([a-zđ])_?\d+/g, '$1'); // bỏ chỉ số dưới: x1, x_2, cm2
  s = s.replace(/(\d)\s+(?=\d{3}\b)/g, '$1'); // 12 345 → 12345
  const re = /-?\(?\d[\d.,]*\)?(?:\s*\/\s*\(?\d[\d.,]*\)?)?/g;
  const out = [];
  for (const m of s.match(re) || []) {
    const t = m.replace(/[()\s]/g, '');
    const parts = t.split('/');
    const alts = (x) => {
      const neg = x.startsWith('-');
      const y = x.replace(/^-/, '');
      const c = new Set();
      if (/^\d{1,3}(\.\d{3})+$/.test(y)) c.add(Number(y.replace(/\./g, ''))); // 1.000.000
      if (/^\d{1,3}(,\d{3})+$/.test(y)) c.add(Number(y.replace(/,/g, '')));
      c.add(Number(y.replace(',', '.')));
      return [...c].filter((v) => Number.isFinite(v)).map((v) => (neg ? -v : v));
    };
    if (parts.length === 2) {
      const vals = [];
      for (const a of alts(parts[0])) for (const b of alts(parts[1])) if (b) vals.push(a / b);
      if (vals.length) out.push(vals);
    } else {
      const v = alts(parts[0]);
      if (v.length) out.push(v);
    }
  }
  return out;
}

const close = (a, b) => Math.abs(a - b) <= Math.max(1e-6, Math.abs(b) * 0.005);

const norm = (s) => stripTex(s).toLowerCase().normalize('NFC').replace(/[\s.;:,]+/g, '').replace(/^x=/, '');

export function checkAnswer(expected, given) {
  if (given == null || String(given).trim() === '') return false;
  const exp = numberTokens(expected).map((alts) => alts[0]);
  if (!exp.length) return norm(given) === norm(expected) || norm(given).includes(norm(expected));
  const got = numberTokens(given);
  if (got.length !== exp.length) return false;
  // so khớp đa tập (không phụ thuộc thứ tự)
  const used = new Array(got.length).fill(false);
  return exp.every((e) => {
    const i = got.findIndex((alts, k) => !used[k] && alts.some((v) => close(v, e)));
    if (i < 0) return false;
    used[i] = true;
    return true;
  });
}
