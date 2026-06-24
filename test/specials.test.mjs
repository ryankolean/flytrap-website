import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSpecialsBlock, spliceSpecials } from '../apps-script/lib/specials.js';

test('buildSpecialsBlock renders two specials with photo paths', () => {
  const out = buildSpecialsBlock({
    weekOf: 'Week of June 23',
    specials: [
      { name: 'The Jack Soo', desc: 'Miso eggs.', veg: false, photo: 'assets/specials/week-2026-06-23-1.jpg' },
      { name: 'The Tenby', desc: 'Full Welsh.', veg: true, photo: 'assets/specials/week-2026-06-23-2.jpg', price: '14.95' },
    ],
  });
  assert.match(out, /\/\* SPECIALS:START \*\//);
  assert.match(out, /\/\* SPECIALS:END \*\//);
  assert.match(out, /weekOf: "Week of June 23"/);
  assert.match(out, /id: "special-1"/);
  assert.match(out, /id: "special-2"/);
  assert.match(out, /name: "The Jack Soo"/);
  assert.match(out, /veg: true/);
  assert.match(out, /price: "14\.95"/);
  assert.match(out, /photo: "assets\/specials\/week-2026-06-23-2\.jpg"/);
  assert.doesNotMatch(out.split('special-2')[0], /price:/);
});

test('buildSpecialsBlock escapes quotes and backslashes', () => {
  const out = buildSpecialsBlock({
    weekOf: 'Week of X',
    specials: [
      { name: 'The "Quote"', desc: 'a\\b "c"', veg: false, photo: 'p1.jpg' },
      { name: 'B', desc: 'd', veg: false, photo: 'p2.jpg' },
    ],
  });
  assert.match(out, /name: "The \\"Quote\\""/);
  assert.match(out, /desc: "a\\\\b \\"c\\""/);
});

const SAMPLE = [
  'window.FT_DATA = {',
  '  menuCategories: [],',
  '  /* SPECIALS:START */',
  '  sourcePost: "old",',
  '  weekOf: "Week of June 2",',
  '  specials: [ { id: "special-1" } ],',
  '  /* SPECIALS:END */',
  '  soup: { name: "x" },',
  '};',
].join('\n');

test('spliceSpecials replaces only the marked region', () => {
  const out = spliceSpecials(SAMPLE, '  /* SPECIALS:START */\n  NEW\n  /* SPECIALS:END */');
  assert.match(out, /menuCategories: \[\],/);
  assert.match(out, /soup: \{ name: "x" \},/);
  assert.match(out, /\n  NEW\n/);
  assert.doesNotMatch(out, /sourcePost: "old"/);
});

test('spliceSpecials throws when markers are missing', () => {
  assert.throws(() => spliceSpecials('no markers here', 'X'), /markers/i);
});
