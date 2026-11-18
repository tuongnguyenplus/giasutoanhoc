import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORD_PROBLEMS, pickWordProblem } from '../src/wordproblems.js';
import { CURRICULUM } from '../src/curriculum.js';
import { generateOffline, GENERATORS } from '../src/generators.js';
import { checkAnswer } from '../src/answer.js';

const fmt = (x) => {
  const [i, f] = String(Math.abs(Math.round(x * 1e4) / 1e4)).split('.');
  const ip = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i;
  return (x < 0 ? '-' : '') + ip + (f ? ',' + f : '');
};

test('mọi mẫu bài có lời văn sinh được, số liệu hợp lệ, lời giải khớp đáp án', () => {
  for (const w of WORD_PROBLEMS) {
    for (const gen of w.gens) assert.ok(GENERATORS[gen], `${w.id}: gen ${gen} không tồn tại`);
    let ok = 0;
    for (let i = 0; i < 300; i++) {
      const g = w.grades[0] + (i % (w.grades[1] - w.grades[0] + 1));
      const d = w.d[0] + (i % (w.d[1] - w.d[0] + 1));
      const out = w.make(d, g);
      if (!out) continue;
      ok++;
      const all = out.q + out.sol + out.ans + out.tex + out.method;
      assert.ok(!/NaN|undefined|Infinity|\[object/.test(all), `${w.id}: ${all}`);
      assert.ok(checkAnswer(String(out.ans), String(out.ans)), `${w.id}: đáp án tự khớp ${out.ans}`);
      for (const part of String(out.ans).split(/;\s*/)) {
        if (part.includes(':') || /[a-zà-ỹ]/i.test(part) || !/\d/.test(part)) continue;
        const want = part.includes('/') ? part : fmt(Number(part));
        assert.ok(out.sol.includes(want), `${w.id}: lời giải không chứa đáp số ${want}\n${out.q}\n${out.sol}`);
      }
      if (w.grades[0] <= 5) assert.ok(String(out.ans).split(/;\s*/).every((x) => x.includes(':') || /[a-zà-ỹ]/i.test(x) || !/\d/.test(x) || eval(x) >= 0), `${w.id}: tiểu học không có số âm: ${out.ans}`);
    }
    assert.ok(ok >= 100, `${w.id}: chỉ sinh được ${ok}/300 lần`);
  }
});

test('đề tự luận ưu tiên bài có lời văn khi chủ đề có mẫu phù hợp', () => {
  let covered = 0, total = 0;
  for (const [grade, topics] of Object.entries(CURRICULUM)) {
    for (const t of topics) {
      total++;
      if (pickWordProblem(t, Number(grade), 4) || pickWordProblem(t, Number(grade), 5)) covered++;
      const p = generateOffline(t, 5, 'essay', { thinking: true });
      assert.equal(p.kind, 'essay');
    }
  }
  assert.ok(covered / total > 0.6, `chỉ ${covered}/${total} chủ đề có bài lời văn`);
  console.log(`  chủ đề có bài lời văn: ${covered}/${total}`);
});
