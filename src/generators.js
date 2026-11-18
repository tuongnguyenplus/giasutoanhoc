// Bộ sinh bài tập offline (không cần AI). Mỗi generator nhận (p, d) với d = độ khó 1..5,
// trả về { q, ans, tex?, sol, method, wrongs? }:
//   q       – đề bài (cho phép LaTeX trong $...$)
//   ans     – đáp án chuẩn dạng máy đọc được (số dùng dấu chấm thập phân, phân số a/b)
//   tex     – đáp án hiển thị (LaTeX), mặc định suy ra từ ans
//   sol     – lời giải từng bước
//   method  – phương pháp chung cho dạng bài
//   wrongs  – các đáp án sai thường gặp kèm lý do (dùng làm phương án nhiễu trắc nghiệm)

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const round = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;
const NAMES = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Lan', 'Minh', 'Nam', 'Ngọc', 'Phong', 'Quân', 'Trang', 'Vy'];

/** Định dạng số kiểu Việt Nam: phẩy thập phân, nhóm nghìn bằng dấu cách. */
export function vn(x) {
  if (typeof x !== 'number') return String(x);
  const neg = x < 0;
  const [i, f] = String(Math.abs(round(x, 4))).split('.');
  const ip = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i;
  return (neg ? '-' : '') + ip + (f ? '{,}' + f : '');
}
const $ = (x) => `$${typeof x === 'number' ? vn(x) : x}$`;

// ---------- phân số ----------
const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
const fadd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
const fstr = (f) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);
const ftex = (f) => (f.d === 1 ? `${f.n}` : `${f.n < 0 ? '-' : ''}\\frac{${Math.abs(f.n)}}{${f.d}}`);
const randF = (neg, maxD = 9) => { const d = R(2, maxD); let n = R(1, d * 2 - 1); if (n % d === 0) n++; if (neg && Math.random() < 0.4) n = -n; return F(n, d); };
const ptex = (f) => (f.n < 0 ? `\\left(${ftex(f)}\\right)` : ftex(f));

// ---------- đa thức ----------
function polyTex(coefs, v = 'x') { // coefs[i] là hệ số của x^i
  const parts = [];
  for (let i = coefs.length - 1; i >= 0; i--) {
    const c = coefs[i]; if (!c) continue;
    const sign = c < 0 ? '-' : parts.length ? '+' : '';
    const a = Math.abs(c);
    const coef = i === 0 ? `${a}` : a === 1 ? '' : `${a}`;
    const vp = i === 0 ? '' : i === 1 ? v : `${v}^{${i}}`;
    parts.push(`${sign} ${coef}${vp}`.trim());
  }
  return parts.join(' ').replace(/^\+ /, '') || '0';
}
const pval = (coefs, x) => coefs.reduce((s, c, i) => s + c * x ** i, 0);
const sgn = (k) => (k < 0 ? `- ${-k}` : `+ ${k}`);

