// Ngân hàng mẫu bài tự luận có lời văn, nhiều bước, cần suy luận — soạn theo các DẠNG BÀI
// điển hình trong SGK, sách bài tập, vở bài tập, bài tập cuối tuần và đề kiểm tra
// (bộ "Kết nối tri thức với cuộc sống"). Mỗi mẫu có tham số ngẫu nhiên nên mỗi lần ra đề
// số liệu và bối cảnh đều khác. Lời giải trình bày theo kiểu "Bài giải … Đáp số" như vở học sinh.
//
// Mỗi mẫu: { id, grades:[từ, đến], gens:[generator chủ đề], d:[độ khó từ, đến], think?, make() }
// make() trả về { q, ans, tex, sol, method } (ans: số, hoặc chuỗi "a; b" khi nhiều kết quả).

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => (a * b) / gcd(a, b);
const rd = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;
const C = (n, k) => { let x = 1; for (let i = 0; i < k; i++) x = (x * (n - i)) / (i + 1); return x; };

/** Số dạng văn bản Việt Nam: 23,8 · 12 500 */
function n(x) {
  if (typeof x !== 'number') return String(x);
  const neg = x < 0;
  const [i, f] = String(Math.abs(rd(x, 4))).split('.');
  const ip = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i;
  return (neg ? '-' : '') + ip + (f ? ',' + f : '');
}
/** Số trong LaTeX */
const t = (x) => n(x).replace(',', '{,}').replace(/ /g, '\\,');
const u = (x, unit) => `${t(x)}\\text{ ${unit}}`;
const parts = (...xs) => xs.map((x, i) => `\\text{${'abcd'[i]}) }${x}`).join(';\\ ');
const fr = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
const ftex = ([a, b]) => (b === 1 ? `${a}` : `\\frac{${a}}{${b}}`);
const fstr = ([a, b]) => (b === 1 ? `${a}` : `${a}/${b}`);
const NAME = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Lan', 'Minh', 'Nam', 'Ngọc', 'Phong', 'Quân', 'Trang', 'Vy', 'Hùng', 'Mai'];
const two = () => { const a = pick(NAME); return [a, pick(NAME.filter((x) => x !== a))]; };
const solve = (...lines) => ['Bài giải', ...lines].join('\n');

