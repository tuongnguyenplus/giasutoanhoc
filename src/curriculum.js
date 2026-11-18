// Phân phối chương trình Toán lớp 1–12 theo Chương trình GDPT 2018 và bộ SGK
// "Kết nối tri thức với cuộc sống" (NXB Giáo dục Việt Nam) — bộ sách được Bộ GD&ĐT chọn dùng
// thống nhất toàn quốc từ năm học 2026–2027 (Quyết định 3588/QĐ-BGDĐT ngày 26/12/2025).
// Thứ tự chủ đề bám mục lục SGK; số tuần là ước lượng theo phân phối chương trình phổ biến.
// `week` là tuần học bắt đầu chủ đề (năm học ~35 tuần, HK1: tuần 1–18, HK2: tuần 19–35).
// `gen` là bộ sinh bài offline gần nhất với chủ đề (dùng khi không có AI hoặc AI lỗi).
// Thầy cô / phụ huynh có thể chỉnh tuần cho khớp lịch thực tế của trường.

const t = (id, week, name, gen, p = {}) => ({ id, week, name, gen, p });

export const CURRICULUM = {
  1: [
    t('1-1', 1, 'Các số từ 0 đến 10', 'compare_numbers', { max: 10 }),
    t('1-2', 6, 'Phép cộng trong phạm vi 10', 'add_sub', { max: 10, ops: ['+'] }),
    t('1-3', 9, 'Phép trừ trong phạm vi 10', 'add_sub', { max: 10, ops: ['-'] }),
    t('1-4', 12, 'Làm quen với một số hình phẳng, khối hình', 'add_sub', { max: 10 }),
    t('1-5', 14, 'Ôn tập cộng, trừ trong phạm vi 10', 'add_sub', { max: 10 }),
    t('1-6', 19, 'Các số trong phạm vi 100', 'compare_numbers', { max: 100 }),
    t('1-7', 23, 'Độ dài và đo độ dài', 'add_sub', { max: 20, unit: 'cm' }),
    t('1-8', 25, 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100', 'add_sub', { max: 100, noCarry: true }),
    t('1-9', 31, 'Thời gian, giờ và lịch', 'clock', {}),
    t('1-10', 33, 'Ôn tập cuối năm', 'add_sub', { max: 100, noCarry: true }),
  ],
  2: [
    t('2-1', 1, 'Ôn tập và bổ sung (số đến 100, tia số)', 'compare_numbers', { max: 100 }),
    t('2-2', 3, 'Phép cộng, phép trừ (có nhớ) trong phạm vi 20', 'add_sub', { max: 20 }),
    t('2-3', 7, 'Làm quen với khối lượng (kg), dung tích (lít)', 'word_basic', { max: 50, unit: 'kg' }),
    t('2-4', 9, 'Phép cộng, phép trừ (có nhớ) trong phạm vi 100', 'add_sub', { max: 100 }),
    t('2-5', 14, 'Hình phẳng: điểm, đoạn thẳng, đường gấp khúc', 'polyline', {}),
    t('2-6', 16, 'Ngày – giờ, giờ – phút, ngày – tháng', 'clock', {}),
    t('2-7', 19, 'Phép nhân, phép chia (bảng 2, bảng 5)', 'mul_div', { tables: [2, 5] }),
    t('2-8', 24, 'Các số trong phạm vi 1000', 'compare_numbers', { max: 1000 }),
    t('2-9', 27, 'Độ dài: mét, ki-lô-mét', 'unit_convert', { kind: 'length_basic' }),
    t('2-10', 29, 'Phép cộng, phép trừ trong phạm vi 1000', 'add_sub', { max: 1000 }),
    t('2-11', 33, 'Làm quen với yếu tố thống kê, xác suất', 'word_basic', { max: 100 }),
  ],
  3: [
    t('3-1', 1, 'Ôn tập và bổ sung', 'add_sub', { max: 1000 }),
    t('3-2', 3, 'Bảng nhân, bảng chia 3 đến 9', 'mul_div', { tables: [3, 4, 5, 6, 7, 8, 9] }),
    t('3-3', 8, 'Gấp lên, giảm đi một số lần', 'times_more', {}),
    t('3-4', 10, 'Góc, hình tròn, tâm, bán kính, đường kính', 'circle_basic', {}),
    t('3-5', 12, 'Nhân, chia số có hai, ba chữ số với số có một chữ số', 'mul_div', { digits: 3 }),
    t('3-6', 15, 'Biểu thức số, thứ tự thực hiện phép tính', 'expr_order', { max: 100 }),
    t('3-7', 17, 'Đơn vị đo: mi-li-mét, gam, mi-li-lít, nhiệt độ', 'unit_convert', { kind: 'g3' }),
    t('3-8', 19, 'Các số trong phạm vi 10 000, 100 000', 'compare_numbers', { max: 100000 }),
    t('3-9', 24, 'Chu vi, diện tích hình chữ nhật, hình vuông', 'rect', {}),
    t('3-10', 27, 'Cộng, trừ, nhân, chia trong phạm vi 100 000', 'mul_div', { digits: 4 }),
    t('3-11', 31, 'Tiền Việt Nam, xem đồng hồ, tháng – năm', 'word_basic', { max: 100000, money: true }),
    t('3-12', 33, 'Làm quen với yếu tố thống kê, xác suất', 'stats_mean', { simple: true }),
  ],
  4: [
    t('4-1', 1, 'Số có nhiều chữ số, lớp triệu, làm tròn số', 'large_numbers', {}),
    t('4-2', 6, 'Cộng, trừ số có nhiều chữ số; tính chất phép cộng', 'add_sub', { max: 1000000 }),
    t('4-3', 9, 'Số trung bình cộng; tìm hai số khi biết tổng và hiệu', 'avg_sum_diff', {}),
    t('4-4', 11, 'Góc nhọn, góc tù, góc bẹt; hai đường thẳng vuông góc, song song', 'angles', { basic: true }),
    t('4-5', 13, 'Đơn vị đo khối lượng, diện tích (yến, tạ, tấn, dm², m²)', 'unit_convert', { kind: 'g4' }),
    t('4-6', 15, 'Nhân, chia với số có nhiều chữ số', 'mul_div', { digits: 5, two: true }),
    t('4-7', 19, 'Dấu hiệu chia hết cho 2, 5, 3, 9', 'divisibility', {}),
    t('4-8', 21, 'Phân số; rút gọn, quy đồng mẫu số', 'fraction', { ops: ['simplify', 'compare'] }),
    t('4-9', 26, 'Phép cộng, phép trừ phân số', 'fraction', { ops: ['+', '-'] }),
    t('4-10', 29, 'Phép nhân, phép chia phân số', 'fraction', { ops: ['*', '/'] }),
    t('4-11', 31, 'Hình bình hành, hình thoi', 'area', { shapes: ['parallelogram', 'rhombus'] }),
    t('4-12', 33, 'Dãy số liệu thống kê, biểu đồ cột', 'stats_mean', { simple: true }),
  ],
  5: [
    t('5-1', 1, 'Ôn tập và bổ sung: phân số, hỗn số', 'fraction', { ops: ['+', '-', '*', '/', 'mixed'] }),
    t('5-2', 5, 'Số thập phân; so sánh, làm tròn số thập phân', 'decimal', { ops: ['round', 'compare'] }),
    t('5-3', 9, 'Các phép tính với số thập phân: cộng, trừ', 'decimal', { ops: ['+', '-'] }),
    t('5-4', 11, 'Các phép tính với số thập phân: nhân, chia', 'decimal', { ops: ['*', '/'] }),
    t('5-5', 14, 'Một số hình phẳng: hình tam giác, hình thang; diện tích', 'area', { shapes: ['triangle', 'trapezoid'] }),
    t('5-6', 16, 'Hình tròn: chu vi, diện tích', 'circle', {}),
    t('5-7', 19, 'Tỉ số và các bài toán liên quan (tổng – tỉ, hiệu – tỉ, tỉ lệ bản đồ)', 'ratio_sum', {}),
    t('5-8', 22, 'Tỉ số phần trăm và giải toán', 'percent', {}),
    t('5-9', 25, 'Thể tích; hình hộp chữ nhật, hình lập phương', 'volume', {}),
    t('5-10', 29, 'Số đo thời gian; vận tốc, quãng đường, thời gian', 'speed', {}),
    t('5-11', 33, 'Ôn tập cuối năm', 'percent', {}),
  ],
  6: [
    t('6-1', 1, 'Tập hợp các số tự nhiên', 'sets_basic', {}),
    t('6-2', 3, 'Các phép tính với số tự nhiên; lũy thừa, thứ tự thực hiện', 'powers', { natural: true }),
    t('6-3', 6, 'Tính chia hết; số nguyên tố, phân tích ra thừa số nguyên tố', 'divisibility', { prime: true }),
    t('6-4', 9, 'Ước chung lớn nhất, bội chung nhỏ nhất', 'gcd_lcm', {}),
    t('6-5', 12, 'Số nguyên và các phép tính', 'integers', {}),
    t('6-6', 16, 'Một số hình phẳng trong thực tiễn; tính đối xứng của hình phẳng', 'area', { shapes: ['rect', 'rhombus', 'parallelogram', 'trapezoid'] }),
    t('6-7', 19, 'Phân số; các phép tính với phân số', 'fraction', { ops: ['+', '-', '*', '/'], neg: true }),
    t('6-8', 24, 'Số thập phân; tỉ số và tỉ số phần trăm', 'percent', { g6: true }),
    t('6-9', 28, 'Điểm, đường thẳng, đoạn thẳng, trung điểm; góc', 'segments', {}),
    t('6-10', 32, 'Dữ liệu, xác suất thực nghiệm', 'prob', { experimental: true }),
  ],
  7: [
    t('7-1', 1, 'Số hữu tỉ và các phép tính', 'fraction', { ops: ['+', '-', '*', '/', 'pow'], neg: true }),
    t('7-2', 5, 'Số thực; căn bậc hai số học; giá trị tuyệt đối', 'sqrt', { basic: true }),
    t('7-3', 8, 'Góc và đường thẳng song song', 'angles', {}),
    t('7-4', 11, 'Tam giác bằng nhau; tổng ba góc trong tam giác', 'triangle_angles', {}),
    t('7-5', 16, 'Thu thập và biểu diễn dữ liệu', 'stats_mean', {}),
    t('7-6', 19, 'Tỉ lệ thức; đại lượng tỉ lệ thuận, tỉ lệ nghịch', 'proportion', {}),
    t('7-7', 23, 'Biểu thức đại số; đa thức một biến', 'poly_eval', {}),
    t('7-8', 27, 'Làm quen với biến cố và xác suất của biến cố', 'prob', {}),
    t('7-9', 29, 'Quan hệ giữa các yếu tố trong tam giác', 'triangle_ineq', {}),
    t('7-10', 32, 'Hình hộp chữ nhật, hình lập phương, lăng trụ đứng', 'volume', { prism: true }),
  ],
  8: [
    t('8-1', 1, 'Đa thức nhiều biến; cộng, trừ, nhân, chia đa thức', 'poly_eval', { multi: true }),
    t('8-2', 4, 'Hằng đẳng thức đáng nhớ', 'identities', {}),
    t('8-3', 7, 'Hằng đẳng thức: phân tích đa thức thành nhân tử', 'factor', {}),
    t('8-4', 9, 'Tứ giác: hình thang, hình bình hành, hình chữ nhật, hình thoi, hình vuông', 'quad_angles', {}),
    t('8-5', 12, 'Định lí Thalès trong tam giác; đường trung bình', 'thales', {}),
    t('8-6', 15, 'Dữ liệu và biểu đồ', 'stats_mean', {}),
    t('8-7', 19, 'Phân thức đại số', 'rational_expr', {}),
    t('8-8', 23, 'Phương trình bậc nhất một ẩn và giải bài toán bằng cách lập phương trình', 'linear_eq', {}),
    t('8-9', 26, 'Hàm số bậc nhất y = ax + b và đồ thị', 'linear_fn', {}),
    t('8-10', 28, 'Mở đầu về tính xác suất của biến cố', 'prob', {}),
    t('8-11', 30, 'Tam giác đồng dạng; định lí Pythagore', 'pythagoras', {}),
    t('8-12', 34, 'Một số hình khối: hình chóp tam giác đều, tứ giác đều', 'pyramid', {}),
  ],
  9: [
    t('9-1', 1, 'Phương trình và hệ hai phương trình bậc nhất hai ẩn', 'system2', {}),
    t('9-2', 5, 'Phương trình và bất phương trình bậc nhất một ẩn', 'linear_ineq', {}),
    t('9-3', 8, 'Căn bậc hai và căn bậc ba', 'sqrt', {}),
    t('9-4', 11, 'Hệ thức lượng trong tam giác vuông', 'trig_right', {}),
    t('9-5', 14, 'Đường tròn: cung, dây, tiếp tuyến', 'circle', { advanced: true }),
    t('9-6', 19, 'Hàm số y = ax² (a ≠ 0); phương trình bậc hai một ẩn; định lí Viète', 'quadratic', {}),
    t('9-7', 24, 'Tần số và tần số tương đối', 'stats_mean', { freq: true }),
    t('9-8', 27, 'Xác suất của biến cố trong một số mô hình đơn giản', 'prob', {}),
    t('9-9', 29, 'Đường tròn ngoại tiếp, nội tiếp; tứ giác nội tiếp', 'cyclic_quad', {}),
    t('9-10', 32, 'Hình trụ, hình nón, hình cầu', 'solids', {}),
  ],
  10: [
    t('10-1', 1, 'Mệnh đề và tập hợp', 'sets', {}),
    t('10-2', 4, 'Bất phương trình và hệ bất phương trình bậc nhất hai ẩn', 'linear_ineq2', {}),
    t('10-3', 7, 'Hệ thức lượng trong tam giác (định lí côsin, sin)', 'law_cos', {}),
    t('10-4', 10, 'Vectơ; tích vô hướng', 'vector2', {}),
    t('10-5', 15, 'Các số đặc trưng của mẫu số liệu không ghép nhóm', 'stats_mean', { advanced: true }),
    t('10-6', 19, 'Hàm số bậc hai và đồ thị', 'quad_fn', {}),
    t('10-7', 21, 'Dấu của tam thức bậc hai; bất phương trình bậc hai', 'quad_ineq', {}),
    t('10-8', 24, 'Phương pháp tọa độ trong mặt phẳng', 'coord2', {}),
    t('10-9', 28, 'Đại số tổ hợp; nhị thức Newton', 'comb', {}),
    t('10-10', 31, 'Tính xác suất theo định nghĩa cổ điển', 'prob', { comb: true }),
  ],
  11: [
    t('11-1', 1, 'Hàm số lượng giác và phương trình lượng giác', 'trig', {}),
    t('11-2', 6, 'Dãy số; cấp số cộng, cấp số nhân', 'sequence', {}),
    t('11-3', 9, 'Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm', 'stats_mean', { grouped: true }),
    t('11-4', 11, 'Quan hệ song song trong không gian', 'pyramid', { g11: true }),
    t('11-5', 15, 'Giới hạn; hàm số liên tục', 'limit', {}),
    t('11-6', 19, 'Hàm số mũ và hàm số lôgarit', 'exp_log', {}),
    t('11-7', 23, 'Quan hệ vuông góc trong không gian', 'pyramid', { g11: true, perp: true }),
    t('11-8', 27, 'Các quy tắc tính xác suất', 'prob', { rules: true }),
    t('11-9', 29, 'Đạo hàm', 'derivative', {}),
  ],
  12: [
    t('12-1', 1, 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số', 'extrema', {}),
    t('12-2', 6, 'Vectơ và hệ trục tọa độ trong không gian', 'coord3', {}),
    t('12-3', 9, 'Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm', 'stats_mean', { grouped: true, spread: true }),
    t('12-4', 19, 'Nguyên hàm và tích phân', 'integral', {}),
    t('12-5', 24, 'Phương pháp tọa độ trong không gian: mặt phẳng, đường thẳng, mặt cầu', 'coord3', { planes: true }),
    t('12-6', 29, 'Xác suất có điều kiện; công thức Bayes', 'cond_prob', {}),
    t('12-7', 32, 'Ôn thi tốt nghiệp THPT', 'extrema', {}),
  ],
};

export const SCHOOL_WEEKS = 35;

export const CURRICULUM_SOURCE = {
  name: 'Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)',
  note: 'Bộ SGK dùng thống nhất toàn quốc từ năm học 2026–2027 theo Quyết định 3588/QĐ-BGDĐT ngày 26/12/2025, Chương trình GDPT 2018.',
};

export function getTopics(grade) {
  return CURRICULUM[grade] || [];
}

export function findTopic(topicId) {
  const grade = Number(String(topicId).split('-')[0]);
  return getTopics(grade).find((x) => x.id === topicId) || null;
}

const DAY = 86400000;

/** Ngày khai giảng mặc định: 5/9 của năm học hiện tại. */
export function defaultSchoolYearStart(today) {
  const y = today.getUTCMonth() >= 7 ? today.getUTCFullYear() : today.getUTCFullYear() - 1; // từ tháng 8 trở đi là năm học mới
  return `${y}-09-05`;
}

/**
 * Xác định tuần học hiện tại và chủ đề tương ứng trong giáo trình.
 * - Trong năm học: chủ đề có `week` lớn nhất ≤ tuần hiện tại.
 * - Nghỉ hè (sau tuần 35): ôn tập luân phiên toàn bộ chủ đề của lớp.
 * - Tuần nghỉ Tết (cấu hình qua `tetBreakWeeks`) không được tính.
 */
export function getProgress(grade, schoolYearStart, todayStr, { tetBreakWeeks = [] } = {}) {
  const topics = getTopics(grade);
  const start = new Date(schoolYearStart + 'T00:00:00Z');
  const today = new Date(todayStr + 'T00:00:00Z');
  const rawWeek = Math.floor((today - start) / DAY / 7) + 1;
  const skipped = tetBreakWeeks.filter((w) => w <= rawWeek).length;
  let week = rawWeek - skipped;
  let phase = 'school';
  if (rawWeek < 1) { week = 1; phase = 'before'; }
  if (week > SCHOOL_WEEKS) phase = 'summer';

  let idx;
  if (phase === 'summer') {
    // Nghỉ hè: mỗi tuần ôn một chủ đề, xoay vòng
    idx = (week - SCHOOL_WEEKS - 1) % topics.length;
  } else {
    idx = 0;
    topics.forEach((tp, i) => { if (tp.week <= week) idx = i; });
  }
  const current = topics[idx];
  const learned = phase === 'summer' ? topics : topics.slice(0, idx + 1);
  const previous = learned.filter((x) => x.id !== current.id);
  return {
    week: Math.max(1, week),
    phase,
    semester: phase === 'summer' ? 'Nghỉ hè' : week <= 18 ? 'Học kì 1' : 'Học kì 2',
    current,
    previous,
    learned,
  };
}
