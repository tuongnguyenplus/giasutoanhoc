// Hàm tiện ích dùng chung cho các ngân hàng bài có lời văn.

export const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const lcm = (a, b) => (a * b) / gcd(a, b);
export const rd = (x, k = 2) => Math.round(x * 10 ** k) / 10 ** k;
export const C = (n, k) => { let x = 1; for (let i = 0; i < k; i++) x = (x * (n - i)) / (i + 1); return x; };

/** Số dạng văn bản Việt Nam: 23,8 · 12 500 */
export function n(x) {
  if (typeof x !== 'number') return String(x);
  const neg = x < 0;
  const [i, f] = String(Math.abs(rd(x, 4))).split('.');
  const ip = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i;
  return (neg ? '-' : '') + ip + (f ? ',' + f : '');
}
/** Số trong LaTeX */
export const t = (x) => n(x).replace(',', '{,}').replace(/ /g, '\\,');
export const u = (x, unit) => `${t(x)}\\text{ ${unit}}`;
export const parts = (...xs) => xs.map((x, i) => `\\text{${'abcd'[i]}) }${x}`).join(';\\ ');
export const fr = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
export const ftex = ([a, b]) => (b === 1 ? `${a}` : `\\frac{${a}}{${b}}`);
export const fstr = ([a, b]) => (b === 1 ? `${a}` : `${a}/${b}`);
export const NAME = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Lan', 'Minh', 'Nam', 'Ngọc', 'Phong', 'Quân', 'Trang', 'Vy', 'Hùng', 'Mai'];
export const two = () => { const a = pick(NAME); return [a, pick(NAME.filter((x) => x !== a))]; };
export const solve = (...lines) => ['Bài giải', ...lines].join('\n');