export const WORD_PROBLEMS = [
  // ===================== LỚP 1 – 3 =====================
  { id: 'nam_nu', grades: [1, 3], gens: ['add_sub', 'word_basic', 'compare_numbers'], d: [3, 5], make() {
    const tot = R(25, 40), girl = R(10, tot - 10), boy = tot - girl;
    const diff = Math.abs(boy - girl), more = boy > girl ? 'nam nhiều hơn nữ' : boy < girl ? 'nữ nhiều hơn nam' : 'bằng nhau';
    return { q: `Lớp 2A có ${tot} học sinh, trong đó có ${girl} bạn nữ.\na) Lớp 2A có bao nhiêu bạn nam?\nb) Số bạn nam và số bạn nữ, bên nào nhiều hơn và nhiều hơn bao nhiêu bạn?`,
      ans: `${boy}; ${diff}`, tex: parts(`${boy}\\text{ bạn nam}`, `${diff}\\text{ bạn}`),
      sol: solve('a) Số bạn nam của lớp 2A là:', `${tot} − ${girl} = ${boy} (bạn)`, `b) So sánh: ${boy} và ${girl} → ${more}.`, diff ? `Số bạn chênh lệch là: ${Math.max(boy, girl)} − ${Math.min(boy, girl)} = ${diff} (bạn)` : 'Hai bên bằng nhau.', `Đáp số: a) ${boy} bạn nam; b) ${diff} bạn.`),
      method: 'Biết tổng và một phần → phần còn lại = tổng − phần đã biết. "Nhiều hơn bao nhiêu" → lấy số lớn trừ số bé.' };
  } },
  { id: 'xe_buyt', grades: [1, 3], gens: ['add_sub', 'word_basic'], d: [3, 5], make(d) {
    const a = R(20, 45), b = R(5, 15), c = R(3, 12), e = d >= 5 ? R(2, 9) : 0;
    const r1 = a - b + c, r2 = r1 - e;
    return { q: `Trên xe buýt có ${a} người. Đến bến thứ nhất có ${b} người xuống và ${c} người lên xe.${e ? ` Đến bến thứ hai có ${e} người xuống, không ai lên.` : ''} Hỏi lúc đó trên xe có bao nhiêu người?`,
      ans: r2, tex: u(r2, 'người'),
      sol: solve('Số người còn trên xe sau khi ' + b + ' người xuống là:', `${a} − ${b} = ${a - b} (người)`, `Số người trên xe sau khi ${c} người lên là:`, `${a - b} + ${c} = ${r1} (người)`, ...(e ? ['Số người trên xe sau bến thứ hai là:', `${r1} − ${e} = ${r2} (người)`] : []), `Đáp số: ${r2} người.`),
      method: 'Làm lần lượt từng bước theo diễn biến: "xuống" thì trừ, "lên" thì cộng. Có thể viết gộp thành một biểu thức rồi tính.' };
  } },
  { id: 'tim_x_cong_tru', grades: [2, 3], gens: ['add_sub'], d: [3, 5], make() {
    const a = R(15, 60), x1 = R(10, 80), b = a + x1, c = R(10, 40), x2 = R(20, 90), e = x2 - c;
    return { q: `Tìm x:\na) x + ${a} = ${b}\nb) x − ${c} = ${e}`, ans: `${x1}; ${x2}`, tex: parts(`x = ${x1}`, `x = ${x2}`),
      sol: ['a) x + ' + a + ' = ' + b, `x = ${b} − ${a}`, `x = ${x1}`, `b) x − ${c} = ${e}`, `x = ${e} + ${c}`, `x = ${x2}`].join('\n'),
      method: 'Muốn tìm số hạng chưa biết, lấy tổng trừ số hạng đã biết. Muốn tìm số bị trừ, lấy hiệu cộng với số trừ.' };
  } },
  { id: 'gio_lam_bai', grades: [1, 4], gens: ['clock'], d: [3, 5], make() {
    const h = R(7, 9), m = pick([0, 15, 30]), dur = pick([30, 45, 60, 75, 90]);
    const end = h * 60 + m + dur, eh = Math.floor(end / 60), em = end % 60;
    return { q: `${pick(NAME)} bắt đầu làm bài tập lúc ${h} giờ${m ? ' ' + m + ' phút' : ''} và làm hết ${dur} phút. Hỏi bạn làm xong lúc mấy giờ? (viết dạng giờ:phút)`, ans: `${eh}:${String(em).padStart(2, '0')}`, tex: `${eh}\\text{ giờ }${em}\\text{ phút}`,
      sol: solve(`Đổi ${dur} phút = ${Math.floor(dur / 60)} giờ ${dur % 60} phút.`, `Thời điểm làm xong là: ${h} giờ ${m} phút + ${Math.floor(dur / 60)} giờ ${dur % 60} phút = ${eh} giờ ${em} phút.`, `Đáp số: ${eh} giờ ${em} phút.`),
      method: 'Cộng giờ với giờ, phút với phút; nếu số phút từ 60 trở lên thì đổi 60 phút = 1 giờ.' };
  } },
  { id: 'tinh_nguoc', grades: [2, 5], gens: ['add_sub', 'mul_div', 'times_more', 'expr_order'], d: [5, 5], think: true, make(d, g) {
    const nm = pick(NAME);
    if (g <= 2) { const x = R(10, 40), a = R(5, 20), b = R(5, 20), r = x + a - b;
      return { q: `${nm} nghĩ ra một số. Lấy số đó cộng với ${a} rồi trừ đi ${b} thì được ${r}. Tìm số ${nm} đã nghĩ.`, ans: x, tex: `${x}`,
        sol: solve(`Trước khi trừ ${b}, kết quả là: ${r} + ${b} = ${r + b}`, `Số ${nm} nghĩ là: ${r + b} − ${a} = ${x}`, `Thử lại: ${x} + ${a} − ${b} = ${r} ✓`, `Đáp số: ${x}.`), method: 'Tính ngược từ cuối lên: phép cộng đổi thành phép trừ, phép trừ đổi thành phép cộng.' }; }
    const x = R(3, 25), a = R(2, 15), b = R(2, 6), c = R(1, 20), r = (x + a) * b - c;
    return { q: `${nm} nghĩ ra một số. Lấy số đó cộng với ${a}, được bao nhiêu nhân với ${b}, rồi trừ đi ${c} thì được ${r}. Tìm số ${nm} đã nghĩ.`, ans: x, tex: `${x}`,
      sol: solve(`Trước khi trừ ${c}: ${r} + ${c} = ${r + c}`, `Trước khi nhân ${b}: ${r + c} : ${b} = ${(r + c) / b}`, `Số đã nghĩ: ${(r + c) / b} − ${a} = ${x}`, `Thử lại: (${x} + ${a}) × ${b} − ${c} = ${r} ✓`, `Đáp số: ${x}.`),
      method: 'Phương pháp tính ngược từ cuối: đi ngược từng bước và dùng phép tính ngược lại (cộng ↔ trừ, nhân ↔ chia).' };
  } },
  { id: 'trong_cay', grades: [3, 6], gens: ['add_sub', 'mul_div', 'rect', 'polyline', 'segments', 'sets_basic'], d: [5, 5], think: true, make() {
    const k = pick([3, 4, 5, 6]), seg = R(15, 40), L = k * seg, both = Math.random() < 0.5;
    const one = both ? seg + 1 : seg - 1, tot = one * 2;
    return { q: `Người ta trồng cây ở hai bên một con đường dài ${L} m, cây nọ cách cây kia ${k} m${both ? ', ở cả hai đầu đường đều có trồng cây' : ', ở hai đầu đường không trồng cây (vì có cột điện)'}. Hỏi cần tất cả bao nhiêu cây?`,
      ans: tot, tex: u(tot, 'cây'),
      sol: solve('Số khoảng cách trên một bên đường là:', `${L} : ${k} = ${seg} (khoảng)`, `Số cây trồng ở một bên đường là:`, `${seg} ${both ? '+' : '−'} 1 = ${one} (cây)`, `Số cây trồng ở hai bên đường là:`, `${one} × 2 = ${tot} (cây)`, `Đáp số: ${tot} cây.`),
      method: 'Bài toán trồng cây: số khoảng = chiều dài : khoảng cách. Hai đầu đều trồng: số cây = số khoảng + 1; hai đầu không trồng: số cây = số khoảng − 1. Trồng hai bên thì nhân 2.' };
  } },
  { id: 'rut_ve_don_vi', grades: [3, 5], gens: ['mul_div', 'times_more', 'word_basic', 'proportion'], d: [3, 5], make(d) {
    const per = R(4, 25), a = R(3, 8), b = R(4, 12), tot = per * a;
    if (d >= 5) { const need = per * b;
      return { q: `Có ${tot} lít dầu đựng đều vào ${a} can. Hỏi muốn đựng ${need} lít dầu thì cần bao nhiêu can như thế?`, ans: b, tex: u(b, 'can'),
        sol: solve('Mỗi can đựng được số lít dầu là:', `${tot} : ${a} = ${per} (l)`, `Số can cần để đựng ${need} lít dầu là:`, `${need} : ${per} = ${b} (can)`, `Đáp số: ${b} can.`), method: 'Rút về đơn vị: tìm giá trị của một phần (chia), rồi tìm số phần (chia tiếp).' }; }
    return { q: `${a} thùng như nhau chứa tất cả ${tot} quyển vở. Hỏi ${b} thùng như thế chứa bao nhiêu quyển vở?`, ans: per * b, tex: u(per * b, 'quyển vở'),
      sol: solve('Mỗi thùng chứa số quyển vở là:', `${tot} : ${a} = ${per} (quyển)`, `${b} thùng chứa số quyển vở là:`, `${per} × ${b} = ${per * b} (quyển)`, `Đáp số: ${per * b} quyển vở.`), method: 'Bài toán rút về đơn vị: bước 1 tìm giá trị của một đơn vị (phép chia), bước 2 tìm giá trị của nhiều đơn vị (phép nhân).' };
  } },
  { id: 'mot_phan_may', grades: [3, 4], gens: ['mul_div', 'times_more', 'word_basic'], d: [3, 5], make(d) {
    const k = pick([3, 4, 5, 6]), a = k * R(8, 30), sold = a / k, left = a - sold;
    const k2 = 2, sold2 = d >= 5 && left % k2 === 0 ? left / k2 : 0;
    return { q: `Một cửa hàng có ${a} kg gạo. Buổi sáng bán được $\\frac{1}{${k}}$ số gạo${sold2 ? ', buổi chiều bán được một nửa số gạo còn lại' : ''}. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo?`, ans: left - sold2, tex: u(left - sold2, 'kg'),
      sol: solve('Số gạo bán buổi sáng là:', `${a} : ${k} = ${sold} (kg)`, 'Số gạo còn lại sau buổi sáng là:', `${a} − ${sold} = ${left} (kg)`, ...(sold2 ? ['Số gạo bán buổi chiều là:', `${left} : 2 = ${sold2} (kg)`, 'Số gạo còn lại là:', `${left} − ${sold2} = ${left - sold2} (kg)`] : []), `Đáp số: ${left - sold2} kg gạo.`),
      method: 'Tìm một phần mấy của một số: lấy số đó chia cho số phần. "Còn lại" → lấy số ban đầu trừ phần đã bán. Chú ý "số còn lại" là tính trên phần đã còn lại, không phải số ban đầu.' };
  } },
  { id: 'vuon_rao', grades: [3, 5], gens: ['rect', 'area'], d: [3, 5], make() {
    const w = R(5, 15), k = R(2, 4), l = w * k, P = 2 * (l + w), g = R(2, 4);
    return { q: `Một mảnh vườn hình chữ nhật có chiều rộng ${w} m, chiều dài gấp ${k} lần chiều rộng.\na) Tính chu vi mảnh vườn.\nb) Người ta rào xung quanh vườn, chừa một lối vào rộng ${g} m. Tính chiều dài hàng rào.\nc) Tính diện tích mảnh vườn.`,
      ans: `${P}; ${P - g}; ${l * w}`, tex: parts(u(P, 'm'), u(P - g, 'm'), `${l * w}\\text{ m}^2`),
      sol: solve('Chiều dài mảnh vườn là:', `${w} × ${k} = ${l} (m)`, 'a) Chu vi mảnh vườn là:', `(${l} + ${w}) × 2 = ${P} (m)`, 'b) Chiều dài hàng rào là:', `${P} − ${g} = ${P - g} (m)`, 'c) Diện tích mảnh vườn là:', `${l} × ${w} = ${l * w} (m²)`, `Đáp số: a) ${P} m; b) ${P - g} m; c) ${l * w} m².`),
      method: 'Tìm chiều dài trước (gấp lên → nhân). Chu vi = (dài + rộng) × 2; diện tích = dài × rộng. Hàng rào chừa lối vào thì trừ bớt độ rộng lối vào.' };
  } },
  { id: 'bieu_thuc_2y', grades: [3, 4], gens: ['expr_order'], d: [3, 5], make() {
    const b = R(2, 9), c = R(10, 60), a = b * c + R(20, 400), e = R(2, 9), f = R(20, 99), h = R(2, 5);
    const v1 = a - b * c, v2 = (f + e * 10) * h;
    return { q: `Tính giá trị của biểu thức:\na) ${a} − ${b} × ${c}\nb) (${f} + ${e * 10}) × ${h}`, ans: `${v1}; ${v2}`, tex: parts(t(v1), t(v2)),
      sol: [`a) ${a} − ${b} × ${c} = ${a} − ${b * c} = ${v1}`, `b) (${f} + ${e * 10}) × ${h} = ${f + e * 10} × ${h} = ${v2}`].join('\n'),
      method: 'Biểu thức không có ngoặc: nhân, chia trước; cộng, trừ sau. Có ngoặc: tính trong ngoặc trước.' };
  } },
  { id: 'di_cho', grades: [2, 5], gens: ['word_basic', 'mul_div', 'decimal'], d: [3, 5], make() {
    const kg = R(2, 4), p1 = R(3, 9) * 5000, box = R(2, 6), p2 = R(5, 15) * 1000, tot = kg * p1 + box * p2, pay = Math.ceil(tot / 50000) * 50000 + (tot % 50000 === 0 ? 50000 : 0);
    return { q: `Mẹ mua ${kg} kg táo, giá ${n(p1)} đồng một ki-lô-gam, và ${box} hộp sữa, giá ${n(p2)} đồng một hộp. Mẹ đưa cho cô bán hàng ${n(pay)} đồng. Hỏi cô bán hàng phải trả lại mẹ bao nhiêu tiền?`, ans: pay - tot, tex: u(pay - tot, 'đồng'),
      sol: solve('Số tiền mua táo là:', `${n(p1)} × ${kg} = ${n(kg * p1)} (đồng)`, 'Số tiền mua sữa là:', `${n(p2)} × ${box} = ${n(box * p2)} (đồng)`, 'Mẹ phải trả tất cả là:', `${n(kg * p1)} + ${n(box * p2)} = ${n(tot)} (đồng)`, 'Số tiền cô bán hàng trả lại mẹ là:', `${n(pay)} − ${n(tot)} = ${n(pay - tot)} (đồng)`, `Đáp số: ${n(pay - tot)} đồng.`),
      method: 'Tính tiền từng loại hàng (đơn giá × số lượng), cộng lại thành tổng tiền phải trả, rồi lấy tiền đưa trừ tổng tiền.' };
  } },
  { id: 'cuon_day', grades: [3, 4], gens: ['unit_convert'], d: [3, 5], make() {
    const m = R(3, 9), seg = pick([15, 20, 25, 30, 40, 45]), k = R(3, Math.floor((m * 100) / seg) - 1), left = m * 100 - k * seg;
    return { q: `Một cuộn dây dài ${m} m. Người ta cắt ra ${k} đoạn, mỗi đoạn dài ${seg} cm. Hỏi cuộn dây còn lại bao nhiêu xăng-ti-mét?`, ans: left, tex: u(left, 'cm'),
      sol: solve(`Đổi: ${m} m = ${m * 100} cm`, 'Số xăng-ti-mét dây đã cắt là:', `${seg} × ${k} = ${seg * k} (cm)`, 'Cuộn dây còn lại số xăng-ti-mét là:', `${m * 100} − ${seg * k} = ${left} (cm)`, `Đáp số: ${left} cm.`),
      method: 'Đổi về cùng một đơn vị đo trước khi tính (1 m = 100 cm).' };
  } },

  // ===================== LỚP 4 =====================
  { id: 'tbc_can_nang', grades: [4, 5], gens: ['avg_sum_diff', 'stats_mean'], d: [3, 5], make(d) {
    const [a, b] = two(), c = pick(NAME.filter((x) => x !== a && x !== b));
    const avg = R(28, 34), w1 = R(25, 36), w2 = R(25, 36), w3 = 3 * avg - w1 - w2;
    if (w3 < 22 || w3 > 42) return null;
    if (d >= 5) { const w4 = avg + R(3, 8) * 4 - 0; const avg2 = (w1 + w2 + w3 + w4) / 4; if (!Number.isInteger(avg2)) return null;
      return { q: `Trung bình cân nặng của ba bạn ${a}, ${b}, ${c} là ${avg} kg. Khi có thêm bạn ${pick(NAME)} thì trung bình cân nặng của bốn bạn là ${avg2} kg. Hỏi bạn mới đến nặng bao nhiêu ki-lô-gam?`, ans: w4, tex: u(w4, 'kg'),
        sol: solve('Tổng cân nặng của ba bạn là:', `${avg} × 3 = ${avg * 3} (kg)`, 'Tổng cân nặng của bốn bạn là:', `${avg2} × 4 = ${avg2 * 4} (kg)`, 'Bạn mới đến nặng là:', `${avg2 * 4} − ${avg * 3} = ${w4} (kg)`, `Đáp số: ${w4} kg.`),
        method: 'Từ trung bình cộng suy ra tổng: tổng = trung bình cộng × số các số hạng. So sánh hai tổng để tìm số hạng thêm vào.' }; }
    return { q: `Ba bạn ${a}, ${b}, ${c} có cân nặng trung bình là ${avg} kg. Bạn ${a} nặng ${w1} kg, bạn ${b} nặng ${w2} kg. Hỏi bạn ${c} nặng bao nhiêu ki-lô-gam?`, ans: w3, tex: u(w3, 'kg'),
      sol: solve('Tổng cân nặng của ba bạn là:', `${avg} × 3 = ${avg * 3} (kg)`, `Bạn ${c} nặng là:`, `${avg * 3} − ${w1} − ${w2} = ${w3} (kg)`, `Đáp số: ${w3} kg.`), method: 'Tổng = trung bình cộng × số các số hạng; số hạng chưa biết = tổng − các số hạng đã biết.' };
  } },
  { id: 'tong_hieu_ruong', grades: [4, 5], gens: ['avg_sum_diff', 'large_numbers', 'add_sub'], d: [3, 5], make() {
    const small = R(15, 60) * 10, D = R(5, 30) * 10, big = small + D, S = big + small;
    return { q: `Hai thửa ruộng thu hoạch được tất cả ${n(S)} kg thóc. Thửa ruộng thứ nhất thu hoạch được nhiều hơn thửa ruộng thứ hai ${D} kg thóc. Hỏi mỗi thửa ruộng thu hoạch được bao nhiêu ki-lô-gam thóc?`,
      ans: `${big}; ${small}`, tex: `\\text{Thửa 1: }${u(big, 'kg')};\\ \\text{thửa 2: }${u(small, 'kg')}`,
      sol: solve('Thửa ruộng thứ nhất thu hoạch được là:', `(${n(S)} + ${D}) : 2 = ${n(big)} (kg)`, 'Thửa ruộng thứ hai thu hoạch được là:', `${n(big)} − ${D} = ${n(small)} (kg)`, `Đáp số: Thửa thứ nhất: ${n(big)} kg; thửa thứ hai: ${n(small)} kg.`),
      method: 'Tìm hai số khi biết tổng và hiệu: số lớn = (tổng + hiệu) : 2; số bé = số lớn − hiệu (hoặc (tổng − hiệu) : 2). Nên vẽ sơ đồ đoạn thẳng.' };
  } },
  { id: 'tong_hieu_hcn', grades: [4, 5], gens: ['avg_sum_diff', 'rect', 'area'], d: [4, 5], think: true, make() {
    const w = R(6, 25), D = R(2, 12) * 2, l = w + D, P = 2 * (l + w);
    return { q: `Một hình chữ nhật có chu vi ${P} cm, chiều dài hơn chiều rộng ${D} cm. Tính diện tích hình chữ nhật đó.`, ans: l * w, tex: `${l * w}\\text{ cm}^2`,
      sol: solve('Nửa chu vi hình chữ nhật là:', `${P} : 2 = ${l + w} (cm)`, 'Chiều dài hình chữ nhật là:', `(${l + w} + ${D}) : 2 = ${l} (cm)`, 'Chiều rộng hình chữ nhật là:', `${l} − ${D} = ${w} (cm)`, 'Diện tích hình chữ nhật là:', `${l} × ${w} = ${l * w} (cm²)`, `Đáp số: ${l * w} cm².`),
      method: 'Nửa chu vi = dài + rộng (là "tổng"), dài − rộng là "hiệu" → đưa về bài toán tổng – hiệu, rồi tính diện tích.' };
  } },
  { id: 'ga_cho', grades: [4, 9], gens: ['avg_sum_diff', 'linear_eq', 'system2'], d: [5, 5], think: true, make(d, g) {
    const ga = R(5, 30), cho = R(3, 20), con = ga + cho, chan = 2 * ga + 4 * cho;
    if (g >= 8) return { q: `Vừa gà vừa chó có ${con} con, đếm được tất cả ${chan} chân. Hỏi có bao nhiêu con gà, bao nhiêu con chó? (Giải bằng cách lập ${g >= 9 ? 'hệ phương trình' : 'phương trình'}; ghi: số gà; số chó)`, ans: `${ga}; ${cho}`, tex: `${ga}\\text{ con gà};\\ ${cho}\\text{ con chó}`,
      sol: ['Lời giải', g >= 9 ? `Gọi số gà là x, số chó là y (x, y nguyên dương). Ta có hệ: x + y = ${con}; 2x + 4y = ${chan}.` : `Gọi số gà là x (con), 0 < x < ${con}, x nguyên. Số chó là ${con} − x.`, g >= 9 ? `Từ phương trình đầu: x = ${con} − y. Thế vào: 2(${con} − y) + 4y = ${chan} ⇔ 2y = ${chan - 2 * con} ⇔ y = ${cho}; x = ${ga}.` : `Số chân: 2x + 4(${con} − x) = ${chan} ⇔ ${4 * con} − 2x = ${chan} ⇔ x = ${ga}.`, `Vậy có ${ga} con gà và ${cho} con chó (thỏa mãn điều kiện).`].join('\n'),
      method: 'Chọn ẩn là số gà (và số chó), lập phương trình từ tổng số con và tổng số chân, giải rồi đối chiếu điều kiện.' };
    return { q: `Vừa gà vừa chó có ${con} con, đếm được tất cả ${chan} chân. Hỏi có bao nhiêu con gà, bao nhiêu con chó? (ghi: số gà; số chó)`, ans: `${ga}; ${cho}`, tex: `${ga}\\text{ con gà};\\ ${cho}\\text{ con chó}`,
      sol: solve('Giả sử tất cả đều là gà thì số chân là:', `${con} × 2 = ${con * 2} (chân)`, 'Số chân bị hụt so với thực tế là:', `${chan} − ${con * 2} = ${chan - con * 2} (chân)`, 'Mỗi con chó hơn mỗi con gà số chân là:', '4 − 2 = 2 (chân)', 'Số con chó là:', `${chan - con * 2} : 2 = ${cho} (con)`, 'Số con gà là:', `${con} − ${cho} = ${ga} (con)`, `Đáp số: ${ga} con gà; ${cho} con chó.`),
      method: 'Phương pháp giả thiết tạm: giả sử tất cả là một loại, tính phần chênh lệch so với thực tế, rồi chia cho chênh lệch của mỗi con.' };
  } },
  { id: 'ban_duong_phan_so', grades: [4, 7], gens: ['fraction', 'ratio_sum'], d: [3, 5], make(d) {
    const p = pick([[2, 5], [1, 4], [3, 8], [1, 3], [2, 7]]), q = pick([[1, 3], [1, 2], [2, 5], [3, 4]]);
    const base = p[1] * q[1] * R(2, 8) * (d >= 5 ? 2 : 1);
    const s1 = (base * p[0]) / p[1], rem = base - s1, s2 = (rem * q[0]) / q[1], left = rem - s2;
    if (!Number.isInteger(s2)) return null;
    return { q: `Một cửa hàng có ${base} kg đường. Ngày thứ nhất bán được $\\frac{${p[0]}}{${p[1]}}$ số đường, ngày thứ hai bán được $\\frac{${q[0]}}{${q[1]}}$ số đường còn lại. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam đường?`, ans: left, tex: u(left, 'kg'),
      sol: solve('Ngày thứ nhất bán được số đường là:', `${base} × ${p[0]}/${p[1]} = ${s1} (kg)`, 'Số đường còn lại sau ngày thứ nhất là:', `${base} − ${s1} = ${rem} (kg)`, 'Ngày thứ hai bán được số đường là:', `${rem} × ${q[0]}/${q[1]} = ${s2} (kg)`, 'Cửa hàng còn lại số đường là:', `${rem} − ${s2} = ${left} (kg)`, `Đáp số: ${left} kg đường.`),
      method: 'Tìm phân số của một số: lấy số đó nhân với phân số. Chú ý "số còn lại" ở ngày thứ hai được tính trên phần còn lại, không phải trên số đường ban đầu.' };
  } },
  { id: 'tim_x_phan_so', grades: [4, 7], gens: ['fraction'], d: [3, 5], make() {
    const a = fr(R(1, 5), R(2, 6)), x1 = fr(R(1, 9), R(2, 8)), b = fr(a[0] * x1[1] + x1[0] * a[1], a[1] * x1[1]);
    const c = fr(R(2, 7), R(2, 5)), x2 = fr(R(1, 7), R(2, 6)), e = fr(c[0] * x2[0], c[1] * x2[1]);
    return { q: `Tìm x:\na) $x + ${ftex(a)} = ${ftex(b)}$\nb) $x \\times ${ftex(c)} = ${ftex(e)}$`, ans: `${fstr(x1)}; ${fstr(x2)}`, tex: parts(`x = ${ftex(x1)}`, `x = ${ftex(x2)}`),
      sol: [`a) x = ${fstr(b)} − ${fstr(a)}`, `x = ${fstr(x1)}`, `b) x = ${fstr(e)} : ${fstr(c)} = ${fstr(e)} × ${fstr([c[1], c[0]])}`, `x = ${fstr(x2)}`].join('\n'),
      method: 'Tìm số hạng chưa biết: lấy tổng trừ số hạng đã biết (quy đồng mẫu số). Tìm thừa số chưa biết: lấy tích chia cho thừa số đã biết (nhân với phân số đảo ngược).' };
  } },
  { id: 'xep_hang_bcnn', grades: [4, 6], gens: ['divisibility', 'gcd_lcm'], d: [4, 5], think: true, make() {
    const [a, b, c] = pick([[2, 3, 5], [3, 4, 5], [4, 6, 9], [10, 12, 15], [12, 15, 18], [6, 8, 10]]);
    const L = lcm(lcm(a, b), c), k = R(2, 6), lo = L * k - R(1, L - 2), hi = lo + L - 1, ans = L * k + 1;
    return { q: `Số học sinh khối 6 của một trường khi xếp hàng ${a}, hàng ${b}, hàng ${c} đều thừa 1 bạn. Biết số học sinh trong khoảng từ ${lo + 1} đến ${hi + 1}. Tính số học sinh khối 6.`, ans, tex: u(ans, 'học sinh'),
      sol: solve(`Gọi số học sinh là x. Vì xếp hàng ${a}, ${b}, ${c} đều thừa 1 nên x − 1 chia hết cho ${a}, ${b}, ${c}, tức x − 1 là bội chung của ${a}, ${b}, ${c}.`, `BCNN(${a}, ${b}, ${c}) = ${L} ⇒ x − 1 ∈ {0; ${L}; ${2 * L}; ${3 * L}; …}.`, `Vì ${lo + 1} ≤ x ≤ ${hi + 1} nên ${lo} ≤ x − 1 ≤ ${hi} ⇒ x − 1 = ${L * k} ⇒ x = ${ans}.`, `Đáp số: ${ans} học sinh.`),
      method: '"Xếp hàng … đều thừa r" ⇒ (số cần tìm − r) là bội chung. Tìm BCNN rồi liệt kê bội chung trong khoảng cho trước.' };
  } },
  { id: 'binh_hanh_thu_hoach', grades: [4, 5], gens: ['area'], d: [3, 5], make() {
    const a = R(4, 12) * 3, h = (a / 3) * 2, rate = pick([2, 3, 4]), S = a * h;
    return { q: `Một mảnh đất hình bình hành có độ dài đáy ${a} m, chiều cao bằng $\\frac{2}{3}$ độ dài đáy. Trên mảnh đất đó người ta trồng rau, trung bình cứ 1 m² thu được ${rate} kg rau. Hỏi thu được tất cả bao nhiêu ki-lô-gam rau?`, ans: S * rate, tex: u(S * rate, 'kg'),
      sol: solve('Chiều cao mảnh đất là:', `${a} × 2/3 = ${h} (m)`, 'Diện tích mảnh đất là:', `${a} × ${h} = ${S} (m²)`, 'Số ki-lô-gam rau thu được là:', `${S} × ${rate} = ${S * rate} (kg)`, `Đáp số: ${S * rate} kg rau.`),
      method: 'Tìm chiều cao (phân số của một số), tính diện tích hình bình hành = đáy × chiều cao, rồi nhân với năng suất trên 1 m².' };
  } },

  // ===================== LỚP 5 =====================
  { id: 'tim_x_thap_phan', grades: [5, 6], gens: ['decimal'], d: [3, 5], make() {
    const a = rd(R(105, 495) / 10, 1), x1 = rd(R(105, 495) / 10, 1), b = rd(a + x1, 1);
    const c = pick([1.5, 2.5, 4.5, 0.25, 1.2, 3.6]), x2 = rd(R(12, 95) / 10, 1), e = rd(c * x2, 4);
    return { q: `Tìm x:\na) x + ${n(a)} = ${n(b)}\nb) x × ${n(c)} = ${n(e)}`, ans: `${x1}; ${x2}`, tex: parts(`x = ${t(x1)}`, `x = ${t(x2)}`),
      sol: [`a) x = ${n(b)} − ${n(a)}`, `x = ${n(x1)}`, `b) x = ${n(e)} : ${n(c)}`, `x = ${n(x2)}`].join('\n'),
      method: 'Tìm số hạng chưa biết: lấy tổng trừ số hạng đã biết. Tìm thừa số chưa biết: lấy tích chia cho thừa số đã biết. Đặt tính thẳng hàng dấu phẩy.' };
  } },
  { id: 'phan_tram_con_lai', grades: [5, 7], gens: ['percent'], d: [3, 5], make(d) {
    if (d >= 5) { const a = R(2, 9) * 1000, p = pick([10, 20, 30, 40]), q = pick([20, 25, 40, 50]);
      const s1 = (a * p) / 100, rem = a - s1, s2 = (rem * q) / 100, left = rem - s2;
      return { q: `Một cửa hàng nhập về ${n(a)} kg gạo. Ngày thứ nhất bán được ${p}% số gạo, ngày thứ hai bán được ${q}% số gạo còn lại. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo? Số gạo còn lại bằng bao nhiêu phần trăm số gạo nhập về?`, ans: `${left}; ${rd((left / a) * 100, 2)}`, tex: `${u(left, 'kg')};\\ ${t(rd((left / a) * 100, 2))}\\%`,
        sol: solve('Ngày thứ nhất bán được số gạo là:', `${n(a)} × ${p} : 100 = ${n(s1)} (kg)`, 'Số gạo còn lại sau ngày thứ nhất là:', `${n(a)} − ${n(s1)} = ${n(rem)} (kg)`, 'Ngày thứ hai bán được số gạo là:', `${n(rem)} × ${q} : 100 = ${n(s2)} (kg)`, 'Số gạo còn lại là:', `${n(rem)} − ${n(s2)} = ${n(left)} (kg)`, 'Tỉ số phần trăm số gạo còn lại so với số gạo nhập về là:', `${n(left)} : ${n(a)} = ${n(rd(left / a, 4))} = ${n(rd((left / a) * 100, 2))}%`, `Đáp số: ${n(left)} kg; ${n(rd((left / a) * 100, 2))}%.`),
        method: 'Tìm p% của một số: lấy số đó × p : 100. Chú ý ngày thứ hai tính % trên SỐ CÒN LẠI. Tìm tỉ số phần trăm của a và b: a : b rồi nhân 100 và viết thêm %.' }; }
    const a = R(2, 12) * 100, p = pick([15, 20, 25, 30, 35, 40, 45, 60]), s = (a * p) / 100;
    return { q: `Một cửa hàng nhập về ${a} kg gạo. Buổi sáng cửa hàng bán được ${p}% số gạo đó. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo?`, ans: a - s, tex: u(a - s, 'kg'),
      sol: solve('Số ki-lô-gam gạo cửa hàng bán được trong buổi sáng là:', `${a} × ${p} : 100 = ${s} (kg)`, 'Số ki-lô-gam gạo cửa hàng còn lại là:', `${a} − ${s} = ${a - s} (kg)`, `Đáp số: ${a - s} kg gạo.`),
      method: 'Tìm p% của một số: lấy số đó nhân với p rồi chia cho 100. Cách khác: số gạo còn lại chiếm (100 − p)%.' };
  } },
  { id: 'phan_tram_lop', grades: [5, 7], gens: ['percent', 'ratio_sum'], d: [3, 5], make() {
    const tot = pick([20, 25, 32, 40, 36, 45, 48, 50]), girl = R(Math.ceil(tot * 0.35), Math.floor(tot * 0.65)), pg = rd((girl / tot) * 100, 2);
    if (!Number.isInteger(pg * 4)) return null;
    return { q: `Lớp 5A có ${tot} học sinh, trong đó có ${girl} học sinh nữ.\na) Số học sinh nữ chiếm bao nhiêu phần trăm số học sinh cả lớp?\nb) Số học sinh nam chiếm bao nhiêu phần trăm số học sinh cả lớp?`, ans: `${pg}; ${rd(100 - pg, 2)}`, tex: parts(`${t(pg)}\\%`, `${t(rd(100 - pg, 2))}\\%`),
      sol: solve('a) Tỉ số phần trăm của số học sinh nữ và số học sinh cả lớp là:', `${girl} : ${tot} = ${n(rd(girl / tot, 4))} = ${n(pg)}%`, 'b) Tỉ số phần trăm của số học sinh nam và số học sinh cả lớp là:', `100% − ${n(pg)}% = ${n(rd(100 - pg, 2))}%`, `Đáp số: a) ${n(pg)}%; b) ${n(rd(100 - pg, 2))}%.`),
      method: 'Tỉ số phần trăm của a và b: tìm thương a : b, nhân thương với 100 rồi viết thêm kí hiệu %. Cả lớp là 100%.' };
  } },
  { id: 'phan_tram_von', grades: [5, 7], gens: ['percent'], d: [4, 5], think: true, make() {
    const von = R(10, 60) * 50000, p = pick([10, 20, 25, 15]), ban = (von * (100 + p)) / 100;
    return { q: `Một cửa hàng bán một chiếc xe đạp với giá ${n(ban)} đồng và được lãi ${p}% so với tiền vốn. Hỏi tiền vốn của chiếc xe đạp là bao nhiêu? Cửa hàng lãi bao nhiêu tiền? (ghi: tiền vốn; tiền lãi)`, ans: `${von}; ${ban - von}`, tex: `${u(von, 'đồng')};\\ ${u(ban - von, 'đồng')}`,
      sol: solve('Coi tiền vốn là 100% thì giá bán bằng:', `100% + ${p}% = ${100 + p}% (tiền vốn)`, 'Tiền vốn của chiếc xe đạp là:', `${n(ban)} : ${100 + p} × 100 = ${n(von)} (đồng)`, 'Tiền lãi là:', `${n(ban)} − ${n(von)} = ${n(ban - von)} (đồng)`, `Đáp số: Tiền vốn ${n(von)} đồng; tiền lãi ${n(ban - von)} đồng.`),
      method: 'Lãi tính theo % TIỀN VỐN: giá bán = (100% + lãi%) × vốn. Biết giá bán, tìm vốn = giá bán : (100 + p) × 100. Không được lấy giá bán × p%.' };
  } },
  { id: 'hinh_thang_trong_hoa', grades: [5, 6], gens: ['area', 'percent'], d: [4, 5], make() {
    const b = R(5, 20), B = b + R(2, 6) * 2, h = (B + b) / 2, S = ((B + b) * h) / 2, p = pick([20, 25, 30, 40, 60]), f = rd((S * p) / 100, 2);
    return { q: `Một mảnh vườn hình thang có đáy lớn ${B} m, đáy bé ${b} m và chiều cao bằng trung bình cộng hai đáy. Người ta dành ${p}% diện tích mảnh vườn để trồng hoa. Tính diện tích phần đất trồng hoa.`, ans: f, tex: `${t(f)}\\text{ m}^2`,
      sol: solve('Chiều cao mảnh vườn là:', `(${B} + ${b}) : 2 = ${h} (m)`, 'Diện tích mảnh vườn là:', `(${B} + ${b}) × ${h} : 2 = ${n(S)} (m²)`, 'Diện tích phần đất trồng hoa là:', `${n(S)} × ${p} : 100 = ${n(f)} (m²)`, `Đáp số: ${n(f)} m².`),
      method: 'Bài toán nhiều bước: tìm chiều cao (trung bình cộng) → diện tích hình thang = (đáy lớn + đáy bé) × chiều cao : 2 → tìm p% của diện tích.' };
  } },
  { id: 'van_toc_gio_nghi', grades: [5, 6], gens: ['speed'], d: [3, 5], make() {
    const h1 = R(6, 8), m1 = pick([0, 15, 30, 45]), rest = pick([0, 15, 30]), v = R(8, 12) * 5, run = pick([1.5, 2, 2.5, 3]);
    const S = v * run, endMin = h1 * 60 + m1 + run * 60 + rest, h2 = Math.floor(endMin / 60), m2 = endMin % 60;
    return { q: `Một ô tô đi từ A lúc ${h1} giờ ${m1} phút và đến B lúc ${h2} giờ ${m2} phút${rest ? `, dọc đường ô tô nghỉ ${rest} phút` : ''}. Quãng đường AB dài ${S} km. Tính vận tốc của ô tô.`, ans: v, tex: u(v, 'km/giờ'),
      sol: solve('Thời gian ô tô đi từ A đến B (kể cả nghỉ) là:', `${h2} giờ ${m2} phút − ${h1} giờ ${m1} phút = ${Math.floor((run * 60 + rest) / 60)} giờ ${(run * 60 + rest) % 60} phút`, ...(rest ? ['Thời gian ô tô thực sự chạy là:', `${Math.floor((run * 60 + rest) / 60)} giờ ${(run * 60 + rest) % 60} phút − ${rest} phút = ${n(run)} giờ`] : [`Đổi: ${Math.floor(run)} giờ ${(run * 60) % 60} phút = ${n(run)} giờ`]), 'Vận tốc của ô tô là:', `${S} : ${n(run)} = ${v} (km/giờ)`, `Đáp số: ${v} km/giờ.`),
      method: 'Tính thời gian đi = giờ đến − giờ đi, trừ thời gian nghỉ, đổi ra giờ (số thập phân). Vận tốc = quãng đường : thời gian.' };
  } },
  { id: 'xuoi_nguoc_dong', grades: [5, 9], gens: ['speed', 'linear_eq'], d: [4, 5], think: true, make() {
    for (let i = 0; i < 50; i++) {
      const w = R(2, 4), v = R(15, 30), t1 = pick([2, 3, 4]), S = (v + w) * t1, t2 = S / (v - w);
      if (Number.isInteger(t2 * 4)) return { q: `Một ca nô đi xuôi dòng từ bến A đến bến B hết ${t1} giờ. Biết vận tốc của ca nô khi nước lặng là ${v} km/giờ và vận tốc dòng nước là ${w} km/giờ. Hỏi ca nô đi ngược dòng từ B về A hết bao nhiêu thời gian?`, ans: t2, tex: u(t2, 'giờ'),
        sol: solve('Vận tốc ca nô khi xuôi dòng là:', `${v} + ${w} = ${v + w} (km/giờ)`, 'Quãng đường AB dài là:', `${v + w} × ${t1} = ${S} (km)`, 'Vận tốc ca nô khi ngược dòng là:', `${v} − ${w} = ${v - w} (km/giờ)`, 'Thời gian ca nô đi ngược dòng là:', `${S} : ${v - w} = ${n(t2)} (giờ)`, `Đáp số: ${n(t2)} giờ.`),
        method: 'v xuôi = v thực + v nước; v ngược = v thực − v nước. Tìm quãng đường từ chiều xuôi, rồi tính thời gian chiều ngược.' };
    }
    return null;
  } },
  { id: 'be_nuoc_voi', grades: [5, 6], gens: ['volume'], d: [4, 5], make() {
    const a = pick([2, 2.5, 3, 1.5]), b = pick([1.2, 1.5, 2]), c = pick([1, 1.2, 1.5]), p = pick([60, 75, 80, 90]);
    const V = rd(a * b * c, 4), L = rd(V * 1000 * p / 100, 2), r = pick([20, 25, 30, 40, 50]), tm = rd(L / r, 2);
    if (!Number.isInteger(tm * 2)) return null;
    return { q: `Một bể nước dạng hình hộp chữ nhật có chiều dài ${n(a)} m, chiều rộng ${n(b)} m và chiều cao ${n(c)} m. Một vòi nước chảy vào bể, mỗi phút được ${r} lít. Hỏi sau bao nhiêu phút thì lượng nước trong bể đạt ${p}% thể tích bể? (Bể không có nước lúc đầu; 1 dm³ = 1 lít)`, ans: tm, tex: u(tm, 'phút'),
      sol: solve('Thể tích của bể là:', `${n(a)} × ${n(b)} × ${n(c)} = ${n(V)} (m³) = ${n(V * 1000)} dm³ = ${n(V * 1000)} lít`, `Lượng nước bằng ${p}% thể tích bể là:`, `${n(V * 1000)} × ${p} : 100 = ${n(L)} (lít)`, 'Thời gian vòi chảy là:', `${n(L)} : ${r} = ${n(tm)} (phút)`, `Đáp số: ${n(tm)} phút.`),
      method: 'V hình hộp = dài × rộng × cao. Đổi m³ sang dm³ (lít): 1 m³ = 1000 dm³. Tìm p% thể tích, rồi chia cho lưu lượng mỗi phút.' };
  } },
  { id: 'tong_ti_kho', grades: [4, 7], gens: ['ratio_sum', 'proportion', 'avg_sum_diff'], d: [3, 5], make(d) {
    const m = R(2, 5), k = m + R(1, 4), unit = R(5, 30) * 2;
    if (d >= 5) { const [a] = two(); const [mm, kk] = pick([[1, 4], [1, 3], [2, 7], [1, 5], [2, 9], [3, 10], [2, 5]]);
      const opts = []; for (let un = 1; un <= 20; un++) if (mm * un >= 6 && mm * un <= 15 && kk * un >= 26 && kk * un <= 45) opts.push(un);
      if (!opts.length) return null; const un = pick(opts), son = mm * un, mom = kk * un, dd = mom - son, yrs = R(2, 6), m = mm, k = kk;
      return { q: `Hiện nay mẹ hơn ${a} ${dd} tuổi. Biết tuổi của ${a} bằng $\\frac{${m}}{${k}}$ tuổi mẹ. Hỏi sau ${yrs} năm nữa, tổng số tuổi của hai mẹ con là bao nhiêu?`, ans: son + mom + 2 * yrs, tex: u(son + mom + 2 * yrs, 'tuổi'),
        sol: solve(`Hiệu số phần bằng nhau là: ${k} − ${m} = ${k - m} (phần)`, `Giá trị một phần là: ${dd} : ${k - m} = ${dd / (k - m)} (tuổi)`, `Tuổi ${a} hiện nay là: ${dd / (k - m)} × ${m} = ${son} (tuổi)`, `Tuổi mẹ hiện nay là: ${son} + ${dd} = ${mom} (tuổi)`, `Sau ${yrs} năm, tổng số tuổi hai mẹ con là: ${son} + ${mom} + ${yrs} × 2 = ${son + mom + 2 * yrs} (tuổi)`, `Đáp số: ${son + mom + 2 * yrs} tuổi.`),
        method: 'Bài toán hiệu – tỉ: hiệu số tuổi không thay đổi theo thời gian. Giá trị 1 phần = hiệu : hiệu số phần. Sau n năm mỗi người thêm n tuổi.' }; }
    const A = m * unit, B = k * unit, S = A + B;
    return { q: `Hai kho chứa tất cả ${n(S)} tấn thóc. Số thóc ở kho A bằng $\\frac{${m}}{${k}}$ số thóc ở kho B. Hỏi mỗi kho chứa bao nhiêu tấn thóc? (ghi: kho A; kho B)`, ans: `${A}; ${B}`, tex: `\\text{A: }${u(A, 'tấn')};\\ \\text{B: }${u(B, 'tấn')}`,
      sol: solve('Ta có sơ đồ: kho A ' + m + ' phần, kho B ' + k + ' phần.', `Tổng số phần bằng nhau là: ${m} + ${k} = ${m + k} (phần)`, `Giá trị một phần là: ${n(S)} : ${m + k} = ${unit} (tấn)`, `Kho A chứa: ${unit} × ${m} = ${A} (tấn)`, `Kho B chứa: ${n(S)} − ${A} = ${B} (tấn)`, `Đáp số: Kho A: ${A} tấn; kho B: ${B} tấn.`),
      method: 'Bài toán tổng – tỉ: vẽ sơ đồ, tìm tổng số phần bằng nhau, giá trị một phần = tổng : tổng số phần, rồi tìm từng số.' };
  } },
  { id: 'loi_di_bon_hoa', grades: [5, 6], gens: ['circle'], d: [4, 5], think: true, make() {
    const r = R(2, 8), w = pick([1, 1.5, 2]), R2 = r + w, S = rd(3.14 * (R2 * R2 - r * r), 4);
    return { q: `Một bồn hoa hình tròn có bán kính ${r} m. Xung quanh bồn hoa người ta làm một lối đi rộng ${n(w)} m. Tính diện tích lối đi (lấy π ≈ 3,14).`, ans: S, tex: `${t(S)}\\text{ m}^2`,
      sol: solve('Bán kính hình tròn lớn (bồn hoa và lối đi) là:', `${r} + ${n(w)} = ${n(R2)} (m)`, 'Diện tích hình tròn lớn là:', `${n(R2)} × ${n(R2)} × 3,14 = ${n(rd(3.14 * R2 * R2, 4))} (m²)`, 'Diện tích bồn hoa là:', `${r} × ${r} × 3,14 = ${n(rd(3.14 * r * r, 4))} (m²)`, 'Diện tích lối đi là:', `${n(rd(3.14 * R2 * R2, 4))} − ${n(rd(3.14 * r * r, 4))} = ${n(S)} (m²)`, `Đáp số: ${n(S)} m².`),
      method: 'Diện tích hình vành khăn = diện tích hình tròn lớn − diện tích hình tròn nhỏ. Bán kính lớn = bán kính bồn + độ rộng lối đi.' };
  } },

  // ===================== LỚP 6 – 7 =====================
  { id: 'nhiet_do', grades: [6, 7], gens: ['integers'], d: [3, 5], make() {
    const a = R(-5, 8), b = R(3, 12), c = R(5, 15), noon = a + b, night = noon - c;
    return { q: `Nhiệt độ lúc 6 giờ sáng ở Sa Pa là ${a}°C. Đến trưa nhiệt độ tăng thêm ${b}°C, đến tối lại giảm ${c}°C so với buổi trưa.\na) Tính nhiệt độ lúc buổi tối.\nb) Nhiệt độ buổi trưa cao hơn nhiệt độ buổi tối bao nhiêu độ?`, ans: `${night}; ${c}`, tex: parts(`${night}^\\circ\\text{C}`, `${c}^\\circ\\text{C}`),
      sol: solve('a) Nhiệt độ buổi trưa là:', `${a} + ${b} = ${noon} (°C)`, 'Nhiệt độ buổi tối là:', `${noon} − ${c} = ${night} (°C)`, 'b) Nhiệt độ buổi trưa cao hơn buổi tối là:', `${noon} − (${night}) = ${c} (°C)`, `Đáp số: a) ${night}°C; b) ${c}°C.`),
      method: 'Tăng → cộng, giảm → trừ (với số nguyên). Chênh lệch = nhiệt độ cao − nhiệt độ thấp; chú ý dấu ngoặc khi trừ số âm.' };
  } },
  { id: 'doc_sach_tinh_nguoc', grades: [6, 7], gens: ['fraction'], d: [5, 5], think: true, make() {
    const p = pick([[1, 3], [1, 4], [2, 5]]), q = pick([[5, 8], [1, 2], [3, 5], [2, 3]]);
    const tot = p[1] * q[1] * R(2, 6), d1 = (tot * p[0]) / p[1], rem = tot - d1, d2 = (rem * q[0]) / q[1], d3 = rem - d2;
    if (!Number.isInteger(d2) || d3 <= 0) return null;
    return { q: `Bạn ${pick(NAME)} đọc một quyển sách trong ba ngày. Ngày thứ nhất đọc $\\frac{${p[0]}}{${p[1]}}$ số trang sách, ngày thứ hai đọc $\\frac{${q[0]}}{${q[1]}}$ số trang còn lại, ngày thứ ba đọc nốt ${d3} trang. Hỏi quyển sách có bao nhiêu trang?`, ans: tot, tex: u(tot, 'trang'),
      sol: solve(`Phân số chỉ số trang còn lại sau ngày thứ nhất: 1 − ${fstr(p)} = ${fstr(fr(p[1] - p[0], p[1]))} (quyển sách)`, `Ngày thứ ba đọc ${d3} trang, ứng với: 1 − ${fstr(q)} = ${fstr(fr(q[1] - q[0], q[1]))} (số trang còn lại sau ngày 1)`, `Số trang còn lại sau ngày thứ nhất là: ${d3} : ${fstr(fr(q[1] - q[0], q[1]))} = ${rem} (trang)`, `Số trang của quyển sách là: ${rem} : ${fstr(fr(p[1] - p[0], p[1]))} = ${tot} (trang)`, `Thử lại: ngày 1 đọc ${d1}, ngày 2 đọc ${d2}, ngày 3 đọc ${d3}; tổng ${tot} ✓`, `Đáp số: ${tot} trang.`),
      method: 'Tính ngược từ cuối: biết giá trị của một phân số → tìm cả số = giá trị : phân số. Xác định rõ mỗi phân số là "của" đại lượng nào.' };
  } },
  { id: 'tiet_kiem_phan_tram', grades: [6, 8], gens: ['percent', 'decimal'], d: [4, 5], make() {
    const A = R(2, 20) * 10, r = pick([5, 6, 6.5, 7, 4.8]), I1 = rd((A * r) / 100, 4), A1 = rd(A + I1, 4), A2 = rd(A1 * (1 + r / 100), 4);
    return { q: `Bác ${pick(NAME)} gửi tiết kiệm ${A} triệu đồng với lãi suất ${n(r)}%/năm, hết năm thứ nhất tiền lãi được cộng vào gốc để gửi tiếp.\na) Sau một năm bác có cả gốc lẫn lãi bao nhiêu triệu đồng?\nb) Sau hai năm bác có bao nhiêu triệu đồng? (làm tròn đến hàng phần nghìn)`, ans: `${A1}; ${rd(A2, 3)}`, tex: parts(u(A1, 'triệu đồng'), u(rd(A2, 3), 'triệu đồng')),
      sol: solve('a) Tiền lãi năm thứ nhất là:', `${A} × ${n(r)} : 100 = ${n(I1)} (triệu đồng)`, 'Số tiền sau một năm là:', `${A} + ${n(I1)} = ${n(A1)} (triệu đồng)`, 'b) Số tiền sau hai năm là:', `${n(A1)} × (100 + ${n(r)}) : 100 ≈ ${n(rd(A2, 3))} (triệu đồng)`, `Đáp số: a) ${n(A1)} triệu đồng; b) ${n(rd(A2, 3))} triệu đồng.`),
      method: 'Lãi = gốc × lãi suất. Lãi nhập gốc: năm sau tính lãi trên số tiền mới (gốc + lãi năm trước).' };
  } },
  { id: 'may_cay_ti_le_nghich', grades: [7, 7], gens: ['proportion'], d: [4, 5], think: true, make() {
    const k = R(1, 3), [d1, d2, d3] = pick([[4, 6, 8], [3, 4, 6], [2, 3, 6], [4, 5, 10]]);
    const L = lcm(lcm(d1, d2), d3), a = (L / d1) * k, b = (L / d2) * k, c = (L / d3) * k;
    return { q: `Ba đội máy cày, cày ba cánh đồng có diện tích như nhau. Đội thứ nhất cày xong trong ${d1} ngày, đội thứ hai trong ${d2} ngày, đội thứ ba trong ${d3} ngày. Hỏi mỗi đội có bao nhiêu máy, biết đội thứ nhất có nhiều hơn đội thứ hai ${a - b} máy và năng suất các máy như nhau? (ghi: đội 1; đội 2; đội 3)`, ans: `${a}; ${b}; ${c}`, tex: `${a};\\ ${b};\\ ${c}\\text{ (máy)}`,
      sol: ['Lời giải', 'Gọi số máy của ba đội lần lượt là x, y, z (x, y, z nguyên dương).', 'Cùng một diện tích nên số máy tỉ lệ nghịch với số ngày:', `${d1}x = ${d2}y = ${d3}z ⇒ x/(1/${d1}) = y/(1/${d2}) = z/(1/${d3}).`, `Áp dụng tính chất dãy tỉ số bằng nhau: (x − y)/(1/${d1} − 1/${d2}) = ${a - b} : ${fstr(fr(d2 - d1, d1 * d2))} = ${(a - b) * d1 * d2 / (d2 - d1)}.`, `⇒ x = ${(a - b) * d1 * d2 / (d2 - d1)}/${d1} = ${a}; y = ${b}; z = ${c}.`, `Vậy ba đội có lần lượt ${a}, ${b}, ${c} máy.`].join('\n'),
      method: 'Cùng khối lượng công việc: số máy và số ngày là hai đại lượng tỉ lệ nghịch ⇒ x·a = y·b = z·c. Chuyển về dãy tỉ số bằng nhau rồi dùng dữ kiện hiệu.' };
  } },
  { id: 'chia_ti_le', grades: [6, 7], gens: ['proportion', 'ratio_sum', 'percent'], d: [3, 5], make() {
    const [a, b, c] = pick([[2, 3, 4], [3, 4, 5], [1, 2, 3], [4, 5, 6]]), k = R(2, 9) * 10, S = (a + b + c) * k;
    return { q: `Ba lớp 7A, 7B, 7C góp được tổng cộng ${S} quyển sách cho thư viện. Số sách của ba lớp lần lượt tỉ lệ với ${a}; ${b}; ${c}. Tính số sách mỗi lớp góp được. (ghi: 7A; 7B; 7C)`, ans: `${a * k}; ${b * k}; ${c * k}`, tex: `${a * k};\\ ${b * k};\\ ${c * k}\\text{ (quyển)}`,
      sol: ['Lời giải', 'Gọi số sách của ba lớp là x, y, z (quyển; x, y, z nguyên dương).', `Theo đề bài: x/${a} = y/${b} = z/${c} và x + y + z = ${S}.`, `Áp dụng tính chất dãy tỉ số bằng nhau: x/${a} = y/${b} = z/${c} = (x + y + z)/(${a} + ${b} + ${c}) = ${S}/${a + b + c} = ${k}.`, `⇒ x = ${a * k}; y = ${b * k}; z = ${c * k}.`, `Vậy 7A góp ${a * k}, 7B góp ${b * k}, 7C góp ${c * k} quyển.`].join('\n'),
      method: 'Chia một số thành các phần tỉ lệ với a, b, c: dùng tính chất dãy tỉ số bằng nhau x/a = y/b = z/c = (x + y + z)/(a + b + c).' };
  } },
  { id: 'tam_giac_goc_lien_he', grades: [7, 8], gens: ['triangle_angles', 'angles'], d: [4, 5], make() {
    // Â = k·B̂, Ĉ = B̂ + add ⇒ (k + 2)B̂ + add = 180
    const k = pick([2, 3]), B2 = R(20, Math.floor(170 / (k + 2))), add = 180 - (k + 2) * B2;
    if (add <= 0 || add > 60) return null;
    const A2 = k * B2, C2 = B2 + add;
    return { q: `Tam giác ABC có $\\hat A = ${k}\\hat B$ và $\\hat C = \\hat B + ${add}^\\circ$. Tính số đo các góc của tam giác ABC. (ghi: Â; B̂; Ĉ)`, ans: `${A2}; ${B2}; ${C2}`, tex: `\\hat A = ${A2}^\\circ;\\ \\hat B = ${B2}^\\circ;\\ \\hat C = ${C2}^\\circ`,
      sol: ['Lời giải', 'Tổng ba góc của tam giác: Â + B̂ + Ĉ = 180°.', `Thay Â = ${k}B̂, Ĉ = B̂ + ${add}°: ${k}B̂ + B̂ + B̂ + ${add}° = 180° ⇒ ${k + 2}B̂ = ${180 - add}° ⇒ B̂ = ${B2}°.`, `Â = ${k} · ${B2}° = ${A2}°; Ĉ = ${B2}° + ${add}° = ${C2}°.`].join('\n'),
      method: 'Biểu diễn các góc theo một góc, dùng định lí tổng ba góc bằng 180° để lập và giải phương trình.' };
  } },
  { id: 'the_so_xac_suat', grades: [6, 9], gens: ['prob'], d: [3, 5], make() {
    const N = R(12, 30), even = Math.floor(N / 2), div3 = Math.floor(N / 3), prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].filter((x) => x <= N).length;
    return { q: `Một hộp có ${N} tấm thẻ cùng loại, được đánh số từ 1 đến ${N}. Rút ngẫu nhiên một tấm thẻ.\na) Tính xác suất của biến cố "Số trên thẻ là số chẵn".\nb) Tính xác suất của biến cố "Số trên thẻ chia hết cho 3".\nc) Tính xác suất của biến cố "Số trên thẻ là số nguyên tố".\n(ghi kết quả dạng phân số tối giản)`, ans: `${fstr(fr(even, N))}; ${fstr(fr(div3, N))}; ${fstr(fr(prime, N))}`, tex: parts(ftex(fr(even, N)), ftex(fr(div3, N)), ftex(fr(prime, N))),
      sol: ['Lời giải', `Có ${N} kết quả có thể, đồng khả năng.`, `a) Các số chẵn từ 1 đến ${N}: 2, 4, …, ${even * 2} → ${even} kết quả thuận lợi. P = ${even}/${N} = ${fstr(fr(even, N))}.`, `b) Các số chia hết cho 3: 3, 6, …, ${div3 * 3} → ${div3} kết quả. P = ${div3}/${N} = ${fstr(fr(div3, N))}.`, `c) Các số nguyên tố không vượt quá ${N}: ${[2, 3, 5, 7, 11, 13, 17, 19, 23, 29].filter((x) => x <= N).join(', ')} → ${prime} kết quả. P = ${prime}/${N} = ${fstr(fr(prime, N))}.`].join('\n'),
      method: 'Liệt kê (hoặc đếm) các kết quả thuận lợi cho biến cố; xác suất = số kết quả thuận lợi : tổng số kết quả có thể. Chú ý 1 không phải số nguyên tố.' };
  } },
  { id: 'da_thuc_nghiem', grades: [7, 8], gens: ['poly_eval'], d: [4, 5], make() {
    const a = R(2, 5), root = R(-5, 5) || 2;
    // P + Q = a·x + c' có nghiệm root ⇒ c' = −a·root
    const p2 = R(1, 4), p1 = R(-5, 5), p0 = R(-9, 9);
    const q2 = -p2, q1 = a - p1, q0 = -a * root - p0;
    if (!q1 || !q0 || !p1 || !p0) return null;
    const poly = (x2, x1, x0) => `${x2 === 1 ? '' : x2 === -1 ? '-' : x2}x^2 ${x1 < 0 ? '-' : '+'} ${Math.abs(x1)}x ${x0 < 0 ? '-' : '+'} ${Math.abs(x0)}`;
    return { q: `Cho hai đa thức $P(x) = ${poly(p2, p1, p0)}$ và $Q(x) = ${poly(q2, q1, q0)}$.\na) Tính $M(x) = P(x) + Q(x)$.\nb) Tìm nghiệm của đa thức $M(x)$.\n(Ô đáp số: ghi nghiệm ở câu b)`, ans: root, tex: `M(x) = ${a}x ${-a * root < 0 ? '-' : '+'} ${Math.abs(a * root)};\\ x = ${root}`,
      sol: ['Lời giải', `a) M(x) = (${p2} + (${q2}))x² + (${p1} + (${q1}))x + (${p0} + (${q0})) = ${a}x ${-a * root < 0 ? '−' : '+'} ${Math.abs(a * root)}.`, `b) M(x) = 0 ⇔ ${a}x ${-a * root < 0 ? '−' : '+'} ${Math.abs(a * root)} = 0 ⇔ x = ${root}.`, `Vậy nghiệm của M(x) là x = ${root}.`].join('\n'),
      method: 'Cộng đa thức: nhóm các hạng tử cùng bậc rồi cộng hệ số. Tìm nghiệm: cho đa thức bằng 0 rồi giải.' };
  } },

  // ===================== LỚP 8 =====================
  { id: 'pt_di_ve', grades: [8, 9], gens: ['linear_eq', 'linear_fn'], d: [4, 5], think: true, make() {
    for (let i = 0; i < 60; i++) {
      const v1 = R(6, 10) * 5, v2 = v1 + R(1, 3) * 5, dt = pick([10, 12, 15, 20, 24, 30, 36, 40, 45]);
      const S = (dt / 60) * v1 * v2 / (v2 - v1);
      if (Number.isInteger(S) && S >= 20 && S <= 200) return { q: `Một người đi xe máy từ A đến B với vận tốc ${v1} km/h. Lúc về, người đó đi với vận tốc ${v2} km/h nên thời gian về ít hơn thời gian đi ${dt} phút. Tính quãng đường AB.`, ans: S, tex: u(S, 'km'),
        sol: ['Lời giải', 'Gọi độ dài quãng đường AB là x (km), x > 0.', `Thời gian đi: x/${v1} (giờ); thời gian về: x/${v2} (giờ). Đổi ${dt} phút = ${fstr(fr(dt, 60))} giờ.`, `Ta có phương trình: x/${v1} − x/${v2} = ${fstr(fr(dt, 60))}.`, `⇔ x(${v2} − ${v1})/${v1 * v2} = ${fstr(fr(dt, 60))} ⇔ x = ${fstr(fr(dt, 60))} · ${v1 * v2}/${v2 - v1} = ${S} (thỏa mãn).`, `Vậy quãng đường AB dài ${S} km.`].join('\n'),
        method: 'Giải bài toán bằng cách lập phương trình: chọn ẩn (kèm đơn vị, điều kiện) → biểu diễn thời gian đi, về theo ẩn → lập phương trình từ "chênh lệch thời gian" (đổi phút ra giờ) → giải → đối chiếu điều kiện, kết luận.' };
    }
    return null;
  } },
  { id: 'pt_nang_suat', grades: [8, 9], gens: ['linear_eq'], d: [4, 5], think: true, make() {
    for (let i = 0; i < 80; i++) {
      const a = R(4, 10) * 5, b = a + R(1, 4) * 5, dd = R(1, 3), e = R(1, 6) * 5, T = (b * dd + e) / (b - a);
      if (Number.isInteger(T) && T > dd + 2 && T < 30) { const N = a * T;
        return { q: `Theo kế hoạch, một tổ sản xuất mỗi ngày phải làm ${a} sản phẩm. Khi thực hiện, mỗi ngày tổ làm được ${b} sản phẩm, nên đã hoàn thành sớm hơn kế hoạch ${dd} ngày và còn làm vượt mức ${e} sản phẩm. Hỏi theo kế hoạch tổ phải làm bao nhiêu sản phẩm?`, ans: N, tex: u(N, 'sản phẩm'),
          sol: ['Lời giải', `Gọi số ngày làm theo kế hoạch là x (ngày), x > ${dd}.`, `Số sản phẩm theo kế hoạch: ${a}x. Thực tế làm trong x − ${dd} ngày, được ${b}(x − ${dd}) sản phẩm.`, `Ta có phương trình: ${b}(x − ${dd}) = ${a}x + ${e} ⇔ ${b - a}x = ${b * dd + e} ⇔ x = ${T} (thỏa mãn).`, `Số sản phẩm theo kế hoạch là: ${a} · ${T} = ${N} (sản phẩm).`].join('\n'),
          method: 'Bài toán năng suất: khối lượng công việc = năng suất × thời gian. Lập bảng (kế hoạch / thực tế) rồi lập phương trình từ quan hệ giữa hai khối lượng.' }; }
    }
    return null;
  } },
  { id: 'hdt_tim_x', grades: [8, 8], gens: ['identities', 'factor'], d: [3, 5], make() {
    const a = R(1, 6), x = R(-6, 6), c = 2 * a * x + 2 * a * a;
    return { q: `Tìm x, biết: $(x + ${a})^2 - (x - ${a})(x + ${a}) = ${c}$`, ans: x, tex: `x = ${x}`,
      sol: ['Lời giải', `(x + ${a})² − (x − ${a})(x + ${a}) = ${c}`, `⇔ x² + ${2 * a}x + ${a * a} − (x² − ${a * a}) = ${c}`, `⇔ ${2 * a}x + ${2 * a * a} = ${c}`, `⇔ ${2 * a}x = ${c - 2 * a * a} ⇔ x = ${x}.`].join('\n'),
      method: 'Khai triển bằng hằng đẳng thức (A + B)² và (A − B)(A + B) = A² − B², thu gọn (x² triệt tiêu) rồi giải phương trình bậc nhất.' };
  } },
  { id: 'cay_tre_gay', grades: [8, 9], gens: ['pythagoras', 'trig_right'], d: [4, 5], think: true, make() {
    const [x, dd, h] = pick([[3, 4, 8], [5, 12, 18], [6, 8, 16], [8, 15, 25], [9, 12, 24], [7, 24, 32]]);
    return { q: `Một cây tre cao ${h} m bị gió bão làm gãy ngang thân, ngọn cây chạm đất cách gốc ${dd} m. Hỏi điểm gãy cách gốc cây bao nhiêu mét?`, ans: x, tex: u(x, 'm'),
      sol: ['Lời giải', `Gọi khoảng cách từ điểm gãy đến gốc là x (m), 0 < x < ${h}. Phần ngọn bị gãy dài ${h} − x (m).`, 'Phần thân còn đứng, mặt đất và phần ngọn tạo thành tam giác vuông tại gốc, cạnh huyền là phần ngọn.', `Theo định lí Pythagore: x² + ${dd}² = (${h} − x)² ⇔ x² + ${dd * dd} = ${h * h} − ${2 * h}x + x² ⇔ ${2 * h}x = ${h * h - dd * dd} ⇔ x = ${x} (thỏa mãn).`, `Vậy điểm gãy cách gốc ${x} m.`].join('\n'),
      method: 'Mô hình hóa tình huống thành tam giác vuông, đặt ẩn cho đoạn chưa biết, áp dụng định lí Pythagore để lập phương trình.' };
  } },
  { id: 'cuoc_taxi', grades: [8, 9], gens: ['linear_fn'], d: [3, 5], make() {
    const open = R(10, 14) * 1000, per = R(12, 17) * 1000, km = R(8, 20), pay1 = open + per * (km - 1), km2 = R(5, 25), pay2 = open + per * (km2 - 1);
    return { q: `Giá cước taxi: ${n(open)} đồng cho 1 km đầu tiên, mỗi km tiếp theo giá ${n(per)} đồng.\na) Viết công thức tính số tiền y (đồng) phải trả khi đi x km (x ≥ 1).\nb) Đi ${km} km phải trả bao nhiêu tiền?\nc) Một người trả ${n(pay2)} đồng. Người đó đã đi bao nhiêu ki-lô-mét?\n(Ô đáp số: ghi kết quả câu b; câu c)`, ans: `${pay1}; ${km2}`, tex: `y = ${per}x + ${open - per};\\ ${u(pay1, 'đồng')};\\ ${u(km2, 'km')}`,
      sol: ['Lời giải', `a) y = ${n(open)} + ${n(per)}(x − 1) = ${n(per)}x + ${n(open - per)}.`, `b) Với x = ${km}: y = ${n(per)} · ${km} + ${n(open - per)} = ${n(pay1)} (đồng).`, `c) ${n(per)}x + ${n(open - per)} = ${n(pay2)} ⇔ x = ${km2} (km).`].join('\n'),
      method: 'Mô hình hàm số bậc nhất y = ax + b: a là giá mỗi km, b là phần cố định. Tính y khi biết x (thay số), tìm x khi biết y (giải phương trình).' };
  } },
  { id: 'bong_cay_thales', grades: [8, 9], gens: ['thales', 'trig_right'], d: [3, 5], make() {
    const pole = pick([1.5, 2, 2.5]), ps = pick([1, 1.2, 1.5, 2]), k = R(4, 9), tree = rd(pole * k, 2), ts = rd(ps * k, 2);
    return { q: `Vào cùng một thời điểm, một cây cột cao ${n(pole)} m có bóng trên mặt đất dài ${n(ps)} m, còn bóng của một cây cổ thụ dài ${n(ts)} m. Tính chiều cao của cây cổ thụ.`, ans: tree, tex: u(tree, 'm'),
      sol: ['Lời giải', 'Tia nắng song song nên hai tam giác (cột – bóng cột) và (cây – bóng cây) đồng dạng (hệ quả định lí Thalès).', `Ta có: chiều cao cây / ${n(pole)} = ${n(ts)} / ${n(ps)} ⇒ chiều cao cây = ${n(pole)} · ${n(ts)} : ${n(ps)} = ${n(tree)} (m).`].join('\n'),
      method: 'Đo chiều cao gián tiếp bằng bóng nắng: các tam giác đồng dạng ⇒ tỉ số chiều cao bằng tỉ số độ dài bóng.' };
  } },

  // ===================== LỚP 9 =====================
  { id: 'hpt_gap_nhau', grades: [9, 9], gens: ['system2', 'linear_ineq'], d: [4, 5], think: true, make() {
    const v2 = R(8, 12) * 5, dv = R(1, 4) * 5, v1 = v2 + dv, tt = pick([1.5, 2, 2.5, 3]), S = rd((v1 + v2) * tt, 2);
    return { q: `Hai ô tô khởi hành cùng lúc từ hai tỉnh A và B cách nhau ${n(S)} km, đi ngược chiều nhau và gặp nhau sau ${n(tt)} giờ. Tính vận tốc mỗi xe, biết mỗi giờ xe đi từ A đi nhanh hơn xe đi từ B là ${dv} km. (ghi: vận tốc xe A; xe B)`, ans: `${v1}; ${v2}`, tex: `${u(v1, 'km/h')};\\ ${u(v2, 'km/h')}`,
      sol: ['Lời giải', 'Gọi vận tốc xe đi từ A là x (km/h), xe đi từ B là y (km/h), x > y > 0.', `Sau ${n(tt)} giờ hai xe gặp nhau nên: ${n(tt)}x + ${n(tt)}y = ${n(S)} ⇔ x + y = ${v1 + v2}.`, `Xe A nhanh hơn xe B ${dv} km/h: x − y = ${dv}.`, `Giải hệ: x = (${v1 + v2} + ${dv}) : 2 = ${v1}; y = ${v2} (thỏa mãn).`, `Vậy vận tốc xe đi từ A là ${v1} km/h, xe đi từ B là ${v2} km/h.`].join('\n'),
      method: 'Lập hệ hai phương trình bậc nhất hai ẩn: một phương trình từ quãng đường (chuyển động ngược chiều: tổng quãng đường hai xe = khoảng cách), một phương trình từ chênh lệch vận tốc.' };
  } },
  { id: 'hpt_voi_nuoc', grades: [9, 9], gens: ['system2', 'quadratic'], d: [5, 5], think: true, make() {
    const [x, y] = pick([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [6, 3], [12, 4], [15, 10]]), T = (x * y) / (x + y);
    const a = pick([1, 2]), b = pick([2, 3]), part = fr(a * y + b * x, x * y);
    return { q: `Hai vòi nước cùng chảy vào một bể cạn thì sau ${n(T)} giờ đầy bể. Nếu mở vòi thứ nhất trong ${a} giờ và vòi thứ hai trong ${b} giờ thì được $${ftex(part)}$ bể. Hỏi nếu chảy một mình thì mỗi vòi chảy đầy bể trong bao lâu? (ghi: vòi 1; vòi 2)`, ans: `${x}; ${y}`, tex: `${u(x, 'giờ')};\\ ${u(y, 'giờ')}`,
      sol: ['Lời giải', `Gọi thời gian vòi 1, vòi 2 chảy một mình đầy bể lần lượt là x, y (giờ), x, y > ${n(T)}.`, 'Mỗi giờ vòi 1 chảy được 1/x bể, vòi 2 chảy được 1/y bể.', `Ta có hệ: 1/x + 1/y = 1/${n(T)}; ${a}/x + ${b}/y = ${fstr(part)}.`, `Đặt u = 1/x, v = 1/y: u + v = ${fstr(fr(x + y, x * y))}; ${a}u + ${b}v = ${fstr(part)}.`, `Giải được u = 1/${x}, v = 1/${y} ⇒ x = ${x}, y = ${y} (thỏa mãn).`, `Vậy vòi 1 chảy một mình đầy bể trong ${x} giờ, vòi 2 trong ${y} giờ.`].join('\n'),
      method: 'Bài toán làm chung – làm riêng: năng suất = 1/thời gian. Lập hệ theo 1/x, 1/y, đặt ẩn phụ để đưa về hệ bậc nhất.' };
  } },
  { id: 'pt_bac2_vuon', grades: [9, 10], gens: ['quadratic', 'quad_fn'], d: [4, 5], make() {
    const w = R(5, 20), D = R(2, 10), l = w + D, S = l * w, P = 2 * (l + w);
    return { q: `Một mảnh vườn hình chữ nhật có chiều dài hơn chiều rộng ${D} m và diện tích bằng ${S} m². Tính chu vi mảnh vườn.`, ans: P, tex: u(P, 'm'),
      sol: ['Lời giải', 'Gọi chiều rộng mảnh vườn là x (m), x > 0. Chiều dài là x + ' + D + ' (m).', `Ta có phương trình: x(x + ${D}) = ${S} ⇔ x² + ${D}x − ${S} = 0.`, `Δ = ${D * D} + ${4 * S} = ${D * D + 4 * S} = ${2 * w + D}² ⇒ x₁ = ${w} (thỏa mãn), x₂ = ${-(w + D)} (loại).`, `Chiều rộng ${w} m, chiều dài ${l} m. Chu vi: 2(${l} + ${w}) = ${P} (m).`].join('\n'),
      method: 'Lập phương trình bậc hai từ công thức diện tích, giải bằng công thức nghiệm, loại nghiệm không thỏa điều kiện (độ dài phải dương).' };
  } },
  { id: 'viete_m', grades: [9, 9], gens: ['quadratic'], d: [4, 5], make() {
    const x1 = R(-5, 6) || 2, x2 = R(-6, 6) || -3, s = x1 + x2, m = x1 * x2;
    return { q: `Cho phương trình $x^2 ${-s < 0 ? '-' : '+'} ${Math.abs(s)}x + m = 0$ (m là tham số).\na) Tìm m để phương trình có một nghiệm là $x = ${x1}$.\nb) Với m vừa tìm được, dùng định lí Viète tìm nghiệm còn lại.\n(ghi: m; nghiệm còn lại)`, ans: `${m}; ${x2}`, tex: `m = ${m};\\ x_2 = ${x2}`,
      sol: ['Lời giải', `a) x = ${x1} là nghiệm ⇔ ${x1 * x1} ${-s * x1 < 0 ? '−' : '+'} ${Math.abs(s * x1)} + m = 0 ⇔ m = ${m}.`, `b) Theo Viète: x₁ + x₂ = ${s} ⇒ x₂ = ${s} − (${x1}) = ${x2}. (Kiểm tra: x₁·x₂ = ${m} = m ✓)`].join('\n'),
      method: 'Một số là nghiệm ⇔ thay vào phương trình được đẳng thức đúng. Biết một nghiệm, dùng tổng hoặc tích hai nghiệm (Viète) để tìm nghiệm còn lại.' };
  } },
  { id: 'can_rut_gon', grades: [9, 9], gens: ['sqrt'], d: [4, 5], make() {
    const a = R(1, 5), k = R(1, 9);
    if (k === a) return null;
    return { q: `Cho biểu thức $A = \\dfrac{x - ${a * a}}{\\sqrt{x} - ${a}}$ với $x \\ge 0,\\ x \\ne ${a * a}$.\na) Rút gọn A.\nb) Tính giá trị của A khi $x = ${k * k}$.\n(Ô đáp số: ghi giá trị câu b)`, ans: k + a, tex: `A = \\sqrt{x} + ${a};\\ A = ${k + a}`,
      sol: ['Lời giải', `a) Với x ≥ 0, x ≠ ${a * a}: x − ${a * a} = (√x)² − ${a}² = (√x − ${a})(√x + ${a}).`, `⇒ A = (√x − ${a})(√x + ${a})/(√x − ${a}) = √x + ${a}.`, `b) x = ${k * k} (thỏa mãn điều kiện) ⇒ √x = ${k} ⇒ A = ${k} + ${a} = ${k + a}.`].join('\n'),
      method: 'Viết x − a² thành hiệu hai bình phương (√x)² − a², phân tích thành nhân tử rồi rút gọn. Kiểm tra điều kiện trước khi thay số.' };
  } },
  { id: 'bon_tru', grades: [9, 9], gens: ['solids'], d: [3, 5], make() {
    const r = pick([0.5, 0.6, 0.8, 1]), h = pick([1.2, 1.5, 2]), V = rd(3.14 * r * r * h, 4), L = rd(V * 1000, 2);
    return { q: `Một bồn chứa nước hình trụ có bán kính đáy ${n(r)} m và chiều cao ${n(h)} m. Hỏi bồn chứa được tối đa bao nhiêu lít nước? (lấy π ≈ 3,14)`, ans: L, tex: u(L, 'lít'),
      sol: ['Lời giải', `Thể tích bồn: V = πr²h ≈ 3,14 · ${n(r)}² · ${n(h)} = ${n(V)} (m³).`, `Đổi: ${n(V)} m³ = ${n(L)} dm³ = ${n(L)} lít.`, `Vậy bồn chứa được tối đa ${n(L)} lít nước.`].join('\n'),
      method: 'Thể tích hình trụ V = πr²h. 1 m³ = 1000 dm³ = 1000 lít.' };
  } },

  // ===================== THPT =====================
  { id: 'qhtt_san_xuat', grades: [10, 10], gens: ['linear_ineq2'], d: [4, 5], think: true, make() {
    for (let i = 0; i < 60; i++) {
      const A = R(6, 12), B = R(A + 2, 2 * A - 2), p = R(2, 6) * 10, q = R(2, 6) * 10;
      const verts = [[0, 0], [B / 2, 0], [0, A], [B - A, 2 * A - B]].filter(([x, y]) => x >= 0 && y >= 0);
      const vals = verts.map(([x, y]) => p * x + q * y), M = Math.max(...vals), best = verts[vals.indexOf(M)];
      if (best[0] > 0 && best[1] > 0 && Number.isInteger(best[0]) && Number.isInteger(best[1]) && Number.isInteger(M)) return { q: `Một xưởng làm hai loại sản phẩm I và II. Mỗi sản phẩm I cần 2 giờ trên máy cắt và 1 giờ trên máy hoàn thiện; mỗi sản phẩm II cần 1 giờ trên máy cắt và 1 giờ trên máy hoàn thiện. Mỗi ngày máy cắt làm tối đa ${B} giờ, máy hoàn thiện tối đa ${A} giờ. Lãi mỗi sản phẩm I là ${p} nghìn đồng, sản phẩm II là ${q} nghìn đồng. Mỗi ngày nên làm bao nhiêu sản phẩm mỗi loại để tiền lãi lớn nhất? (ghi: số SP I; số SP II; tiền lãi lớn nhất)`, ans: `${best[0]}; ${best[1]}; ${M}`, tex: `${best[0]};\\ ${best[1]};\\ ${u(M, 'nghìn đồng')}`,
        sol: ['Lời giải', 'Gọi x, y là số sản phẩm I, II làm mỗi ngày (x, y ≥ 0).', `Điều kiện: 2x + y ≤ ${B} (máy cắt); x + y ≤ ${A} (máy hoàn thiện).`, `Tiền lãi: F = ${p}x + ${q}y (nghìn đồng).`, `Miền nghiệm là đa giác với các đỉnh ${verts.map(([x, y]) => `(${x}; ${y})`).join(', ')}.`, `Giá trị F tại các đỉnh: ${verts.map(([x, y], j) => `F(${x}; ${y}) = ${vals[j]}`).join('; ')}.`, `F lớn nhất bằng ${M} khi x = ${best[0]}, y = ${best[1]}.`].join('\n'),
        method: 'Bài toán tối ưu: đặt ẩn, lập hệ bất phương trình bậc nhất hai ẩn, biểu diễn miền nghiệm; giá trị lớn nhất của F = ax + by đạt tại một đỉnh của miền nghiệm.' };
    }
    return null;
  } },
  { id: 'cong_parabol', grades: [10, 10], gens: ['quad_fn', 'quad_ineq'], d: [4, 5], think: true, make() {
    const a = pick([4, 5, 6]), h = pick([6, 8, 9, 10]), w = pick([2, 2.4, 3, 4]), c = pick([4, 5, 6]);
    const y = rd(h * (1 - (w / 2) ** 2 / (a * a)), 3), ok = y > c ? 'có' : 'không';
    return { q: `Một cổng có dạng parabol, khoảng cách giữa hai chân cổng là ${2 * a} m và chiều cao của cổng (đỉnh parabol) là ${h} m. Một xe tải rộng ${n(w)} m, cao ${c} m đi chính giữa cổng. Tính chiều cao của cổng tại vị trí cách trục đối xứng ${n(w / 2)} m (làm tròn đến hàng phần trăm) và cho biết xe có đi qua cổng được không.`, ans: rd(y, 2), tex: `${u(rd(y, 2), 'm')}\\text{ — xe ${ok} đi qua được}`,
      sol: ['Lời giải', `Chọn hệ trục: gốc O ở chính giữa chân cổng, trục Oy hướng lên. Parabol đi qua (−${a}; 0), (${a}; 0), đỉnh (0; ${h}) nên y = ${h} − ${fstr(fr(h, a * a))}x².`, `Tại x = ${n(w / 2)}: y = ${h} − ${fstr(fr(h, a * a))} · ${n((w / 2) ** 2)} ≈ ${n(rd(y, 2))} (m).`, `So sánh với chiều cao xe ${c} m: ${n(rd(y, 2))} ${y > c ? '>' : '≤'} ${c} ⇒ xe ${ok} đi qua được.`].join('\n'),
      method: 'Mô hình hóa bằng hàm số bậc hai: chọn hệ trục hợp lý (đỉnh trên Oy), tìm phương trình parabol từ các điểm đã biết, rồi tính giá trị tại vị trí mép xe.' };
  } },
  { id: 'chon_ban_it_nhat', grades: [10, 11], gens: ['comb', 'prob'], d: [4, 5], make() {
    const b = R(8, 18), g = R(6, 15), all = C(b + g, 3), none = C(b, 3);
    return { q: `Một lớp có ${b} học sinh nam và ${g} học sinh nữ. Cần chọn 3 học sinh đi trực tuần.\na) Có bao nhiêu cách chọn sao cho trong 3 bạn có ít nhất một bạn nữ?\nb) Tính xác suất để chọn ngẫu nhiên 3 bạn mà có ít nhất một bạn nữ (phân số tối giản).`, ans: `${all - none}; ${fstr(fr(all - none, all))}`, tex: parts(t(all - none), ftex(fr(all - none, all))),
      sol: ['Lời giải', `Số cách chọn 3 bạn bất kì: C(${b + g}, 3) = ${all}.`, `Số cách chọn 3 bạn toàn nam: C(${b}, 3) = ${none}.`, `a) Số cách có ít nhất một nữ: ${all} − ${none} = ${all - none}.`, `b) P = ${all - none}/${all} = ${fstr(fr(all - none, all))}.`].join('\n'),
      method: '"Ít nhất một" → dùng phần bù: lấy tất cả trừ trường hợp không có (toàn nam). Chọn không thứ tự dùng tổ hợp C(n, k).' };
  } },
  { id: 'do_kc_qua_ho', grades: [10, 10], gens: ['law_cos', 'vector2'], d: [4, 5], make() {
    const a = R(40, 120), b = R(40, 120), ang = pick([60, 120, 45]);
    const AB = rd(Math.sqrt(a * a + b * b - 2 * a * b * Math.cos((ang * Math.PI) / 180)), 2);
    return { q: `Để đo khoảng cách giữa hai điểm A và B ở hai bờ một cái hồ, người ta chọn điểm C sao cho đo được CA = ${a} m, CB = ${b} m và $\\widehat{ACB} = ${ang}^\\circ$. Tính khoảng cách AB (làm tròn đến hàng phần trăm).`, ans: AB, tex: u(AB, 'm'),
      sol: ['Lời giải', 'Áp dụng định lí côsin trong tam giác ABC:', `AB² = CA² + CB² − 2·CA·CB·cos C = ${a * a} + ${b * b} − 2·${a}·${b}·cos ${ang}° ≈ ${n(rd(AB * AB, 2))}.`, `⇒ AB ≈ ${n(AB)} m.`].join('\n'),
      method: 'Đo khoảng cách gián tiếp: biết hai cạnh và góc xen giữa → dùng định lí côsin a² = b² + c² − 2bc·cos A.' };
  } },
  { id: 'luong_cap_so', grades: [11, 11], gens: ['sequence'], d: [4, 5], make(d) {
    const A = R(8, 15), yrs = R(5, 10);
    if (d >= 5) { const p = pick([5, 8, 10]), tot = rd((12 * A * ((1 + p / 100) ** yrs - 1)) / (p / 100), 2);
      return { q: `Một người được nhận vào làm việc với mức lương ${A} triệu đồng/tháng trong năm đầu; sau mỗi năm lương mỗi tháng tăng thêm ${p}% so với năm trước. Tính tổng số tiền lương người đó nhận được sau ${yrs} năm làm việc (làm tròn đến hàng phần trăm, đơn vị triệu đồng).`, ans: tot, tex: u(tot, 'triệu đồng'),
        sol: ['Lời giải', `Lương một năm lần lượt là: 12·${A}; 12·${A}·${n(1 + p / 100)}; … — một cấp số nhân có u₁ = ${12 * A}, q = ${n(1 + p / 100)}.`, `Tổng lương sau ${yrs} năm: S = u₁(qⁿ − 1)/(q − 1) = ${12 * A}·(${n(1 + p / 100)}^${yrs} − 1)/${n(p / 100)} ≈ ${n(tot)} (triệu đồng).`].join('\n'),
        method: 'Tăng theo phần trăm cố định mỗi năm → cấp số nhân với công bội q = 1 + r. Tổng n số hạng Sₙ = u₁(qⁿ − 1)/(q − 1).' }; }
    const dd = pick([0.5, 1, 1.5]), tot = rd(12 * ((yrs * (2 * A + (yrs - 1) * dd)) / 2), 2);
    return { q: `Một người được nhận vào làm việc với mức lương ${A} triệu đồng/tháng trong năm đầu; sau mỗi năm lương mỗi tháng tăng thêm ${n(dd)} triệu đồng. Tính tổng số tiền lương người đó nhận được sau ${yrs} năm làm việc.`, ans: tot, tex: u(tot, 'triệu đồng'),
      sol: ['Lời giải', `Lương tháng mỗi năm lập thành cấp số cộng: u₁ = ${A}, d = ${n(dd)}.`, `Lương tháng ở năm thứ ${yrs}: u${yrs} = ${A} + ${yrs - 1}·${n(dd)} = ${n(A + (yrs - 1) * dd)}.`, `Tổng lương một tháng của ${yrs} năm: S = ${yrs}(${A} + ${n(A + (yrs - 1) * dd)})/2 = ${n(rd(tot / 12, 4))} (triệu đồng).`, `Mỗi năm có 12 tháng nên tổng tiền lương là: 12 · ${n(rd(tot / 12, 4))} = ${n(tot)} (triệu đồng).`].join('\n'),
      method: 'Tăng thêm một lượng cố định mỗi năm → cấp số cộng. Sₙ = n(u₁ + uₙ)/2; nhớ nhân 12 tháng.' };
  } },
  { id: 'gui_tiet_kiem_log', grades: [11, 12], gens: ['exp_log'], d: [4, 5], think: true, make() {
    const r = pick([6, 6.5, 7, 7.5, 8]), k = pick([1.5, 2]), N = Math.ceil(Math.log(k) / Math.log(1 + r / 100));
    return { q: `Một người gửi tiết kiệm với lãi suất ${n(r)}%/năm, lãi hằng năm được nhập vào gốc. Hỏi sau ít nhất bao nhiêu năm thì số tiền nhận được ${k === 2 ? 'gấp đôi' : 'gấp 1,5 lần'} số tiền gửi ban đầu?`, ans: N, tex: u(N, 'năm'),
      sol: ['Lời giải', `Gọi số tiền gửi là A. Sau n năm số tiền là A(1 + ${n(r / 100)})ⁿ.`, `Cần: A(${n(1 + r / 100)})ⁿ ≥ ${n(k)}A ⇔ n ≥ log_${n(1 + r / 100)} ${n(k)} ≈ ${n(rd(Math.log(k) / Math.log(1 + r / 100), 3))}.`, `n nguyên nhỏ nhất là ${N}. Vậy sau ít nhất ${N} năm.`].join('\n'),
      method: 'Lãi kép: Aₙ = A(1 + r)ⁿ. Giải bất phương trình mũ bằng cách lấy lôgarit hai vế, chọn số nguyên nhỏ nhất thỏa mãn.' };
  } },
  { id: 'phanh_xe_tich_phan', grades: [11, 12], gens: ['integral', 'derivative'], d: [4, 5], think: true, make() {
    const v0 = pick([10, 12, 15, 20, 24]), k = pick([2, 3, 4, 5]), T = v0 / k, S = rd((v0 * v0) / (2 * k), 2);
    return { q: `Một ô tô đang chạy với vận tốc ${v0} m/s thì người lái xe đạp phanh; từ thời điểm đó ô tô chuyển động chậm dần đều với vận tốc $v(t) = ${v0} - ${k}t$ (m/s), t là thời gian (giây) tính từ lúc đạp phanh. Hỏi từ lúc đạp phanh đến khi dừng hẳn, ô tô còn di chuyển bao nhiêu mét?`, ans: S, tex: u(S, 'm'),
      sol: ['Lời giải', `Ô tô dừng khi v(t) = 0 ⇔ ${v0} − ${k}t = 0 ⇔ t = ${n(T)} (s).`, `Quãng đường: s = ∫₀^${n(T)} (${v0} − ${k}t) dt = [${v0}t − ${n(k / 2)}t²]₀^${n(T)} = ${n(S)} (m).`].join('\n'),
      method: 'Quãng đường là tích phân của vận tốc theo thời gian: s = ∫ v(t) dt từ lúc bắt đầu đến lúc dừng (v = 0).' };
  } },
  { id: 'rao_dua_tuong', grades: [12, 12], gens: ['extrema', 'derivative', 'quad_fn'], d: [4, 5], think: true, make() {
    const L = R(10, 50) * 4, x = L / 4, y = L / 2, S = x * y;
    return { q: `Bác ${pick(NAME)} có ${L} m lưới muốn rào một mảnh vườn hình chữ nhật dựa vào một bức tường có sẵn (cạnh sát tường không cần rào). Hỏi kích thước mảnh vườn như thế nào để diện tích lớn nhất, và diện tích lớn nhất bằng bao nhiêu? (ghi: cạnh vuông góc với tường; cạnh song song với tường; diện tích)`, ans: `${x}; ${y}; ${S}`, tex: `${u(x, 'm')};\\ ${u(y, 'm')};\\ ${S}\\text{ m}^2`,
      sol: ['Lời giải', `Gọi độ dài cạnh vuông góc với tường là x (m), 0 < x < ${L / 2}. Cạnh song song với tường dài ${L} − 2x (m).`, `Diện tích: S(x) = x(${L} − 2x) = ${L}x − 2x².`, `S'(x) = ${L} − 4x = 0 ⇔ x = ${x}. S' đổi dấu từ + sang − tại x = ${x} nên S đạt cực đại, cũng là GTLN trên (0; ${L / 2}).`, `Khi đó cạnh song song với tường dài ${y} m và S max = ${S} m².`].join('\n'),
      method: 'Bài toán tối ưu: lập hàm số một biến (dùng ràng buộc để khử biến còn lại), tìm miền xác định, khảo sát bằng đạo hàm để tìm GTLN.' };
  } },
  // ===================== BỔ SUNG: hình học, thống kê, THPT =====================
  { id: 'kien_gap_khuc', grades: [2, 3], gens: ['polyline'], d: [3, 5], make() {
    const ab = R(8, 20), more = R(3, 9), bc = ab + more, cd = R(5, ab - 1), L = ab + bc + cd;
    return { q: `Một con kiến bò theo đường gấp khúc ABCD. Đoạn AB dài ${ab} cm, đoạn BC dài hơn đoạn AB ${more} cm, đoạn CD dài ${cd} cm. Hỏi con kiến đã bò được quãng đường dài bao nhiêu xăng-ti-mét?`, ans: L, tex: u(L, 'cm'),
      sol: solve('Đoạn BC dài là:', `${ab} + ${more} = ${bc} (cm)`, 'Quãng đường con kiến bò (độ dài đường gấp khúc ABCD) là:', `${ab} + ${bc} + ${cd} = ${L} (cm)`, `Đáp số: ${L} cm.`),
      method: 'Độ dài đường gấp khúc bằng tổng độ dài các đoạn thẳng. Đoạn chưa biết thì tìm trước ("dài hơn" → cộng).' };
  } },
  { id: 'di_ve_hoc', grades: [2, 4], gens: ['unit_convert', 'add_sub'], d: [3, 5], make() {
    const m = R(3, 9) * 100, trips = 2, days = R(5, 6), day = m * 2 * trips, tot = day * days;
    return { q: `Quãng đường từ nhà ${pick(NAME)} đến trường dài ${m} m. Mỗi ngày bạn đi học hai buổi (sáng và chiều), mỗi buổi đi từ nhà đến trường rồi về nhà. Hỏi trong ${days} ngày bạn đi tất cả bao nhiêu mét? Đổi ra ki-lô-mét và mét. (Ô đáp số: ghi số mét)`, ans: tot, tex: `${u(tot, 'm')} = ${Math.floor(tot / 1000)}\\text{ km }${tot % 1000}\\text{ m}`,
      sol: solve('Mỗi buổi bạn đi cả đi lẫn về là:', `${m} × 2 = ${m * 2} (m)`, 'Mỗi ngày bạn đi là:', `${m * 2} × 2 = ${day} (m)`, `Trong ${days} ngày bạn đi là:`, `${day} × ${days} = ${n(tot)} (m)`, `Đổi: ${n(tot)} m = ${Math.floor(tot / 1000)} km ${tot % 1000} m`, `Đáp số: ${n(tot)} m (${Math.floor(tot / 1000)} km ${tot % 1000} m).`),
      method: 'Đọc kĩ đề: "đi rồi về" là 2 lần quãng đường, "hai buổi" thì nhân tiếp 2. Đổi đơn vị: 1 km = 1000 m.' };
  } },
  { id: 'hai_hinh_tron_hcn', grades: [3, 5], gens: ['circle_basic', 'circle', 'rect'], d: [4, 5], think: true, make() {
    const r = R(2, 9), l = 4 * r, w = 2 * r, P = 2 * (l + w);
    return { q: `Hai hình tròn bằng nhau, mỗi hình có bán kính ${r} cm, được đặt sát nhau vừa khít trong một hình chữ nhật (mỗi hình tròn chạm ba cạnh của hình chữ nhật, hai hình tròn chạm nhau). Tính chu vi hình chữ nhật đó.`, ans: P, tex: u(P, 'cm'),
      sol: solve('Đường kính mỗi hình tròn là:', `${r} × 2 = ${w} (cm)`, 'Chiều rộng hình chữ nhật bằng đường kính một hình tròn: ' + w + ' cm.', 'Chiều dài hình chữ nhật bằng hai lần đường kính:', `${w} × 2 = ${l} (cm)`, 'Chu vi hình chữ nhật là:', `(${l} + ${w}) × 2 = ${P} (cm)`, `Đáp số: ${P} cm.`),
      method: 'Vẽ hình để thấy: chiều rộng = đường kính, chiều dài = 2 đường kính. Đường kính = bán kính × 2.' };
  } },
  { id: 'bang_so_lieu_sach', grades: [3, 4], gens: ['stats_mean'], d: [3, 5], make() {
    const ns = ['An', 'Bình', 'Chi', 'Dũng', 'Hà'], v = ns.map(() => R(2, 12)), mx = Math.max(...v), mn = Math.min(...v), tot = v.reduce((a, b) => a + b, 0), k = R(5, 8), cnt = v.filter((x) => x > k).length;
    return { q: `Số quyển sách mỗi bạn trong tổ đọc được trong tháng: ${ns.map((x, i) => `${x}: ${v[i]} quyển`).join('; ')}.\na) Cả tổ đọc được bao nhiêu quyển sách?\nb) Bạn đọc nhiều nhất hơn bạn đọc ít nhất bao nhiêu quyển?\nc) Có bao nhiêu bạn đọc nhiều hơn ${k} quyển?`, ans: `${tot}; ${mx - mn}; ${cnt}`, tex: parts(t(tot), t(mx - mn), t(cnt)),
      sol: solve(`a) Cả tổ đọc được: ${v.join(' + ')} = ${tot} (quyển)`, `b) Nhiều nhất ${mx} quyển, ít nhất ${mn} quyển: ${mx} − ${mn} = ${mx - mn} (quyển)`, `c) Các bạn đọc nhiều hơn ${k} quyển: ${ns.filter((_, i) => v[i] > k).join(', ') || 'không có'} → ${cnt} bạn.`, `Đáp số: a) ${tot} quyển; b) ${mx - mn} quyển; c) ${cnt} bạn.`),
      method: 'Đọc số liệu cẩn thận, so sánh để tìm lớn nhất/bé nhất; "hơn bao nhiêu" → phép trừ; "nhiều hơn k" không tính bạn đọc đúng k quyển.' };
  } },
  { id: 'diem_kiem_tra', grades: [6, 10], gens: ['stats_mean'], d: [3, 5], make() {
    const N = R(8, 12), v = Array.from({ length: N }, () => R(4, 10)), tot = v.reduce((a, b) => a + b, 0), mean = rd(tot / N, 2);
    const good = v.filter((x) => x >= 8).length, pct = rd((good / N) * 100, 2);
    const cnt = {}; v.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const maxc = Math.max(...Object.values(cnt)); const modes = Object.keys(cnt).filter((k) => cnt[k] === maxc).map(Number);
    if (modes.length > 1) return null;
    return { q: `Điểm kiểm tra môn Toán của ${N} bạn trong một tổ là: ${v.join('; ')}.\na) Tính điểm trung bình của tổ (làm tròn đến hàng phần trăm).\nb) Số bạn đạt từ 8 điểm trở lên chiếm bao nhiêu phần trăm (làm tròn đến hàng phần trăm)?\nc) Tìm mốt của mẫu số liệu.`, ans: `${mean}; ${pct}; ${modes[0]}`, tex: parts(t(mean), `${t(pct)}\\%`, t(modes[0])),
      sol: ['Lời giải', `a) Tổng điểm: ${tot}. Điểm trung bình: ${tot} : ${N} ≈ ${n(mean)}.`, `b) Số bạn đạt từ 8 điểm trở lên: ${good} bạn. Tỉ lệ: ${good} : ${N} · 100% ≈ ${n(pct)}%.`, `c) Giá trị ${modes[0]} xuất hiện nhiều nhất (${maxc} lần) nên mốt là ${modes[0]}.`].join('\n'),
      method: 'Số trung bình = tổng các giá trị : số giá trị. Tỉ lệ phần trăm = số phần tử thỏa mãn : tổng · 100%. Mốt là giá trị có tần số lớn nhất.' };
  } },
  { id: 'ghep_nhom_thoi_gian', grades: [11, 12], gens: ['stats_mean'], d: [3, 5], make(d) {
    const f = [R(3, 8), R(6, 14), R(10, 18), R(4, 10), R(1, 5)], N = f.reduce((a, b) => a + b, 0), mid = [15, 45, 75, 105, 135];
    const mean = rd(f.reduce((s, x, i) => s + x * mid[i], 0) / N, 2);
    const vr = rd(f.reduce((s, x, i) => s + x * (mid[i] - f.reduce((a, y, j) => a + y * mid[j], 0) / N) ** 2, 0) / N, 2);
    const mi = f.indexOf(Math.max(...f)); if (f.filter((x) => x === f[mi]).length > 1) return null;
    const grp = ['[0; 30)', '[30; 60)', '[60; 90)', '[90; 120)', '[120; 150)'];
    return { q: `Thời gian (phút) tự học ở nhà mỗi ngày của ${N} học sinh được cho trong bảng: ${grp.map((g, i) => `${g}: ${f[i]} bạn`).join('; ')}.\na) Tính thời gian tự học trung bình (làm tròn đến hàng phần trăm).\nb) Nhóm nào chứa mốt?${d >= 5 ? '\nc) Tính phương sai của mẫu số liệu ghép nhóm (làm tròn đến hàng phần trăm).' : ''}\n(Ô đáp số: ghi kết quả câu a${d >= 5 ? '; câu c' : ''})`, ans: d >= 5 ? `${mean}; ${vr}` : mean, tex: d >= 5 ? `\\bar x \\approx ${t(mean)};\\ \\text{nhóm }${grp[mi].replace(/;/, ';\\ ')};\\ s^2 \\approx ${t(vr)}` : `\\bar x \\approx ${t(mean)};\\ \\text{nhóm }${grp[mi]}`,
      sol: ['Lời giải', `Giá trị đại diện các nhóm: ${mid.join('; ')}.`, `a) x̄ = (${f.map((x, i) => `${x}·${mid[i]}`).join(' + ')})/${N} ≈ ${n(mean)} (phút).`, `b) Nhóm có tần số lớn nhất là ${grp[mi]} (${f[mi]} bạn) nên nhóm này chứa mốt.`, ...(d >= 5 ? [`c) s² = (1/${N})·Σnᵢ(xᵢ − x̄)² ≈ ${n(vr)}.`] : [])].join('\n'),
      method: 'Mẫu số liệu ghép nhóm: dùng giá trị đại diện (trung điểm) của mỗi nhóm. x̄ = Σnᵢxᵢ/n; nhóm chứa mốt là nhóm có tần số lớn nhất; s² = Σnᵢ(xᵢ − x̄)²/n.' };
  } },
  { id: 'goc_dong_ho', grades: [4, 6], gens: ['angles'], d: [3, 5], think: true, make(d) {
    if (d >= 5) { const h = R(1, 5); const ang = Math.abs(30 * h - 0 + 15 - 90); void ang;
      const deg = Math.abs(30 * h + 15 - 180); const a2 = Math.min(deg, 360 - deg);
      return { q: `Lúc ${h} giờ 30 phút, kim giờ và kim phút của đồng hồ tạo thành một góc (góc nhỏ hơn) bằng bao nhiêu độ? Đó là góc nhọn, góc vuông hay góc tù?`, ans: a2, tex: `${a2}^\\circ\\text{ (${a2 < 90 ? 'góc nhọn' : a2 === 90 ? 'góc vuông' : 'góc tù'})}`,
        sol: ['Bài giải', 'Mặt đồng hồ chia 12 khoảng, mỗi khoảng 360° : 12 = 30°.', 'Lúc ' + h + ' giờ 30 phút, kim phút chỉ số 6 (ứng với 180°), kim giờ nằm chính giữa số ' + h + ' và số ' + (h + 1) + ' (ứng với ' + h + ' × 30° + 15° = ' + (30 * h + 15) + '°).', `Góc giữa hai kim: ${Math.max(180, 30 * h + 15)}° − ${Math.min(180, 30 * h + 15)}° = ${a2}°.`, `Đáp số: ${a2}°, là ${a2 < 90 ? 'góc nhọn' : a2 === 90 ? 'góc vuông' : 'góc tù'}.`].join('\n'),
        method: 'Mỗi khoảng giữa hai số trên mặt đồng hồ ứng với 30°. Chú ý: lúc h giờ 30 phút, kim giờ không chỉ đúng số h mà nằm giữa h và h + 1 (thêm 15°).' }; }
    const h = R(1, 6), a = 30 * h;
    return { q: `Lúc ${h} giờ đúng, kim giờ và kim phút của đồng hồ tạo thành một góc bằng bao nhiêu độ? Đó là góc nhọn, góc vuông, góc tù hay góc bẹt?`, ans: a, tex: `${a}^\\circ\\text{ (${a < 90 ? 'góc nhọn' : a === 90 ? 'góc vuông' : a < 180 ? 'góc tù' : 'góc bẹt'})}`,
      sol: ['Bài giải', 'Mặt đồng hồ được chia thành 12 khoảng bằng nhau, mỗi khoảng ứng với: 360° : 12 = 30°.', `Lúc ${h} giờ, kim phút chỉ số 12, kim giờ chỉ số ${h}, cách nhau ${h} khoảng.`, `Góc giữa hai kim là: 30° × ${h} = ${a}°`, `Đáp số: ${a}° (${a < 90 ? 'góc nhọn' : a === 90 ? 'góc vuông' : a < 180 ? 'góc tù' : 'góc bẹt'}).`].join('\n'),
      method: 'Mỗi khoảng giữa hai số liền nhau trên mặt đồng hồ ứng với 30°. Đếm số khoảng giữa hai kim rồi nhân với 30°. So sánh với 90° và 180° để phân loại góc.' };
  } },
  { id: 'vi_khuan', grades: [6, 7], gens: ['powers'], d: [3, 5], think: true, make() {
    const a = pick([1, 2, 3, 5]), step = pick([20, 30]), hrs = pick([2, 3]), k = (hrs * 60) / step, tot = a * 2 ** k;
    return { q: `Một loại vi khuẩn cứ sau ${step} phút lại phân đôi (mỗi con thành hai con). Ban đầu có ${a} con vi khuẩn. Hỏi sau ${hrs} giờ có bao nhiêu con vi khuẩn? Viết kết quả dưới dạng tích có lũy thừa rồi tính.`, ans: tot, tex: `${a === 1 ? '' : a + '\\cdot '}2^{${k}} = ${t(tot)}`,
      sol: ['Bài giải', `Đổi ${hrs} giờ = ${hrs * 60} phút. Số lần phân đôi: ${hrs * 60} : ${step} = ${k} (lần).`, `Sau mỗi lần phân đôi, số vi khuẩn nhân 2. Sau ${k} lần, số vi khuẩn là: ${a} · 2^${k} = ${a} · ${2 ** k} = ${n(tot)} (con).`, `Đáp số: ${n(tot)} con.`].join('\n'),
      method: 'Mỗi lần tăng gấp 2 thì sau k lần tăng gấp 2^k. Đếm số lần phân đôi = tổng thời gian : chu kì (đổi cùng đơn vị).' };
  } },
  { id: 'dat_hinh_vuong_can', grades: [7, 9], gens: ['sqrt'], d: [3, 5], make(d) {
    if (d >= 5) { const S = pick([50, 60, 75, 90, 120, 150, 200]), a = rd(Math.sqrt(S), 1), rope = rd(4 * Math.sqrt(S), 1);
      return { q: `Một mảnh đất hình vuông có diện tích ${S} m². Tính độ dài cạnh mảnh đất (làm tròn đến hàng phần mười) và độ dài hàng rào bao quanh mảnh đất (làm tròn đến hàng phần mười).`, ans: `${a}; ${rope}`, tex: `${u(a, 'm')};\\ ${u(rope, 'm')}`,
        sol: ['Lời giải', `Gọi cạnh mảnh đất là a (m), a > 0. Ta có a² = ${S} ⇒ a = √${S} ≈ ${n(rd(Math.sqrt(S), 4))} ≈ ${n(a)} (m).`, `Độ dài hàng rào: 4a = 4√${S} ≈ ${n(rope)} (m).`, 'Chú ý: tính 4√' + S + ' rồi mới làm tròn để kết quả chính xác hơn.'].join('\n'),
        method: 'Cạnh hình vuông = căn bậc hai số học của diện tích. Khi cần làm tròn, nên giữ giá trị chính xác đến bước cuối rồi mới làm tròn.' }; }
    const k = R(6, 25), S = k * k;
    return { q: `Một mảnh vườn hình vuông có diện tích ${S} m². Người ta rào xung quanh vườn bằng 3 vòng dây thép. Hỏi cần bao nhiêu mét dây thép?`, ans: 12 * k, tex: u(12 * k, 'm'),
      sol: ['Lời giải', `Cạnh mảnh vườn: √${S} = ${k} (m).`, `Chu vi mảnh vườn: 4 · ${k} = ${4 * k} (m).`, `Số dây thép cần: 3 · ${4 * k} = ${12 * k} (m).`].join('\n'),
      method: 'Từ diện tích hình vuông suy ra cạnh bằng căn bậc hai số học, rồi tính chu vi và nhân với số vòng rào.' };
  } },
  { id: 'que_tam_giac', grades: [7, 7], gens: ['triangle_ineq'], d: [3, 5], think: true, make() {
    const a = R(3, 9), b = R(a + 1, a + 8), lo = b - a, hi = a + b, evens = []; for (let c = lo + 1; c < hi; c++) if (c % 2 === 0) evens.push(c);
    return { q: `Bạn ${pick(NAME)} có hai que tính dài ${a} cm và ${b} cm. Bạn muốn chọn que thứ ba có độ dài là một số chẵn (cm) để ghép ba que thành một tam giác. Hỏi bạn có bao nhiêu cách chọn độ dài que thứ ba? Liệt kê các độ dài đó.`, ans: evens.length, tex: `${evens.length}\\text{ cách: }${evens.join(';\\ ')}\\text{ (cm)}`,
      sol: ['Lời giải', `Gọi độ dài que thứ ba là c (cm). Theo bất đẳng thức tam giác: ${b} − ${a} < c < ${b} + ${a}, tức ${lo} < c < ${hi}.`, `Các số chẵn thỏa mãn: ${evens.join(', ')}.`, `Vậy có ${evens.length} cách chọn.`].join('\n'),
      method: 'Ba đoạn thẳng tạo thành tam giác ⇔ mỗi cạnh lớn hơn hiệu và nhỏ hơn tổng hai cạnh còn lại. Chú ý bất đẳng thức chặt (không lấy hai đầu mút).' };
  } },
  { id: 'hop_qua_giay_goi', grades: [5, 7], gens: ['volume'], d: [4, 5], make() {
    const a = R(10, 30), Stp = 6 * a * a, extra = pick([10, 15, 20]), paper = rd((Stp * (100 + extra)) / 100, 2);
    return { q: `Một hộp quà hình lập phương có cạnh ${a} cm. Bạn ${pick(NAME)} muốn gói kín hộp quà bằng giấy màu, phần giấy gấp mép và hao hụt bằng ${extra}% diện tích toàn phần của hộp.\na) Tính thể tích hộp quà.\nb) Tính diện tích giấy cần dùng.`, ans: `${a ** 3}; ${paper}`, tex: parts(`${t(a ** 3)}\\text{ cm}^3`, `${t(paper)}\\text{ cm}^2`),
      sol: ['Bài giải', 'a) Thể tích hộp quà là:', `${a} × ${a} × ${a} = ${n(a ** 3)} (cm³)`, 'b) Diện tích toàn phần của hộp quà là:', `${a} × ${a} × 6 = ${n(Stp)} (cm²)`, 'Diện tích giấy cần dùng là:', `${n(Stp)} × (100 + ${extra}) : 100 = ${n(paper)} (cm²)`, `Đáp số: a) ${n(a ** 3)} cm³; b) ${n(paper)} cm².`].join('\n'),
      method: 'Hình lập phương cạnh a: V = a × a × a; diện tích toàn phần = a × a × 6. Cộng thêm phần hao hụt: nhân với (100 + p)%.' };
  } },
  { id: 'hinh_thoi_cheo', grades: [8, 8], gens: ['quad_angles', 'pythagoras'], d: [3, 5], make() {
    const [p, q, s] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
    return { q: `Hình thoi ABCD có hai đường chéo AC = ${2 * p} cm và BD = ${2 * q} cm cắt nhau tại O.\na) Tính độ dài cạnh hình thoi.\nb) Tính chu vi và diện tích hình thoi. (ghi: cạnh; chu vi; diện tích)`, ans: `${s}; ${4 * s}; ${2 * p * q}`, tex: `${u(s, 'cm')};\\ ${u(4 * s, 'cm')};\\ ${2 * p * q}\\text{ cm}^2`,
      sol: ['Lời giải', `Trong hình thoi, hai đường chéo vuông góc với nhau tại trung điểm mỗi đường: OA = ${p} cm, OB = ${q} cm, AC ⊥ BD.`, `a) Tam giác AOB vuông tại O: AB² = OA² + OB² = ${p * p} + ${q * q} = ${s * s} ⇒ AB = ${s} cm.`, `b) Chu vi: 4 · ${s} = ${4 * s} (cm). Diện tích: AC · BD : 2 = ${2 * p} · ${2 * q} : 2 = ${2 * p * q} (cm²).`].join('\n'),
      method: 'Dùng tính chất đường chéo hình thoi (vuông góc, cắt nhau tại trung điểm mỗi đường) để có tam giác vuông, áp dụng Pythagore. S hình thoi = tích hai đường chéo : 2.' };
  } },
  { id: 'hinh_thang_can_goc', grades: [8, 8], gens: ['quad_angles'], d: [3, 5], make() {
    const x = R(20, 40), D = 180 - 2 * x - R(1, 3) * 10; const A = (180 + D) / 2, B = A, Cc = 180 - A;
    if (!Number.isInteger(A) || A <= 90 || A >= 160) return null;
    return { q: `Hình thang cân ABCD (AB // CD, AB < CD) có $\\hat A - \\hat D = ${A - Cc}^\\circ$. Tính số đo các góc của hình thang. (ghi: Â; B̂; Ĉ; D̂)`, ans: `${A}; ${B}; ${Cc}; ${Cc}`, tex: `\\hat A = \\hat B = ${A}^\\circ;\\ \\hat C = \\hat D = ${Cc}^\\circ`,
      sol: ['Lời giải', 'Vì AB // CD nên Â + D̂ = 180° (hai góc trong cùng phía).', `Kết hợp Â − D̂ = ${A - Cc}°: Â = (180° + ${A - Cc}°) : 2 = ${A}°; D̂ = ${Cc}°.`, `Hình thang cân nên B̂ = Â = ${A}°, Ĉ = D̂ = ${Cc}°.`].join('\n'),
      method: 'Hình thang: hai góc kề một cạnh bên bù nhau. Hình thang cân: hai góc kề một đáy bằng nhau. Biết tổng và hiệu hai góc → dùng cách tìm hai số khi biết tổng và hiệu.' };
  } },
  { id: 'phan_thuc_tinh', grades: [8, 8], gens: ['rational_expr'], d: [3, 5], make() {
    const a = R(1, 6), k = R(1, 9); if (k === a || k === 0) return null;
    const val = fr(k - a, k);
    return { q: `Cho biểu thức $P = \\dfrac{x^2 - ${a * a}}{x^2 + ${a}x}$.\na) Tìm điều kiện xác định của P.\nb) Rút gọn P.\nc) Tính giá trị của P khi $x = ${k}$.\n(Ô đáp số: ghi giá trị câu c, dạng phân số tối giản)`, ans: fstr(val), tex: `x \\ne 0,\\ x \\ne -${a};\\ P = \\frac{x - ${a}}{x};\\ P = ${ftex(val)}`,
      sol: ['Lời giải', `a) P xác định khi x² + ${a}x ≠ 0 ⇔ x(x + ${a}) ≠ 0 ⇔ x ≠ 0 và x ≠ −${a}.`, `b) P = (x − ${a})(x + ${a}) / [x(x + ${a})] = (x − ${a})/x.`, `c) x = ${k} thỏa mãn điều kiện. P = (${k} − ${a})/${k} = ${fstr(val)}.`].join('\n'),
      method: 'Điều kiện xác định: mẫu khác 0. Rút gọn: phân tích tử và mẫu thành nhân tử rồi chia cho nhân tử chung. Kiểm tra điều kiện trước khi thay giá trị.' };
  } },
  { id: 'leu_chop', grades: [8, 8], gens: ['pyramid'], d: [3, 5], think: true, make() {
    const [half, h, d] = pick([[3, 4, 5], [1.5, 2, 2.5], [6, 8, 10], [5, 12, 13], [2.4, 3.2, 4]]), a = 2 * half, Sxq = rd(2 * a * d, 2);
    return { q: `Một chiếc lều cắm trại có dạng hình chóp tứ giác đều, cạnh đáy ${n(a)} m, chiều cao ${n(h)} m. Tính diện tích vải cần để may bốn mặt bên của lều (không tính phần mép).`, ans: Sxq, tex: `${t(Sxq)}\\text{ m}^2`,
      sol: ['Lời giải', 'Gọi O là tâm đáy, M là trung điểm một cạnh đáy. Trung đoạn SM là cạnh huyền của tam giác vuông SOM.', `OM = ${n(a)} : 2 = ${n(half)} (m); SM = √(SO² + OM²) = √(${n(h)}² + ${n(half)}²) = ${n(d)} (m).`, `Diện tích xung quanh: S = p · d = (4 · ${n(a)} : 2) · ${n(d)} = ${n(Sxq)} (m²).`].join('\n'),
      method: 'Diện tích xung quanh hình chóp đều = nửa chu vi đáy × trung đoạn. Nếu chưa biết trung đoạn, dùng Pythagore trong tam giác vuông tạo bởi chiều cao, trung đoạn và nửa cạnh đáy.' };
  } },
  { id: 'chop_sa_vuong_goc', grades: [11, 11], gens: ['pyramid'], d: [3, 5], think: true, make() {
    const [a, sa, sc] = pick([[2, 1, 3], [4, 2, 6], [6, 7, 11], [6, 3, 9], [8, 4, 12], [12, 14, 22]]);
    return { q: `Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh ${a} cm, SA vuông góc với mặt phẳng (ABCD) và SA = ${sa} cm. Tính độ dài cạnh SC và chứng minh tam giác SBC vuông. (Ô đáp số: ghi độ dài SC)`, ans: sc, tex: `SC = ${sc}\\text{ cm}`,
      sol: ['Lời giải', `AC là đường chéo hình vuông cạnh ${a}: AC = ${a}√2 ⇒ AC² = ${2 * a * a}.`, `SA ⊥ (ABCD) ⇒ SA ⊥ AC ⇒ tam giác SAC vuông tại A: SC² = SA² + AC² = ${sa * sa} + ${2 * a * a} = ${sc * sc} ⇒ SC = ${sc} cm.`, 'BC ⊥ AB (hình vuông) và BC ⊥ SA (SA ⊥ đáy) ⇒ BC ⊥ (SAB) ⇒ BC ⊥ SB ⇒ tam giác SBC vuông tại B.'].join('\n'),
      method: 'Đường thẳng vuông góc với mặt phẳng thì vuông góc với mọi đường thẳng trong mặt phẳng đó. Để chứng minh hai đường vuông góc, chứng minh một đường vuông góc với mặt phẳng chứa đường kia.' };
  } },
  { id: 'tam_nhin_hai_dang', grades: [9, 9], gens: ['circle'], d: [4, 5], think: true, make() {
    const h = pick([20, 30, 45, 50, 80, 100]), Rk = 6400, dkm = rd(Math.sqrt((Rk + h / 1000) ** 2 - Rk * Rk), 1);
    return { q: `Một người đứng trên ngọn hải đăng ở độ cao ${h} m so với mặt biển. Hỏi người đó có thể nhìn thấy xa nhất bao nhiêu ki-lô-mét (đến đường chân trời)? Coi Trái Đất là hình cầu bán kính 6400 km (làm tròn đến hàng phần mười).`, ans: dkm, tex: u(dkm, 'km'),
      sol: ['Lời giải', 'Gọi O là tâm Trái Đất, A là vị trí mắt người quan sát, B là điểm xa nhất nhìn thấy. AB là tiếp tuyến của đường tròn (O) tại B nên OB ⊥ AB.', `OA = 6400 + ${n(h / 1000)} = ${n(6400 + h / 1000)} (km); OB = 6400 km.`, `Tam giác OAB vuông tại B: AB = √(OA² − OB²) ≈ ${n(dkm)} (km).`].join('\n'),
      method: 'Tầm nhìn xa nhất là đoạn tiếp tuyến; tiếp tuyến vuông góc với bán kính tại tiếp điểm ⇒ dùng Pythagore. Chú ý đổi đơn vị m sang km.' };
  } },
  { id: 'tam_giac_deu_noi_tiep', grades: [9, 9], gens: ['cyclic_quad', 'circle'], d: [3, 5], make() {
    const a = pick([3, 6, 9, 12]), Rr = rd((a * Math.sqrt(3)) / 3, 2), Sc = rd(3.14 * (a * a) / 3, 2);
    return { q: `Một tam giác đều cạnh ${a} cm nội tiếp đường tròn (O).\na) Tính bán kính đường tròn (làm tròn đến hàng phần trăm).\nb) Tính diện tích hình tròn (O) (lấy π ≈ 3,14, làm tròn đến hàng phần trăm).`, ans: `${Rr}; ${Sc}`, tex: parts(`R = \\frac{${a}\\sqrt3}{3} \\approx ${t(Rr)}\\text{ cm}`, `${t(Sc)}\\text{ cm}^2`),
      sol: ['Lời giải', `Đường tròn ngoại tiếp tam giác đều cạnh a có bán kính R = a√3/3.`, `a) R = ${a}√3/3 ≈ ${n(Rr)} (cm).`, `b) R² = ${a * a}/3 ⇒ S = πR² ≈ 3,14 · ${n(rd((a * a) / 3, 4))} ≈ ${n(Sc)} (cm²).`].join('\n'),
      method: 'Tâm đường tròn ngoại tiếp tam giác đều là trọng tâm; R = 2/3 đường cao = a√3/3. Tính S từ R² chính xác rồi mới làm tròn.' };
  } },
  { id: 'ven_ba_mon', grades: [10, 10], gens: ['sets'], d: [3, 5], think: true, make() {
    const ab = R(2, 6), bc = R(2, 6), ac = R(2, 6), abc = R(1, Math.min(ab, bc, ac) - 0);
    const onlyA = R(3, 10), onlyB = R(3, 10), onlyC = R(3, 10);
    const A = onlyA + ab + ac - abc, B = onlyB + ab + bc - abc, Cc = onlyC + bc + ac - abc, any = A + B + Cc - ab - bc - ac + abc, none = R(1, 6);
    return { q: `Lớp 10A có ${any + none} học sinh. Có ${A} bạn thích bóng đá, ${B} bạn thích cầu lông, ${Cc} bạn thích bơi; ${ab} bạn thích cả bóng đá và cầu lông, ${bc} bạn thích cả cầu lông và bơi, ${ac} bạn thích cả bóng đá và bơi, ${abc} bạn thích cả ba môn. Hỏi có bao nhiêu bạn không thích môn nào trong ba môn trên?`, ans: none, tex: u(none, 'bạn'),
      sol: ['Lời giải', 'Gọi A, B, C là tập các bạn thích bóng đá, cầu lông, bơi.', `n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C) = ${A} + ${B} + ${Cc} − ${ab} − ${bc} − ${ac} + ${abc} = ${any}.`, `Số bạn không thích môn nào: ${any + none} − ${any} = ${none}.`].join('\n'),
      method: 'Dùng biểu đồ Ven hoặc công thức bao hàm – loại trừ cho ba tập hợp: cộng từng tập, trừ các giao đôi, cộng lại giao ba.' };
  } },
  { id: 'toa_do_tam_giac', grades: [10, 10], gens: ['coord2', 'vector2'], d: [3, 5], make() {
    const A = [R(-3, 3), R(-3, 3)], u1 = [R(1, 4), R(1, 4)], k = R(1, 2), B = [A[0] + u1[0], A[1] + u1[1]], Cp = [A[0] - k * u1[1], A[1] + k * u1[0]];
    const S = (k * (u1[0] ** 2 + u1[1] ** 2)) / 2;
    return { q: `Trong mặt phẳng tọa độ Oxy, cho A(${A.join('; ')}), B(${B.join('; ')}), C(${Cp.join('; ')}).\na) Chứng minh tam giác ABC vuông tại A.\nb) Tính diện tích tam giác ABC.`, ans: S, tex: `S = ${t(S)}`,
      sol: ['Lời giải', `a) AB→ = (${u1[0]}; ${u1[1]}), AC→ = (${-k * u1[1]}; ${k * u1[0]}). AB→ · AC→ = ${u1[0]}·(${-k * u1[1]}) + ${u1[1]}·${k * u1[0]} = 0 ⇒ AB ⊥ AC ⇒ tam giác ABC vuông tại A.`, `b) AB = √${u1[0] ** 2 + u1[1] ** 2}, AC = ${k}√${u1[0] ** 2 + u1[1] ** 2}. S = ½·AB·AC = ½·${k}·${u1[0] ** 2 + u1[1] ** 2} = ${n(S)}.`].join('\n'),
      method: 'Hai vectơ vuông góc ⇔ tích vô hướng bằng 0. Diện tích tam giác vuông = ½ tích hai cạnh góc vuông; độ dài vectơ (x; y) là √(x² + y²).' };
  } },
  { id: 'vong_quay', grades: [11, 11], gens: ['trig'], d: [3, 5], think: true, make() {
    const a = R(20, 40), b = R(10, a - 5), c = pick([10, 15, 20, 30]);
    return { q: `Độ cao (m) của một cabin trên vòng quay mặt trời sau t phút được mô hình hóa bởi $h(t) = ${a} + ${b}\\sin\\left(\\dfrac{\\pi t}{${c}}\\right)$, t ≥ 0.\na) Tìm độ cao lớn nhất của cabin.\nb) Tìm thời điểm đầu tiên (t > 0) cabin đạt độ cao lớn nhất.\nc) Sau bao lâu cabin quay hết một vòng?`, ans: `${a + b}; ${c / 2}; ${2 * c}`, tex: parts(u(a + b, 'm'), u(c / 2, 'phút'), u(2 * c, 'phút')),
      sol: ['Lời giải', `a) Vì sin(πt/${c}) ≤ 1 nên h(t) ≤ ${a} + ${b} = ${a + b}. Độ cao lớn nhất là ${a + b} m.`, `b) h đạt lớn nhất khi sin(πt/${c}) = 1 ⇔ πt/${c} = π/2 + k2π ⇔ t = ${n(c / 2)} + ${2 * c}k. Giá trị dương nhỏ nhất: t = ${n(c / 2)} phút.`, `c) Chu kì của h là T = 2π : (π/${c}) = ${2 * c} phút.`].join('\n'),
      method: 'Dùng tập giá trị −1 ≤ sin ≤ 1 để tìm GTLN/GTNN; giải phương trình lượng giác cơ bản sin x = 1; chu kì của sin(ax) là 2π/|a|.' };
  } },
  { id: 'nong_do_thuoc', grades: [11, 11], gens: ['limit'], d: [3, 5], make() {
    const a = R(2, 9) * 5, b = R(1, 5), t1 = R(1, 6), c1 = fr(a * t1, t1 + b);
    return { q: `Nồng độ một loại thuốc trong máu (mg/l) sau t giờ được cho bởi $C(t) = \\dfrac{${a}t}{t + ${b}}$.\na) Tính nồng độ thuốc sau ${t1} giờ.\nb) Khi thời gian rất lớn (t → +∞) thì nồng độ thuốc dần tới giá trị nào?\n(ghi: câu a dạng phân số tối giản; câu b)`, ans: `${fstr(c1)}; ${a}`, tex: parts(ftex(c1), `${a}\\text{ mg/l}`),
      sol: ['Lời giải', `a) C(${t1}) = ${a}·${t1}/(${t1} + ${b}) = ${fstr(c1)} (mg/l).`, `b) lim (t→+∞) ${a}t/(t + ${b}) = lim ${a}/(1 + ${b}/t) = ${a} (mg/l).`].join('\n'),
      method: 'Giới hạn tại vô cực của phân thức: chia cả tử và mẫu cho lũy thừa cao nhất của t; các số hạng dạng c/t dần về 0.' };
  } },
  { id: 'flycam_khong_gian', grades: [12, 12], gens: ['coord3'], d: [3, 5], make(d) {
    const A = [R(-5, 5), R(-5, 5), R(2, 8)], [x, y, z] = pick([[1, 2, 2], [2, 3, 6], [2, 6, 9], [4, 4, 7], [1, 4, 8]]), B = [A[0] + 2 * x, A[1] - 2 * y, A[2] + 2 * z];
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2], dd = 2 * Math.sqrt(x * x + y * y + z * z);
    if (d >= 5) { const nn = pick([[2, 1, 2], [1, 2, 2], [2, 2, 1]]), D = R(-9, 9), I = [R(-3, 3), R(-3, 3), R(-3, 3)], dist = Math.abs(nn[0] * I[0] + nn[1] * I[1] + nn[2] * I[2] + D) / 3;
      if (!dist || !Number.isInteger(dist * 3)) return null;
      return { q: `Trong không gian Oxyz, một quả bóng hình cầu có tâm I(${I.join('; ')}) đặt tiếp xúc với mặt sàn là mặt phẳng (P): ${nn[0]}x + ${nn[1]}y + ${nn[2]}z ${D < 0 ? '−' : '+'} ${Math.abs(D)} = 0. Tính bán kính quả bóng và viết phương trình mặt cầu. (Ô đáp số: ghi bán kính, dạng phân số nếu cần)`, ans: fstr(fr(Math.abs(nn[0] * I[0] + nn[1] * I[1] + nn[2] * I[2] + D), 3)), tex: `R = ${ftex(fr(Math.abs(nn[0] * I[0] + nn[1] * I[1] + nn[2] * I[2] + D), 3))}`,
        sol: ['Lời giải', 'Mặt cầu tiếp xúc với (P) nên bán kính bằng khoảng cách từ tâm I đến (P).', `R = |${nn[0]}·${I[0]} + ${nn[1]}·${I[1]} + ${nn[2]}·${I[2]} + ${D}| / √(${nn[0] ** 2} + ${nn[1] ** 2} + ${nn[2] ** 2}) = ${Math.abs(nn[0] * I[0] + nn[1] * I[1] + nn[2] * I[2] + D)}/3 = ${fstr(fr(Math.abs(nn[0] * I[0] + nn[1] * I[1] + nn[2] * I[2] + D), 3))}.`, `Phương trình mặt cầu: (x − ${I[0]})² + (y − ${I[1]})² + (z − ${I[2]})² = R².`].join('\n'),
        method: 'Mặt cầu tiếp xúc mặt phẳng ⇔ khoảng cách từ tâm đến mặt phẳng bằng bán kính. d(I,(P)) = |ax₀ + by₀ + cz₀ + D|/√(a² + b² + c²).' }; }
    return { q: `Trong không gian Oxyz (đơn vị trên mỗi trục là mét), hai chiếc flycam đang ở vị trí A(${A.join('; ')}) và B(${B.join('; ')}).\na) Tính khoảng cách giữa hai flycam.\nb) Một chiếc flycam thứ ba bay đến đúng trung điểm M của AB. Tìm tọa độ M.\n(Ô đáp số: ghi khoảng cách câu a)`, ans: dd, tex: `AB = ${dd}\\text{ m};\\ M(${M.join(';\\ ')})`,
      sol: ['Lời giải', `a) AB→ = (${2 * x}; ${-2 * y}; ${2 * z}) ⇒ AB = √(${4 * x * x} + ${4 * y * y} + ${4 * z * z}) = ${dd} (m).`, `b) M = ((${A[0]} + ${B[0]})/2; (${A[1]} + ${B[1]})/2; (${A[2]} + ${B[2]})/2) = (${M.join('; ')}).`].join('\n'),
      method: 'Khoảng cách hai điểm: AB = √((x_B − x_A)² + (y_B − y_A)² + (z_B − z_A)²). Trung điểm: trung bình cộng từng tọa độ.' };
  } },
  { id: 'bang_hai_chieu', grades: [12, 12], gens: ['cond_prob'], d: [3, 5], think: true, make() {
    const bm = R(20, 60), bn = R(20, 60), gm = R(20, 60), gn = R(20, 60), B = bm + bn, G = gm + gn, M = bm + gm, T = B + G;
    return { q: `Khảo sát ${T} học sinh về việc có tham gia câu lạc bộ Toán hay không: trong ${B} học sinh nam có ${bm} bạn tham gia; trong ${G} học sinh nữ có ${gm} bạn tham gia. Chọn ngẫu nhiên một học sinh.\na) Biết học sinh được chọn là nữ, tính xác suất học sinh đó tham gia câu lạc bộ.\nb) Biết học sinh được chọn có tham gia câu lạc bộ, tính xác suất học sinh đó là nam.\n(ghi phân số tối giản: câu a; câu b)`, ans: `${fstr(fr(gm, G))}; ${fstr(fr(bm, M))}`, tex: parts(ftex(fr(gm, G)), ftex(fr(bm, M))),
      sol: ['Lời giải', 'Gọi A: "học sinh tham gia CLB", N: "học sinh là nam", Nữ: "học sinh là nữ".', `a) P(A | Nữ) = P(A ∩ Nữ)/P(Nữ) = (${gm}/${T}) : (${G}/${T}) = ${gm}/${G} = ${fstr(fr(gm, G))}.`, `b) Số học sinh tham gia CLB: ${bm} + ${gm} = ${M}. P(N | A) = ${bm}/${M} = ${fstr(fr(bm, M))}.`].join('\n'),
      method: 'Xác suất có điều kiện P(B | A) = P(A ∩ B)/P(A); với bảng số liệu, đó là tỉ số giữa số phần tử của "ô giao" và số phần tử của điều kiện A.' };
  } },

  { id: 'xang_xe', grades: [5, 6], gens: ['decimal', 'proportion'], d: [3, 5], make() {
    const per = pick([6.5, 7.5, 8, 5.5, 9.2]), km = R(12, 48) * 10, L = rd((km / 100) * per, 4), price = R(20, 26) * 1000 + pick([0, 500]), cost = rd(L * price, 2);
    return { q: `Một ô tô cứ đi 100 km thì tiêu thụ ${n(per)} lít xăng.\na) Ô tô đi quãng đường ${km} km thì tiêu thụ bao nhiêu lít xăng?\nb) Giá xăng là ${n(price)} đồng một lít. Hỏi tiền xăng cho quãng đường đó là bao nhiêu?`, ans: `${L}; ${cost}`, tex: parts(u(L, 'lít'), u(cost, 'đồng')),
      sol: solve('a) Mỗi ki-lô-mét ô tô tiêu thụ số lít xăng là:', `${n(per)} : 100 = ${n(per / 100)} (lít)`, `Đi ${km} km ô tô tiêu thụ số lít xăng là:`, `${n(per / 100)} × ${km} = ${n(L)} (lít)`, 'b) Tiền xăng là:', `${n(price)} × ${n(L)} = ${n(cost)} (đồng)`, `Đáp số: a) ${n(L)} lít; b) ${n(cost)} đồng.`),
      method: 'Rút về đơn vị với số thập phân: tìm lượng xăng cho 1 km (chia cho 100 → dời dấu phẩy sang trái 2 chữ số), rồi nhân với số ki-lô-mét.' };
  } },
  { id: 'vai_may_ao', grades: [5, 6], gens: ['decimal'], d: [4, 5], think: true, make() {
    const per = pick([2.4, 2.8, 3.2, 1.6, 2.25]), cnt = R(8, 25), extra = rd(R(1, Math.floor(per * 10) - 1) / 10, 2), tot = rd(per * cnt + extra, 2);
    return { q: `Có ${n(tot)} m vải. Mỗi bộ quần áo may hết ${n(per)} m vải. Hỏi có thể may được nhiều nhất bao nhiêu bộ quần áo và còn thừa bao nhiêu mét vải? (ghi: số bộ; số mét vải thừa)`, ans: `${cnt}; ${extra}`, tex: `${cnt}\\text{ bộ};\\ ${u(extra, 'm')}`,
      sol: solve(`Ta có: ${n(tot)} : ${n(per)} = ${cnt} (dư ${n(extra)})`, `Vậy may được nhiều nhất ${cnt} bộ quần áo.`, 'Số vải còn thừa là:', `${n(tot)} − ${n(per)} × ${cnt} = ${n(extra)} (m)`, `Đáp số: ${cnt} bộ; thừa ${n(extra)} m vải.`),
      method: 'Phép chia có dư với số thập phân: lấy phần nguyên của thương là số bộ may được; số dư (tính bằng số vải − số vải đã dùng) là phần thừa. Không làm tròn lên vì không đủ vải cho bộ tiếp theo.' };
  } },
];

