import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateSpecialsHistory, gitBlobSha } from '../.github/scripts/specials-sync.mjs';

const sp = (over = {}) => ({ name: 'La Figata', desc: 'Sausage and provolone.', price: '15.95', veg: false, photo: 'assets/specials/toast-la-figata.jpg', photoBlob: 'abc123', ...over });

test('records a special the first time it is published', () => {
  const h = updateSpecialsHistory([], [sp()], '2026-08-05');
  assert.equal(h.length, 1);
  assert.equal(h[0].firstSeen, '2026-08-05');
  assert.equal(h[0].lastSeen, '2026-08-05');
  assert.equal(h[0].name, 'La Figata');
  assert.equal(h[0].photoBlob, 'abc123');
});

test('a special running again moves lastSeen, does not duplicate', () => {
  const first = updateSpecialsHistory([], [sp()], '2026-08-05');
  const second = updateSpecialsHistory(first, [sp()], '2026-08-12');
  assert.equal(second.length, 1);
  assert.equal(second[0].firstSeen, '2026-08-05');
  assert.equal(second[0].lastSeen, '2026-08-12');
});

test('the veg glyph is not a new dish', () => {
  const first = updateSpecialsHistory([], [sp({ desc: 'Eggs and toast.' })], '2026-07-17');
  const second = updateSpecialsHistory(first, [sp({ desc: 'Eggs and toast.🥬', veg: true })], '2026-07-20');
  assert.equal(second.length, 1, 'adding 🥬 must not create a second entry');
  assert.equal(second[0].lastSeen, '2026-07-20');
  assert.equal(second[0].veg, true);
});

test('a real wording change is a new entry', () => {
  const first = updateSpecialsHistory([], [sp({ name: 'the Chris Benoit', desc: 'French Bread, burnt pastry cream.' })], '2026-07-24');
  const second = updateSpecialsHistory(first, [sp({ name: 'the Chris Benoit', desc: 'Sourdough Bread, burnt pastry cream.' })], '2026-07-29');
  assert.equal(second.length, 2);
});

test('a photo arriving later is backfilled onto the existing entry', () => {
  const first = updateSpecialsHistory([], [sp({ photo: '', photoBlob: '' })], '2026-08-05');
  assert.equal(first[0].photoBlob, '');
  const second = updateSpecialsHistory(first, [sp()], '2026-08-06');
  assert.equal(second.length, 1);
  assert.equal(second[0].photo, 'assets/specials/toast-la-figata.jpg');
  assert.equal(second[0].photoBlob, 'abc123');
});

test('existing entries are never mutated in place', () => {
  const first = updateSpecialsHistory([], [sp()], '2026-08-05');
  const snapshot = JSON.parse(JSON.stringify(first));
  updateSpecialsHistory(first, [sp()], '2026-08-12');
  assert.deepEqual(first, snapshot, 'input array must not be mutated');
});

test('tolerates a missing or malformed prior history', () => {
  assert.equal(updateSpecialsHistory(undefined, [sp()], '2026-08-05').length, 1);
  assert.equal(updateSpecialsHistory(null, [sp()], '2026-08-05').length, 1);
  assert.equal(updateSpecialsHistory('not an array', [sp()], '2026-08-05').length, 1);
});

test('several specials in one run all get recorded', () => {
  const h = updateSpecialsHistory([], [sp(), sp({ name: 'The Cuban', desc: 'Ham and pork.' })], '2026-08-05');
  assert.deepEqual(h.map((e) => e.name), ['La Figata', 'The Cuban']);
});

test('gitBlobSha matches git hash-object', () => {
  // `printf 'hello' | git hash-object --stdin` -> b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0
  assert.equal(gitBlobSha(Buffer.from('hello')), 'b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0');
  // empty blob is a well-known constant
  assert.equal(gitBlobSha(Buffer.alloc(0)), 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391');
});
