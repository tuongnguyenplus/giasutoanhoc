// Ngân hàng chuyên sâu LỚP 5 — mỗi chủ đề SGK có một "bậc thang tư duy" từ mức 1 đến mức 6:
//   1 Nhận biết · 2 Thông hiểu · 3 Vận dụng · 4 Vận dụng (nhiều bước) · 5 Vận dụng cao · 6 Nâng cao (bồi dưỡng HSG)
// Dạng bài soạn theo SGK, vở bài tập, sách bài tập, đề kiểm tra và các chuyên đề Toán nâng cao lớp 5
// (phần bù phân số, dời dấu phẩy, quên dấu phẩy, kéo dài đáy, chuyển kho, nước trong hạt tươi, pha loãng,
// tàu qua cầu, vận tốc trung bình, sơn khối lập phương, đánh số trang...). Không chép nguyên văn sách.
//
// Trường của mỗi mẫu: id, topics (mã chủ đề), d [từ, đến], think (bài tư duy), mcq (dùng được cho trắc nghiệm),
// essay (mặc định true), make(d) → { q, ans, tex, sol, method, wrongs? }.

import { R, pick, gcd, rd, C, n, t, u, parts, fr, ftex, fstr, NAME, two, solve } from './wp-helpers.js';

const HANG = ['phần mười', 'phần trăm', 'phần nghìn'];