export const GENERATORS = {
  compare_numbers(p, d) {
    const max = p.max || 100;
    if (d <= 2) {
      let a = R(0, max), b = R(0, max); if (a === b) b = Math.min(max, b + 1);
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return { q: `Điền dấu thích hợp ($>, <, =$) vào chỗ trống: ${$(a)} $\\;\\square\\;$ ${$(b)}`, ans, tex: ans,
        sol: `So sánh ${vn(a)} và ${vn(b)}: ${vn(a)} ${ans} ${vn(b)}.`, method: 'So sánh số chữ số trước; nếu bằng nhau thì so sánh từng hàng từ trái sang phải.',
        wrongs: [[ans === '>' ? '<' : '>', 'Em đã so sánh ngược chiều dấu.'], ['=', 'Hai số không bằng nhau.']] };
    }
    if (d <= 4) {
      const arr = Array.from({ length: 4 }, () => R(Math.floor(max / 10), max));
      const big = d === 3 ? Math.max(...arr) : Math.min(...arr);
      return { q: `Trong các số ${arr.map((x) => $(x)).join(', ')}, số ${d === 3 ? 'lớn nhất' : 'bé nhất'} là số nào?`, ans: big,
        sol: `So sánh lần lượt các số, số ${d === 3 ? 'lớn nhất' : 'bé nhất'} là ${vn(big)}.`, method: 'So sánh từng cặp số, giữ lại số lớn hơn (hoặc bé hơn).',
        wrongs: [[d === 3 ? Math.min(...arr) : Math.max(...arr), 'Em đã chọn nhầm số bé nhất/lớn nhất.']] };
    }
    const a = R(1, Math.max(2, Math.floor(max / 2)));
    const n = R(3, 6);
    return { q: `Viết các số tự nhiên liên tiếp bắt đầu từ ${$(a)}. Số thứ ${n} trong dãy là số nào?`, ans: a + n - 1,
      sol: `Dãy: ${Array.from({ length: n }, (_, i) => vn(a + i)).join(', ')}. Số thứ ${n} là ${vn(a + n - 1)}.`,
      method: 'Hai số tự nhiên liên tiếp hơn kém nhau 1 đơn vị. Số thứ n = số đầu + (n − 1).', wrongs: [[a + n, 'Em quên rằng số đầu tiên đã là số thứ 1.']] };
  },

  add_sub(p, d) {
    const max = p.max || 100;
    const ops = p.ops || ['+', '-'];
    const op = pick(ops);
    let a, b;
    const gen = () => {
      if (op === '+') { a = R(0, max); b = R(0, max - a); } else { a = R(0, max); b = R(0, a); }
      if (p.noCarry && (a % 10) + (op === '+' ? b % 10 : 0) >= 10) return false;
      if (p.noCarry && op === '-' && a % 10 < b % 10) return false;
      return true;
    };
    for (let i = 0; i < 50 && !gen(); i++);
    const r = op === '+' ? a + b : a - b;
    const u = p.unit ? ` ${p.unit}` : '';
    if (d <= 2) {
      return { q: `Tính: ${$(`${vn(a)}${u ? '\\text{' + u + '}' : ''} ${op} ${vn(b)}${u ? '\\text{' + u + '}' : ''}`)}`, ans: r, tex: `${vn(r)}${u}`,
        sol: `${vn(a)} ${op} ${vn(b)} = ${vn(r)}${u}.`, method: op === '+' ? 'Cộng từ hàng đơn vị sang trái, nhớ 1 sang hàng tiếp theo nếu tổng ≥ 10.' : 'Trừ từ hàng đơn vị sang trái; nếu không trừ được thì mượn 1 ở hàng bên trái.',
        wrongs: [[op === '+' ? r + 10 : r - 10, 'Em đã nhớ/mượn sai một đơn vị ở hàng chục.'], [op === '+' ? Math.abs(a - b) : a + b, 'Em đã làm nhầm phép tính (cộng thành trừ hoặc ngược lại).']] };
    }
    if (d === 3) {
      return { q: `Tìm số thích hợp điền vào ô trống: ${op === '+' ? `$\\square + ${vn(b)} = ${vn(r)}$` : `${$(a)} $- \\square = ${vn(r)}$`}`, ans: op === '+' ? a : b,
        sol: op === '+' ? `Số hạng chưa biết = tổng − số hạng đã biết = ${vn(r)} − ${vn(b)} = ${vn(a)}.` : `Số trừ = số bị trừ − hiệu = ${vn(a)} − ${vn(r)} = ${vn(b)}.`,
        method: 'Muốn tìm số hạng chưa biết, lấy tổng trừ đi số hạng đã biết. Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu.',
        wrongs: [[op === '+' ? r + b : a + r, 'Em đã cộng thay vì trừ khi tìm thành phần chưa biết.']] };
    }
    const n1 = pick(NAMES), n2 = pick(NAMES.filter((x) => x !== n1));
    const thing = pick(['viên bi', 'quyển vở', 'bông hoa', 'cái kẹo', 'quả táo']);
    if (d === 4) {
      return op === '+'
        ? { q: `${n1} có ${vn(a)} ${thing}, ${n2} có ${vn(b)} ${thing}. Hỏi cả hai bạn có bao nhiêu ${thing}?`, ans: r, tex: `${vn(r)}`,
          sol: `Số ${thing} cả hai bạn có là: ${vn(a)} + ${vn(b)} = ${vn(r)} (${thing}).`, method: 'Bài toán "tìm tổng": gộp hai nhóm lại thì dùng phép cộng.', wrongs: [[Math.abs(a - b), 'Đề hỏi "cả hai" nên phải cộng, không phải trừ.']] }
        : { q: `${n1} có ${vn(a)} ${thing}, ${n1} cho ${n2} ${vn(b)} ${thing}. Hỏi ${n1} còn lại bao nhiêu ${thing}?`, ans: r,
          sol: `Số ${thing} ${n1} còn lại là: ${vn(a)} − ${vn(b)} = ${vn(r)} (${thing}).`, method: 'Bài toán "bớt đi": lấy số ban đầu trừ đi số đã cho.', wrongs: [[a + b, 'Cho đi thì số lượng giảm, phải dùng phép trừ.']] };
    }
    // d = 5: bài toán tư duy 2 bước
    const c = R(1, Math.max(2, Math.floor(max / 4)));
    const tot = a + c;
    return { q: `${n1} có ${vn(a)} ${thing}. ${n2} có nhiều hơn ${n1} ${vn(c)} ${thing}. Hỏi cả hai bạn có tất cả bao nhiêu ${thing}?`, ans: a + tot,
      sol: `Số ${thing} của ${n2}: ${vn(a)} + ${vn(c)} = ${vn(tot)}.\nCả hai bạn có: ${vn(a)} + ${vn(tot)} = ${vn(a + tot)} (${thing}).`,
      method: 'Bài toán 2 bước: tìm số lượng của bạn thứ hai trước ("nhiều hơn" → cộng), rồi mới tính tổng.', wrongs: [[a + c, 'Em mới tìm được số của bạn thứ hai, chưa tính tổng của cả hai.'], [tot, 'Em mới tìm số của một bạn.']] };
  },

  mul_div(p, d) {
    if (p.tables) {
      const tb = pick(p.tables), k = R(1, 10);
      if (d <= 2) return { q: `Tính: $${tb} \\times ${k}$`, ans: tb * k, sol: `${tb} × ${k} = ${tb * k} (bảng nhân ${tb}).`, method: `Thuộc bảng nhân ${tb}: mỗi lần tăng thêm ${tb}.`, wrongs: [[tb * (k + 1), 'Em đã nhầm sang dòng kế tiếp của bảng nhân.'], [tb + k, 'Em đã cộng thay vì nhân.']] };
      if (d === 3) return { q: `Tính: $${tb * k} : ${tb}$`, ans: k, sol: `Vì ${tb} × ${k} = ${tb * k} nên ${tb * k} : ${tb} = ${k}.`, method: 'Phép chia là phép tính ngược của phép nhân: dùng bảng nhân để tìm thương.', wrongs: [[k + 1, 'Em đã nhẩm sai bảng nhân.']] };
      const box = R(2, 9), each = tb;
      if (d === 4) return { q: `Mỗi hộp có ${each} cái bánh. Hỏi ${box} hộp như thế có bao nhiêu cái bánh?`, ans: each * box, sol: `${each} × ${box} = ${each * box} (cái bánh).`, method: 'Lấy số bánh mỗi hộp nhân với số hộp.', wrongs: [[each + box, 'Các hộp bằng nhau nên dùng phép nhân, không phải cộng.']] };
      return { q: `Có ${each * box} học sinh xếp đều thành ${tb} hàng. Sau đó thêm ${tb} học sinh nữa, chia đều vào các hàng. Hỏi mỗi hàng có bao nhiêu học sinh?`, ans: box + 1,
        sol: `Tổng số học sinh: ${each * box} + ${tb} = ${each * box + tb}.\nMỗi hàng: ${each * box + tb} : ${tb} = ${box + 1} (học sinh).`, method: 'Tính tổng số trước rồi chia đều.', wrongs: [[box, 'Em quên cộng thêm số học sinh mới đến.']] };
    }
    const digits = p.digits || 3;
    const a = R(10 ** (Math.min(digits, 2 + Math.floor(d / 2)) - 1), 10 ** Math.min(digits, 2 + Math.floor(d / 2)) - 1);
    const b = p.two && d >= 3 ? R(11, 99) : R(2, 9);
    if (d % 2 === 1) return { q: `Đặt tính rồi tính: $${vn(a)} \\times ${b}$`, ans: a * b, sol: `${vn(a)} × ${b} = ${vn(a * b)}.`, method: 'Nhân lần lượt từ hàng đơn vị, nhớ sang hàng kế tiếp.', wrongs: [[a * b + b * 10, 'Em quên/nhớ thừa khi nhân ở hàng chục.'], [a * b - 10, 'Em quên cộng phần nhớ.']] };
    const q = a, prod = q * b;
    return { q: `Đặt tính rồi tính: $${vn(prod)} : ${b}$`, ans: q, sol: `${vn(prod)} : ${b} = ${vn(q)} (thử lại: ${vn(q)} × ${b} = ${vn(prod)}).`, method: 'Chia lần lượt từ hàng cao nhất; mỗi lượt: chia – nhân – trừ – hạ.', wrongs: [[q + 10, 'Em đã sai một chữ số ở thương (thường do quên hạ chữ số).'], [Math.floor(q / 10), 'Em đã bỏ sót một chữ số 0 trong thương.']] };
  },

  times_more(p, d) {
    const a = R(2, 12), k = R(2, 6);
    const more = Math.random() < 0.5;
    if (more) return { q: `Gấp ${$(a)} lên ${k} lần được bao nhiêu?${d >= 4 ? ' Rồi bớt đi ' + a + ' thì còn bao nhiêu?' : ''}`, ans: d >= 4 ? a * k - a : a * k,
      sol: `Gấp ${a} lên ${k} lần: ${a} × ${k} = ${a * k}.${d >= 4 ? ` Bớt đi ${a}: ${a * k} − ${a} = ${a * k - a}.` : ''}`, method: 'Gấp lên n lần → nhân với n. Giảm đi n lần → chia cho n. "Thêm/bớt" → cộng/trừ.', wrongs: [[a + k, 'Gấp lên k lần là nhân, không phải cộng thêm k.']] };
    return { q: `Giảm ${$(a * k)} đi ${k} lần được bao nhiêu?`, ans: a, sol: `${a * k} : ${k} = ${a}.`, method: 'Giảm đi n lần → chia cho n.', wrongs: [[a * k - k, 'Giảm đi k lần là chia cho k, không phải trừ k.']] };
  },

  expr_order(p, d) {
    const a = R(2, 50), b = R(2, 9), c = R(2, 9), e = R(1, 20);
    if (d <= 2) return { q: `Tính giá trị biểu thức: $${a} + ${b} \\times ${c}$`, ans: a + b * c, sol: `Nhân trước, cộng sau: ${b} × ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}.`, method: 'Trong biểu thức có cộng, trừ, nhân, chia: thực hiện nhân, chia trước; cộng, trừ sau.', wrongs: [[(a + b) * c, 'Em đã cộng trước rồi mới nhân — sai thứ tự thực hiện phép tính.']] };
    if (d <= 4) return { q: `Tính giá trị biểu thức: $(${a} + ${e}) \\times ${b} - ${c}$`, ans: (a + e) * b - c, sol: `Trong ngoặc trước: ${a} + ${e} = ${a + e}; nhân: ${a + e} × ${b} = ${(a + e) * b}; trừ: ${(a + e) * b} − ${c} = ${(a + e) * b - c}.`, method: 'Có ngoặc thì tính trong ngoặc trước, sau đó nhân/chia, cuối cùng cộng/trừ.', wrongs: [[(a + e) * (b - c), 'Em đã trừ trước khi nhân.'], [a + e * b - c, 'Em đã bỏ qua dấu ngoặc.']] };
    const k = R(11, 30);
    return { q: `Tính nhanh: $${k} \\times ${b} + ${k} \\times ${c} + ${k} \\times ${10 - b - c > 0 ? 10 - b - c : 1}$`, ans: k * (b + c + (10 - b - c > 0 ? 10 - b - c : 1)),
      sol: `Đặt ${k} làm thừa số chung: ${k} × (${b} + ${c} + ${10 - b - c > 0 ? 10 - b - c : 1}) = ${k} × ${b + c + (10 - b - c > 0 ? 10 - b - c : 1)} = ${k * (b + c + (10 - b - c > 0 ? 10 - b - c : 1))}.`,
      method: 'Tính chất nhân một số với một tổng: a×b + a×c = a×(b + c). Tìm thừa số chung để tính nhanh.', wrongs: [] };
  },

  word_basic(p, d) {
    const n = pick(NAMES);
    if (p.money) {
      const price = R(2, 20) * 1000, qty = R(2, 5), pay = Math.ceil((price * qty) / 10000) * 10000 + (d >= 4 ? 10000 : 0);
      return { q: `${n} mua ${qty} quyển vở, mỗi quyển giá ${vn(price)} đồng. ${n} đưa cô bán hàng ${vn(pay)} đồng. Hỏi cô bán hàng trả lại ${n} bao nhiêu tiền?`, ans: pay - price * qty, tex: `${vn(pay - price * qty)}\\text{ đồng}`,
        sol: `Tiền mua vở: ${vn(price)} × ${qty} = ${vn(price * qty)} (đồng).\nTiền trả lại: ${vn(pay)} − ${vn(price * qty)} = ${vn(pay - price * qty)} (đồng).`, method: 'Tính tổng tiền phải trả = đơn giá × số lượng; tiền thừa = tiền đưa − tiền phải trả.', wrongs: [[pay - price, 'Em mới trừ giá một quyển vở, chưa nhân với số quyển.']] };
    }
    const u = p.unit || '';
    const a = R(10, p.max || 50), b = R(1, a - 1);
    const qs = [
      { q: `Thùng thứ nhất có ${a} ${u || 'lít'} dầu, thùng thứ hai ít hơn thùng thứ nhất ${b} ${u || 'lít'}. Hỏi thùng thứ hai có bao nhiêu ${u || 'lít'} dầu?`, ans: a - b, sol: `${a} − ${b} = ${a - b} (${u || 'lít'}).`, method: '"Ít hơn" → phép trừ.', wrongs: [[a + b, '"Ít hơn" phải trừ, không cộng.']] },
      { q: `Bao gạo thứ nhất nặng ${a} kg, bao thứ hai nặng hơn bao thứ nhất ${b} kg. Hỏi cả hai bao nặng bao nhiêu ki-lô-gam?`, ans: 2 * a + b, sol: `Bao thứ hai: ${a} + ${b} = ${a + b} (kg).\nCả hai bao: ${a} + ${a + b} = ${2 * a + b} (kg).`, method: 'Tìm bao thứ hai trước ("nặng hơn" → cộng), rồi tính tổng.', wrongs: [[a + b, 'Em mới tính bao thứ hai.']] },
    ];
    return d >= 4 ? qs[1] : qs[0];
  },

  clock(p, d) {
    const h = R(1, 11), m = d <= 2 ? 0 : pick([15, 30, 45]), add = R(1, 3);
    if (d <= 3) return { q: `Kim giờ chỉ số ${h}, kim phút chỉ số ${m === 0 ? 12 : m / 5}. Đồng hồ chỉ mấy giờ? (viết dạng giờ:phút)`, ans: `${h}:${String(m).padStart(2, '0')}`, tex: `${h}\\text{ giờ }${m}\\text{ phút}`,
      sol: `Kim giờ chỉ ${h}, kim phút chỉ ${m === 0 ? 12 : m / 5} tức là ${m} phút → ${h} giờ ${m} phút.`, method: 'Kim ngắn chỉ giờ, kim dài chỉ phút; mỗi số trên mặt đồng hồ ứng với 5 phút.', wrongs: [[`${m === 0 ? 12 : m / 5}:${String(h * 5 % 60).padStart(2, '0')}`, 'Em đã đọc nhầm kim giờ và kim phút.']] };
    return { q: `Buổi học bắt đầu lúc ${h} giờ ${m} phút và kéo dài ${add} giờ. Hỏi buổi học kết thúc lúc mấy giờ? (viết dạng giờ:phút)`, ans: `${h + add}:${String(m).padStart(2, '0')}`, tex: `${h + add}\\text{ giờ }${m}\\text{ phút}`,
      sol: `${h} giờ ${m} phút + ${add} giờ = ${h + add} giờ ${m} phút.`, method: 'Cộng số giờ với giờ bắt đầu, giữ nguyên số phút.', wrongs: [] };
  },

  polyline(p, d) {
    const k = d <= 2 ? 2 : d <= 4 ? 3 : 4;
    const seg = Array.from({ length: k }, () => R(2, 15));
    const sum = seg.reduce((a, b) => a + b, 0);
    const letters = 'ABCDE'.slice(0, k + 1);
    return { q: `Đường gấp khúc ${letters} gồm các đoạn thẳng có độ dài lần lượt là ${seg.map((x) => x + ' cm').join(', ')}. Tính độ dài đường gấp khúc.`, ans: sum, tex: `${sum}\\text{ cm}`,
      sol: `Độ dài đường gấp khúc = tổng độ dài các đoạn: ${seg.join(' + ')} = ${sum} (cm).`, method: 'Độ dài đường gấp khúc bằng tổng độ dài các đoạn thẳng tạo thành nó.', wrongs: [[sum - seg[0], 'Em đã bỏ sót một đoạn thẳng.']] };
  },

  unit_convert(p, d) {
    const tables = {
      length_basic: [['m', 'dm', 10], ['m', 'cm', 100], ['km', 'm', 1000], ['dm', 'cm', 10]],
      g3: [['cm', 'mm', 10], ['kg', 'g', 1000], ['l', 'ml', 1000], ['m', 'mm', 1000]],
      g4: [['tấn', 'kg', 1000], ['tạ', 'kg', 100], ['yến', 'kg', 10], ['m^2', 'dm^2', 100], ['dm^2', 'cm^2', 100]],
    };
    const [big, small, k] = pick(tables[p.kind] || tables.length_basic);
    const a = R(2, 9);
    if (d <= 3) return { q: `Điền số thích hợp: $${a}\\text{ ${big.replace('^2', '')}}${big.includes('^2') ? '^2' : ''} = \\square\\text{ ${small.replace('^2', '')}}${small.includes('^2') ? '^2' : ''}$`, ans: a * k,
      sol: `1 ${big} = ${k} ${small} nên ${a} ${big} = ${a} × ${k} = ${a * k} ${small}.`, method: 'Đổi từ đơn vị lớn sang đơn vị bé: nhân với tỉ số giữa hai đơn vị.', wrongs: [[a * k * 10, 'Em đã nhầm tỉ số giữa hai đơn vị.'], [a * 10, 'Em nhớ sai bảng đơn vị.']] };
    const b = R(1, k - 1);
    return { q: `Điền số thích hợp: $${a}\\text{ ${big.replace('^2', '')}}${big.includes('^2') ? '^2' : ''}\\;${b}\\text{ ${small.replace('^2', '')}}${small.includes('^2') ? '^2' : ''} = \\square\\text{ ${small.replace('^2', '')}}${small.includes('^2') ? '^2' : ''}$`, ans: a * k + b,
      sol: `${a} ${big} = ${a * k} ${small}; cộng thêm ${b} ${small}: ${a * k} + ${b} = ${a * k + b} ${small}.`, method: 'Đổi phần đơn vị lớn sang đơn vị bé rồi cộng phần còn lại.', wrongs: [[a * 10 + b, 'Em nhớ sai số lần giữa hai đơn vị.']] };
  },

  circle_basic(p, d) {
    const r = R(2, 20);
    if (d <= 3) return { q: `Hình tròn tâm O có bán kính ${r} cm. Đường kính của hình tròn dài bao nhiêu xăng-ti-mét?`, ans: 2 * r, tex: `${2 * r}\\text{ cm}`, sol: `Đường kính = 2 × bán kính = 2 × ${r} = ${2 * r} (cm).`, method: 'Trong một hình tròn, đường kính gấp 2 lần bán kính.', wrongs: [[r / 2, 'Đường kính gấp đôi bán kính, không phải một nửa.']] };
    return { q: `Hình tròn có đường kính ${2 * r} cm. Bán kính của hình tròn dài bao nhiêu xăng-ti-mét?`, ans: r, sol: `Bán kính = đường kính : 2 = ${2 * r} : 2 = ${r} (cm).`, method: 'Bán kính bằng một nửa đường kính.', wrongs: [[4 * r, 'Em đã nhân 2 thay vì chia 2.']] };
  },

  rect(p, d) {
    const a = R(3, 20), b = R(2, a - 1);
    if (d === 1) return { q: `Hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm. Tính chu vi hình chữ nhật.`, ans: 2 * (a + b), tex: `${2 * (a + b)}\\text{ cm}`, sol: `Chu vi = (${a} + ${b}) × 2 = ${2 * (a + b)} (cm).`, method: 'Chu vi hình chữ nhật = (dài + rộng) × 2.', wrongs: [[a + b, 'Em quên nhân 2.'], [a * b, 'Em đã tính diện tích thay vì chu vi.']] };
    if (d === 2) return { q: `Hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm. Tính diện tích hình chữ nhật.`, ans: a * b, tex: `${a * b}\\text{ cm}^2`, sol: `Diện tích = ${a} × ${b} = ${a * b} (cm²).`, method: 'Diện tích hình chữ nhật = dài × rộng (cùng đơn vị đo).', wrongs: [[2 * (a + b), 'Em đã tính chu vi thay vì diện tích.']] };
    if (d === 3) return { q: `Hình vuông có cạnh ${a} cm. Tính chu vi và diện tích hình vuông. (viết: chu vi, diện tích)`, ans: `${4 * a}; ${a * a}`, tex: `${4 * a}\\text{ cm};\\ ${a * a}\\text{ cm}^2`, sol: `Chu vi = ${a} × 4 = ${4 * a} (cm). Diện tích = ${a} × ${a} = ${a * a} (cm²).`, method: 'Hình vuông: chu vi = cạnh × 4; diện tích = cạnh × cạnh.', wrongs: [[`${2 * a}; ${a * a}`, 'Chu vi hình vuông là cạnh × 4.']] };
    if (d === 4) return { q: `Hình chữ nhật có chu vi ${2 * (a + b)} cm, chiều dài ${a} cm. Tính diện tích hình chữ nhật.`, ans: a * b, tex: `${a * b}\\text{ cm}^2`, sol: `Nửa chu vi: ${2 * (a + b)} : 2 = ${a + b} (cm).\nChiều rộng: ${a + b} − ${a} = ${b} (cm).\nDiện tích: ${a} × ${b} = ${a * b} (cm²).`, method: 'Từ chu vi tìm nửa chu vi (= dài + rộng), suy ra chiều rộng, rồi tính diện tích.', wrongs: [[a * (2 * (a + b) - a), 'Em quên chia đôi chu vi để được tổng dài + rộng.']] };
    return { q: `Một hình vuông có chu vi bằng chu vi hình chữ nhật dài ${a + 2 * b} cm, rộng ${a} cm. Tính diện tích hình vuông.`, ans: ((2 * (2 * a + 2 * b)) / 4) ** 2, tex: `${((2 * (2 * a + 2 * b)) / 4) ** 2}\\text{ cm}^2`,
      sol: `Chu vi hình chữ nhật: (${a + 2 * b} + ${a}) × 2 = ${2 * (2 * a + 2 * b)} (cm).\nCạnh hình vuông: ${2 * (2 * a + 2 * b)} : 4 = ${(2 * (2 * a + 2 * b)) / 4} (cm).\nDiện tích hình vuông: ${(2 * (2 * a + 2 * b)) / 4}² = ${((2 * (2 * a + 2 * b)) / 4) ** 2} (cm²).`, method: 'Dùng chu vi chung để tìm cạnh hình vuông, rồi tính diện tích.', wrongs: [[(a + 2 * b) * a, 'Đề hỏi diện tích hình vuông, không phải hình chữ nhật.']] };
  },

  large_numbers(p, d) {
    const x = R(1_000_000, 999_999_999);
    if (d <= 2) { const digit = String(x)[R(0, 2)]; const pos = String(x).indexOf(digit); const place = ['trăm triệu', 'chục triệu', 'triệu', 'trăm nghìn', 'chục nghìn', 'nghìn', 'trăm', 'chục', 'đơn vị'].slice(9 - String(x).length)[pos];
      return { q: `Trong số ${$(x)}, chữ số ${digit} (xuất hiện đầu tiên từ trái sang) thuộc hàng nào?`, ans: place, sol: `Đếm từ phải sang: đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn, triệu, chục triệu, trăm triệu. Chữ số ${digit} ở hàng ${place}.`, method: 'Mỗi lớp gồm 3 hàng: lớp đơn vị, lớp nghìn, lớp triệu.', wrongs: [] }; }
    if (d <= 4) { const k = d === 3 ? 1000 : 100000; const r = Math.round(x / k) * k;
      return { q: `Làm tròn số ${$(x)} đến hàng ${k === 1000 ? 'nghìn' : 'trăm nghìn'}.`, ans: r, sol: `Xét chữ số ngay bên phải hàng cần làm tròn: nếu ≥ 5 thì làm tròn lên, < 5 thì làm tròn xuống. Kết quả: ${vn(r)}.`, method: 'Làm tròn: nhìn chữ số liền sau hàng làm tròn (≥5 tăng 1, <5 giữ nguyên), các chữ số sau thay bằng 0.', wrongs: [[Math.floor(x / k) * k === r ? r + k : Math.floor(x / k) * k, 'Em làm tròn sai chiều (xem lại chữ số liền sau).']] }; }
    const a = R(100, 999), b = R(100, 999);
    return { q: `Số lớn nhất có 6 chữ số khác nhau mà các chữ số đều lẻ hoặc bằng 0 là số nào?`, ans: 975310, sol: 'Các chữ số lẻ và 0: 9, 7, 5, 3, 1, 0. Xếp giảm dần: 975 310.', method: 'Muốn số lớn nhất, đặt chữ số lớn nhất ở hàng cao nhất, giảm dần sang phải.', wrongs: [[a * 1000 + b, '']] };
  },

  avg_sum_diff(p, d) {
    if (d <= 2) { const arr = Array.from({ length: R(3, 4) }, () => R(10, 60)); const s = arr.reduce((a, b) => a + b, 0); const k = arr.length; const fix = (k - (s % k)) % k; arr[0] += fix; const avg = (s + fix) / k;
      return { q: `Tìm số trung bình cộng của các số: ${arr.join('; ')}.`, ans: avg, sol: `Tổng: ${arr.join(' + ')} = ${s + fix}. Trung bình cộng: ${s + fix} : ${k} = ${avg}.`, method: 'Trung bình cộng = tổng các số : số các số hạng.', wrongs: [[s + fix, 'Em quên chia cho số các số hạng.']] }; }
    const big = R(20, 200), small = R(5, big - 1), S = big + small, D = big - small;
    return { q: `Tổng của hai số là ${S}, hiệu của chúng là ${D}. Tìm số lớn${d >= 4 ? ' và số bé (viết: số lớn; số bé)' : ''}.`, ans: d >= 4 ? `${big}; ${small}` : big,
      sol: `Số lớn = (tổng + hiệu) : 2 = (${S} + ${D}) : 2 = ${big}.\nSố bé = ${S} − ${big} = ${small}.`, method: 'Bài toán tổng – hiệu: số lớn = (tổng + hiệu) : 2; số bé = (tổng − hiệu) : 2.', wrongs: [[d >= 4 ? `${small}; ${big}` : small, 'Em đã nhầm công thức số lớn và số bé.']] };
  },

  ratio_sum(p, d) {
    const m = R(1, 5), n = m + R(1, 4), unit = R(3, 20);
    const a = m * unit, b = n * unit;
    if (d <= 2) return { q: `Tỉ số của ${$(a)} và ${$(b)} là bao nhiêu? (viết phân số tối giản)`, ans: fstr(F(a, b)), tex: ftex(F(a, b)), sol: `Tỉ số của a và b là a : b = ${a}/${b} = ${fstr(F(a, b))}.`, method: 'Tỉ số của a và b là a : b (hay a/b), rút gọn về phân số tối giản.', wrongs: [[fstr(F(b, a)), 'Em viết ngược tỉ số (b : a).']] };
    if (d === 3) { const sc = pick([1000, 10000, 100000]), cm = R(2, 15); return { q: `Trên bản đồ tỉ lệ $1 : ${vn(sc)}$, quãng đường đo được ${cm} cm. Độ dài thật là bao nhiêu mét?`, ans: (cm * sc) / 100, tex: `${vn((cm * sc) / 100)}\\text{ m}`, sol: `Độ dài thật: ${cm} × ${vn(sc)} = ${vn(cm * sc)} cm = ${vn((cm * sc) / 100)} m.`, method: 'Độ dài thật = độ dài trên bản đồ × mẫu số tỉ lệ; nhớ đổi đơn vị.', wrongs: [[cm * sc, 'Em quên đổi xăng-ti-mét sang mét.']] }; }
    if (d === 4) return { q: `Tổng của hai số là ${a + b}. Tỉ số của số bé và số lớn là $\\frac{${m}}{${n}}$. Tìm số lớn.`, ans: b, sol: `Tổng số phần bằng nhau: ${m} + ${n} = ${m + n}. Giá trị một phần: ${a + b} : ${m + n} = ${unit}. Số lớn: ${unit} × ${n} = ${b}.`, method: 'Bài toán tổng – tỉ: vẽ sơ đồ đoạn thẳng, tìm giá trị một phần = tổng : tổng số phần.', wrongs: [[a, 'Đó là số bé.'], [Math.round(((a + b) * n) / m), 'Em chia nhầm theo số phần của số bé.']] };
    return { q: `Mẹ hơn con ${b - a + 0 === 0 ? 1 : (n - m) * unit} tuổi. Tuổi con bằng $\\frac{${m}}{${n}}$ tuổi mẹ. Tính tuổi con.`, ans: a, sol: `Hiệu số phần: ${n} − ${m} = ${n - m}. Giá trị một phần: ${(n - m) * unit} : ${n - m} = ${unit}. Tuổi con: ${unit} × ${m} = ${a}.`, method: 'Bài toán hiệu – tỉ: giá trị một phần = hiệu : hiệu số phần. Hiệu tuổi không đổi theo thời gian.', wrongs: [[b, 'Đó là tuổi mẹ.']] };
  },

  angles(p, d) {
    const a = R(20, 160);
    if (p.basic) { const kind = a < 90 ? 'góc nhọn' : a === 90 ? 'góc vuông' : 'góc tù';
      return { q: `Góc có số đo $${a}^\\circ$ là góc nhọn, góc vuông, góc tù hay góc bẹt?`, ans: kind, sol: `Góc nhọn < 90°, góc vuông = 90°, 90° < góc tù < 180°, góc bẹt = 180°. Vì ${a}° nên đây là ${kind}.`, method: 'So sánh số đo góc với 90° và 180°.', wrongs: [] }; }
    if (d <= 2) return { q: `Hai góc kề bù, một góc bằng $${a}^\\circ$. Tính số đo góc còn lại.`, ans: 180 - a, tex: `${180 - a}^\\circ`, sol: `Hai góc kề bù có tổng 180°: 180° − ${a}° = ${180 - a}°.`, method: 'Hai góc kề bù có tổng số đo bằng 180°.', wrongs: [[90 - a > 0 ? 90 - a : 360 - a, 'Em nhầm với hai góc phụ nhau (tổng 90°).']] };
    if (d <= 4) return { q: `Cho hai đường thẳng song song bị cắt bởi một cát tuyến. Một góc trong cùng phía bằng $${a}^\\circ$. Tính góc trong cùng phía còn lại.`, ans: 180 - a, tex: `${180 - a}^\\circ`, sol: `Hai góc trong cùng phía bù nhau: 180° − ${a}° = ${180 - a}°.`, method: 'Hai đường thẳng song song: góc so le trong bằng nhau, góc đồng vị bằng nhau, góc trong cùng phía bù nhau.', wrongs: [[a, 'Góc trong cùng phía bù nhau, không bằng nhau (bằng nhau là so le trong / đồng vị).']] };
    const b = R(20, 70);
    return { q: `Cho $a \\parallel b$. Điểm O nằm giữa hai đường thẳng. Tia OA tạo với đường a góc $${a > 90 ? a - 90 : a}^\\circ$, tia OB tạo với đường b góc $${b}^\\circ$ (các góc so le trong với góc AOB). Tính góc AOB.`, ans: (a > 90 ? a - 90 : a) + b, tex: `${(a > 90 ? a - 90 : a) + b}^\\circ`,
      sol: `Kẻ qua O đường thẳng c song song với a (và b). Góc AOB được chia thành hai góc bằng các góc so le trong: ${a > 90 ? a - 90 : a}° + ${b}° = ${(a > 90 ? a - 90 : a) + b}°.`, method: 'Bài toán "điểm giữa hai đường song song": kẻ thêm đường thẳng song song đi qua điểm đó rồi dùng góc so le trong.', wrongs: [[180 - (a > 90 ? a - 90 : a) - b, 'Em đã dùng tính chất bù nhau thay vì so le trong.']] };
  },

  triangle_angles(p, d) {
    const A = R(30, 90), B = R(20, 150 - A), C = 180 - A - B;
    if (d <= 3) return { q: `Tam giác ABC có $\\hat A = ${A}^\\circ$, $\\hat B = ${B}^\\circ$. Tính $\\hat C$.`, ans: C, tex: `${C}^\\circ`, sol: `Tổng ba góc trong tam giác bằng 180°: Ĉ = 180° − ${A}° − ${B}° = ${C}°.`, method: 'Định lí tổng ba góc: Â + B̂ + Ĉ = 180°.', wrongs: [[360 - A - B, 'Tổng ba góc trong tam giác là 180°, không phải 360°.']] };
    const x = R(10, 40);
    return { q: `Tam giác ABC có $\\hat A = ${180 - 3 * x - 30}^\\circ$, $\\hat B = 2\\hat C + 30^\\circ$. Tính $\\hat C$. ${d === 5 ? 'Sau đó tính góc ngoài tại đỉnh C.' : ''}`, ans: d === 5 ? 180 - x : x, tex: d === 5 ? `${180 - x}^\\circ` : `${x}^\\circ`,
      sol: `Â + B̂ + Ĉ = 180° ⇒ ${180 - 3 * x - 30} + (2Ĉ + 30) + Ĉ = 180 ⇒ 3Ĉ = ${3 * x} ⇒ Ĉ = ${x}°.${d === 5 ? ` Góc ngoài tại C = 180° − ${x}° = ${180 - x}°.` : ''}`, method: 'Đặt ẩn cho góc chưa biết, lập phương trình từ tổng ba góc bằng 180°. Góc ngoài = 180° − góc trong kề.', wrongs: [[2 * x + 30, 'Em đã tính góc B thay vì góc C.']] };
  },

  triangle_ineq(p, d) {
    const a = R(2, 9), b = R(2, 9);
    return { q: `Tam giác có hai cạnh dài $${a}$ cm và $${b}$ cm. Độ dài cạnh thứ ba là một số nguyên. Có bao nhiêu giá trị có thể có của cạnh thứ ba?`, ans: (a + b - 1) - (Math.abs(a - b) + 1) + 1,
      sol: `Bất đẳng thức tam giác: |${a} − ${b}| < c < ${a} + ${b}, tức ${Math.abs(a - b)} < c < ${a + b}. Các số nguyên từ ${Math.abs(a - b) + 1} đến ${a + b - 1}: có ${(a + b - 1) - (Math.abs(a - b) + 1) + 1} giá trị.`, method: 'Bất đẳng thức tam giác: hiệu hai cạnh < cạnh thứ ba < tổng hai cạnh.', wrongs: [[(a + b) - Math.abs(a - b) + 1, 'Em đã tính cả hai đầu mút (dấu < là bất đẳng thức chặt).']] };
  },

  divisibility(p, d) {
    if (p.prime && d >= 3) {
      const ps = [2, 3, 5, 7]; const e = ps.map(() => R(0, 2)); if (e.every((x) => !x)) e[0] = 2; const n = ps.reduce((s, q, i) => s * q ** e[i], 1);
      const fact = ps.map((q, i) => (e[i] ? (e[i] > 1 ? `${q}^${e[i]}` : `${q}`) : null)).filter(Boolean).join(' \\cdot ');
      const ndiv = e.reduce((s, x) => s * (x + 1), 1);
      return d === 5
        ? { q: `Số ${$(n)} có bao nhiêu ước số tự nhiên?`, ans: ndiv, sol: `${n} = ${fact.replace(/\\cdot/g, '·')}. Số ước = tích (số mũ + 1) = ${e.filter(Boolean).map((x) => `(${x}+1)`).join('·')} = ${ndiv}.`, method: 'Nếu n = a^x · b^y · c^z thì số ước của n là (x+1)(y+1)(z+1).', wrongs: [[ndiv - 1, 'Em quên đếm ước 1 hoặc chính nó.']] }
        : { q: `Phân tích số ${$(n)} ra thừa số nguyên tố (viết dạng tích, ví dụ $2^2\\cdot 3$).`, ans: fact.replace(/\\cdot/g, '*'), tex: fact, sol: `Chia liên tiếp cho các số nguyên tố từ nhỏ đến lớn: ${n} = ${fact.replace(/\\cdot/g, '·')}.`, method: 'Chia số đó cho số nguyên tố nhỏ nhất có thể (2, 3, 5, 7, …) cho tới khi thương bằng 1.', wrongs: [] };
    }
    const k = pick([2, 3, 5, 9]);
    const base = R(10, 99) * 10;
    const cands = [];
    for (let i = 0; i < 10; i++) cands.push(base + i);
    const ok = cands.filter((x) => x % k === 0);
    if (d <= 2) { const x = pick(ok); return { q: `Số nào sau đây chia hết cho ${k}?`, ans: x, sol: `${x} chia hết cho ${k} vì ${k === 2 ? 'chữ số tận cùng là số chẵn' : k === 5 ? 'chữ số tận cùng là 0 hoặc 5' : `tổng các chữ số ${String(x).split('').join(' + ')} = ${String(x).split('').reduce((s, c) => s + +c, 0)} chia hết cho ${k}`}.`,
      method: 'Chia hết cho 2: tận cùng chẵn. Cho 5: tận cùng 0 hoặc 5. Cho 3 (hoặc 9): tổng các chữ số chia hết cho 3 (hoặc 9).', wrongs: cands.filter((x) => x % k).slice(0, 3).map((x) => [x, `${x} không chia hết cho ${k}.`]) }; }
    const n = R(1, 9) * 100 + R(0, 9);
    const digits = []; for (let x = 0; x <= 9; x++) if ((n * 10 + x) % (k === 2 ? 6 : k === 5 ? 15 : k === 3 ? 6 : 18) === 0) digits.push(x);
    const kk = k === 2 ? 6 : k === 5 ? 15 : k === 3 ? 6 : 18;
    return { q: `Tìm tất cả chữ số $x$ để số $\\overline{${n}x}$ chia hết cho ${kk}. (Nếu không có, ghi "không có")`, ans: digits.length ? digits.join('; ') : 'không có',
      sol: `${kk} = ${kk === 6 ? '2 × 3' : kk === 15 ? '3 × 5' : '2 × 9'} (nguyên tố cùng nhau), nên số phải chia hết đồng thời cho cả hai. Thử các chữ số thoả mãn: ${digits.length ? digits.join(', ') : 'không có'}.`, method: 'Chia hết cho tích hai số nguyên tố cùng nhau ⇔ chia hết cho từng số.', wrongs: [] };
  },

  fraction(p, d) {
    const ops = p.ops || ['+'];
    const op = pick(ops);
    const neg = !!p.neg;
    if (op === 'simplify') { const f = F(R(1, 9), R(2, 12)); const k = R(2, 6); return { q: `Rút gọn phân số $\\frac{${f.n * k}}{${f.d * k}}$ về phân số tối giản.`, ans: fstr(f), tex: ftex(f), sol: `ƯCLN(${f.n * k}, ${f.d * k}) = ${k * gcd(f.n, f.d)}; chia cả tử và mẫu cho ${k}: ${ftex(f)}.`, method: 'Chia cả tử và mẫu cho ƯCLN của chúng.', wrongs: [[`${f.n * k / 2}/${f.d * k / 2}`, 'Phân số chưa tối giản — còn rút gọn được nữa.']] }; }
    if (op === 'compare') { const a = randF(false), b = randF(false); const s = a.n * b.d > b.n * a.d ? '>' : a.n * b.d < b.n * a.d ? '<' : '=';
      return { q: `So sánh hai phân số: $${ftex(a)} \\;\\square\\; ${ftex(b)}$`, ans: s, sol: `Quy đồng: ${ftex(a)} = ${a.n * b.d}/${a.d * b.d}, ${ftex(b)} = ${b.n * a.d}/${a.d * b.d}. Vậy ${ftex(a)} ${s} ${ftex(b)}.`, method: 'Quy đồng mẫu số rồi so sánh tử số (hoặc nhân chéo).', wrongs: [[s === '>' ? '<' : '>', 'Em so sánh nhầm (có thể đã so sánh mẫu thay vì quy đồng).']] }; }
    if (op === 'mixed') { const w = R(1, 5), f = randF(false); const fr = F(Math.abs(f.n) % f.d || 1, f.d); const res = F(w * fr.d + fr.n, fr.d);
      return { q: `Viết hỗn số $${w}${ftex(fr)}$ thành phân số.`, ans: fstr(res), tex: ftex(res), sol: `${w} ${ftex(fr)} = (${w} × ${fr.d} + ${fr.n}) / ${fr.d} = ${ftex(res)}.`, method: 'Tử số = phần nguyên × mẫu + tử; mẫu giữ nguyên.', wrongs: [[`${w + fr.n}/${fr.d}`, 'Em quên nhân phần nguyên với mẫu số.']] }; }
    if (op === 'pow') { const a = randF(neg, 5); const k = R(2, 3); const r = F(a.n ** k, a.d ** k);
      return { q: `Tính: $\\left(${ftex(a)}\\right)^{${k}}$`, ans: fstr(r), tex: ftex(r), sol: `Lũy thừa của phân số: (a/b)^n = aⁿ/bⁿ = ${ftex(r)}.`, method: 'Nâng cả tử và mẫu lên lũy thừa; chú ý dấu khi cơ số âm.', wrongs: [[fstr(F(a.n * k, a.d * k)), 'Em đã nhân với số mũ thay vì nâng lũy thừa.']] }; }
    let a = randF(neg), b = randF(neg);
    const opTex = { '+': '+', '-': '-', '*': '\\cdot', '/': ':' }[op];
    const fn = { '+': fadd, '-': fsub, '*': fmul, '/': fdiv }[op];
    let res = fn(a, b);
    let q = `Tính và rút gọn: $${ftex(a)} ${opTex} ${ptex(b)}$`;
    let sol = '';
    if (op === '+' || op === '-') { const m = lcm(a.d, b.d); sol = `Quy đồng mẫu ${m}: ${ftex(F(a.n * m / a.d, m))} ${op} ${ptex(F(b.n * m / b.d, m))}… = ${ftex(res)}.`.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2'); }
    if (op === '*') sol = `Nhân tử với tử, mẫu với mẫu: (${a.n}·${b.n})/(${a.d}·${b.d}) = ${fstr(res)}.`;
    if (op === '/') sol = `Chia cho một phân số là nhân với phân số nghịch đảo: ${fstr(a)} · ${b.d}/${b.n} = ${fstr(res)}.`;
    if (d >= 4) {
      const c = randF(neg);
      const op2 = pick(['+', '-']);
      const res2 = (op2 === '+' ? fadd : fsub)(res, c);
      q = `Tính và rút gọn: $${ftex(a)} ${opTex} ${ptex(b)} ${op2} ${ptex(c)}$`;
      sol += `\nSau đó: ${fstr(res)} ${op2} ${fstr(c)} = ${fstr(res2)}.`;
      if ((op === '+' || op === '-') && op2 === '-' && d === 5) sol += ' (Chú ý thứ tự thực hiện từ trái sang phải.)';
      res = res2;
    }
    const wr = op === '+' ? [[fstr(F(a.n + b.n, a.d + b.d)), 'Không được cộng tử với tử, mẫu với mẫu — phải quy đồng mẫu số trước.']]
      : op === '/' ? [[fstr(fmul(a, b)), 'Chia phân số phải nhân với phân số nghịch đảo của số chia.']]
      : op === '-' ? [[fstr(fadd(a, b)), 'Em nhầm dấu trừ thành cộng.']] : [[fstr(fdiv(a, b)), 'Em nhầm phép nhân thành phép chia.']];
    return { q, ans: fstr(res), tex: ftex(res), sol, method: { '+': 'Cộng phân số: quy đồng mẫu số, cộng các tử số, giữ mẫu chung, rút gọn.', '-': 'Trừ phân số: quy đồng mẫu số, trừ các tử số, giữ mẫu chung, rút gọn.', '*': 'Nhân phân số: tử nhân tử, mẫu nhân mẫu, rút gọn.', '/': 'Chia phân số: nhân phân số thứ nhất với nghịch đảo của phân số thứ hai.' }[op], wrongs: d >= 4 ? [] : wr };
  },

  decimal(p, d) {
    const op = pick(p.ops || ['+']);
    const a = round(R(100, 9999) / 100, 2), b = round(R(10, 999) / 100, 2);
    if (op === 'round') { const x = round(R(1000, 99999) / 1000, 3); const k = d <= 2 ? 1 : 2; const r = round(x, k);
      return { q: `Làm tròn số ${$(x)} đến hàng ${k === 1 ? 'phần mười' : 'phần trăm'}.`, ans: r, sol: `Xét chữ số ngay sau hàng ${k === 1 ? 'phần mười' : 'phần trăm'}: ≥ 5 thì tăng 1, < 5 thì giữ nguyên ⇒ ${vn(r)}.`, method: 'Làm tròn số thập phân giống số tự nhiên: nhìn chữ số liền sau hàng cần làm tròn.', wrongs: [[Math.trunc(x * 10 ** k) / 10 ** k === r ? round(r + 10 ** -k, k) : Math.trunc(x * 10 ** k) / 10 ** k, 'Em làm tròn sai chiều.']] }; }
    if (op === 'compare') { const x = round(R(100, 999) / 100, 2), y = round(R(1000, 9999) / 1000, 3); const s = x > y ? '>' : x < y ? '<' : '=';
      return { q: `So sánh: ${$(x)} $\\;\\square\\;$ ${$(y)}`, ans: s, sol: `So sánh phần nguyên trước, rồi lần lượt hàng phần mười, phần trăm, …: ${vn(x)} ${s} ${vn(y)}.`, method: 'So sánh phần nguyên; nếu bằng nhau thì so sánh từng chữ số phần thập phân từ trái sang phải.', wrongs: [[s === '>' ? '<' : '>', 'Số có nhiều chữ số thập phân hơn chưa chắc đã lớn hơn.']] }; }
    const r = round({ '+': a + b, '-': a - b, '*': a * b, '/': a }[op], 4);
    const shown = op === '/' ? round(a * b, 4) : a;
    const qtex = op === '/' ? `${vn(shown)} : ${vn(b)}` : `${vn(a)} ${op === '*' ? '\\times' : op} ${vn(b)}`;
    let ans = r, sol = `${qtex.replace('\\times', '×')} = ${vn(r)}.`;
    if (d >= 4) { const c = R(2, 9); ans = round(r * c, 4); sol += ` Nhân tiếp với ${c}: ${vn(ans)}.`; }
    return { q: `Tính: $${d >= 4 ? `(${qtex}) \\times ${round(ans / r)}` : qtex}$`, ans, sol,
      method: { '+': 'Đặt tính thẳng hàng dấu phẩy, cộng như số tự nhiên, đặt dấu phẩy thẳng cột.', '-': 'Đặt tính thẳng hàng dấu phẩy, trừ như số tự nhiên.', '*': 'Nhân như số tự nhiên, rồi đếm tổng số chữ số phần thập phân của hai thừa số để đặt dấu phẩy.', '/': 'Chuyển dấu phẩy ở số chia sang phải cho thành số tự nhiên, số bị chia cũng chuyển bấy nhiêu chữ số.' }[op],
      wrongs: op === '*' ? [[round(ans * 10, 4), 'Em đặt dấu phẩy sai vị trí (đếm thiếu chữ số thập phân).']] : [[round(ans / 10, 4), 'Em đặt dấu phẩy lệch một hàng.']] };
  },

  percent(p, d) {
    const pct = pick([5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75]);
    const base = R(2, 40) * 20;
    if (d <= 2) return { q: `Tìm ${pct}% của ${$(base)}.`, ans: round((base * pct) / 100), sol: `${vn(base)} × ${pct} : 100 = ${vn(round((base * pct) / 100))}.`, method: 'Muốn tìm a% của B: lấy B × a : 100.', wrongs: [[round(base / pct, 2), 'Em đã chia cho số phần trăm thay vì nhân rồi chia 100.']] };
    if (d === 3) { const part = round((base * pct) / 100); return { q: `Lớp có ${base / 20 * 2 > 50 ? base : base} học sinh? Không — Một số khi lấy ${pct}% thì được ${vn(part)}. Tìm số đó.`.replace(/^.*Không — /, ''), ans: base, sol: `Số cần tìm = ${vn(part)} × 100 : ${pct} = ${vn(base)}.`, method: 'Biết a% của một số là b, thì số đó bằng b × 100 : a.', wrongs: [[round((part * pct) / 100, 2), 'Em đã tính a% của b thay vì tìm số ban đầu.']] }; }
    if (d === 4) { const price = R(10, 90) * 10000; const fin = price * (100 - pct) / 100; return { q: `Một chiếc áo giá ${vn(price)} đồng, được giảm giá ${pct}%. Hỏi sau khi giảm, chiếc áo giá bao nhiêu tiền?`, ans: fin, tex: `${vn(fin)}\\text{ đồng}`, sol: `Số tiền giảm: ${vn(price)} × ${pct}% = ${vn(price * pct / 100)} đồng.\nGiá sau giảm: ${vn(price)} − ${vn(price * pct / 100)} = ${vn(fin)} đồng.`, method: 'Giá sau giảm = giá gốc × (100% − % giảm).', wrongs: [[price * pct / 100, 'Đó là số tiền được giảm, chưa phải giá bán.']] }; }
    const price = R(10, 50) * 10000;
    const up = pick([10, 20, 25]);
    const fin = round(price * (1 + up / 100) * (1 - up / 100));
    return { q: `Giá một món hàng ${vn(price)} đồng. Tháng 1 tăng ${up}%, tháng 2 lại giảm ${up}% so với giá tháng 1. Hỏi giá cuối tháng 2 là bao nhiêu? Giá mới cao hơn hay thấp hơn giá ban đầu?`, ans: fin, tex: `${vn(fin)}\\text{ đồng (thấp hơn)}`,
      sol: `Sau khi tăng: ${vn(price)} × ${100 + up}% = ${vn(price * (1 + up / 100))}.\nSau khi giảm: ${vn(price * (1 + up / 100))} × ${100 - up}% = ${vn(fin)} đồng < ${vn(price)}: thấp hơn giá ban đầu.`, method: 'Tăng/giảm phần trăm liên tiếp tính trên giá mới, nên tăng a% rồi giảm a% không trở về giá cũ.', wrongs: [[price, 'Tăng rồi giảm cùng tỉ lệ % không quay về giá cũ vì lần giảm tính trên giá đã tăng.']] };
  },

  area(p, d) {
    const shape = pick(p.shapes || ['triangle']);
    const a = R(4, 20), b = R(2, 15), h = R(2, 12);
    const S = { rect: ['Hình chữ nhật', `chiều dài ${a} cm, chiều rộng ${b} cm`, a * b, 'S = dài × rộng'], parallelogram: ['Hình bình hành', `độ dài đáy ${a} cm, chiều cao ${h} cm`, a * h, 'S = đáy × chiều cao'], rhombus: ['Hình thoi', `hai đường chéo ${a} cm và ${2 * b} cm`, a * b, 'S = (đường chéo 1 × đường chéo 2) : 2'], triangle: ['Hình tam giác', `độ dài đáy ${a} cm, chiều cao ${2 * h} cm`, a * h, 'S = đáy × chiều cao : 2'], trapezoid: ['Hình thang', `hai đáy ${a} cm và ${b} cm, chiều cao ${2 * h} cm`, (a + b) * h, 'S = (đáy lớn + đáy bé) × chiều cao : 2'] }[shape];
    if (d <= 3) return { q: `${S[0]} có ${S[1]}. Tính diện tích.`, ans: S[2], tex: `${S[2]}\\text{ cm}^2`, sol: `${S[3]} ⇒ S = ${S[2]} cm².`, method: `Công thức: ${S[3]}.`, wrongs: shape === 'triangle' || shape === 'rhombus' || shape === 'trapezoid' ? [[S[2] * 2, 'Em quên chia 2.']] : [[2 * (a + h), 'Em đã tính chu vi thay vì diện tích.']] };
    if (shape === 'triangle' || d === 4) return { q: `Một hình tam giác có diện tích ${a * h} cm², đáy dài ${a} cm. Tính chiều cao của tam giác.`, ans: 2 * h, tex: `${2 * h}\\text{ cm}`, sol: `h = 2S : đáy = 2 × ${a * h} : ${a} = ${2 * h} (cm).`, method: 'Từ S = đáy × h : 2 suy ra h = 2S : đáy.', wrongs: [[h, 'Em quên nhân 2 diện tích.']] };
    return { q: `Một mảnh vườn hình thang có đáy lớn ${a + b} m, đáy bé ${a} m, chiều cao bằng trung bình cộng hai đáy. Người ta trồng rau, cứ 1 m² thu được 2 kg rau. Hỏi thu được bao nhiêu ki-lô-gam rau?`, ans: (2 * a + b) * ((2 * a + b) / 2) / 2 * 2,
      sol: `Chiều cao: (${a + b} + ${a}) : 2 = ${(2 * a + b) / 2} (m).\nDiện tích: (${a + b} + ${a}) × ${(2 * a + b) / 2} : 2 = ${(2 * a + b) * ((2 * a + b) / 2) / 2} (m²).\nSố rau: ${(2 * a + b) * ((2 * a + b) / 2) / 2} × 2 = ${(2 * a + b) * ((2 * a + b) / 2)} (kg).`, method: 'Bài toán nhiều bước: tìm chiều cao → diện tích → sản lượng.', wrongs: [] };
  },

  circle(p, d) {
    const r = R(2, 15);
    if (p.advanced) {
      const R0 = R(5, 13), dd = R(1, R0 - 1);
      const pairs = [[5, 3, 4], [10, 6, 8], [13, 5, 12], [15, 9, 12], [17, 8, 15]];
      const [Rr, h, half] = pick(pairs);
      if (d <= 3) return { q: `Đường tròn (O; ${Rr} cm), dây AB cách tâm O một khoảng ${h} cm. Tính độ dài dây AB.`, ans: 2 * half, tex: `${2 * half}\\text{ cm}`, sol: `Gọi H là trung điểm AB thì OH ⊥ AB. AH = √(${Rr}² − ${h}²) = ${half}. AB = 2·AH = ${2 * half} cm.`, method: 'Đường kính vuông góc với dây thì đi qua trung điểm dây; dùng định lí Pythagore trong tam giác OAH.', wrongs: [[half, 'Em quên nhân 2 (AH chỉ là nửa dây).']] };
      return { q: `Từ điểm A nằm ngoài đường tròn (O; ${h} cm), kẻ tiếp tuyến AB (B là tiếp điểm). Biết OA = ${Rr} cm. Tính AB.`, ans: half, tex: `${half}\\text{ cm}`, sol: `Tiếp tuyến vuông góc với bán kính tại tiếp điểm: OB ⊥ AB. AB = √(OA² − OB²) = √(${Rr * Rr} − ${h * h}) = ${half} cm.`, method: 'Tiếp tuyến ⊥ bán kính tại tiếp điểm ⇒ tam giác vuông ⇒ Pythagore.', wrongs: [[Rr - h, 'Không được trừ trực tiếp độ dài, phải dùng Pythagore.']] };
    }
    if (d <= 2) return { q: `Tính chu vi hình tròn có bán kính ${r} cm (lấy $\\pi \\approx 3{,}14$).`, ans: round(2 * r * 3.14), tex: `${vn(round(2 * r * 3.14))}\\text{ cm}`, sol: `C = 2 × r × 3,14 = 2 × ${r} × 3,14 = ${vn(round(2 * r * 3.14))} (cm).`, method: 'Chu vi hình tròn: C = d × 3,14 = r × 2 × 3,14.', wrongs: [[round(r * 3.14), 'Em quên nhân 2 (dùng bán kính thay cho đường kính).'], [round(r * r * 3.14), 'Em đã tính diện tích thay vì chu vi.']] };
    if (d <= 4) return { q: `Tính diện tích hình tròn có ${d === 4 ? `đường kính ${2 * r}` : `bán kính ${r}`} cm (lấy $\\pi \\approx 3{,}14$).`, ans: round(r * r * 3.14), tex: `${vn(round(r * r * 3.14))}\\text{ cm}^2`, sol: `${d === 4 ? `Bán kính r = ${2 * r} : 2 = ${r} cm. ` : ''}S = r × r × 3,14 = ${r} × ${r} × 3,14 = ${vn(round(r * r * 3.14))} (cm²).`, method: 'Diện tích hình tròn: S = r × r × 3,14.', wrongs: [[round(2 * r * 3.14), 'Em đã tính chu vi.'], [round(4 * r * r * 3.14), 'Em dùng đường kính thay cho bán kính.']] };
    const C = round(2 * r * 3.14);
    return { q: `Một hình tròn có chu vi ${vn(C)} cm. Tính diện tích hình tròn đó (lấy $\\pi \\approx 3{,}14$).`, ans: round(r * r * 3.14), tex: `${vn(round(r * r * 3.14))}\\text{ cm}^2`, sol: `r = C : 2 : 3,14 = ${vn(C)} : 6,28 = ${r} cm. S = ${r} × ${r} × 3,14 = ${vn(round(r * r * 3.14))} cm².`, method: 'Từ chu vi suy ra bán kính, rồi tính diện tích.', wrongs: [] };
  },

  volume(p, d) {
    const a = R(2, 12), b = R(2, 10), c = R(2, 10);
    if (p.prism && d >= 3) { const b2 = R(3, 10), h2 = R(2, 8), H = R(3, 12); return { q: `Lăng trụ đứng đáy là tam giác có cạnh đáy ${b2} cm và chiều cao tương ứng ${2 * h2} cm; chiều cao lăng trụ ${H} cm. Tính thể tích.`, ans: b2 * h2 * H, tex: `${b2 * h2 * H}\\text{ cm}^3`, sol: `S đáy = ${b2} × ${2 * h2} : 2 = ${b2 * h2} cm². V = S đáy × h = ${b2 * h2} × ${H} = ${b2 * h2 * H} cm³.`, method: 'Thể tích lăng trụ đứng = diện tích đáy × chiều cao.', wrongs: [[2 * b2 * h2 * H, 'Em quên chia 2 khi tính diện tích tam giác đáy.']] }; }
    if (d <= 2) return { q: `Tính thể tích hình hộp chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm, chiều cao ${c} cm.`, ans: a * b * c, tex: `${a * b * c}\\text{ cm}^3`, sol: `V = ${a} × ${b} × ${c} = ${a * b * c} (cm³).`, method: 'V hình hộp chữ nhật = dài × rộng × cao.', wrongs: [[2 * (a + b) * c, 'Đó là diện tích xung quanh, không phải thể tích.']] };
    if (d === 3) return { q: `Hình lập phương có cạnh ${a} cm. Tính thể tích và diện tích toàn phần (viết: thể tích; diện tích toàn phần).`, ans: `${a ** 3}; ${6 * a * a}`, tex: `${a ** 3}\\text{ cm}^3;\\ ${6 * a * a}\\text{ cm}^2`, sol: `V = ${a}³ = ${a ** 3} cm³. S tp = 6 × ${a}² = ${6 * a * a} cm².`, method: 'Lập phương cạnh a: V = a³, S toàn phần = 6a².', wrongs: [[`${a ** 3}; ${4 * a * a}`, 'Diện tích toàn phần gồm 6 mặt (4 mặt là diện tích xung quanh).']] };
    const L = a * b * c;
    return { q: `Một bể nước hình hộp chữ nhật dài ${a} dm, rộng ${b} dm, cao ${c} dm đang chứa nước đến ${d === 5 ? '3/4' : '1/2'} chiều cao. Hỏi bể đang chứa bao nhiêu lít nước? (1 dm³ = 1 lít)`, ans: d === 5 ? L * 3 / 4 : L / 2, tex: `${vn(d === 5 ? L * 3 / 4 : L / 2)}\\text{ lít}`, sol: `Thể tích bể: ${a} × ${b} × ${c} = ${L} dm³. Nước chiếm ${d === 5 ? '3/4' : '1/2'}: ${vn(d === 5 ? L * 3 / 4 : L / 2)} dm³ = ${vn(d === 5 ? L * 3 / 4 : L / 2)} lít.`, method: 'Tính thể tích bể, nhân với phân số chiều cao mực nước; đổi dm³ sang lít.', wrongs: [[L, 'Bể chưa đầy, chỉ chứa một phần.']] };
  },

  speed(p, d) {
    const v = R(3, 12) * 5, t = R(1, 4), s = v * t;
    if (d <= 2) return { q: `Một ô tô đi với vận tốc ${v} km/giờ trong ${t} giờ. Tính quãng đường ô tô đi được.`, ans: s, tex: `${s}\\text{ km}`, sol: `s = v × t = ${v} × ${t} = ${s} (km).`, method: 's = v × t; v = s : t; t = s : v.', wrongs: [[v / t, 'Quãng đường = vận tốc × thời gian.']] };
    if (d === 3) return { q: `Một người đi xe đạp được ${s} km trong ${t} giờ. Tính vận tốc.`, ans: v, tex: `${v}\\text{ km/giờ}`, sol: `v = s : t = ${s} : ${t} = ${v} (km/giờ).`, method: 'v = s : t.', wrongs: [[s * t, 'Vận tốc = quãng đường : thời gian.']] };
    const v2 = v + R(1, 4) * 5, S = (v + v2) * t;
    if (d === 4) return { q: `Hai xe xuất phát cùng lúc từ hai địa điểm cách nhau ${S} km, đi ngược chiều nhau với vận tốc ${v} km/giờ và ${v2} km/giờ. Sau bao lâu hai xe gặp nhau?`, ans: t, tex: `${t}\\text{ giờ}`, sol: `Mỗi giờ hai xe gần nhau: ${v} + ${v2} = ${v + v2} km. Thời gian gặp: ${S} : ${v + v2} = ${t} (giờ).`, method: 'Chuyển động ngược chiều: thời gian gặp = khoảng cách : tổng vận tốc.', wrongs: [[S / (v2 - v), 'Ngược chiều phải dùng tổng vận tốc, không dùng hiệu.']] };
    const gap = (v2 - v) * t;
    return { q: `Xe máy đi trước ô tô ${gap} km, cùng chiều. Xe máy đi ${v} km/giờ, ô tô đi ${v2} km/giờ, hai xe xuất phát cùng lúc. Hỏi sau bao lâu ô tô đuổi kịp xe máy?`, ans: t, tex: `${t}\\text{ giờ}`, sol: `Mỗi giờ ô tô gần xe máy: ${v2} − ${v} = ${v2 - v} km. Thời gian đuổi kịp: ${gap} : ${v2 - v} = ${t} (giờ).`, method: 'Chuyển động cùng chiều đuổi nhau: thời gian = khoảng cách : hiệu vận tốc.', wrongs: [[round(gap / (v + v2), 2), 'Cùng chiều phải dùng hiệu vận tốc.']] };
  },

  sets_basic(p, d) {
    const a = R(2, 20), b = a + R(3, 12);
    if (d <= 2) return { q: `Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid ${a} \\le x \\le ${b}\\}$. Tập A có bao nhiêu phần tử?`, ans: b - a + 1, sol: `Số phần tử = ${b} − ${a} + 1 = ${b - a + 1}.`, method: 'Dãy số tự nhiên liên tiếp từ a đến b có (b − a) + 1 số.', wrongs: [[b - a, 'Em quên cộng 1 (đếm thiếu một đầu mút).']] };
    const st = R(1, 9), k = pick([2, 3, 5]), last = st + k * R(5, 20);
    return { q: `Tập hợp $B = \\{${st}; ${st + k}; ${st + 2 * k}; \\ldots; ${last}\\}$ có bao nhiêu phần tử?`, ans: (last - st) / k + 1, sol: `Số phần tử = (số cuối − số đầu) : khoảng cách + 1 = (${last} − ${st}) : ${k} + 1 = ${(last - st) / k + 1}.`, method: 'Dãy cách đều: số số hạng = (cuối − đầu) : khoảng cách + 1.', wrongs: [[(last - st) / k, 'Em quên cộng 1.']] };
  },

  powers(p, d) {
    const a = R(2, 5), m = R(2, 6), n = R(2, 5);
    if (d <= 2) return { q: `Viết kết quả dưới dạng một lũy thừa: $${a}^{${m}} \\cdot ${a}^{${n}}$ (ghi số mũ)`, ans: m + n, tex: `${a}^{${m + n}}`, sol: `aᵐ · aⁿ = aᵐ⁺ⁿ ⇒ ${a}^${m + n}.`, method: 'Nhân hai lũy thừa cùng cơ số: giữ cơ số, cộng số mũ.', wrongs: [[m * n, 'Nhân lũy thừa cùng cơ số thì cộng số mũ, không nhân.']] };
    if (d === 3) return { q: `Tính: $${a}^{${m + n}} : ${a}^{${n}}$`, ans: a ** m, sol: `aᵐ⁺ⁿ : aⁿ = aᵐ = ${a}^${m} = ${a ** m}.`, method: 'Chia hai lũy thừa cùng cơ số: giữ cơ số, trừ số mũ.', wrongs: [[a ** (m + n) / n, 'Chia lũy thừa: trừ số mũ.']] };
    const x = R(1, 4);
    if (d === 4) return { q: `Tìm số tự nhiên $x$, biết: $${a}^{x+${n}} = ${a ** (x + n)}$`, ans: x, sol: `${a ** (x + n)} = ${a}^${x + n} ⇒ x + ${n} = ${x + n} ⇒ x = ${x}.`, method: 'Đưa hai vế về cùng cơ số rồi cho số mũ bằng nhau.', wrongs: [[x + n, 'Em quên trừ đi ' + n + '.']] };
    const b = R(2, 9), c = R(2, 5);
    return { q: `Tính giá trị biểu thức: $${b}^2 \\cdot ${c} - ${a}^3 : ${a} + ${R(1, 9) * 0 + 10}$`, ans: b * b * c - a * a + 10, sol: `Lũy thừa trước: ${b}² = ${b * b}, ${a}³ = ${a ** 3}. Nhân chia: ${b * b} · ${c} = ${b * b * c}; ${a ** 3} : ${a} = ${a * a}. Cộng trừ: ${b * b * c} − ${a * a} + 10 = ${b * b * c - a * a + 10}.`, method: 'Thứ tự: lũy thừa → nhân, chia → cộng, trừ.', wrongs: [[(b * 2) * c - a * 3 / a + 10, 'Em đã nhân cơ số với số mũ thay vì tính lũy thừa.']] };
  },

  gcd_lcm(p, d) {
    const g = R(2, 12), a = g * R(2, 7), b = g * R(2, 7);
    const G = gcd(a, b), L = lcm(a, b);
    if (d <= 2) return { q: `Tìm ƯCLN(${a}, ${b}).`, ans: G, sol: `Phân tích ra thừa số nguyên tố, lấy các thừa số chung với số mũ nhỏ nhất ⇒ ƯCLN = ${G}.`, method: 'ƯCLN: tích các thừa số nguyên tố chung, mỗi thừa số lấy số mũ nhỏ nhất.', wrongs: [[L, 'Em đã tính BCNN thay vì ƯCLN.']] };
    if (d === 3) return { q: `Tìm BCNN(${a}, ${b}).`, ans: L, sol: `Lấy tất cả thừa số nguyên tố (chung và riêng) với số mũ lớn nhất ⇒ BCNN = ${L}.`, method: 'BCNN: tích các thừa số nguyên tố chung và riêng, mỗi thừa số lấy số mũ lớn nhất.', wrongs: [[a * b, 'Tích hai số chỉ là bội chung, chưa chắc là bội chung NHỎ NHẤT.'], [G, 'Đó là ƯCLN.']] };
    if (d === 4) return { q: `Có ${a} quyển vở và ${b} cái bút. Cô giáo muốn chia đều vào các phần quà sao cho mỗi phần có số vở như nhau, số bút như nhau. Có thể chia được nhiều nhất bao nhiêu phần quà?`, ans: G, sol: `Số phần quà là ước chung của ${a} và ${b}; nhiều nhất là ƯCLN(${a}, ${b}) = ${G}.`, method: '"Chia đều nhiều nhất" → ƯCLN; "ít nhất cùng lúc / cùng gặp lại" → BCNN.', wrongs: [[L, '"Chia nhiều nhất" dùng ƯCLN, không phải BCNN.']] };
    const x = R(2, 6), y = x + R(1, 4), z = y + R(1, 3);
    const Lz = lcm(lcm(x, y), z);
    return { q: `Ba bạn cùng trực nhật hôm nay. Bạn thứ nhất cứ ${x} ngày trực một lần, bạn thứ hai ${y} ngày, bạn thứ ba ${z} ngày. Hỏi sau ít nhất bao nhiêu ngày ba bạn lại cùng trực nhật?`, ans: Lz, sol: `Số ngày cần tìm là BCNN(${x}, ${y}, ${z}) = ${Lz}.`, method: '"Ít nhất bao lâu lại cùng" → BCNN.', wrongs: [[x * y * z === Lz ? Lz * 2 : x * y * z, 'Tích chưa chắc là BCNN.']] };
  },

  integers(p, d) {
    const a = R(-50, 50), b = R(-50, 50), c = R(-20, 20);
    const pt = (x) => (x < 0 ? `(${x})` : `${x}`);
    if (d <= 2) return { q: `Tính: $${a} + ${pt(b)}$`, ans: a + b, sol: `${a} + ${pt(b)} = ${a + b}.`, method: 'Cộng hai số nguyên cùng dấu: cộng giá trị tuyệt đối, giữ dấu. Khác dấu: lấy hiệu giá trị tuyệt đối, dấu của số có giá trị tuyệt đối lớn hơn.', wrongs: [[a - b, 'Em đã đổi dấu sai.'], [-(a + b), 'Em sai dấu kết quả.']] };
    if (d === 3) return { q: `Tính: $${a} - ${pt(b)}$`, ans: a - b, sol: `Trừ một số nguyên là cộng với số đối: ${a} + ${pt(-b)} = ${a - b}.`, method: 'a − b = a + (−b).', wrongs: [[a + b, 'Trừ số âm thì thành cộng — em đã giữ nguyên dấu.']] };
    if (d === 4) return { q: `Tính: $${pt(a)} \\cdot ${pt(c || 3)} - ${pt(b)}$`, ans: a * (c || 3) - b, sol: `${pt(a)}·${pt(c || 3)} = ${a * (c || 3)}; ${a * (c || 3)} − ${pt(b)} = ${a * (c || 3) - b}.`, method: 'Nhân hai số cùng dấu ra số dương, khác dấu ra số âm. Nhân trước, trừ sau.', wrongs: [[-a * (c || 3) - b, 'Em sai dấu khi nhân.']] };
    const n = R(5, 20);
    return { q: `Tính tổng: $S = 1 - 2 + 3 - 4 + \\ldots + ${2 * n - 1} - ${2 * n}$`, ans: -n, sol: `Ghép từng cặp: (1 − 2) + (3 − 4) + … + (${2 * n - 1} − ${2 * n}) gồm ${n} cặp, mỗi cặp bằng −1 ⇒ S = −${n}.`, method: 'Nhóm các số hạng thành cặp có tổng bằng nhau.', wrongs: [[n, 'Mỗi cặp bằng −1 nên tổng âm.'], [-2 * n, 'Số cặp là ' + n + ', không phải ' + 2 * n + '.']] };
  },

  segments(p, d) {
    const ab = R(4, 20) * 2, am = R(1, ab - 1);
    if (d <= 2) return { q: `Cho đoạn thẳng AB = ${ab} cm, M là trung điểm của AB. Tính AM.`, ans: ab / 2, tex: `${ab / 2}\\text{ cm}`, sol: `M là trung điểm ⇒ AM = AB : 2 = ${ab / 2} cm.`, method: 'Trung điểm chia đoạn thẳng thành hai đoạn bằng nhau.', wrongs: [[ab * 2, 'Trung điểm chia đôi, không nhân đôi.']] };
    if (d <= 4) return { q: `Điểm M nằm giữa A và B, AM = ${am} cm, AB = ${ab} cm. Tính MB.`, ans: ab - am, tex: `${ab - am}\\text{ cm}`, sol: `M nằm giữa A, B ⇒ AM + MB = AB ⇒ MB = ${ab} − ${am} = ${ab - am} cm.`, method: 'Nếu M nằm giữa A và B thì AM + MB = AB.', wrongs: [[ab + am, 'M nằm giữa nên phải trừ.']] };
    const n = R(5, 12);
    return { q: `Cho ${n} điểm, trong đó không có 3 điểm nào thẳng hàng. Vẽ đường thẳng đi qua từng cặp điểm. Có tất cả bao nhiêu đường thẳng?`, ans: (n * (n - 1)) / 2, sol: `Mỗi điểm nối với ${n - 1} điểm còn lại: ${n}·${n - 1} đường, mỗi đường được đếm 2 lần ⇒ ${n}·${n - 1} : 2 = ${(n * (n - 1)) / 2}.`, method: 'Số đường thẳng qua n điểm (không 3 điểm nào thẳng hàng) = n(n − 1) : 2.', wrongs: [[n * (n - 1), 'Mỗi đường thẳng bị đếm 2 lần, cần chia 2.']] };
  },

  prob(p, d) {
    if (p.experimental) { const n = R(20, 50), k = R(3, n - 3); return { q: `Tung một đồng xu ${n} lần, có ${k} lần xuất hiện mặt sấp. Xác suất thực nghiệm xuất hiện mặt sấp là bao nhiêu? (viết phân số tối giản)`, ans: fstr(F(k, n)), tex: ftex(F(k, n)), sol: `Xác suất thực nghiệm = số lần xảy ra / tổng số lần = ${k}/${n} = ${fstr(F(k, n))}.`, method: 'Xác suất thực nghiệm = số lần sự kiện xảy ra : tổng số lần thử.', wrongs: [[fstr(F(n - k, n)), 'Đó là xác suất mặt ngửa.']] }; }
    const r = R(2, 8), b = R(2, 8), g = R(1, 6), tot = r + b + g;
    if (d <= 2) return { q: `Một hộp có ${r} bi đỏ, ${b} bi xanh, ${g} bi vàng. Lấy ngẫu nhiên 1 viên. Tính xác suất lấy được bi đỏ.`, ans: fstr(F(r, tot)), tex: ftex(F(r, tot)), sol: `Số kết quả có thể: ${tot}. Số kết quả thuận lợi: ${r}. P = ${r}/${tot} = ${fstr(F(r, tot))}.`, method: 'P(A) = số kết quả thuận lợi cho A : tổng số kết quả có thể (đồng khả năng).', wrongs: [[fstr(F(r, b + g)), 'Mẫu số phải là TỔNG số bi.']] };
    if (d === 3) { const s = R(4, 10); const cnt = [1, 2, 3, 4, 5, 6].flatMap((x) => [1, 2, 3, 4, 5, 6].map((y) => x + y)).filter((x) => x === s).length;
      return { q: `Gieo hai con xúc xắc cân đối. Tính xác suất tổng số chấm bằng ${s}.`, ans: fstr(F(cnt, 36)), tex: ftex(F(cnt, 36)), sol: `Không gian mẫu: 6 × 6 = 36 kết quả. Có ${cnt} cặp (x; y) với x + y = ${s}. P = ${cnt}/36 = ${fstr(F(cnt, 36))}.`, method: 'Liệt kê các cặp thuận lợi; không gian mẫu hai xúc xắc có 36 phần tử.', wrongs: [[fstr(F(1, 11)), 'Các tổng 2..12 KHÔNG đồng khả năng — phải đếm theo cặp.']] }; }
    if (p.comb || p.rules || d >= 4) {
      const C = (n, k) => { let x = 1; for (let i = 0; i < k; i++) x = (x * (n - i)) / (i + 1); return x; };
      if (p.rules && d === 5) { const pa = pick([0.3, 0.4, 0.5, 0.6]), pb = pick([0.5, 0.7, 0.8]); return { q: `Hai xạ thủ bắn độc lập vào một mục tiêu, xác suất trúng lần lượt là ${vn(pa)} và ${vn(pb)}. Tính xác suất có ít nhất một người bắn trúng.`, ans: round(1 - (1 - pa) * (1 - pb), 4), sol: `P(cả hai trượt) = (1 − ${vn(pa)})(1 − ${vn(pb)}) = ${vn(round((1 - pa) * (1 - pb), 4))}. P(ít nhất một trúng) = 1 − ${vn(round((1 - pa) * (1 - pb), 4))} = ${vn(round(1 - (1 - pa) * (1 - pb), 4))}.`, method: '"Ít nhất một" → dùng biến cố đối: P = 1 − P(không ai). Biến cố độc lập: P(A∩B) = P(A)·P(B).', wrongs: [[round(pa + pb, 2), 'Không được cộng trực tiếp vì hai biến cố không xung khắc.'], [round(pa * pb, 4), 'Đó là xác suất cả hai cùng trúng.']] }; }
      const k = 2; const fav = C(r, k), all = C(tot, k);
      return { q: `Một hộp có ${r} bi đỏ, ${b + g} bi xanh. Lấy ngẫu nhiên 2 viên. Tính xác suất lấy được 2 bi đỏ.`, ans: fstr(F(fav, all)), tex: ftex(F(fav, all)), sol: `n(Ω) = C(${tot}, 2) = ${all}. n(A) = C(${r}, 2) = ${fav}. P = ${fav}/${all} = ${fstr(F(fav, all))}.`, method: 'Chọn không thứ tự → dùng tổ hợp C(n, k). P = n(A)/n(Ω).', wrongs: [[fstr(F(r * r, tot * tot)), 'Lấy 2 viên cùng lúc (không hoàn lại), không phải lấy có hoàn lại.']] };
    }
    return GENERATORS.prob({}, 2);
  },

  sqrt(p, d) {
    const a = R(2, 20);
    if (d <= 2) return { q: `Tính: $\\sqrt{${a * a}}$`, ans: a, sol: `Vì ${a}² = ${a * a} và ${a} ≥ 0 nên √${a * a} = ${a}.`, method: 'Căn bậc hai số học của a là số không âm x sao cho x² = a.', wrongs: [[-a, 'Căn bậc hai số học luôn không âm.'], [a * a / 2, 'Lấy căn không phải chia 2.']] };
    if (d === 3) { const b = R(2, 9), c = R(2, 9); return { q: `Tính: $\\sqrt{${b * b}} \\cdot \\sqrt{${c * c}} - |${-b * c + 3}|$`, ans: b * c - Math.abs(-b * c + 3), sol: `√${b * b} = ${b}, √${c * c} = ${c}; |${-b * c + 3}| = ${Math.abs(-b * c + 3)}. Kết quả: ${b * c} − ${Math.abs(-b * c + 3)} = ${b * c - Math.abs(-b * c + 3)}.`, method: 'Tính từng căn và giá trị tuyệt đối trước (|x| ≥ 0), rồi thực hiện phép tính.', wrongs: [[b * c + (-b * c + 3), 'Giá trị tuyệt đối luôn không âm.']] }; }
    if (p.basic) { const x = R(2, 15); return { q: `Tìm $x \\ge 0$, biết $\\sqrt{x} = ${x}$.`, ans: x * x, sol: `√x = ${x} ⇒ x = ${x}² = ${x * x}.`, method: 'Bình phương hai vế (với x ≥ 0).', wrongs: [[2 * x, 'Bình phương là nhân với chính nó, không phải nhân 2.']] }; }
    const k = pick([2, 3, 5, 6, 7]), m = R(2, 5), n = R(2, 5);
    if (d === 4) return { q: `Rút gọn: $\\sqrt{${m * m * k}} + \\sqrt{${n * n * k}}$ (kết quả dạng $a\\sqrt{${k}}$, ghi số $a$)`, ans: m + n, tex: `${m + n}\\sqrt{${k}}`, sol: `√${m * m * k} = ${m}√${k}; √${n * n * k} = ${n}√${k}. Tổng = ${m + n}√${k}.`, method: 'Đưa thừa số ra ngoài dấu căn: √(a²b) = |a|√b, rồi cộng các căn đồng dạng.', wrongs: [[Math.round(Math.sqrt(m * m * k + n * n * k)), 'Không được cộng các số trong căn: √a + √b ≠ √(a + b).']] };
    const r = R(2, 6);
    return { q: `Trục căn thức ở mẫu và rút gọn: $\\dfrac{${r * (k - 1) > 0 ? k - 1 : 1}}{\\sqrt{${k}} + 1}$ (kết quả có dạng $\\sqrt{${k}} - 1$ nhân với số nào? ghi số đó)`, ans: 1, tex: `\\sqrt{${k}} - 1`, sol: `Nhân tử và mẫu với √${k} − 1: mẫu = ${k} − 1 = ${k - 1}. Kết quả: ${k - 1}(√${k} − 1)/${k - 1} = √${k} − 1.`, method: 'Nhân cả tử và mẫu với biểu thức liên hợp: (√a + b)(√a − b) = a − b².', wrongs: [[k - 1, 'Em chưa chia cho mẫu sau khi trục căn.']] };
  },

  proportion(p, d) {
    const a = R(2, 12), b = R(2, 12), k = R(2, 6), c = a * k;
    if (d <= 2) return { q: `Tìm $x$, biết: $\\dfrac{x}{${b}} = \\dfrac{${c}}{${a}}$`, ans: (b * c) / a, sol: `Tính chất tỉ lệ thức: x · ${a} = ${b} · ${c} ⇒ x = ${b * c} : ${a} = ${(b * c) / a}.`, method: 'Trong tỉ lệ thức a/b = c/d: a·d = b·c (tích ngoại tỉ = tích trung tỉ).', wrongs: [[(a * c) / b, 'Em nhân chéo nhầm vị trí.']] };
    if (d === 3) { const w = R(3, 8), m = R(2, 6), price = R(5, 20) * 1000; return { q: `Mua ${w} quyển vở hết ${vn(w * price)} đồng. Hỏi mua ${w + m} quyển vở cùng loại hết bao nhiêu tiền?`, ans: (w + m) * price, tex: `${vn((w + m) * price)}\\text{ đồng}`, sol: `Số tiền tỉ lệ thuận với số vở. Giá 1 quyển: ${vn(w * price)} : ${w} = ${vn(price)}. Số tiền: ${w + m} × ${vn(price)} = ${vn((w + m) * price)} đồng.`, method: 'Hai đại lượng tỉ lệ thuận: tỉ số giữa chúng không đổi.', wrongs: [[m * price, 'Em chỉ tính phần vở mua thêm.']] }; }
    if (d === 4) { const wk = R(3, 10), days = R(4, 12), more = R(1, 5); const ans = round((wk * days) / (wk + more), 2); return { q: `${wk} công nhân làm xong một công việc trong ${days} ngày. Nếu có ${wk + more} công nhân (năng suất như nhau) thì làm xong trong bao nhiêu ngày?`, ans, tex: `${vn(ans)}\\text{ ngày}`, sol: `Số công nhân và số ngày tỉ lệ nghịch: ${wk} × ${days} = ${wk + more} × x ⇒ x = ${wk * days} : ${wk + more} = ${vn(ans)} (ngày).`, method: 'Hai đại lượng tỉ lệ nghịch: tích của chúng không đổi.', wrongs: [[round((days * (wk + more)) / wk, 2), 'Nhiều người hơn thì làm nhanh hơn — đây là tỉ lệ nghịch, không phải tỉ lệ thuận.']] }; }
    const s = R(3, 10) * (2 + 3 + 5);
    return { q: `Ba lớp quyên góp được ${s} quyển sách, số sách tỉ lệ với 2; 3; 5. Tính số sách của lớp nhiều nhất.`, ans: (s / 10) * 5, sol: `Gọi số sách là x, y, z: x/2 = y/3 = z/5 = (x + y + z)/(2 + 3 + 5) = ${s}/10 = ${s / 10}. Lớp nhiều nhất: z = 5 × ${s / 10} = ${(s / 10) * 5}.`, method: 'Tính chất dãy tỉ số bằng nhau: a/x = b/y = c/z = (a + b + c)/(x + y + z).', wrongs: [[s / 3, 'Không chia đều cho 3 lớp — phải chia theo tỉ lệ.']] };
  },

  poly_eval(p, d) {
    const co = [R(-9, 9), R(-6, 6), R(-4, 4) || 1];
    const x = R(-3, 3);
    if (d <= 2) return { q: `Tính giá trị của đa thức $P(x) = ${polyTex(co)}$ tại $x = ${x}$.`, ans: pval(co, x), sol: `Thay x = ${x}: P(${x}) = ${co[2]}·(${x})² + (${co[1]})·(${x}) + (${co[0]}) = ${pval(co, x)}.`, method: 'Thay giá trị của biến vào biểu thức, chú ý dấu khi biến âm (dùng ngoặc).', wrongs: [[pval(co, -x), 'Em đã thay sai dấu của x.']] };
    if (d === 3) { const co2 = [R(-9, 9), R(-6, 6), R(-4, 4) || 2]; const s = co.map((c, i) => c + co2[i]); return { q: `Cho $P(x) = ${polyTex(co)}$ và $Q(x) = ${polyTex(co2)}$. Tìm hệ số của $x^2$ trong $P(x) + Q(x)$.`, ans: s[2], sol: `Cộng các hạng tử đồng dạng: hệ số x² là ${co[2]} + (${co2[2]}) = ${s[2]}.`, method: 'Cộng đa thức: cộng các hạng tử đồng dạng (cùng lũy thừa của biến).', wrongs: [[co[2] - co2[2], 'Đây là phép cộng.']] }; }
    if (p.multi && d === 4) { const a = R(2, 5), b = R(2, 5); return { q: `Thu gọn đa thức $A = ${a}x^2y - 3xy^2 + ${b}x^2y + 5xy^2$ rồi tính giá trị tại $x = 1, y = -1$.`, ans: (a + b) * 1 * -1 + 2 * 1 * 1, sol: `A = ${a + b}x²y + 2xy². Tại x = 1, y = −1: ${a + b}·1·(−1) + 2·1·1 = ${-(a + b) + 2}.`, method: 'Thu gọn bằng cách nhóm đơn thức đồng dạng trước khi thay số.', wrongs: [[(a + b) + 2, 'Chú ý dấu của y = −1.']] }; }
    const r1 = R(-5, 5), k = R(1, 9);
    return { q: `Tìm $m$ để đa thức $P(x) = x^2 ${sgn(k)}x + m$ có nghiệm $x = ${r1}$.`, ans: -(r1 * r1 + k * r1), sol: `x = ${r1} là nghiệm ⇔ P(${r1}) = 0 ⇔ ${r1 * r1} + ${k * r1} + m = 0 ⇔ m = ${-(r1 * r1 + k * r1)}.`, method: 'a là nghiệm của P(x) ⇔ P(a) = 0. Thay x = a và giải phương trình ẩn m.', wrongs: [[r1 * r1 + k * r1, 'Em quên chuyển vế đổi dấu.']] };
  },

  identities(p, d) {
    const a = R(1, 9), b = R(2, 9);
    if (d <= 2) return { q: `Khai triển $(x + ${a})^2$. Hệ số của $x$ là bao nhiêu?`, ans: 2 * a, tex: `x^2 + ${2 * a}x + ${a * a}`, sol: `(x + ${a})² = x² + 2·x·${a} + ${a}² = x² + ${2 * a}x + ${a * a}.`, method: '(A + B)² = A² + 2AB + B².', wrongs: [[a, 'Em quên hệ số 2 trong 2AB.']] };
    if (d === 3) { const n = R(11, 99); const m = Math.round(n / 10) * 10; const e = n - m; return { q: `Tính nhanh: $${n}^2$`, ans: n * n, sol: `${n}² = (${m} ${sgn(e)})² = ${m * m} ${e >= 0 ? '+' : '−'} ${Math.abs(2 * m * e)} + ${e * e} = ${n * n}.`, method: 'Viết số thành tổng/hiệu với số tròn chục rồi dùng hằng đẳng thức (A ± B)².', wrongs: [[m * m + e * e, 'Em quên hạng tử 2AB.']] }; }
    if (d === 4) return { q: `Tính nhanh: $${100 + a}\\cdot ${100 - a}$`, ans: 10000 - a * a, sol: `(100 + ${a})(100 − ${a}) = 100² − ${a}² = 10000 − ${a * a} = ${10000 - a * a}.`, method: '(A + B)(A − B) = A² − B².', wrongs: [[10000 + a * a, 'Hiệu hai bình phương: A² − B².']] };
    const s = a + b, pr = a * b;
    return { q: `Cho $x + y = ${s}$ và $xy = ${pr}$. Tính $x^2 + y^2$${d === 5 ? ' và $x^3 + y^3$ (viết: kết quả 1; kết quả 2)' : ''}.`, ans: `${s * s - 2 * pr}; ${s ** 3 - 3 * pr * s}`, sol: `x² + y² = (x + y)² − 2xy = ${s * s} − ${2 * pr} = ${s * s - 2 * pr}.\nx³ + y³ = (x + y)³ − 3xy(x + y) = ${s ** 3} − ${3 * pr * s} = ${s ** 3 - 3 * pr * s}.`, method: 'Biến đổi về tổng và tích: x² + y² = (x + y)² − 2xy; x³ + y³ = (x + y)³ − 3xy(x + y).', wrongs: [] };
  },

  factor(p, d) {
    const a = R(1, 9), b = R(1, 9);
    if (d <= 2) { const k = R(2, 9); return { q: `Phân tích thành nhân tử: $${k}x^2 + ${k * a}x$. Nhân tử còn lại sau khi đặt $${k}x$ ra ngoài là gì?`, ans: `x+${a}`, tex: `${k}x(x + ${a})`, sol: `${k}x² + ${k * a}x = ${k}x(x + ${a}).`, method: 'Đặt nhân tử chung: tìm ƯCLN của các hệ số và lũy thừa chung nhỏ nhất của biến.', wrongs: [[`x+${k * a}`, 'Em chưa chia hệ số cho nhân tử chung.']] }; }
    if (d === 3) return { q: `Phân tích thành nhân tử: $x^2 - ${a * a}$`, ans: `(x-${a})(x+${a})`, tex: `(x - ${a})(x + ${a})`, sol: `x² − ${a * a} = x² − ${a}² = (x − ${a})(x + ${a}).`, method: 'Dùng hằng đẳng thức A² − B² = (A − B)(A + B).', wrongs: [[`(x-${a})^2`, '(x − a)² = x² − 2ax + a², không phải x² − a².']] };
    const s = a + b, pr = a * b;
    if (d === 4) return { q: `Phân tích thành nhân tử: $x^2 + ${s}x + ${pr}$`, ans: `(x+${a})(x+${b})`, tex: `(x + ${a})(x + ${b})`, sol: `Tìm hai số có tổng ${s}, tích ${pr}: ${a} và ${b}. Vậy x² + ${s}x + ${pr} = (x + ${a})(x + ${b}).`, method: 'Tách hạng tử bậc nhất: x² + (a + b)x + ab = (x + a)(x + b).', wrongs: [] };
    return { q: `Tìm $x$, biết: $x^3 - ${a * a}x = 0$ (liệt kê các nghiệm)`, ans: `${-a}; 0; ${a}`, sol: `x(x² − ${a * a}) = 0 ⇔ x(x − ${a})(x + ${a}) = 0 ⇔ x ∈ {−${a}; 0; ${a}}.`, method: 'Đưa về dạng tích bằng 0: A·B·C = 0 ⇔ A = 0 hoặc B = 0 hoặc C = 0.', wrongs: [[`${-a}; ${a}`, 'Em đã chia hai vế cho x và làm mất nghiệm x = 0.']] };
  },

  quad_angles(p, d) {
    const A = R(60, 120), B = R(50, 130), C = R(50, 130);
    const D = 360 - A - B - C;
    if (D <= 20 || D >= 180) return GENERATORS.quad_angles(p, d);
    if (d <= 3) return { q: `Tứ giác ABCD có $\\hat A = ${A}^\\circ, \\hat B = ${B}^\\circ, \\hat C = ${C}^\\circ$. Tính $\\hat D$.`, ans: D, tex: `${D}^\\circ`, sol: `Tổng bốn góc của tứ giác bằng 360°: D̂ = 360° − ${A}° − ${B}° − ${C}° = ${D}°.`, method: 'Tổng các góc trong một tứ giác bằng 360°.', wrongs: [[180 - A - B - C + 360 - 360 > 0 ? 180 : D + 180, 'Tổng 4 góc tứ giác là 360°.']] };
    const x = R(30, 80);
    return { q: `Hình bình hành ABCD có $\\hat A - \\hat B = ${180 - 2 * x}^\\circ$. Tính $\\hat B$.`, ans: x, tex: `${x}^\\circ`, sol: `Trong hình bình hành, hai góc kề một cạnh bù nhau: Â + B̂ = 180°. Kết hợp Â − B̂ = ${180 - 2 * x}° ⇒ B̂ = (180° − ${180 - 2 * x}°) : 2 = ${x}°.`, method: 'Hình bình hành: các góc đối bằng nhau, hai góc kề một cạnh bù nhau.', wrongs: [[180 - x, 'Đó là góc A.']] };
  },

  thales(p, d) {
    const ab = R(4, 12) * 2, k = pick([[1, 2], [1, 3], [2, 3], [3, 4]]);
    const am = (ab * k[0]) / k[1], ac = R(3, 12) * k[1];
    const an = (ac * k[0]) / k[1];
    if (d <= 2) return { q: `Tam giác ABC có MN // BC (M ∈ AB, N ∈ AC). Biết AM = ${vn(am)} cm, AB = ${ab} cm, AC = ${ac} cm. Tính AN.`, ans: an, tex: `${vn(an)}\\text{ cm}`, sol: `Định lí Ta-lét: AM/AB = AN/AC ⇒ AN = AC · AM / AB = ${ac} · ${vn(am)} / ${ab} = ${vn(an)} cm.`, method: 'Định lí Ta-lét: đường thẳng song song với một cạnh tam giác định ra trên hai cạnh kia những đoạn thẳng tương ứng tỉ lệ.', wrongs: [[round((ab * ac) / am, 2), 'Em lập tỉ số bị ngược.']] };
    const bc = R(6, 20) * 2;
    return { q: `Cho tam giác ABC có BC = ${bc} cm. M, N lần lượt là trung điểm của AB, AC. Tính MN${d >= 4 ? ' và chu vi tứ giác BMNC biết AB = ' + (bc - 2) + ' cm, AC = ' + (bc + 2) + ' cm (viết: MN; chu vi)' : ''}.`, ans: d >= 4 ? `${bc / 2}; ${bc / 2 + bc + (bc - 2) / 2 + (bc + 2) / 2}` : bc / 2, sol: `MN là đường trung bình ⇒ MN = BC/2 = ${bc / 2} cm.${d >= 4 ? ` Chu vi BMNC = BM + MN + NC + CB = ${(bc - 2) / 2} + ${bc / 2} + ${(bc + 2) / 2} + ${bc} = ${bc / 2 + bc + (bc - 2) / 2 + (bc + 2) / 2} cm.` : ''}`, method: 'Đường trung bình của tam giác song song với cạnh thứ ba và bằng nửa cạnh ấy.', wrongs: [[bc * 2, 'Đường trung bình bằng NỬA cạnh đáy.']] };
  },

  rational_expr(p, d) {
    const a = R(1, 9), b = R(1, 9);
    if (d <= 2) return { q: `Rút gọn phân thức $\\dfrac{x^2 - ${a * a}}{x - ${a}}$ (với $x \\ne ${a}$).`, ans: `x+${a}`, tex: `x + ${a}`, sol: `x² − ${a * a} = (x − ${a})(x + ${a}). Chia tử và mẫu cho (x − ${a}): x + ${a}.`, method: 'Phân tích tử và mẫu thành nhân tử rồi chia cho nhân tử chung.', wrongs: [[`x-${a}`, 'Em phân tích sai hằng đẳng thức.']] };
    if (d <= 4) return { q: `Tìm điều kiện xác định của phân thức $\\dfrac{${b}x + 1}{x^2 - ${a * a}}$. Tập các giá trị $x$ bị loại là gì?`, ans: `${-a}; ${a}`, tex: `x \\ne \\pm ${a}`, sol: `Mẫu ≠ 0: x² − ${a * a} ≠ 0 ⇔ x ≠ ${a} và x ≠ −${a}.`, method: 'Phân thức xác định khi mẫu thức khác 0.', wrongs: [[`${a}`, 'Em bỏ sót nghiệm âm.']] };
    return { q: `Tính: $\\dfrac{1}{x - ${a}} - \\dfrac{1}{x + ${a}}$ rồi tính giá trị tại $x = ${a + 1}$ (ghi giá trị dạng phân số).`, ans: fstr(F(2 * a, (a + 1) ** 2 - a * a)), tex: `\\dfrac{${2 * a}}{x^2 - ${a * a}};\\ ${ftex(F(2 * a, (a + 1) ** 2 - a * a))}`, sol: `Quy đồng mẫu (x − ${a})(x + ${a}): [(x + ${a}) − (x − ${a})] / (x² − ${a * a}) = ${2 * a}/(x² − ${a * a}). Tại x = ${a + 1}: ${2 * a}/${(a + 1) ** 2 - a * a}.`, method: 'Quy đồng mẫu thức, trừ tử thức, rút gọn rồi mới thay số.', wrongs: [] };
  },

  linear_eq(p, d) {
    const x = R(-9, 9), a = pick([2, 3, 4, 5, -2, -3, 7]), b = R(-15, 15);
    const c = a * x + b;
    if (d <= 2) return { q: `Giải phương trình: $${a}x ${sgn(b)} = ${c}$`, ans: x, tex: `x = ${x}`, sol: `${a}x = ${c} ${b >= 0 ? '−' : '+'} ${Math.abs(b)} = ${c - b} ⇒ x = ${c - b} : ${a} = ${x}.`, method: 'Chuyển hạng tử tự do sang vế phải (đổi dấu), rồi chia cho hệ số của x.', wrongs: [[(c + b) / a, 'Chuyển vế phải đổi dấu.']] };
    const m = R(1, 5), n = R(-9, 9);
    if (d <= 4) { const L = (a - m), rhs = n - b; if (L === 0) return GENERATORS.linear_eq(p, d); const sol = F(rhs, L);
      return { q: `Giải phương trình: $${a}x ${sgn(b)} = ${m}x ${sgn(n)}$`, ans: fstr(sol), tex: `x = ${ftex(sol)}`, sol: `Chuyển vế: ${a}x − ${m}x = ${n} − (${b}) ⇒ ${L}x = ${rhs} ⇒ x = ${fstr(sol)}.`, method: 'Chuyển các hạng tử chứa x về một vế, số về vế kia; thu gọn rồi chia.', wrongs: [[fstr(F(n + b, a + m)), 'Em quên đổi dấu khi chuyển vế.']] }; }
    const age = R(8, 14), k = R(3, 4), yrs = R(2, 10);
    const dad = age * k;
    return { q: `Hiện nay tuổi bố gấp ${k} lần tuổi con. Sau ${yrs} năm nữa tổng số tuổi hai bố con là ${dad + age + 2 * yrs}. Tính tuổi con hiện nay.`, ans: age, sol: `Gọi tuổi con là x thì tuổi bố là ${k}x. Sau ${yrs} năm: (x + ${yrs}) + (${k}x + ${yrs}) = ${dad + age + 2 * yrs} ⇔ ${k + 1}x = ${(dad + age + 2 * yrs) - 2 * yrs} ⇔ x = ${age}.`, method: 'Giải bài toán bằng cách lập phương trình: chọn ẩn, biểu diễn các đại lượng theo ẩn, lập phương trình, giải và kiểm tra.', wrongs: [[Math.round((dad + age + 2 * yrs) / (k + 1)), 'Em quên trừ số năm cộng thêm cho mỗi người.']] };
  },

  linear_fn(p, d) {
    const a = pick([-3, -2, -1, 1, 2, 3, 4]), b = R(-6, 6), x0 = R(-4, 4);
    if (d <= 2) return { q: `Cho hàm số $y = ${a}x ${sgn(b)}$. Tính $y$ khi $x = ${x0}$.`, ans: a * x0 + b, sol: `y = ${a}·(${x0}) + (${b}) = ${a * x0 + b}.`, method: 'Thay giá trị x vào công thức hàm số.', wrongs: [[a * x0 - b, 'Em sai dấu hạng tử tự do.']] };
    if (d === 3) return { q: `Tìm $a$ biết đồ thị hàm số $y = ax ${sgn(b)}$ đi qua điểm $M(${x0 || 1}; ${a * (x0 || 1) + b})$.`, ans: a, sol: `Thay tọa độ M: ${a * (x0 || 1) + b} = a·${x0 || 1} + (${b}) ⇒ a = ${a}.`, method: 'Điểm thuộc đồ thị ⇔ tọa độ thỏa mãn công thức hàm số.', wrongs: [[-a, 'Em sai dấu khi chuyển vế.']] };
    if (d === 4) { const x1 = R(-3, 0), x2 = x1 + R(1, 4); return { q: `Viết phương trình đường thẳng đi qua hai điểm $A(${x1}; ${a * x1 + b})$ và $B(${x2}; ${a * x2 + b})$. Hệ số góc là bao nhiêu?`, ans: a, tex: `y = ${a}x ${sgn(b)}`, sol: `a = (y_B − y_A)/(x_B − x_A) = ${a * (x2 - x1)}/${x2 - x1} = ${a}. b = y_A − a·x_A = ${b}. Vậy y = ${a}x ${sgn(b)}.`, method: 'Hệ số góc a = Δy/Δx; tìm b bằng cách thay một điểm.', wrongs: [[fstr(F(x2 - x1, a * (x2 - x1))), 'Hệ số góc = Δy/Δx, không phải Δx/Δy.']] }; }
    const a2 = a + R(1, 3);
    const xi = F(b - (b + a2 - a), a2 - a);
    return { q: `Tìm hoành độ giao điểm của hai đường thẳng $y = ${a}x ${sgn(b)}$ và $y = ${a2}x ${sgn(b + a2 - a)}$.`, ans: fstr(F(-(a2 - a), a2 - a)), sol: `Hoành độ giao điểm là nghiệm của ${a}x ${sgn(b)} = ${a2}x ${sgn(b + a2 - a)} ⇔ ${a - a2}x = ${a2 - a} ⇔ x = −1.`, method: 'Giao điểm hai đường thẳng: giải phương trình hoành độ (cho hai biểu thức y bằng nhau).', wrongs: [[1, 'Em sai dấu khi chuyển vế.']], _x: xi };
  },

  pythagoras(p, d) {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]]);
    if (d <= 2) return { q: `Tam giác ABC vuông tại A có AB = ${a} cm, AC = ${b} cm. Tính BC.`, ans: c, tex: `${c}\\text{ cm}`, sol: `Pythagore: BC² = AB² + AC² = ${a * a} + ${b * b} = ${c * c} ⇒ BC = ${c} cm.`, method: 'Định lí Pythagore: trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.', wrongs: [[a + b, 'Không cộng trực tiếp độ dài — phải cộng bình phương rồi lấy căn.']] };
    if (d <= 4) return { q: `Tam giác ABC vuông tại A có BC = ${c} cm, AB = ${a} cm. Tính AC${d === 4 ? ' và diện tích tam giác (viết: AC; diện tích)' : ''}.`, ans: d === 4 ? `${b}; ${(a * b) / 2}` : b, tex: d === 4 ? `${b}\\text{ cm};\\ ${vn((a * b) / 2)}\\text{ cm}^2` : `${b}\\text{ cm}`, sol: `AC² = BC² − AB² = ${c * c} − ${a * a} = ${b * b} ⇒ AC = ${b} cm.${d === 4 ? ` S = AB·AC/2 = ${vn((a * b) / 2)} cm².` : ''}`, method: 'Tính cạnh góc vuông: lấy bình phương cạnh huyền trừ bình phương cạnh góc vuông kia.', wrongs: [[Math.round(Math.sqrt(c * c + a * a)), 'Cạnh huyền là cạnh lớn nhất; để tìm cạnh góc vuông phải TRỪ.']] };
    return { q: `Một chiếc thang dài ${c} m dựa vào tường, chân thang cách tường ${a} m. Hỏi đầu thang chạm tường ở độ cao bao nhiêu mét? Nếu kéo chân thang ra xa thêm ${b - a > 0 ? 1 : 1} m thì đầu thang tụt xuống còn bao nhiêu? (làm tròn 2 chữ số thập phân; viết: độ cao 1; độ cao 2)`, ans: `${b}; ${round(Math.sqrt(c * c - (a + 1) ** 2), 2)}`, sol: `Độ cao = √(${c}² − ${a}²) = ${b} m. Khi chân thang cách tường ${a + 1} m: √(${c * c} − ${(a + 1) ** 2}) ≈ ${vn(round(Math.sqrt(c * c - (a + 1) ** 2), 2))} m.`, method: 'Mô hình hóa thang – tường – mặt đất thành tam giác vuông, dùng định lí Pythagore.', wrongs: [] };
  },

  pyramid(p, d) {
    const a = R(3, 12), h = R(3, 15);
    if (p.g11) {
      if (p.perp) { const [x, y, z] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); return { q: `Hình chóp S.ABCD có đáy là hình vuông cạnh ${x} cm, SA ⊥ (ABCD) và SA = ${y} cm. Tính độ dài SB.`, ans: z, tex: `${z}\\text{ cm}`, sol: `SA ⊥ (ABCD) ⇒ SA ⊥ AB ⇒ tam giác SAB vuông tại A. SB = √(SA² + AB²) = √(${y * y} + ${x * x}) = ${z} cm.`, method: 'Đường thẳng vuông góc với mặt phẳng thì vuông góc với mọi đường thẳng nằm trong mặt phẳng đó.', wrongs: [[x + y, 'Phải dùng Pythagore.']] }; }
      return { q: `Hình chóp S.ABCD có đáy là hình bình hành. Gọi M, N lần lượt là trung điểm SA, SB. Biết CD = ${2 * a} cm. Tính MN.`, ans: a, tex: `${a}\\text{ cm}`, sol: `MN là đường trung bình tam giác SAB ⇒ MN = AB/2. ABCD là hình bình hành ⇒ AB = CD = ${2 * a} ⇒ MN = ${a} cm (và MN // CD).`, method: 'Dùng đường trung bình và tính chất hình bình hành để chuyển độ dài; quan hệ song song bắc cầu.', wrongs: [[2 * a, 'MN chỉ bằng nửa AB.']] };
    }
    if (d <= 3) return { q: `Hình chóp tứ giác đều có cạnh đáy ${a} cm, chiều cao ${h} cm. Tính thể tích.`, ans: round((a * a * h) / 3, 2), tex: `${vn(round((a * a * h) / 3, 2))}\\text{ cm}^3`, sol: `V = (1/3)·S_đáy·h = (1/3)·${a}²·${h} = ${vn(round((a * a * h) / 3, 2))} cm³.`, method: 'Thể tích hình chóp = 1/3 × diện tích đáy × chiều cao.', wrongs: [[a * a * h, 'Em quên nhân 1/3.']] };
    const dd = R(4, 15);
    return { q: `Hình chóp tứ giác đều có cạnh đáy ${a} cm, trung đoạn ${dd} cm. Tính diện tích xung quanh.`, ans: 2 * a * dd, tex: `${2 * a * dd}\\text{ cm}^2`, sol: `S_xq = p·d = (nửa chu vi đáy)·trung đoạn = ${2 * a}·${dd} = ${2 * a * dd} cm².`, method: 'Diện tích xung quanh hình chóp đều = nửa chu vi đáy × trung đoạn.', wrongs: [[4 * a * dd, 'Dùng NỬA chu vi đáy.']] };
  },

  system2(p, d) {
    const x = R(-6, 6), y = R(-6, 6);
    const a1 = R(1, 4), b1 = pick([-3, -2, -1, 1, 2, 3]), a2 = pick([-2, -1, 1, 2, 3]), b2 = R(1, 4);
    if (a1 * b2 - a2 * b1 === 0) return GENERATORS.system2(p, d);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    const t = (a, b) => `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
    if (d <= 4) return { q: `Giải hệ phương trình: $\\begin{cases} ${t(a1, b1)} = ${c1} \\\\ ${t(a2, b2)} = ${c2} \\end{cases}$ (viết: x; y)`, ans: `${x}; ${y}`, tex: `(x; y) = (${x}; ${y})`, sol: `Dùng phương pháp cộng đại số hoặc thế. Nghiệm: x = ${x}, y = ${y}. Kiểm tra: ${a1}·${x} + (${b1})·${y} = ${c1} ✓; ${a2}·${x} + ${b2}·${y} = ${c2} ✓.`, method: 'Phương pháp thế: rút một ẩn từ một phương trình rồi thế vào phương trình kia. Phương pháp cộng: nhân để hệ số một ẩn đối nhau rồi cộng hai phương trình.', wrongs: [[`${y}; ${x}`, 'Em đổi chỗ x và y.']] };
    const p1 = R(3, 9) * 1000, p2 = R(2, 8) * 1000, n1 = R(2, 8), n2 = R(2, 8);
    return { q: `Mua ${n1} quyển vở và ${n2} cây bút hết ${vn(n1 * p1 + n2 * p2)} đồng. Mua ${n2} quyển vở và ${n1} cây bút hết ${vn(n2 * p1 + n1 * p2)} đồng. Tính giá một quyển vở và một cây bút (viết: giá vở; giá bút).`, ans: `${p1}; ${p2}`, sol: `Gọi giá vở x, giá bút y: ${n1}x + ${n2}y = ${n1 * p1 + n2 * p2}; ${n2}x + ${n1}y = ${n2 * p1 + n1 * p2}. Giải hệ: x = ${p1}, y = ${p2}.`, method: 'Lập hệ hai phương trình bậc nhất hai ẩn từ hai dữ kiện, giải và đối chiếu điều kiện.', wrongs: [] };
  },

  linear_ineq(p, d) {
    const a = pick([2, 3, 4, 5, -2, -3]), b = R(-10, 10), c = R(-10, 20);
    const bound = F(c - b, a);
    const sign = a > 0 ? '>' : '<';
    if (d <= 3) return { q: `Giải bất phương trình: $${a}x ${sgn(b)} > ${c}$. Nghiệm có dạng $x ${a > 0 ? '>' : '<'} \\ldots$; ghi giá trị biên.`, ans: fstr(bound), tex: `x ${sign} ${ftex(bound)}`, sol: `${a}x > ${c - b} ⇒ x ${sign} ${fstr(bound)}${a < 0 ? ' (chia cho số âm nên đổi chiều bất đẳng thức)' : ''}.`, method: 'Chuyển vế như phương trình; khi nhân/chia hai vế với số âm phải ĐỔI CHIỀU bất đẳng thức.', wrongs: [[fstr(F(c + b, a)), 'Chuyển vế phải đổi dấu.']] };
    const n = R(5, 15);
    return { q: `Tìm số nguyên $x$ lớn nhất thỏa mãn $${Math.abs(a)}x ${sgn(b)} < ${c + 3 * Math.abs(a)}$.`, ans: Math.ceil((c + 3 * Math.abs(a) - b) / Math.abs(a)) - 1, sol: `${Math.abs(a)}x < ${c + 3 * Math.abs(a) - b} ⇒ x < ${vn(round((c + 3 * Math.abs(a) - b) / Math.abs(a), 3))}. Số nguyên lớn nhất: ${Math.ceil((c + 3 * Math.abs(a) - b) / Math.abs(a)) - 1}.`, method: 'Giải bất phương trình rồi chọn số nguyên thỏa mãn (chú ý bất đẳng thức chặt).', wrongs: [[Math.ceil((c + 3 * Math.abs(a) - b) / Math.abs(a)), 'Bất đẳng thức chặt: x phải NHỎ HƠN biên.']], _n: n };
  },

  trig_right(p, d) {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
    if (d <= 2) return { q: `Tam giác ABC vuông tại A có AB = ${a}, AC = ${b}, BC = ${c}. Tính $\\sin B$ (phân số).`, ans: fstr(F(b, c)), tex: ftex(F(b, c)), sol: `sin B = cạnh đối / cạnh huyền = AC/BC = ${b}/${c}.`, method: 'sin = đối/huyền, cos = kề/huyền, tan = đối/kề, cot = kề/đối.', wrongs: [[fstr(F(a, c)), 'Đó là cos B (cạnh kề).'], [fstr(F(b, a)), 'Đó là tan B.']] };
    if (d === 3) return { q: `Tam giác ABC vuông tại A, đường cao AH. Biết BH = ${a * a} và CH = ${b * b}. Tính AH.`, ans: a * b, sol: `Hệ thức: AH² = BH·CH = ${a * a}·${b * b} ⇒ AH = ${a * b}.`, method: 'Hệ thức lượng: h² = b\'·c\' (bình phương đường cao bằng tích hai hình chiếu).', wrongs: [[a * a + b * b, 'h² = b\'c\' là TÍCH, không phải tổng.']] };
    const h = R(10, 40), ang = pick([30, 45, 60]);
    const val = { 30: Math.sqrt(3) / 3, 45: 1, 60: Math.sqrt(3) }[ang];
    return { q: `Từ điểm cách chân tòa nhà ${h} m, nhìn lên đỉnh tòa nhà với góc nâng $${ang}^\\circ$. Tính chiều cao tòa nhà (làm tròn đến 0,1 m).`, ans: round(h * val, 1), tex: `${vn(round(h * val, 1))}\\text{ m}`, sol: `Chiều cao = ${h}·tan ${ang}° ≈ ${vn(round(h * val, 1))} m.`, method: 'Góc nâng: chiều cao = khoảng cách × tan(góc nâng).', wrongs: [[round(h * Math.sin((ang * Math.PI) / 180), 1), 'Phải dùng tan (đối/kề), không phải sin.']] };
  },

  quadratic(p, d) {
    const x1 = R(-6, 6), x2 = R(-6, 6);
    const b = -(x1 + x2), c = x1 * x2;
    const eq = `x^2 ${b ? sgn(b) + 'x' : ''} ${c ? sgn(c) : ''} = 0`;
    if (d === 1) { const a = pick([1, 2, -1, 3]), x = R(-4, 4); return { q: `Cho hàm số $y = ${a}x^2$. Tính $y$ khi $x = ${x}$.`, ans: a * x * x, sol: `y = ${a}·(${x})² = ${a * x * x}.`, method: 'Thay x vào y = ax²; chú ý (−x)² = x².', wrongs: [[-a * x * x, 'Bình phương của số âm là số dương.']] }; }
    if (d <= 3) return { q: `Giải phương trình: $${eq}$ (liệt kê nghiệm)`, ans: x1 === x2 ? `${x1}` : `${Math.min(x1, x2)}; ${Math.max(x1, x2)}`, sol: `Δ = ${b * b - 4 * c}. ${x1 === x2 ? `Phương trình có nghiệm kép x = ${x1}.` : `x₁ = ${Math.min(x1, x2)}, x₂ = ${Math.max(x1, x2)}.`} (Có thể nhẩm: tổng hai nghiệm = ${-b}, tích = ${c}.)`, method: 'Tính Δ = b² − 4ac; Δ > 0: hai nghiệm x = (−b ± √Δ)/(2a). Hoặc nhẩm nghiệm theo Viète.', wrongs: [[`${-Math.max(x1, x2)}; ${-Math.min(x1, x2)}`, 'Em sai dấu nghiệm (−b, không phải b).']] };
    if (d === 4) { const s = x1 + x2, pr = x1 * x2; return { q: `Gọi $x_1, x_2$ là nghiệm của phương trình $${eq}$. Không giải phương trình, tính $x_1^2 + x_2^2$.`, ans: s * s - 2 * pr, sol: `Viète: x₁ + x₂ = ${s}, x₁x₂ = ${pr}. x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ${s * s} − ${2 * pr} = ${s * s - 2 * pr}.`, method: 'Định lí Viète: x₁ + x₂ = −b/a; x₁x₂ = c/a. Biến đổi biểu thức đối xứng về tổng và tích.', wrongs: [[s * s, 'Em quên trừ 2x₁x₂.']] }; }
    const k = R(1, 6);
    return { q: `Tìm $m$ để phương trình $x^2 - ${2 * k}x + m = 0$ có nghiệm kép. Tìm nghiệm kép đó. (viết: m; nghiệm)`, ans: `${k * k}; ${k}`, sol: `Nghiệm kép ⇔ Δ' = ${k}² − m = 0 ⇔ m = ${k * k}. Nghiệm kép x = ${k}.`, method: 'Phương trình bậc hai có nghiệm kép ⇔ Δ = 0 (hoặc Δ\' = 0).', wrongs: [[`${4 * k * k}; ${k}`, 'Em dùng Δ thay vì Δ\' nhưng quên chia 4.']] };
  },

  cyclic_quad(p, d) {
    const A = R(50, 130);
    if (d <= 3) return { q: `Tứ giác ABCD nội tiếp đường tròn, $\\hat A = ${A}^\\circ$. Tính $\\hat C$.`, ans: 180 - A, tex: `${180 - A}^\\circ`, sol: `Tứ giác nội tiếp có tổng hai góc đối bằng 180° ⇒ Ĉ = 180° − ${A}° = ${180 - A}°.`, method: 'Tứ giác nội tiếp ⇔ tổng hai góc đối bằng 180°.', wrongs: [[A, 'Hai góc đối của tứ giác nội tiếp BÙ nhau, không bằng nhau.']] };
    const arc = R(40, 160);
    return { q: `Góc nội tiếp chắn cung có số đo $${arc}^\\circ$ thì có số đo bao nhiêu độ? Góc ở tâm chắn cung đó bao nhiêu độ? (viết: góc nội tiếp; góc ở tâm)`, ans: `${arc / 2}; ${arc}`, sol: `Góc nội tiếp = nửa số đo cung bị chắn = ${arc / 2}°. Góc ở tâm = số đo cung = ${arc}°.`, method: 'Số đo góc nội tiếp bằng nửa số đo cung bị chắn; góc ở tâm bằng số đo cung bị chắn.', wrongs: [[`${arc}; ${arc / 2}`, 'Em đảo ngược hai loại góc.']] };
  },

  solids(p, d) {
    const r = R(2, 10), h = R(3, 15);
    if (d <= 2) return { q: `Tính thể tích hình trụ có bán kính đáy ${r} cm, chiều cao ${h} cm (kết quả theo $\\pi$, ghi hệ số).`, ans: r * r * h, tex: `${r * r * h}\\pi\\text{ cm}^3`, sol: `V = πr²h = π·${r * r}·${h} = ${r * r * h}π cm³.`, method: 'Hình trụ: V = πr²h; S_xq = 2πrh.', wrongs: [[2 * r * h, 'Đó là hệ số của diện tích xung quanh.']] };
    if (d <= 4) return { q: `Tính thể tích hình nón có bán kính đáy ${r} cm, chiều cao ${3 * h} cm (theo $\\pi$, ghi hệ số).`, ans: r * r * h, tex: `${r * r * h}\\pi\\text{ cm}^3`, sol: `V = (1/3)πr²h = (1/3)π·${r * r}·${3 * h} = ${r * r * h}π cm³.`, method: 'Hình nón: V = (1/3)πr²h; S_xq = πrl.', wrongs: [[3 * r * r * h, 'Em quên nhân 1/3.']] };
    return { q: `Một quả bóng hình cầu có bán kính ${3 * r} cm. Tính thể tích (theo $\\pi$, ghi hệ số).`, ans: 36 * r ** 3, tex: `${36 * r ** 3}\\pi\\text{ cm}^3`, sol: `V = (4/3)πR³ = (4/3)π·${27 * r ** 3} = ${36 * r ** 3}π cm³.`, method: 'Hình cầu: V = (4/3)πR³; S = 4πR².', wrongs: [[4 * 9 * r * r, 'Đó là diện tích mặt cầu.']] };
  },

  sets(p, d) {
    const nA = R(10, 30), nB = R(10, 30), both = R(2, Math.min(nA, nB) - 1);
    if (d <= 2) { const a = R(1, 5), b = a + R(3, 6); const A = []; for (let i = a; i <= b; i++) A.push(i); return { q: `Cho $A = \\{x \\in \\mathbb{Z} \\mid ${a - 1} < x \\le ${b}\\}$. Tập A có bao nhiêu tập con?`, ans: 2 ** A.length, sol: `A = {${A.join('; ')}} có ${A.length} phần tử ⇒ số tập con = 2^${A.length} = ${2 ** A.length}.`, method: 'Tập có n phần tử có 2ⁿ tập con.', wrongs: [[2 ** A.length - 1, 'Đừng quên tập rỗng (và chính A) cũng là tập con.']] }; }
    return { q: `Lớp 10A có ${nA} bạn thích Toán, ${nB} bạn thích Văn, ${both} bạn thích cả hai. ${d >= 4 ? `Lớp có ${nA + nB - both + 3} học sinh. Hỏi có bao nhiêu bạn không thích môn nào trong hai môn?` : 'Có bao nhiêu bạn thích ít nhất một trong hai môn?'}`, ans: d >= 4 ? 3 : nA + nB - both, sol: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${nA} + ${nB} − ${both} = ${nA + nB - both}.${d >= 4 ? ` Không thích môn nào: ${nA + nB - both + 3} − ${nA + nB - both} = 3.` : ''}`, method: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B) (trừ phần bị đếm hai lần). Dùng biểu đồ Ven.', wrongs: [[d >= 4 ? 3 + both : nA + nB, 'Các bạn thích cả hai môn bị đếm hai lần.']] };
  },

  linear_ineq2(p, d) {
    const a = R(1, 4), b = R(1, 4), c = R(4, 12);
    const pts = [[0, 0], [c, 0], [0, c], [1, 1], [2, 3]];
    const pt = pick(pts.slice(1));
    const ok = a * pt[0] + b * pt[1] <= c;
    if (d <= 3) return { q: `Điểm $M(${pt[0]}; ${pt[1]})$ có thuộc miền nghiệm của bất phương trình $${a}x + ${b}y \\le ${c}$ không? (trả lời: có / không)`, ans: ok ? 'có' : 'không', sol: `Thay M: ${a}·${pt[0]} + ${b}·${pt[1]} = ${a * pt[0] + b * pt[1]} ${ok ? '≤' : '>'} ${c} ⇒ ${ok ? 'có' : 'không'} thuộc.`, method: 'Điểm thuộc miền nghiệm ⇔ tọa độ thỏa mãn bất phương trình.', wrongs: [[ok ? 'không' : 'có', 'Thay tọa độ và so sánh lại.']] };
    // tìm GTLN của F = x + y trên miền {x≥0, y≥0, ax + by ≤ c}
    const cands = [[0, 0], [c / a, 0], [0, c / b]];
    const vals = cands.map(([x, y]) => round(2 * x + 3 * y, 4));
    const M = Math.max(...vals);
    return { q: `Tìm giá trị lớn nhất của $F = 2x + 3y$ trên miền $\\{x \\ge 0,\\ y \\ge 0,\\ ${a}x + ${b}y \\le ${c}\\}$.`, ans: M, sol: `Miền nghiệm là tam giác với các đỉnh (0;0), (${vn(round(c / a, 3))};0), (0;${vn(round(c / b, 3))}). Giá trị F tại các đỉnh: ${vals.map(vn).join('; ')}. GTLN = ${vn(M)}.`, method: 'GTLN/GTNN của F = ax + by trên miền đa giác đạt tại một trong các đỉnh.', wrongs: [] };
  },

  law_cos(p, d) {
    const b = R(3, 10), c = R(3, 10), A = pick([60, 120, 90]);
    const a2 = b * b + c * c - 2 * b * c * Math.cos((A * Math.PI) / 180);
    if (d <= 3) return { q: `Tam giác ABC có AB = ${c}, AC = ${b}, $\\hat A = ${A}^\\circ$. Tính $BC^2$.`, ans: round(a2, 4), sol: `Định lí côsin: BC² = AB² + AC² − 2·AB·AC·cos A = ${c * c} + ${b * b} − 2·${c}·${b}·cos ${A}° = ${vn(round(a2, 4))}.`, method: 'Định lí côsin: a² = b² + c² − 2bc·cos A.', wrongs: [[b * b + c * c, 'Em quên số hạng −2bc·cos A.']] };
    const S = round(0.5 * b * c * Math.sin((A * Math.PI) / 180), 2);
    return { q: `Tam giác ABC có AB = ${c}, AC = ${b}, $\\hat A = ${A === 90 ? 30 : A}^\\circ$. Tính diện tích tam giác (làm tròn 2 chữ số thập phân).`, ans: A === 90 ? round(0.25 * b * c, 2) : S, sol: `S = ½·AB·AC·sin A = ½·${c}·${b}·sin ${A === 90 ? 30 : A}° ≈ ${vn(A === 90 ? round(0.25 * b * c, 2) : S)}.`, method: 'Diện tích tam giác: S = ½·b·c·sin A.', wrongs: [[b * c / 2, 'Em quên nhân sin A.']] };
  },

  vector2(p, d) {
    const a = [R(-5, 5), R(-5, 5)], b = [R(-5, 5), R(-5, 5)];
    const dot = a[0] * b[0] + a[1] * b[1];
    if (d <= 2) return { q: `Cho $\\vec a = (${a[0]}; ${a[1]})$, $\\vec b = (${b[0]}; ${b[1]})$. Tìm tọa độ $\\vec a + 2\\vec b$ (viết: x; y).`, ans: `${a[0] + 2 * b[0]}; ${a[1] + 2 * b[1]}`, sol: `a + 2b = (${a[0]} + 2·${b[0]}; ${a[1]} + 2·${b[1]}) = (${a[0] + 2 * b[0]}; ${a[1] + 2 * b[1]}).`, method: 'Cộng vectơ và nhân vectơ với số thực theo từng tọa độ.', wrongs: [] };
    if (d <= 4) return { q: `Cho $\\vec a = (${a[0]}; ${a[1]})$, $\\vec b = (${b[0]}; ${b[1]})$. Tính tích vô hướng $\\vec a \\cdot \\vec b$.`, ans: dot, sol: `a·b = ${a[0]}·${b[0]} + ${a[1]}·${b[1]} = ${dot}.`, method: 'a·b = x₁x₂ + y₁y₂. a ⊥ b ⇔ a·b = 0.', wrongs: [[a[0] * b[1] + a[1] * b[0], 'Phải nhân hoành với hoành, tung với tung.']] };
    const k = R(1, 5);
    return { q: `Tìm $m$ để $\\vec u = (${k}; m)$ vuông góc với $\\vec v = (${2 * k}; ${-k || 1})$.`, ans: fstr(F(2 * k * k, k || 1)), sol: `u ⊥ v ⇔ u·v = 0 ⇔ ${k}·${2 * k} + m·(${-k}) = 0 ⇔ m = ${fstr(F(2 * k * k, k))}.`, method: 'Hai vectơ vuông góc ⇔ tích vô hướng bằng 0.', wrongs: [[fstr(F(-2 * k * k, k)), 'Em sai dấu khi chuyển vế.']] };
  },

  quad_fn(p, d) {
    const a = pick([1, -1, 2, -2]), h = R(-4, 4), k = R(-6, 6);
    const b = -2 * a * h, c = a * h * h + k;
    const f = `${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b ? sgn(b) + 'x' : ''} ${c ? sgn(c) : ''}`;
    if (d <= 3) return { q: `Tìm tọa độ đỉnh của parabol $y = ${f}$ (viết: x; y).`, ans: `${h}; ${k}`, sol: `x_đỉnh = −b/(2a) = ${-b}/${2 * a} = ${h}; y_đỉnh = y(${h}) = ${k}. Đỉnh I(${h}; ${k}).`, method: 'Đỉnh parabol y = ax² + bx + c: x = −b/(2a), y = −Δ/(4a).', wrongs: [[`${-h}; ${k}`, 'x đỉnh = −b/(2a): em quên dấu trừ.']] };
    return { q: `Hàm số $y = ${f}$ đạt giá trị ${a > 0 ? 'nhỏ nhất' : 'lớn nhất'} bằng bao nhiêu?`, ans: k, sol: `a ${a > 0 ? '> 0' : '< 0'} nên hàm số đạt GT${a > 0 ? 'NN' : 'LN'} tại đỉnh x = ${h}, giá trị ${k}.`, method: 'a > 0: parabol quay lên, GTNN tại đỉnh. a < 0: quay xuống, GTLN tại đỉnh.', wrongs: [[h, 'Đó là hoành độ đỉnh, không phải giá trị của hàm.']] };
  },

  quad_ineq(p, d) {
    let x1 = R(-6, 5), x2 = x1 + R(1, 6);
    const b = -(x1 + x2), c = x1 * x2;
    const f = `x^2 ${b ? sgn(b) + 'x' : ''} ${c ? sgn(c) : ''}`;
    if (d <= 3) return { q: `Giải bất phương trình $${f} < 0$. Nghiệm là khoảng $(a; b)$, ghi a; b.`, ans: `${x1}; ${x2}`, tex: `(${x1}; ${x2})`, sol: `f(x) có hai nghiệm ${x1} và ${x2}, a = 1 > 0 nên f(x) < 0 trong khoảng giữa hai nghiệm: (${x1}; ${x2}).`, method: 'Dấu tam thức bậc hai: "trong trái, ngoài cùng" (trong khoảng hai nghiệm trái dấu a).', wrongs: [] };
    const cnt = x2 - x1 - 1;
    return { q: `Có bao nhiêu số nguyên $x$ thỏa mãn $${f} < 0$?`, ans: cnt, sol: `Nghiệm: ${x1} < x < ${x2}. Các số nguyên: từ ${x1 + 1} đến ${x2 - 1}, có ${cnt} số.`, method: 'Giải bất phương trình bậc hai bằng xét dấu, rồi đếm số nguyên trong khoảng (chú ý đầu mút).', wrongs: [[cnt + 2, 'Bất phương trình chặt, không lấy hai nghiệm biên.']] };
  },

  coord2(p, d) {
    const [dx, dy, dd] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]);
    const A = [R(-5, 5), R(-5, 5)], B = [A[0] + dx * pick([1, -1]), A[1] + dy * pick([1, -1])];
    if (d <= 2) return { q: `Tính độ dài đoạn thẳng AB với $A(${A[0]}; ${A[1]})$, $B(${B[0]}; ${B[1]})$.`, ans: dd, sol: `AB = √((${B[0]} − ${A[0]})² + (${B[1]} − ${A[1]})²) = √(${dx * dx} + ${dy * dy}) = ${dd}.`, method: 'AB = √((x_B − x_A)² + (y_B − y_A)²).', wrongs: [[dx + dy, 'Phải bình phương rồi lấy căn.']] };
    if (d === 3) return { q: `Tìm tọa độ trung điểm M của AB với $A(${A[0]}; ${A[1]})$, $B(${B[0]}; ${B[1]})$ (viết: x; y).`, ans: `${(A[0] + B[0]) / 2}; ${(A[1] + B[1]) / 2}`, sol: `M = ((${A[0]} + ${B[0]})/2; (${A[1]} + ${B[1]})/2).`, method: 'Trung điểm: trung bình cộng các tọa độ.', wrongs: [] };
    const a = R(1, 4), b = R(-4, 4) || 1, c = R(-10, 10);
    const P = [R(-3, 3), R(-3, 3)];
    const num = Math.abs(a * P[0] + b * P[1] + c), den2 = a * a + b * b;
    return { q: `Tính khoảng cách từ điểm $M(${P[0]}; ${P[1]})$ đến đường thẳng $\\Delta: ${a}x ${sgn(b)}y ${sgn(c)} = 0$ (làm tròn 2 chữ số thập phân).`, ans: round(num / Math.sqrt(den2), 2), sol: `d = |${a}·${P[0]} + (${b})·${P[1]} + (${c})| / √(${a}² + ${b}²) = ${num}/√${den2} ≈ ${vn(round(num / Math.sqrt(den2), 2))}.`, method: 'd(M, Δ) = |ax₀ + by₀ + c| / √(a² + b²).', wrongs: [[num, 'Em quên chia cho √(a² + b²).']] };
  },

  comb(p, d) {
    const C = (n, k) => { let x = 1; for (let i = 0; i < k; i++) x = (x * (n - i)) / (i + 1); return x; };
    const n = R(5, 10), k = R(2, 4);
    if (d <= 2) return { q: `Có bao nhiêu cách xếp ${n - 2} bạn ngồi vào một hàng ghế có ${n - 2} chỗ?`, ans: [1, 1, 2, 6, 24, 120, 720, 5040, 40320][n - 2], sol: `Mỗi cách xếp là một hoán vị: P = ${n - 2}! = ${[1, 1, 2, 6, 24, 120, 720, 5040, 40320][n - 2]}.`, method: 'Xếp n đối tượng khác nhau vào n vị trí: n! cách (hoán vị).', wrongs: [[(n - 2) ** 2, 'Phải dùng giai thừa.']] };
    if (d === 3) return { q: `Một lớp có ${n + 10} học sinh. Có bao nhiêu cách chọn ${k} bạn làm lớp trưởng, lớp phó, thủ quỹ...? (${k} chức vụ khác nhau)`, ans: Array.from({ length: k }, (_, i) => n + 10 - i).reduce((a, b) => a * b, 1), sol: `Chọn có thứ tự ⇒ chỉnh hợp: A(${n + 10}, ${k}) = ${Array.from({ length: k }, (_, i) => n + 10 - i).join('·')} = ${Array.from({ length: k }, (_, i) => n + 10 - i).reduce((a, b) => a * b, 1)}.`, method: 'Chọn k từ n CÓ thứ tự (chức vụ khác nhau) → chỉnh hợp A(n,k); KHÔNG thứ tự → tổ hợp C(n,k).', wrongs: [[C(n + 10, k), 'Các chức vụ khác nhau nên thứ tự quan trọng → chỉnh hợp, không phải tổ hợp.']] };
    if (d === 4) return { q: `Có bao nhiêu cách chọn ${k} bạn từ ${n + 10} bạn để đi trực nhật (không phân biệt vai trò)?`, ans: C(n + 10, k), sol: `Chọn không thứ tự ⇒ C(${n + 10}, ${k}) = ${C(n + 10, k)}.`, method: 'Tổ hợp: C(n,k) = n!/(k!(n − k)!).', wrongs: [[Array.from({ length: k }, (_, i) => n + 10 - i).reduce((a, b) => a * b, 1), 'Không phân biệt vai trò → tổ hợp.']] };
    const m = R(4, 6);
    return { q: `Tìm hệ số của $x^{${m - 2}}$ trong khai triển $(x + 2)^{${m}}$.`, ans: C(m, 2) * 4, sol: `Số hạng tổng quát: C(${m}, k)·x^(${m}−k)·2^k. Với ${m} − k = ${m - 2} ⇒ k = 2: hệ số = C(${m}, 2)·2² = ${C(m, 2)}·4 = ${C(m, 2) * 4}.`, method: 'Nhị thức Newton: (a + b)ⁿ = Σ C(n,k)·a^(n−k)·b^k.', wrongs: [[C(m, 2), 'Em quên nhân 2^k.']] };
  },

  trig(p, d) {
    const tbl = { 0: ['0', '1'], 30: ['\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}'], 45: ['\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{2}}{2}'], 60: ['\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}'], 90: ['1', '0'] };
    if (d <= 2) { const ang = pick([30, 60, 90, 0]); const num = { 0: 0, 30: 0.5, 60: Math.sqrt(3) / 2, 90: 1 }[ang]; return { q: `Tính $\\sin ${ang}^\\circ$ (làm tròn 3 chữ số thập phân nếu cần).`, ans: round(num, 3), tex: tbl[ang][0], sol: `sin ${ang}° = ${tbl[ang][0].replace(/\\frac\{(.+?)\}\{(.+?)\}/, '$1/$2').replace('\\sqrt', '√')}.`, method: 'Thuộc bảng giá trị lượng giác các góc đặc biệt 0°, 30°, 45°, 60°, 90°.', wrongs: [[round(Math.cos((ang * Math.PI) / 180), 3), 'Đó là giá trị cos.']] }; }
    if (d === 3) { const k = pick([[1, 6], [1, 3], [1, 4], [2, 3], [5, 6]]); const deg = (180 * k[0]) / k[1]; return { q: `Đổi $\\dfrac{${k[0] === 1 ? '' : k[0]}\\pi}{${k[1]}}$ sang độ.`, ans: deg, tex: `${deg}^\\circ`, sol: `π rad = 180° ⇒ ${k[0]}π/${k[1]} = ${k[0]}·180°/${k[1]} = ${deg}°.`, method: 'π rad = 180°; đổi a rad sang độ: a·180/π.', wrongs: [[deg / 2, 'π rad tương ứng 180°, không phải 360°.']] }; }
    if (d === 4) { const ang = pick([30, 45, 60]); return { q: `Giải phương trình $\\sin x = \\sin ${ang}^\\circ$ trên đoạn $[0^\\circ; 360^\\circ]$. Liệt kê các nghiệm (độ).`, ans: `${ang}; ${180 - ang}`, sol: `sin x = sin α ⇔ x = α + k360° hoặc x = 180° − α + k360°. Trên [0°; 360°]: x = ${ang}° hoặc x = ${180 - ang}°.`, method: 'sin x = sin α ⇔ x = α + k2π hoặc x = π − α + k2π.', wrongs: [[`${ang}; ${360 - ang}`, 'Đó là họ nghiệm của cos x = cos α.']] }; }
    return { q: `Tìm giá trị lớn nhất của $y = 3\\sin x + 4\\cos x$.`, ans: 5, sol: `a sin x + b cos x có GTLN = √(a² + b²) = √(9 + 16) = 5.`, method: 'a sin x + b cos x = √(a² + b²)·sin(x + φ) ⇒ |y| ≤ √(a² + b²).', wrongs: [[7, 'Không thể cùng lúc sin x = 1 và cos x = 1.']] };
  },

  sequence(p, d) {
    const u1 = R(-5, 10), dd = pick([-3, -2, 2, 3, 4, 5]), n = R(8, 20);
    if (d <= 2) return { q: `Cấp số cộng có $u_1 = ${u1}$, công sai $d = ${dd}$. Tính $u_{${n}}$.`, ans: u1 + (n - 1) * dd, sol: `uₙ = u₁ + (n − 1)d = ${u1} + ${n - 1}·(${dd}) = ${u1 + (n - 1) * dd}.`, method: 'Cấp số cộng: uₙ = u₁ + (n − 1)d; Sₙ = n(u₁ + uₙ)/2.', wrongs: [[u1 + n * dd, 'Số hạng thứ n cộng (n − 1) lần công sai.']] };
    if (d === 3) return { q: `Tính tổng ${n} số hạng đầu của cấp số cộng có $u_1 = ${u1}$, $d = ${dd}$.`, ans: (n * (2 * u1 + (n - 1) * dd)) / 2, sol: `Sₙ = n[2u₁ + (n − 1)d]/2 = ${n}·[${2 * u1} + ${(n - 1) * dd}]/2 = ${(n * (2 * u1 + (n - 1) * dd)) / 2}.`, method: 'Sₙ = n(u₁ + uₙ)/2 = n[2u₁ + (n − 1)d]/2.', wrongs: [[n * (2 * u1 + (n - 1) * dd), 'Em quên chia 2.']] };
    const g1 = R(1, 5), q = pick([2, 3, -2]), m = R(4, 7);
    if (d === 4) return { q: `Cấp số nhân có $u_1 = ${g1}$, công bội $q = ${q}$. Tính $u_{${m}}$.`, ans: g1 * q ** (m - 1), sol: `uₙ = u₁·q^(n−1) = ${g1}·(${q})^${m - 1} = ${g1 * q ** (m - 1)}.`, method: 'Cấp số nhân: uₙ = u₁·qⁿ⁻¹; Sₙ = u₁(1 − qⁿ)/(1 − q).', wrongs: [[g1 * q ** m, 'Số mũ là n − 1.']] };
    return { q: `Cấp số nhân có $u_1 = ${g1}$, $q = ${Math.abs(q)}$. Tính tổng ${m} số hạng đầu.`, ans: (g1 * (Math.abs(q) ** m - 1)) / (Math.abs(q) - 1), sol: `Sₙ = u₁(qⁿ − 1)/(q − 1) = ${g1}·(${Math.abs(q)}^${m} − 1)/${Math.abs(q) - 1} = ${(g1 * (Math.abs(q) ** m - 1)) / (Math.abs(q) - 1)}.`, method: 'Sₙ = u₁(qⁿ − 1)/(q − 1), q ≠ 1.', wrongs: [[g1 * Math.abs(q) ** (m - 1), 'Đó chỉ là số hạng thứ n.']] };
  },

  limit(p, d) {
    const a = R(1, 6), b = R(-5, 5), c = R(1, 6), e = R(-5, 5);
    if (d <= 2) { const x0 = R(-3, 3); return { q: `Tính $\\lim\\limits_{x \\to ${x0}} (${a}x^2 ${sgn(b)}x ${sgn(e)})$.`, ans: a * x0 * x0 + b * x0 + e, sol: `Hàm đa thức liên tục nên giới hạn = giá trị tại x = ${x0}: ${a * x0 * x0 + b * x0 + e}.`, method: 'Hàm đa thức liên tục trên ℝ: lim f(x) khi x → x₀ bằng f(x₀).', wrongs: [] }; }
    if (d === 3) return { q: `Tính $\\lim\\limits_{n \\to +\\infty} \\dfrac{${a}n ${sgn(b)}}{${c}n ${sgn(e)}}$ (phân số).`, ans: fstr(F(a, c)), tex: ftex(F(a, c)), sol: `Chia tử và mẫu cho n: (${a} + ${b}/n)/(${c} + ${e}/n) → ${a}/${c}.`, method: 'Giới hạn dãy phân thức cùng bậc: bằng tỉ số hệ số bậc cao nhất.', wrongs: [[fstr(F(b, e || 1)), 'Phải lấy tỉ số hệ số của số hạng bậc cao nhất.']] };
    const r = R(1, 5);
    return { q: `Tính $\\lim\\limits_{x \\to ${r}} \\dfrac{x^2 - ${r * r}}{x - ${r}}$.`, ans: 2 * r, sol: `Dạng 0/0. x² − ${r * r} = (x − ${r})(x + ${r}) ⇒ giới hạn = lim (x + ${r}) = ${2 * r}.`, method: 'Dạng 0/0: phân tích thành nhân tử, giản ước nhân tử gây ra 0.', wrongs: [[0, 'Đây là dạng vô định 0/0, phải khử trước.']] };
  },

  exp_log(p, d) {
    const b = pick([2, 3, 5]), k = R(2, 5);
    if (d <= 2) return { q: `Tính $\\log_{${b}} ${b ** k}$.`, ans: k, sol: `${b ** k} = ${b}^${k} ⇒ log_${b} ${b ** k} = ${k}.`, method: 'log_a(aᵏ) = k.', wrongs: [[b ** k / b, 'Lôgarit là số mũ, không phải phép chia.']] };
    if (d === 3) return { q: `Giải phương trình: $${b}^{x-1} = ${b ** k}$.`, ans: k + 1, sol: `${b}^(x−1) = ${b}^${k} ⇒ x − 1 = ${k} ⇒ x = ${k + 1}.`, method: 'Đưa về cùng cơ số: a^f(x) = a^g(x) ⇔ f(x) = g(x).', wrongs: [[k - 1, 'Chuyển vế sai dấu.']] };
    if (d === 4) { const m = R(2, 4); return { q: `Tính $\\log_2 ${2 ** m * 3} - \\log_2 3$.`, ans: m, sol: `log₂ a − log₂ b = log₂(a/b) = log₂ ${2 ** m} = ${m}.`, method: 'log_a x − log_a y = log_a(x/y); log_a x + log_a y = log_a(xy).', wrongs: [[round(Math.log2(2 ** m * 3 - 3), 3), 'Không được trừ trực tiếp bên trong log.']] }; }
    const r = R(5, 10), T = R(5, 10);
    return { q: `Một khoản tiết kiệm 100 triệu đồng, lãi suất ${r}%/năm, lãi nhập gốc (lãi kép). Sau ${T} năm số tiền là bao nhiêu triệu đồng? (làm tròn 2 chữ số thập phân)`, ans: round(100 * (1 + r / 100) ** T, 2), sol: `A = A₀(1 + r)ⁿ = 100·(1 + ${r / 100})^${T} ≈ ${vn(round(100 * (1 + r / 100) ** T, 2))} triệu đồng.`, method: 'Lãi kép: A = A₀(1 + r)ⁿ.', wrongs: [[round(100 * (1 + (r * T) / 100), 2), 'Đó là lãi đơn — lãi kép tính lãi trên cả tiền lãi.']] };
  },

  derivative(p, d) {
    const co = [R(-5, 5), R(-6, 6), R(-4, 4), R(-3, 3) || 1];
    const dco = co.slice(1).map((c, i) => c * (i + 1));
    const x0 = R(-2, 2);
    if (d <= 2) return { q: `Tính đạo hàm của $f(x) = ${polyTex(co)}$ tại $x = ${x0}$.`, ans: pval(dco, x0), sol: `f'(x) = ${polyTex(dco)}. f'(${x0}) = ${pval(dco, x0)}.`, method: '(xⁿ)\' = n·xⁿ⁻¹; đạo hàm của hằng số bằng 0; đạo hàm của tổng là tổng các đạo hàm.', wrongs: [[pval(co, x0), 'Đó là f(x₀), chưa lấy đạo hàm.']] };
    if (d <= 4) { const y0 = pval(co, x0), k = pval(dco, x0); return { q: `Viết phương trình tiếp tuyến của đồ thị $y = ${polyTex(co)}$ tại điểm có hoành độ $x_0 = ${x0}$. Hệ số góc tiếp tuyến bằng bao nhiêu?`, ans: k, tex: `y = ${k}x ${sgn(y0 - k * x0)}`, sol: `y₀ = ${y0}; k = f'(${x0}) = ${k}. Tiếp tuyến: y = ${k}(x − (${x0})) + ${y0} = ${k}x ${sgn(y0 - k * x0)}.`, method: 'Tiếp tuyến tại M(x₀; y₀): y = f\'(x₀)(x − x₀) + y₀.', wrongs: [[y0, 'Hệ số góc là f\'(x₀), không phải y₀.']] }; }
    const v0 = R(10, 40), g = 10;
    return { q: `Một vật được ném thẳng đứng lên với phương trình độ cao $h(t) = ${v0}t - 5t^2$ (m). Tính vận tốc của vật tại thời điểm $t = 1$ s và thời điểm vật đạt độ cao lớn nhất (viết: vận tốc; thời điểm).`, ans: `${v0 - g}; ${round(v0 / 10, 2)}`, sol: `v(t) = h'(t) = ${v0} − 10t. v(1) = ${v0 - 10} m/s. Độ cao lớn nhất khi v = 0 ⇔ t = ${vn(round(v0 / 10, 2))} s.`, method: 'Vận tốc tức thời là đạo hàm của quãng đường theo thời gian; cực trị khi đạo hàm bằng 0.', wrongs: [] };
  },

  extrema(p, d) {
    const a = R(1, 4);
    // f(x) = x^3 - 3a^2 x + c ; cực trị tại ±a
    const c = R(-5, 5);
    const fmax = -(a ** 3) + 3 * a * a * a + c, fmin = a ** 3 - 3 * a * a * a + c;
    if (d <= 2) return { q: `Hàm số $f(x) = x^3 - ${3 * a * a}x ${sgn(c)}$ đạt cực đại tại $x$ bằng bao nhiêu?`, ans: -a, sol: `f'(x) = 3x² − ${3 * a * a} = 0 ⇔ x = ±${a}. f' đổi dấu từ + sang − tại x = −${a} ⇒ cực đại tại x = −${a}.`, method: 'Giải f\'(x) = 0, lập bảng biến thiên; f\' đổi dấu + → − là cực đại, − → + là cực tiểu.', wrongs: [[a, 'Đó là điểm cực tiểu.']] };
    if (d === 3) return { q: `Tìm giá trị cực tiểu của hàm số $f(x) = x^3 - ${3 * a * a}x ${sgn(c)}$.`, ans: fmin, sol: `Cực tiểu tại x = ${a}: f(${a}) = ${a ** 3} − ${3 * a ** 3} + (${c}) = ${fmin}.`, method: 'Giá trị cực tiểu là f(x_CT), không phải x_CT.', wrongs: [[a, 'Đó là điểm cực tiểu x, không phải giá trị cực tiểu.'], [fmax, 'Đó là giá trị cực đại.']] };
    const L = R(a + 1, a + 3);
    const vals = [[-L, -(L ** 3) + 3 * a * a * L + c], [-a, fmax], [a, fmin], [L, L ** 3 - 3 * a * a * L + c]];
    const M = Math.max(...vals.map((v) => v[1]));
    if (d === 4) return { q: `Tìm giá trị lớn nhất của $f(x) = x^3 - ${3 * a * a}x ${sgn(c)}$ trên đoạn $[${-L}; ${L}]$.`, ans: M, sol: `f'(x) = 0 ⇔ x = ±${a} ∈ [${-L}; ${L}]. So sánh: ${vals.map((v) => `f(${v[0]}) = ${v[1]}`).join('; ')}. GTLN = ${M}.`, method: 'GTLN/GTNN trên đoạn: tính f tại hai đầu mút và tại các điểm tới hạn trong đoạn, rồi so sánh.', wrongs: [[fmax, 'Phải so sánh thêm giá trị ở hai đầu mút.']] };
    const side = R(10, 30) * 2;
    return { q: `Từ một tấm bìa hình vuông cạnh ${side} cm, cắt ở bốn góc bốn hình vuông bằng nhau cạnh $x$ rồi gấp thành hộp không nắp. Tìm $x$ để thể tích hộp lớn nhất.`, ans: round(side / 6, 4), tex: `x = ${vn(round(side / 6, 2))}\\text{ cm}`, sol: `V(x) = x(${side} − 2x)², 0 < x < ${side / 2}. V'(x) = (${side} − 2x)(${side} − 6x) = 0 ⇒ x = ${vn(round(side / 6, 2))} (loại x = ${side / 2}). Đây là điểm cực đại ⇒ V lớn nhất.`, method: 'Bài toán tối ưu: lập hàm số theo ẩn, tìm miền xác định, khảo sát bằng đạo hàm.', wrongs: [[side / 4, 'Giải sai phương trình V\'(x) = 0.']] };
  },

  coord3(p, d) {
    const A = [R(-4, 4), R(-4, 4), R(-4, 4)];
    const [x, y, z] = pick([[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 6, 9], [4, 4, 7]]);
    const B = [A[0] + x, A[1] - y, A[2] + z];
    const nr = x * x + y * y + z * z;
    if (p.planes && d >= 3) {
      const n = [R(1, 3), R(-2, 2), R(1, 2)];
      const D = R(-6, 6);
      const M = [R(-3, 3), R(-3, 3), R(-3, 3)];
      const num = Math.abs(n[0] * M[0] + n[1] * M[1] + n[2] * M[2] + D), den = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
      if (d === 5) return { q: `Viết phương trình mặt phẳng đi qua $M(${M.join('; ')})$ và có vectơ pháp tuyến $\\vec n = (${n.join('; ')})$. Hệ số tự do $D$ (dạng $ax + by + cz + D = 0$) bằng bao nhiêu?`, ans: -(n[0] * M[0] + n[1] * M[1] + n[2] * M[2]), sol: `Phương trình: ${n[0]}(x − ${M[0]}) + ${n[1]}(y − ${M[1]}) + ${n[2]}(z − ${M[2]}) = 0 ⇒ D = ${-(n[0] * M[0] + n[1] * M[1] + n[2] * M[2])}.`, method: 'Mặt phẳng qua M(x₀;y₀;z₀) có VTPT (a;b;c): a(x − x₀) + b(y − y₀) + c(z − z₀) = 0.', wrongs: [[n[0] * M[0] + n[1] * M[1] + n[2] * M[2], 'Em sai dấu khi khai triển.']] };
      return { q: `Tính khoảng cách từ $M(${M.join('; ')})$ đến mặt phẳng $(P): ${n[0]}x ${sgn(n[1])}y ${sgn(n[2])}z ${sgn(D)} = 0$ (làm tròn 2 chữ số thập phân).`, ans: round(num / den, 2), sol: `d = |${n[0]}·${M[0]} + ${n[1]}·${M[1]} + ${n[2]}·${M[2]} + ${D}|/√(${n[0] ** 2 + n[1] ** 2 + n[2] ** 2}) ≈ ${vn(round(num / den, 2))}.`, method: 'd(M,(P)) = |ax₀ + by₀ + cz₀ + D| / √(a² + b² + c²).', wrongs: [[num, 'Em quên chia cho độ dài vectơ pháp tuyến.']] };
    }
    if (d <= 3) return { q: `Trong không gian Oxyz, cho $A(${A.join('; ')})$, $B(${B.join('; ')})$. Tính độ dài AB.`, ans: Math.sqrt(nr), sol: `AB = √(${x}² + ${y}² + ${z}²) = √${nr} = ${Math.sqrt(nr)}.`, method: 'AB = √((x_B − x_A)² + (y_B − y_A)² + (z_B − z_A)²).', wrongs: [[x + y + z, 'Phải bình phương và lấy căn.']] };
    const u = [R(-3, 3), R(-3, 3), R(-3, 3)], v = [R(-3, 3), R(-3, 3), R(-3, 3)];
    return { q: `Cho $\\vec u = (${u.join('; ')})$, $\\vec v = (${v.join('; ')})$. Tính $\\vec u \\cdot \\vec v$.`, ans: u[0] * v[0] + u[1] * v[1] + u[2] * v[2], sol: `u·v = ${u[0]}·${v[0]} + ${u[1]}·${v[1]} + ${u[2]}·${v[2]} = ${u[0] * v[0] + u[1] * v[1] + u[2] * v[2]}.`, method: 'Tích vô hướng: x₁x₂ + y₁y₂ + z₁z₂.', wrongs: [] };
  },

  integral(p, d) {
    const co = [R(-4, 4), R(-3, 3) * 2, R(-2, 2) * 3 || 3];
    const a = R(0, 1), b = a + R(1, 3);
    const anti = (x) => co.reduce((s, c, i) => s + (c * x ** (i + 1)) / (i + 1), 0);
    const I = round(anti(b) - anti(a), 4);
    if (d <= 2) return { q: `Tìm nguyên hàm $F(x)$ của $f(x) = ${polyTex(co)}$ thỏa $F(0) = 0$, rồi tính $F(1)$.`, ans: round(anti(1), 4), sol: `F(x) = ${co.map((c, i) => `${c}x^${i + 1}/${i + 1}`).join(' + ')}; F(1) = ${vn(round(anti(1), 4))}.`, method: '∫xⁿdx = xⁿ⁺¹/(n + 1) + C.', wrongs: [] };
    if (d <= 4) return { q: `Tính tích phân $\\displaystyle\\int_{${a}}^{${b}} (${polyTex(co)})\\,dx$.`, ans: I, sol: `F(x) là một nguyên hàm; I = F(${b}) − F(${a}) = ${vn(round(anti(b), 4))} − ${vn(round(anti(a), 4))} = ${vn(I)}.`, method: 'Công thức Newton – Leibniz: ∫ₐᵇ f(x)dx = F(b) − F(a).', wrongs: [[round(anti(a) - anti(b), 4), 'Thứ tự: F(b) − F(a).']] };
    const k = R(1, 3);
    return { q: `Tính diện tích hình phẳng giới hạn bởi đồ thị $y = x^2$ và đường thẳng $y = ${k * k}$ (phân số).`, ans: fstr(F(4 * k ** 3, 3)), tex: ftex(F(4 * k ** 3, 3)), sol: `Giao điểm x = ±${k}. S = ∫₋${k}^${k} (${k * k} − x²)dx = [${k * k}x − x³/3] = ${fstr(F(4 * k ** 3, 3))}.`, method: 'S = ∫ₐᵇ |f(x) − g(x)| dx, với a, b là hoành độ giao điểm.', wrongs: [[fstr(F(2 * k ** 3, 3)), 'Em chỉ tính một nửa (từ 0 đến ' + k + ').']] };
  },

  cond_prob(p, d) {
    const nA = R(20, 40), nAB = R(5, nA - 5), tot = 100;
    if (d <= 3) return { q: `Trong ${tot} học sinh, có ${nA} bạn tham gia CLB Toán; trong số đó có ${nAB} bạn tham gia cả CLB Tiếng Anh. Chọn ngẫu nhiên một bạn thuộc CLB Toán. Xác suất bạn đó tham gia CLB Tiếng Anh là bao nhiêu? (phân số)`, ans: fstr(F(nAB, nA)), tex: ftex(F(nAB, nA)), sol: `P(B|A) = P(A∩B)/P(A) = ${nAB}/${nA} = ${fstr(F(nAB, nA))}.`, method: 'Xác suất có điều kiện: P(B|A) = P(A∩B)/P(A).', wrongs: [[fstr(F(nAB, tot)), 'Đó là P(A∩B), chưa chia cho P(A).']] };
    const pr = pick([0.01, 0.02, 0.05]), se = pick([0.9, 0.95, 0.99]), fp = pick([0.05, 0.1]);
    const post = round((pr * se) / (pr * se + (1 - pr) * fp), 4);
    return { q: `Một bệnh có tỉ lệ mắc ${vn(pr * 100)}%. Xét nghiệm cho kết quả dương tính với người bệnh với xác suất ${vn(se)}, và dương tính nhầm với người khỏe với xác suất ${vn(fp)}. Một người xét nghiệm dương tính. Xác suất người đó thực sự mắc bệnh là bao nhiêu? (làm tròn 4 chữ số thập phân)`, ans: post, sol: `Công thức Bayes: P = (${vn(pr)}·${vn(se)}) / (${vn(pr)}·${vn(se)} + ${vn(1 - pr)}·${vn(fp)}) ≈ ${vn(post)}.`, method: 'Công thức Bayes: P(A|B) = P(A)P(B|A) / [P(A)P(B|A) + P(Ā)P(B|Ā)].', wrongs: [[se, 'Đó là P(dương tính | bệnh), không phải P(bệnh | dương tính).']] };
  },

  stats_mean(p, d) {
    const n = p.simple ? 5 : 6 + R(0, 3);
    const arr = Array.from({ length: n }, () => R(p.simple ? 1 : 3, p.simple ? 20 : 10));
    const s = arr.reduce((a, b) => a + b, 0);
    const sorted = [...arr].sort((a, b) => a - b);
    if (p.simple) { const mx = Math.max(...arr), mn = Math.min(...arr);
      return d <= 3 ? { q: `Số bông hoa ${n} bạn hái được là: ${arr.join(', ')}. Bạn hái nhiều nhất hơn bạn hái ít nhất bao nhiêu bông?`, ans: mx - mn, sol: `Nhiều nhất ${mx}, ít nhất ${mn}: ${mx} − ${mn} = ${mx - mn}.`, method: 'Đọc dãy số liệu, tìm giá trị lớn nhất và nhỏ nhất rồi so sánh.', wrongs: [[mx, 'Đề hỏi hơn bao nhiêu (hiệu), không hỏi số lớn nhất.']] }
        : { q: `Số bông hoa ${n} bạn hái được là: ${arr.join(', ')}. Cả nhóm hái được bao nhiêu bông?`, ans: s, sol: `${arr.join(' + ')} = ${s}.`, method: 'Cộng tất cả các số liệu.', wrongs: [] }; }
    if (p.grouped) {
      const groups = [[0, 10], [10, 20], [20, 30], [30, 40]], f = groups.map(() => R(2, 12)), N = f.reduce((a, b) => a + b, 0);
      const mean = round(groups.reduce((sum, g, i) => sum + ((g[0] + g[1]) / 2) * f[i], 0) / N, 2);
      if (p.spread && d >= 3) { const var_ = round(groups.reduce((sum, g, i) => sum + f[i] * ((g[0] + g[1]) / 2 - mean) ** 2, 0) / N, 2); return { q: `Mẫu số liệu ghép nhóm: $[0;10)$: ${f[0]}, $[10;20)$: ${f[1]}, $[20;30)$: ${f[2]}, $[30;40)$: ${f[3]}. Tính phương sai (làm tròn 2 chữ số thập phân, dùng giá trị đại diện là trung điểm nhóm).`, ans: var_, sol: `Giá trị đại diện: 5, 15, 25, 35. x̄ ≈ ${vn(mean)}. s² = Σnᵢ(xᵢ − x̄)²/n ≈ ${vn(var_)}.`, method: 'Phương sai mẫu ghép nhóm: s² = (1/n)Σnᵢ(xᵢ − x̄)², xᵢ là giá trị đại diện.', wrongs: [[round(Math.sqrt(var_), 2), 'Đó là độ lệch chuẩn.']] }; }
      return { q: `Mẫu số liệu ghép nhóm: $[0;10)$: ${f[0]}, $[10;20)$: ${f[1]}, $[20;30)$: ${f[2]}, $[30;40)$: ${f[3]}. Tính số trung bình (làm tròn 2 chữ số thập phân).`, ans: mean, sol: `x̄ = (5·${f[0]} + 15·${f[1]} + 25·${f[2]} + 35·${f[3]})/${N} ≈ ${vn(mean)}.`, method: 'Số trung bình mẫu ghép nhóm: x̄ = Σnᵢxᵢ/n với xᵢ là trung điểm nhóm.', wrongs: [[20, 'Không lấy trung bình các trung điểm — phải nhân với tần số.']] };
    }
    if (d <= 2) return { q: `Điểm kiểm tra của một nhóm học sinh: ${arr.join('; ')}. Tính điểm trung bình (làm tròn 2 chữ số thập phân).`, ans: round(s / n, 2), sol: `Tổng: ${s}. Trung bình: ${s}/${n} ≈ ${vn(round(s / n, 2))}.`, method: 'Số trung bình = tổng các giá trị : số giá trị.', wrongs: [[s, 'Chưa chia cho số giá trị.']] };
    if (d === 3) { const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2; return { q: `Tìm trung vị của mẫu số liệu: ${arr.join('; ')}.`, ans: med, sol: `Sắp xếp: ${sorted.join('; ')}. ${n % 2 ? `n = ${n} lẻ: trung vị là số ở giữa = ${med}.` : `n = ${n} chẵn: trung vị = (${sorted[n / 2 - 1]} + ${sorted[n / 2]})/2 = ${vn(med)}.`}`, method: 'Trung vị: sắp xếp tăng dần, lấy giá trị chính giữa (n chẵn: trung bình hai giá trị giữa).', wrongs: [[arr[Math.floor(n / 2)], 'Phải sắp xếp dãy trước khi lấy số ở giữa.']] }; }
    if (p.freq || d === 4) { const cnt = {}; arr.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const x = pick(arr); return { q: `Mẫu số liệu: ${arr.join('; ')}. Tính tần số tương đối của giá trị ${x} (phần trăm, làm tròn 2 chữ số thập phân).`, ans: round((cnt[x] / n) * 100, 2), sol: `Giá trị ${x} xuất hiện ${cnt[x]} lần trên ${n}: ${cnt[x]}/${n} ≈ ${vn(round((cnt[x] / n) * 100, 2))}%.`, method: 'Tần số tương đối = tần số : tổng số giá trị (thường ghi dạng %).', wrongs: [[cnt[x], 'Đó là tần số, chưa chia cho n.']] }; }
    const mean = s / n; const var_ = round(arr.reduce((a, x) => a + (x - mean) ** 2, 0) / n, 2);
    return p.advanced
      ? { q: `Tính phương sai của mẫu số liệu: ${arr.join('; ')} (làm tròn 2 chữ số thập phân).`, ans: var_, sol: `x̄ = ${vn(round(mean, 3))}. s² = Σ(xᵢ − x̄)²/n ≈ ${vn(var_)}.`, method: 'Phương sai s² = (1/n)Σ(xᵢ − x̄)²; độ lệch chuẩn s = √s².', wrongs: [[round(Math.sqrt(var_), 2), 'Đó là độ lệch chuẩn.']] }
      : { q: `Khoảng biến thiên của mẫu số liệu ${arr.join('; ')} là bao nhiêu?`, ans: sorted[n - 1] - sorted[0], sol: `Khoảng biến thiên = max − min = ${sorted[n - 1]} − ${sorted[0]} = ${sorted[n - 1] - sorted[0]}.`, method: 'Khoảng biến thiên R = giá trị lớn nhất − giá trị nhỏ nhất.', wrongs: [] };
  },
};

