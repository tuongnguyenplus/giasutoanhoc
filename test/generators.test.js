import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRICULUM, getProgress } from '../src/curriculum.js';
import { generateOffline, GENERATORS } from '../src/generators.js';
import { checkAnswer } from '../src/answer.js';

test('mọi chủ đề đều có generator', () => {
  for (const [g, topics] of Object.entries(CURRICULUM))
    for (const t of topics) assert.ok(GENERATORS[t.gen], `lớp ${g} ${t.id} thiếu generator ${t.gen}`);
});

test('sinh bài cho mọi chủ đề × độ khó × hình thức, đáp án tự khớp', () => {
  for (const topics of Object.values(CURRICULUM))
    for (const t of topics)
      for (let d = 1; d <= 5; d++)
        for (const kind of ['mcq', 'essay'])
          for (let rep = 0; rep < 15; rep++) {
            const p = generateOffline(t, d, kind);
            const where = `${t.id} d${d} ${kind}: ${p.question}`;
            assert.ok(p.question && !/undefined|NaN|Infinity/.test(p.question + p.final_answer + p.solution), where + ' | ' + p.final_answer + ' | ' + p.solution);
            assert.ok(checkAnswer(p.answer_key, p.answer_key), 'tự khớp ' + where + ' key=' + p.answer_key);
            if (p.kind === 'mcq') {
              assert.ok(p.choices.length >= 2 && p.correct_index >= 0, where);
              assert.equal(new Set(p.choices).size, p.choices.length, 'trùng phương án ' + where + JSON.stringify(p.choices));
            }
          }
});

test('checkAnswer', () => {
  assert.ok(checkAnswer('2.5', '2,5'));
  assert.ok(checkAnswer('3/4', '0,75'));
  assert.ok(checkAnswer('2; 3', 'x = 3, y = 2'));
  assert.ok(checkAnswer('1000000', '1.000.000'));
  assert.ok(checkAnswer('12345', '12 345'));
  assert.ok(checkAnswer('-1; 4', 'x1 = -1; x2 = 4'));
  assert.ok(!checkAnswer('2; 3', '2'));
  assert.ok(!checkAnswer('5', '6'));
  assert.ok(checkAnswer('góc tù', 'Góc tù'));
});

test('tiến độ theo tuần', () => {
  const p = getProgress(6, '2026-09-05', '2026-11-18');
  assert.equal(p.week, 11);
  assert.equal(p.current.id, '6-4');
  const s = getProgress(6, '2025-09-05', '2026-07-20');
  assert.equal(s.phase, 'summer');
});