export const GRADE5 = [
  // ============ 5-1 · Ôn tập phân số, hỗn số ============
  { id: 'g5_ps_ra_stp', topics: ['5-1', '5-2'], d: [1, 2], mcq: true, essay: false, make() {
    const [a, b] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [7, 20], [9, 25], [13, 50]]);
    const v = a / b;
    return { q: `Phân số $\\frac{${a}}{${b}}$ viết dưới dạng số thập phân là:`, ans: v, tex: t(v),
      sol: `Đưa về phân số thập phân: ${a}/${b} = ${a * (100 / b) % 1 === 0 ? `${a * (100 / b)}/100` : `${a * (1000 / b)}/1000`} = ${n(v)}.`, method: 'Nhân cả tử và mẫu với cùng một số để mẫu số thành 10, 100, 1000…, rồi viết thành số thập phân (hoặc lấy tử chia mẫu).',
      wrongs: [[rd(b / a, 3) === v ? v + 1 : rd(b / a, 3), 'Em đã lấy mẫu chia cho tử.'], [rd(a / 10 + b / 100, 3), 'Không ghép tử và mẫu thành số thập phân; phải lấy tử chia cho mẫu.']] };
  } },
  { id: 'g5_hon_so_tinh', topics: ['5-1'], d: [2, 3], mcq: true, make() {
    const w1 = R(1, 4), w2 = R(1, 3), dd = pick([2, 3, 4, 5, 6]), a = R(1, dd - 1), b = R(1, dd - 1), num = (w1 + w2) * dd + a + b, res = fr(num, dd);
    return { q: `Tính: $${w1}\\frac{${a}}{${dd}} + ${w2}\\frac{${b}}{${dd}}$ (viết kết quả dạng phân số tối giản)`, ans: fstr(res), tex: ftex(res),
      sol: `${w1} ${a}/${dd} = ${w1 * dd + a}/${dd}; ${w2} ${b}/${dd} = ${w2 * dd + b}/${dd}.\nTổng: ${w1 * dd + a}/${dd} + ${w2 * dd + b}/${dd} = ${num}/${dd} = ${fstr(res)}.`,
      method: 'Chuyển hỗn số thành phân số (phần nguyên × mẫu + tử), rồi cộng hai phân số cùng mẫu. Có thể cộng riêng phần nguyên và phần phân số.',
      wrongs: [[fstr(fr(w1 + w2 + a + b, dd)), 'Em đã cộng phần nguyên vào tử số mà không nhân với mẫu.'], [fstr(fr(a + b, dd * 2)), 'Không cộng mẫu với mẫu.']] };
  } },
  { id: 'g5_voi_chay_phan_so', topics: ['5-1'], d: [3, 4], make() {
    const [x, y] = pick([[3, 6], [4, 6], [4, 12], [5, 10], [6, 9], [3, 4], [2, 5]]);
    const both = fr(x + y, x * y), left = fr(x * y - x - y, x * y);
    return { q: `Vòi nước thứ nhất mỗi giờ chảy được $\\frac{1}{${x}}$ bể, vòi thứ hai mỗi giờ chảy được $\\frac{1}{${y}}$ bể. Bể đang cạn.\na) Nếu mở cả hai vòi cùng lúc thì sau 1 giờ được bao nhiêu phần bể?\nb) Khi đó còn bao nhiêu phần bể nữa thì đầy?`, ans: `${fstr(both)}; ${fstr(left)}`, tex: parts(ftex(both) + '\\text{ bể}', ftex(left) + '\\text{ bể}'),
      sol: solve('a) Sau 1 giờ cả hai vòi chảy được:', `1/${x} + 1/${y} = ${fstr(both)} (bể)`, 'b) Coi cả bể là 1. Số phần bể còn lại là:', `1 − ${fstr(both)} = ${fstr(left)} (bể)`, `Đáp số: a) ${fstr(both)} bể; b) ${fstr(left)} bể.`),
      method: 'Cộng hai phân số khác mẫu (quy đồng). "Cả bể" được coi là 1 đơn vị = phân số có tử bằng mẫu.' };
  } },
  { id: 'g5_phan_bu', topics: ['5-1'], d: [4, 5], think: true, mcq: true, make() {
    const a = R(2020, 2099), gt = Math.random() < 0.5;
    const L = gt ? `\\frac{${a}}{${a + 1}}` : `\\frac{${a + 1}}{${a + 2}}`, Rr = gt ? `\\frac{${a + 1}}{${a + 2}}` : `\\frac{${a}}{${a + 1}}`, ans = gt ? '<' : '>';
    return { q: `Không quy đồng mẫu số, hãy so sánh hai phân số: $${L}$ và $${Rr}$ (điền dấu $>$, $<$ hoặc $=$)`, ans, tex: ans,
      sol: ['Bài giải', `Phần bù đến 1: 1 − ${a}/${a + 1} = 1/${a + 1}; 1 − ${a + 1}/${a + 2} = 1/${a + 2}.`, `Vì 1/${a + 1} > 1/${a + 2} (cùng tử, mẫu bé hơn thì lớn hơn) nên ${a}/${a + 1} < ${a + 1}/${a + 2}.`, `Vậy phân số bên trái ${ans} phân số bên phải.`].join('\n'),
      method: 'So sánh bằng "phần bù": hai phân số bé hơn 1, phân số nào có phần bù (đến 1) lớn hơn thì phân số đó bé hơn.',
      wrongs: [[gt ? '>' : '<', 'Hai phân số có tử và mẫu đều lớn hơn chưa chắc lớn hơn; hãy so sánh phần bù đến 1.'], ['=', 'Hai phân số không bằng nhau vì phần bù khác nhau.']] };
  } },
  { id: 'g5_tong_tu_mau', topics: ['5-1', '5-7'], d: [5, 6], think: true, make() {
    const a = R(5, 40), D = R(3, 25), b = a + D, S = a + b;
    return { q: `Một phân số có tổng của tử số và mẫu số bằng ${S}, mẫu số lớn hơn tử số ${D} đơn vị. Tìm phân số đó.`, ans: `${a}/${b}`, tex: `\\frac{${a}}{${b}}`,
      sol: solve('Tử số và mẫu số là hai số có tổng ' + S + ' và hiệu ' + D + '.', 'Mẫu số là:', `(${S} + ${D}) : 2 = ${b}`, 'Tử số là:', `${b} − ${D} = ${a}`, `Phân số cần tìm là ${a}/${b}.`, `Đáp số: ${a}/${b}.`),
      method: 'Chuyển về bài toán tìm hai số khi biết tổng và hiệu: tổng = tử + mẫu, hiệu = mẫu − tử.' };
  } },
  { id: 'g5_them_tu_mau', topics: ['5-1', '5-7'], d: [6, 6], think: true, make() {
    for (let i = 0; i < 40; i++) {
      const [p, q] = pick([[2, 3], [3, 4], [3, 5], [4, 5], [5, 7], [5, 6], [4, 7]]), k = R(3, 9), x = R(2, 15), tu = p * k - x, mau = q * k - x;
      if (tu > 0 && gcd(tu, mau) === 1 && tu < mau) return { q: `Cho phân số $\\frac{${tu}}{${mau}}$. Hỏi phải cùng thêm vào cả tử số và mẫu số một số tự nhiên nào để được phân số mới bằng $\\frac{${p}}{${q}}$?`, ans: x, tex: `${x}`,
        sol: solve(`Khi cùng thêm một số vào tử và mẫu thì hiệu giữa mẫu và tử không đổi: ${mau} − ${tu} = ${mau - tu}.`, `Phân số mới bằng ${p}/${q}: coi tử mới là ${p} phần, mẫu mới là ${q} phần, hiệu số phần là ${q} − ${p} = ${q - p} (phần).`, `Giá trị một phần là: ${mau - tu} : ${q - p} = ${k}`, `Tử số mới là: ${k} × ${p} = ${p * k}`, `Số cần thêm là: ${p * k} − ${tu} = ${x}`, `Thử lại: (${tu} + ${x})/(${mau} + ${x}) = ${p * k}/${q * k} = ${p}/${q} ✓`, `Đáp số: ${x}.`),
        method: 'Tìm "đại lượng không đổi": cùng thêm (hoặc bớt) một số ở tử và mẫu thì HIỆU giữa mẫu và tử không đổi → đưa về bài toán hiệu – tỉ.' };
    }
    return null;
  } },
  { id: 'g5_tinh_nhanh_day_ps', topics: ['5-1'], d: [5, 6], think: true, make(d) {
    if (d === 5) { const k = R(4, 8), last = 2 ** k;
      return { q: `Tính nhanh: $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\ldots + \\frac{1}{${last}}$`, ans: `${last - 1}/${last}`, tex: `\\frac{${last - 1}}{${last}}`,
        sol: ['Bài giải', 'Nhận xét: 1/2 = 1 − 1/2; 1/4 = 1/2 − 1/4; 1/8 = 1/4 − 1/8; …', `Tổng = (1 − 1/2) + (1/2 − 1/4) + … + (1/${last / 2} − 1/${last}) = 1 − 1/${last} = ${last - 1}/${last}.`].join('\n'),
        method: 'Mỗi phân số bằng hiệu của phân số đứng trước nó và chính nó; các số hạng ở giữa triệt tiêu nhau. Có thể minh họa bằng việc chia đôi liên tiếp một hình vuông.' }; }
    const m = R(5, 12);
    return { q: `Tính nhanh: $\\frac{1}{1\\times 2} + \\frac{1}{2\\times 3} + \\frac{1}{3\\times 4} + \\ldots + \\frac{1}{${m}\\times ${m + 1}}$`, ans: `${m}/${m + 1}`, tex: `\\frac{${m}}{${m + 1}}`,
      sol: ['Bài giải', 'Nhận xét: 1/(1×2) = 1 − 1/2; 1/(2×3) = 1/2 − 1/3; 1/(3×4) = 1/3 − 1/4; …', `Tổng = 1 − 1/2 + 1/2 − 1/3 + … + 1/${m} − 1/${m + 1} = 1 − 1/${m + 1} = ${m}/${m + 1}.`].join('\n'),
      method: 'Tách mỗi phân số 1/(n × (n + 1)) thành hiệu 1/n − 1/(n + 1); các số hạng ở giữa triệt tiêu nhau, chỉ còn số đầu và số cuối.' };
  } },

  // ============ 5-2 · Số thập phân; so sánh, làm tròn ============
  { id: 'g5_hang_stp', topics: ['5-2'], d: [1, 1], mcq: true, essay: false, make() {
    const ip = R(10, 999), dec = [R(1, 9), R(1, 9), R(1, 9)], pos = R(0, 2), digit = dec[pos];
    if (dec.indexOf(digit) !== pos || String(ip).includes(String(digit))) return null;
    const num = `${ip},${dec.join('')}`;
    return { q: `Chữ số ${digit} trong số thập phân $${num.replace(',', '{,}')}$ thuộc hàng nào?`, ans: `hàng ${HANG[pos]}`, tex: `\\text{hàng ${HANG[pos]}}`,
      sol: `Phần thập phân ${dec.join('')}: chữ số thứ nhất sau dấu phẩy là hàng phần mười, thứ hai là hàng phần trăm, thứ ba là hàng phần nghìn. Chữ số ${digit} đứng thứ ${pos + 1} → hàng ${HANG[pos]}.`, method: 'Đếm vị trí chữ số sau dấu phẩy: phần mười – phần trăm – phần nghìn.',
      wrongs: HANG.filter((_, i) => i !== pos).map((h) => [`hàng ${h}`, 'Em đếm sai vị trí của chữ số sau dấu phẩy.']).concat([[`hàng ${['chục', 'trăm', 'đơn vị'][pos]}`, 'Đó là hàng của phần nguyên (trước dấu phẩy).']]) };
  } },
  { id: 'g5_viet_stp', topics: ['5-2'], d: [1, 2], mcq: true, essay: false, make() {
    const a = R(1, 99), b = R(1, 9), c = R(1, 9), v = rd(a + b / 10 + c / 1000, 4);
    return { q: `Số thập phân gồm ${a} đơn vị, ${b} phần mười và ${c} phần nghìn viết là:`, ans: v, tex: t(v),
      sol: `${a} đơn vị → phần nguyên ${a}; ${b} phần mười → chữ số ${b} ở hàng phần mười; 0 phần trăm → chữ số 0; ${c} phần nghìn → chữ số ${c}. Số đó là ${n(v)}.`, method: 'Viết lần lượt từng hàng; hàng nào không có thì viết chữ số 0 vào hàng đó.',
      wrongs: [[rd(a + b / 10 + c / 100, 4), 'Em quên viết chữ số 0 ở hàng phần trăm.'], [rd(a + b / 100 + c / 1000, 4), 'Chữ số ' + b + ' phải ở hàng phần mười.']] };
  } },
  { id: 'g5_so_lon_nhat_stp', topics: ['5-2'], d: [2, 3], mcq: true, essay: false, make() {
    const base = R(1, 9), x = rd(base + R(80, 89) / 100, 2), y = rd(base + 0.9, 1), z = rd(base + R(850, 899) / 1000, 3), w = rd(base + R(100, 799) / 1000, 3);
    const arr = [x, y, z, w].sort(() => Math.random() - 0.5), mx = Math.max(...arr);
    return { q: `Số lớn nhất trong các số ${arr.map((v) => `$${t(v)}$`).join('; ')} là:`, ans: mx, tex: t(mx),
      sol: `Các số có cùng phần nguyên ${base}. So sánh hàng phần mười: số có chữ số 9 ở hàng phần mười là lớn nhất → ${n(mx)}.`, method: 'So sánh phần nguyên trước; nếu bằng nhau thì so sánh lần lượt hàng phần mười, phần trăm, phần nghìn. Số có nhiều chữ số hơn ở phần thập phân chưa chắc đã lớn hơn.',
      wrongs: arr.filter((v) => v !== mx).map((v) => [v, 'Không phải cứ nhiều chữ số sau dấu phẩy là lớn hơn — hãy so sánh từ hàng phần mười.']) };
  } },
  { id: 'g5_stp_tu_chu_so', topics: ['5-2'], d: [4, 5], think: true, mcq: true, make(d) {
    const ds = [0, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 3)].sort((a, b) => a - b);
    const nz = ds.filter((x) => x), small = Number(`${nz[0]}0.${ds.filter((x) => x !== nz[0] && x !== 0).join('')}`);
    const desc = [...ds].reverse(), big = Number(`${desc[0]}${desc[1]}.${desc[2]}${desc[3]}`);
    const wantBig = d === 4;
    const ans = wantBig ? big : small;
    return { q: `Từ bốn chữ số ${ds.join(', ')}, hãy viết số thập phân ${wantBig ? 'lớn nhất' : 'bé nhất'} có hai chữ số ở phần nguyên và hai chữ số ở phần thập phân (mỗi chữ số dùng đúng một lần).`, ans, tex: t(ans),
      sol: wantBig ? ['Bài giải', 'Muốn số lớn nhất, chữ số lớn nhất đặt ở hàng cao nhất (hàng chục), rồi giảm dần sang phải.', `Số cần tìm: ${n(big)}.`].join('\n')
        : ['Bài giải', 'Muốn số bé nhất, hàng chục phải là chữ số bé nhất KHÁC 0 (chữ số 0 không đứng đầu).', `Hàng chục: ${nz[0]}; hàng đơn vị: 0 (chữ số bé nhất còn lại); phần thập phân xếp tăng dần.`, `Số cần tìm: ${n(small)}.`].join('\n'),
      method: 'Lớn nhất: xếp các chữ số giảm dần từ trái sang phải. Bé nhất: xếp tăng dần nhưng chữ số đầu tiên phải khác 0.',
      wrongs: wantBig ? [[Number(`${desc[0]}${desc[1]}.${desc[3]}${desc[2]}`), 'Phần thập phân cũng phải xếp giảm dần.']] : [[Number(`0${nz[0]}.${ds.slice(2).join('')}`) || Number(`${nz[0]}${nz[1]}.0${nz[2]}`), 'Số có hai chữ số ở phần nguyên không được bắt đầu bằng chữ số 0.']] };
  } },
  { id: 'g5_lam_tron_nguoc', topics: ['5-2'], d: [5, 6], think: true, make() {
    const a = R(1, 9), b = R(1, 8), mid = rd(a + b / 10, 1), lo = rd(mid - 0.05, 2), hi = rd(mid + 0.04, 2);
    return { q: `Một số thập phân có hai chữ số ở phần thập phân, khi làm tròn đến hàng phần mười thì được $${t(mid)}$. Tìm số lớn nhất và số bé nhất có thể có. (ghi: số lớn nhất; số bé nhất)`, ans: `${hi}; ${lo}`, tex: `${t(hi)};\\ ${t(lo)}`,
      sol: ['Bài giải', `Số làm tròn được ${n(mid)} khi nó nằm trong khoảng từ ${n(lo)} đến ${n(hi)}:`, `– Số bé nhất: ${n(lo)} (chữ số hàng phần trăm là 5 nên làm tròn lên thành ${n(mid)}).`, `– Số lớn nhất: ${n(hi)} (chữ số hàng phần trăm là 4 nên giữ nguyên ${n(mid)}).`, `Đáp số: ${n(hi)}; ${n(lo)}.`].join('\n'),
      method: 'Suy luận ngược quy tắc làm tròn: chữ số hàng phần trăm từ 5 trở lên thì làm tròn lên, bé hơn 5 thì giữ nguyên.' };
  } },
  { id: 'g5_stn_giua_hai_stp', topics: ['5-2'], d: [2, 3], make() {
    const a = R(2, 20), lo = rd(a - 1 + R(1, 9) / 10, 1), hi = rd(a + 1 + R(1, 9) / 100, 2);
    return { q: `Tìm các số tự nhiên x, biết: $${t(lo)} < x < ${t(hi)}$ (liệt kê các số)`, ans: `${a}; ${a + 1}`, tex: `x \\in \\{${a};\\ ${a + 1}\\}`,
      sol: `Các số tự nhiên lớn hơn ${n(lo)} và bé hơn ${n(hi)} là ${a} và ${a + 1}.\nĐáp số: x = ${a}; x = ${a + 1}.`, method: 'So sánh phần nguyên: số tự nhiên lớn hơn ' + n(lo) + ' thì ít nhất là ' + a + '; bé hơn ' + n(hi) + ' thì nhiều nhất là ' + (a + 1) + '.' };
  } },

  // ============ 5-3 · Cộng, trừ số thập phân ============
  { id: 'g5_thung_dau', topics: ['5-3'], d: [2, 4], mcq: true, make() {
    const tot = rd(R(250, 450) / 10, 1), l1 = rd(R(60, 120) / 10 + 0.05, 2), less = rd(R(10, 40) / 10, 1), l2 = rd(l1 - less, 2), left = rd(tot - l1 - l2, 2);
    return { q: `Một thùng có ${n(tot)} lít dầu. Lần thứ nhất người ta lấy ra ${n(l1)} lít, lần thứ hai lấy ra ít hơn lần thứ nhất ${n(less)} lít. Hỏi trong thùng còn lại bao nhiêu lít dầu?`, ans: left, tex: u(left, 'l'),
      sol: solve('Lần thứ hai lấy ra số lít dầu là:', `${n(l1)} − ${n(less)} = ${n(l2)} (l)`, 'Cả hai lần lấy ra là:', `${n(l1)} + ${n(l2)} = ${n(rd(l1 + l2, 2))} (l)`, 'Trong thùng còn lại số lít dầu là:', `${n(tot)} − ${n(rd(l1 + l2, 2))} = ${n(left)} (l)`, `Đáp số: ${n(left)} l.`),
      method: 'Bài toán ba bước: tìm lần lấy thứ hai ("ít hơn" → trừ), tìm tổng đã lấy, rồi lấy số ban đầu trừ đi. Đặt tính thẳng hàng dấu phẩy.',
      wrongs: [[rd(tot - l1 - (l1 + less), 2), '"Ít hơn" phải trừ, không cộng.'], [rd(tot - l1, 2), 'Em mới trừ lần lấy thứ nhất.']] };
  } },
  { id: 'g5_tim_x_2_tang', topics: ['5-3'], d: [3, 4], mcq: true, make() {
    const x = rd(R(105, 499) / 10, 1), a = rd(R(10, 99) / 10, 1), b = rd(R(10, 99) / 100, 2), rhs1 = rd(x - a, 2), c = rd(R(10, 50) / 10, 1), r2 = rd(rhs1 - c, 2);
    if (r2 <= 0) return null;
    return { q: `Tìm x: $x - ${t(a)} = ${t(r2)} + ${t(c)}$`, ans: x, tex: `x = ${t(x)}`,
      sol: `x − ${n(a)} = ${n(r2)} + ${n(c)}\nx − ${n(a)} = ${n(rhs1)}\nx = ${n(rhs1)} + ${n(a)}\nx = ${n(x)}`, method: 'Tính vế phải trước cho gọn, rồi tìm số bị trừ = hiệu + số trừ.',
      wrongs: [[rd(rhs1 - a, 2), 'Muốn tìm số bị trừ phải lấy hiệu CỘNG số trừ.']], _b: b };
  } },
  { id: 'g5_tinh_nhanh_cong', topics: ['5-3'], d: [4, 5], think: true, mcq: true, make() {
    const X = R(2, 9) * 10, Y = R(1, 5) * 10, a = rd(R(101, 899) / 100, 2), b = rd(R(101, 899) / 100, 2);
    const terms = [a, b, rd(X - a, 2), rd(Y - b, 2)];
    return { q: `Tính bằng cách thuận tiện nhất: $${t(terms[0])} + ${t(terms[1])} + ${t(terms[2])} + ${t(terms[3])}$`, ans: X + Y, tex: `${X + Y}`,
      sol: `= (${n(terms[0])} + ${n(terms[2])}) + (${n(terms[1])} + ${n(terms[3])})\n= ${X} + ${Y}\n= ${X + Y}`, method: 'Dùng tính chất giao hoán và kết hợp: nhóm các số hạng có tổng là số tròn chục (phần thập phân cộng lại tròn đơn vị).',
      wrongs: [[X + Y + 1, 'Em nhớ sai khi cộng phần thập phân.']] };
  } },
  { id: 'g5_tbc_stp', topics: ['5-3', '5-4'], d: [4, 5], mcq: true, make() {
    const avg = rd(R(80, 160) / 10, 1), s1 = rd(R(60, 120) / 10 + 0.05, 2), more = rd(R(10, 40) / 10, 1), s2 = rd(s1 + more, 2), s3 = rd(3 * avg - s1 - s2, 2);
    if (s3 <= 0) return null;
    return { q: `Trung bình cộng của ba số là $${t(avg)}$. Số thứ nhất là $${t(s1)}$, số thứ hai lớn hơn số thứ nhất $${t(more)}$. Tìm số thứ ba.`, ans: s3, tex: t(s3),
      sol: solve('Tổng của ba số là:', `${n(avg)} × 3 = ${n(rd(avg * 3, 2))}`, 'Số thứ hai là:', `${n(s1)} + ${n(more)} = ${n(s2)}`, 'Số thứ ba là:', `${n(rd(avg * 3, 2))} − ${n(s1)} − ${n(s2)} = ${n(s3)}`, `Đáp số: ${n(s3)}.`),
      method: 'Từ trung bình cộng suy ra tổng (TBC × số các số hạng); tìm các số đã biết rồi lấy tổng trừ đi.', wrongs: [[rd(avg - s1 - s2 > 0 ? avg - s1 - s2 : avg * 3 - s1, 2), 'Phải nhân trung bình cộng với 3 để được tổng.']] };
  } },
  { id: 'g5_quen_dau_phay', topics: ['5-3'], d: [6, 6], think: true, make() {
    const N = R(100, 900), D = rd(R(101, 999) / 100, 2), S = rd(N + D, 2), W = Math.round(N + D * 100);
    return { q: `Khi cộng một số tự nhiên với một số thập phân có hai chữ số ở phần thập phân, bạn ${pick(NAME)} quên mất dấu phẩy của số thập phân nên được kết quả là ${W}. Biết tổng đúng là $${t(S)}$. Tìm hai số đó. (ghi: số tự nhiên; số thập phân)`, ans: `${N}; ${D}`, tex: `${N};\\ ${t(D)}`,
      sol: ['Bài giải', 'Quên dấu phẩy của số thập phân có hai chữ số ở phần thập phân thì số đó bị gấp lên 100 lần, tức là tăng thêm 99 lần chính nó.', 'Tổng sai hơn tổng đúng là:', `${W} − ${n(S)} = ${n(rd(W - S, 2))}`, 'Số thập phân là:', `${n(rd(W - S, 2))} : 99 = ${n(D)}`, 'Số tự nhiên là:', `${n(S)} − ${n(D)} = ${N}`, `Đáp số: ${N} và ${n(D)}.`].join('\n'),
      method: 'Phân tích sai lầm: bỏ dấu phẩy của số có 2 chữ số thập phân = nhân số đó với 100 (tăng thêm 99 lần). Phần chênh lệch giữa tổng sai và tổng đúng bằng 99 lần số thập phân.' };
  } },
  { id: 'g5_chu_vi_tam_giac_stp', topics: ['5-3'], d: [3, 4], make() {
    const a = rd(R(30, 90) / 10, 1), more = rd(R(5, 25) / 10, 1), b = rd(a + more, 2), less = rd(R(20, 50) / 10, 1), c = rd(a + b - less, 2);
    return { q: `Một hình tam giác có cạnh thứ nhất dài ${n(a)} m, cạnh thứ hai dài hơn cạnh thứ nhất ${n(more)} m, cạnh thứ ba ngắn hơn tổng hai cạnh kia ${n(less)} m. Tính chu vi hình tam giác.`, ans: rd(a + b + c, 2), tex: u(rd(a + b + c, 2), 'm'),
      sol: solve('Cạnh thứ hai dài là:', `${n(a)} + ${n(more)} = ${n(b)} (m)`, 'Cạnh thứ ba dài là:', `${n(a)} + ${n(b)} − ${n(less)} = ${n(c)} (m)`, 'Chu vi hình tam giác là:', `${n(a)} + ${n(b)} + ${n(c)} = ${n(rd(a + b + c, 2))} (m)`, `Đáp số: ${n(rd(a + b + c, 2))} m.`),
      method: 'Tìm lần lượt từng cạnh theo dữ kiện, chu vi tam giác = tổng ba cạnh.' };
  } },

  // ============ 5-4 · Nhân, chia số thập phân ============
  { id: 'g5_nhan_nham_01', topics: ['5-4'], d: [1, 2], mcq: true, essay: false, make() {
    const x = rd(R(100, 9999) / 100, 2), op = pick([['\\times 10', 10], ['\\times 0{,}1', 0.1], ['\\times 100', 100], ['\\times 0{,}01', 0.01], [': 0{,}1', 10], [': 10', 0.1]]), v = rd(x * op[1], 4);
    return { q: `Tính nhẩm: $${t(x)} ${op[0]}$`, ans: v, tex: t(v),
      sol: `${op[1] >= 10 ? `Nhân với ${op[1]} (hoặc chia cho ${n(1 / op[1])}) → dời dấu phẩy sang PHẢI ${Math.log10(op[1])} chữ số` : `Nhân với ${n(op[1])} (hoặc chia cho ${n(1 / op[1])}) → dời dấu phẩy sang TRÁI ${-Math.log10(op[1])} chữ số`}: ${n(v)}.`,
      method: 'Nhân với 10, 100… hoặc chia cho 0,1; 0,01… → dời dấu phẩy sang phải. Nhân với 0,1; 0,01… hoặc chia cho 10, 100… → dời dấu phẩy sang trái.',
      wrongs: [[rd(x / op[1], 4), 'Em dời dấu phẩy ngược chiều.'], [rd(v * 10, 4), 'Em dời thừa một chữ số.'], [rd(v / 10, 4), 'Em dời thiếu một chữ số.']] };
  } },
  { id: 'g5_nhan_025_05', topics: ['5-4'], d: [3, 4], think: true, mcq: true, make() {
    const m = pick([[0.25, 4], [0.5, 2], [0.125, 8]]), k = R(3, 40) * m[1], v = rd(k * m[0], 3);
    return { q: `Tính nhẩm: $${k} \\times ${t(m[0])}$`, ans: v, tex: t(v),
      sol: `Vì ${n(m[0])} = 1/${m[1]} nên nhân với ${n(m[0])} chính là chia cho ${m[1]}: ${k} : ${m[1]} = ${n(v)}.`, method: `Mẹo tính nhẩm: × 0,5 = : 2; × 0,25 = : 4; × 0,125 = : 8.`,
      wrongs: [[k * m[1], 'Nhân với số bé hơn 1 thì kết quả phải bé hơn số ban đầu.'], [rd(k / 10, 3), 'Không phải chỉ dời dấu phẩy.']] };
  } },
  { id: 'g5_tinh_thuan_tien_nhan', topics: ['5-4'], d: [3, 5], mcq: true, make(d) {
    const a = rd(R(11, 99) / 10, 1);
    if (d >= 5) { const v = rd(a * 100, 2);
      return { q: `Tính bằng cách thuận tiện nhất: $${t(a)} \\times 99 + ${t(a)}$`, ans: v, tex: t(v),
        sol: `${n(a)} × 99 + ${n(a)} = ${n(a)} × 99 + ${n(a)} × 1 = ${n(a)} × (99 + 1) = ${n(a)} × 100 = ${n(v)}`, method: 'Viết số đứng riêng thành tích với 1, rồi dùng tính chất nhân một số với một tổng: a × b + a × c = a × (b + c).', wrongs: [[rd(a * 99, 2), 'Em quên cộng thêm ' + n(a) + ' (chính là ' + n(a) + ' × 1).']] }; }
    const [b, c] = pick([[5.5, 4.5], [3.7, 6.3], [2.4, 7.6], [1.25, 8.75]]), v = rd(a * 10, 2);
    return { q: `Tính bằng cách thuận tiện nhất: $${t(a)} \\times ${t(b)} + ${t(a)} \\times ${t(c)}$`, ans: v, tex: t(v),
      sol: `= ${n(a)} × (${n(b)} + ${n(c)}) = ${n(a)} × 10 = ${n(v)}`, method: 'Nhân một số với một tổng: a × b + a × c = a × (b + c). Tìm thừa số chung.', wrongs: [[rd(a * 100, 2), 'Em dời dấu phẩy thừa một chữ số.']] };
  } },
  { id: 'g5_doi_dau_phay', topics: ['5-4', '5-2'], d: [6, 6], think: true, make() {
    const x = rd(R(12, 99) / 10, 1), right = Math.random() < 0.5, diff = right ? rd(x * 9, 2) : rd(x * 0.9, 3);
    return { q: `Khi dời dấu phẩy của một số thập phân sang ${right ? 'phải' : 'trái'} một chữ số thì được số mới ${right ? 'lớn' : 'bé'} hơn số cũ $${t(diff)}$ đơn vị. Tìm số thập phân đó.`, ans: x, tex: t(x),
      sol: right ? ['Bài giải', 'Dời dấu phẩy sang phải một chữ số thì số đó gấp lên 10 lần. Coi số cũ là 1 phần thì số mới là 10 phần.', 'Hiệu số phần bằng nhau: 10 − 1 = 9 (phần)', `Số cần tìm là: ${n(diff)} : 9 = ${n(x)}`, `Đáp số: ${n(x)}.`].join('\n')
        : ['Bài giải', 'Dời dấu phẩy sang trái một chữ số thì số đó giảm đi 10 lần. Coi số mới là 1 phần thì số cũ là 10 phần.', 'Hiệu số phần bằng nhau: 10 − 1 = 9 (phần)', `Số mới là: ${n(diff)} : 9 = ${n(rd(x / 10, 3))}`, `Số cần tìm là: ${n(rd(x / 10, 3))} × 10 = ${n(x)}`, `Đáp số: ${n(x)}.`].join('\n'),
      method: 'Dời dấu phẩy sang phải 1 chữ số = gấp 10 lần; sang trái = giảm 10 lần. Đưa về bài toán hiệu – tỉ với tỉ số 1/10.' };
  } },
  { id: 'g5_dt_vuon_stp', topics: ['5-4'], d: [3, 4], make() {
    const l = R(4, 16) * 5, w = (l * 3) / 5, S = rd(l * w, 3), rate = pick([0.5, 0.8, 1.2, 1.5]), kg = rd(S * rate, 3);
    return { q: `Một mảnh vườn hình chữ nhật có chiều dài ${n(l)} m, chiều rộng bằng $\\frac{3}{5}$ chiều dài. Trên mảnh vườn người ta trồng rau, cứ 1 m² thu được ${n(rate)} kg rau. Hỏi thu hoạch được bao nhiêu ki-lô-gam rau?`, ans: kg, tex: u(kg, 'kg'),
      sol: solve('Chiều rộng mảnh vườn là:', `${n(l)} × 3 : 5 = ${n(w)} (m)`, 'Diện tích mảnh vườn là:', `${n(l)} × ${n(w)} = ${n(S)} (m²)`, 'Số ki-lô-gam rau thu được là:', `${n(S)} × ${n(rate)} = ${n(kg)} (kg)`, `Đáp số: ${n(kg)} kg rau.`),
      method: 'Tìm chiều rộng (phân số của một số), tính diện tích (nhân hai số thập phân), rồi nhân với năng suất trên 1 m².' };
  } },
  { id: 'g5_chia_doan_day', topics: ['5-4'], d: [2, 3], mcq: true, make() {
    const k = R(4, 12), each = rd(R(105, 395) / 100, 2), L = rd(k * each, 2);
    return { q: `Một sợi dây dài ${n(L)} m được cắt thành ${k} đoạn dài bằng nhau. Hỏi mỗi đoạn dây dài bao nhiêu mét?`, ans: each, tex: u(each, 'm'),
      sol: solve('Mỗi đoạn dây dài là:', `${n(L)} : ${k} = ${n(each)} (m)`, `Đáp số: ${n(each)} m.`), method: 'Chia một số thập phân cho một số tự nhiên: chia như chia số tự nhiên, khi chia hết phần nguyên thì viết dấu phẩy vào thương rồi chia tiếp.',
      wrongs: [[rd(L * k, 2), 'Cắt thành các đoạn bằng nhau → phép chia.'], [rd(each * 10, 2), 'Em đặt dấu phẩy ở thương sai vị trí.']] };
  } },

  // ============ 5-5 · Hình tam giác, hình thang ============
  { id: 'g5_dt_tam_giac_vuong', topics: ['5-5'], d: [1, 2], mcq: true, essay: false, make() {
    const a = R(3, 20), b = R(3, 20) + (Math.random() < 0.5 ? 0.5 : 0), S = rd((a * b) / 2, 2);
    return { q: `Hình tam giác vuông có hai cạnh góc vuông dài ${a} cm và ${n(b)} cm. Diện tích hình tam giác đó là:`, ans: S, tex: `${t(S)}\\text{ cm}^2`,
      sol: `Trong tam giác vuông, một cạnh góc vuông là đáy thì cạnh kia là chiều cao: S = ${a} × ${n(b)} : 2 = ${n(S)} (cm²).`, method: 'Diện tích tam giác vuông = tích hai cạnh góc vuông : 2.',
      wrongs: [[rd(a * b, 2), 'Em quên chia 2.'], [rd(a + b, 2), 'Diện tích là phép nhân, không phải phép cộng.']] };
  } },
  { id: 'g5_tim_chieu_cao', topics: ['5-5'], d: [3, 4], mcq: true, make(d) {
    if (d === 3) { const a = R(6, 20), h = R(3, 15), S = rd((a * h) / 2, 2);
      return { q: `Một hình tam giác có diện tích ${n(S)} cm² và độ dài đáy ${a} cm. Tính chiều cao của hình tam giác.`, ans: h, tex: u(h, 'cm'),
        sol: solve('Chiều cao hình tam giác là:', `${n(S)} × 2 : ${a} = ${h} (cm)`, `Đáp số: ${h} cm.`), method: 'Từ S = đáy × chiều cao : 2 suy ra chiều cao = S × 2 : đáy.', wrongs: [[rd(S / a, 2), 'Em quên nhân diện tích với 2.']] }; }
    const B = R(10, 25), b = R(4, B - 2), h = R(4, 12), S = rd(((B + b) * h) / 2, 2);
    return { q: `Một hình thang có diện tích ${n(S)} m², đáy lớn ${B} m, đáy bé ${b} m. Tính chiều cao hình thang.`, ans: h, tex: u(h, 'm'),
      sol: solve('Tổng hai đáy là:', `${B} + ${b} = ${B + b} (m)`, 'Chiều cao hình thang là:', `${n(S)} × 2 : ${B + b} = ${h} (m)`, `Đáp số: ${h} m.`), method: 'Từ S = (a + b) × h : 2 suy ra h = S × 2 : (a + b).', wrongs: [[rd(S / (B + b), 2), 'Em quên nhân diện tích với 2.']] };
  } },
  { id: 'g5_bia_cat_goc', topics: ['5-5'], d: [4, 4], make() {
    const l = R(20, 40), w = R(12, l - 4), c = R(3, w - 4), dd = R(3, w - 4), left = rd(l * w - (c * dd) / 2, 2);
    return { q: `Một tấm bìa hình chữ nhật có chiều dài ${l} cm, chiều rộng ${w} cm. Người ta cắt bỏ ở một góc tấm bìa một hình tam giác vuông có hai cạnh góc vuông dài ${c} cm và ${dd} cm. Tính diện tích phần bìa còn lại.`, ans: left, tex: `${t(left)}\\text{ cm}^2`,
      sol: solve('Diện tích tấm bìa hình chữ nhật là:', `${l} × ${w} = ${l * w} (cm²)`, 'Diện tích hình tam giác bị cắt bỏ là:', `${c} × ${dd} : 2 = ${n(rd((c * dd) / 2, 2))} (cm²)`, 'Diện tích phần bìa còn lại là:', `${l * w} − ${n(rd((c * dd) / 2, 2))} = ${n(left)} (cm²)`, `Đáp số: ${n(left)} cm².`),
      method: 'Diện tích phần còn lại = diện tích hình lớn − diện tích phần bị cắt bỏ.' };
  } },
  { id: 'g5_thang_chia_tam_giac', topics: ['5-5'], d: [5, 5], think: true, make() {
    const a = R(12, 30), b = R(5, a - 3), h = R(4, 14);
    return { q: `Hình thang ABCD có đáy bé AB = ${b} cm, đáy lớn CD = ${a} cm và chiều cao ${h} cm. Nối A với C. Tính diện tích hình tam giác ACD và hình tam giác ABC. (ghi: S tam giác ACD; S tam giác ABC)`, ans: `${rd((a * h) / 2, 2)}; ${rd((b * h) / 2, 2)}`, tex: `${t(rd((a * h) / 2, 2))}\\text{ cm}^2;\\ ${t(rd((b * h) / 2, 2))}\\text{ cm}^2`,
      sol: ['Bài giải', 'Tam giác ACD có đáy CD, chiều cao chính là chiều cao hình thang (khoảng cách từ A đến CD).', `S(ACD) = ${a} × ${h} : 2 = ${n(rd((a * h) / 2, 2))} (cm²)`, 'Tam giác ABC có đáy AB, chiều cao cũng bằng chiều cao hình thang (khoảng cách từ C đến AB).', `S(ABC) = ${b} × ${h} : 2 = ${n(rd((b * h) / 2, 2))} (cm²)`, `Kiểm tra: tổng hai diện tích = (${a} + ${b}) × ${h} : 2 = ${n(rd(((a + b) * h) / 2, 2))} cm² = diện tích hình thang ✓`].join('\n'),
      method: 'Đường chéo chia hình thang thành hai tam giác có cùng chiều cao (bằng chiều cao hình thang), đáy lần lượt là hai đáy hình thang.' };
  } },
  { id: 'g5_keo_dai_day_tg', topics: ['5-5'], d: [5, 6], think: true, make() {
    const a = R(10, 30), x = R(2, 6), h = R(4, 16), inc = rd((x * h) / 2, 2), S = rd((a * h) / 2, 2);
    return { q: `Một thửa ruộng hình tam giác có đáy dài ${a} m. Nếu kéo dài đáy thêm ${x} m thì diện tích thửa ruộng tăng thêm ${n(inc)} m². Tính diện tích thửa ruộng ban đầu.`, ans: S, tex: `${t(S)}\\text{ m}^2`,
      sol: ['Bài giải', `Phần diện tích tăng thêm là một hình tam giác có đáy ${x} m và chiều cao bằng chiều cao của thửa ruộng.`, 'Chiều cao thửa ruộng là:', `${n(inc)} × 2 : ${x} = ${h} (m)`, 'Diện tích thửa ruộng ban đầu là:', `${a} × ${h} : 2 = ${n(S)} (m²)`, `Đáp số: ${n(S)} m².`].join('\n'),
      method: 'Vẽ hình: phần tăng thêm là tam giác có chung chiều cao với tam giác ban đầu. Từ diện tích phần tăng thêm tìm ra chiều cao chung.' };
  } },
  { id: 'g5_keo_dai_day_thang', topics: ['5-5'], d: [6, 6], think: true, make() {
    const b = R(8, 20), x = R(3, 8), a = b + x, h = R(4, 12), inc = rd((x * h) / 2, 2), S = rd(((a + b) * h) / 2, 2);
    return { q: `Một mảnh đất hình thang có đáy bé ${b} m, đáy lớn ${a} m. Nếu kéo dài đáy bé thêm ${x} m thì diện tích mảnh đất tăng thêm ${n(inc)} m² và mảnh đất trở thành hình bình hành. Tính diện tích mảnh đất hình thang ban đầu.`, ans: S, tex: `${t(S)}\\text{ m}^2`,
      sol: ['Bài giải', `Phần tăng thêm là một hình tam giác có đáy ${x} m, chiều cao bằng chiều cao hình thang.`, 'Chiều cao hình thang là:', `${n(inc)} × 2 : ${x} = ${h} (m)`, 'Diện tích hình thang ban đầu là:', `(${a} + ${b}) × ${h} : 2 = ${n(S)} (m²)`, `Đáp số: ${n(S)} m².`].join('\n'),
      method: 'Phần diện tích tăng thêm khi kéo dài một cạnh đáy là tam giác có chung chiều cao với hình ban đầu → tìm chiều cao, rồi tính diện tích.' };
  } },

  // ============ 5-6 · Hình tròn ============
  { id: 'g5_tu_chu_vi_ra_d', topics: ['5-6'], d: [1, 3], mcq: true, essay: false, make(d) {
    const dd = R(2, 20), C2 = rd(dd * 3.14, 2);
    if (d >= 3) { const S = rd((dd / 2) ** 2 * 3.14, 4);
      return { q: `Một hình tròn có chu vi ${n(C2)} cm. Diện tích hình tròn đó là:`, ans: S, tex: `${t(S)}\\text{ cm}^2`,
        sol: `d = ${n(C2)} : 3,14 = ${dd} cm; r = ${n(dd / 2)} cm; S = ${n(dd / 2)} × ${n(dd / 2)} × 3,14 = ${n(S)} cm².`, method: 'Từ chu vi tìm đường kính (C : 3,14), suy ra bán kính, rồi S = r × r × 3,14.', wrongs: [[rd(dd * dd * 3.14, 4), 'Em dùng đường kính thay cho bán kính.'], [C2, 'Đó là chu vi.']] }; }
    return { q: `Một hình tròn có chu vi ${n(C2)} cm. Đường kính của hình tròn đó là:`, ans: dd, tex: u(dd, 'cm'),
      sol: `d = C : 3,14 = ${n(C2)} : 3,14 = ${dd} (cm).`, method: 'Từ C = d × 3,14 suy ra d = C : 3,14.', wrongs: [[dd / 2, 'Đó là bán kính.'], [rd(C2 / 6.28, 2) === dd ? dd * 2 : rd(C2 / 6.28, 2), 'Em chia cho 6,28 → ra bán kính.']] };
  } },
  { id: 'g5_banh_xe', topics: ['5-6'], d: [3, 5], make(d) {
    const dd = pick([0.5, 0.6, 0.65, 0.7, 0.8]), C2 = rd(dd * 3.14, 4);
    if (d >= 5) { const v = R(2, 9) * 100, S = rd(C2 * v, 3);
      return { q: `Bánh xe của một chiếc xe đạp có đường kính ${n(dd)} m. Muốn đi được quãng đường ${n(S)} m thì bánh xe phải lăn trên mặt đất bao nhiêu vòng?`, ans: v, tex: u(v, 'vòng'),
        sol: solve('Chu vi bánh xe là:', `${n(dd)} × 3,14 = ${n(C2)} (m)`, 'Mỗi vòng lăn, xe đi được một quãng đường bằng chu vi bánh xe.', 'Số vòng bánh xe phải lăn là:', `${n(S)} : ${n(C2)} = ${v} (vòng)`, `Đáp số: ${v} vòng.`), method: 'Bánh xe lăn 1 vòng thì đi được quãng đường bằng chu vi bánh xe. Số vòng = quãng đường : chu vi.' }; }
    const v = R(50, 500), S = rd(C2 * v, 3);
    return { q: `Bánh xe của một chiếc xe đạp có đường kính ${n(dd)} m. Bánh xe lăn trên mặt đất được ${v} vòng thì xe đi được bao nhiêu mét?`, ans: S, tex: u(S, 'm'),
      sol: solve('Chu vi bánh xe là:', `${n(dd)} × 3,14 = ${n(C2)} (m)`, 'Quãng đường xe đi được là:', `${n(C2)} × ${v} = ${n(S)} (m)`, `Đáp số: ${n(S)} m.`), method: 'Bánh xe lăn 1 vòng đi được quãng đường bằng chu vi bánh xe.' };
  } },
  { id: 'g5_tang_ban_kinh', topics: ['5-6'], d: [5, 5], think: true, mcq: true, make() {
    const k = R(2, 4), what = pick(['chu vi', 'diện tích']), ans = what === 'chu vi' ? k : k * k;
    return { q: `Nếu tăng bán kính của một hình tròn lên ${k} lần thì ${what} của hình tròn đó tăng lên bao nhiêu lần?`, ans, tex: `${ans}\\text{ lần}`,
      sol: what === 'chu vi' ? `C = r × 2 × 3,14. Bán kính gấp ${k} lần thì chu vi cũng gấp ${k} lần.` : `S = r × r × 3,14. Bán kính gấp ${k} lần thì S mới = (${k} × r) × (${k} × r) × 3,14 = ${k * k} × (r × r × 3,14): diện tích gấp ${k * k} lần.`,
      method: 'Viết công thức với bán kính mới (gấp k lần) rồi so sánh với công thức ban đầu. Chu vi tỉ lệ với bán kính; diện tích tỉ lệ với bán kính × bán kính.',
      wrongs: what === 'chu vi' ? [[k * k, 'Chu vi chỉ phụ thuộc bán kính (một lần), không phải bình phương.'], [2 * k, 'Không nhân thêm 2.']] : [[k, 'Diện tích có r × r nên tăng ' + k + ' × ' + k + ' lần.'], [2 * k, 'Không phải gấp đôi số lần.']] };
  } },
  { id: 'g5_cua_so_nua_tron', topics: ['5-6'], d: [4, 5], make() {
    const r = pick([0.5, 0.6, 0.8, 1, 1.2]), h = pick([1, 1.2, 1.5, 1.8]), Srect = rd(2 * r * h, 4), Shalf = rd((r * r * 3.14) / 2, 4), S = rd(Srect + Shalf, 4);
    return { q: `Một cửa sổ gồm phần dưới là hình chữ nhật rộng ${n(2 * r)} m, cao ${n(h)} m và phần trên là nửa hình tròn có đường kính bằng chiều rộng hình chữ nhật. Tính diện tích cửa sổ (lấy π ≈ 3,14).`, ans: S, tex: `${t(S)}\\text{ m}^2`,
      sol: solve('Diện tích phần hình chữ nhật là:', `${n(2 * r)} × ${n(h)} = ${n(Srect)} (m²)`, 'Bán kính nửa hình tròn là:', `${n(2 * r)} : 2 = ${n(r)} (m)`, 'Diện tích nửa hình tròn là:', `${n(r)} × ${n(r)} × 3,14 : 2 = ${n(Shalf)} (m²)`, 'Diện tích cửa sổ là:', `${n(Srect)} + ${n(Shalf)} = ${n(S)} (m²)`, `Đáp số: ${n(S)} m².`),
      method: 'Chia hình phức tạp thành các hình quen thuộc (hình chữ nhật + nửa hình tròn), tính từng phần rồi cộng lại.' };
  } },
  { id: 'g5_tron_ngoai_vuong', topics: ['5-6'], d: [6, 6], think: true, make() {
    const r = R(2, 10), Sc = rd(r * r * 3.14, 4), Sq = 2 * r * r, S = rd(Sc - Sq, 4);
    return { q: `Hình vuông ABCD có bốn đỉnh nằm trên một đường tròn tâm O bán kính ${r} cm (hai đường chéo của hình vuông là hai đường kính). Tính diện tích phần hình tròn nằm ngoài hình vuông (lấy π ≈ 3,14).`, ans: S, tex: `${t(S)}\\text{ cm}^2`,
      sol: ['Bài giải', `Hai đường chéo hình vuông là đường kính nên mỗi đường chéo dài ${r} × 2 = ${2 * r} (cm), và chúng vuông góc với nhau.`, `Hình vuông là hình thoi đặc biệt nên diện tích = tích hai đường chéo : 2 = ${2 * r} × ${2 * r} : 2 = ${Sq} (cm²).`, `Diện tích hình tròn: ${r} × ${r} × 3,14 = ${n(Sc)} (cm²).`, `Diện tích phần nằm ngoài hình vuông: ${n(Sc)} − ${Sq} = ${n(S)} (cm²).`, `Đáp số: ${n(S)} cm².`].join('\n'),
      method: 'Không cần biết cạnh hình vuông: hình vuông có hai đường chéo bằng nhau và vuông góc → diện tích = đường chéo × đường chéo : 2. Phần ngoài = hình tròn − hình vuông.' };
  } },

  // ============ 5-7 · Tỉ số, tổng – tỉ, hiệu – tỉ, tỉ lệ bản đồ ============
  { id: 'g5_hieu_ti_cay', topics: ['5-7'], d: [3, 4], mcq: true, make() {
    const m = R(2, 5), k = m + R(1, 4), unit = R(4, 20), A = k * unit, B = m * unit;
    return { q: `Lớp 5A trồng được nhiều hơn lớp 5B ${A - B} cây. Số cây của lớp 5B bằng $\\frac{${m}}{${k}}$ số cây của lớp 5A. Hỏi lớp 5A trồng được bao nhiêu cây?`, ans: A, tex: u(A, 'cây'),
      sol: solve(`Coi số cây lớp 5B là ${m} phần thì số cây lớp 5A là ${k} phần như thế.`, `Hiệu số phần bằng nhau là: ${k} − ${m} = ${k - m} (phần)`, `Giá trị một phần là: ${A - B} : ${k - m} = ${unit} (cây)`, `Lớp 5A trồng được: ${unit} × ${k} = ${A} (cây)`, `Đáp số: ${A} cây.`),
      method: 'Bài toán hiệu – tỉ: vẽ sơ đồ, hiệu số phần = số phần lớn − số phần bé, giá trị 1 phần = hiệu : hiệu số phần.',
      wrongs: [[B, 'Đó là số cây lớp 5B.'], [Math.round(((A - B) / (k + m)) * k), 'Đây là bài hiệu – tỉ, phải dùng HIỆU số phần.']] };
  } },
  { id: 'g5_tong_ti_hcn', topics: ['5-7'], d: [4, 5], make() {
    const m = R(1, 4), k = m + R(1, 4), unit = R(2, 9), w = m * unit, l = k * unit, P = 2 * (l + w);
    return { q: `Một mảnh đất hình chữ nhật có chu vi ${P} m, chiều rộng bằng $\\frac{${m}}{${k}}$ chiều dài. Tính diện tích mảnh đất.`, ans: l * w, tex: `${l * w}\\text{ m}^2`,
      sol: solve('Nửa chu vi mảnh đất (tổng chiều dài và chiều rộng) là:', `${P} : 2 = ${l + w} (m)`, `Tổng số phần bằng nhau là: ${m} + ${k} = ${m + k} (phần)`, `Chiều rộng là: ${l + w} : ${m + k} × ${m} = ${w} (m)`, `Chiều dài là: ${l + w} − ${w} = ${l} (m)`, `Diện tích mảnh đất là: ${l} × ${w} = ${l * w} (m²)`, `Đáp số: ${l * w} m².`),
      method: 'Nửa chu vi là TỔNG của chiều dài và chiều rộng → bài toán tổng – tỉ. Chú ý không dùng cả chu vi.' };
  } },
  { id: 'g5_ban_do_dien_tich', topics: ['5-7'], d: [5, 6], think: true, make() {
    const sc = pick([500, 1000, 2000]), a = R(2, 8), b = R(2, 6), la = (a * sc) / 100, lb = (b * sc) / 100, S = la * lb;
    return { q: `Trên bản đồ tỉ lệ 1 : ${n(sc)}, một mảnh đất hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm. Tính diện tích thật của mảnh đất theo mét vuông.`, ans: S, tex: `${t(S)}\\text{ m}^2`,
      sol: ['Bài giải', 'Chiều dài thật là:', `${a} × ${n(sc)} = ${n(a * sc)} (cm) = ${n(la)} m`, 'Chiều rộng thật là:', `${b} × ${n(sc)} = ${n(b * sc)} (cm) = ${n(lb)} m`, 'Diện tích thật của mảnh đất là:', `${n(la)} × ${n(lb)} = ${n(S)} (m²)`, `Đáp số: ${n(S)} m².`, `Chú ý: không được lấy diện tích trên bản đồ (${a * b} cm²) nhân với ${n(sc)}.`].join('\n'),
      method: 'Tỉ lệ bản đồ áp dụng cho ĐỘ DÀI: đổi từng kích thước ra độ dài thật trước, rồi mới tính diện tích.' };
  } },
  { id: 'g5_chuyen_kho', topics: ['5-7'], d: [5, 6], think: true, make() {
    const k = R(2, 4), B = R(2, 15) * 2, A = k * B, x = ((k - 1) * B) / 2;
    if (!Number.isInteger(x)) return null;
    return { q: `Kho thứ nhất chứa số thóc gấp ${k} lần kho thứ hai. Nếu chuyển ${x} tấn thóc từ kho thứ nhất sang kho thứ hai thì số thóc ở hai kho bằng nhau. Hỏi lúc đầu mỗi kho chứa bao nhiêu tấn thóc? (ghi: kho 1; kho 2)`, ans: `${A}; ${B}`, tex: `${u(A, 'tấn')};\\ ${u(B, 'tấn')}`,
      sol: ['Bài giải', `Chuyển ${x} tấn từ kho 1 sang kho 2 thì hai kho bằng nhau, nên lúc đầu kho 1 hơn kho 2 là: ${x} × 2 = ${2 * x} (tấn)`, `Coi kho 2 là 1 phần thì kho 1 là ${k} phần; hiệu số phần: ${k} − 1 = ${k - 1} (phần)`, `Kho thứ hai có: ${2 * x} : ${k - 1} = ${B} (tấn)`, `Kho thứ nhất có: ${B} × ${k} = ${A} (tấn)`, `Đáp số: Kho 1: ${A} tấn; kho 2: ${B} tấn.`].join('\n'),
      method: 'Chuyển x từ kho này sang kho kia mà hai kho bằng nhau thì lúc đầu chúng hơn kém nhau 2 × x (không phải x!). Sau đó giải bài toán hiệu – tỉ.' };
  } },
  { id: 'g5_tuoi_sau_n_nam', topics: ['5-7'], d: [6, 6], think: true, make() {
    const k = R(3, 5), son = R(6, 12), dad = k * son, yrs = R(2, 8), sumL = son + dad + 2 * yrs;
    return { q: `Năm nay tuổi bố gấp ${k} lần tuổi con. Sau ${yrs} năm nữa thì tổng số tuổi của hai bố con là ${sumL} tuổi. Tính tuổi của mỗi người hiện nay. (ghi: tuổi bố; tuổi con)`, ans: `${dad}; ${son}`, tex: `${u(dad, 'tuổi')};\\ ${u(son, 'tuổi')}`,
      sol: ['Bài giải', `Sau ${yrs} năm, mỗi người tăng thêm ${yrs} tuổi, nên tổng số tuổi tăng thêm: ${yrs} × 2 = ${2 * yrs} (tuổi)`, `Tổng số tuổi hai bố con hiện nay là: ${sumL} − ${2 * yrs} = ${son + dad} (tuổi)`, `Coi tuổi con là 1 phần thì tuổi bố là ${k} phần; tổng số phần: ${k} + 1 = ${k + 1} (phần)`, `Tuổi con hiện nay: ${son + dad} : ${k + 1} = ${son} (tuổi)`, `Tuổi bố hiện nay: ${son} × ${k} = ${dad} (tuổi)`, `Đáp số: Bố ${dad} tuổi; con ${son} tuổi.`].join('\n'),
      method: 'Đưa tổng số tuổi về CÙNG thời điểm với tỉ số (hiện nay): mỗi năm tổng số tuổi của 2 người tăng 2 tuổi. Rồi giải bài toán tổng – tỉ.' };
  } },

  // ============ 5-8 · Tỉ số phần trăm ============
  { id: 'g5_ti_so_pt', topics: ['5-8', '5-11'], d: [1, 2], mcq: true, essay: false, make() {
    const b = pick([20, 25, 40, 50, 80]), a = R(1, b - 1), p = rd((a / b) * 100, 2);
    return { q: `Tỉ số phần trăm của ${a} và ${b} là:`, ans: p, tex: `${t(p)}\\%`,
      sol: `${a} : ${b} = ${n(rd(a / b, 4))} = ${n(p)}%.`, method: 'Tìm thương a : b, nhân thương với 100 rồi viết thêm kí hiệu %.',
      wrongs: [[rd(a / b, 4), 'Em quên nhân với 100.'], [rd((b / a) * 100, 2), 'Em lấy ' + b + ' chia ' + a + ' (ngược thứ tự).']] };
  } },
  { id: 'g5_tim_so_biet_pt', topics: ['5-8', '5-11'], d: [2, 3], mcq: true, make() {
    const p = pick([10, 20, 25, 30, 40, 60, 75]), tot = R(2, 12) * (100 / gcd(p, 100)), part = (tot * p) / 100;
    return { q: `Số học sinh giỏi của một trường là ${part} em, chiếm ${p}% số học sinh toàn trường. Hỏi trường đó có bao nhiêu học sinh?`, ans: tot, tex: u(tot, 'học sinh'),
      sol: solve('Số học sinh toàn trường là:', `${part} × 100 : ${p} = ${tot} (học sinh)`, `Đáp số: ${tot} học sinh.`), method: 'Tìm một số khi biết p% của nó là a: lấy a × 100 : p (hoặc a : p × 100).',
      wrongs: [[rd((part * p) / 100, 2), 'Em đã tìm ' + p + '% của ' + part + ', ngược với yêu cầu.'], [part + p, 'Không cộng số học sinh với số phần trăm.']] };
  } },
  { id: 'g5_xep_loai_lop', topics: ['5-8'], d: [4, 4], make() {
    const p = pick([20, 25, 30, 40]), [a, b] = pick([[2, 3], [3, 5], [1, 2], [3, 4], [4, 5]]);
    const ok = []; for (let x = 20; x <= 45; x++) if (Number.isInteger((x * p) / 100) && Number.isInteger(((x - (x * p) / 100) * a) / b)) ok.push(x);
    if (!ok.length) return null;
    const tot = pick(ok), gioi = (tot * p) / 100, rest = tot - gioi, kha = (rest * a) / b;
    return { q: `Lớp 5A có ${tot} học sinh. Cuối năm, số học sinh hoàn thành xuất sắc chiếm ${p}% số học sinh cả lớp, số học sinh hoàn thành tốt bằng $\\frac{${a}}{${b}}$ số học sinh còn lại, các bạn còn lại hoàn thành. Hỏi có bao nhiêu bạn được xếp loại hoàn thành?`, ans: rest - kha, tex: u(rest - kha, 'học sinh'),
      sol: solve('Số học sinh hoàn thành xuất sắc là:', `${tot} × ${p} : 100 = ${gioi} (học sinh)`, 'Số học sinh còn lại là:', `${tot} − ${gioi} = ${rest} (học sinh)`, 'Số học sinh hoàn thành tốt là:', `${rest} × ${a} : ${b} = ${kha} (học sinh)`, 'Số học sinh hoàn thành là:', `${rest} − ${kha} = ${rest - kha} (học sinh)`, `Đáp số: ${rest - kha} học sinh.`),
      method: 'Bài toán nhiều bước kết hợp tỉ số phần trăm và phân số; chú ý "số còn lại" tính sau khi đã trừ nhóm thứ nhất.' };
  } },
  { id: 'g5_giam_gia_biet_tien', topics: ['5-8'], d: [3, 4], mcq: true, make() {
    const p = pick([10, 15, 20, 25, 30]), price = R(4, 30) * 20000, off = (price * p) / 100;
    return { q: `Nhân dịp khai trương, một cửa hàng giảm giá ${p}% cho mỗi đôi giày. Khi mua một đôi giày, cô Lan được giảm ${n(off)} đồng. Hỏi giá ban đầu và giá sau khi giảm của đôi giày là bao nhiêu? (Ô đáp số: ghi giá sau khi giảm)`, ans: price - off, tex: `${u(price, 'đồng')}\\to ${u(price - off, 'đồng')}`,
      sol: solve('Giá ban đầu của đôi giày là:', `${n(off)} × 100 : ${p} = ${n(price)} (đồng)`, 'Giá đôi giày sau khi giảm là:', `${n(price)} − ${n(off)} = ${n(price - off)} (đồng)`, `Đáp số: ${n(price - off)} đồng.`),
      method: 'Số tiền được giảm chính là p% của giá ban đầu → tìm giá ban đầu (biết p% của nó), rồi trừ đi tiền được giảm.', wrongs: [[price, 'Đó là giá ban đầu, chưa trừ tiền giảm.']] };
  } },
  { id: 'g5_giam_roi_tang', topics: ['5-8'], d: [5, 5], think: true, mcq: true, make() {
    const p = pick([10, 20, 25, 30, 40, 50]), up = Math.random() < 0.5, res = rd((p * p) / 100, 2);
    return { q: `Giá một món hàng ${up ? 'tăng' : 'giảm'} ${p}%, sau đó lại ${up ? 'giảm' : 'tăng'} ${p}% so với giá mới. Hỏi giá cuối cùng giảm đi bao nhiêu phần trăm so với giá ban đầu?`, ans: res, tex: `\\text{giảm }${t(res)}\\%`,
      sol: ['Bài giải', 'Coi giá ban đầu là 100%.', up ? `Sau khi tăng ${p}%: 100% + ${p}% = ${100 + p}%.` : `Sau khi giảm ${p}%: 100% − ${p}% = ${100 - p}%.`, up ? `Sau khi giảm ${p}% của giá mới: ${100 + p}% × (100 − ${p}) : 100 = ${n(rd(((100 + p) * (100 - p)) / 100, 2))}%.` : `Sau khi tăng ${p}% của giá mới: ${100 - p}% × (100 + ${p}) : 100 = ${n(rd(((100 + p) * (100 - p)) / 100, 2))}%.`, `Giá cuối so với giá ban đầu giảm: 100% − ${n(rd(((100 + p) * (100 - p)) / 100, 2))}% = ${n(res)}%.`].join('\n'),
      method: 'Lần tăng/giảm thứ hai tính trên GIÁ MỚI, không phải giá ban đầu. Coi giá ban đầu là 100% và tính lần lượt từng bước.',
      wrongs: [[0, 'Tăng rồi giảm cùng một tỉ lệ % KHÔNG trở về giá cũ vì lần sau tính trên giá đã thay đổi.'], [p, 'Em tính nhầm phần trăm thay đổi.']] };
  } },
  { id: 'g5_phoi_hat', topics: ['5-8'], d: [6, 6], think: true, make() {
    const [w1, w2] = pick([[80, 20], [90, 40], [75, 25], [60, 20], [80, 50]]), a = R(2, 20) * 20, dryMat = (a * (100 - w1)) / 100, dry = (dryMat * 100) / (100 - w2);
    if (!Number.isInteger(dry * 100)) return null;
    return { q: `Một loại hạt khi tươi chứa ${w1}% nước, khi phơi khô thì chứa ${w2}% nước. Hỏi phơi ${a} kg hạt tươi thì được bao nhiêu ki-lô-gam hạt khô?`, ans: rd(dry, 2), tex: u(rd(dry, 2), 'kg'),
      sol: ['Bài giải', 'Khi phơi, chỉ có nước bay hơi; lượng "chất khô" (phần không phải nước) không đổi.', `Trong hạt tươi, chất khô chiếm: 100% − ${w1}% = ${100 - w1}%`, `Lượng chất khô là: ${a} × ${100 - w1} : 100 = ${n(dryMat)} (kg)`, `Trong hạt khô, chất khô chiếm: 100% − ${w2}% = ${100 - w2}%`, `Lượng hạt khô là: ${n(dryMat)} × 100 : ${100 - w2} = ${n(rd(dry, 2))} (kg)`, `Đáp số: ${n(rd(dry, 2))} kg.`].join('\n'),
      method: 'Tìm đại lượng KHÔNG ĐỔI trong quá trình (lượng chất khô), tính nó ở trạng thái đầu, rồi dùng nó để tìm khối lượng ở trạng thái sau.' };
  } },
  { id: 'g5_pha_loang_muoi', topics: ['5-8'], d: [5, 6], think: true, make() {
    const [p1, p2] = pick([[4, 2], [5, 2], [6, 4], [10, 4], [8, 5]]), a = R(2, 10) * 10, salt = (a * p1) / 100, tot = (salt * 100) / p2, add = rd(tot - a, 2);
    if (!Number.isInteger(add * 10)) return null;
    return { q: `Nước biển chứa ${p1}% muối. Cần đổ thêm bao nhiêu ki-lô-gam nước lã vào ${a} kg nước biển để được loại nước chứa ${p2}% muối?`, ans: add, tex: u(add, 'kg'),
      sol: ['Bài giải', 'Đổ thêm nước lã thì lượng muối không thay đổi.', `Lượng muối trong ${a} kg nước biển là: ${a} × ${p1} : 100 = ${n(salt)} (kg)`, `Khối lượng dung dịch chứa ${p2}% muối là: ${n(salt)} × 100 : ${p2} = ${n(rd(tot, 2))} (kg)`, `Lượng nước lã cần đổ thêm là: ${n(rd(tot, 2))} − ${a} = ${n(add)} (kg)`, `Đáp số: ${n(add)} kg.`].join('\n'),
      method: 'Pha loãng: lượng muối (chất tan) không đổi. Tìm lượng muối → tìm khối lượng dung dịch mới theo tỉ lệ % mới → lấy hiệu.' };
  } },

  // ============ 5-9 · Thể tích ============
  { id: 'g5_doi_the_tich', topics: ['5-9'], d: [1, 2], mcq: true, essay: false, make() {
    const pairs = [['m^3', 'dm^3', 1000], ['dm^3', 'cm^3', 1000], ['m^3', 'cm^3', 1000000]], [a, b, k] = pick(pairs), x = rd(R(11, 95) / 10, 1), v = rd(x * k, 2);
    const lab = (s) => s.replace('^3', '^3');
    return { q: `$${t(x)}\\text{ ${lab(a).replace('^3', '')}}^3 = \\square\\text{ ${lab(b).replace('^3', '')}}^3$`, ans: v, tex: t(v),
      sol: `1 ${a.replace('^3', '³')} = ${n(k)} ${b.replace('^3', '³')} nên ${n(x)} ${a.replace('^3', '³')} = ${n(x)} × ${n(k)} = ${n(v)} ${b.replace('^3', '³')}.`, method: 'Hai đơn vị đo thể tích liền nhau hơn kém nhau 1000 lần (m³ → dm³ → cm³).',
      wrongs: [[rd(x * (k === 1000 ? 100 : 10000), 2), 'Đơn vị thể tích liền nhau gấp 1000 lần (không phải 100 lần như diện tích).'], [rd(x * k * 10, 2), 'Em dời dấu phẩy thừa.']] };
  } },
  { id: 'g5_gap_canh_lp', topics: ['5-9'], d: [5, 5], think: true, mcq: true, make() {
    const k = R(2, 3), what = pick(['thể tích', 'diện tích toàn phần']), ans = what === 'thể tích' ? k ** 3 : k * k;
    return { q: `Nếu gấp cạnh của một hình lập phương lên ${k} lần thì ${what} của nó gấp lên bao nhiêu lần?`, ans, tex: `${ans}\\text{ lần}`,
      sol: what === 'thể tích' ? `V = a × a × a. Cạnh mới ${k} × a thì V mới = (${k} × a) × (${k} × a) × (${k} × a) = ${k ** 3} × a × a × a → gấp ${k ** 3} lần.` : `S toàn phần = a × a × 6. Cạnh mới ${k} × a thì S mới = (${k} × a) × (${k} × a) × 6 = ${k * k} × (a × a × 6) → gấp ${k * k} lần.`,
      method: 'Thay cạnh mới (gấp k lần) vào công thức. Diện tích gấp k × k lần; thể tích gấp k × k × k lần.',
      wrongs: [[k, 'Không phải cứ cạnh gấp k lần thì mọi đại lượng đều gấp k lần.'], [what === 'thể tích' ? k * k : k ** 3, what === 'thể tích' ? 'Thể tích có ba thừa số a.' : 'Diện tích chỉ có hai thừa số a.']] };
  } },
  { id: 'g5_tha_da', topics: ['5-9'], d: [5, 6], think: true, make() {
    const l = R(4, 10) * 10, w = R(3, 6) * 10, h0 = R(15, 30), rise = R(2, 8), V = l * w * rise;
    return { q: `Một bể cá bằng kính hình hộp chữ nhật có chiều dài ${l} cm, chiều rộng ${w} cm. Mực nước trong bể cao ${h0} cm. Người ta thả vào bể một hòn đá (chìm hẳn trong nước) thì mực nước dâng lên ${h0 + rise} cm. Tính thể tích hòn đá theo đề-xi-mét khối.`, ans: rd(V / 1000, 3), tex: `${t(rd(V / 1000, 3))}\\text{ dm}^3`,
      sol: ['Bài giải', 'Thể tích hòn đá bằng thể tích phần nước dâng lên.', `Mực nước dâng lên: ${h0 + rise} − ${h0} = ${rise} (cm)`, `Thể tích phần nước dâng lên (hình hộp chữ nhật đáy ${l} × ${w}, cao ${rise}): ${l} × ${w} × ${rise} = ${n(V)} (cm³)`, `Đổi: ${n(V)} cm³ = ${n(rd(V / 1000, 3))} dm³`, `Đáp số: ${n(rd(V / 1000, 3))} dm³.`].join('\n'),
      method: 'Vật chìm hẳn trong nước chiếm chỗ một lượng nước bằng thể tích của nó → thể tích vật = diện tích đáy bể × chiều cao mực nước dâng lên.' };
  } },
  { id: 'g5_son_lap_phuong', topics: ['5-9'], d: [6, 6], think: true, make() {
    const N = R(3, 6), v = pick([3, 2, 1, 0]), ans = [(N - 2) ** 3, 6 * (N - 2) ** 2, 12 * (N - 2), 8][v];
    return { q: `Một khối gỗ hình lập phương cạnh ${N} cm được sơn màu tất cả các mặt. Người ta cưa khối gỗ thành các khối lập phương nhỏ cạnh 1 cm. Hỏi có bao nhiêu khối lập phương nhỏ ${v === 0 ? 'không được sơn mặt nào' : `được sơn đúng ${v} mặt`}?`, ans, tex: u(ans, 'khối'),
      sol: ['Bài giải', `Cưa được ${N} × ${N} × ${N} = ${N ** 3} khối nhỏ.`, v === 3 ? 'Khối sơn 3 mặt nằm ở các đỉnh của khối lớn. Hình lập phương có 8 đỉnh → 8 khối.' : v === 2 ? `Khối sơn đúng 2 mặt nằm trên các cạnh (trừ hai đầu là đỉnh). Mỗi cạnh có ${N} − 2 = ${N - 2} khối; hình lập phương có 12 cạnh → 12 × ${N - 2} = ${ans} khối.` : v === 1 ? `Khối sơn đúng 1 mặt nằm ở phần "giữa" mỗi mặt: mỗi mặt có (${N} − 2) × (${N} − 2) = ${(N - 2) ** 2} khối; có 6 mặt → 6 × ${(N - 2) ** 2} = ${ans} khối.` : `Khối không được sơn nằm hoàn toàn bên trong: là hình lập phương cạnh ${N} − 2 = ${N - 2} → ${N - 2} × ${N - 2} × ${N - 2} = ${ans} khối.`, `Đáp số: ${ans} khối.`].join('\n'),
      method: 'Hình dung vị trí: đỉnh (3 mặt sơn) – cạnh trừ hai đầu (2 mặt) – giữa các mặt (1 mặt) – bên trong (0 mặt). Kiểm tra: tổng các loại = N × N × N.' };
  } },
  { id: 'g5_thung_khong_nap', topics: ['5-9'], d: [4, 5], make() {
    const a = R(6, 15), b = R(4, a - 1), c = R(3, 10), Sxq = 2 * (a + b) * c, S = Sxq + a * b, V = a * b * c;
    return { q: `Người ta làm một cái thùng tôn không có nắp dạng hình hộp chữ nhật dài ${a} dm, rộng ${b} dm, cao ${c} dm.\na) Tính diện tích tôn cần dùng (không tính mép hàn).\nb) Thùng chứa được nhiều nhất bao nhiêu lít nước?`, ans: `${S}; ${V}`, tex: parts(`${S}\\text{ dm}^2`, u(V, 'lít')),
      sol: solve('a) Diện tích xung quanh của thùng là:', `(${a} + ${b}) × 2 × ${c} = ${Sxq} (dm²)`, 'Diện tích đáy thùng là:', `${a} × ${b} = ${a * b} (dm²)`, 'Thùng không có nắp nên diện tích tôn cần dùng là:', `${Sxq} + ${a * b} = ${S} (dm²)`, 'b) Thể tích thùng là:', `${a} × ${b} × ${c} = ${V} (dm³) = ${V} lít`, `Đáp số: a) ${S} dm²; b) ${V} lít.`),
      method: 'Thùng không nắp: diện tích = diện tích xung quanh + 1 đáy (không phải 2 đáy). 1 dm³ = 1 lít.' };
  } },

  // ============ 5-10 · Số đo thời gian; vận tốc, quãng đường, thời gian ============
  { id: 'g5_cong_thoi_gian', topics: ['5-10'], d: [1, 2], mcq: true, essay: false, make() {
    const h1 = R(1, 5), m1 = R(20, 55), h2 = R(1, 4), m2 = R(15, 50), tot = (h1 + h2) * 60 + m1 + m2, H = Math.floor(tot / 60), M = tot % 60;
    return { q: `Tính: ${h1} giờ ${m1} phút + ${h2} giờ ${m2} phút = ? (viết dạng giờ:phút)`, ans: `${H}:${String(M).padStart(2, '0')}`, tex: `${H}\\text{ giờ }${M}\\text{ phút}`,
      sol: `${h1} giờ ${m1} phút + ${h2} giờ ${m2} phút = ${h1 + h2} giờ ${m1 + m2} phút. Vì ${m1 + m2} phút = 1 giờ ${m1 + m2 - 60} phút nên kết quả là ${H} giờ ${M} phút.`, method: 'Cộng giờ với giờ, phút với phút. Nếu số phút ≥ 60 thì đổi 60 phút thành 1 giờ.',
      wrongs: [[`${h1 + h2}:${m1 + m2}`, 'Số phút từ 60 trở lên phải đổi thành giờ.'], [`${H - 1}:${String(M).padStart(2, '0')}`, 'Em quên cộng thêm 1 giờ khi đổi phút.']] };
  } },
  { id: 'g5_doi_van_toc', topics: ['5-10'], d: [2, 3], mcq: true, essay: false, make() {
    const ms = pick([5, 10, 12.5, 15, 20, 25]), kmh = rd(ms * 3.6, 2), toMs = Math.random() < 0.5;
    return toMs ? { q: `Vận tốc ${n(kmh)} km/giờ bằng bao nhiêu mét/giây?`, ans: ms, tex: u(ms, 'm/giây'), sol: `${n(kmh)} km/giờ = ${n(kmh * 1000)} m trong 3600 giây → ${n(kmh * 1000)} : 3600 = ${n(ms)} m/giây.`, method: 'Đổi km → m (× 1000), giờ → giây (× 3600). Mẹo: km/giờ : 3,6 = m/giây.', wrongs: [[rd(kmh * 3.6, 2), 'Em nhân 3,6 thay vì chia.'], [rd(kmh / 60, 2), 'Một giờ có 3600 giây, không phải 60.']] }
      : { q: `Vận tốc ${n(ms)} m/giây bằng bao nhiêu ki-lô-mét/giờ?`, ans: kmh, tex: u(kmh, 'km/giờ'), sol: `${n(ms)} m/giây → trong 1 giờ (3600 giây) đi được ${n(ms)} × 3600 = ${n(ms * 3600)} m = ${n(kmh)} km. Vậy ${n(kmh)} km/giờ.`, method: 'Mẹo: m/giây × 3,6 = km/giờ.', wrongs: [[rd(ms / 3.6, 2), 'Em chia 3,6 thay vì nhân.'], [ms * 60, 'Một giờ có 3600 giây.']] };
  } },
  { id: 'g5_duoi_kip_khac_gio', topics: ['5-10'], d: [5, 5], think: true, make() {
    for (let i = 0; i < 40; i++) {
      const v1 = R(6, 9) * 5, v2 = v1 + R(2, 5) * 5, h = R(6, 8), lag = pick([0.5, 1, 1.5, 2]), gap = v1 * lag, tt = gap / (v2 - v1);
      if (Number.isInteger(tt * 4) && tt <= 5) { const meet = h * 60 + lag * 60 + tt * 60, H = Math.floor(meet / 60), M = Math.round(meet % 60);
        return { q: `Lúc ${h} giờ, một người đi xe máy từ A với vận tốc ${v1} km/giờ. Đến ${h + Math.floor(lag)} giờ ${(lag * 60) % 60} phút, một ô tô cũng đi từ A đuổi theo xe máy với vận tốc ${v2} km/giờ. Hỏi ô tô đuổi kịp xe máy lúc mấy giờ? (viết dạng giờ:phút)`, ans: `${H}:${String(M).padStart(2, '0')}`, tex: `${H}\\text{ giờ }${M}\\text{ phút}`,
          sol: solve('Thời gian xe máy đi trước ô tô là:', `${h + Math.floor(lag)} giờ ${(lag * 60) % 60} phút − ${h} giờ = ${n(lag)} giờ`, 'Khi ô tô bắt đầu đi, xe máy đã cách A:', `${v1} × ${n(lag)} = ${n(gap)} (km)`, 'Mỗi giờ ô tô gần xe máy thêm:', `${v2} − ${v1} = ${v2 - v1} (km)`, 'Thời gian để ô tô đuổi kịp xe máy:', `${n(gap)} : ${v2 - v1} = ${n(tt)} (giờ)`, `Ô tô đuổi kịp xe máy lúc: ${h + Math.floor(lag)} giờ ${(lag * 60) % 60} phút + ${n(tt)} giờ = ${H} giờ ${M} phút`, `Đáp số: ${H} giờ ${M} phút.`),
          method: 'Chuyển động cùng chiều, xuất phát khác giờ: tìm khoảng cách khi xe sau bắt đầu đi; thời gian đuổi kịp = khoảng cách : hiệu vận tốc; cộng vào thời điểm xe sau xuất phát.' }; }
    }
    return null;
  } },
  { id: 'g5_tau_qua_cau', topics: ['5-10'], d: [5, 6], think: true, make() {
    const v = pick([10, 12.5, 15, 20]), tt = R(20, 60), L = R(8, 20) * 10, C2 = rd(v * tt - L, 2);
    if (C2 <= 50) return null;
    return { q: `Một đoàn tàu dài ${L} m chạy qua một cây cầu dài ${n(C2)} m hết ${tt} giây (tính từ lúc đầu tàu bắt đầu lên cầu đến lúc toa cuối cùng rời khỏi cầu). Tính vận tốc của đoàn tàu theo ki-lô-mét/giờ.`, ans: rd(v * 3.6, 2), tex: u(rd(v * 3.6, 2), 'km/giờ'),
      sol: ['Bài giải', 'Từ lúc đầu tàu lên cầu đến lúc toa cuối rời cầu, đoàn tàu đi được quãng đường bằng chiều dài cầu cộng chiều dài đoàn tàu.', `Quãng đường đó là: ${n(C2)} + ${L} = ${n(rd(C2 + L, 2))} (m)`, `Vận tốc đoàn tàu là: ${n(rd(C2 + L, 2))} : ${tt} = ${n(v)} (m/giây)`, `Đổi: ${n(v)} m/giây = ${n(v)} × 3,6 = ${n(rd(v * 3.6, 2))} km/giờ`, `Đáp số: ${n(rd(v * 3.6, 2))} km/giờ.`].join('\n'),
      method: 'Vật có chiều dài đi qua cầu/hầm: quãng đường = chiều dài cầu + chiều dài vật (theo một điểm cố định trên tàu, ví dụ đầu tàu). Đổi m/giây sang km/giờ: × 3,6.' };
  } },
  { id: 'g5_van_toc_tb', topics: ['5-10'], d: [6, 6], think: true, mcq: true, make() {
    const [v1, v2] = pick([[40, 60], [30, 60], [20, 30], [12, 24], [45, 30], [60, 40], [36, 45]]), vtb = (2 * v1 * v2) / (v1 + v2);
    if (!Number.isInteger(vtb)) return null;
    const S = (v1 * v2) / gcd(v1, v2);
    return { q: `Một người đi từ A đến B với vận tốc ${v1} km/giờ, rồi quay về A theo đường cũ với vận tốc ${v2} km/giờ. Tính vận tốc trung bình của người đó trên cả quãng đường đi và về.`, ans: vtb, tex: u(vtb, 'km/giờ'),
      sol: ['Bài giải', `Vận tốc trung bình = tổng quãng đường : tổng thời gian (KHÔNG phải trung bình cộng hai vận tốc).`, `Giả sử quãng đường AB dài ${S} km (số chia hết cho cả ${v1} và ${v2}).`, `Thời gian đi: ${S} : ${v1} = ${S / v1} (giờ); thời gian về: ${S} : ${v2} = ${S / v2} (giờ).`, `Tổng quãng đường: ${S} × 2 = ${2 * S} (km); tổng thời gian: ${S / v1 + S / v2} giờ.`, `Vận tốc trung bình: ${2 * S} : ${S / v1 + S / v2} = ${vtb} (km/giờ).`, `(Kết quả không phụ thuộc độ dài AB.) Đáp số: ${vtb} km/giờ.`].join('\n'),
      method: 'Vận tốc trung bình = tổng quãng đường : tổng thời gian. Khi không biết quãng đường, có thể giả sử một độ dài thuận tiện để tính.',
      wrongs: [[(v1 + v2) / 2, 'Đây là trung bình cộng hai vận tốc — sai, vì thời gian đi và về khác nhau.']] };
  } },
  { id: 'g5_chay_quanh_ho', topics: ['5-10'], d: [5, 6], think: true, mcq: true, make() {
    const L = R(3, 12) * 100, v1 = pick([3, 4, 5]), v2 = pick([1, 2]), same = Math.random() < 0.5, tt = same ? L / (v1 - v2) : L / (v1 + v2);
    if (!Number.isInteger(tt)) return null;
    return { q: `Hai bạn cùng xuất phát từ một điểm trên đường chạy quanh hồ dài ${L} m, chạy ${same ? 'cùng chiều' : 'ngược chiều nhau'}. Bạn thứ nhất chạy ${v1} m/giây, bạn thứ hai chạy ${v2} m/giây. Hỏi sau bao nhiêu giây hai bạn gặp nhau lần đầu tiên?`, ans: tt, tex: u(tt, 'giây'),
      sol: same ? ['Bài giải', 'Chạy cùng chiều trên đường vòng: hai bạn gặp nhau lần đầu khi bạn chạy nhanh hơn bạn kia đúng một vòng.', `Mỗi giây bạn thứ nhất chạy hơn bạn thứ hai: ${v1} − ${v2} = ${v1 - v2} (m)`, `Thời gian gặp nhau lần đầu: ${L} : ${v1 - v2} = ${tt} (giây)`, `Đáp số: ${tt} giây.`].join('\n')
        : ['Bài giải', 'Chạy ngược chiều trên đường vòng: hai bạn gặp nhau khi tổng quãng đường hai bạn chạy bằng một vòng.', `Mỗi giây cả hai bạn chạy được: ${v1} + ${v2} = ${v1 + v2} (m)`, `Thời gian gặp nhau lần đầu: ${L} : ${v1 + v2} = ${tt} (giây)`, `Đáp số: ${tt} giây.`].join('\n'),
      method: 'Đường vòng: ngược chiều → gặp nhau khi tổng quãng đường = 1 vòng (dùng tổng vận tốc); cùng chiều → gặp nhau khi người nhanh hơn người chậm 1 vòng (dùng hiệu vận tốc).',
      wrongs: [[rd(same ? L / (v1 + v2) : L / Math.max(1, v1 - v2), 2), same ? 'Cùng chiều phải dùng hiệu vận tốc.' : 'Ngược chiều phải dùng tổng vận tốc.']] };
  } },

  { id: 'g5_ti_so_don_vi', topics: ['5-7'], d: [2, 3], mcq: true, essay: false, make() {
    const [a, b] = pick([[3, 75], [2, 40], [4, 50], [1, 25], [5, 125], [2, 80]]), r = fr(a * 100, b);
    return { q: `Tỉ số của ${a} m và ${b} cm là:`, ans: fstr(r), tex: ftex(r),
      sol: `Đổi về cùng đơn vị: ${a} m = ${a * 100} cm. Tỉ số là ${a * 100} : ${b} = ${fstr(r)}.`, method: 'Muốn lập tỉ số của hai đại lượng, phải đổi về CÙNG một đơn vị đo trước.',
      wrongs: [[fstr(fr(a, b)), 'Em chưa đổi ' + a + ' m ra xăng-ti-mét.'], [fstr(fr(b, a * 100)), 'Em viết ngược tỉ số.']] };
  } },
  { id: 'g5_hhcn_lit', topics: ['5-9'], d: [2, 3], mcq: true, make() {
    const a = rd(R(8, 25) / 10, 1), b = rd(R(5, 15) / 10, 1), c = rd(R(5, 12) / 10, 1), V = rd(a * b * c, 4), L = rd(V * 1000, 2);
    return { q: `Một bể nước dạng hình hộp chữ nhật có chiều dài ${n(a)} m, chiều rộng ${n(b)} m, chiều cao ${n(c)} m. Hỏi bể chứa được nhiều nhất bao nhiêu lít nước?`, ans: L, tex: u(L, 'lít'),
      sol: solve('Thể tích của bể là:', `${n(a)} × ${n(b)} × ${n(c)} = ${n(V)} (m³)`, `Đổi: ${n(V)} m³ = ${n(L)} dm³ = ${n(L)} lít`, `Đáp số: ${n(L)} lít.`),
      method: 'V = dài × rộng × cao (cùng đơn vị). 1 m³ = 1000 dm³; 1 dm³ = 1 lít.', wrongs: [[V, 'Em chưa đổi m³ ra lít.'], [rd(V * 100, 2), '1 m³ = 1000 dm³ (không phải 100).']] };
  } },
  { id: 'g5_rao_bon_hoa', topics: ['5-6'], d: [3, 4], make() {
    const dd = R(2, 8), vong = R(2, 3), price = R(10, 30) * 1000, C2 = rd(dd * 3.14, 4), L = rd(C2 * vong, 4), cost = rd(L * price, 2);
    return { q: `Một bồn hoa hình tròn có đường kính ${dd} m. Người ta rào xung quanh bồn hoa ${vong} vòng dây thép, mỗi mét dây giá ${n(price)} đồng.\na) Tính số mét dây thép cần dùng.\nb) Tính số tiền mua dây thép.`, ans: `${L}; ${cost}`, tex: parts(u(L, 'm'), u(cost, 'đồng')),
      sol: solve('Chu vi bồn hoa là:', `${dd} × 3,14 = ${n(C2)} (m)`, 'a) Số mét dây thép cần dùng là:', `${n(C2)} × ${vong} = ${n(L)} (m)`, 'b) Số tiền mua dây thép là:', `${n(price)} × ${n(L)} = ${n(cost)} (đồng)`, `Đáp số: a) ${n(L)} m; b) ${n(cost)} đồng.`),
      method: 'Rào xung quanh hình tròn → tính chu vi (C = d × 3,14), nhân với số vòng, rồi nhân với đơn giá.' };
  } },
  { id: 'g5_di_bo_gio', topics: ['5-10'], d: [3, 4], mcq: true, make() {
    const v = pick([4, 4.5, 5, 3.6, 12, 15]), h1 = R(6, 8), m1 = pick([0, 15, 30, 45]), dur = pick([45, 75, 90, 105, 120, 150]), S = rd((v * dur) / 60, 3), end = h1 * 60 + m1 + dur;
    return { q: `Một người ${v < 10 ? 'đi bộ' : 'đi xe đạp'} với vận tốc ${n(v)} km/giờ, khởi hành lúc ${h1} giờ${m1 ? ` ${m1} phút` : ""} và đến nơi lúc ${Math.floor(end / 60)} giờ${end % 60 ? ` ${end % 60} phút` : ""}. Tính quãng đường người đó đã đi.`, ans: S, tex: u(S, 'km'),
      sol: solve('Thời gian người đó đã đi là:', `${Math.floor(end / 60)} giờ ${end % 60} phút − ${h1} giờ ${m1} phút = ${Math.floor(dur / 60)} giờ ${dur % 60} phút = ${n(rd(dur / 60, 4))} giờ`, 'Quãng đường người đó đã đi là:', `${n(v)} × ${n(rd(dur / 60, 4))} = ${n(S)} (km)`, `Đáp số: ${n(S)} km.`),
      method: 'Tính thời gian đi = giờ đến − giờ đi, đổi ra giờ (số thập phân hoặc phân số), rồi s = v × t.', wrongs: [[rd(v * (Math.floor(dur / 60) + (dur % 60) / 100), 3), 'Không được viết ' + Math.floor(dur / 60) + ' giờ ' + (dur % 60) + ' phút thành ' + Math.floor(dur / 60) + ',' + (dur % 60) + ' giờ; phải đổi phút ra giờ (chia 60).']] };
  } },

  // ============ 5-11 · Ôn tập / tư duy tổng hợp ============
  { id: 'g5_danh_so_trang', topics: ['5-11', '5-2'], d: [5, 6], think: true, make(d) {
    const N = R(120, 480), digits = 9 + 180 + 3 * (N - 99);
    if (d >= 6) return { q: `Để đánh số trang một quyển sách (bắt đầu từ trang 1) người ta phải dùng tất cả ${n(digits)} chữ số. Hỏi quyển sách đó có bao nhiêu trang?`, ans: N, tex: u(N, 'trang'),
      sol: ['Bài giải', 'Trang 1 → 9: 9 trang, dùng 9 × 1 = 9 chữ số.', 'Trang 10 → 99: 90 trang, dùng 90 × 2 = 180 chữ số.', `Số chữ số dùng cho các trang có 3 chữ số: ${n(digits)} − 9 − 180 = ${n(digits - 189)} (chữ số)`, `Số trang có 3 chữ số: ${n(digits - 189)} : 3 = ${N - 99} (trang)`, `Quyển sách có: 99 + ${N - 99} = ${N} (trang)`, `Đáp số: ${N} trang.`].join('\n'),
      method: 'Chia các trang theo số chữ số (1, 2, 3 chữ số), tính số chữ số dùng cho mỗi nhóm; phần còn lại chia cho 3 để ra số trang có 3 chữ số.' };
    return { q: `Để đánh số trang một quyển sách dày ${N} trang (bắt đầu từ trang 1) cần dùng tất cả bao nhiêu chữ số?`, ans: digits, tex: u(digits, 'chữ số'),
      sol: ['Bài giải', 'Trang 1 → 9: 9 × 1 = 9 chữ số.', 'Trang 10 → 99: 90 × 2 = 180 chữ số.', `Trang 100 → ${N}: có ${N} − 100 + 1 = ${N - 99} trang, dùng ${N - 99} × 3 = ${3 * (N - 99)} chữ số.`, `Tổng: 9 + 180 + ${3 * (N - 99)} = ${n(digits)} (chữ số)`, `Đáp số: ${n(digits)} chữ số.`].join('\n'),
      method: 'Nhóm các trang theo số chữ số; số trang từ a đến b là b − a + 1.' };
  } },
  { id: 'g5_day_so_quy_luat', topics: ['5-11', '5-3'], d: [3, 5], mcq: true, make(d) {
    const a = rd(R(1, 20) / (d >= 4 ? 10 : 1), 1), dd = d >= 4 ? rd(R(2, 9) / 10, 1) : R(2, 9), k = R(20, 100), v = rd(a + (k - 1) * dd, 2);
    return { q: `Cho dãy số: $${[0, 1, 2, 3].map((i) => t(rd(a + i * dd, 2))).join(';\\ ')};\\ \\ldots$ Số thứ ${k} của dãy là số nào?`, ans: v, tex: t(v),
      sol: `Dãy số cách đều, mỗi số hơn số liền trước ${n(dd)}. Từ số thứ 1 đến số thứ ${k} có ${k - 1} khoảng cách.\nSố thứ ${k} = ${n(a)} + ${n(dd)} × ${k - 1} = ${n(v)}.`, method: 'Dãy cách đều: số thứ n = số đầu + khoảng cách × (n − 1).',
      wrongs: [[rd(a + k * dd, 2), 'Từ số thứ 1 đến số thứ ' + k + ' chỉ có ' + (k - 1) + ' khoảng cách.'], [rd(k * dd, 2), 'Em quên cộng số đầu tiên.']] };
  } },
  { id: 'g5_lam_chung', topics: ['5-11', '5-1'], d: [6, 6], think: true, make() {
    const [x, y] = pick([[6, 3], [12, 4], [10, 15], [4, 12], [20, 30], [6, 12], [9, 18]]), T = (x * y) / (x + y);
    return { q: `Nếu làm một mình thì bác An làm xong một công việc trong ${x} giờ, bác Bình làm xong công việc đó trong ${y} giờ. Hỏi nếu hai bác cùng làm thì sau bao lâu sẽ xong công việc?`, ans: T, tex: u(T, 'giờ'),
      sol: ['Bài giải', `Mỗi giờ bác An làm được 1/${x} công việc; bác Bình làm được 1/${y} công việc.`, `Mỗi giờ cả hai bác làm được: 1/${x} + 1/${y} = ${fstr(fr(x + y, x * y))} (công việc)`, `Thời gian hai bác cùng làm xong là: 1 : ${fstr(fr(x + y, x * y))} = ${n(T)} (giờ)`, `Đáp số: ${n(T)} giờ.`].join('\n'),
      method: 'Bài toán làm chung: coi cả công việc là 1. Làm xong trong x giờ → mỗi giờ làm được 1/x công việc. Cộng năng suất, rồi lấy 1 chia cho tổng năng suất.' };
  } },
  { id: 'g5_tong_day_cach_deu', topics: ['5-11', '5-3'], d: [4, 5], think: true, make() {
    const a = R(1, 9), k = pick([2, 3, 5]), cnt = R(15, 50), last = a + (cnt - 1) * k, S = ((a + last) * cnt) / 2;
    return { q: `Tính tổng: $${a} + ${a + k} + ${a + 2 * k} + \\ldots + ${last}$`, ans: S, tex: t(S),
      sol: ['Bài giải', `Dãy số cách đều ${k} đơn vị. Số các số hạng: (${last} − ${a}) : ${k} + 1 = ${cnt} (số)`, `Ghép cặp số đầu với số cuối: ${a} + ${last} = ${a + last}, mỗi cặp đều bằng ${a + last}.`, `Tổng = (${a} + ${last}) × ${cnt} : 2 = ${n(S)}`, `Đáp số: ${n(S)}.`].join('\n'),
      method: 'Tổng dãy cách đều = (số đầu + số cuối) × số số hạng : 2; số số hạng = (số cuối − số đầu) : khoảng cách + 1.' };
  } },
  { id: 'g5_dem_tam_giac', topics: ['5-11', '5-5'], d: [5, 6], think: true, mcq: true, make() {
    const k = R(1, 5), pts = k + 2, ans = C(pts, 2);
    return { q: `Cho tam giác ABC. Từ đỉnh A kẻ ${k} đoạn thẳng xuống cạnh BC (các đầu mút trên BC khác nhau và khác B, C). Hỏi trên hình vẽ có tất cả bao nhiêu hình tam giác?`, ans, tex: u(ans, 'hình tam giác'),
      sol: ['Bài giải', `Mỗi hình tam giác gồm đỉnh A và một đoạn thẳng trên cạnh BC. Trên BC có ${pts} điểm (B, C và ${k} điểm ở giữa).`, `Mỗi điểm nối với ${pts - 1} điểm còn lại tạo thành đoạn thẳng, mỗi đoạn được đếm 2 lần: ${pts} × ${pts - 1} : 2 = ${ans} (đoạn).`, `Vậy có ${ans} hình tam giác.`].join('\n'),
      method: 'Đếm hình có hệ thống: mỗi tam giác ứng với một đoạn thẳng trên cạnh đáy. Với n điểm thẳng hàng, số đoạn thẳng = n × (n − 1) : 2.',
      wrongs: [[k + 1, 'Em chỉ đếm các tam giác nhỏ, chưa đếm tam giác ghép.'], [pts, 'Đó là số điểm trên cạnh BC.']] };
  } },
];