// ---------- đóng gói thành bài tập ----------

/** Định dạng đáp án máy → LaTeX hiển thị. */
function toTex(ans) {
  if (typeof ans === 'number') return vn(ans);
  return String(ans).replace(/(-?\d+)\/(\d+)/g, (_, a, b) => `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`).replace(/\*/g, '\\cdot ');
}

function numericDistractors(ans, n) {
  const out = new Set();
  const isInt = Number.isInteger(ans);
  const tries = [ans + 1, ans - 1, ans + 2, ans * 2, ans + 10, ans - 10, Math.round(ans / 2), ans + 5, -ans, ans * 10];
  for (const x of tries) {
    const v = isInt ? Math.round(x) : round(x, 3);
    if (v !== ans && !out.has(v) && !(ans >= 0 && v < 0 && Math.abs(ans) > 2)) out.add(v);
    if (out.size >= n) break;
  }
  return [...out].slice(0, n);
}

/** Văn bản thường (ngoài $...$) không được chứa cú pháp LaTeX. */
function plainText(s) {
  return String(s)
    .replace(/\{,\}/g, ',').replace(/\\,/g, ' ')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2');
}
function cleanMixed(s) {
  return String(s).split('$').map((seg, i) => (i % 2 ? seg : plainText(seg))).join('$');
}