/** Sinh lại đúng một mẫu (dùng cho bài luyện lại cùng dạng). */
export function makeWordProblem(wid, grade, d) {
  const w = WORD_PROBLEMS.find((x) => x.id === wid);
  if (!w) return null;
  const dd = Math.max(w.d[0], Math.min(w.d[1], d));
  for (let i = 0; i < 20; i++) {
    try {
      const out = w.make(dd, grade);
      if (out && out.q && out.ans !== undefined && !/NaN|undefined|Infinity/.test(out.q + out.ans + out.sol)) return { ...out, wid };
    } catch { /* thử lại */ }
  }
  return null;
}

/**
 * Chọn một mẫu bài có lời văn phù hợp với chủ đề, lớp và độ khó. Trả về null nếu không có.
 * Ưu tiên mẫu "tư duy" cho câu tư duy.
 */
export function pickWordProblem(topic, grade, d, thinking = false, avoid = new Set()) {
  const gen = topic.gen;
  const fits = WORD_PROBLEMS.filter((w) => w.gens.includes(gen) && grade >= w.grades[0] && grade <= w.grades[1]);
  if (!fits.length) return null;
  let pool = fits.filter((w) => d >= w.d[0] && d <= w.d[1]);
  if (!pool.length) pool = fits.filter((w) => d >= w.d[0] - 1); // nới độ khó một bậc
  if (!pool.length) return null;
  if (pool.some((w) => !avoid.has(w.id))) pool = pool.filter((w) => !avoid.has(w.id));
  if (thinking && pool.some((w) => w.think)) pool = pool.filter((w) => w.think);
  for (let i = 0; i < 12; i++) {
    const w = pick(pool);
    try {
      const out = w.make(d, grade);
      if (out && out.q && out.ans !== undefined && !/NaN|undefined|Infinity/.test(out.q + out.ans + out.sol)) return { ...out, wid: w.id };
    } catch { /* thử mẫu khác */ }
  }
  return null;
}
