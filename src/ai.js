// Tích hợp Claude: ra đề, chấm bài tự luận qua ảnh chụp, giảng giải và nhận xét.
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { CURRICULUM_SOURCE } from './curriculum.js';

const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5-5';

export function aiEnabled() {
  if (process.env.AI_MODE === 'off') return false;
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client;
const getClient = () => (client ??= new Anthropic());

// Lời dặn chung — giữ cố định để tận dụng prompt caching.
const SYSTEM = `Bạn là một giáo viên Toán giỏi, tận tâm ở Việt Nam, dạy theo Chương trình giáo dục phổ thông 2018 và bộ sách giáo khoa "${CURRICULUM_SOURCE.name}" (${CURRICULUM_SOURCE.note}).

Nguyên tắc chung:
- Viết hoàn toàn bằng tiếng Việt, xưng "thầy/cô" và gọi học sinh là "em". Giọng văn ấm áp, khích lệ, rõ ràng, phù hợp lứa tuổi của lớp được nêu.
- Dùng đúng thuật ngữ, kí hiệu và cách trình bày như sách giáo khoa Việt Nam (dấu phẩy thập phân, ví dụ 3,5; kí hiệu ƯCLN, BCNN, ∆, Thalès, Pythagore, Viète...).
- Mọi công thức, biểu thức toán viết bằng LaTeX đặt trong $...$ (ví dụ $\\frac{3}{4}$, $x^2 - 5x + 6 = 0$). Trong LaTeX, số thập phân viết dạng 3{,}5.
- Chỉ dùng kiến thức đã học tới thời điểm của chủ đề (không dùng kiến thức lớp trên).
- Trước khi trả lời, tự giải lại và kiểm tra cẩn thận để đáp án chắc chắn đúng.

Khi soạn câu TỰ LUẬN, bám theo các dạng bài điển hình trong SGK, sách bài tập, vở bài tập, phiếu bài tập cuối tuần và đề kiểm tra của bộ sách:
- Ưu tiên bài toán có lời văn gắn với tình huống thực tế, giải bằng 2–4 bước tính, hoặc bài có nhiều ý a), b), c) (ví dụ "Tìm x: a) … b) …"). Hạn chế bài chỉ tính một phép.
- Tiểu học (lớp 1–5): rút về đơn vị; bài toán giải bằng hai, ba bước tính; tìm thành phần chưa biết; một phần mấy của một số; trung bình cộng; tổng – hiệu; tổng – tỉ; hiệu – tỉ (bài toán tuổi); tỉ số phần trăm (tìm p% của một số, tìm một số khi biết p% của nó, lãi – vốn, phần còn lại); chuyển động đều (gặp nhau, đuổi kịp, xuôi – ngược dòng, có thời gian nghỉ); chu vi, diện tích, thể tích gắn với thực tế (rào vườn, lát nền, bể nước); tiền Việt Nam, xem giờ. Bài tư duy: giả thiết tạm (gà – chó), tính ngược từ cuối, trồng cây, tính nhanh. Trình bày lời giải mẫu đúng kiểu vở: "Bài giải", mỗi bước một câu lời giải rồi phép tính kèm đơn vị trong ngoặc, cuối cùng "Đáp số: …".
- THCS (lớp 6–9): bài toán thực tế về số nguyên, phân số, phần trăm (tiết kiệm, giảm giá); ƯCLN/BCNN (chia đều, xếp hàng thừa/thiếu); đại lượng tỉ lệ thuận, tỉ lệ nghịch, chia theo tỉ lệ; giải bài toán bằng cách lập phương trình / hệ phương trình (chuyển động, năng suất, làm chung – làm riêng, vòi nước, số học, hình học, phần trăm); phương trình bậc hai từ bài toán diện tích; Viète; rút gọn biểu thức chứa căn rồi tính giá trị; Pythagore, Thalès, hệ thức lượng trong tình huống đo đạc thực tế; xác suất của biến cố. Lời giải phải có: gọi ẩn (đơn vị, điều kiện) → lập phương trình → giải → đối chiếu điều kiện → kết luận.
- THPT (lớp 10–12): bài toán tối ưu (hệ bất phương trình bậc nhất hai ẩn, đạo hàm), mô hình hàm số bậc hai (cổng parabol, quỹ đạo), hệ thức lượng đo khoảng cách, tổ hợp – xác suất có lập luận, cấp số và lãi kép trong tài chính, tích phân tính quãng đường/diện tích, xác suất có điều kiện.
- Mức 6 (nâng cao, lớp 5): dùng các dạng bồi dưỡng học sinh giỏi như so sánh phân số bằng phần bù, tính nhanh dãy phân số (1/(n×(n+1)), 1/2 + 1/4 + …), cùng thêm vào tử và mẫu, quên/dời dấu phẩy, làm tròn ngược, chuyển kho cho bằng nhau, tuổi sau n năm, tỉ lệ bản đồ với diện tích, kéo dài đáy tam giác/hình thang, hình vuông nội tiếp hình tròn, phơi khô hạt tươi (lượng chất khô không đổi), pha loãng nước muối, tăng/giảm % liên tiếp, thả đá vào bể, sơn khối lập phương rồi cắt nhỏ, tàu qua cầu, vận tốc trung bình đi – về, chạy quanh hồ, làm chung công việc, đánh số trang sách, đếm hình.
- Câu tự luận phải có đáp số cụ thể; nếu có nhiều ý thì answer_key ghi lần lượt kết quả các ý, cách nhau bằng "; ", và ghi rõ trong đề (ví dụ "(ghi: số gà; số chó)").
- Tuyệt đối không chép nguyên văn bài trong sách; tự soạn bài mới cùng dạng với số liệu, bối cảnh mới.`;

const ProblemSchema = z.object({
  question: z.string().describe('Đề bài đầy đủ, công thức trong $...$'),
  kind: z.enum(['mcq', 'essay']),
  choices: z.array(z.string()).describe('Trắc nghiệm: đúng 4 phương án (không ghi A/B/C/D). Tự luận: mảng rỗng'),
  correct_index: z.number().int().describe('Chỉ số (0–3) của phương án đúng; tự luận ghi -1'),
  choice_explanations: z.array(z.string()).describe('Trắc nghiệm: với mỗi phương án, giải thích vì sao đúng / vì sao sai (sai lầm thường gặp dẫn tới phương án đó). Tự luận: mảng rỗng'),
  final_answer: z.string().describe('Đáp số cuối cùng, dạng hiển thị (LaTeX, không kèm $)'),
  answer_key: z.string().describe('Đáp số dạng máy đọc được: số dùng dấu chấm thập phân, phân số a/b, nhiều giá trị cách nhau bằng "; ". Nếu đáp số là chữ thì ghi chữ.'),
  solution: z.string().describe('Lời giải mẫu từng bước, mỗi bước một dòng'),
  method: z.string().describe('Phương pháp chung để giải dạng bài này (2–4 câu)'),
});
const ProblemsSchema = z.object({ problems: z.array(ProblemSchema) });

const GradeSchema = z.object({
  readable: z.boolean().describe('Ảnh có đọc được bài làm không'),
  transcription: z.string().describe('Tóm tắt những gì em đã viết trong bài (các bước chính)'),
  final_answer_seen: z.string().describe('Đáp số cuối cùng em ghi trong bài'),
  is_correct: z.boolean().describe('Đúng khi đáp số đúng VÀ lập luận hợp lệ, không có lỗi sai bản chất'),
  score: z.number().int().describe('Điểm 0–10 cho bài này'),
  why_correct: z.string().describe('Nếu đúng: giải thích một cách logic vì sao cách làm và kết quả của em đúng. Nếu sai: ghi rỗng'),
  mistakes: z.string().describe('Nếu sai: chỉ rõ em sai ở bước nào, sai như thế nào và vì sao sai. Nếu đúng: góp ý trình bày (nếu có)'),
  correct_method: z.string().describe('Phương pháp làm đúng cho dạng bài này và lời giải đúng từng bước'),
  encouragement: z.string().describe('Một câu động viên ngắn'),
});

async function call(schema, { messages, effort = 'medium', maxTokens = 16000 }) {
  const res = await getClient().beta.messages.parse({
    model: MODEL,
    max_tokens: maxTokens,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    output_config: { effort, format: betaZodOutputFormat(schema) },
    messages,
  });
  if (res.stop_reason === 'refusal') throw new Error('Mô hình từ chối yêu cầu: ' + (res.stop_details?.explanation || ''));
  if (res.stop_reason === 'max_tokens') throw new Error('Phản hồi bị cắt do vượt giới hạn độ dài');
  if (!res.parsed_output) throw new Error('Không đọc được phản hồi có cấu trúc');
  return res.parsed_output;
}

function sanitize(p, want) {
  const kind = want.kind;
  const out = { ...p, kind };
  if (kind === 'mcq') {
    if (!Array.isArray(p.choices) || p.choices.length < 2 || p.correct_index < 0 || p.correct_index >= p.choices.length) {
      throw new Error('Bài trắc nghiệm không hợp lệ');
    }
    out.choice_explanations = p.choices.map((_, i) => p.choice_explanations?.[i] || (i === p.correct_index ? 'Đây là đáp án đúng.' : 'Phương án này sai.'));
  } else {
    out.choices = []; out.correct_index = -1; out.choice_explanations = [];
  }
  return out;
}

const DIFF = { 1: 'nhận biết (rất dễ)', 2: 'thông hiểu (dễ)', 3: 'vận dụng (trung bình)', 4: 'vận dụng (khá khó)', 5: 'vận dụng cao (khó, cần tư duy)', 6: 'nâng cao – bồi dưỡng học sinh giỏi (cần suy luận sáng tạo, nhiều bước)' };

/**
 * Ra đề theo danh sách "ô" đã lập sẵn (chủ đề, độ khó, hình thức).
 * @param {{grade:number, slots:Array<{topic_name:string, kind:'mcq'|'essay', difficulty:number, is_thinking:boolean}>, weakNotes?:string}} spec
 */
export async function generateProblems({ grade, slots, weakNotes = '' }) {
  const list = slots.map((s, i) => `${i + 1}. Chủ đề: "${s.topic_name}" — mức độ ${s.difficulty}/5 (${DIFF[s.difficulty]}) — ${s.kind === 'mcq' ? 'TRẮC NGHIỆM 4 phương án' : 'TỰ LUẬN có lời văn, nhiều bước hoặc nhiều ý (học sinh làm ra vở, chụp ảnh nộp)'}${s.is_thinking ? ' — CÂU TƯ DUY: tình huống thực tế hoặc bài toán mở, đòi hỏi suy luận nhiều bước, không áp dụng công thức máy móc' : ''}`).join('\n');
  const out = await call(ProblemsSchema, {
    effort: 'medium',
    messages: [{ role: 'user', content: `Hãy soạn đề luyện tập hằng ngày cho học sinh lớp ${grade}, gồm đúng ${slots.length} câu theo thứ tự sau (từ dễ đến khó):\n${list}\n\n${weakNotes ? `Lưu ý về học sinh: ${weakNotes}\n\n` : ''}Yêu cầu: các câu không trùng nhau về dạng; số liệu đẹp, hợp lý; câu trắc nghiệm có các phương án nhiễu là những sai lầm thường gặp; câu tự luận phải có đáp số cụ thể để đối chiếu.` }],
  });
  if (!out.problems || out.problems.length < slots.length) throw new Error('AI trả về thiếu câu hỏi');
  return slots.map((s, i) => sanitize(out.problems[i], s));
}

/** Ra n bài cùng dạng với bài học sinh làm sai. */
export async function generateSimilar({ grade, problem, n = 3, difficulty, studentAnswer }) {
  const out = await call(ProblemsSchema, {
    effort: 'medium',
    messages: [{ role: 'user', content: `Học sinh lớp ${grade} vừa làm SAI bài sau (chủ đề "${problem.topic_name}"):\n\n${problem.question}\n\nĐáp án đúng: ${problem.final_answer}\nCâu trả lời của em: ${studentAnswer || '(xem phần nhận xét)'}\n\nHãy ra đúng ${n} bài tập CÙNG DẠNG (cùng kiến thức, cùng phương pháp giải, khác số liệu/bối cảnh) để em luyện lại, mức độ ${difficulty}/5 (${DIFF[difficulty]}), hình thức ${problem.kind === 'mcq' ? 'TRẮC NGHIỆM 4 phương án' : 'TỰ LUẬN'}. Bài đầu dễ hơn một chút để em lấy lại tự tin, bài cuối tương đương bài gốc.` }],
  });
  if (!out.problems?.length) throw new Error('AI không trả về bài tương tự');
  return out.problems.slice(0, n).map((p) => sanitize(p, { kind: problem.kind }));
}

/**
 * Chấm bài tự luận từ ảnh chụp vở.
 * @param {{grade:number, problem:object, images:Array<{media_type:string,data:string}>, finalAnswer?:string}} args
 */
export async function gradeEssay({ grade, problem, images, finalAnswer }) {
  const content = [
    ...images.map((img) => ({ type: 'image', source: { type: 'base64', media_type: img.media_type, data: img.data } })),
    { type: 'text', text: `Đây là ảnh chụp bài làm tự luận của một học sinh lớp ${grade}.\n\nĐỀ BÀI:\n${problem.question}\n\nĐÁP ÁN CHUẨN: ${problem.final_answer}\nLỜI GIẢI THAM KHẢO:\n${problem.solution}\n\n${finalAnswer ? `Em tự ghi đáp số cuối cùng là: "${finalAnswer}"\n\n` : ''}Hãy đọc kĩ bài làm và chấm. Bài được tính là ĐÚNG khi đáp số đúng và lập luận hợp lệ (chấp nhận cách giải khác lời giải tham khảo nếu đúng). Nếu ảnh mờ/không phải bài làm của đề này, đặt readable = false và is_correct = false. Với bài đúng, vẫn giải thích vì sao đúng một cách logic. Với bài sai, chỉ ra chính xác bước sai và giảng lại phương pháp.` },
  ];
  return call(GradeSchema, { effort: 'high', messages: [{ role: 'user', content }] });
}

/** Viết nhận xét về tiến bộ của học sinh (dùng cho bảng tiến độ và báo cáo phụ huynh). */
export async function writeComment({ name, grade, stats, audience = 'student' }) {
  const res = await getClient().beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: `Viết nhận xét ngắn (4–6 câu, văn xuôi, không dùng LaTeX hay markdown) ${audience === 'parent' ? `gửi phụ huynh của em ${name}` : `gửi em ${name}`} (lớp ${grade}) dựa trên số liệu học tập sau. Nêu điểm mạnh, điểm cần cải thiện (chỉ rõ chủ đề), và gợi ý cụ thể cho những ngày tới.\n\n${JSON.stringify(stats, null, 1)}` }],
  });
  if (res.stop_reason === 'refusal') throw new Error('refusal');
  return res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
}
