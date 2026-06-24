import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTreeEntries } from '../apps-script/lib/github.js';

test('buildTreeEntries maps files to git tree entries', () => {
  const entries = buildTreeEntries([
    { path: 'data.js', sha: 'aaa' },
    { path: 'assets/specials/week-2026-06-23-1.jpg', sha: 'bbb' },
    { path: 'assets/specials/week-2026-06-23-2.jpg', sha: 'ccc' },
  ]);
  assert.equal(entries.length, 3);
  assert.deepEqual(entries[0], { path: 'data.js', mode: '100644', type: 'blob', sha: 'aaa' });
  assert.equal(entries[2].path, 'assets/specials/week-2026-06-23-2.jpg');
  assert.equal(entries[2].mode, '100644');
});