/** Giải thích sai lầm có thể dẫn tới một phương án nhiễu dạng số. */
function whyNumeric(v, ans) {
  const eq = (a, b) => Math.abs(a - b) < 1e-9;
  if (eq(v, -ans)) return 'Kết quả này sai dấu. Em kiểm tra lại quy tắc dấu (nhất là khi chuyển vế hoặc nhân/chia số âm).';
  if (eq(Math.abs(v - ans), 1)) return 'Kết quả lệch 1 đơn vị so với đáp án — thường do nhớ/mượn sai hoặc đếm thiếu/thừa một số. Em tính lại từng bước cẩn thận.';
  if (eq(v, ans * 2) || eq(v * 2, ans) || eq(v, Math.round(ans / 2))) return 'Kết quả gấp đôi hoặc bằng một nửa đáp án — có thể em đã quên nhân hoặc chia 2 trong công thức.';
  if (eq(v, ans * 10) || eq(v * 10, ans)) return 'Kết quả lệch 10 lần — em xem lại vị trí dấu phẩy hoặc số chữ số 0.';
  if (eq(Math.abs(v - ans), 10)) return 'Kết quả lệch 10 — thường do nhớ/mượn sai ở hàng chục.';
  return 'Kết quả này sai do tính toán nhầm ở một bước trung gian. Em đối chiếu với lời giải để tìm bước sai.';
}

/** Phương án nhiễu cho đáp án dạng chuỗi có số: thay đổi một con số. */
function stringDistractors(ans, n) {
  const s = String(ans);
  const nums = [...s.matchAll(/-?\d+(\.\d+)?/g)];
  const out = new Set();
  if (!nums.length) return [];
  for (const delta of [1, -1, 'swap', 2, 'neg', 3]) {
    for (const m of nums) {
      let r;
      if (delta === 'swap') {
        const parts = s.split(/;\s*/);
        if (parts.length === 2) r = `${parts[1]}; ${parts[0]}`;
        else { const f = s.match(/^(-?\d+)\/(\d+)$/); if (f && f[1] !== '0') r = `${f[2]}/${f[1]}`; }
      } else if (delta === 'neg') {
        r = s.slice(0, m.index) + String(-Number(m[0])) + s.slice(m.index + m[0].length);
      } else {
        r = s.slice(0, m.index) + String(Number(m[0]) + delta) + s.slice(m.index + m[0].length);
      }
      if (r && /^-?\d+\/-?\d+$/.test(r)) { const [a, b] = r.split('/').map(Number); r = b ? fstr(F(a, b)) : null; }
      if (r && r !== s && !/\/0(?!\d)/.test(r)) out.add(r);
      if (out.size >= n) return [...out];
    }
  }
  return [...out];
}

/**
 * Sinh một bài tập hoàn chỉnh từ chủ đề.
 * @returns {{question, kind, choices, correct_index, final_answer, answer_key, solution, method, choice_explanations, gen}}
 */
export function generateOffline(topic, difficulty, kind, { thinking = false } = {}) {
  const d = Math.max(1, Math.min(5, difficulty));
  const fn = GENERATORS[topic.gen] || GENERATORS.add_sub;
  let g;
  for (let i = 0; i < 5; i++) {
    try { g = fn(topic.p || {}, d); if (g && g.q && g.ans !== undefined && !Number.isNaN(g.ans)) break; } catch { g = null; }
  }
  if (!g) g = GENERATORS.add_sub({ max: 100 }, d);
  const tex = g.tex || toTex(g.ans);
  // đáp án nhiễu dùng cùng "khuôn" với đáp án đúng (giữ đơn vị, "x = ...", ...)
  const shape = typeof g.ans === 'number' && tex.includes(vn(g.ans))
    ? (v) => (typeof v === 'number' ? tex.replace(vn(g.ans), vn(v)) : toTex(v))
    : typeof g.ans === 'string' && g.tex && g.tex.includes(g.ans)
      ? (v) => g.tex.replace(g.ans, String(v))
      : toTex;
  const base = {
    question: cleanMixed(g.q),
    final_answer: tex,
    answer_key: String(g.ans),
    solution: plainText(g.sol),
    method: plainText(g.method),
    gen: { key: topic.gen, p: topic.p || {} },
  };
  if (kind === 'essay') {
    return { ...base, kind: 'essay', choices: [], correct_index: -1, choice_explanations: [],
      question: base.question + (thinking ? '\n\n*Trình bày lời giải đầy đủ, giải thích vì sao em chọn cách làm đó.*' : '\n\n*Trình bày lời giải vào vở.*') };
  }
  const seen = new Set([tex]);
  const opts = [];
  const add = (v, why) => {
    if (opts.length >= 3 || String(v) === String(g.ans)) return;
    const t = shape(v);
    if (seen.has(t)) return;
    seen.add(t);
    opts.push([t, plainText(why || 'Kết quả này sai do tính toán nhầm. Hãy kiểm tra lại từng bước.')]);
  };
  for (const [v, why] of g.wrongs || []) add(v, why);
  if (typeof g.ans === 'number') for (const v of numericDistractors(g.ans, 8)) add(v, whyNumeric(v, g.ans));
  else for (const v of stringDistractors(g.ans, 6)) add(v);
  if (opts.length < 2) {
    // không đủ phương án nhiễu hợp lý (ví dụ đáp án dạng chữ) → chuyển thành tự luận
    return generateOffline(topic, difficulty, 'essay', { thinking });
  }
  const all = [[tex, null], ...opts];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return {
    ...base,
    kind: 'mcq',
    choices: all.map(([t]) => `$${t}$`),
    correct_index: all.findIndex(([, w]) => w === null),
    choice_explanations: all.map(([, w]) => w || 'Đây là đáp án đúng.'),
  };
}
